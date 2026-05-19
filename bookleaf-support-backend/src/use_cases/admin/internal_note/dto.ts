import type { AuthUser } from "../../../types/api-response";
import type { InternalNoteRequest } from "./request";

export interface InternalNoteDto {
  ticketId: string;
  adminId: string;
  body: string;
}

export class InternalNoteDtoConverter {
  constructor(
    private readonly auth: AuthUser,
    private readonly request: InternalNoteRequest,
  ) {}

  getDtoObject(): InternalNoteDto {
    return {
      ticketId: this.request.params.id,
      adminId: this.auth.id,
      body: this.request.body.body.trim(),
    };
  }
}
