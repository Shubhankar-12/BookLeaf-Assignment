import { model, Model } from "mongoose";
import { IMessageDocument } from "./types";
import { messageSchema } from "./schema";

export const MessageModel: Model<IMessageDocument> = model<IMessageDocument>(
  "Message",
  messageSchema,
);
