import type { Server, Socket } from "socket.io";
import { logger } from "../utils/logger";
// SocketData augmentation lives in ./events.ts so `socket.data.user` is typed.
import "./events";

export const registerHandlers = (io: Server): void => {
  io.on("connection", (socket: Socket) => {
    const user = socket.data.user;

    // Defensive — socketAuth should have rejected before this. Kill rather than orphan in zero rooms.
    if (!user) {
      logger.warn(
        { socketId: socket.id },
        "socket connected without auth context — disconnecting",
      );
      socket.disconnect(true);
      return;
    }

    if (user.role === "AUTHOR") {
      socket.join(`author:${user.id}`);
    } else if (user.role === "ADMIN") {
      socket.join("admins");
    }

    logger.info(
      { userId: user.id, role: user.role, socketId: socket.id },
      "socket connected",
    );

    socket.on("disconnect", (reason: string) => {
      logger.info(
        { userId: user.id, role: user.role, socketId: socket.id, reason },
        "socket disconnected",
      );
    });
  });
};
