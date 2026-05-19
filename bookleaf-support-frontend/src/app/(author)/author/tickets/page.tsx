"use client";

import { Plus } from "lucide-react";
import Link from "next/link";
import { useState } from "react";

import { EmptyState } from "@/components/common/empty-state";
import { ErrorState } from "@/components/common/error-state";
import { PageHeader } from "@/components/common/page-header";
import { Button } from "@/components/ui/button";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Skeleton } from "@/components/ui/skeleton";
import { STATUS_LABEL, TICKET_STATUSES, type TicketStatus } from "@/constants/ticket";
import { TicketRow, useAuthorTickets } from "@/features/tickets";

const ALL = "__all";

export default function AuthorTicketsPage() {
  const [status, setStatus] = useState<string>(ALL);
  const { data, isLoading, isError, refetch } = useAuthorTickets({
    page: 1,
    limit: 50,
    status: status === ALL ? undefined : (status as TicketStatus),
  });

  return (
    <>
      <PageHeader
        title="Your tickets"
        description="Track support requests across every category. Realtime updates."
        actions={
          <Button asChild>
            <Link href="/author/support/new" className="gap-2">
              <Plus className="h-4 w-4" /> New ticket
            </Link>
          </Button>
        }
      />

      <div className="flex items-center gap-3">
        <Select value={status} onValueChange={setStatus}>
          <SelectTrigger className="w-48">
            <SelectValue placeholder="All statuses" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value={ALL}>All statuses</SelectItem>
            {TICKET_STATUSES.map((s) => (
              <SelectItem key={s} value={s}>
                {STATUS_LABEL[s]}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
        {data ? (
          <p className="text-xs text-muted-foreground">
            {data.total} ticket{data.total === 1 ? "" : "s"}
          </p>
        ) : null}
      </div>

      {isLoading ? (
        <div className="space-y-2">
          {[0, 1, 2, 3].map((i) => (
            <Skeleton key={i} className="h-16" />
          ))}
        </div>
      ) : isError ? (
        <ErrorState onRetry={() => refetch()} />
      ) : data?.data.length ? (
        <ul className="space-y-2">
          {data.data.map((t) => (
            <li key={t.id}>
              <TicketRow ticket={t} href={`/author/tickets/${t.id}`} />
            </li>
          ))}
        </ul>
      ) : (
        <EmptyState
          title="No tickets here"
          description={
            status === ALL
              ? "Open your first ticket and we'll route it to the right team."
              : `No tickets in the ${STATUS_LABEL[status as TicketStatus]} state.`
          }
          action={
            <Button asChild>
              <Link href="/author/support/new">New ticket</Link>
            </Button>
          }
        />
      )}
    </>
  );
}
