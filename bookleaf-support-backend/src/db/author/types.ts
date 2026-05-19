import { Document, Types } from "mongoose";

// 1:1 extension of a User with role='AUTHOR'. snake_case fields mirror the dataset; camelCase for internal-only fields.
export interface IAuthor {
  userId: Types.ObjectId;
  author_id?: string | null;
  penName?: string | null;
  phone?: string | null;
  city?: string | null;
  joined_date?: Date | null;
  createdAt: Date;
  updatedAt: Date;
}

export interface IAuthorDocument extends IAuthor, Document {
  _id: Types.ObjectId;
}
