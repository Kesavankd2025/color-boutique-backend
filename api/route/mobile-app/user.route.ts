import { Router } from "express";
import { IMobileUserRepository } from "../../../domain/mobile-app/user.domain";
import { mobileUserServiceFun } from "../../../app/service/mobile-app/user.service";
import { UserHandlerFun } from "../../../app/handler/mobile-app/user.handler";
import { newCartRepository } from "../../../infrastructure/Repository/mobile-app/cart.repository";

export function RegisterMobileUserRoute(
  router: Router,
  adminRepo: IMobileUserRepository,
  middleware: any,
  db: any
) {
  const service = mobileUserServiceFun(adminRepo); // Pass repository to service
  const cartRepo = newCartRepository(db);
  const handler = UserHandlerFun(service, cartRepo); // Pass service and cartRepo to handler

  router.post("/user", handler.createUser); // Define route
  router.put("/otp-verification", handler.otpVerification); // Define route
  router.put("/update-pin", handler.addPin); // Define route
  router.post("/login", handler.loginUser); // Define route
  router.post("/change-password", handler.changePassword);
  router.put("/update-user/:id", handler.updateUser);
  router.get('/user/:id', handler.userData)
}
