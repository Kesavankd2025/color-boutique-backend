import { Request, Response } from "express";
import { CreateOrderInput, createOrderSchema } from "../../../api/Request/order";
import { StatusCodes } from "http-status-codes";
import { IOrderRepository } from "../../../domain/website/order.domain";

export class OrderHandler {
    private orderRepo: IOrderRepository;

    constructor(orderRepo: IOrderRepository) {
        this.orderRepo = orderRepo;
    }

    createOrder = async (req: Request & { user: any }, res: Response): Promise<any> => {
        try {
            const parsed = createOrderSchema.safeParse(req.body);

            if (!parsed.success) {
                return res
                    .status(StatusCodes.BAD_REQUEST)
                    .json({ errors: parsed.error.errors });
            }

            const data: CreateOrderInput = parsed.data;
            // Assuming middleware populates req.user
            // website user ID is usually in req.user._id (from decoded token)
            // Check how middleware sets user. 
            // Based on existing code, admin user is req.user._id, mobile user is likely similar.
            const userId = req?.user?._id;

            if (!userId) {
                return res.status(StatusCodes.UNAUTHORIZED).json({ message: "User not authenticated" });
            }

            const result = await this.orderRepo.create(data, userId);

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

export function OrderHandlerFun(orderRepo: IOrderRepository): OrderHandler {
    return new OrderHandler(orderRepo);
}
