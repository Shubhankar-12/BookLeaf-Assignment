import { NextFunction, Request, RequestHandler, Response } from "express";
import { ResponseUtil } from "../utils/response";
import type { Role } from "../types/api-response";

// Returns 401 (not 403) when req.user is missing so an unprotected route surfaces the missing verifyJWT loudly.
export const requireRole =
  (...roles: Role[]): RequestHandler =>
  (req: Request, res: Response, next: NextFunction): void => {
    if (!req.user) {
      ResponseUtil.error(res, "Not authenticated", 401);
      return;
    }
    if (!roles.includes(req.user.role)) {
      ResponseUtil.error(res, "Forbidden", 403);
      return;
    }
    next();
  };
