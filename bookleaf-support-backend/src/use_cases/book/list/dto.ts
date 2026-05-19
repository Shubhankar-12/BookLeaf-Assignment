import type { AuthUser, Role } from "../../../types/api-response";
import type { Pagination } from "../../../validations/pagination";

export interface ListBooksDto {
  userId: string;
  role: Role;
  page: number;
  limit: number;
}

export class ListBooksDtoConverter {
  constructor(
    private readonly auth: AuthUser,
    private readonly query: Pagination,
  ) {}

  getDtoObject(): ListBooksDto {
    return {
      userId: this.auth.id,
      role: this.auth.role,
      page: this.query.page,
      limit: this.query.limit,
    };
  }
}
