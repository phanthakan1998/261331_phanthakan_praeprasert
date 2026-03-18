import {
  Cart,
  CreateCartRequest,
} from "../../infrastructure/common/types/cart.type";

export interface CartRepository {
  findById(id: string): Promise<Cart | null>;
  findByUserId(userId: string): Promise<Cart | null>;
  create(request: CreateCartRequest): Promise<Cart>;
  getAllCarts(): Promise<Cart[]>;
}
