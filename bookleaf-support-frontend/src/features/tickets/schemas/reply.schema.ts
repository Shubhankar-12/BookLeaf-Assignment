import { z } from "zod";

export const replySchema = z.object({
  body: z
    .string()
    .min(1, "Reply cannot be empty")
    .max(5000, "Reply must be 5000 characters or less")
    .trim(),
});

export type ReplyFormValues = z.infer<typeof replySchema>;
