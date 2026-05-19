import { z } from "zod";

import { TICKET_CATEGORIES } from "@/constants/ticket";
import {
  ALLOWED_UPLOAD_TYPES,
  MAX_ATTACHMENTS_PER_TICKET,
  MAX_UPLOAD_BYTES,
} from "@/constants/uploads";

const attachmentSchema = z.object({
  key: z.string().min(1),
  contentType: z.enum(ALLOWED_UPLOAD_TYPES),
  size: z
    .number()
    .int()
    .min(1)
    .max(MAX_UPLOAD_BYTES, "Each file must be under 25 MB"),
});

/** Mirrors backend `bookleaf-support-backend/src/use_cases/ticket/create/validator.ts`. */
export const createTicketSchema = z.object({
  subject: z
    .string()
    .min(3, "Subject must be at least 3 characters")
    .max(200, "Subject must be 200 characters or less")
    .trim(),
  description: z
    .string()
    .min(10, "Describe the issue in at least 10 characters")
    .max(5000, "Description must be 5000 characters or less")
    .trim(),
  bookId: z.string().trim().optional().or(z.literal("")),
  attachments: z
    .array(attachmentSchema)
    .max(MAX_ATTACHMENTS_PER_TICKET, `Max ${MAX_ATTACHMENTS_PER_TICKET} attachments`)
    .optional(),
});

export type CreateTicketFormValues = z.infer<typeof createTicketSchema>;

// Re-exported for select option lists in the form.
export const TICKET_CATEGORY_OPTIONS = TICKET_CATEGORIES;
