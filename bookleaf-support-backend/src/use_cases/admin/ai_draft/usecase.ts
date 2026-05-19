import {
  ticketQueries,
  messageQueries,
  aiJobQueries,
} from "../../../db/queries";
import { ticketAi } from "../../../services/ai";
import type { UseCaseResult } from "../../../types/api-response";
import { logger } from "../../../utils/logger";
import type { AiDraftDto } from "./dto";

export interface AiDraftResult {
  draft: string;
  source: "AI" | "FALLBACK";
  model?: string;
  tokens?: number;
}

const RECENT_MESSAGE_WINDOW = 5;

export class AiDraftUseCase {
  async execute(dto: AiDraftDto): Promise<UseCaseResult<AiDraftResult>> {
    const ticket = await ticketQueries.getById(dto.ticketId);
    if (!ticket) return { error: "Ticket not found", status: 404 };

    const messages = await messageQueries.listByTicket(dto.ticketId, {
      includeInternal: true,
    });
    // Tail of asc-ordered list — model reads most-recent last.
    const recent = messages.slice(-RECENT_MESSAGE_WINDOW).map((m) => ({
      senderType: m.senderType,
      body: m.body,
    }));

    // Best-effort — an ai_job write failure must not block the draft.
    let jobId: string | null = null;
    try {
      const job = await aiJobQueries.start({
        ticketId: dto.ticketId,
        aiType: "DRAFT",
      });
      jobId = job._id.toString();
    } catch (err) {
      logger.warn({ err, ticketId: dto.ticketId }, "ai_job DRAFT start failed");
    }

    const result = await ticketAi.generateDraft({
      subject: ticket.subject,
      description: ticket.description,
      recentMessages: recent,
    });

    if (result.source === "FALLBACK" && result.draft === null) {
      if (jobId) {
        aiJobQueries
          .fail({ jobId, error: result.reason ?? "fallback-no-draft" })
          .catch(() => undefined);
      }
      return { error: "AI draft unavailable", status: 503 };
    }

    if (result.draft === null) {
      if (jobId) {
        aiJobQueries
          .fail({ jobId, error: "invariant-violation-null-draft" })
          .catch(() => undefined);
      }
      return { error: "AI draft unavailable", status: 503 };
    }

    if (jobId) {
      aiJobQueries
        .succeed({
          jobId,
          // Truncated preview keeps the ai_job row small; full draft lives in the response.
          result: {
            source: result.source,
            draftPreview: result.draft.slice(0, 280),
          },
          modelName: result.model ?? null,
          latencyMs: null,
          tokens: result.tokens ?? null,
        })
        .catch(() => undefined);
    }

    return {
      draft: result.draft,
      source: result.source,
      model: result.model,
      tokens: result.tokens,
    };
  }
}
