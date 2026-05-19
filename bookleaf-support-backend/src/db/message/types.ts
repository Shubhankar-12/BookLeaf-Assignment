import { Document, Types } from "mongoose";

export type SenderType = "AUTHOR" | "ADMIN" | "SYSTEM";

// `internalOnly: true` notes must never reach author-facing endpoints — filter lives in messageQueries.listByTicket.
export interface IMessage {
  ticketId: Types.ObjectId;
  senderType: SenderType;
  senderId: Types.ObjectId;
  body: string;
  internalOnly: boolean;
  createdAt: Date;
  updatedAt: Date;
}

export interface IMessageDocument extends IMessage, Document {
  _id: Types.ObjectId;
}
