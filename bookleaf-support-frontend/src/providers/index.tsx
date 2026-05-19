"use client";

import type { ReactNode } from "react";

import { AuthProvider } from "./auth-provider";
import { QueryProvider } from "./query-provider";
import { SocketProvider } from "@/sockets/socket-provider";
import { ToastProvider } from "./toast-provider";

export function AppProviders({ children }: { children: ReactNode }) {
  return (
    <QueryProvider>
      <AuthProvider>
        <SocketProvider>{children}</SocketProvider>
        <ToastProvider />
      </AuthProvider>
    </QueryProvider>
  );
}
