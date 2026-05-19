import { ChevronRight } from "lucide-react";
import Link from "next/link";

import {
  TicketCategoryBadge,
  TicketPriorityBadge,
  TicketStatusBadge,
} from "@/components/common/status-badge";
import { relativeTime } from "@/lib/date";
import type { AuthorTicketListItem, AdminTicketListItem } from "@/types/ticket";

interface TicketRowProps {
  ticket: AuthorTicketListItem | AdminTicketListItem;
  href: string;
}

export function TicketRow({ ticket, href }: TicketRowProps) {
  return (
    <Link
      href={href}
      className="group flex items-center justify-between gap-4 rounded-lg border bg-card px-4 py-3 transition-colors hover:border-primary/40 hover:bg-muted/40"
    >
      <div className="min-w-0 flex-1 space-y-1">
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
      <ChevronRight className="h-4 w-4 shrink-0 text-muted-foreground transition-transform group-hover:translate-x-0.5 group-hover:text-foreground" />
    </Link>
  );
}
