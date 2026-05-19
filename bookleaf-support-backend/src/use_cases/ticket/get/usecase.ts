import { ticketQueries, messageQueries } from "../../../db/queries";
import type { UseCaseResult } from "../../../types/api-response";
import type {
  TicketCategory,
  TicketPriority,
  TicketStatus,
} from "../../../constants/ticket";
import type { SenderType } from "../../../db/message";
import type { GetTicketDto } from "./dto";

export interface TicketMessage {
  id: string;
  senderType: SenderType;
  senderId: string;
  body: string;
  createdAt: Date;
}

export interface TicketDetail {
  id: string;
  authorId: string;
  subject: string;
  description: string;
  category: TicketCategory | null;
  priority: TicketPriority | null;
  status: TicketStatus;
  bookId: string | null;
  createdAt: Date;
  updatedAt: Date;
  messages: TicketMessage[];
}

export class GetTicketUseCase {
  // Internal notes filtered out for BOTH roles — admin internal-note view is /api/admin/tickets/:id.
  async execute(dto: GetTicketDto): Promise<UseCaseResult<TicketDetail>> {
    const ticket =
      dto.role === "ADMIN"
        ? await ticketQueries.getById(dto.ticketId)
        : await ticketQueries.getByIdScopedToAuthor(dto.ticketId, dto.userId);
    if (!ticket) return { error: "Ticket not found", status: 404 };

    const messages = await messageQueries.listByTicket(dto.ticketId, {
      includeInternal: false,
    });

    return {
      id: ticket._id.toString(),
      authorId: ticket.authorId.toString(),
      subject: ticket.subject,
      description: ticket.description,
      category: ticket.category,
      priority: ticket.priority,
      status: ticket.status,
      bookId: ticket.bookId ? ticket.bookId.toString() : null,
      createdAt: ticket.createdAt,
      updatedAt: ticket.updatedAt,
      messages: messages.map((m) => ({
        id: m._id.toString(),
        senderType: m.senderType,
        senderId: m.senderId.toString(),
        body: m.body,
        createdAt: m.createdAt,
      })),
    };
  }
}
