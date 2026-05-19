import { NextFunction, Request, RequestHandler, Response } from "express";
import { ResponseUtil } from "../../../utils/response";
import { asyncHandler } from "../../../utils/async-handler";
import { validateUpdateCategory } from "./validator";
import { UpdateCategoryDtoConverter } from "./dto";
import { UpdateCategoryUseCase } from "./usecase";

export class UpdateCategoryController {
  constructor(private readonly useCase: UpdateCategoryUseCase) {}

  private handle = async (
    req: Request,
    res: Response,
    _next: NextFunction,
  ): Promise<void> => {
    if (!req.user) {
      ResponseUtil.error(res, "Not authenticated", 401);
      return;
    }

    const { data, errors } = validateUpdateCategory(req.params, req.body);
    if (!data) {
      ResponseUtil.error(res, "Validation failed", 400, errors);
      return;
    }

    const dto = new UpdateCategoryDtoConverter(req.user, data).getDtoObject();
    const result = await this.useCase.execute(dto);

    if (result && typeof result === "object" && "error" in result) {
      ResponseUtil.error(res, result.error, result.status ?? 400);
      return;
    }

    ResponseUtil.success(res, "Category updated", result);
  };

  execute(): RequestHandler {
    return asyncHandler(this.handle);
  }
}
