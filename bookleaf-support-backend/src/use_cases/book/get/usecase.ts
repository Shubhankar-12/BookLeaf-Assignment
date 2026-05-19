import { bookQueries } from "../../../db/queries";
import type { UseCaseResult } from "../../../types/api-response";
import type { BookStatus } from "../../../db/book";
import type { GetBookDto } from "./dto";

export interface BookDetail {
  id: string;
  authorId: string;
  book_id: string | null;
  title: string;
  isbn: string | null;
  genre: string | null;
  status: BookStatus;
  publication_date: Date | null;
  mrp: number | null;
  author_royalty_per_copy: number | null;
  total_copies_sold: number;
  total_royalty_earned: number;
  royalty_paid: number;
  royalty_pending: number;
  last_royalty_payout_date: Date | null;
  print_partner: string | null;
  available_on: string[];
  currency: string;
  createdAt: Date;
  updatedAt: Date;
}

export class GetBookUseCase {
  // AUTHOR: same 404 for "not yours" as for "missing" — no existence leak. ADMIN: any book.
  async execute(dto: GetBookDto): Promise<UseCaseResult<BookDetail>> {
    const book = await bookQueries.getById(dto.bookId);
    if (!book) return { error: "Book not found", status: 404 };
    if (dto.role === "AUTHOR" && book.authorId.toString() !== dto.userId) {
      return { error: "Book not found", status: 404 };
    }

    return {
      id: book._id.toString(),
      authorId: book.authorId.toString(),
      book_id: book.book_id ?? null,
      title: book.title,
      isbn: book.isbn ?? null,
      genre: book.genre ?? null,
      status: book.status,
      publication_date: book.publication_date ?? null,
      mrp: book.mrp ?? null,
      author_royalty_per_copy: book.author_royalty_per_copy ?? null,
      total_copies_sold: book.total_copies_sold,
      total_royalty_earned: book.total_royalty_earned,
      royalty_paid: book.royalty_paid,
      royalty_pending: book.royalty_pending,
      last_royalty_payout_date: book.last_royalty_payout_date ?? null,
      print_partner: book.print_partner ?? null,
      available_on: book.available_on ?? [],
      currency: book.currency,
      createdAt: book.createdAt,
      updatedAt: book.updatedAt,
    };
  }
}
