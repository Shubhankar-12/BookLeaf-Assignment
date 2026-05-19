import {
  ticketQueries,
  messageQueries,
  activityQueries,
} from "../../../db/queries";
import { toObjectId } from "../../../utils/ids";
import { logger } from "../../../utils/logger";
import { socketService } from "../../../services/socket.service";
import { SOCKET_EVENTS } from "../../../sockets/events";
import type { UseCaseResult } from "../../../types/api-response";
import type { SenderType } from "../../../db/message";
import type { AdminRespondDto } from "./dto";

export interface AdminRespondResult {
  id: string;
  ticketId: string;
  senderType: SenderType;
  senderId: string;
  body: string;
  internalOnly: boolean;
  createdAt: Date;
}

export class AdminRespondUseCase {
  async execute(
    dto: AdminRespondDto,
  ): Promise<UseCaseResult<AdminRespondResult>> {
    const ticket = await ticketQueries.getById(dto.ticketId);
    if (!ticket) return { error: "Ticket not found", status: 404 };

    const ticketObjectId = toObjectId(dto.ticketId);
    const senderObjectId = toObjectId(dto.adminId);
    if (!ticketObjectId || !senderObjectId) {
      // Invariant violation — surface as 500 so operators see it.
      return { error: "Internal error", status: 500 };
    }

    const message = await messageQueries.createMessage({
      ticketId: ticketObjectId,
      senderType: "ADMIN",
      senderId: senderObjectId,
      body: dto.body,
      internalOnly: false,
    });

    try {
      await activityQueries.log({
        ticketId: dto.ticketId,
        actorId: dto.adminId,
        actorType: "USER",
        type: "MESSAGE_ADDED",
        after: { internalOnly: false },
      });
    } catch (err) {
      logger.warn(
        { err, ticketId: dto.ticketId },
        "activity log failed: MESSAGE_ADDED",
      );
    }

    const authorIdStr = ticket.authorId.toString();
    socketService.emit(
      SOCKET_EVENTS.MESSAGE_NEW,
      {
        ticketId: message.ticketId.toString(),
        messageId: message._id.toString(),
        senderType: message.senderType,
        senderId: message.senderId.toString(),
        body: message.body,
        internalOnly: message.internalOnly,
        createdAt: message.createdAt.toISOString(),
      },
      ["admins", `author:${authorIdStr}`],
    );

    return {
      id: message._id.toString(),
      ticketId: message.ticketId.toString(),
      senderType: message.senderType,
      senderId: message.senderId.toString(),
      body: message.body,
      internalOnly: message.internalOnly,
      createdAt: message.createdAt,
    };
  }
}
