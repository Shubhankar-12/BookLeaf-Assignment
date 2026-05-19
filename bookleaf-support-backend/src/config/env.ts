import * as dotenv from "dotenv";
import { z } from "zod";

// Only load .env in non-production environments — in prod the runtime
// (Render / Railway / Docker) injects env vars directly.
if (process.env.NODE_ENV !== "production") {
  dotenv.config();
}

const envSchema = z.object({
  NODE_ENV: z
    .enum(["development", "production", "test"])
    .default("development"),
  PORT: z.coerce.number().int().positive().default(8080),

  // Mongo
  MONGO_URI: z.string().min(1, "MONGO_URI is required"),

  // Auth — required from Phase 2 onward
  JWT_SECRET: z.string().min(1, "JWT_SECRET is required"),
  JWT_EXPIRES_IN: z.string().default("7d"),

  // CORS (comma-separated list parsed into string[])
  CORS_ORIGIN: z.string().default("http://localhost:3000"),

  // Gemini — wired up in Phase 5
  GEMINI_API_KEY: z.string().optional(),
  GEMINI_MODEL: z.string().default("gemini-2.5-flash"),

  // Logging
  LOG_LEVEL: z
    .enum(["fatal", "error", "warn", "info", "debug", "trace", "silent"])
    .default("info"),
});

const parsed = envSchema.safeParse(process.env);

if (!parsed.success) {
  const issues = parsed.error.issues
    .map((i) => `  - ${i.path.join(".")}: ${i.message}`)
    .join("\n");
  // Fail fast — let the process crash so the operator sees this immediately.
  throw new Error(
    `Invalid environment configuration:\n${issues}\n\nSee .env.example for the expected shape.`,
  );
}

const raw = parsed.data;

export const config = {
  ...raw,
  /** CORS_ORIGIN as a clean array of origins. */
  CORS_ORIGINS: raw.CORS_ORIGIN.split(",")
    .map((s) => s.trim())
    .filter((s) => s.length > 0),
  IS_PRODUCTION: raw.NODE_ENV === "production",
  IS_DEVELOPMENT: raw.NODE_ENV === "development",
} as const;

export type AppConfig = typeof config;
