import {
  ticketQueries,
  bookQueries,
  activityQueries,
} from "../../../db/queries";
import { toObjectId } from "../../../utils/ids";
import { logger } from "../../../utils/logger";
import { runTicketAi } from "../../../services/ai";
import { socketService } from "../../../services/socket.service";
import { SOCKET_EVENTS } from "../../../sockets/events";
import type { UseCaseResult } from "../../../types/api-response";
import type {
  TicketCategory,
  TicketPriority,
  TicketStatus,
} from "../../../constants/ticket";
import type { CreateTicketDto } from "./dto";

export interface CreateTicketResult {
  id: string;
  authorId: string;
  bookId: string | null;
  subject: string;
  description: string;
  category: TicketCategory | null;
  priority: TicketPriority | null;
  status: TicketStatus;
  createdAt: Date;
}

export class CreateTicketUseCase {
  async execute(
    dto: CreateTicketDto,
  ): Promise<UseCaseResult<CreateTicketResult>> {
    // AUTHOR: book must belong to requester. ADMIN: book just needs to exist. Same error to avoid existence leak.
    if (dto.bookId) {
      const ok =
        dto.role === "ADMIN"
          ? (await bookQueries.getById(dto.bookId)) !== null
          : await bookQueries.existsForAuthor(dto.bookId, dto.authorId);
      if (!ok) return { error: "Book not found", status: 404 };
    }

    const authorObjectId = toObjectId(dto.authorId);
    if (!authorObjectId) {
      return { error: "Invalid author", status: 400 };
    }

    const bookObjectId = dto.bookId ? toObjectId(dto.bookId) : null;

    const ticket = await ticketQueries.createTicket({
      authorId: authorObjectId,
      bookId: bookObjectId,
      subject: dto.subject,
      description: dto.description,
      category: null,
      priority: null,
      status: "OPEN",
      aiMetadata: {},
    });

    // Best-effort — a logging blip must not 500 a successful write.
    try {
      await activityQueries.log({
        ticketId: ticket._id.toString(),
        actorId: dto.authorId,
        actorType: "USER",
        type: "TICKET_CREATED",
      });
    } catch (err) {
      logger.warn(
        { err, ticketId: ticket._id.toString() },
        "activity log failed: TICKET_CREATED",
      );
    }

    // Fire-and-forget — does not block the HTTP response.
    void runTicketAi(ticket._id.toString()).catch((err) => {
      logger.warn(
        { err, ticketId: ticket._id.toString(), aiFallback: true },
        "runTicketAi rejected — fire-and-forget swallow",
      );
    });

    const authorIdStr = ticket.authorId.toString();
    socketService.emit(
      SOCKET_EVENTS.TICKET_CREATED,
      {
        ticketId: ticket._id.toString(),
        authorId: authorIdStr,
        subject: ticket.subject,
        category: ticket.category,
        priority: ticket.priority,
        status: ticket.status,
        createdAt: ticket.createdAt.toISOString(),
      },
      ["admins", `author:${authorIdStr}`],
    );

    return {
      id: ticket._id.toString(),
      authorId: ticket.authorId.toString(),
      bookId: ticket.bookId ? ticket.bookId.toString() : null,
      subject: ticket.subject,
      description: ticket.description,
      category: ticket.category,
      priority: ticket.priority,
      status: ticket.status,
      createdAt: ticket.createdAt,
    };
  }
}
