// `as const` tuples drive both runtime arrays (zod/mongoose enums) and literal-union types from a single source.

export const TICKET_CATEGORIES = [
  "Royalty & Payments",
  "ISBN & Metadata Issues",
  "Printing & Quality",
  "Distribution & Availability",
  "Book Status & Production Updates",
  "General Inquiry",
] as const;
export type TicketCategory = (typeof TICKET_CATEGORIES)[number];

export const TICKET_PRIORITIES = ["LOW", "MEDIUM", "HIGH", "CRITICAL"] as const;
export type TicketPriority = (typeof TICKET_PRIORITIES)[number];

export const TICKET_STATUSES = [
  "OPEN",
  "IN_PROGRESS",
  "WAITING_FOR_AUTHOR",
  "RESOLVED",
  "CLOSED",
] as const;
export type TicketStatus = (typeof TICKET_STATUSES)[number];

// Kept here so the fallback stays in lock-step with the canonical lists above.
export const DEFAULT_AI_FALLBACK = {
  category: "General Inquiry" as TicketCategory,
  priority: "MEDIUM" as TicketPriority,
};
