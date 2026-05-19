import { ActivityModel } from "../activity";
import type {
  IActivityDocument,
  IActivityLean,
  ActivityType,
  ActivityActorType,
} from "../activity";
import { toObjectId } from "../../utils/ids";

export interface LogActivityArgs {
  ticketId: string;
  actorId: string | null;
  actorType: ActivityActorType;
  type: ActivityType;
  before?: unknown | null;
  after?: unknown | null;
}

export interface ListActivityArgs {
  page: number;
  limit: number;
}

export interface ListActivityResult {
  data: IActivityLean[];
  total: number;
}

export const activityQueries = {
  async log(args: LogActivityArgs): Promise<IActivityDocument> {
    const tid = toObjectId(args.ticketId);
    if (!tid) {
      // Invalid ticketId is a programmer bug — surface loudly.
      throw new Error(`activityQueries.log: invalid ticketId "${args.ticketId}"`);
    }
    const aid = args.actorId ? toObjectId(args.actorId) : null;

    return ActivityModel.create({
      ticketId: tid,
      actorId: aid,
      actorType: args.actorType,
      type: args.type,
      before: args.before ?? null,
      after: args.after ?? null,
    });
  },

  async listByTicket(
    ticketId: string,
    { page, limit }: ListActivityArgs,
  ): Promise<ListActivityResult> {
    const tid = toObjectId(ticketId);
    if (!tid) return { data: [], total: 0 };
    const skip = Math.max(0, (page - 1) * limit);

    const agg = await ActivityModel.aggregate<{
      data: IActivityLean[];
      total: { count: number }[];
    }>([
      { $match: { ticketId: tid } },
      { $sort: { createdAt: -1 } },
      {
        $facet: {
          data: [{ $skip: skip }, { $limit: limit }],
          total: [{ $count: "count" }],
        },
      },
    ]).exec();

    const first = agg[0];
    return {
      data: first?.data ?? [],
      total: first?.total[0]?.count ?? 0,
    };
  },
};
