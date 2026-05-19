import { BookOpen } from "lucide-react";
import Link from "next/link";

import { Badge } from "@/components/ui/badge";
import { Card, CardContent } from "@/components/ui/card";
import { formatCurrency } from "@/lib/utils";
import {
  BOOK_STATUS_LABEL,
  BOOK_STATUS_TONE,
  type Book,
} from "@/types/book";

export function BookCard({ book }: { book: Book }) {
  return (
    <Link href={`/author/books/${book.id}`} className="group">
      <Card className="h-full transition-all group-hover:border-primary/40 group-hover:shadow-md">
        <CardContent className="flex h-full flex-col gap-4 p-5">
          <div className="flex items-start justify-between gap-3">
            <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-primary/10 text-primary">
              <BookOpen className="h-5 w-5" />
            </div>
            <Badge
              variant="outline"
              className={`border-transparent ${BOOK_STATUS_TONE[book.status]}`}
            >
              {BOOK_STATUS_LABEL[book.status]}
            </Badge>
          </div>

          <div className="space-y-1">
            <h3 className="line-clamp-2 font-semibold leading-tight">
              {book.title}
            </h3>
            <p className="font-mono text-xs text-muted-foreground">
              ISBN {book.isbn ?? "—"}
            </p>
            {book.genre ? (
              <p className="text-xs text-muted-foreground">{book.genre}</p>
            ) : null}
          </div>

          <div className="mt-auto grid grid-cols-2 gap-3 border-t pt-3 text-sm">
            <div>
              <p className="text-[10px] uppercase tracking-wider text-muted-foreground">
                Royalty earned
              </p>
              <p className="font-medium">
                {formatCurrency(book.total_royalty_earned, book.currency)}
              </p>
            </div>
            <div>
              <p className="text-[10px] uppercase tracking-wider text-muted-foreground">
                Copies sold
              </p>
              <p className="font-medium">
                {(book.total_copies_sold ?? 0).toLocaleString()}
              </p>
            </div>
          </div>
        </CardContent>
      </Card>
    </Link>
  );
}
