import { Response } from "express";
import { HTTP_RESPONSE_CODE } from "../enums/response.enum";

export interface ApiResponse<T = any> {
  status: number;
  message: string;
  data: T | null;
}

export const sendSuccess = <T>(
  res: Response,
  data: T,
  message = "Success",
  status = HTTP_RESPONSE_CODE.OK,
) => {
  const response: ApiResponse<T> = { status, message, data };
  return res.status(status).json(response);
};

export const sendCreated = <T>(res: Response, data: T, message = "Created") => {
  return sendSuccess(res, data, message, HTTP_RESPONSE_CODE.CREATED);
};

export const sendError = (
  res: Response,
  message: string,
  status = HTTP_RESPONSE_CODE.BAD_REQUEST,
) => {
  const response: ApiResponse<null> = { status, message, data: null };
  return res.status(status).json(response);
};

export const sendNotFound = (res: Response, resource = "Resource") => {
  return sendError(res, `${resource} not found`, HTTP_RESPONSE_CODE.NOT_FOUND);
};

export const sendBadRequest = (res: Response, message: string) => {
  return sendError(res, message, HTTP_RESPONSE_CODE.BAD_REQUEST);
};

export const sendServerError = (
  res: Response,
  message = "Internal server error",
) => {
  return sendError(res, message, HTTP_RESPONSE_CODE.INTERNAL_SERVER_ERROR);
};
