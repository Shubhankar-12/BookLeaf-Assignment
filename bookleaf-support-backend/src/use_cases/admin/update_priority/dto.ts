import type { AuthUser } from "../../../types/api-response";
import type { TicketPriority } from "../../../constants/ticket";
import type { ValidatedUpdatePriority } from "./validator";

export interface UpdatePriorityDto {
  ticketId: string;
  adminId: string;
  priority: TicketPriority;
}

export class UpdatePriorityDtoConverter {
  constructor(
    private readonly auth: AuthUser,
    private readonly request: ValidatedUpdatePriority,
  ) {}

  getDtoObject(): UpdatePriorityDto {
    return {
      ticketId: this.request.params.id,
      adminId: this.auth.id,
      priority: this.request.body.priority,
    };
  }
}
