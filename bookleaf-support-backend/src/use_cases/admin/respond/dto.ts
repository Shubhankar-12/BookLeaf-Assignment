import type { AuthUser } from "../../../types/api-response";
import type { AdminRespondRequest } from "./request";

export interface AdminRespondDto {
  ticketId: string;
  adminId: string;
  body: string;
}

export class AdminRespondDtoConverter {
  constructor(
    private readonly auth: AuthUser,
    private readonly request: AdminRespondRequest,
  ) {}

  getDtoObject(): AdminRespondDto {
    return {
      ticketId: this.request.params.id,
      adminId: this.auth.id,
      body: this.request.body.body.trim(),
    };
  }
}
