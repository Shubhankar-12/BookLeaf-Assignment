import pino, { Logger, LoggerOptions } from "pino";
import { config } from "../config/env";

const options: LoggerOptions = {
  level: config.LOG_LEVEL,
  base: { service: "bookleaf-support-backend" },
  timestamp: pino.stdTimeFunctions.isoTime,
};

// Pretty-print in dev for readability; structured JSON in prod for log aggregators.
const transport =
  !config.IS_PRODUCTION
    ? pino.transport({
        target: "pino-pretty",
        options: {
          colorize: true,
          translateTime: "SYS:standard",
          ignore: "pid,hostname,service",
        },
      })
    : undefined;

export const logger: Logger = transport ? pino(options, transport) : pino(options);
