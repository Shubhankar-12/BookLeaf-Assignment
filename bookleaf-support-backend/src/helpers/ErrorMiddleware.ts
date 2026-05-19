import { NextFunction, Request, Response } from "express";
import { config } from "../config/env";
import { logger } from "../utils/logger";
import { ResponseUtil } from "../utils/response";

interface HttpLikeError extends Error {
  statusCode?: number;
  status?: number;
  details?: unknown;
}

// Must be registered last. Hides 5xx messages in production to avoid leaking internals.
export const errorMiddleware = (
  err: HttpLikeError,
  req: Request,
  res: Response,
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  _next: NextFunction,
): void => {
  const statusCode = err.statusCode ?? err.status ?? 500;

  logger.error(
    {
      reqId: req.id,
      method: req.method,
      url: req.originalUrl,
      statusCode,
      err: { message: err.message, stack: err.stack },
    },
    "Request failed",
  );

  const publicMessage =
    config.IS_PRODUCTION && statusCode >= 500
      ? "Internal Server Error"
      : err.message || "Internal Server Error";

  ResponseUtil.error(res, publicMessage, statusCode, err.details);
};
