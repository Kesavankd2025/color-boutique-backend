import { BannerListParams, BannerDomainRepository } from "../../../domain/mobile-app/bannerDomain";
import { ApiResponse } from "../../../api/response/commonResponse";
import { ErrorResponse } from "../../../api/response/cmmonerror";
import { PaginationResult } from "../../../api/response/paginationResponse";

export interface BannerService {
    getBannerList(params: BannerListParams): Promise<PaginationResult<any> | ErrorResponse>;
}

class BannerServiceDefault implements BannerService {
    constructor(private repo: BannerDomainRepository) { }

    async getBannerList(params: BannerListParams): Promise<PaginationResult<any> | ErrorResponse> {
        return this.repo.getBannerList(params);
    }
}

export function newBannerService(repo: BannerDomainRepository): BannerService {
    return new BannerServiceDefault(repo);
}
