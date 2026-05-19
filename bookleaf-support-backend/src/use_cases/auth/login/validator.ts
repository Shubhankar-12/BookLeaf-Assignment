import { z } from "zod";
import type { LoginRequest } from "./request";
import type { ValidationResult } from "../../../types/validation";

// No length minimum here — login should fail via bcrypt-compare, not pre-check.
// Length minimums belong on the signup validator (when we add one).
const schema = z.object({
  email: z.string().email("Must be a valid email"),
  password: z.string().min(1, "Password is required"),
});

export const validateLogin = (data: unknown): ValidationResult<LoginRequest> => {
  const r = schema.safeParse(data);
  if (r.success) return { data: r.data, errors: [] };
  return {
    data: null,
    errors: r.error.issues.map(
      (i) => `${i.path.join(".") || "body"}: ${i.message}`,
    ),
  };
};
