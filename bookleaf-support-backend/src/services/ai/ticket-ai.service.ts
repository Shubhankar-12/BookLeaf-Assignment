import { logger } from "../../utils/logger";
import {
  DEFAULT_AI_FALLBACK,
  TICKET_CATEGORIES,
  TICKET_PRIORITIES,
} from "../../constants/ticket";
import type {
  TicketCategory,
  TicketPriority,
} from "../../constants/ticket";
import type { SenderType } from "../../db/message";
import type { GeminiService } from "./gemini.service";
import { chooseChunks } from "./kb.service";
import {
  buildClassifyPrompt,
  buildPriorityPrompt,
  buildDraftPrompt,
} from "./prompt-builder.service";

export interface ClassifyTicketInput {
  subject: string;
  description: string;
}

export interface ClassifyTicketResult {
  category: TicketCategory;
  confidence: number;
  source: "AI" | "FALLBACK";
  latencyMs?: number;
  tokens?: number;
  model?: string;
}

export interface GeneratePriorityInput {
  subject: string;
  description: string;
}

export interface GeneratePriorityResult {
  priority: TicketPriority;
  confidence: number;
  source: "AI" | "FALLBACK";
  latencyMs?: number;
  tokens?: number;
  model?: string;
}

export interface GenerateDraftInput {
  subject: string;
  description: string;
  recentMessages: { senderType: SenderType; body: string }[];
}

export interface GenerateDraftResult {
  draft: string | null;
  tokens?: number;
  model?: string;
  source: "AI" | "FALLBACK";
  reason?: string;
}

// AI methods never throw — errors convert to FALLBACK results so ticket flows aren't blocked.
export class TicketAiService {
  constructor(private readonly gemini: GeminiService) {}

  async classifyTicket(
    input: ClassifyTicketInput,
  ): Promise<ClassifyTicketResult> {
    try {
      const { system, user } = buildClassifyPrompt(input);
      const res = await this.gemini.chatCompletion({
        system,
        user,
        jsonMode: true,
        maxTokens: 100,
      });

      logger.info(
        {
          op: "classifyTicket",
          rawContent: res.content,
          tokens: res.tokens,
          latencyMs: res.latencyMs,
          model: res.model,
        },
        "AI raw response: classifyTicket",
      );

      const parsed = this.parseClassifyResponse(res.content);
      if (!parsed) {
        return this.fallbackClassify("AI returned unparseable classification");
      }

      logger.info(
        {
          op: "classifyTicket",
          category: parsed.category,
          confidence: parsed.confidence,
        },
        "AI parsed response: classifyTicket",
      );

      return {
        category: parsed.category,
        confidence: parsed.confidence,
        source: "AI",
        latencyMs: res.latencyMs,
        tokens: res.tokens,
        model: res.model,
      };
    } catch (err) {
      return this.fallbackClassify(this.errorReason(err));
    }
  }

  async generatePriority(
    input: GeneratePriorityInput,
  ): Promise<GeneratePriorityResult> {
    try {
      const { system, user } = buildPriorityPrompt(input);
      const res = await this.gemini.chatCompletion({
        system,
        user,
        jsonMode: true,
        maxTokens: 100,
      });

      logger.info(
        {
          op: "generatePriority",
          rawContent: res.content,
          tokens: res.tokens,
          latencyMs: res.latencyMs,
          model: res.model,
        },
        "AI raw response: generatePriority",
      );

      const parsed = this.parsePriorityResponse(res.content);
      if (!parsed) {
        return this.fallbackPriority("AI returned unparseable priority");
      }

      logger.info(
        {
          op: "generatePriority",
          priority: parsed.priority,
          confidence: parsed.confidence,
        },
        "AI parsed response: generatePriority",
      );

      return {
        priority: parsed.priority,
        confidence: parsed.confidence,
        source: "AI",
        latencyMs: res.latencyMs,
        tokens: res.tokens,
        model: res.model,
      };
    } catch (err) {
      return this.fallbackPriority(this.errorReason(err));
    }
  }

  async generateDraft(
    input: GenerateDraftInput,
  ): Promise<GenerateDraftResult> {
    try {
      const kbChunks = chooseChunks({
        subject: input.subject,
        description: input.description,
        includeTone: true,
      });

      const { system, user } = buildDraftPrompt({
        subject: input.subject,
        description: input.description,
        recentMessages: input.recentMessages,
        kbChunks,
      });

      const res = await this.gemini.chatCompletion({
        system,
        user,
        jsonMode: false,
        maxTokens: 500,
      });

      const draft = res.content.trim();
      if (draft.length === 0) {
        return this.fallbackDraft("AI returned empty draft");
      }

      return {
        draft,
        source: "AI",
        tokens: res.tokens,
        model: res.model,
      };
    } catch (err) {
      return this.fallbackDraft(this.errorReason(err));
    }
  }

  // Trim before comparing — model occasionally emits trailing spaces even in JSON mode.
  private isCategory(s: unknown): s is TicketCategory {
    return (
      typeof s === "string" &&
      (TICKET_CATEGORIES as readonly string[]).includes(s.trim())
    );
  }

  private isPriority(s: unknown): s is TicketPriority {
    return (
      typeof s === "string" &&
      (TICKET_PRIORITIES as readonly string[]).includes(s.trim())
    );
  }

  private parseClassifyResponse(
    raw: string,
  ): { category: TicketCategory; confidence: number } | null {
    let obj: unknown;
    try {
      obj = JSON.parse(raw);
    } catch {
      return null;
    }
    if (!obj || typeof obj !== "object") return null;
    const o = obj as Record<string, unknown>;
    if (!this.isCategory(o.category)) return null;
    const confidence = typeof o.confidence === "number" ? o.confidence : 0;
    return {
      category: o.category.trim() as TicketCategory,
      confidence: this.clampConfidence(confidence),
    };
  }

  private parsePriorityResponse(
    raw: string,
  ): { priority: TicketPriority; confidence: number } | null {
    let obj: unknown;
    try {
      obj = JSON.parse(raw);
    } catch {
      return null;
    }
    if (!obj || typeof obj !== "object") return null;
    const o = obj as Record<string, unknown>;
    if (!this.isPriority(o.priority)) return null;
    const confidence = typeof o.confidence === "number" ? o.confidence : 0;
    return {
      priority: o.priority.trim() as TicketPriority,
      confidence: this.clampConfidence(confidence),
    };
  }

  private clampConfidence(n: number): number {
    if (Number.isNaN(n)) return 0;
    if (n < 0) return 0;
    if (n > 1) return 1;
    return n;
  }

  private errorReason(err: unknown): string {
    if (err instanceof Error) return err.message;
    return "unknown AI error";
  }

  fallbackClassify(reason: string): ClassifyTicketResult {
    logger.warn(
      { aiFallback: true, reason, op: "classifyTicket" },
      "AI fallback: classifyTicket",
    );
    return {
      category: DEFAULT_AI_FALLBACK.category,
      confidence: 0,
      source: "FALLBACK",
    };
  }

  fallbackPriority(reason: string): GeneratePriorityResult {
    logger.warn(
      { aiFallback: true, reason, op: "generatePriority" },
      "AI fallback: generatePriority",
    );
    return {
      priority: DEFAULT_AI_FALLBACK.priority,
      confidence: 0,
      source: "FALLBACK",
    };
  }

  private fallbackDraft(reason: string): GenerateDraftResult {
    logger.warn(
      { aiFallback: true, reason, op: "generateDraft" },
      "AI fallback: generateDraft",
    );
    return {
      draft: null,
      source: "FALLBACK",
      reason,
    };
  }
}
