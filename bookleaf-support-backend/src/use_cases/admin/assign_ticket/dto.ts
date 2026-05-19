import type { AuthUser } from "../../../types/api-response";
import type { ValidatedAssignTicket } from "./validator";

export interface AssignTicketDto {
  ticketId: string;
  adminId: string;
  assigneeId: string | null;
}

export class AssignTicketDtoConverter {
  constructor(
    private readonly auth: AuthUser,
    private readonly request: ValidatedAssignTicket,
  ) {}

  getDtoObject(): AssignTicketDto {
    return {
      ticketId: this.request.params.id,
      adminId: this.auth.id,
      assigneeId: this.request.body.assigneeId,
    };
  }
}
