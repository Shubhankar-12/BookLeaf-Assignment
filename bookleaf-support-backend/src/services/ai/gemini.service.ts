import { GoogleGenAI } from "@google/genai";
import { config } from "../../config/env";
import { logger } from "../../utils/logger";

export interface ChatCompletionInput {
  system: string;
  user: string;
  jsonMode?: boolean;
  model?: string;
  maxTokens?: number;
}

export interface ChatCompletionOutput {
  content: string;
  tokens: number;
  latencyMs: number;
  model: string;
}

// Disabled mode (no API key) throws synthetically — ticket-ai layer converts to FALLBACK.
export class GeminiService {
  private readonly client: GoogleGenAI | null;
  public readonly enabled: boolean;
  public readonly defaultModel: string;

  constructor() {
    this.defaultModel = config.GEMINI_MODEL;
    const key = config.GEMINI_API_KEY;

    if (!key || key.trim().length === 0) {
      this.client = null;
      this.enabled = false;
      logger.warn(
        { aiFallback: true, reason: "GEMINI_API_KEY missing" },
        "Gemini service initialized in DISABLED mode - all calls will fall back",
      );
      return;
    }

    this.client = new GoogleGenAI({ apiKey: key });
    this.enabled = true;
  }

  async chatCompletion(
    input: ChatCompletionInput,
  ): Promise<ChatCompletionOutput> {
    if (!this.enabled || !this.client) {
      throw new Error("AI disabled: GEMINI_API_KEY not configured");
    }

    const model = input.model ?? this.defaultModel;
    const started = Date.now();

    const response = await this.client.models.generateContent({
      model,
      contents: input.user,
      config: {
        systemInstruction: input.system,
        // Disable Gemini 2.5 Flash "thinking" — eats maxOutputTokens and truncates our JSON enum output.
        thinkingConfig: { thinkingBudget: 0 },
        ...(input.jsonMode
          ? { responseMimeType: "application/json" as const }
          : {}),
        ...(input.maxTokens !== undefined
          ? { maxOutputTokens: input.maxTokens }
          : {}),
      },
    });

    const latencyMs = Date.now() - started;
    const content = response.text ?? "";
    const tokens = response.usageMetadata?.totalTokenCount ?? 0;

    return {
      content,
      tokens,
      latencyMs,
      model,
    };
  }
}
