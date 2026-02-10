import { Router } from "express";
import { OrderHandlerFun } from "../../../app/handler/website.handler/order.handler";
// Reusing mobile repository as planned
import { OrderRepository } from "../../../infrastructure/Repository/mobile-app/order.repository";
import mongoose from "mongoose";

export function RegisterWebSiteOrderRoute(
    router: Router,
    middleware: any
) {
    const orderRepo = new OrderRepository(mongoose.connection);
    const handler = OrderHandlerFun(orderRepo);

    router.post("/checkout", middleware, handler.createOrder);
}
