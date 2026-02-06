import { StatusCodes } from "http-status-codes";
import { BannerListParams, BannerDomainRepository } from "../../../domain/mobile-app/bannerDomain";
import { ErrorResponse } from "../../../api/response/cmmonerror";
import Pagination, { PaginationResult } from "../../../api/response/paginationResponse";
import { successResponse } from "../../../utils/common/commonResponse";
import { createErrorResponse } from "../../../utils/common/errors";
import BannerModel from "../../../app/model/BannersModel";

class BannerRepository implements BannerDomainRepository {
    private readonly db: any;

    constructor(db: any) {
        this.db = db;
    }

    async getBannerList(params: BannerListParams): Promise<PaginationResult<any> | ErrorResponse> {
        try {
            const { page, limit, search } = params;

            const query: any = {};
            query.isDelete = false;
            query.isActive = true;
            if (search) {
                query.name = { $regex: search, $options: "i" };
            }

            const banners = await BannerModel.find(query)
                .limit(limit)
                .skip(page * limit)
                .sort({ createdAt: -1 });

            const totalCount = await BannerModel.countDocuments(query);
            return Pagination(totalCount, banners, limit, page);
        } catch (error: any) {
            return createErrorResponse(
                'Error retrieving Banner details',
                StatusCodes.INTERNAL_SERVER_ERROR,
                error.message
            );
        }
    }
}

export function newBannerRepository(db: any): BannerDomainRepository {
    return new BannerRepository(db);
}
