import type { AuthUser } from "../../../types/api-response";
import type { TicketStatus } from "../../../constants/ticket";
import type { ValidatedUpdateStatus } from "./validator";

export interface UpdateStatusDto {
  ticketId: string;
  adminId: string;
  status: TicketStatus;
}

export class UpdateStatusDtoConverter {
  constructor(
    private readonly auth: AuthUser,
    private readonly request: ValidatedUpdateStatus,
  ) {}

  getDtoObject(): UpdateStatusDto {
    return {
      ticketId: this.request.params.id,
      adminId: this.auth.id,
      status: this.request.body.status,
    };
  }
}
