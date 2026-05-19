import { ChevronRight, UserRound } from "lucide-react";
import Link from "next/link";

import {
  TicketCategoryBadge,
  TicketPriorityBadge,
  TicketStatusBadge,
} from "@/components/common/status-badge";
import { relativeTime } from "@/lib/date";
import type { AdminTicketListItem } from "@/types/ticket";

export function AdminTicketRow({ ticket }: { ticket: AdminTicketListItem }) {
  return (
    <Link
      href={`/admin/tickets/${ticket.id}`}
      className="group grid grid-cols-[1fr_auto] items-center gap-4 rounded-lg border bg-card px-4 py-3 transition-colors hover:border-primary/40 hover:bg-muted/40 md:grid-cols-[1fr_auto_auto]"
    >
      <div className="min-w-0 space-y-1">
        <div className="flex items-center gap-2">
          <p className="truncate font-medium">{ticket.subject}</p>
        </div>
        <div className="flex flex-wrap items-center gap-2 text-xs text-muted-foreground">
          <TicketStatusBadge status={ticket.status} />
          <TicketPriorityBadge priority={ticket.priority} />
          <TicketCategoryBadge category={ticket.category} />
          <span>· Updated {relativeTime(ticket.updatedAt)}</span>
        </div>
      </div>

      <div className="hidden items-center gap-1.5 text-xs text-muted-foreground md:flex">
        <UserRound className="h-3 w-3" />
        {ticket.assignedTo ? "Assigned" : "Unassigned"}
      </div>

      <ChevronRight className="h-4 w-4 text-muted-foreground transition-transform group-hover:translate-x-0.5" />
    </Link>
  );
}
