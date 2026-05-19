import { AuthUser } from "./api-response";

declare global {
  namespace Express {
    interface Request {
      /** Populated by verifyJWT middleware in Phase 2+. */
      user?: AuthUser;
      /** Populated by RequestIdMiddleware (registered first in app.ts). */
      id: string;
    }
  }
}

export {};
