import { Schema } from "mongoose";
import { IActivityDocument } from "./types";

export const activitySchema = new Schema<IActivityDocument>(
  {
    ticketId: {
      type: Schema.Types.ObjectId,
      ref: "Ticket",
      required: true,
    },
    actorId: {
      type: Schema.Types.ObjectId,
      ref: "User",
      default: null,
    },
    actorType: {
      type: String,
      enum: ["USER", "SYSTEM", "AI"],
      required: true,
    },
    type: {
      type: String,
      enum: [
        "TICKET_CREATED",
        "STATUS_CHANGED",
        "CATEGORY_CHANGED",
        "PRIORITY_CHANGED",
        "ASSIGNED",
        "MESSAGE_ADDED",
        "INTERNAL_NOTE_ADDED",
        "AI_CLASSIFIED",
      ],
      required: true,
    },
    before: { type: Schema.Types.Mixed, default: null },
    after: { type: Schema.Types.Mixed, default: null },
  },
  {
    // Activity is append-only. createdAt is enough — no updatedAt.
    timestamps: { createdAt: true, updatedAt: false },
    versionKey: false,
  },
);

// Per-ticket timeline lookup, newest first.
activitySchema.index({ ticketId: 1, createdAt: -1 });
