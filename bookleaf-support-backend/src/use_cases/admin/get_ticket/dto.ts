import type { AuthUser } from "../../../types/api-response";
import type { GetAdminTicketRequest } from "./request";

export interface GetAdminTicketDto {
  ticketId: string;
  adminId: string;
}

export class GetAdminTicketDtoConverter {
  constructor(
    private readonly auth: AuthUser,
    private readonly params: GetAdminTicketRequest,
  ) {}

  getDtoObject(): GetAdminTicketDto {
    return { ticketId: this.params.id, adminId: this.auth.id };
  }
}
