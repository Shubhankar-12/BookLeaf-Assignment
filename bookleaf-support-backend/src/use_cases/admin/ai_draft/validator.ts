import { z } from "zod";
import type { ValidationResult } from "../../../types/validation";
import { zMongoId } from "../../../validations/mongoId";
import type { AiDraftRequest } from "./request";

const paramsSchema = z.object({ id: zMongoId });

export const validateAiDraft = (
  params: unknown,
): ValidationResult<AiDraftRequest> => {
  const r = paramsSchema.safeParse(params);
  if (r.success) return { data: r.data, errors: [] };
  return {
    data: null,
    errors: r.error.issues.map(
      (i) => `${i.path.join(".") || "params"}: ${i.message}`,
    ),
  };
};
