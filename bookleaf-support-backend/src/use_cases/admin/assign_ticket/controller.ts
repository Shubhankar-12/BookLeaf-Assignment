import { NextFunction, Request, RequestHandler, Response } from "express";
import { ResponseUtil } from "../../../utils/response";
import { asyncHandler } from "../../../utils/async-handler";
import { validateAssignTicket } from "./validator";
import { AssignTicketDtoConverter } from "./dto";
import { AssignTicketUseCase } from "./usecase";

export class AssignTicketController {
  constructor(private readonly useCase: AssignTicketUseCase) {}

  private handle = async (
    req: Request,
    res: Response,
    _next: NextFunction,
  ): Promise<void> => {
    if (!req.user) {
      ResponseUtil.error(res, "Not authenticated", 401);
      return;
    }

    const { data, errors } = validateAssignTicket(req.params, req.body);
    if (!data) {
      ResponseUtil.error(res, "Validation failed", 400, errors);
      return;
    }

    const dto = new AssignTicketDtoConverter(req.user, data).getDtoObject();
    const result = await this.useCase.execute(dto);

    if (result && typeof result === "object" && "error" in result) {
      ResponseUtil.error(res, result.error, result.status ?? 400);
      return;
    }

    ResponseUtil.success(res, "Ticket assigned", result);
  };

  execute(): RequestHandler {
    return asyncHandler(this.handle);
  }
}
