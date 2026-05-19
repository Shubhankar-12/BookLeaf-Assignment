import { Schema } from "mongoose";
import { IAuthorDocument } from "./types";

export const authorSchema = new Schema<IAuthorDocument>(
  {
    userId: {
      type: Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    author_id: { type: String, trim: true, default: null },
    penName: { type: String, trim: true, default: null },
    phone: { type: String, trim: true, default: null },
    city: { type: String, trim: true, default: null },
    joined_date: { type: Date, default: null },
  },
  {
    timestamps: true,
    versionKey: false,
  },
);

authorSchema.index({ userId: 1 }, { unique: true });
authorSchema.index({ author_id: 1 }, { unique: true, sparse: true });
