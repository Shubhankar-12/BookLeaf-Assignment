import type { ValidationResult } from "../../../types/validation";
import { zPagination, type Pagination } from "../../../validations/pagination";

export const validateListBooks = (
  data: unknown,
): ValidationResult<Pagination> => {
  const r = zPagination.safeParse(data);
  if (r.success) return { data: r.data, errors: [] };
  return {
    data: null,
    errors: r.error.issues.map(
      (i) => `${i.path.join(".") || "query"}: ${i.message}`,
    ),
  };
};
