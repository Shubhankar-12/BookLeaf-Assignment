import { UserModel } from "../user";
import type { IUser, IUserDocument } from "../user";
import { isValidObjectId } from "../../utils/ids";

export const userQueries = {
  async createUser(data: Partial<IUser>): Promise<IUserDocument> {
    return UserModel.create(data);
  },

  async getUserById(id: string): Promise<IUserDocument | null> {
    if (!isValidObjectId(id)) return null;
    return UserModel.findById(id).exec();
  },

  // Login path only — projects the password hash so bcrypt-compare can run. Use getUserById otherwise.
  async getUserByEmail(email: string): Promise<IUserDocument | null> {
    return UserModel.findOne({ email: email.toLowerCase().trim() })
      .select("+password")
      .exec();
  },

  async listAdmins(): Promise<IUserDocument[]> {
    return UserModel.find({ role: "ADMIN" }).exec();
  },

  async upsertUserByEmail(
    email: string,
    data: Partial<IUser>,
  ): Promise<IUserDocument> {
    const doc = await UserModel.findOneAndUpdate(
      { email: email.toLowerCase().trim() },
      { $set: data },
      { upsert: true, new: true, setDefaultsOnInsert: true },
    ).exec();
    return doc as IUserDocument;
  },
};
