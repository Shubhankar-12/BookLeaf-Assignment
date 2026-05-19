"use client";

import {
  Activity,
  AlertOctagon,
  CheckCircle2,
  Clock,
  Inbox,
  Sparkles,
} from "lucide-react";
import Link from "next/link";

import { ErrorState } from "@/components/common/error-state";
import { PageHeader } from "@/components/common/page-header";
import {
  TicketCategoryBadge,
  TicketPriorityBadge,
  TicketStatusBadge,
} from "@/components/common/status-badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";
import { useAdminTickets } from "@/features/admin";
import { relativeTime } from "@/lib/date";
import { useAuthStore } from "@/store/auth.store";

function Stat({
  icon: Icon,
  label,
  value,
  hint,
  tone,
  loading,
}: {
  icon: typeof Inbox;
  label: string;
  value: string;
  hint?: string;
  tone?: string;
  loading?: boolean;
}) {
  return (
    <Card>
      <CardContent className="flex items-center gap-4 p-5">
        <div
          className={`flex h-10 w-10 items-center justify-center rounded-lg ${
            tone ?? "bg-primary/10 text-primary"
          }`}
        >
          <Icon className="h-5 w-5" />
        </div>
        <div className="space-y-1">
          <p className="text-xs uppercase tracking-wider text-muted-foreground">
            {label}
          </p>
          {loading ? (
            <Skeleton className="h-7 w-16" />
          ) : (
            <p className="text-2xl font-semibold">{value}</p>
          )}
          {hint ? (
            <p className="text-xs text-muted-foreground">{hint}</p>
          ) : null}
        </div>
      </CardContent>
    </Card>
  );
}

export default function AdminDashboardPage() {
  const user = useAuthStore((s) => s.user);
  const all = useAdminTickets({ page: 1, limit: 100 });
  const open = useAdminTickets({ page: 1, limit: 100, status: "OPEN" });
  const critical = useAdminTickets({
    page: 1,
    limit: 100,
    priority: "CRITICAL",
  });
  const inProgress = useAdminTickets({
    page: 1,
    limit: 5,
    status: "IN_PROGRESS",
  });
  const recent = useAdminTickets({ page: 1, limit: 6 });

  if (all.isError) {
    return <ErrorState onRetry={() => all.refetch()} />;
  }

  const aiTickets =
    all.data?.data.filter((t) => t.category !== null).length ?? 0;
  const total = all.data?.total ?? 0;
  const aiCoverage = total ? Math.round((aiTickets / total) * 100) : 0;

  return (
    <>
      <PageHeader
        title={`Operations console`}
        description={
          user
            ? `Signed in as ${user.name} · oversee every author ticket across BookLeaf.`
            : "Oversee every author ticket across BookLeaf."
        }
        actions={
          <Button asChild>
            <Link href="/admin/tickets">View queue</Link>
          </Button>
        }
      />

      <section className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
        <Stat
          icon={Inbox}
          label="Total tickets"
          value={total.toString()}
          loading={all.isLoading}
        />
        <Stat
          icon={Clock}
          label="Open"
          value={(open.data?.total ?? 0).toString()}
          tone="bg-blue-500/15 text-blue-600"
          loading={open.isLoading}
        />
        <Stat
          icon={AlertOctagon}
          label="Critical"
          value={(critical.data?.total ?? 0).toString()}
          tone="bg-red-500/15 text-red-600"
          loading={critical.isLoading}
        />
        <Stat
          icon={Sparkles}
          label="AI coverage"
          value={`${aiCoverage}%`}
          hint="Tickets auto-classified by AI"
          tone="bg-violet-500/15 text-violet-600"
          loading={all.isLoading}
        />
      </section>

      <section className="grid gap-4 lg:grid-cols-2">
        <Card>
          <CardContent className="space-y-3 p-5">
            <div className="flex items-center justify-between">
              <p className="text-sm font-semibold">In progress</p>
              <Button asChild variant="ghost" size="sm">
                <Link href="/admin/tickets?status=IN_PROGRESS">Open queue</Link>
              </Button>
            </div>
            {inProgress.isLoading ? (
              <Skeleton className="h-32 w-full" />
            ) : inProgress.data?.data.length ? (
              <ul className="space-y-2">
                {inProgress.data.data.slice(0, 5).map((t) => (
                  <li key={t.id}>
                    <Link
                      href={`/admin/tickets/${t.id}`}
                      className="flex items-center justify-between rounded-md border bg-card px-3 py-2 text-sm transition-colors hover:bg-muted/40"
                    >
                      <span className="truncate">{t.subject}</span>
                      <TicketPriorityBadge priority={t.priority} />
                    </Link>
                  </li>
                ))}
              </ul>
            ) : (
              <p className="rounded-lg border border-dashed bg-muted/30 px-4 py-6 text-center text-xs text-muted-foreground">
                Nothing in progress right now. 🎉
              </p>
            )}
          </CardContent>
        </Card>

        <Card>
          <CardContent className="space-y-3 p-5">
            <div className="flex items-center justify-between">
              <p className="text-sm font-semibold">Recent activity</p>
              <Activity className="h-4 w-4 text-muted-foreground" />
            </div>
            {recent.isLoading ? (
              <Skeleton className="h-32 w-full" />
            ) : recent.data?.data.length ? (
              <ul className="space-y-2">
                {recent.data.data.map((t) => (
                  <li key={t.id}>
                    <Link
                      href={`/admin/tickets/${t.id}`}
                      className="flex items-center justify-between gap-2 rounded-md border bg-card px-3 py-2 text-sm transition-colors hover:bg-muted/40"
                    >
                      <span className="min-w-0 flex-1 truncate">{t.subject}</span>
                      <div className="flex items-center gap-1.5">
                        <TicketStatusBadge status={t.status} />
                        <TicketCategoryBadge category={t.category} />
                        <span className="text-[11px] text-muted-foreground">
                          {relativeTime(t.updatedAt)}
                        </span>
                      </div>
                    </Link>
                  </li>
                ))}
              </ul>
            ) : (
              <p className="rounded-lg border border-dashed bg-muted/30 px-4 py-6 text-center text-xs text-muted-foreground">
                No recent activity.
              </p>
            )}
            <div className="flex items-center gap-2 rounded-md bg-emerald-500/10 px-3 py-2 text-xs text-emerald-700 dark:text-emerald-300">
              <CheckCircle2 className="h-3.5 w-3.5" />
              Realtime feed connected — new tickets land here automatically.
            </div>
          </CardContent>
        </Card>
      </section>
    </>
  );
}
