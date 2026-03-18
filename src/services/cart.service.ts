import { HTTP_RESPONSE_CODE } from "../infrastructure/common/enums/response.enum";
import {
  Cart,
  CreateCartRequest,
} from "../infrastructure/common/types/cart.type";
import { ResponseCommonType } from "../infrastructure/common/types/response-common.type";
import { MockCartRepository } from "../infrastructure/repositories/cart.repository";
import loggerService from "./logger.service";

const cartRepository = new MockCartRepository();

export const getCartById = async (
  id: string,
): Promise<ResponseCommonType<Cart | null>> => {
  try {
    loggerService.info("GetCart");
    loggerService.debug("GetCart for cartId", id);
    const cart = await cartRepository.findById(id);
    if (!cart) {
      return {
        status: HTTP_RESPONSE_CODE.NOT_FOUND,
        data: null,
      };
    }
    return {
      status: HTTP_RESPONSE_CODE.OK,
      data: cart,
    };
  } catch (error) {
    return {
      status: HTTP_RESPONSE_CODE.INTERNAL_SERVER_ERROR,
      data: null,
    };
  }
};

export const createCart = async (
  request: CreateCartRequest,
): Promise<ResponseCommonType<Cart | Error>> => {
  loggerService.info("CreateCart");
  loggerService.debug("CreateCart", { request });
  try {
    const cart = await cartRepository.create(request);
    return {
      status: HTTP_RESPONSE_CODE.CREATED,
      data: cart,
    };
  } catch (error) {
    return {
      status: HTTP_RESPONSE_CODE.INTERNAL_SERVER_ERROR,
      data: error as Error,
    };
  }
};

export const getAllCarts = async (): Promise<ResponseCommonType<Cart[]>> => {
  loggerService.info("GetAllCart");
  try {
    const carts = await cartRepository.getAllCarts();
    return {
      status: HTTP_RESPONSE_CODE.OK,
      data: carts,
    };
  } catch (error) {
    return {
      status: HTTP_RESPONSE_CODE.INTERNAL_SERVER_ERROR,
      data: [],
    };
  }
};

export default {
  getCartById,
  createCart,
  getAllCarts,
};
