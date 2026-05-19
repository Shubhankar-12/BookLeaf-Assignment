"use client";

import { Inbox } from "lucide-react";
import { useState } from "react";

import { EmptyState } from "@/components/common/empty-state";
import { ErrorState } from "@/components/common/error-state";
import { PageHeader } from "@/components/common/page-header";
import { Button } from "@/components/ui/button";
import { Skeleton } from "@/components/ui/skeleton";
import {
  AdminTicketRow,
  TicketFilters,
  type AdminFilterState,
  useAdminTickets,
} from "@/features/admin";

const PAGE_SIZE = 20;

export default function AdminTicketsPage() {
  const [filters, setFilters] = useState<AdminFilterState>({});
  const [page, setPage] = useState(1);

  const { data, isLoading, isError, refetch, isFetching } = useAdminTickets({
    page,
    limit: PAGE_SIZE,
    ...filters,
  });

  const total = data?.total ?? 0;
  const pageCount = Math.max(1, Math.ceil(total / PAGE_SIZE));

  return (
    <>
      <PageHeader
        title="Ticket queue"
        description={
          total
            ? `${total.toLocaleString()} ticket${total === 1 ? "" : "s"} match the current filters.`
            : "All author tickets across BookLeaf."
        }
      />

      <TicketFilters
        value={filters}
        onChange={(next) => {
          setFilters(next);
          setPage(1);
        }}
      />

      {isLoading ? (
        <div className="space-y-2">
          {[0, 1, 2, 3, 4].map((i) => (
            <Skeleton key={i} className="h-16" />
          ))}
        </div>
      ) : isError ? (
        <ErrorState onRetry={() => refetch()} />
      ) : data?.data.length ? (
        <>
          <ul className="space-y-2">
            {data.data.map((t) => (
              <li key={t.id}>
                <AdminTicketRow ticket={t} />
              </li>
            ))}
          </ul>
          {pageCount > 1 ? (
            <nav className="flex items-center justify-between pt-2 text-xs text-muted-foreground">
              <span>
                Page {page} of {pageCount}
                {isFetching ? " · updating…" : ""}
              </span>
              <div className="flex items-center gap-2">
                <Button
                  variant="outline"
                  size="sm"
                  disabled={page <= 1 || isFetching}
                  onClick={() => setPage((p) => Math.max(1, p - 1))}
                >
                  Previous
                </Button>
                <Button
                  variant="outline"
                  size="sm"
                  disabled={page >= pageCount || isFetching}
                  onClick={() => setPage((p) => Math.min(pageCount, p + 1))}
                >
                  Next
                </Button>
              </div>
            </nav>
          ) : null}
        </>
      ) : (
        <EmptyState
          icon={Inbox}
          title="No tickets match"
          description="Adjust the filters or come back when new tickets arrive."
        />
      )}
    </>
  );
}
