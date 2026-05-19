"use client";

import { BookOpen, IndianRupee, MessageSquareText, TimerReset } from "lucide-react";
import Link from "next/link";

import { EmptyState } from "@/components/common/empty-state";
import { PageHeader } from "@/components/common/page-header";
import {
  TicketCategoryBadge,
  TicketPriorityBadge,
  TicketStatusBadge,
} from "@/components/common/status-badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";
import { useBooks } from "@/features/books";
import { useAuthorTickets } from "@/features/tickets";
import { relativeTime } from "@/lib/date";
import { formatCurrency } from "@/lib/utils";
import { useAuthStore } from "@/store/auth.store";

function StatCard({
  icon: Icon,
  label,
  value,
  hint,
  loading,
}: {
  icon: typeof BookOpen;
  label: string;
  value: string;
  hint?: string;
  loading?: boolean;
}) {
  return (
    <Card>
      <CardContent className="flex items-center justify-between p-5">
        <div className="space-y-1">
          <p className="text-xs uppercase tracking-wider text-muted-foreground">
            {label}
          </p>
          {loading ? (
            <Skeleton className="h-7 w-24" />
          ) : (
            <p className="text-2xl font-semibold">{value}</p>
          )}
          {hint ? (
            <p className="text-xs text-muted-foreground">{hint}</p>
          ) : null}
        </div>
        <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-primary/10 text-primary">
          <Icon className="h-5 w-5" />
        </div>
      </CardContent>
    </Card>
  );
}

export default function AuthorDashboardPage() {
  const user = useAuthStore((s) => s.user);
  const booksQuery = useBooks({ page: 1, limit: 100 });
  const ticketsQuery = useAuthorTickets({ page: 1, limit: 5 });

  const totalBooks = booksQuery.data?.total ?? 0;
  const totalRoyalty =
    booksQuery.data?.data.reduce(
      (sum, b) => sum + (b.total_royalty_earned ?? 0),
      0,
    ) ?? 0;
  const totalPending =
    booksQuery.data?.data.reduce(
      (sum, b) => sum + (b.royalty_pending ?? 0),
      0,
    ) ?? 0;
  const royaltyCurrency = booksQuery.data?.data[0]?.currency ?? "INR";

  const openTickets =
    ticketsQuery.data?.data.filter((t) =>
      ["OPEN", "IN_PROGRESS", "WAITING_FOR_AUTHOR"].includes(t.status),
    ).length ?? 0;

  return (
    <>
      <PageHeader
        title={user ? `Welcome back, ${user.name.split(" ")[0]}` : "Welcome"}
        description="Your operational snapshot — royalties, books, and active support."
        actions={
          <Button asChild>
            <Link href="/author/support/new">New ticket</Link>
          </Button>
        }
      />

      <section className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
        <StatCard
          icon={BookOpen}
          label="Active books"
          value={totalBooks.toString()}
          hint="Across all editions"
          loading={booksQuery.isLoading}
        />
        <StatCard
          icon={IndianRupee}
          label="Total royalties"
          value={formatCurrency(totalRoyalty, royaltyCurrency)}
          hint="Lifetime accumulated"
          loading={booksQuery.isLoading}
        />
        <StatCard
          icon={MessageSquareText}
          label="Open tickets"
          value={openTickets.toString()}
          hint="Includes waiting on you"
          loading={ticketsQuery.isLoading}
        />
        <StatCard
          icon={TimerReset}
          label="Pending payouts"
          value={formatCurrency(totalPending, royaltyCurrency)}
          hint="Cleared next quarterly cycle"
          loading={booksQuery.isLoading}
        />
      </section>

      <section className="space-y-3">
        <div className="flex items-center justify-between">
          <h2 className="text-lg font-semibold">Recent tickets</h2>
          <Button asChild variant="ghost" size="sm">
            <Link href="/author/tickets">View all</Link>
          </Button>
        </div>
        {ticketsQuery.isLoading ? (
          <div className="space-y-2">
            {[0, 1, 2].map((i) => (
              <Skeleton key={i} className="h-16 w-full" />
            ))}
          </div>
        ) : ticketsQuery.data?.data.length ? (
          <ul className="space-y-2">
            {ticketsQuery.data.data.slice(0, 5).map((t) => (
              <li key={t.id}>
                <Link
                  href={`/author/tickets/${t.id}`}
                  className="flex items-center justify-between rounded-lg border bg-card px-4 py-3 transition-colors hover:border-primary/40 hover:bg-muted/40"
                >
                  <div className="min-w-0 flex-1 space-y-1">
                    <p className="truncate font-medium">{t.subject}</p>
                    <div className="flex flex-wrap items-center gap-2 text-xs text-muted-foreground">
                      <TicketStatusBadge status={t.status} />
                      <TicketPriorityBadge priority={t.priority} />
                      <TicketCategoryBadge category={t.category} />
                      <span>· Updated {relativeTime(t.updatedAt)}</span>
                    </div>
                  </div>
                </Link>
              </li>
            ))}
          </ul>
        ) : (
          <EmptyState
            title="No tickets yet"
            description="Open a ticket when you need help with royalties, ISBN, distribution, or anything else."
            action={
              <Button asChild>
                <Link href="/author/support/new">Create your first ticket</Link>
              </Button>
            }
          />
        )}
      </section>
    </>
  );
}
