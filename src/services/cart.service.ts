import { HTTP_RESPONSE_CODE } from "../infrastructure/common/enums/response.enum";
import {
  Cart,
  CreateCartRequest,
} from "../infrastructure/common/types/cart.type";
import { ResponseCommonType } from "../infrastructure/common/types/response-common.type";
import { MockCartRepository } from "../infrastructure/repositories/cart.repository";

const cartRepository = new MockCartRepository();

export const getCartById = async (
  id: string,
): Promise<ResponseCommonType<Cart | null>> => {
  try {
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

export const getCartByUserId = async (
  userId: string,
): Promise<ResponseCommonType<Cart | Error>> => {
  try {
    const cart = await cartRepository.findByUserId(userId);
    if (!cart) {
      return {
        status: HTTP_RESPONSE_CODE.NOT_FOUND,
        data: new Error("Cart not found"),
      };
    }
    return {
      status: HTTP_RESPONSE_CODE.OK,
      data: cart,
    };
  } catch (error) {
    return {
      status: HTTP_RESPONSE_CODE.INTERNAL_SERVER_ERROR,
      data: error as Error,
    };
  }
};

export const createCart = async (
  request: CreateCartRequest,
): Promise<ResponseCommonType<Cart | Error>> => {
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
  getCartByUserId,
  createCart,
  getAllCarts,
};
