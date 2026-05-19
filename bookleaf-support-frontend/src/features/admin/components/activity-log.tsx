import {
  Bot,
  CircleCheck,
  History,
  Sparkles,
  UserCog,
  type LucideIcon,
} from "lucide-react";

import { relativeTime } from "@/lib/date";
import type { ActivityEntry } from "@/types/ticket";

const ICONS: Record<ActivityEntry["type"], LucideIcon> = {
  TICKET_CREATED: Sparkles,
  STATUS_CHANGED: CircleCheck,
  CATEGORY_CHANGED: UserCog,
  PRIORITY_CHANGED: UserCog,
  ASSIGNED: UserCog,
  MESSAGE_ADDED: History,
  INTERNAL_NOTE_ADDED: History,
  AI_CLASSIFIED: Bot,
};

const LABEL: Record<ActivityEntry["type"], string> = {
  TICKET_CREATED: "Ticket created",
  STATUS_CHANGED: "Status changed",
  CATEGORY_CHANGED: "Category changed",
  PRIORITY_CHANGED: "Priority changed",
  ASSIGNED: "Assignment updated",
  MESSAGE_ADDED: "Reply sent",
  INTERNAL_NOTE_ADDED: "Internal note added",
  AI_CLASSIFIED: "AI classified",
};

function describeChange(entry: ActivityEntry): string | null {
  if (entry.before === undefined && entry.after === undefined) return null;
  const fmt = (v: unknown) => {
    if (v === null) return "—";
    if (v === undefined) return "—";
    if (typeof v === "string") return v;
    return JSON.stringify(v);
  };
  if (entry.before === undefined) return fmt(entry.after);
  if (entry.after === undefined) return fmt(entry.before);
  return `${fmt(entry.before)} → ${fmt(entry.after)}`;
}

export function ActivityLog({ entries }: { entries: ActivityEntry[] }) {
  if (!entries.length) {
    return (
      <p className="text-xs text-muted-foreground">
        No activity recorded yet.
      </p>
    );
  }

  return (
    <ol className="space-y-3">
      {entries.map((entry) => {
        const Icon = ICONS[entry.type] ?? History;
        const change = describeChange(entry);
        return (
          <li key={entry.id} className="flex gap-3 text-xs">
            <div
              className={`mt-0.5 flex h-7 w-7 shrink-0 items-center justify-center rounded-full border ${
                entry.actorType === "AI"
                  ? "border-primary/30 bg-primary/10 text-primary"
                  : entry.actorType === "SYSTEM"
                    ? "border-amber-500/30 bg-amber-500/10 text-amber-700"
                    : "border-muted bg-muted text-foreground"
              }`}
            >
              <Icon className="h-3.5 w-3.5" />
            </div>
            <div className="min-w-0 flex-1 space-y-1">
              <p className="font-medium text-foreground">{LABEL[entry.type]}</p>
              {change ? (
                <p className="break-all font-mono text-[11px] text-muted-foreground">
                  {change}
                </p>
              ) : null}
              <p className="text-[11px] text-muted-foreground">
                {entry.actorType.toLowerCase()} ·{" "}
                {relativeTime(entry.createdAt)}
              </p>
            </div>
          </li>
        );
      })}
    </ol>
  );
}
