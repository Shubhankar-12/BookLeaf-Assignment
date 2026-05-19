import { NextFunction, Request, RequestHandler, Response } from "express";
import { ResponseUtil } from "../../../utils/response";
import { asyncHandler } from "../../../utils/async-handler";
import { validateCreateTicket } from "./validator";
import { CreateTicketDtoConverter } from "./dto";
import { CreateTicketUseCase } from "./usecase";

export class CreateTicketController {
  constructor(private readonly useCase: CreateTicketUseCase) {}

  private handle = async (
    req: Request,
    res: Response,
    _next: NextFunction,
  ): Promise<void> => {
    if (!req.user) {
      ResponseUtil.error(res, "Not authenticated", 401);
      return;
    }

    const { data, errors } = validateCreateTicket(req.body);
    if (!data) {
      ResponseUtil.error(res, "Validation failed", 400, errors);
      return;
    }

    const dto = new CreateTicketDtoConverter(req.user, data).getDtoObject();
    const result = await this.useCase.execute(dto);

    if (result && typeof result === "object" && "error" in result) {
      ResponseUtil.error(res, result.error, result.status ?? 400);
      return;
    }

    ResponseUtil.success(res, "Ticket created", result, 201);
  };

  execute(): RequestHandler {
    return asyncHandler(this.handle);
  }
}
