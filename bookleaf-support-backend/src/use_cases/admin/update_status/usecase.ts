import { ticketQueries, activityQueries } from "../../../db/queries";
import { logger } from "../../../utils/logger";
import { socketService } from "../../../services/socket.service";
import { SOCKET_EVENTS } from "../../../sockets/events";
import type { UseCaseResult } from "../../../types/api-response";
import type {
  TicketCategory,
  TicketPriority,
  TicketStatus,
} from "../../../constants/ticket";
import type { UpdateStatusDto } from "./dto";

export interface UpdateStatusResult {
  id: string;
  subject: string;
  status: TicketStatus;
  category: TicketCategory | null;
  priority: TicketPriority | null;
  authorId: string;
  assignedTo: string | null;
  bookId: string | null;
  updatedAt: Date;
}

export class UpdateStatusUseCase {
  async execute(
    dto: UpdateStatusDto,
  ): Promise<UseCaseResult<UpdateStatusResult>> {
    const existing = await ticketQueries.getById(dto.ticketId);
    if (!existing) return { error: "Ticket not found", status: 404 };

    const before = existing.status;
    if (before === dto.status) {
      return {
        id: existing._id.toString(),
        subject: existing.subject,
        status: existing.status,
        category: existing.category,
        priority: existing.priority,
        authorId: existing.authorId.toString(),
        assignedTo: existing.assignedTo
          ? existing.assignedTo.toString()
          : null,
        bookId: existing.bookId ? existing.bookId.toString() : null,
        updatedAt: existing.updatedAt,
      };
    }

    const updated = await ticketQueries.updateStatus(dto.ticketId, dto.status);
    if (!updated) return { error: "Ticket not found", status: 404 };

    try {
      await activityQueries.log({
        ticketId: dto.ticketId,
        actorId: dto.adminId,
        actorType: "USER",
        type: "STATUS_CHANGED",
        before: { status: before },
        after: { status: dto.status },
      });
    } catch (err) {
      logger.warn(
        { err, ticketId: dto.ticketId },
        "activity log failed: STATUS_CHANGED",
      );
    }

    const authorIdStr = updated.authorId.toString();
    socketService.emit(
      SOCKET_EVENTS.TICKET_UPDATED,
      {
        ticketId: updated._id.toString(),
        changes: { status: updated.status },
        by: "ADMIN",
      },
      ["admins", `author:${authorIdStr}`],
    );

    return {
      id: updated._id.toString(),
      subject: updated.subject,
      status: updated.status,
      category: updated.category,
      priority: updated.priority,
      authorId: updated.authorId.toString(),
      assignedTo: updated.assignedTo ? updated.assignedTo.toString() : null,
      bookId: updated.bookId ? updated.bookId.toString() : null,
      updatedAt: updated.updatedAt,
    };
  }
}
