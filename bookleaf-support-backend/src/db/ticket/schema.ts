import { Schema } from "mongoose";
import { ITicketDocument } from "./types";
import {
  TICKET_CATEGORIES,
  TICKET_PRIORITIES,
  TICKET_STATUSES,
} from "../../constants/ticket";

// `category` and `priority` are nullable until the AI classifier populates them.

const aiMetadataSchema = new Schema(
  {
    category: {
      type: String,
      enum: [...TICKET_CATEGORIES, null] as (string | null)[],
      default: null,
    },
    priority: {
      type: String,
      enum: [...TICKET_PRIORITIES, null] as (string | null)[],
      default: null,
    },
    confidence: { type: Number, default: null },
    model: { type: String, default: null },
    source: {
      type: String,
      enum: ["AI", "FALLBACK", null] as (string | null)[],
      default: null,
    },
    classifiedAt: { type: Date, default: null },
    latencyMs: { type: Number, default: null },
    tokens: { type: Number, default: null },
  },
  { _id: false },
);

export const ticketSchema = new Schema<ITicketDocument>(
  {
    authorId: {
      type: Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    bookId: {
      type: Schema.Types.ObjectId,
      ref: "Book",
      default: null,
    },
    subject: {
      type: String,
      required: true,
      trim: true,
    },
    description: {
      type: String,
      required: true,
      trim: true,
    },
    category: {
      type: String,
      enum: [...TICKET_CATEGORIES, null] as (string | null)[],
      default: null,
    },
    priority: {
      type: String,
      enum: [...TICKET_PRIORITIES, null] as (string | null)[],
      default: null,
    },
    status: {
      type: String,
      enum: TICKET_STATUSES,
      required: true,
      default: "OPEN",
    },
    assignedTo: {
      type: Schema.Types.ObjectId,
      ref: "User",
      default: null,
    },
    aiMetadata: {
      type: aiMetadataSchema,
      default: () => ({}),
    },
  },
  {
    timestamps: true,
    versionKey: false,
  },
);

ticketSchema.index({ authorId: 1, createdAt: -1 });
ticketSchema.index({ status: 1, priority: 1, createdAt: -1 });
ticketSchema.index({ category: 1 });
ticketSchema.index({ assignedTo: 1, status: 1 });
ticketSchema.index({ subject: "text", description: "text" });
