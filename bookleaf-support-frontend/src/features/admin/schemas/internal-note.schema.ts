import { z } from "zod";

export const internalNoteSchema = z.object({
  body: z
    .string()
    .min(1, "Note cannot be empty")
    .max(5000, "Note must be 5000 characters or less")
    .trim(),
});

export type InternalNoteFormValues = z.infer<typeof internalNoteSchema>;
