import { MessageModel } from "../message";
import type { IMessage, IMessageDocument } from "../message";
import { isValidObjectId, toObjectId } from "../../utils/ids";

export interface ListByTicketOptions {
  // Author-facing callers MUST pass false — this is the single chokepoint that hides internal notes.
  includeInternal: boolean;
}

export const messageQueries = {
  async createMessage(data: Partial<IMessage>): Promise<IMessageDocument> {
    return MessageModel.create(data);
  },

  async listByTicket(
    ticketId: string,
    { includeInternal }: ListByTicketOptions,
  ): Promise<IMessageDocument[]> {
    const tid = toObjectId(ticketId);
    if (!tid) return [];

    const filter: Record<string, unknown> = { ticketId: tid };
    if (!includeInternal) filter.internalOnly = false;

    return MessageModel.find(filter).sort({ createdAt: 1 }).exec();
  },

  async countByTicket(ticketId: string): Promise<number> {
    if (!isValidObjectId(ticketId)) return 0;
    return MessageModel.countDocuments({
      ticketId: toObjectId(ticketId),
    }).exec();
  },
};
