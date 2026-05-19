import { ticketQueries } from "../../../db/queries";
import type { UseCaseResult } from "../../../types/api-response";
import type {
  TicketCategory,
  TicketPriority,
  TicketStatus,
} from "../../../constants/ticket";
import type { ListAdminTicketsDto } from "./dto";

export interface AdminTicketListItem {
  id: string;
  subject: string;
  category: TicketCategory | null;
  priority: TicketPriority | null;
  status: TicketStatus;
  authorId: string;
  assignedTo: string | null;
  bookId: string | null;
  createdAt: Date;
  updatedAt: Date;
}

export interface ListAdminTicketsResult {
  data: AdminTicketListItem[];
  total: number;
  page: number;
  limit: number;
}

export class ListAdminTicketsUseCase {
  async execute(
    dto: ListAdminTicketsDto,
  ): Promise<UseCaseResult<ListAdminTicketsResult>> {
    const { data, total } = await ticketQueries.listForAdmin({
      status: dto.status,
      priority: dto.priority,
      category: dto.category,
      assignedTo: dto.assignedTo,
      search: dto.search,
      page: dto.page,
      limit: dto.limit,
    });

    return {
      data: data.map((t) => ({
        id: t._id.toString(),
        subject: t.subject,
        category: t.category,
        priority: t.priority,
        status: t.status,
        authorId: t.authorId.toString(),
        assignedTo: t.assignedTo ? t.assignedTo.toString() : null,
        bookId: t.bookId ? t.bookId.toString() : null,
        createdAt: t.createdAt,
        updatedAt: t.updatedAt,
      })),
      total,
      page: dto.page,
      limit: dto.limit,
    };
  }
}
