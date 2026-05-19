import { NextFunction, Request, RequestHandler, Response } from "express";
import { ResponseUtil } from "../../../utils/response";
import { asyncHandler } from "../../../utils/async-handler";
import { validateLogin } from "./validator";
import { LoginDtoConverter } from "./dto";
import { LoginUseCase } from "./usecase";

export class LoginController {
  constructor(private readonly useCase: LoginUseCase) {}

  private handle = async (
    req: Request,
    res: Response,
    _next: NextFunction,
  ): Promise<void> => {
    const { data, errors } = validateLogin(req.body);
    if (!data) {
      ResponseUtil.error(res, "Validation failed", 400, errors);
      return;
    }

    const dto = new LoginDtoConverter(data).getDtoObject();
    const result = await this.useCase.execute(dto);

    if (result && typeof result === "object" && "error" in result) {
      ResponseUtil.error(res, result.error, 401);
      return;
    }

    ResponseUtil.success(res, "Logged in", result);
  };

  execute(): RequestHandler {
    return asyncHandler(this.handle);
  }
}
