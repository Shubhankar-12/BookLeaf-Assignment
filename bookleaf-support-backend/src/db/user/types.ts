import { Document, Types } from "mongoose";

export type Role = "ADMIN" | "AUTHOR";

export interface IUser {
  email: string;
  // bcrypt hash, never plaintext.
  password: string;
  name: string;
  role: Role;
  createdAt: Date;
  updatedAt: Date;
}

export interface IUserDocument extends IUser, Document {
  _id: Types.ObjectId;
}
