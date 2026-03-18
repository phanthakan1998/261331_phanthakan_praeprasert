import { Request, Response } from "express";
import cartService from "../../services/cart.service";
import {
  sendSuccess,
  sendCreated,
  sendNotFound,
  sendBadRequest,
} from "../../infrastructure/common/utils/response.util";
import loggerService from "../../services/logger.service";

export const getCartById = async (request: Request, response: Response) => {
  loggerService.start(request);

  try {
    const cart = await cartService.getCartById(request.params.id as string);

    if (!cart.data) {
      loggerService.info(`Cart not found: ${request.params.id}`);
      return sendNotFound(response, "Cart");
    }

    loggerService.end(request);
    return sendSuccess(response, cart, "Get cart");
  } catch (error) {
    const message =
      error instanceof Error ? error.message : "Unknown error occurred";

    loggerService.error(message);
    return sendBadRequest(response, message);
  }
};

export const createCart = async (request: Request, response: Response) => {
  loggerService.start(request);
  try {
    const cart = await cartService.createCart(request.body);
    loggerService.end(request);
    return sendCreated(response, cart, "Cart created");
  } catch (error) {
    const message =
      error instanceof Error ? error.message : "Unknown error occurred";

    loggerService.error(message);
    return sendBadRequest(response, message);
  }
};

export const getAllCarts = async (request: Request, response: Response) => {
  loggerService.start(request);
  try {
    const carts = await cartService.getAllCarts();
    loggerService.end(request);
    return sendSuccess(response, carts, "Carts retrieved");
  } catch (error) {
    const message =
      error instanceof Error ? error.message : "Unknown error occurred";

    loggerService.error(message);
    return sendBadRequest(response, message);
  }
};

export default { getCartById, createCart, getAllCarts };
