import { model, Model } from "mongoose";
import { IActivityDocument } from "./types";
import { activitySchema } from "./schema";

export const ActivityModel: Model<IActivityDocument> = model<IActivityDocument>(
  "Activity",
  activitySchema,
);
