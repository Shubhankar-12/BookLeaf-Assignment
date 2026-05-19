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
import type { AddMessageDto } from "./dto";

export interface AddMessageResult {
  id: string;
  ticketId: string;
  senderType: SenderType;
  senderId: string;
  body: string;
  createdAt: Date;
}

export class AddMessageUseCase {
  async execute(dto: AddMessageDto): Promise<UseCaseResult<AddMessageResult>> {
    const ticket =
      dto.role === "ADMIN"
        ? await ticketQueries.getById(dto.ticketId)
        : await ticketQueries.getByIdScopedToAuthor(dto.ticketId, dto.userId);
    if (!ticket) return { error: "Ticket not found", status: 404 };

    const ticketObjectId = toObjectId(dto.ticketId);
    const senderObjectId = toObjectId(dto.userId);
    if (!ticketObjectId || !senderObjectId) {
      return { error: "Ticket not found", status: 404 };
    }

    const senderType: SenderType = dto.role === "ADMIN" ? "ADMIN" : "AUTHOR";

    const message = await messageQueries.createMessage({
      ticketId: ticketObjectId,
      senderType,
      senderId: senderObjectId,
      body: dto.body,
      internalOnly: false,
    });

    try {
      await activityQueries.log({
        ticketId: dto.ticketId,
        actorId: dto.userId,
        actorType: "USER",
        type: "MESSAGE_ADDED",
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
      createdAt: message.createdAt,
    };
  }
}
