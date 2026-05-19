import { NextFunction, Request, RequestHandler, Response } from "express";
import { ResponseUtil } from "../../../utils/response";
import { asyncHandler } from "../../../utils/async-handler";
import { validateMe } from "./validator";
import { MeDtoConverter } from "./dto";
import { MeUseCase } from "./usecase";

export class MeController {
  constructor(private readonly useCase: MeUseCase) {}

  private handle = async (
    req: Request,
    res: Response,
    _next: NextFunction,
  ): Promise<void> => {
    // verifyJWT guarantees req.user, but we belt-and-braces it here so the
    // route is safe even if someone forgets to mount the middleware.
    const { data, errors } = validateMe(req.user);
    if (!data) {
      ResponseUtil.error(res, "Not authenticated", 401, errors);
      return;
    }

    const dto = new MeDtoConverter(data).getDtoObject();
    const result = await this.useCase.execute(dto);

    if (result && typeof result === "object" && "error" in result) {
      ResponseUtil.error(res, result.error, 401);
      return;
    }

    ResponseUtil.success(res, "Current user", result);
  };

  execute(): RequestHandler {
    return asyncHandler(this.handle);
  }
}
