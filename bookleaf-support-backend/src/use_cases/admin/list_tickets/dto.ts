import type { AuthUser } from "../../../types/api-response";
import type {
  TicketCategory,
  TicketPriority,
  TicketStatus,
} from "../../../constants/ticket";
import type { ValidatedListAdminTicketsQuery } from "./validator";

export interface ListAdminTicketsDto {
  adminId: string;
  page: number;
  limit: number;
  status?: TicketStatus;
  priority?: TicketPriority;
  category?: TicketCategory;
  assignedTo?: string;
  search?: string;
}

export class ListAdminTicketsDtoConverter {
  constructor(
    private readonly auth: AuthUser,
    private readonly query: ValidatedListAdminTicketsQuery,
  ) {}

  getDtoObject(): ListAdminTicketsDto {
    return {
      adminId: this.auth.id,
      page: this.query.page,
      limit: this.query.limit,
      status: this.query.status,
      priority: this.query.priority,
      category: this.query.category,
      assignedTo: this.query.assignedTo,
      search: this.query.search,
    };
  }
}
