import { NextFunction, Request, RequestHandler, Response } from "express";
import { ResponseUtil } from "../../../utils/response";
import { asyncHandler } from "../../../utils/async-handler";
import { validateGetAdminTicket } from "./validator";
import { GetAdminTicketDtoConverter } from "./dto";
import { GetAdminTicketUseCase } from "./usecase";

export class GetAdminTicketController {
  constructor(private readonly useCase: GetAdminTicketUseCase) {}

  private handle = async (
    req: Request,
    res: Response,
    _next: NextFunction,
  ): Promise<void> => {
    if (!req.user) {
      ResponseUtil.error(res, "Not authenticated", 401);
      return;
    }

    const { data, errors } = validateGetAdminTicket(req.params);
    if (!data) {
      ResponseUtil.error(res, "Validation failed", 400, errors);
      return;
    }

    const dto = new GetAdminTicketDtoConverter(req.user, data).getDtoObject();
    const result = await this.useCase.execute(dto);

    if (result && typeof result === "object" && "error" in result) {
      ResponseUtil.error(res, result.error, result.status ?? 400);
      return;
    }

    ResponseUtil.success(res, "Ticket", result);
  };

  execute(): RequestHandler {
    return asyncHandler(this.handle);
  }
}
