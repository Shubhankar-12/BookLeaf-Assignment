import { NextFunction, Request, RequestHandler, Response } from "express";
import { ResponseUtil } from "../../../utils/response";
import { asyncHandler } from "../../../utils/async-handler";
import { validateLogout } from "./validator";
import { LogoutDtoConverter } from "./dto";
import { LogoutUseCase } from "./usecase";

export class LogoutController {
  constructor(private readonly useCase: LogoutUseCase) {}

  private handle = async (
    req: Request,
    res: Response,
    _next: NextFunction,
  ): Promise<void> => {
    const { data, errors } = validateLogout(req.user);
    if (!data) {
      ResponseUtil.error(res, "Not authenticated", 401, errors);
      return;
    }

    const dto = new LogoutDtoConverter(data).getDtoObject();
    const result = await this.useCase.execute(dto);

    if (result && typeof result === "object" && "error" in result) {
      ResponseUtil.error(res, result.error, 400);
      return;
    }

    // If the client also uses cookie auth we clear it; harmless when not set.
    res.clearCookie("token");

    ResponseUtil.success(res, "Logged out", result);
  };

  execute(): RequestHandler {
    return asyncHandler(this.handle);
  }
}
