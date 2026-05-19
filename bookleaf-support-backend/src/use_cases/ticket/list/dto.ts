import type { AuthUser, Role } from "../../../types/api-response";
import type { TicketStatus } from "../../../constants/ticket";
import type { ValidatedListTicketsQuery } from "./validator";

export interface ListTicketsDto {
  userId: string;
  role: Role;
  page: number;
  limit: number;
  status?: TicketStatus;
}

export class ListTicketsDtoConverter {
  constructor(
    private readonly auth: AuthUser,
    private readonly query: ValidatedListTicketsQuery,
  ) {}

  getDtoObject(): ListTicketsDto {
    return {
      userId: this.auth.id,
      role: this.auth.role,
      page: this.query.page,
      limit: this.query.limit,
      status: this.query.status,
    };
  }
}
