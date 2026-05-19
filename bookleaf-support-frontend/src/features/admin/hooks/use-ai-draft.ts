"use client";

import { useMutation } from "@tanstack/react-query";
import { toast } from "sonner";

import { ApiException } from "@/services/api/client";
import { aiApi } from "@/services/api/ai.api";

export function useAiDraft(ticketId: string) {
  return useMutation({
    mutationFn: () => aiApi.generateDraft(ticketId),
    onError: (err) => {
      const message =
        err instanceof ApiException
          ? err.status === 503
            ? "AI is unavailable right now — try again shortly."
            : err.message
          : "AI draft failed";
      toast.error(message);
    },
  });
}
