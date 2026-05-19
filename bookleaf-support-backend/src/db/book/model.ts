import { model, Model } from "mongoose";
import { IBookDocument } from "./types";
import { bookSchema } from "./schema";

export const BookModel: Model<IBookDocument> = model<IBookDocument>(
  "Book",
  bookSchema,
);
