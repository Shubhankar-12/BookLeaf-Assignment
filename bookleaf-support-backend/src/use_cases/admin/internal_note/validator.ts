import { z } from "zod";
import type { ValidationResult } from "../../../types/validation";
import { zMongoId } from "../../../validations/mongoId";
import type { InternalNoteRequest } from "./request";

const paramsSchema = z.object({ id: zMongoId });
const bodySchema = z.object({
  body: z
    .string()
    .trim()
    .min(1, "body is required")
    .max(5000, "body must be at most 5000 chars"),
});

export const validateInternalNote = (
  params: unknown,
  body: unknown,
): ValidationResult<InternalNoteRequest> => {
  const p = paramsSchema.safeParse(params);
  const b = bodySchema.safeParse(body);

  if (p.success && b.success) {
    return { data: { params: p.data, body: b.data }, errors: [] };
  }

  const errors: string[] = [];
  if (!p.success) {
    errors.push(
      ...p.error.issues.map(
        (i) => `params.${i.path.join(".") || "id"}: ${i.message}`,
      ),
    );
  }
  if (!b.success) {
    errors.push(
      ...b.error.issues.map(
        (i) => `body.${i.path.join(".") || "body"}: ${i.message}`,
      ),
    );
  }
  return { data: null, errors };
};
