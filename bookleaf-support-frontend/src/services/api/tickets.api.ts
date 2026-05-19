"use client";

import { http } from "./client";
import type { Paginated, PaginationParams } from "@/types/api";
import type {
  TicketCategory,
  TicketPriority,
  TicketStatus,
} from "@/constants/ticket";
import type {
  AuthorTicketDetail,
  AuthorTicketListItem,
  TicketMessage,
  PresignResponse,
} from "@/types/ticket";

export interface ListTicketsParams extends PaginationParams {
  status?: TicketStatus;
}

export interface CreateTicketAttachment {
  key: string;
  contentType: "image/png" | "image/jpeg" | "image/webp" | "application/pdf";
  size: number;
}

export interface CreateTicketPayload {
  subject: string;
  description: string;
  bookId?: string;
  attachments?: CreateTicketAttachment[];
}

export interface AddMessagePayload {
  body: string;
}

export interface PresignPayload {
  contentType: CreateTicketAttachment["contentType"];
  size: number;
}

export const ticketsApi = {
  list: (params?: ListTicketsParams) =>
    http.get<Paginated<AuthorTicketListItem>>("/tickets", params),
  get: (id: string) => http.get<AuthorTicketDetail>(`/tickets/${id}`),
  create: (payload: CreateTicketPayload) =>
    http.post<AuthorTicketDetail>("/tickets", payload),
  addMessage: (id: string, payload: AddMessagePayload) =>
    http.post<TicketMessage>(`/tickets/${id}/messages`, payload),
  presignUpload: (payload: PresignPayload) =>
    http.post<PresignResponse>("/uploads/presign", payload),
} as const;

// Keep ticket category/priority literal exports here so callers don't have
// to drill into constants when assembling client-side select options.
export type { TicketCategory, TicketPriority, TicketStatus };
