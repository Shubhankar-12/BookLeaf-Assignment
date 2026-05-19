import {
  ticketQueries,
  messageQueries,
  activityQueries,
} from "../../../db/queries";
import type { UseCaseResult } from "../../../types/api-response";
import type {
  TicketCategory,
  TicketPriority,
  TicketStatus,
} from "../../../constants/ticket";
import type { IAiMetadata } from "../../../db/ticket";
import type { SenderType } from "../../../db/message";
import type { ActivityType, ActivityActorType } from "../../../db/activity";
import type { GetAdminTicketDto } from "./dto";

export interface AdminTicketMessage {
  id: string;
  senderType: SenderType;
  senderId: string;
  body: string;
  internalOnly: boolean;
  createdAt: Date;
}

export interface AdminTicketActivity {
  id: string;
  actorId: string | null;
  actorType: ActivityActorType;
  type: ActivityType;
  before: unknown | null;
  after: unknown | null;
  createdAt: Date;
}

export interface AdminTicketDetail {
  id: string;
  subject: string;
  description: string;
  category: TicketCategory | null;
  priority: TicketPriority | null;
  status: TicketStatus;
  authorId: string;
  assignedTo: string | null;
  bookId: string | null;
  aiMetadata: IAiMetadata;
  createdAt: Date;
  updatedAt: Date;
  messages: AdminTicketMessage[];
  activity: AdminTicketActivity[];
}

export class GetAdminTicketUseCase {
  async execute(
    dto: GetAdminTicketDto,
  ): Promise<UseCaseResult<AdminTicketDetail>> {
    const ticket = await ticketQueries.getById(dto.ticketId);
    if (!ticket) return { error: "Ticket not found", status: 404 };

    const messages = await messageQueries.listByTicket(dto.ticketId, {
      includeInternal: true,
    });

    const { data: activity } = await activityQueries.listByTicket(
      dto.ticketId,
      { page: 1, limit: 100 },
    );

    return {
      id: ticket._id.toString(),
      subject: ticket.subject,
      description: ticket.description,
      category: ticket.category,
      priority: ticket.priority,
      status: ticket.status,
      authorId: ticket.authorId.toString(),
      assignedTo: ticket.assignedTo ? ticket.assignedTo.toString() : null,
      bookId: ticket.bookId ? ticket.bookId.toString() : null,
      aiMetadata: ticket.aiMetadata,
      createdAt: ticket.createdAt,
      updatedAt: ticket.updatedAt,
      messages: messages.map((m) => ({
        id: m._id.toString(),
        senderType: m.senderType,
        senderId: m.senderId.toString(),
        body: m.body,
        internalOnly: m.internalOnly,
        createdAt: m.createdAt,
      })),
      activity: activity.map((a) => ({
        id: a._id.toString(),
        actorId: a.actorId ? a.actorId.toString() : null,
        actorType: a.actorType,
        type: a.type,
        before: a.before ?? null,
        after: a.after ?? null,
        createdAt: a.createdAt,
      })),
    };
  }
}
