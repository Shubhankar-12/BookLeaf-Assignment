import type {
  TicketCategory,
  TicketPriority,
  TicketStatus,
} from "@/constants/ticket";

export interface TicketAttachment {
  key: string;
  url: string;
  contentType: string;
  size: number;
}

export interface TicketAiMetadata {
  category?: TicketCategory | null;
  priority?: TicketPriority | null;
  confidence?: number | null;
  model?: string | null;
  source?: "AI" | "FALLBACK" | null;
  classifiedAt?: string | null;
  latencyMs?: number | null;
  tokens?: number | null;
}

/** Row shape returned by author list endpoint (compact). */
export interface AuthorTicketListItem {
  id: string;
  subject: string;
  category: TicketCategory | null;
  priority: TicketPriority | null;
  status: TicketStatus;
  bookId: string | null;
  createdAt: string;
  updatedAt: string;
}

/** Full ticket as returned by POST /api/tickets / GET /api/tickets/:id. */
export interface AuthorTicketDetail {
  id: string;
  authorId?: string;
  bookId: string | null;
  subject: string;
  description: string;
  category: TicketCategory | null;
  priority: TicketPriority | null;
  status: TicketStatus;
  assignedTo?: string | null;
  aiMetadata?: TicketAiMetadata;
  attachments: TicketAttachment[];
  createdAt: string;
  updatedAt: string;
  messages?: TicketMessage[];
}

/** Row shape returned by admin queue. */
export interface AdminTicketListItem {
  id: string;
  subject: string;
  category: TicketCategory | null;
  priority: TicketPriority | null;
  status: TicketStatus;
  authorId: string;
  assignedTo: string | null;
  bookId: string | null;
  createdAt: string;
  updatedAt: string;
}

export type SenderType = "AUTHOR" | "ADMIN" | "SYSTEM";

export interface TicketMessage {
  id: string;
  ticketId?: string;
  senderType: SenderType;
  senderId: string;
  body: string;
  internalOnly?: boolean;
  createdAt: string;
}

export type ActivityType =
  | "TICKET_CREATED"
  | "STATUS_CHANGED"
  | "CATEGORY_CHANGED"
  | "PRIORITY_CHANGED"
  | "ASSIGNED"
  | "MESSAGE_ADDED"
  | "INTERNAL_NOTE_ADDED"
  | "AI_CLASSIFIED";

export type ActorType = "USER" | "SYSTEM" | "AI";

export interface ActivityEntry {
  id: string;
  actorId: string | null;
  actorType: ActorType;
  type: ActivityType;
  before?: unknown;
  after?: unknown;
  createdAt: string;
}

export interface AdminTicketDetail {
  id: string;
  subject: string;
  description: string;
  category: TicketCategory | null;
  priority: TicketPriority | null;
  status: TicketStatus;
  authorId: string;
  assignedTo: string | null;
  bookId: string | null;
  attachments: TicketAttachment[];
  aiMetadata?: TicketAiMetadata;
  createdAt: string;
  updatedAt: string;
  messages: TicketMessage[];
  activity: ActivityEntry[];
}

export interface AiDraftResponse {
  draft: string;
  source: "AI" | "FALLBACK";
  model?: string;
  tokens?: number;
}

export interface PresignResponse {
  uploadUrl: string;
  key: string;
  expiresIn: number;
  publicUrl: string;
}
