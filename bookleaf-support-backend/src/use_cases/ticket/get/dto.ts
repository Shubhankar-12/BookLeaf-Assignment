import type { AuthUser, Role } from "../../../types/api-response";
import type { GetTicketRequest } from "./request";

export interface GetTicketDto {
  ticketId: string;
  userId: string;
  role: Role;
}

export class GetTicketDtoConverter {
  constructor(
    private readonly auth: AuthUser,
    private readonly params: GetTicketRequest,
  ) {}

  getDtoObject(): GetTicketDto {
    return {
      ticketId: this.params.id,
      userId: this.auth.id,
      role: this.auth.role,
    };
  }
}
