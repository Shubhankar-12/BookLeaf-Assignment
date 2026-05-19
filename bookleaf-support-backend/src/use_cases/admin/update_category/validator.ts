import { z } from "zod";
import type { ValidationResult } from "../../../types/validation";
import { zMongoId } from "../../../validations/mongoId";
import {
  TICKET_CATEGORIES,
  type TicketCategory,
} from "../../../constants/ticket";

export interface ValidatedUpdateCategory {
  params: { id: string };
  body: { category: TicketCategory };
}

const paramsSchema = z.object({ id: zMongoId });
const bodySchema = z.object({ category: z.enum(TICKET_CATEGORIES) });

export const validateUpdateCategory = (
  params: unknown,
  body: unknown,
): ValidationResult<ValidatedUpdateCategory> => {
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
