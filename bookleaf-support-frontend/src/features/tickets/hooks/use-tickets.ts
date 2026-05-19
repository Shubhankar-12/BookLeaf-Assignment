"use client";

import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { toast } from "sonner";

import { queryKeys } from "@/lib/query-keys";
import { ApiException } from "@/services/api/client";
import {
  ticketsApi,
  type AddMessagePayload,
  type CreateTicketPayload,
  type ListTicketsParams,
} from "@/services/api/tickets.api";

export function useAuthorTickets(params?: ListTicketsParams) {
  return useQuery({
    queryKey: queryKeys.tickets.list(params),
    queryFn: () => ticketsApi.list(params),
  });
}

export function useAuthorTicket(id: string) {
  return useQuery({
    queryKey: queryKeys.tickets.detail(id),
    queryFn: () => ticketsApi.get(id),
    enabled: !!id,
  });
}

export function useCreateTicket() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (payload: CreateTicketPayload) => ticketsApi.create(payload),
    onSuccess: (data) => {
      queryClient.invalidateQueries({ queryKey: queryKeys.tickets.all });
      queryClient.setQueryData(queryKeys.tickets.detail(data.id), data);
      toast.success("Ticket submitted");
    },
    onError: (err) => {
      toast.error(
        err instanceof ApiException ? err.message : "Couldn't submit ticket",
      );
    },
  });
}

export function useAddMessage(ticketId: string) {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (payload: AddMessagePayload) =>
      ticketsApi.addMessage(ticketId, payload),
    onSuccess: () => {
      // Socket `message:new` will normally patch the cache first, but in case
      // the user reloaded between submit and the realtime hop we re-fetch.
      queryClient.invalidateQueries({
        queryKey: queryKeys.tickets.detail(ticketId),
      });
    },
    onError: (err) => {
      toast.error(
        err instanceof ApiException ? err.message : "Couldn't send reply",
      );
    },
  });
}
