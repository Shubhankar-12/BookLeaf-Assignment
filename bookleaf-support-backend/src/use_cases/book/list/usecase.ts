import { bookQueries } from "../../../db/queries";
import type { UseCaseResult } from "../../../types/api-response";
import type { BookStatus } from "../../../db/book";
import type { ListBooksDto } from "./dto";

export interface BookListItem {
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

export interface ListBooksResult {
  data: BookListItem[];
  total: number;
  page: number;
  limit: number;
}

export class ListBooksUseCase {
  async execute(dto: ListBooksDto): Promise<UseCaseResult<ListBooksResult>> {
    const { data, total } = await bookQueries.listBooks({
      authorId: dto.role === "AUTHOR" ? dto.userId : undefined,
      page: dto.page,
      limit: dto.limit,
    });

    return {
      data: data.map((b) => ({
        id: b._id.toString(),
        authorId: b.authorId.toString(),
        book_id: b.book_id ?? null,
        title: b.title,
        isbn: b.isbn ?? null,
        genre: b.genre ?? null,
        status: b.status,
        publication_date: b.publication_date ?? null,
        mrp: b.mrp ?? null,
        author_royalty_per_copy: b.author_royalty_per_copy ?? null,
        total_copies_sold: b.total_copies_sold,
        total_royalty_earned: b.total_royalty_earned,
        royalty_paid: b.royalty_paid,
        royalty_pending: b.royalty_pending,
        last_royalty_payout_date: b.last_royalty_payout_date ?? null,
        print_partner: b.print_partner ?? null,
        available_on: b.available_on ?? [],
        currency: b.currency,
        createdAt: b.createdAt,
        updatedAt: b.updatedAt,
      })),
      total,
      page: dto.page,
      limit: dto.limit,
    };
  }
}
