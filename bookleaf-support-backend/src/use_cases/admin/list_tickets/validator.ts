import { z } from "zod";
import type { ValidationResult } from "../../../types/validation";
import { zPagination } from "../../../validations/pagination";
import { zMongoId } from "../../../validations/mongoId";
import {
  TICKET_CATEGORIES,
  TICKET_PRIORITIES,
  TICKET_STATUSES,
  type TicketCategory,
  type TicketPriority,
  type TicketStatus,
} from "../../../constants/ticket";

export interface ValidatedListAdminTicketsQuery {
  page: number;
  limit: number;
  status?: TicketStatus;
  priority?: TicketPriority;
  category?: TicketCategory;
  assignedTo?: string;
  search?: string;
}

const schema = zPagination.extend({
  status: z.enum(TICKET_STATUSES).optional(),
  priority: z.enum(TICKET_PRIORITIES).optional(),
  category: z.enum(TICKET_CATEGORIES).optional(),
  assignedTo: zMongoId.optional(),
  search: z.string().trim().min(1).max(200).optional(),
});

export const validateListAdminTickets = (
  data: unknown,
): ValidationResult<ValidatedListAdminTicketsQuery> => {
  const r = schema.safeParse(data);
  if (r.success) return { data: r.data, errors: [] };
  return {
    data: null,
    errors: r.error.issues.map(
      (i) => `${i.path.join(".") || "query"}: ${i.message}`,
    ),
  };
};
