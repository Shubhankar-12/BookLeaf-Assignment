import jwt, { SignOptions } from "jsonwebtoken";
import { config } from "../config/env";
import type { AuthUser } from "../types/api-response";

// `name` excluded so renaming a user doesn't invalidate tokens — verifyJWT re-hydrates it from the DB.
export type TokenPayload = Pick<AuthUser, "id" | "role" | "email">;

export const signToken = (payload: TokenPayload): string => {
  const options: SignOptions = {
    expiresIn: config.JWT_EXPIRES_IN as SignOptions["expiresIn"],
  };
  return jwt.sign(payload, config.JWT_SECRET, options);
};

export const verifyToken = (token: string): TokenPayload => {
  const decoded = jwt.verify(token, config.JWT_SECRET);
  if (typeof decoded !== "object" || decoded === null) {
    throw new Error("Invalid token payload");
  }
  const { id, role, email } = decoded as Partial<TokenPayload>;
  if (
    typeof id !== "string" ||
    typeof email !== "string" ||
    (role !== "ADMIN" && role !== "AUTHOR")
  ) {
    throw new Error("Invalid token payload");
  }
  return { id, role, email };
};
