"use client";

import { BookOpen } from "lucide-react";

import { EmptyState } from "@/components/common/empty-state";
import { ErrorState } from "@/components/common/error-state";
import { PageHeader } from "@/components/common/page-header";
import { Skeleton } from "@/components/ui/skeleton";
import { BookCard, useBooks } from "@/features/books";

export default function AuthorBooksPage() {
  const { data, isLoading, isError, refetch } = useBooks({ page: 1, limit: 50 });

  return (
    <>
      <PageHeader
        title="My books"
        description="All titles you've published with BookLeaf, with royalty and sales at a glance."
      />

      {isLoading ? (
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {[0, 1, 2, 3, 4, 5].map((i) => (
            <Skeleton key={i} className="h-52" />
          ))}
        </div>
      ) : isError ? (
        <ErrorState onRetry={() => refetch()} />
      ) : data?.data.length ? (
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {data.data.map((book) => (
            <BookCard key={book.id} book={book} />
          ))}
        </div>
      ) : (
        <EmptyState
          icon={BookOpen}
          title="No books yet"
          description="Once your manuscript is accepted, your titles will show up here."
        />
      )}
    </>
  );
}
