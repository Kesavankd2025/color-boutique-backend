import { Router } from "express";
import { ReportRepositoryDomain } from "../../../infrastructure/Repository/Admin/report.repository";
import { NewReportHandler } from "../../../app/handler/admin.handler/report.handler";

export function RegisterReportRoute(router: Router, repo: ReportRepositoryDomain, authMiddleware: any) {
    const handler = NewReportHandler(repo);

    router.get('/report/product-performance', authMiddleware, handler.getProductPerformance);
    router.get('/report/customer', authMiddleware, handler.getCustomerReport);
}
