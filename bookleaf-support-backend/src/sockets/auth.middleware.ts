import type { Socket } from "socket.io";
import { verifyToken } from "../utils/token";
import { userQueries } from "../db/queries";
import { logger } from "../utils/logger";

// Mirror of verifyJWT for socket handshakes. Re-fetches the user so a deleted account is rejected even with a valid token.
export const socketAuth = async (
  socket: Socket,
  next: (err?: Error) => void,
): Promise<void> => {
  try {
    const rawToken = socket.handshake.auth?.token;
    const token = typeof rawToken === "string" && rawToken.length > 0
      ? rawToken
      : null;

    if (!token) {
      logger.warn(
        { socketId: socket.id, reason: "no token" },
        "socket auth rejected",
      );
      next(new Error("Unauthorized"));
      return;
    }

    const decoded = verifyToken(token);
    const user = await userQueries.getUserById(decoded.id);
    if (!user) {
      logger.warn(
        { socketId: socket.id, userId: decoded.id, reason: "user not found" },
        "socket auth rejected",
      );
      next(new Error("Unauthorized"));
      return;
    }

    socket.data.user = {
      id: user._id.toString(),
      role: user.role,
      email: user.email,
      name: user.name,
    };
    next();
  } catch (err) {
    // Any thrown error (bad signature, expired, malformed payload) → reject.
    logger.warn({ err, socketId: socket.id }, "socket auth failed");
    next(new Error("Unauthorized"));
  }
};
