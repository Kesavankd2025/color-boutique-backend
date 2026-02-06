import { Request, Response } from "express";
import { ReportRepositoryDomain } from "../../../infrastructure/Repository/Admin/report.repository";
import { StatusCodes } from "http-status-codes";
import { sendErrorResponse, sendResponse } from "../../../utils/common/commonResponse";

class ReportHandler {
    private readonly reportRepo: ReportRepositoryDomain;

    constructor(repo: ReportRepositoryDomain) {
        this.reportRepo = repo;
    }

    getProductPerformance = async (req: Request, res: Response): Promise<any> => {
        try {
            const { fromDate, toDate, productId } = req.query;
            const result = await this.reportRepo.getProductPerformance({ fromDate, toDate, productId });
            return sendResponse(res, result);
        } catch (error) {
            return sendErrorResponse(res, StatusCodes.INTERNAL_SERVER_ERROR, 'Internal Server Error', 'INTERNAL_ERROR');
        }
    }

    getCustomerReport = async (req: Request, res: Response): Promise<any> => {
        try {
            const { fromDate, toDate, customerId } = req.query;
            const result = await this.reportRepo.getCustomerReport({ fromDate, toDate, customerId });
            return sendResponse(res, result);
        } catch (error) {
            return sendErrorResponse(res, StatusCodes.INTERNAL_SERVER_ERROR, 'Internal Server Error', 'INTERNAL_ERROR');
        }
    }
}

export function NewReportHandler(repo: ReportRepositoryDomain): ReportHandler {
    return new ReportHandler(repo);
}
