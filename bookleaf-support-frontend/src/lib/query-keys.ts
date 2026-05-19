/**
 * Centralized TanStack Query key catalog. Co-located so cache invalidation
 * across features stays consistent — a feature module that needs to invalidate
 * another's queries imports the key factory instead of stringly-typed keys.
 */

import type { AdminListTicketsParams } from "@/services/api/admin.api";
import type { ListTicketsParams } from "@/services/api/tickets.api";

export const queryKeys = {
  auth: {
    me: ["auth", "me"] as const,
  },
  books: {
    all: ["books"] as const,
    list: (params?: { page?: number; limit?: number }) =>
      ["books", "list", params ?? {}] as const,
    detail: (id: string) => ["books", "detail", id] as const,
  },
  tickets: {
    all: ["tickets"] as const,
    list: (params?: ListTicketsParams) =>
      ["tickets", "list", params ?? {}] as const,
    detail: (id: string) => ["tickets", "detail", id] as const,
  },
  admin: {
    all: ["admin"] as const,
    tickets: {
      all: ["admin", "tickets"] as const,
      list: (params?: AdminListTicketsParams) =>
        ["admin", "tickets", "list", params ?? {}] as const,
      detail: (id: string) => ["admin", "tickets", "detail", id] as const,
    },
  },
} as const;
