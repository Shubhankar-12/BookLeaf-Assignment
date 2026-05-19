import { z } from "zod";
import type { ValidationResult } from "../../../types/validation";
import { zMongoId } from "../../../validations/mongoId";

export interface ValidatedAssignTicket {
  params: { id: string };
  body: { assigneeId: string | null };
}

const paramsSchema = z.object({ id: zMongoId });
// `assigneeId: null` is the explicit un-assign signal — accept both.
const bodySchema = z.object({
  assigneeId: zMongoId.nullable(),
});

export const validateAssignTicket = (
  params: unknown,
  body: unknown,
): ValidationResult<ValidatedAssignTicket> => {
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
