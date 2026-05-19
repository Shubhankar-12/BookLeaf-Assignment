import type { AuthUser, Role } from "../../../types/api-response";
import type { AddMessageRequest } from "./request";

export interface AddMessageDto {
  ticketId: string;
  userId: string;
  role: Role;
  body: string;
}

export class AddMessageDtoConverter {
  constructor(
    private readonly auth: AuthUser,
    private readonly request: AddMessageRequest,
  ) {}

  getDtoObject(): AddMessageDto {
    return {
      ticketId: this.request.params.id,
      userId: this.auth.id,
      role: this.auth.role,
      body: this.request.body.body.trim(),
    };
  }
}
