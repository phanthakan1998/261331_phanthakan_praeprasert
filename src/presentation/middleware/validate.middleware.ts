import { Request, Response, NextFunction } from "express";
import Joi from "joi";
import { sendBadRequest } from "../../infrastructure/common/utils/response.util";

type ValidationSource = "body" | "params" | "query";

export const validate = (
  schema: Joi.ObjectSchema,
  source: ValidationSource = "body",
) => {
  return (req: Request, res: Response, next: NextFunction) => {
    const data = req[source];
    const { error, value } = schema.validate(data, { abortEarly: false });

    if (error) {
      const messages = error.details.map((d) => d.message).join(", ");
      return sendBadRequest(res, messages);
    }

    req[source] = value;
    next();
    return;
  };
};

export const validateBody = (schema: Joi.ObjectSchema) =>
  validate(schema, "body");
export const validateParams = (schema: Joi.ObjectSchema) =>
  validate(schema, "params");
export const validateQuery = (schema: Joi.ObjectSchema) =>
  validate(schema, "query");
