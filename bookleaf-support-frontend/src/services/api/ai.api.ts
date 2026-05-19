"use client";

import { http } from "./client";
import type { AiDraftResponse } from "@/types/ticket";

export const aiApi = {
  generateDraft: (ticketId: string) =>
    http.post<AiDraftResponse>(`/admin/tickets/${ticketId}/ai-draft`),
} as const;
