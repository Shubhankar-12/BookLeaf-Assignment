import { Schema } from "mongoose";
import { IMessageDocument } from "./types";

export const messageSchema = new Schema<IMessageDocument>(
  {
    ticketId: {
      type: Schema.Types.ObjectId,
      ref: "Ticket",
      required: true,
    },
    senderType: {
      type: String,
      enum: ["AUTHOR", "ADMIN", "SYSTEM"],
      required: true,
    },
    senderId: {
      type: Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    body: {
      type: String,
      required: true,
      trim: true,
    },
    internalOnly: {
      type: Boolean,
      required: true,
      default: false,
    },
  },
  {
    timestamps: true,
    versionKey: false,
  },
);

// Hot path: render a ticket's transcript in chronological order.
messageSchema.index({ ticketId: 1, createdAt: 1 });
