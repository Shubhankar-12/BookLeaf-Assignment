import { NextFunction, Request, RequestHandler, Response } from "express";
import { ResponseUtil } from "../../../utils/response";
import { asyncHandler } from "../../../utils/async-handler";
import { validateInternalNote } from "./validator";
import { InternalNoteDtoConverter } from "./dto";
import { InternalNoteUseCase } from "./usecase";

export class InternalNoteController {
  constructor(private readonly useCase: InternalNoteUseCase) {}

  private handle = async (
    req: Request,
    res: Response,
    _next: NextFunction,
  ): Promise<void> => {
    if (!req.user) {
      ResponseUtil.error(res, "Not authenticated", 401);
      return;
    }

    const { data, errors } = validateInternalNote(req.params, req.body);
    if (!data) {
      ResponseUtil.error(res, "Validation failed", 400, errors);
      return;
    }

    const dto = new InternalNoteDtoConverter(req.user, data).getDtoObject();
    const result = await this.useCase.execute(dto);

    if (result && typeof result === "object" && "error" in result) {
      ResponseUtil.error(res, result.error, result.status ?? 400);
      return;
    }

    ResponseUtil.success(res, "Internal note added", result, 201);
  };

  execute(): RequestHandler {
    return asyncHandler(this.handle);
  }
}
