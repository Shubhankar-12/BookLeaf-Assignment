/** Mirrors `bookleaf-support-backend/src/sockets/events.ts` payloads. */

import type {
  TicketCategory,
  TicketPriority,
  TicketStatus,
} from "@/constants/ticket";
import type { SenderType } from "@/types/ticket";

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
  createdAt: string;
}

export interface TicketUpdatedPayload {
  ticketId: string;
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
  /** Stringified ObjectId of the message author. */
  senderId: string;
  body: string;
  internalOnly: boolean;
  createdAt: string;
}

export interface SocketEventMap {
  "ticket:created": TicketCreatedPayload;
  "ticket:updated": TicketUpdatedPayload;
  "message:new": MessageNewPayload;
}
