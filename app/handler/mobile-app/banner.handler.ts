import { Request, Response } from "express";
import { BannerService } from "../../service/mobile-app/banner.service";
import { StatusCodes } from "http-status-codes";
import { BannerListParams } from "../../../domain/mobile-app/bannerDomain";

export function BannerHandlerFun(service: BannerService) {
    return {
        async getBannerList(req: Request, res: Response) {
            try {
                const params: BannerListParams = {
                    page: Number(req.query.page) || 0,
                    limit: Number(req.query.limit) || 10,
                    search: req.query.search as string
                };
                const result = await service.getBannerList(params);
                if ('status' in result && result.status === 'error') {
                    // It's an ErrorResponse
                    res.status(StatusCodes.NOT_FOUND).json(result);
                } else {
                    // It's a PaginationResult (which is just an object, not ApiResponse wrapped usually, but checking implementation)
                    // Pagination returns { status, statusCode, response: { data, total, ... } }
                    res.status(StatusCodes.OK).json(result);
                }
            } catch (error: any) {
                res.status(StatusCodes.INTERNAL_SERVER_ERROR).json({
                    status: 'error',
                    statusCode: StatusCodes.INTERNAL_SERVER_ERROR,
                    message: error.message
                });
            }
        }
    }
}
