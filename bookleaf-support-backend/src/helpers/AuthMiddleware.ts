import { NextFunction, Request, Response } from "express";
import { ResponseUtil } from "../utils/response";
import { verifyToken } from "../utils/token";
import { userQueries } from "../db/queries";

const BEARER_PREFIX = "Bearer ";

// Re-fetches the user after verifying the signature so a deleted account is rejected even with a valid token.
export const verifyJWT = async (
  req: Request,
  res: Response,
  next: NextFunction,
): Promise<void> => {
  try {
    const auth = req.headers.authorization;
    const bearer = auth?.startsWith(BEARER_PREFIX)
      ? auth.slice(BEARER_PREFIX.length)
      : null;
    const cookieToken =
      typeof req.cookies?.token === "string" ? req.cookies.token : null;
    const token = bearer ?? cookieToken;

    if (!token) {
      ResponseUtil.error(res, "Not authenticated", 401);
      return;
    }

    const decoded = verifyToken(token);
    const user = await userQueries.getUserById(decoded.id);
    if (!user) {
      ResponseUtil.error(res, "User no longer exists", 401);
      return;
    }

    req.user = {
      id: user._id.toString(),
      email: user.email,
      name: user.name,
      role: user.role,
    };
    next();
  } catch {
    ResponseUtil.error(res, "Invalid or expired token", 401);
  }
};
