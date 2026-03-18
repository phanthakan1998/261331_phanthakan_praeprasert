import { Request, Response } from "express";
import cartService from "../../services/cart.service";
import {
  sendSuccess,
  sendCreated,
  sendNotFound,
  sendBadRequest,
} from "../../infrastructure/common/utils/response.util";

export const getCartById = async (request: Request, response: Response) => {
  try {
    const cart = await cartService.getCartById(request.params.id as string);
    if (!cart.data) return sendNotFound(response, "Cart");
    return sendSuccess(response, cart, "Cart retrieved");
  } catch (error) {
    return sendBadRequest(response, (error as Error).message);
  }
};

export const createCart = async (request: Request, response: Response) => {
  try {
    const cart = await cartService.createCart(request.body);
    return sendCreated(response, cart, "Cart created");
  } catch (error) {
    return sendBadRequest(response, (error as Error).message);
  }
};

export const getAllCarts = async (_: Request, response: Response) => {
  try {
    const carts = await cartService.getAllCarts();
    return sendSuccess(response, carts, "Carts retrieved");
  } catch (e) {
    return sendBadRequest(response, (e as Error).message);
  }
};

export default { getCartById, createCart, getAllCarts };
