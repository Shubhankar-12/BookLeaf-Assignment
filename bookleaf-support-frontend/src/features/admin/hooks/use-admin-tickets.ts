"use client";

import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { toast } from "sonner";

import { queryKeys } from "@/lib/query-keys";
import { ApiException } from "@/services/api/client";
import {
  adminApi,
  type AdminListTicketsParams,
} from "@/services/api/admin.api";
import type {
  TicketCategory,
  TicketPriority,
  TicketStatus,
} from "@/constants/ticket";
import type { AdminTicketDetail } from "@/types/ticket";

// PATCH endpoints (status/category/priority/assign) return a slim ticket DTO
// that doesn't include messages/activity/attachments. Merge into the cached
// detail so downstream consumers don't see undefined nested fields.
function mergeTicketDetail(
  queryClient: ReturnType<typeof useQueryClient>,
  id: string,
  patch: Partial<AdminTicketDetail>,
) {
  queryClient.setQueryData<AdminTicketDetail>(
    queryKeys.admin.tickets.detail(id),
    (prev) => (prev ? { ...prev, ...patch } : prev),
  );
}

export function useAdminTickets(params?: AdminListTicketsParams) {
  return useQuery({
    queryKey: queryKeys.admin.tickets.list(params),
    queryFn: () => adminApi.listTickets(params),
  });
}

export function useAdminTicket(id: string) {
  return useQuery({
    queryKey: queryKeys.admin.tickets.detail(id),
    queryFn: () => adminApi.getTicket(id),
    enabled: !!id,
  });
}

function buildMutation<T>(label: string) {
  return label as T;
}

function asApiError(label: string, err: unknown): string {
  if (err instanceof ApiException) return err.message;
  return `Couldn't ${label}`;
}

export function useUpdateStatus(id: string) {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (status: TicketStatus) => adminApi.updateStatus(id, status),
    onSuccess: (data) => {
      mergeTicketDetail(queryClient, id, data);
      queryClient.invalidateQueries({ queryKey: queryKeys.admin.tickets.all });
      toast.success("Status updated");
    },
    onError: (err) => toast.error(asApiError("update status", err)),
  });
}

export function useUpdateCategory(id: string) {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (category: TicketCategory) =>
      adminApi.updateCategory(id, category),
    onSuccess: (data) => {
      mergeTicketDetail(queryClient, id, data);
      queryClient.invalidateQueries({ queryKey: queryKeys.admin.tickets.all });
      toast.success("Category overridden");
    },
    onError: (err) => toast.error(asApiError("update category", err)),
  });
}

export function useUpdatePriority(id: string) {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (priority: TicketPriority) =>
      adminApi.updatePriority(id, priority),
    onSuccess: (data) => {
      mergeTicketDetail(queryClient, id, data);
      queryClient.invalidateQueries({ queryKey: queryKeys.admin.tickets.all });
      toast.success("Priority overridden");
    },
    onError: (err) => toast.error(asApiError("update priority", err)),
  });
}

export function useAssignTicket(id: string) {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (assigneeId: string | null) => adminApi.assign(id, assigneeId),
    onSuccess: (data) => {
      mergeTicketDetail(queryClient, id, data);
      queryClient.invalidateQueries({ queryKey: queryKeys.admin.tickets.all });
      toast.success("Assignment updated");
    },
    onError: (err) => toast.error(asApiError("assign", err)),
  });
}

export function useAdminRespond(id: string) {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (body: string) => adminApi.respond(id, body),
    onSuccess: () => {
      // Realtime message:new will normally patch the cache, but refetch anyway
      // so admins relying on the activity log see the new entry.
      queryClient.invalidateQueries({
        queryKey: queryKeys.admin.tickets.detail(id),
      });
    },
    onError: (err) => toast.error(asApiError("send reply", err)),
  });
}

export function useAdminInternalNote(id: string) {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (body: string) => adminApi.internalNote(id, body),
    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: queryKeys.admin.tickets.detail(id),
      });
      toast.success("Internal note saved");
    },
    onError: (err) => toast.error(asApiError("save note", err)),
  });
}

// Suppress unused TS warning for the generic helper that future hooks may use.
buildMutation;
