import { ApiResponse, ErrorResponse, SuccessMessage } from '../../api/response/commonResponse';
import { CreateOrderInput } from '../../api/Request/order';

export interface IOrderRepository {
    create(input: CreateOrderInput, userId: string): Promise<ApiResponse<SuccessMessage> | ErrorResponse>;
}
