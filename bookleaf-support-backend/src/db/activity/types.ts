import { Document, Types } from "mongoose";

// Additive only — never rename, historical records reference these strings.
export type ActivityType =
  | "TICKET_CREATED"
  | "STATUS_CHANGED"
  | "CATEGORY_CHANGED"
  | "PRIORITY_CHANGED"
  | "ASSIGNED"
  | "MESSAGE_ADDED"
  | "INTERNAL_NOTE_ADDED"
  | "AI_CLASSIFIED";

export type ActivityActorType = "USER" | "SYSTEM" | "AI";

// Append-only — no updatedAt. `before`/`after` are `unknown` so the log isn't coupled to any single entity shape.
export interface IActivity {
  ticketId: Types.ObjectId;
  actorId: Types.ObjectId | null;
  actorType: ActivityActorType;
  type: ActivityType;
  before?: unknown | null;
  after?: unknown | null;
  createdAt: Date;
}

export interface IActivityDocument extends IActivity, Document {
  _id: Types.ObjectId;
}

export type IActivityLean = IActivity & { _id: Types.ObjectId };
