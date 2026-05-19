import { Document, Types } from "mongoose";

export const AI_JOB_TYPES = [
  "FULL_CLASSIFY", // classification + priority in one orchestrator call
  "CLASSIFY",
  "PRIORITY",
  "DRAFT",
] as const;
export type AiJobType = (typeof AI_JOB_TYPES)[number];

export const AI_JOB_STATUSES = [
  "PENDING",
  "RUNNING",
  "SUCCEEDED",
  "FAILED",
] as const;
export type AiJobStatus = (typeof AI_JOB_STATUSES)[number];

export interface IAiJobResult {
  category?: string | null;
  priority?: string | null;
  confidence?: number | null;
  source?: "AI" | "FALLBACK" | null;
  draftPreview?: string | null;
  [k: string]: unknown;
}

export interface IAiJob {
  ticketId: Types.ObjectId;
  aiType: AiJobType;
  status: AiJobStatus;
  attempts: number;
  startedAt?: Date | null;
  completedAt?: Date | null;
  result?: IAiJobResult | null;
  error?: string | null;
  modelName?: string | null;
  latencyMs?: number | null;
  tokens?: number | null;
  createdAt: Date;
  updatedAt: Date;
}

export interface IAiJobDocument extends IAiJob, Document {
  _id: Types.ObjectId;
}
