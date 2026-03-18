import { HTTP_RESPONSE_CODE } from "../enums/response.enum";

export class AppError extends Error {
  public readonly statusCode: number;
  public readonly isOperational: boolean;

  constructor(
    message: string,
    statusCode: number = HTTP_RESPONSE_CODE.INTERNAL_SERVER_ERROR,
    isOperational: boolean = true,
  ) {
    super(message);
    this.statusCode = statusCode;
    this.isOperational = isOperational;

    Object.setPrototypeOf(this, AppError.prototype);
    Error.captureStackTrace(this, this.constructor);
  }
}

export class ValidationError extends AppError {
  public readonly errors: string[];

  constructor(errors: string[]) {
    super("Validation failed", HTTP_RESPONSE_CODE.BAD_REQUEST);
    this.errors = errors;
    Object.setPrototypeOf(this, ValidationError.prototype);
  }
}

export class NotFoundError extends AppError {
  constructor(resource: string, id: string) {
    super(`${resource} not found with id: ${id}`, HTTP_RESPONSE_CODE.NOT_FOUND);
    Object.setPrototypeOf(this, NotFoundError.prototype);
  }
}

export class BadRequestError extends AppError {
  constructor(message: string) {
    super(message, HTTP_RESPONSE_CODE.BAD_REQUEST);
    Object.setPrototypeOf(this, BadRequestError.prototype);
  }
}
