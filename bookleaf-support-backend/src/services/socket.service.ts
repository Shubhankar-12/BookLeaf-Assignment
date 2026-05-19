import type { Server } from "socket.io";
import { logger } from "../utils/logger";
import type {
  SocketEventName,
  SocketEventPayload,
} from "../sockets/events";

// emit() is synchronous and non-throwing — a failing socket layer must never take down a successful HTTP request.
class SocketService {
  private io: Server | null = null;

  init(io: Server): void {
    this.io = io;
    logger.info({}, "SocketService initialized");
  }

  emit<E extends SocketEventName>(
    event: E,
    payload: SocketEventPayload<E>,
    rooms: string[],
  ): void {
    if (!this.io) {
      logger.warn(
        { event, rooms },
        "socketService.emit called before init — skipped",
      );
      return;
    }
    if (rooms.length === 0) {
      logger.warn(
        { event },
        "socketService.emit called with no rooms — skipped",
      );
      return;
    }

    try {
      this.io.to(rooms).emit(event, payload);
    } catch (err) {
      logger.warn({ err, event, rooms }, "socketService.emit failed");
    }
  }
}

export const socketService = new SocketService();
