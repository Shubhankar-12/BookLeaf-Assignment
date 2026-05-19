import type { AuthUser, Role } from "../../../types/api-response";
import type { GetBookRequest } from "./request";

export interface GetBookDto {
  bookId: string;
  userId: string;
  role: Role;
}

export class GetBookDtoConverter {
  constructor(
    private readonly auth: AuthUser,
    private readonly params: GetBookRequest,
  ) {}

  getDtoObject(): GetBookDto {
    return {
      bookId: this.params.id,
      userId: this.auth.id,
      role: this.auth.role,
    };
  }
}
