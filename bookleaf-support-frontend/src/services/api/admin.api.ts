"use client";

import { http } from "./client";
import type { Paginated, PaginationParams } from "@/types/api";
import type {
  TicketCategory,
  TicketPriority,
  TicketStatus,
} from "@/constants/ticket";
import type {
  AdminTicketDetail,
  AdminTicketListItem,
  TicketMessage,
} from "@/types/ticket";

export interface AdminListTicketsParams extends PaginationParams {
  status?: TicketStatus;
  priority?: TicketPriority;
  category?: TicketCategory;
  assignedTo?: string;
  search?: string;
}

export const adminApi = {
  listTickets: (params?: AdminListTicketsParams) =>
    http.get<Paginated<AdminTicketListItem>>("/admin/tickets", params),
  getTicket: (id: string) =>
    http.get<AdminTicketDetail>(`/admin/tickets/${id}`),
  updateStatus: (id: string, status: TicketStatus) =>
    http.patch<AdminTicketDetail>(`/admin/tickets/${id}/status`, { status }),
  updateCategory: (id: string, category: TicketCategory) =>
    http.patch<AdminTicketDetail>(`/admin/tickets/${id}/category`, {
      category,
    }),
  updatePriority: (id: string, priority: TicketPriority) =>
    http.patch<AdminTicketDetail>(`/admin/tickets/${id}/priority`, {
      priority,
    }),
  assign: (id: string, assigneeId: string | null) =>
    http.patch<AdminTicketDetail>(`/admin/tickets/${id}/assign`, {
      assigneeId,
    }),
  respond: (id: string, body: string) =>
    http.post<TicketMessage>(`/admin/tickets/${id}/respond`, { body }),
  internalNote: (id: string, body: string) =>
    http.post<TicketMessage>(`/admin/tickets/${id}/internal-note`, { body }),
} as const;
