import { Badge } from "@/components/ui/badge";
import {
  PRIORITY_LABEL,
  STATUS_LABEL,
  type TicketPriority,
  type TicketStatus,
} from "@/constants/ticket";
import { cn } from "@/lib/utils";

const STATUS_STYLES: Record<TicketStatus, string> = {
  OPEN: "bg-blue-500/15 text-blue-600 dark:text-blue-400",
  IN_PROGRESS: "bg-violet-500/15 text-violet-600 dark:text-violet-400",
  WAITING_FOR_AUTHOR: "bg-amber-500/15 text-amber-700 dark:text-amber-400",
  RESOLVED: "bg-emerald-500/15 text-emerald-600 dark:text-emerald-400",
  CLOSED: "bg-muted text-muted-foreground",
};

const PRIORITY_STYLES: Record<TicketPriority, string> = {
  LOW: "bg-slate-500/15 text-slate-600 dark:text-slate-300",
  MEDIUM: "bg-blue-500/15 text-blue-600 dark:text-blue-400",
  HIGH: "bg-orange-500/15 text-orange-600 dark:text-orange-400",
  CRITICAL: "bg-red-500/15 text-red-600 dark:text-red-400",
};

export function TicketStatusBadge({
  status,
  className,
}: {
  status: TicketStatus;
  className?: string;
}) {
  return (
    <Badge
      variant="outline"
      className={cn("border-transparent font-medium", STATUS_STYLES[status], className)}
    >
      {STATUS_LABEL[status]}
    </Badge>
  );
}

export function TicketPriorityBadge({
  priority,
  className,
}: {
  priority: TicketPriority | null;
  className?: string;
}) {
  if (!priority) {
    return (
      <Badge variant="outline" className={cn("text-muted-foreground", className)}>
        Pending
      </Badge>
    );
  }
  return (
    <Badge
      variant="outline"
      className={cn(
        "border-transparent font-medium",
        PRIORITY_STYLES[priority],
        className,
      )}
    >
      {PRIORITY_LABEL[priority]}
    </Badge>
  );
}

export function TicketCategoryBadge({
  category,
  className,
}: {
  category: string | null;
  className?: string;
}) {
  if (!category) {
    return (
      <Badge variant="outline" className={cn("text-muted-foreground", className)}>
        Classifying…
      </Badge>
    );
  }
  return (
    <Badge variant="muted" className={cn("font-medium", className)}>
      {category}
    </Badge>
  );
}
