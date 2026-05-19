import type { AuthUser } from "../../../types/api-response";
import type { ValidationResult } from "../../../types/validation";

export const validateMe = (
  user: AuthUser | undefined,
): ValidationResult<AuthUser> => {
  if (!user) {
    return { data: null, errors: ["user: not authenticated"] };
  }
  return { data: user, errors: [] };
};
