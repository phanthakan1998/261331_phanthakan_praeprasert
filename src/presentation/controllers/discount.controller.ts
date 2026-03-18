import { Request, Response } from "express";
import discountService from "../../services/discount.service";
import {
  sendSuccess,
  sendBadRequest,
} from "../../infrastructure/common/utils/response.util";
import loggerService from "../../services/logger.service";

export const calculateDiscountByCartId = async (
  request: Request,
  response: Response,
) => {
  try {
    loggerService.start(request);
    const result = await discountService.calculateDiscountByCartId(
      request.body,
    );
    loggerService.end(request);
    return sendSuccess(response, result, "Discount calculated");
  } catch (error: unknown) {
    const message =
      error instanceof Error ? error.message : "Unknown error occurred";

    loggerService.error(message);
    return sendBadRequest(response, message);
  }
};

export default { calculateDiscountByCartId };
