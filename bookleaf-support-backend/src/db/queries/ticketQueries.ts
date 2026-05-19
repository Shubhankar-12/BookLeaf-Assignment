import { Types } from "mongoose";
import { TicketModel } from "../ticket";
import type {
  IAiMetadata,
  ITicket,
  ITicketDocument,
  ITicketLean,
} from "../ticket";
import { isValidObjectId, toObjectId } from "../../utils/ids";
import type {
  TicketCategory,
  TicketPriority,
  TicketStatus,
} from "../../constants/ticket";

export interface ListTicketsArgs {
  /** Omit to read across all authors (admin elevation path). */
  authorId?: string;
  status?: TicketStatus;
  page: number;
  limit: number;
}

export interface ListTicketsResult {
  data: ITicketLean[];
  total: number;
}

export interface ListForAdminArgs {
  status?: TicketStatus;
  priority?: TicketPriority;
  category?: TicketCategory;
  assignedTo?: string;
  search?: string;
  page: number;
  limit: number;
}

export interface ListForAdminResult {
  data: ITicketLean[];
  total: number;
}

export const ticketQueries = {
  async createTicket(data: Partial<ITicket>): Promise<ITicketDocument> {
    return TicketModel.create(data);
  },

  async listTickets({
    authorId,
    status,
    page,
    limit,
  }: ListTicketsArgs): Promise<ListTicketsResult> {
    const skip = Math.max(0, (page - 1) * limit);

    const match: Record<string, unknown> = {};
    if (authorId) {
      const oid = toObjectId(authorId);
      if (!oid) return { data: [], total: 0 };
      match.authorId = oid;
    }
    if (status) match.status = status;

    const agg = await TicketModel.aggregate<{
      data: ITicketLean[];
      total: { count: number }[];
    }>([
      { $match: match },
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

  async getById(id: string): Promise<ITicketDocument | null> {
    if (!isValidObjectId(id)) return null;
    return TicketModel.findById(id).exec();
  },

  // Ownership check at DB level — returns null for both "not found" and "not yours" to avoid existence leak.
  async getByIdScopedToAuthor(
    id: string,
    authorId: string,
  ): Promise<ITicketDocument | null> {
    const tid = toObjectId(id);
    const aid = toObjectId(authorId);
    if (!tid || !aid) return null;
    return TicketModel.findOne({ _id: tid, authorId: aid }).exec();
  },

  // Uses the schema's `subject+description` text index — avoid switching to regex (kills index use).
  async listForAdmin({
    status,
    priority,
    category,
    assignedTo,
    search,
    page,
    limit,
  }: ListForAdminArgs): Promise<ListForAdminResult> {
    const skip = Math.max(0, (page - 1) * limit);

    const match: Record<string, unknown> = {};
    if (status) match.status = status;
    if (priority) match.priority = priority;
    if (category) match.category = category;
    if (assignedTo) {
      const aid = toObjectId(assignedTo);
      if (!aid) return { data: [], total: 0 };
      match.assignedTo = aid;
    }
    if (search && search.trim().length > 0) {
      match.$text = { $search: search.trim() };
    }

    const agg = await TicketModel.aggregate<{
      data: ITicketLean[];
      total: { count: number }[];
    }>([
      { $match: match },
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

  async updateStatus(
    id: string,
    status: TicketStatus,
  ): Promise<ITicketDocument | null> {
    if (!isValidObjectId(id)) return null;
    return TicketModel.findByIdAndUpdate(
      id,
      { $set: { status } },
      { new: true },
    ).exec();
  },

  async updateCategory(
    id: string,
    category: TicketCategory,
  ): Promise<ITicketDocument | null> {
    if (!isValidObjectId(id)) return null;
    return TicketModel.findByIdAndUpdate(
      id,
      { $set: { category } },
      { new: true },
    ).exec();
  },

  async updatePriority(
    id: string,
    priority: TicketPriority,
  ): Promise<ITicketDocument | null> {
    if (!isValidObjectId(id)) return null;
    return TicketModel.findByIdAndUpdate(
      id,
      { $set: { priority } },
      { new: true },
    ).exec();
  },

  async assignTo(
    id: string,
    assigneeId: Types.ObjectId | null,
  ): Promise<ITicketDocument | null> {
    if (!isValidObjectId(id)) return null;
    return TicketModel.findByIdAndUpdate(
      id,
      { $set: { assignedTo: assigneeId } },
      { new: true },
    ).exec();
  },

  // Dotted `$set` paths so a sparse delta from one AI arm doesn't clobber the other arm's fields.
  async updateAiMetadata(
    id: string,
    meta: Partial<IAiMetadata>,
  ): Promise<ITicketDocument | null> {
    if (!isValidObjectId(id)) return null;

    const set: Record<string, unknown> = {};
    const keys: (keyof IAiMetadata)[] = [
      "category",
      "priority",
      "confidence",
      "model",
      "source",
      "classifiedAt",
      "latencyMs",
      "tokens",
    ];
    for (const k of keys) {
      if (meta[k] !== undefined) {
        set[`aiMetadata.${k}`] = meta[k];
      }
    }

    // Mirror to top-level fields only when source==='AI' so admin filters distinguish AI verdict from fallback.
    if (meta.source === "AI") {
      if (meta.category !== undefined) set.category = meta.category;
      if (meta.priority !== undefined) set.priority = meta.priority;
    }

    if (Object.keys(set).length === 0) {
      return TicketModel.findById(id).exec();
    }

    return TicketModel.findByIdAndUpdate(id, { $set: set }, { new: true }).exec();
  },
};
