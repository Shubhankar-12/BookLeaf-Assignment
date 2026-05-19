import { BookModel } from "../book";
import type { IBook, IBookDocument } from "../book";
import { isValidObjectId, toObjectId } from "../../utils/ids";

export interface ListBooksArgs {
  /** Omit to read across all authors (admin elevation path). */
  authorId?: string;
  page: number;
  limit: number;
}

export interface ListBooksResult {
  data: IBookDocument[];
  total: number;
}

export const bookQueries = {
  async createBook(data: Partial<IBook>): Promise<IBookDocument> {
    return BookModel.create(data);
  },

  async listBooks({
    authorId,
    page,
    limit,
  }: ListBooksArgs): Promise<ListBooksResult> {
    const skip = Math.max(0, (page - 1) * limit);

    const match: Record<string, unknown> = {};
    if (authorId) {
      const oid = toObjectId(authorId);
      if (!oid) return { data: [], total: 0 };
      match.authorId = oid;
    }

    // $facet keeps data + count in a single round trip.
    const agg = await BookModel.aggregate<{
      data: IBookDocument[];
      total: { count: number }[];
    }>([
      { $match: match },
      { $sort: { createdAt: -1 } },
      {
        $facet: {
          data: [{ $skip: skip }, { $limit: limit }],
          total: [{ $count: "count" }],
        },
      },
    ]).exec();

    const first = agg[0];
    return {
      data: first?.data ?? [],
      total: first?.total[0]?.count ?? 0,
    };
  },

  async getById(id: string): Promise<IBookDocument | null> {
    if (!isValidObjectId(id)) return null;
    return BookModel.findById(id).exec();
  },

  async existsForAuthor(bookId: string, authorId: string): Promise<boolean> {
    const bid = toObjectId(bookId);
    const aid = toObjectId(authorId);
    if (!bid || !aid) return false;
    const exists = await BookModel.exists({ _id: bid, authorId: aid });
    return exists !== null;
  },

  async upsertByIsbn(
    isbn: string,
    data: Partial<IBook>,
  ): Promise<IBookDocument> {
    const doc = await BookModel.findOneAndUpdate(
      { isbn },
      { $set: data },
      { upsert: true, new: true, setDefaultsOnInsert: true },
    ).exec();
    return doc as IBookDocument;
  },
};
