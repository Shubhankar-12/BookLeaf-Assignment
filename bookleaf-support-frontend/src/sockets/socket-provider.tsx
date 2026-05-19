"use client";

import { useQueryClient } from "@tanstack/react-query";
import { useRouter } from "next/navigation";
import { useEffect, type ReactNode } from "react";
import { toast } from "sonner";

import { queryKeys } from "@/lib/query-keys";
import { useAuthStore } from "@/store/auth.store";
import { useSocketStore } from "@/store/socket.store";
import type {
  MessageNewPayload,
  TicketCreatedPayload,
  TicketUpdatedPayload,
} from "@/types/socket";
import type { AdminTicketDetail, AuthorTicketDetail } from "@/types/ticket";

import { connectSocket, disconnectSocket } from "./socket-client";

const TICKET_CREATED = "ticket:created";
const TICKET_UPDATED = "ticket:updated";
const MESSAGE_NEW = "message:new";

/** Socket auth-failure messages emitted by the server (see backend
 * sockets/auth.middleware.ts). When we see one of these we treat the
 * session as expired. */
const AUTH_ERROR_MESSAGES = new Set(["Unauthorized", "jwt expired"]);

function isAuthError(message: string): boolean {
  if (AUTH_ERROR_MESSAGES.has(message)) return true;
  const lower = message.toLowerCase();
  return (
    lower.includes("unauthor") ||
    lower.includes("jwt") ||
    lower.includes("expired") ||
    lower.includes("token")
  );
}

/**
 * Mounts a single Socket.IO connection per authenticated session, and bridges
 * the three server events into the TanStack Query cache so every consumer
 * (lists, detail pages, badges) refreshes without a manual refetch button.
 *
 * Strategy:
 *   - ticket:created → invalidate ticket list queries
 *   - ticket:updated → patch the detail cache + invalidate list (status / priority
 *                      filters may now match or stop matching)
 *   - message:new    → append to the detail cache's `messages` array if cached,
 *                      otherwise invalidate so the next read pulls fresh state.
 *   - connect_error  → if the server says "Unauthorized" (expired JWT etc.),
 *                      clear the auth store, toast the user, and bounce to /login.
 */
export function SocketProvider({ children }: { children: ReactNode }) {
  const token = useAuthStore((s) => s.token);
  const role = useAuthStore((s) => s.user?.role);
  const clearAuth = useAuthStore((s) => s.clear);
  const setStatus = useSocketStore((s) => s.setStatus);
  const setError = useSocketStore((s) => s.setError);
  const queryClient = useQueryClient();
  const router = useRouter();

  useEffect(() => {
    if (!token) {
      disconnectSocket();
      setStatus("idle");
      return;
    }

    setStatus("connecting");
    const socket = connectSocket(token);

    const onConnect = () => {
      setStatus("connected");
      setError(null);
    };
    const onDisconnect = () => setStatus("disconnected");

    const onConnectError = (err: Error) => {
      setStatus("disconnected");
      setError(err.message);
      if (isAuthError(err.message)) {
        // Stop reconnect attempts — the token isn't going to get any newer.
        disconnectSocket();
        clearAuth();
        toast.error("Your session expired. Please sign in again.");
        router.replace("/login");
      }
    };

    const onTicketCreated = (_payload: TicketCreatedPayload) => {
      if (role === "ADMIN") {
        queryClient.invalidateQueries({ queryKey: queryKeys.admin.tickets.all });
      } else {
        queryClient.invalidateQueries({ queryKey: queryKeys.tickets.all });
      }
    };

    const onTicketUpdated = (payload: TicketUpdatedPayload) => {
      // Patch detail caches in place — this avoids a refetch round-trip and
      // keeps the open ticket view in sync the instant another admin acts.
      if (role === "ADMIN") {
        queryClient.setQueryData<AdminTicketDetail | undefined>(
          queryKeys.admin.tickets.detail(payload.ticketId),
          (prev) => (prev ? { ...prev, ...payload.changes } : prev),
        );
        queryClient.invalidateQueries({
          queryKey: queryKeys.admin.tickets.all,
        });
      } else {
        queryClient.setQueryData<AuthorTicketDetail | undefined>(
          queryKeys.tickets.detail(payload.ticketId),
          (prev) =>
            prev
              ? {
                  ...prev,
                  status: payload.changes.status ?? prev.status,
                  category: payload.changes.category ?? prev.category,
                  priority: payload.changes.priority ?? prev.priority,
                }
              : prev,
        );
        queryClient.invalidateQueries({ queryKey: queryKeys.tickets.all });
      }
    };

    const onMessageNew = (payload: MessageNewPayload) => {
      const isAdmin = role === "ADMIN";
      const detailKey = isAdmin
        ? queryKeys.admin.tickets.detail(payload.ticketId)
        : queryKeys.tickets.detail(payload.ticketId);

      type AnyTicket = AdminTicketDetail | AuthorTicketDetail;
      queryClient.setQueryData<AnyTicket | undefined>(detailKey, (prev) => {
        if (!prev) return prev;
        const existing = prev.messages ?? [];
        if (existing.some((m) => m.id === payload.messageId)) return prev;
        return {
          ...prev,
          messages: [
            ...existing,
            {
              id: payload.messageId,
              ticketId: payload.ticketId,
              senderType: payload.senderType,
              senderId: payload.senderId,
              body: payload.body,
              internalOnly: payload.internalOnly,
              createdAt: payload.createdAt,
            },
          ],
        };
      });
    };

    socket.on("connect", onConnect);
    socket.on("disconnect", onDisconnect);
    socket.on("connect_error", onConnectError);
    socket.on(TICKET_CREATED, onTicketCreated);
    socket.on(TICKET_UPDATED, onTicketUpdated);
    socket.on(MESSAGE_NEW, onMessageNew);

    return () => {
      socket.off("connect", onConnect);
      socket.off("disconnect", onDisconnect);
      socket.off("connect_error", onConnectError);
      socket.off(TICKET_CREATED, onTicketCreated);
      socket.off(TICKET_UPDATED, onTicketUpdated);
      socket.off(MESSAGE_NEW, onMessageNew);
    };
  }, [token, role, queryClient, setError, setStatus, clearAuth, router]);

  return <>{children}</>;
}
