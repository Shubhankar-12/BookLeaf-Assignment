import { NextFunction, Request, RequestHandler, Response } from "express";

// Forwards async rejections to next(err); sync throws are handled by Express itself.
export const asyncHandler = (
  fn: (req: Request, res: Response, next: NextFunction) => Promise<unknown>,
): RequestHandler => {
  return (req, res, next) => {
    Promise.resolve(fn(req, res, next)).catch(next);
  };
};
