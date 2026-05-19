import { z } from "zod";
import type { ValidationResult } from "../../../types/validation";
import { zMongoId } from "../../../validations/mongoId";
import type { CreateTicketRequest } from "./request";

const schema = z.object({
  subject: z
    .string()
    .trim()
    .min(3, "subject must be at least 3 chars")
    .max(200, "subject must be at most 200 chars"),
  description: z
    .string()
    .trim()
    .min(10, "description must be at least 10 chars")
    .max(5000, "description must be at most 5000 chars"),
  bookId: zMongoId.optional(),
});

export const validateCreateTicket = (
  data: unknown,
): ValidationResult<CreateTicketRequest> => {
  const r = schema.safeParse(data);
  if (r.success) return { data: r.data, errors: [] };
  return {
    data: null,
    errors: r.error.issues.map(
      (i) => `${i.path.join(".") || "body"}: ${i.message}`,
    ),
  };
};
