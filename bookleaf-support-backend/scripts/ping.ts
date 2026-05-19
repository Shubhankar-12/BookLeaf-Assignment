import { logger } from "../src/utils/logger";

const LIVE_URL = process.env.LIVE_URL;
const INTERVAL_MS = 5 * 60 * 1000;

if (!LIVE_URL) {
  logger.error("LIVE_URL env is required (e.g. https://your-app.onrender.com)");
  process.exit(1);
}

const target = `${LIVE_URL.replace(/\/$/, "")}/healthz`;

const ping = async (): Promise<void> => {
  const startedAt = Date.now();
  try {
    const res = await fetch(target, { method: "GET" });
    const latencyMs = Date.now() - startedAt;
    if (res.ok) {
      logger.info({ target, status: res.status, latencyMs }, "ping ok");
    } else {
      logger.warn({ target, status: res.status, latencyMs }, "ping non-2xx");
    }
  } catch (err) {
    const latencyMs = Date.now() - startedAt;
    logger.error(
      { target, latencyMs, err: err instanceof Error ? err.message : String(err) },
      "ping failed",
    );
  }
};

logger.info({ target, intervalMs: INTERVAL_MS }, "ping scheduler started");

void ping();
const handle = setInterval(() => void ping(), INTERVAL_MS);

const shutdown = (): void => {
  logger.info("shutting down ping scheduler");
  clearInterval(handle);
  process.exit(0);
};

process.on("SIGINT", shutdown);
process.on("SIGTERM", shutdown);
