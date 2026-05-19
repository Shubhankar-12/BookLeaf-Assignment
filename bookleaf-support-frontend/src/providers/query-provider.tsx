"use client";

import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { ReactQueryDevtools } from "@tanstack/react-query-devtools";
import { useState, type ReactNode } from "react";

import { ApiException } from "@/services/api/client";

/**
 * Global query client. Defaults tuned for an operational dashboard:
 *   - 30s stale time so visiting a page twice in quick succession is instant
 *   - refetchOnWindowFocus stays on (default) — operators expect freshness
 *   - Don't retry 4xx, do retry transient 5xx once
 */
function makeClient() {
  return new QueryClient({
    defaultOptions: {
      queries: {
        staleTime: 30_000,
        gcTime: 5 * 60_000,
        retry: (failureCount, error) => {
          if (error instanceof ApiException) {
            if (error.status >= 400 && error.status < 500) return false;
          }
          return failureCount < 1;
        },
        refetchOnWindowFocus: true,
      },
      mutations: {
        retry: false,
      },
    },
  });
}

export function QueryProvider({ children }: { children: ReactNode }) {
  const [client] = useState(() => makeClient());
  return (
    <QueryClientProvider client={client}>
      {children}
      {process.env.NODE_ENV === "development" ? (
        <ReactQueryDevtools initialIsOpen={false} buttonPosition="bottom-left" />
      ) : null}
    </QueryClientProvider>
  );
}
