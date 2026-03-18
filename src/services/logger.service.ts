import type { Request } from "express";
import winston from "winston";
import { LOG_LEVEL } from "../config/dotenv";

const sanitize = (body: any) => {
  if (Object.keys(body).length === 0) return "";
  if (body.stack) return `\n${body.stack}`;
  const fieldsToSanitize = ["apikey"];
  const sanitizedBody = { ...body };
  fieldsToSanitize.forEach((key) => {
    if (sanitizedBody[key]) sanitizedBody[key] = "***";
  });
  return `\n${JSON.stringify(sanitizedBody)}`;
};

const consoleTransport = new winston.transports.Console({
  format: winston.format.combine(
    winston.format.timestamp(),
    winston.format.colorize(),
    winston.format.printf(
      ({ timestamp, level, message, unixTimestamp, additionalInfo }) =>
        `${timestamp} ${level}: ${message} at ${unixTimestamp}${sanitize(additionalInfo)}`,
    ),
  ),
});

const logger = winston.createLogger({
  level: LOG_LEVEL,
  transports: [consoleTransport],
  format: winston.format.combine(
    winston.format.errors({ stack: true }),
    winston.format((info) => {
      const { ...meta } = info;
      if (info.stack) meta.stack = info.stack;
      const clearInfo = { ...info };
      Object.keys(info).forEach((key) => {
        if (key !== "level" && key !== "message") delete clearInfo[key];
      });
      clearInfo.additionalInfo = meta;
      clearInfo.unixTimestamp = new Date().getTime();
      return clearInfo;
    })(),
  ),
});

const start = (request: Request) => {
  logger.log(
    "info",
    `Requesting ${request.method} ${request.originalUrl} started`,
    {
      tags: "http",
      additionalInfo: {
        body: request.body,
        query: request.query,
      },
    },
  );
  logger.log(
    "debug",
    `Headers of ${request.method} ${request.originalUrl}`,
    request.headers,
  );
};

const end = (request: Request) => {
  logger.log(
    "info",
    `Requesting ${request.method} ${request.originalUrl} ended`,
  );
};

const info = (message: string) => {
  logger.log("info", message);
};

const debug = (message: string, data: any) => {
  logger.log("debug", message, data);
};

const error = (exception: any) => {
  logger.log("error", JSON.stringify(exception));
};

export default { start, end, error, info, debug };
