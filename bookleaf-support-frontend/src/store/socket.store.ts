"use client";

import { create } from "zustand";

export type SocketStatus = "idle" | "connecting" | "connected" | "disconnected";

interface SocketState {
  status: SocketStatus;
  lastError: string | null;
  setStatus: (status: SocketStatus) => void;
  setError: (error: string | null) => void;
}

export const useSocketStore = create<SocketState>((set) => ({
  status: "idle",
  lastError: null,
  setStatus: (status) => set({ status }),
  setError: (error) => set({ lastError: error }),
}));
