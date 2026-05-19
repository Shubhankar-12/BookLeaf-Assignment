import { Schema } from "mongoose";
import { AI_JOB_STATUSES, AI_JOB_TYPES, IAiJobDocument } from "./types";

export const aiJobSchema = new Schema<IAiJobDocument>(
  {
    ticketId: {
      type: Schema.Types.ObjectId,
      ref: "Ticket",
      required: true,
    },
    aiType: {
      type: String,
      enum: AI_JOB_TYPES,
      required: true,
    },
    status: {
      type: String,
      enum: AI_JOB_STATUSES,
      required: true,
      default: "PENDING",
    },
    attempts: { type: Number, required: true, default: 0 },
    startedAt: { type: Date, default: null },
    completedAt: { type: Date, default: null },
    result: { type: Schema.Types.Mixed, default: null },
    error: { type: String, default: null },
    modelName: { type: String, default: null },
    latencyMs: { type: Number, default: null },
    tokens: { type: Number, default: null },
  },
  {
    timestamps: true,
    versionKey: false,
  },
);

aiJobSchema.index({ ticketId: 1, createdAt: -1 });
aiJobSchema.index({ status: 1, createdAt: -1 });
aiJobSchema.index({ aiType: 1, status: 1 });
