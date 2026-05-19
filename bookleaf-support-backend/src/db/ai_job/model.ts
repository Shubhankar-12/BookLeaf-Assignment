import { model, Model } from "mongoose";
import { IAiJobDocument } from "./types";
import { aiJobSchema } from "./schema";

export const AiJobModel: Model<IAiJobDocument> = model<IAiJobDocument>(
  "AiJob",
  aiJobSchema,
);
