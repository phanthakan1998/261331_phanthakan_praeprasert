import { Request, Response } from "express";
import discountService from "../../services/discount.service";
import {
  sendSuccess,
  sendBadRequest,
  sendNotFound,
} from "../../infrastructure/common/utils/response.util";

export const calculateDiscount = (request: Request, response: Response) => {
  try {
    const result = discountService.calculateDiscount(request.body);
    return sendSuccess(response, result, "Discount calculated");
  } catch (error) {
    return sendBadRequest(response, (error as Error).message);
  }
};

export const calculateDiscountByCartId = async (
  request: Request,
  response: Response,
) => {
  try {
    const result = await discountService.calculateDiscountByCartId(
      request.body,
    );
    console.log({ result });

    return sendSuccess(response, result, "Discount calculated");
  } catch (error) {
    if ((error as Error).message.includes("not found")) {
      return sendNotFound(response, "Cart");
    }
    return sendBadRequest(response, (error as Error).message);
  }
};

export default { calculateDiscount, calculateDiscountByCartId };
