import { Response } from "express";
import { ApiError, ApiSuccess } from "../types/api-response";

export const ResponseUtil = {
  success<T>(
    res: Response,
    message: string,
    data: T,
    code: number = 200,
  ): Response<ApiSuccess<T>> {
    const body: ApiSuccess<T> = { success: true, message, data };
    return res.status(code).json(body);
  },

  error(
    res: Response,
    error: string,
    code: number = 400,
    details?: unknown,
  ): Response<ApiError> {
    const body: ApiError =
      details !== undefined
        ? { success: false, error, details }
        : { success: false, error };
    return res.status(code).json(body);
  },
};
