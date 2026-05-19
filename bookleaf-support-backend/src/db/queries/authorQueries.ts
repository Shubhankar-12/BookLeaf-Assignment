import { AuthorModel } from "../author";
import type { IAuthor, IAuthorDocument } from "../author";
import { isValidObjectId, toObjectId } from "../../utils/ids";

export const authorQueries = {
  async getByUserId(userId: string): Promise<IAuthorDocument | null> {
    if (!isValidObjectId(userId)) return null;
    return AuthorModel.findOne({ userId: toObjectId(userId) }).exec();
  },

  async create(data: Partial<IAuthor>): Promise<IAuthorDocument> {
    return AuthorModel.create(data);
  },

  async upsertByUserId(
    userId: string,
    data: Partial<IAuthor>,
  ): Promise<IAuthorDocument> {
    const oid = toObjectId(userId);
    if (!oid) throw new Error(`Invalid userId: ${userId}`);
    const doc = await AuthorModel.findOneAndUpdate(
      { userId: oid },
      { $set: { ...data, userId: oid } },
      { upsert: true, new: true, setDefaultsOnInsert: true },
    ).exec();
    return doc as IAuthorDocument;
  },
};
