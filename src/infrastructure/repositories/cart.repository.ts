import { CartRepository } from "../../domain/repositories/cart.repository";
import { Cart, CreateCartRequest } from "../common/types/cart.type";

const cartsData = require("../../mock-data/carts.json");

const generateId = (prefix?: string): string => {
  const rand = Math.random().toString(36).slice(2, 10);
  return prefix ? `${prefix}-${rand}` : rand;
};

export class MockCartRepository implements CartRepository {
  private carts: Cart[] = cartsData.carts.map((item: any) => ({
    id: item.id,
    userId: item.userId,
    items: item.items,
    createdAt: new Date(),
    updatedAt: new Date(),
  }));

  async findById(id: string): Promise<Cart | null> {
    return this.carts.find((item) => item.id === id) || null;
  }

  async findByUserId(userId: string): Promise<Cart | null> {
    return this.carts.find((item) => item.userId === userId) || null;
  }

  async create(req: CreateCartRequest): Promise<Cart> {
    const cart: Cart = {
      id: generateId("cart"),
      userId: req.userId,
      items: req.items.map((item) => ({ id: generateId("item"), ...item })),
      createdAt: new Date(),
      updatedAt: new Date(),
    };
    this.carts.push(cart);
    return cart;
  }

  async getAllCarts(): Promise<Cart[]> {
    return this.carts;
  }
}
