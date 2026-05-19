import { z } from "zod";

// Shared so every `:id` param rejects with the same "Invalid id" message.
export const zMongoId = z
  .string()
  .regex(/^[0-9a-fA-F]{24}$/, "Invalid id");
