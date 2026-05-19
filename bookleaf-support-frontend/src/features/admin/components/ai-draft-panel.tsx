"use client";

import { Bot, Loader2, RefreshCcw, Send, Sparkles } from "lucide-react";
import { useState } from "react";

import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Textarea } from "@/components/ui/textarea";
import { useAiDraft } from "../hooks/use-ai-draft";
import { useAdminRespond } from "../hooks/use-admin-tickets";

export function AiDraftPanel({ ticketId }: { ticketId: string }) {
  const [draft, setDraft] = useState("");
  const [source, setSource] = useState<"AI" | "FALLBACK" | null>(null);
  const aiDraft = useAiDraft(ticketId);
  const respond = useAdminRespond(ticketId);

  const generate = async () => {
    const result = await aiDraft.mutateAsync();
    setDraft(result.draft);
    setSource(result.source);
  };

  const send = async () => {
    if (!draft.trim()) return;
    await respond.mutateAsync(draft.trim());
    setDraft("");
    setSource(null);
  };

  return (
    <Card className="border-primary/20 bg-primary/[0.03]">
      <CardContent className="space-y-4 p-5">
        <div className="flex items-start justify-between gap-3">
          <div className="flex items-start gap-3">
            <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-primary/10 text-primary">
              <Sparkles className="h-4 w-4" />
            </div>
            <div>
              <p className="text-sm font-semibold">AI draft</p>
              <p className="text-xs text-muted-foreground">
                Generate a reply rooted in the BookLeaf knowledge base, then
                edit before sending.
              </p>
            </div>
          </div>
          {source ? (
            <Badge
              variant={source === "AI" ? "default" : "warning"}
              className="gap-1"
            >
              <Bot className="h-3 w-3" />
              {source === "AI" ? "AI generated" : "Fallback"}
            </Badge>
          ) : null}
        </div>

        <Textarea
          value={draft}
          onChange={(e) => setDraft(e.target.value)}
          rows={8}
          placeholder="Click 'Generate draft' to seed a reply…"
          className="resize-none bg-background"
        />

        <div className="flex flex-wrap items-center justify-between gap-2">
          <Button
            variant="outline"
            size="sm"
            onClick={generate}
            disabled={aiDraft.isPending}
            className="gap-2"
          >
            {aiDraft.isPending ? (
              <Loader2 className="h-3.5 w-3.5 animate-spin" />
            ) : draft ? (
              <RefreshCcw className="h-3.5 w-3.5" />
            ) : (
              <Sparkles className="h-3.5 w-3.5" />
            )}
            {draft ? "Regenerate" : "Generate draft"}
          </Button>
          <Button
            size="sm"
            disabled={!draft.trim() || respond.isPending}
            onClick={send}
            className="gap-2"
          >
            {respond.isPending ? (
              <Loader2 className="h-3.5 w-3.5 animate-spin" />
            ) : (
              <Send className="h-3.5 w-3.5" />
            )}
            Send to author
          </Button>
        </div>
      </CardContent>
    </Card>
  );
}
