import type {
  TicketCategory,
  TicketPriority,
  TicketStatus,
} from "../constants/ticket";
import type { SenderType } from "../db/message";
import type { AuthUser } from "../types/api-response";

// Narrow socket.io's default `any` SocketData so `socket.data.user` is typed.
declare module "socket.io" {
  interface SocketData {
    user?: AuthUser;
  }
}

export const SOCKET_EVENTS = {
  TICKET_CREATED: "ticket:created",
  TICKET_UPDATED: "ticket:updated",
  MESSAGE_NEW: "message:new",
} as const;

export type SocketEventName = (typeof SOCKET_EVENTS)[keyof typeof SOCKET_EVENTS];

export interface TicketCreatedPayload {
  ticketId: string;
  authorId: string;
  subject: string;
  category: TicketCategory | null;
  priority: TicketPriority | null;
  status: TicketStatus;
  /** ISO-8601 timestamp. */
  createdAt: string;
}

export interface TicketUpdatedPayload {
  ticketId: string;
  // Sparse delta — missing keys mean "unchanged", not "cleared".
  changes: Partial<{
    status: TicketStatus;
    category: TicketCategory | null;
    priority: TicketPriority | null;
    assignedTo: string | null;
    aiMetadata: { source: "AI" | "FALLBACK"; confidence: number };
  }>;
  by: "ADMIN" | "AI" | "AI_FALLBACK";
}

export interface MessageNewPayload {
  ticketId: string;
  messageId: string;
  senderType: SenderType;
  // Stringified ObjectId — disambiguates two admins on the same thread.
  senderId: string;
  body: string;
  // Server suppresses author-room emission when true; flag exposed so admin client can render distinction.
  internalOnly: boolean;
  createdAt: string;
}

export type SocketEventPayload<E extends SocketEventName> =
  E extends "ticket:created" ? TicketCreatedPayload :
  E extends "ticket:updated" ? TicketUpdatedPayload :
  E extends "message:new" ? MessageNewPayload :
  never;
