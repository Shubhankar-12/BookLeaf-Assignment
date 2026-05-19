import { model, Model } from "mongoose";
import { IUserDocument } from "./types";
import { userSchema } from "./schema";

export const UserModel: Model<IUserDocument> = model<IUserDocument>(
  "User",
  userSchema,
);
