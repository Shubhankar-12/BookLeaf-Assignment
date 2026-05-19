"use client";

import { ArrowLeft, BookOpen, Store } from "lucide-react";
import Link from "next/link";
import { useParams } from "next/navigation";

import { ErrorState } from "@/components/common/error-state";
import { PageHeader } from "@/components/common/page-header";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";
import { useBook } from "@/features/books";
import { shortDate } from "@/lib/date";
import { formatCurrency } from "@/lib/utils";
import {
  BOOK_STATUS_LABEL,
  BOOK_STATUS_TONE,
  isInProduction,
  type Book,
} from "@/types/book";

const NA = "—";

function renderDate(iso: string | null): string {
  return iso ? shortDate(iso) : NA;
}

function renderCurrency(value: number | null, currency: string): string {
  return value === null ? NA : formatCurrency(value, currency);
}

function StatCard({
  label,
  value,
  hint,
}: {
  label: string;
  value: string;
  hint?: string;
}) {
  return (
    <Card>
      <CardContent className="space-y-1 p-5">
        <p className="text-xs uppercase tracking-wider text-muted-foreground">
          {label}
        </p>
        <p className="text-2xl font-semibold">{value}</p>
        {hint ? (
          <p className="text-xs text-muted-foreground">{hint}</p>
        ) : null}
      </CardContent>
    </Card>
  );
}

function MetadataRow({
  label,
  value,
}: {
  label: string;
  value: string | React.ReactNode;
}) {
  return (
    <div className="flex flex-col gap-0.5 sm:flex-row sm:items-center sm:justify-between">
      <span className="text-xs uppercase tracking-wider text-muted-foreground">
        {label}
      </span>
      <span className="text-sm font-medium">{value}</span>
    </div>
  );
}

function PlatformsRow({ book }: { book: Book }) {
  if (!book.available_on.length) {
    return (
      <p className="text-sm text-muted-foreground">
        Not yet listed on any platform.
      </p>
    );
  }
  return (
    <div className="flex flex-wrap gap-2">
      {book.available_on.map((platform) => (
        <Badge key={platform} variant="outline" className="gap-1.5">
          <Store className="h-3 w-3" />
          {platform}
        </Badge>
      ))}
    </div>
  );
}

export default function AuthorBookDetailPage() {
  const params = useParams<{ id: string }>();
  const id = params.id;
  const { data, isLoading, isError, refetch } = useBook(id);

  return (
    <>
      <Button asChild variant="ghost" size="sm" className="w-fit gap-2 px-0">
        <Link href="/author/books">
          <ArrowLeft className="h-4 w-4" /> Back to books
        </Link>
      </Button>

      {isLoading ? (
        <Skeleton className="h-48" />
      ) : isError || !data ? (
        <ErrorState onRetry={() => refetch()} />
      ) : (
        <>
          <PageHeader
            title={data.title}
            description={
              data.isbn ? `ISBN ${data.isbn}` : "ISBN not yet assigned"
            }
            actions={
              <Badge
                variant="outline"
                className={`border-transparent ${BOOK_STATUS_TONE[data.status]}`}
              >
                {BOOK_STATUS_LABEL[data.status]}
              </Badge>
            }
          />

          {isInProduction(data.status) ? (
            <div className="rounded-lg border border-amber-500/40 bg-amber-500/10 px-4 py-3 text-sm">
              <p className="font-medium text-amber-700 dark:text-amber-400">
                This book is still in production.
              </p>
              <p className="mt-0.5 text-muted-foreground">
                Publication date, MRP, royalty rate and print partner will be
                set once the book moves to <em>Published & Live</em>.
              </p>
            </div>
          ) : null}

          {/* Top stats: royalty breakdown */}
          <section className="grid gap-4 md:grid-cols-3">
            <StatCard
              label="Royalty earned"
              value={formatCurrency(data.total_royalty_earned, data.currency)}
              hint={
                data.author_royalty_per_copy !== null
                  ? `${formatCurrency(data.author_royalty_per_copy, data.currency)} per copy`
                  : undefined
              }
            />
            <StatCard
              label="Royalty paid"
              value={formatCurrency(data.royalty_paid, data.currency)}
              hint={
                data.last_royalty_payout_date
                  ? `Last payout ${shortDate(data.last_royalty_payout_date)}`
                  : data.royalty_paid === 0
                    ? "No payout disbursed yet"
                    : undefined
              }
            />
            <StatCard
              label="Royalty pending"
              value={formatCurrency(data.royalty_pending, data.currency)}
              hint={
                data.royalty_pending === 0 && data.total_royalty_earned > 0
                  ? "All caught up"
                  : data.royalty_pending > 0
                    ? "Cleared next quarterly cycle"
                    : undefined
              }
            />
          </section>

          {/* Sales + production metadata */}
          <section className="grid gap-4 md:grid-cols-2">
            <Card>
              <CardContent className="space-y-3 p-5">
                <h3 className="text-sm font-semibold">Sales</h3>
                <MetadataRow
                  label="Copies sold"
                  value={data.total_copies_sold.toLocaleString()}
                />
                <MetadataRow
                  label="MRP"
                  value={renderCurrency(data.mrp, data.currency)}
                />
                <MetadataRow
                  label="Royalty per copy"
                  value={renderCurrency(
                    data.author_royalty_per_copy,
                    data.currency,
                  )}
                />
              </CardContent>
            </Card>

            <Card>
              <CardContent className="space-y-3 p-5">
                <h3 className="text-sm font-semibold">Production</h3>
                <MetadataRow label="Genre" value={data.genre ?? NA} />
                <MetadataRow
                  label="Publication date"
                  value={renderDate(data.publication_date)}
                />
                <MetadataRow
                  label="Print partner"
                  value={data.print_partner ?? NA}
                />
              </CardContent>
            </Card>
          </section>

          <Card>
            <CardContent className="space-y-3 p-5">
              <h3 className="text-sm font-semibold">Distribution</h3>
              <PlatformsRow book={data} />
            </CardContent>
          </Card>

          <Card>
            <CardContent className="flex items-start gap-4 p-6">
              <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-primary/10 text-primary">
                <BookOpen className="h-5 w-5" />
              </div>
              <div className="space-y-2 text-sm">
                <p className="font-medium">Need to update something?</p>
                <p className="text-muted-foreground">
                  ISBN errors, royalty discrepancies, distribution gaps — open
                  a support ticket and the relevant team will pick it up.
                </p>
                <Button asChild size="sm" variant="outline">
                  <Link href={`/author/support/new?bookId=${data.id}`}>
                    Raise a ticket about this book
                  </Link>
                </Button>
              </div>
            </CardContent>
          </Card>
        </>
      )}
    </>
  );
}
