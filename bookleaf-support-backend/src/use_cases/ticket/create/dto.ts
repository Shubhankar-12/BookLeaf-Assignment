import type { AuthUser, Role } from "../../../types/api-response";
import type { CreateTicketRequest } from "./request";

// authorId always comes from the JWT — never the body — so a client can't impersonate another author.
export interface CreateTicketDto {
  authorId: string;
  role: Role;
  subject: string;
  description: string;
  bookId?: string;
}

export class CreateTicketDtoConverter {
  constructor(
    private readonly auth: AuthUser,
    private readonly request: CreateTicketRequest,
  ) {}

  getDtoObject(): CreateTicketDto {
    return {
      authorId: this.auth.id,
      role: this.auth.role,
      subject: this.request.subject.trim(),
      description: this.request.description.trim(),
      bookId: this.request.bookId,
    };
  }
}
