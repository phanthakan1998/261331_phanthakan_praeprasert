import { Request, Response, NextFunction } from "express";
import { HTTP_RESPONSE_CODE } from "../../infrastructure/common/enums/response.enum";
import { ApiResponse } from "../../infrastructure/common/utils/response.util";

export const errorHandler = (
  err: Error,
  _req: Request,
  res: Response,
  _next: NextFunction,
) => {
  console.error(err.stack);

  const response: ApiResponse<null> = {
    status: HTTP_RESPONSE_CODE.INTERNAL_SERVER_ERROR,
    message: err.message || "Internal server error",
    data: null,
  };

  return res.status(response.status).json(response);
};

export const notFoundHandler = (req: Request, res: Response) => {
  const response: ApiResponse<null> = {
    status: HTTP_RESPONSE_CODE.NOT_FOUND,
    message: `Route ${req.method} ${req.path} not found`,
    data: null,
  };

  return res.status(response.status).json(response);
};
