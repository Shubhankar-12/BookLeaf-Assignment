import { ticketQueries } from "../../../db/queries";
import type { UseCaseResult } from "../../../types/api-response";
import type {
  TicketCategory,
  TicketPriority,
  TicketStatus,
} from "../../../constants/ticket";
import type { ListTicketsDto } from "./dto";

export interface TicketListItem {
  id: string;
  authorId: string;
  subject: string;
  category: TicketCategory | null;
  priority: TicketPriority | null;
  status: TicketStatus;
  bookId: string | null;
  createdAt: Date;
  updatedAt: Date;
  // `messagesCount` is intentionally omitted — the UI doesn't need it yet, and
  // computing it would require a $lookup in `listTickets`. Add only when a
  // concrete UI need shows up; the list endpoint should stay an index-backed read.
}

export interface ListTicketsResult {
  data: TicketListItem[];
  total: number;
  page: number;
  limit: number;
}

export class ListTicketsUseCase {
  async execute(
    dto: ListTicketsDto,
  ): Promise<UseCaseResult<ListTicketsResult>> {
    // AUTHOR scopes to own tickets; ADMIN sees everything (no authorId filter).
    const { data, total } = await ticketQueries.listTickets({
      authorId: dto.role === "AUTHOR" ? dto.userId : undefined,
      status: dto.status,
      page: dto.page,
      limit: dto.limit,
    });

    return {
      data: data.map((t) => ({
        id: t._id.toString(),
        authorId: t.authorId.toString(),
        subject: t.subject,
        category: t.category,
        priority: t.priority,
        status: t.status,
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
