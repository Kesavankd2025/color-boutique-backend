import { Router } from "express";
import { RegisterWebSiteUserRoute } from "./website/user.route";
import { RegisterWebSiteOrderRoute } from "./website/order.route";
import { RegisterCartRoute } from "./mobile-app/cart.route";
import { RegisterCategoryRoute } from "./mobile-app/category.route";
import { RegisterNewProductRoute } from "./mobile-app/product.route";

import { newMobileUserRepository } from "../../infrastructure/Repository/mobile-app/user.repository";
import { newCartRepository } from "../../infrastructure/Repository/mobile-app/cart.repository";
import { NewMobileAuthRegister } from "../middleware/mobile.user.middleware";
import { MobileAuthMiddlewareService } from "../middleware/mobile.user.service";
import { newCategoryRepository } from "../../infrastructure/Repository/mobile-app/category.repository";
import { NewProductRepoistory } from "../../infrastructure/Repository/mobile-app/product.repository";


// Website routes are disabled/deprecated in favor of using mobile-app routes.
// export function WebsiteRoute(router: Router, db: any) {
//     const userRepo = newMobileUserRepository(db);
//     // Reuse mobile auth middleware for now
//     const authService = MobileAuthMiddlewareService(userRepo);
//     const middleware = NewMobileAuthRegister(authService);
//
//     // Auth & User Routes
//     RegisterWebSiteUserRoute(router, userRepo, middleware.ValidateUser);
//
//     // Order Route
//     RegisterWebSiteOrderRoute(router, middleware.ValidateUser);
//
//     // Cart Routes (Reusing existing registration from mobile-app/cart.route.ts which points to website handlers)
//     // RegisterCartRoute expects ICartRepository (which CartRepository implements)
//     RegisterCartRoute(router, newCartRepository(db), middleware.ValidateUser);
//
//     // Reuse other routes for data fetching if needed (Category, Product)
//     // The user requested specifically for Auth, Cart, Checkout. But website likely needs products too.
//     RegisterCategoryRoute(router, newCategoryRepository(db), middleware.ValidateUser);
//     RegisterNewProductRoute(router, NewProductRepoistory(db), middleware.ValidateUser);
// }
export function WebsiteRoute(router: any, db: any) { }
