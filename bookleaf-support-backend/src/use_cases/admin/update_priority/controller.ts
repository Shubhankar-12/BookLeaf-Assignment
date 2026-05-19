import { NextFunction, Request, RequestHandler, Response } from "express";
import { ResponseUtil } from "../../../utils/response";
import { asyncHandler } from "../../../utils/async-handler";
import { validateUpdatePriority } from "./validator";
import { UpdatePriorityDtoConverter } from "./dto";
import { UpdatePriorityUseCase } from "./usecase";

export class UpdatePriorityController {
  constructor(private readonly useCase: UpdatePriorityUseCase) {}

  private handle = async (
    req: Request,
    res: Response,
    _next: NextFunction,
  ): Promise<void> => {
    if (!req.user) {
      ResponseUtil.error(res, "Not authenticated", 401);
      return;
    }

    const { data, errors } = validateUpdatePriority(req.params, req.body);
    if (!data) {
      ResponseUtil.error(res, "Validation failed", 400, errors);
      return;
    }

    const dto = new UpdatePriorityDtoConverter(req.user, data).getDtoObject();
    const result = await this.useCase.execute(dto);

    if (result && typeof result === "object" && "error" in result) {
      ResponseUtil.error(res, result.error, result.status ?? 400);
      return;
    }

    ResponseUtil.success(res, "Priority updated", result);
  };

  execute(): RequestHandler {
    return asyncHandler(this.handle);
  }
}
