
import { ErrorResponse } from "../../api/response/cmmonerror";
import { PaginationResult } from "../../api/response/paginationResponse";

export interface BannerListParams {
    limit: number;
    page: number;
    search?: string;
}

export interface BannerDomainRepository {
    getBannerList(params: BannerListParams): Promise<PaginationResult<any> | ErrorResponse>;
}
