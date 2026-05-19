// No request body — the AI draft is derived entirely from the persisted ticket and its last 5 messages.
export interface AiDraftRequest {
  id: string;
}
