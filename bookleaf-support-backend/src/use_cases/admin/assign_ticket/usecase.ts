import {
  ticketQueries,
  userQueries,
  activityQueries,
} from "../../../db/queries";
import { toObjectId } from "../../../utils/ids";
import { logger } from "../../../utils/logger";
import { socketService } from "../../../services/socket.service";
import { SOCKET_EVENTS } from "../../../sockets/events";
import type { UseCaseResult } from "../../../types/api-response";
import type {
  TicketCategory,
  TicketPriority,
  TicketStatus,
} from "../../../constants/ticket";
import type { AssignTicketDto } from "./dto";

export interface AssignTicketResult {
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

export class AssignTicketUseCase {
  async execute(
    dto: AssignTicketDto,
  ): Promise<UseCaseResult<AssignTicketResult>> {
    const existing = await ticketQueries.getById(dto.ticketId);
    if (!existing) return { error: "Ticket not found", status: 404 };

    const previous = existing.assignedTo
      ? existing.assignedTo.toString()
      : null;
    const next = dto.assigneeId;

    // Idempotent no-op — short-circuit before the assignee lookup so retries don't hit the DB.
    if (previous === next) {
      return {
        id: existing._id.toString(),
        subject: existing.subject,
        status: existing.status,
        category: existing.category,
        priority: existing.priority,
        authorId: existing.authorId.toString(),
        assignedTo: previous,
        bookId: existing.bookId ? existing.bookId.toString() : null,
        updatedAt: existing.updatedAt,
      };
    }

    let assigneeObjectId: ReturnType<typeof toObjectId> = null;
    if (dto.assigneeId) {
      const assignee = await userQueries.getUserById(dto.assigneeId);
      if (!assignee || assignee.role !== "ADMIN") {
        return { error: "Invalid assignee", status: 400 };
      }
      assigneeObjectId = toObjectId(dto.assigneeId);
      if (!assigneeObjectId) {
        return { error: "Invalid assignee", status: 400 };
      }
    }

    const updated = await ticketQueries.assignTo(
      dto.ticketId,
      assigneeObjectId,
    );
    if (!updated) return { error: "Ticket not found", status: 404 };

    try {
      await activityQueries.log({
        ticketId: dto.ticketId,
        actorId: dto.adminId,
        actorType: "USER",
        type: "ASSIGNED",
        before: { assignedTo: previous },
        after: { assignedTo: next },
      });
    } catch (err) {
      logger.warn(
        { err, ticketId: dto.ticketId },
        "activity log failed: ASSIGNED",
      );
    }

    const authorIdStr = updated.authorId.toString();
    socketService.emit(
      SOCKET_EVENTS.TICKET_UPDATED,
      {
        ticketId: updated._id.toString(),
        changes: {
          assignedTo: updated.assignedTo ? updated.assignedTo.toString() : null,
        },
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
