import { NextFunction, Request, RequestHandler, Response } from "express";
import { ResponseUtil } from "../../../utils/response";
import { asyncHandler } from "../../../utils/async-handler";
import { validateListAdminTickets } from "./validator";
import { ListAdminTicketsDtoConverter } from "./dto";
import { ListAdminTicketsUseCase } from "./usecase";

export class ListAdminTicketsController {
  constructor(private readonly useCase: ListAdminTicketsUseCase) {}

  private handle = async (
    req: Request,
    res: Response,
    _next: NextFunction,
  ): Promise<void> => {
    if (!req.user) {
      ResponseUtil.error(res, "Not authenticated", 401);
      return;
    }

    const { data, errors } = validateListAdminTickets(req.query);
    if (!data) {
      ResponseUtil.error(res, "Validation failed", 400, errors);
      return;
    }

    const dto = new ListAdminTicketsDtoConverter(req.user, data).getDtoObject();
    const result = await this.useCase.execute(dto);

    if (result && typeof result === "object" && "error" in result) {
      ResponseUtil.error(res, result.error, result.status ?? 400);
      return;
    }

    ResponseUtil.success(res, "Tickets listed", result);
  };

  execute(): RequestHandler {
    return asyncHandler(this.handle);
  }
}
