import express, { Application, NextFunction, Request, Response } from "express";
import cors from "cors";
import cookieParser from "cookie-parser";
import pinoHttp from "pino-http";
import swaggerJSDoc from "swagger-jsdoc";
import swaggerUi from "swagger-ui-express";

import { config } from "./config/env";
import { swaggerOptions } from "./config/swagger";
import { logger } from "./utils/logger";
import { ResponseUtil } from "./utils/response";
import { getDbStatus } from "./db/connection";
import { requestIdMiddleware } from "./helpers/RequestIdMiddleware";
import { errorMiddleware } from "./helpers/ErrorMiddleware";
import { apiRouter } from "./routes";

const app: Application = express();

// Must run before any other middleware — every downstream log/error needs the request id.
app.use(requestIdMiddleware);

// Per-request access log. Mounted after requestIdMiddleware so reqId is reused as the log's req.id;
// /healthz is silenced to keep probe traffic out of the access log.
app.use(
  pinoHttp({
    logger,
    genReqId: (req) => (req as Request).id,
    autoLogging: {
      ignore: (req) => req.url === "/healthz",
    },
    customLogLevel: (_req, res, err) => {
      if (err || res.statusCode >= 500) return "error";
      if (res.statusCode >= 400) return "warn";
      return "info";
    },
  }),
);

app.use(
  cors({
    origin: config.CORS_ORIGINS,
    credentials: true,
  }),
);

app.use(express.json({ limit: "1mb" }));
app.use(express.urlencoded({ extended: true, limit: "1mb" }));
app.use(cookieParser());

// Mounted at app root (not under /api) so external probes don't depend on the api prefix.
app.get("/healthz", (_req: Request, res: Response) => {
  ResponseUtil.success(res, "ok", {
    status: "ok",
    uptime: process.uptime(),
    db: getDbStatus(),
  });
});

app.use("/api", apiRouter);

const swaggerSpec = swaggerJSDoc(swaggerOptions);
app.use(
  "/api-docs",
  swaggerUi.serve,
  swaggerUi.setup(swaggerSpec, {
    customSiteTitle: "BookLeaf Support API Docs",
  }),
);
app.get("/api-docs.json", (_req: Request, res: Response) => {
  res.json(swaggerSpec);
});

app.use((req: Request, res: Response, _next: NextFunction) => {
  ResponseUtil.error(
    res,
    `Route not found: ${req.method} ${req.originalUrl}`,
    404,
  );
});

// Centralized error handler — must be last.
app.use(errorMiddleware);

export { app };
