import { Request, Response } from "express";

import { StatusCodes } from "http-status-codes";
import { MobileUserServiceDomain } from "../../../domain/website/user.domain";
import { ICartRepository } from "../../../domain/website/cart.domain";
import {
  CreateUserInput,
  createWebsiteUserSchema,
  LoginWebsiteInput,
  loginWebsiteUserSchema,
} from "../../../api/Request/website.user";
export class UserHandler {
  private userService: MobileUserServiceDomain;
  private cartRepo: ICartRepository;

  constructor(userService: MobileUserServiceDomain, cartRepo: ICartRepository) {
    this.userService = userService;
    this.cartRepo = cartRepo;
  }

  createUser = async (req: Request, res: Response): Promise<any> => {
    try {
      const parsed = createWebsiteUserSchema.safeParse(req.body);
      if (!parsed.success) {
        return res
          .status(StatusCodes.BAD_REQUEST)
          .json({ errors: parsed.error.errors });
      }
      const data: CreateUserInput = parsed.data;
      const result = await this.userService.createUser(data);
      if (result.status === "error") {
        return res.status(StatusCodes.BAD_REQUEST).json(result);
      }
      return res.status(StatusCodes.CREATED).json(result);
    } catch (err: any) {
      return res
        .status(StatusCodes.INTERNAL_SERVER_ERROR)
        .json({ error: err.message });
    }
  };
  loginUser = async (req: Request, res: Response): Promise<any> => {
    try {
      const parsed = loginWebsiteUserSchema.safeParse(req.body);
      if (!parsed.success) {
        return res
          .status(StatusCodes.BAD_REQUEST)
          .json({ errors: parsed.error.errors });
      }
      console.log(parsed, "parsed");
      const data: any = parsed.data;
      const result = await this.userService.loginUser(data);
      if (result.status === "error") {
        return res.status(StatusCodes.UNAUTHORIZED).json(result);
      }

      // Merge carts if guestUserId is provided
      if (req.body.guestUserId) {
        await this.cartRepo.mergeCarts(result.data.user._id, req.body.guestUserId);
      }

      return res.status(StatusCodes.OK).json(result);
    } catch (err: any) {
      return res
        .status(StatusCodes.INTERNAL_SERVER_ERROR)
        .json({ error: err.message });
    }
  };
  updateUser = async (req: Request, res: Response): Promise<any> => {
    try {
      const parsed = createWebsiteUserSchema.safeParse(req.body);
      if (!parsed.success) {
        return res
          .status(StatusCodes.BAD_REQUEST)
          .json({ errors: parsed.error.errors });
      }
      const data: CreateUserInput = parsed.data;
      const result = await this.userService.createUser(data);
      if (result.status === "error") {
        return res.status(StatusCodes.BAD_REQUEST).json(result);
      }
      return res.status(StatusCodes.CREATED).json(result);
    } catch (err: any) {
      return res
        .status(StatusCodes.INTERNAL_SERVER_ERROR)
        .json({ error: err.message });
    }
  };
}

export function UserHandlerFun(service: MobileUserServiceDomain, cartRepo: ICartRepository): UserHandler {
  return new UserHandler(service, cartRepo);
}
