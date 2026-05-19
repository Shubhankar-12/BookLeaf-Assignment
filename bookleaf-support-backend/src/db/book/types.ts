import { Document, Types } from "mongoose";

// Dataset strings preserved verbatim — production phases beyond Cover Design/Typesetting are accepted per the production KB.
export const BOOK_STATUSES = [
  "Published & Live",
  "In Production - Cover Design",
  "In Production - Typesetting",
  "In Production - Editing",
  "In Production - Proofreading",
  "Out of Print",
] as const;

export type BookStatus = (typeof BOOK_STATUSES)[number];

// snake_case mirrors the BookLeaf dataset JSON; camelCase reserved for internal Mongoose plumbing.
export interface IBook {
  // Mongo ref to the author's User document — NOT the dataset's "AUTH001".
  authorId: Types.ObjectId;
  // External dataset id like "BK001"; kept optional for traceability.
  book_id?: string | null;
  title: string;
  isbn?: string | null;
  genre?: string | null;
  publication_date?: Date | null;
  status: BookStatus;
  mrp?: number | null;
  author_royalty_per_copy?: number | null;
  total_copies_sold: number;
  total_royalty_earned: number;
  royalty_paid: number;
  royalty_pending: number;
  last_royalty_payout_date?: Date | null;
  print_partner?: string | null;
  available_on: string[];
  currency: string;
  createdAt: Date;
  updatedAt: Date;
}

export interface IBookDocument extends IBook, Document {
  _id: Types.ObjectId;
}
