import http from "http";
import { app } from "./app";
import { config } from "./config/env";
import { logger } from "./utils/logger";
import { DataBase } from "./db/connection";
import { createSocketServer } from "./sockets";
import { socketService } from "./services/socket.service";

// Eager connect so /healthz reflects real state.
DataBase.getDatabaseConnection();

// Raw http.Server so Socket.IO can share the same port + upgrade path.
const httpServer = http.createServer(app);
const io = createSocketServer(httpServer);
socketService.init(io);

httpServer.listen(config.PORT, () => {
  logger.info(
    {
      port: config.PORT,
      env: config.NODE_ENV,
    },
    "bookleaf-support-backend server started",
  );
});

const shutdown = (signal: NodeJS.Signals): void => {
  logger.info({ signal }, "Received shutdown signal, closing server...");

  // Order matters: io.close stops new connections; httpServer.close finishes draining; then Mongo.
  io.close(() => {
    httpServer.close((err) => {
      if (err) {
        logger.error({ err: err.message }, "Error during HTTP server shutdown");
        process.exit(1);
      }
      DataBase.disconnect()
        .then(() => {
          logger.info("Shutdown complete");
          process.exit(0);
        })
        .catch((dbErr: Error) => {
          logger.error({ err: dbErr.message }, "Error during DB disconnect");
          process.exit(1);
        });
    });
  });

  // Hard exit if graceful shutdown doesn't complete in 10s.
  setTimeout(() => {
    logger.error("Forced shutdown after 10s timeout");
    process.exit(1);
  }, 10_000).unref();
};

process.on("SIGTERM", shutdown);
process.on("SIGINT", shutdown);

process.on("unhandledRejection", (reason: unknown) => {
  logger.error({ reason }, "Unhandled promise rejection");
});

process.on("uncaughtException", (err: Error) => {
  logger.fatal({ err: err.message, stack: err.stack }, "Uncaught exception");
  process.exit(1);
});
