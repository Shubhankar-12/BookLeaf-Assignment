import { z } from "zod";
import type { ValidationResult } from "../../../types/validation";
import { zPagination } from "../../../validations/pagination";
import { TICKET_STATUSES, type TicketStatus } from "../../../constants/ticket";

export interface ValidatedListTicketsQuery {
  page: number;
  limit: number;
  status?: TicketStatus;
}

const schema = zPagination.extend({
  status: z.enum(TICKET_STATUSES).optional(),
});

export const validateListTickets = (
  data: unknown,
): ValidationResult<ValidatedListTicketsQuery> => {
  const r = schema.safeParse(data);
  if (r.success) return { data: r.data, errors: [] };
  return {
    data: null,
    errors: r.error.issues.map(
      (i) => `${i.path.join(".") || "query"}: ${i.message}`,
    ),
  };
};
