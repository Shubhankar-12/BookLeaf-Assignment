import { z } from "zod";

// Coerces `?page=2` strings to numbers and caps limit to keep a runaway query from spilling huge pages.
export const zPagination = z.object({
  page: z.coerce.number().int().min(1).default(1),
  limit: z.coerce.number().int().min(1).max(100).default(20),
});

export type Pagination = z.infer<typeof zPagination>;
