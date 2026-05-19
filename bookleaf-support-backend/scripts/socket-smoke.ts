import { io as ioClient, Socket } from "socket.io-client";
import { logger } from "../src/utils/logger";

const SERVER_URL = process.env.SOCKET_URL ?? "http://localhost:8080";

interface ClientSpec {
  label: string;
  token: string | undefined;
}

const specs: ClientSpec[] = [
  { label: "ADMIN", token: process.env.ADMIN_TOKEN },
  { label: "AUTHOR1", token: process.env.AUTHOR1_TOKEN },
  { label: "AUTHOR2", token: process.env.AUTHOR2_TOKEN },
];

const sockets: Socket[] = [];

for (const spec of specs) {
  if (!spec.token) {
    logger.warn({ client: spec.label }, "No token set — skipping");
    continue;
  }

  const socket = ioClient(SERVER_URL, {
    auth: { token: spec.token },
    transports: ["websocket"],
    reconnection: false,
  });

  socket.on("connect", () => {
    logger.info({ client: spec.label, socketId: socket.id }, "Connected");
  });

  socket.on("connect_error", (err: Error) => {
    logger.error({ client: spec.label, err: err.message }, "Connect error");
  });

  socket.on("disconnect", (reason: string) => {
    logger.info({ client: spec.label, reason }, "Disconnected");
  });

  for (const event of ["ticket:created", "ticket:updated", "message:new"]) {
    socket.on(event, (payload: unknown) => {
      logger.info({ client: spec.label, event, payload }, "Event received");
    });
  }

  sockets.push(socket);
}

const shutdown = (): void => {
  logger.info("Shutting down smoke clients");
  for (const s of sockets) s.close();
  process.exit(0);
};

process.on("SIGINT", shutdown);
process.on("SIGTERM", shutdown);
