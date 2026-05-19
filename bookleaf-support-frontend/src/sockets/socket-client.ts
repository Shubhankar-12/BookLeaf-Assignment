"use client";

import { io, type Socket } from "socket.io-client";

import { env } from "@/config/env";

/**
 * Lazily-constructed socket. The provider connects/disconnects per session
 * (token change, logout, auth gate failure) — this module is the singleton
 * holder so React's strict-mode double-mount can't multiplex connections.
 */
let socket: Socket | null = null;

export function connectSocket(token: string): Socket {
  if (socket?.connected) return socket;
  socket?.disconnect();

  socket = io(env.SOCKET_URL, {
    auth: { token },
    transports: ["websocket"],
    reconnection: true,
    reconnectionAttempts: 5,
    reconnectionDelay: 1000,
    autoConnect: true,
  });
  return socket;
}

export function disconnectSocket(): void {
  socket?.disconnect();
  socket = null;
}

export function getSocket(): Socket | null {
  return socket;
}
