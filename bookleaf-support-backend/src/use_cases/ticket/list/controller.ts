import { NextFunction, Request, RequestHandler, Response } from "express";
import { ResponseUtil } from "../../../utils/response";
import { asyncHandler } from "../../../utils/async-handler";
import { validateListTickets } from "./validator";
import { ListTicketsDtoConverter } from "./dto";
import { ListTicketsUseCase } from "./usecase";

export class ListTicketsController {
  constructor(private readonly useCase: ListTicketsUseCase) {}

  private handle = async (
    req: Request,
    res: Response,
    _next: NextFunction,
  ): Promise<void> => {
    if (!req.user) {
      ResponseUtil.error(res, "Not authenticated", 401);
      return;
    }

    const { data, errors } = validateListTickets(req.query);
    if (!data) {
      ResponseUtil.error(res, "Validation failed", 400, errors);
      return;
    }

    const dto = new ListTicketsDtoConverter(req.user, data).getDtoObject();
    const result = await this.useCase.execute(dto);

    if (result && typeof result === "object" && "error" in result) {
      ResponseUtil.error(res, result.error, 400);
      return;
    }

    ResponseUtil.success(res, "Tickets listed", result);
  };

  execute(): RequestHandler {
    return asyncHandler(this.handle);
  }
}
