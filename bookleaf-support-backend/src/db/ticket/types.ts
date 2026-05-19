import { Document, Types } from "mongoose";
import {
  TicketCategory,
  TicketPriority,
  TicketStatus,
} from "../../constants/ticket";

// All fields nullable — tickets land with `aiMetadata: {}` and only fill in once the AI classifier completes.
export interface IAiMetadata {
  category?: TicketCategory | null;
  priority?: TicketPriority | null;
  confidence?: number | null;
  model?: string | null;
  source?: "AI" | "FALLBACK" | null;
  classifiedAt?: Date | null;
  latencyMs?: number | null;
  tokens?: number | null;
}

export interface ITicket {
  authorId: Types.ObjectId;
  bookId?: Types.ObjectId | null;
  subject: string;
  description: string;
  // Null until the AI classifier populates it.
  category: TicketCategory | null;
  priority: TicketPriority | null;
  status: TicketStatus;
  assignedTo?: Types.ObjectId | null;
  aiMetadata: IAiMetadata;
  createdAt: Date;
  updatedAt: Date;
}

export interface ITicketDocument extends ITicket, Document {
  _id: Types.ObjectId;
}

// POJO returned by aggregation pipelines / .lean() — no Document methods/virtuals.
export type ITicketLean = ITicket & { _id: Types.ObjectId };
