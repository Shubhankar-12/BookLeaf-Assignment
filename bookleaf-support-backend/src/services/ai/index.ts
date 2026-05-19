import { logger } from "../../utils/logger";
import {
  ticketQueries,
  activityQueries,
  aiJobQueries,
} from "../../db/queries";
import { socketService } from "../socket.service";
import { SOCKET_EVENTS } from "../../sockets/events";
import type { IAiMetadata } from "../../db/ticket";
import { GeminiService } from "./gemini.service";
import { TicketAiService } from "./ticket-ai.service";

const geminiService = new GeminiService();

export const ticketAi = new TicketAiService(geminiService);

// Fire-and-forget — call as `void runTicketAi(id)`; never awaited from the request critical path.
export const runTicketAi = async (ticketId: string): Promise<void> => {
  let jobId: string | null = null;
  try {
    const ticket = await ticketQueries.getById(ticketId);
    if (!ticket) {
      logger.warn(
        { aiFallback: true, ticketId, reason: "ticket vanished before AI ran" },
        "runTicketAi: ticket not found",
      );
      return;
    }

    const job = await aiJobQueries.start({
      ticketId,
      aiType: "FULL_CLASSIFY",
    });
    jobId = job._id.toString();

    const authorIdStr = ticket.authorId.toString();

    const input = {
      subject: ticket.subject,
      description: ticket.description,
    };

    // allSettled — keep one arm's result usable if the other throws after a future refactor.
    const settled = await Promise.allSettled([
      ticketAi.classifyTicket(input),
      ticketAi.generatePriority(input),
    ]);
    const classify =
      settled[0].status === "fulfilled"
        ? settled[0].value
        : ticketAi.fallbackClassify("orchestrator-rejection");
    const priority =
      settled[1].status === "fulfilled"
        ? settled[1].value
        : ticketAi.fallbackPriority("orchestrator-rejection");

    // Mark whole row FALLBACK if either arm fell back — admins shouldn't trust mixed results.
    const source: "AI" | "FALLBACK" =
      classify.source === "AI" && priority.source === "AI" ? "AI" : "FALLBACK";

    // Pessimistic: lower of the two confidences.
    const confidence = Math.min(classify.confidence, priority.confidence);

    const latencyMs =
      classify.latencyMs !== undefined && priority.latencyMs !== undefined
        ? Math.max(classify.latencyMs, priority.latencyMs)
        : classify.latencyMs ?? priority.latencyMs ?? null;

    const tokens = (classify.tokens ?? 0) + (priority.tokens ?? 0);
    const totalTokens = tokens > 0 ? tokens : null;
    const usedModel = classify.model ?? priority.model ?? null;

    const meta: Partial<IAiMetadata> = {
      category: classify.category,
      priority: priority.priority,
      confidence,
      source,
      model: usedModel,
      classifiedAt: new Date(),
      latencyMs,
      tokens: totalTokens,
    };

    await ticketQueries.updateAiMetadata(ticketId, meta);

    await aiJobQueries.succeed({
      jobId,
      result: {
        category: classify.category,
        priority: priority.priority,
        confidence,
        source,
      },
      modelName: usedModel,
      latencyMs,
      tokens: totalTokens,
    });

    // Best-effort — a logging blip must not crash the worker.
    try {
      await activityQueries.log({
        ticketId,
        actorId: null,
        actorType: "AI",
        type: "AI_CLASSIFIED",
        after: {
          category: classify.category,
          priority: priority.priority,
          source,
          confidence,
        },
      });
    } catch (err) {
      logger.warn(
        { err, ticketId },
        "activity log failed: AI_CLASSIFIED",
      );
    }

    socketService.emit(
      SOCKET_EVENTS.TICKET_UPDATED,
      {
        ticketId,
        changes: {
          category: classify.category,
          priority: priority.priority,
          aiMetadata: { source, confidence },
        },
        by: source === "AI" ? "AI" : "AI_FALLBACK",
      },
      ["admins", `author:${authorIdStr}`],
    );
  } catch (err) {
    const message = err instanceof Error ? err.message : String(err);
    logger.error(
      { err: message, ticketId, aiFallback: true },
      "runTicketAi failed unexpectedly",
    );
    if (jobId) {
      // Not awaited — don't let a fail-write mask the original error.
      aiJobQueries.fail({ jobId, error: message }).catch(() => undefined);
    }
  }
};

export { GeminiService } from "./gemini.service";
export { TicketAiService } from "./ticket-ai.service";
export * from "./kb.service";
export * from "./prompt-builder.service";
