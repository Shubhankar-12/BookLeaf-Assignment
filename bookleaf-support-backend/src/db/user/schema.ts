import { Schema } from "mongoose";
import { IUserDocument } from "./types";

// `password` is `select: false` — only `getUserByEmail` re-projects it (via `.select('+password')`).
export const userSchema = new Schema<IUserDocument>(
  {
    email: {
      type: String,
      required: true,
      lowercase: true,
      trim: true,
    },
    password: {
      type: String,
      required: true,
      select: false,
    },
    name: {
      type: String,
      required: true,
      trim: true,
    },
    role: {
      type: String,
      enum: ["ADMIN", "AUTHOR"],
      required: true,
    },
  },
  {
    timestamps: true,
    versionKey: false,
  },
);

userSchema.index({ email: 1 }, { unique: true });
userSchema.index({ role: 1 });
