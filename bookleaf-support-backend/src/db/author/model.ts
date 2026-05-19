import { model, Model } from "mongoose";
import { IAuthorDocument } from "./types";
import { authorSchema } from "./schema";

export const AuthorModel: Model<IAuthorDocument> = model<IAuthorDocument>(
  "Author",
  authorSchema,
);
