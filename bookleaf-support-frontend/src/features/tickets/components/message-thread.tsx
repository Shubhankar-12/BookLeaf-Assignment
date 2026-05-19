"use client";

import { Bot, FileText, Lock, ShieldCheck, UserCircle } from "lucide-react";

import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { cn, initials } from "@/lib/utils";
import { relativeTime } from "@/lib/date";
import type { TicketMessage } from "@/types/ticket";

interface MessageThreadProps {
  messages: TicketMessage[];
  selfName: string;
  selfRole: "AUTHOR" | "ADMIN";
}

const ROLE_LABEL: Record<TicketMessage["senderType"], string> = {
  AUTHOR: "Author",
  ADMIN: "BookLeaf Support",
  SYSTEM: "System",
};

export function MessageThread({
  messages,
  selfName,
  selfRole,
}: MessageThreadProps) {
  if (!messages.length) {
    return (
      <div className="flex flex-col items-center gap-2 rounded-lg border border-dashed bg-muted/20 px-4 py-12 text-center">
        <FileText className="h-5 w-5 text-muted-foreground" />
        <p className="text-sm text-muted-foreground">
          No messages yet — replies appear here in real time.
        </p>
      </div>
    );
  }

  return (
    <ol className="space-y-4">
      {messages.map((m) => {
        const isSelf =
          (m.senderType === "AUTHOR" && selfRole === "AUTHOR") ||
          (m.senderType === "ADMIN" && selfRole === "ADMIN");
        const isSystem = m.senderType === "SYSTEM";
        const isInternal = m.internalOnly === true;
        return (
          <li
            key={m.id}
            className={cn(
              "flex gap-3",
              isSelf && "flex-row-reverse text-right",
            )}
          >
            <Avatar className="h-8 w-8 shrink-0">
              <AvatarFallback
                className={cn(
                  "text-[10px] font-semibold",
                  m.senderType === "ADMIN" && "bg-primary/10 text-primary",
                  m.senderType === "AUTHOR" && "bg-muted text-foreground",
                  isSystem && "bg-amber-500/20 text-amber-700",
                )}
              >
                {isSystem ? (
                  <Bot className="h-4 w-4" />
                ) : isSelf ? (
                  initials(selfName)
                ) : m.senderType === "ADMIN" ? (
                  <ShieldCheck className="h-4 w-4" />
                ) : (
                  <UserCircle className="h-4 w-4" />
                )}
              </AvatarFallback>
            </Avatar>

            <div
              className={cn(
                "max-w-[80%] rounded-2xl border px-4 py-3 text-sm shadow-sm",
                isSelf
                  ? "bg-primary text-primary-foreground"
                  : "bg-card",
                isInternal && "border-amber-500/40 bg-amber-500/10 text-foreground",
              )}
            >
              <div className="mb-1 flex flex-wrap items-center gap-2 text-[11px] opacity-80">
                <span className="font-medium">
                  {isSelf ? "You" : ROLE_LABEL[m.senderType]}
                </span>
                {isInternal ? (
                  <span className="inline-flex items-center gap-1 rounded bg-amber-500/30 px-1.5 py-0.5 font-medium text-amber-900 dark:text-amber-200">
                    <Lock className="h-3 w-3" />
                    Internal note
                  </span>
                ) : null}
                <span>·</span>
                <span>{relativeTime(m.createdAt)}</span>
              </div>
              <p className="whitespace-pre-wrap break-words leading-relaxed">
                {m.body}
              </p>
            </div>
          </li>
        );
      })}
    </ol>
  );
}
