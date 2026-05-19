import { z } from "zod";
import type { ValidationResult } from "../../../types/validation";
import { zMongoId } from "../../../validations/mongoId";
import type { GetTicketRequest } from "./request";

const schema = z.object({ id: zMongoId });

export const validateGetTicket = (
  data: unknown,
): ValidationResult<GetTicketRequest> => {
  const r = schema.safeParse(data);
  if (r.success) return { data: r.data, errors: [] };
  return {
    data: null,
    errors: r.error.issues.map(
      (i) => `${i.path.join(".") || "params"}: ${i.message}`,
    ),
  };
};
