import { NextFunction, Request, RequestHandler, Response } from "express";
import { ResponseUtil } from "../../../utils/response";
import { asyncHandler } from "../../../utils/async-handler";
import { validateGetBook } from "./validator";
import { GetBookDtoConverter } from "./dto";
import { GetBookUseCase } from "./usecase";

export class GetBookController {
  constructor(private readonly useCase: GetBookUseCase) {}

  private handle = async (
    req: Request,
    res: Response,
    _next: NextFunction,
  ): Promise<void> => {
    if (!req.user) {
      ResponseUtil.error(res, "Not authenticated", 401);
      return;
    }

    const { data, errors } = validateGetBook(req.params);
    if (!data) {
      ResponseUtil.error(res, "Validation failed", 400, errors);
      return;
    }

    const dto = new GetBookDtoConverter(req.user, data).getDtoObject();
    const result = await this.useCase.execute(dto);

    if (result && typeof result === "object" && "error" in result) {
      ResponseUtil.error(res, result.error, result.status ?? 400);
      return;
    }

    ResponseUtil.success(res, "Book", result);
  };

  execute(): RequestHandler {
    return asyncHandler(this.handle);
  }
}
