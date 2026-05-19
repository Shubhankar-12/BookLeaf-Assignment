import { AiJobModel } from "../ai_job";
import type {
  IAiJob,
  IAiJobDocument,
  IAiJobResult,
  AiJobType,
} from "../ai_job";
import { toObjectId } from "../../utils/ids";

export interface StartJobArgs {
  ticketId: string;
  aiType: AiJobType;
}

export interface SucceedJobArgs {
  jobId: string;
  result: IAiJobResult;
  modelName: string | null;
  latencyMs: number | null;
  tokens: number | null;
}

export interface FailJobArgs {
  jobId: string;
  error: string;
}

export const aiJobQueries = {
  async start({ ticketId, aiType }: StartJobArgs): Promise<IAiJobDocument> {
    const tid = toObjectId(ticketId);
    if (!tid) throw new Error(`Invalid ticketId: ${ticketId}`);
    const doc = await AiJobModel.create({
      ticketId: tid,
      aiType,
      status: "RUNNING",
      attempts: 1,
      startedAt: new Date(),
    } satisfies Partial<IAiJob>);
    return doc;
  },

  async succeed({
    jobId,
    result,
    modelName,
    latencyMs,
    tokens,
  }: SucceedJobArgs): Promise<void> {
    await AiJobModel.findByIdAndUpdate(jobId, {
      $set: {
        status: "SUCCEEDED",
        completedAt: new Date(),
        result,
        modelName,
        latencyMs,
        tokens,
        error: null,
      },
    }).exec();
  },

  async fail({ jobId, error }: FailJobArgs): Promise<void> {
    await AiJobModel.findByIdAndUpdate(jobId, {
      $set: {
        status: "FAILED",
        completedAt: new Date(),
        error,
      },
    }).exec();
  },

  async listForTicket(ticketId: string): Promise<IAiJobDocument[]> {
    const tid = toObjectId(ticketId);
    if (!tid) return [];
    return AiJobModel.find({ ticketId: tid }).sort({ createdAt: -1 }).exec();
  },
};
