import { Router } from "express";
import { BannerDomainRepository } from "../../../domain/mobile-app/bannerDomain";
import { newBannerService } from "../../../app/service/mobile-app/banner.service";
import { BannerHandlerFun } from "../../../app/handler/mobile-app/banner.handler";

export function RegisterBannerRoute(
    router: Router,
    repo: BannerDomainRepository,
    middleware: any
) {
    const service = newBannerService(repo);
    const handler = BannerHandlerFun(service);

    // Website/Mobile only needs list
    router.get("/banner", handler.getBannerList);
}
