import type { AuthUser } from "../../../types/api-response";
import type { AiDraftRequest } from "./request";

export interface AiDraftDto {
  ticketId: string;
  adminId: string;
}

export class AiDraftDtoConverter {
  constructor(
    private readonly auth: AuthUser,
    private readonly params: AiDraftRequest,
  ) {}

  getDtoObject(): AiDraftDto {
    return {
      ticketId: this.params.id,
      adminId: this.auth.id,
    };
  }
}
