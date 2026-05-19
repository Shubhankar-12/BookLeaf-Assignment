/**
 * Author-facing book entity returned by GET /api/books and /api/books/:id.
 *
 * Field naming mirrors the BookLeaf sample dataset JSON exactly — snake_case
 * for every dataset column. The only camelCase exceptions are internal
 * Mongoose-derived `createdAt` / `updatedAt` that the backend serializes
 * verbatim.
 */

/**
 * Status strings preserved verbatim from the BookLeaf dataset. The backend
 * enum mirrors this list (src/db/book/types.ts BOOK_STATUSES).
 */
export type BookStatus =
  | "Published & Live"
  | "In Production - Cover Design"
  | "In Production - Typesetting"
  | "In Production - Editing"
  | "In Production - Proofreading"
  | "Out of Print";

export interface Book {
  id: string;
  book_id: string | null;
  title: string;
  isbn: string | null;
  genre: string | null;
  status: BookStatus;
  publication_date: string | null;
  mrp: number | null;
  author_royalty_per_copy: number | null;
  total_copies_sold: number;
  total_royalty_earned: number;
  royalty_paid: number;
  royalty_pending: number;
  last_royalty_payout_date: string | null;
  print_partner: string | null;
  available_on: string[];
  currency: string;
  createdAt: string;
  updatedAt: string;
}

/** Shared UI helpers — colocated so every render site stays consistent. */

export const BOOK_STATUS_LABEL: Record<BookStatus, string> = {
  "Published & Live": "Published & Live",
  "In Production - Cover Design": "In Production — Cover Design",
  "In Production - Typesetting": "In Production — Typesetting",
  "In Production - Editing": "In Production — Editing",
  "In Production - Proofreading": "In Production — Proofreading",
  "Out of Print": "Out of Print",
};

export const BOOK_STATUS_TONE: Record<BookStatus, string> = {
  "Published & Live": "bg-emerald-500/15 text-emerald-700 dark:text-emerald-400",
  "In Production - Cover Design":
    "bg-amber-500/15 text-amber-700 dark:text-amber-400",
  "In Production - Typesetting":
    "bg-amber-500/15 text-amber-700 dark:text-amber-400",
  "In Production - Editing":
    "bg-amber-500/15 text-amber-700 dark:text-amber-400",
  "In Production - Proofreading":
    "bg-amber-500/15 text-amber-700 dark:text-amber-400",
  "Out of Print": "bg-muted text-muted-foreground",
};

export function isInProduction(status: BookStatus): boolean {
  return status.startsWith("In Production");
}
