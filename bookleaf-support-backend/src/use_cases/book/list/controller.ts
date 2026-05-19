import { NextFunction, Request, RequestHandler, Response } from "express";
import { ResponseUtil } from "../../../utils/response";
import { asyncHandler } from "../../../utils/async-handler";
import { validateListBooks } from "./validator";
import { ListBooksDtoConverter } from "./dto";
import { ListBooksUseCase } from "./usecase";

export class ListBooksController {
  constructor(private readonly useCase: ListBooksUseCase) {}

  private handle = async (
    req: Request,
    res: Response,
    _next: NextFunction,
  ): Promise<void> => {
    if (!req.user) {
      ResponseUtil.error(res, "Not authenticated", 401);
      return;
    }

    const { data, errors } = validateListBooks(req.query);
    if (!data) {
      ResponseUtil.error(res, "Validation failed", 400, errors);
      return;
    }

    const dto = new ListBooksDtoConverter(req.user, data).getDtoObject();
    const result = await this.useCase.execute(dto);

    if (result && typeof result === "object" && "error" in result) {
      ResponseUtil.error(res, result.error, 400);
      return;
    }

    ResponseUtil.success(res, "Books listed", result);
  };

  execute(): RequestHandler {
    return asyncHandler(this.handle);
  }
}
