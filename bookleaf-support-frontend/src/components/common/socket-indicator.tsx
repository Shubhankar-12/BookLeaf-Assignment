"use client";

import { useSocketStore } from "@/store/socket.store";
import { cn } from "@/lib/utils";

const COPY = {
  idle: { label: "Offline", tone: "bg-muted-foreground/40" },
  connecting: { label: "Connecting", tone: "bg-amber-500 animate-pulse" },
  connected: { label: "Live", tone: "bg-emerald-500" },
  disconnected: { label: "Reconnecting", tone: "bg-amber-500 animate-pulse" },
} as const;

export function SocketIndicator() {
  const status = useSocketStore((s) => s.status);
  const meta = COPY[status];
  return (
    <div className="flex items-center gap-2 rounded-full border bg-muted/40 px-3 py-1 text-xs">
      <span className={cn("h-2 w-2 rounded-full", meta.tone)} />
      <span className="text-muted-foreground">{meta.label}</span>
    </div>
  );
}
