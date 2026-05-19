import type { AuthUser } from "../../../types/api-response";
import type { TicketCategory } from "../../../constants/ticket";
import type { ValidatedUpdateCategory } from "./validator";

export interface UpdateCategoryDto {
  ticketId: string;
  adminId: string;
  category: TicketCategory;
}

export class UpdateCategoryDtoConverter {
  constructor(
    private readonly auth: AuthUser,
    private readonly request: ValidatedUpdateCategory,
  ) {}

  getDtoObject(): UpdateCategoryDto {
    return {
      ticketId: this.request.params.id,
      adminId: this.auth.id,
      category: this.request.body.category,
    };
  }
}
