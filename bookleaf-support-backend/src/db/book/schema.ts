import { Schema } from "mongoose";
import { BOOK_STATUSES, IBookDocument } from "./types";

export const bookSchema = new Schema<IBookDocument>(
  {
    // Mongo ref — kept as `authorId` because it points at User._id (an
    // ObjectId), not the dataset's "AUTH001" string. The dataset author id
    // lives on the Author profile as `author_id`.
    authorId: {
      type: Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    book_id: { type: String, trim: true, default: null },
    title: { type: String, required: true, trim: true },
    isbn: { type: String, trim: true, default: null },
    genre: { type: String, trim: true, default: null },
    publication_date: { type: Date, default: null },
    status: {
      type: String,
      enum: BOOK_STATUSES,
      required: true,
      default: "Published & Live",
    },
    mrp: { type: Number, default: null },
    author_royalty_per_copy: { type: Number, default: null },
    total_copies_sold: { type: Number, required: true, default: 0 },
    total_royalty_earned: { type: Number, required: true, default: 0 },
    royalty_paid: { type: Number, required: true, default: 0 },
    royalty_pending: { type: Number, required: true, default: 0 },
    last_royalty_payout_date: { type: Date, default: null },
    print_partner: { type: String, trim: true, default: null },
    available_on: { type: [String], default: [] },
    currency: { type: String, required: true, default: "INR" },
  },
  {
    timestamps: true,
    versionKey: false,
  },
);

bookSchema.index({ authorId: 1, createdAt: -1 });
bookSchema.index({ isbn: 1 }, { unique: true, sparse: true });
bookSchema.index({ book_id: 1 }, { unique: true, sparse: true });
