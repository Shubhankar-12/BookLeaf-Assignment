import type * as http from "http";
import { Server } from "socket.io";
import { config } from "../config/env";
import { socketAuth } from "./auth.middleware";
import { registerHandlers } from "./handlers";

export const createSocketServer = (httpServer: http.Server): Server => {
  const io = new Server(httpServer, {
    cors: {
      origin: config.CORS_ORIGINS,
      credentials: true,
    },
  });

  io.use(socketAuth);
  registerHandlers(io);

  return io;
};

export { SOCKET_EVENTS } from "./events";
export type {
  SocketEventName,
  SocketEventPayload,
  TicketCreatedPayload,
  TicketUpdatedPayload,
  MessageNewPayload,
} from "./events";
