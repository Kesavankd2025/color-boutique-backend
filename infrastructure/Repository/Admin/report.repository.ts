import { StatusCodes } from "http-status-codes";
import { Types } from "mongoose";
import { ErrorResponse } from "../../../api/response/cmmonerror";
import { ApiResponse, SuccessMessage } from "../../../api/response/commonResponse";
import { createErrorResponse } from "../../../utils/common/errors";
import { successResponse } from "../../../utils/common/commonResponse";
import { ProductModel } from "../../../app/model/product";
import { OrderModel } from "../../../app/model/order";
import Vendorpurchase from "../../../app/model/vendor.purchase";

export interface ReportRepositoryDomain {
    getProductPerformance(params: any): Promise<ApiResponse<any> | ErrorResponse>;
    getCustomerReport(params: any): Promise<ApiResponse<any> | ErrorResponse>;
}

class ReportRepository implements ReportRepositoryDomain {
    private readonly db: any;

    constructor(db: any) {
        this.db = db;
    }

    async getProductPerformance(params: any): Promise<ApiResponse<any> | ErrorResponse> {
        try {
            const { fromDate, toDate, productId } = params;
            const matchStage: any = {};

            if (fromDate && toDate) {
                matchStage.createdAt = {
                    $gte: new Date(fromDate),
                    $lte: new Date(toDate)
                };
            }

            // 1. Aggregation for Vendor Purchases (Inward)
            const purchasePipeline: any[] = [
                { $match: matchStage },
                { $unwind: "$products" },
                {
                    $group: {
                        _id: "$products.id",
                        totalPurchasedQty: { $sum: "$products.quantity" },
                        totalPurchasedCost: { $sum: { $multiply: ["$products.quantity", "$products.buyingPrice"] } }
                    }
                }
            ];

            if (productId) {
                purchasePipeline.unshift({ $match: { "products.id": new Types.ObjectId(productId) } });
            }

            const purchaseStats = await Vendorpurchase.aggregate(purchasePipeline);

            // 2. Aggregation for Customer Sales (Outward)
            const salesPipeline: any[] = [
                {
                    $match: {
                        ...matchStage,
                        status: { $nin: ['cancelled', 'return-approved'] }, // Exclude cancelled/returned
                        isActive: true
                    }
                },
                { $unwind: "$items" },
                {
                    $group: {
                        _id: "$items.productId",
                        totalSoldQty: { $sum: "$items.quantity" },
                        totalRevenue: { $sum: { $multiply: ["$items.quantity", "$items.unitPrice"] } }
                    }
                }
            ];

            if (productId) {
                salesPipeline.unshift({ $match: { "items.productId": new Types.ObjectId(productId) } });
            }

            const salesStats = await OrderModel.aggregate(salesPipeline);

            // 3. Merge Data with Product Details
            const productsQuery: any = { isActive: true, isDelete: false };
            if (productId) {
                productsQuery._id = new Types.ObjectId(productId);
            }
            const allProducts = await ProductModel.find(productsQuery).select('productName productCode productImage');

            const report = allProducts.map(prod => {
                const pStats = purchaseStats.find(p => p._id.toString() === prod._id.toString());
                const sStats = salesStats.find(s => s._id.toString() === prod._id.toString());

                return {
                    _id: prod._id,
                    productName: prod.productName,
                    productCode: prod.productCode,
                    productImage: prod.productImage && prod.productImage.length > 0 ? prod.productImage[0] : null,
                    purchasedQty: pStats?.totalPurchasedQty || 0,
                    purchasedCost: pStats?.totalPurchasedCost || 0,
                    soldQty: sStats?.totalSoldQty || 0,
                    soldRevenue: sStats?.totalRevenue || 0,
                    profit: (sStats?.totalRevenue || 0) - (pStats?.totalPurchasedCost || 0) // Simplified profit
                };
            });

            // Filter out products with no activity if needed, or return all
            // For now returning all to show inventory status potentially

            return successResponse("Product performance report retrieved", StatusCodes.OK, report);

        } catch (error: any) {
            return createErrorResponse(
                'Error generating report',
                StatusCodes.INTERNAL_SERVER_ERROR,
                error.message
            );
        }
    }

    async getCustomerReport(params: any): Promise<ApiResponse<any> | ErrorResponse> {
        try {
            const { fromDate, toDate, customerId } = params;
            const matchStage: any = {
                placedByModel: 'User', // Assuming 'User' is customer
                isActive: true
            };

            if (fromDate && toDate) {
                matchStage.createdAt = {
                    $gte: new Date(fromDate),
                    $lte: new Date(toDate)
                };
            }

            if (customerId) {
                matchStage.placedBy = new Types.ObjectId(customerId);
            }

            const pipeline: any[] = [
                { $match: matchStage },
                {
                    $group: {
                        _id: "$placedBy",
                        totalOrders: { $sum: 1 },
                        totalSpent: { $sum: "$totalAmount" },
                        lastOrderDate: { $max: "$createdAt" }
                    }
                },
                {
                    $lookup: {
                        from: "users", // Assuming users collection
                        localField: "_id",
                        foreignField: "_id",
                        as: "userDetails"
                    }
                },
                {
                    $unwind: "$userDetails"
                },
                {
                    $project: {
                        _id: 1,
                        name: "$userDetails.name",
                        email: "$userDetails.email",
                        phone: "$userDetails.phoneNumber", // Adjust based on User model
                        totalOrders: 1,
                        totalSpent: 1,
                        lastOrderDate: 1
                    }
                }
            ];

            const report = await OrderModel.aggregate(pipeline);
            return successResponse("Customer report retrieved", StatusCodes.OK, report);

        } catch (error: any) {
            return createErrorResponse(
                'Error generating customer report',
                StatusCodes.INTERNAL_SERVER_ERROR,
                error.message
            );
        }
    }
}

export function NewReportRepository(db: any): ReportRepositoryDomain {
    return new ReportRepository(db);
}
