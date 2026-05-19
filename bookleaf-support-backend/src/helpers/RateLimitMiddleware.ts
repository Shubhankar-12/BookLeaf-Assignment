import rateLimit, { ipKeyGenerator } from "express-rate-limit";
import type { Request, Response } from "express";
import { ResponseUtil } from "../utils/response";

// IP+email key — catches credential stuffing without locking out a whole NAT on one user's fat-fingered password.
export const loginRateLimiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  limit: 10,
  standardHeaders: "draft-7",
  legacyHeaders: false,
  keyGenerator: (req: Request): string => {
    const ipKey = ipKeyGenerator(req.ip ?? "");
    const email =
      typeof req.body?.email === "string"
        ? req.body.email.toLowerCase().trim()
        : "anon";
    return `${ipKey}::${email}`;
  },
  handler: (_req: Request, res: Response): void => {
    ResponseUtil.error(
      res,
      "Too many login attempts. Please wait a few minutes and try again.",
      429,
    );
  },
});
