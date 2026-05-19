import { NextFunction, Request, Response } from "express";
import { v4 as uuidv4 } from "uuid";

const REQUEST_ID_HEADER = "X-Request-Id";

// Respects inbound X-Request-Id (gateway-supplied), else generates one; echoes in response for log correlation.
export const requestIdMiddleware = (
  req: Request,
  res: Response,
  next: NextFunction,
): void => {
  const inbound = req.header(REQUEST_ID_HEADER);
  const id = inbound && inbound.length > 0 ? inbound : uuidv4();
  req.id = id;
  res.setHeader(REQUEST_ID_HEADER, id);
  next();
};
