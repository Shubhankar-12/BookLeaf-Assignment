import { z } from "zod";
import type { ValidationResult } from "../../../types/validation";
import { zMongoId } from "../../../validations/mongoId";
import { TICKET_STATUSES, type TicketStatus } from "../../../constants/ticket";

export interface ValidatedUpdateStatus {
  params: { id: string };
  body: { status: TicketStatus };
}

const paramsSchema = z.object({ id: zMongoId });
const bodySchema = z.object({ status: z.enum(TICKET_STATUSES) });

export const validateUpdateStatus = (
  params: unknown,
  body: unknown,
): ValidationResult<ValidatedUpdateStatus> => {
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
