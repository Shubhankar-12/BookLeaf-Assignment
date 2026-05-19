"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { Loader2, Lock } from "lucide-react";
import { useForm } from "react-hook-form";

import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import {
  internalNoteSchema,
  type InternalNoteFormValues,
} from "../schemas/internal-note.schema";
import { useAdminInternalNote } from "../hooks/use-admin-tickets";

export function InternalNoteComposer({ ticketId }: { ticketId: string }) {
  const submit = useAdminInternalNote(ticketId);
  const {
    register,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm<InternalNoteFormValues>({
    resolver: zodResolver(internalNoteSchema),
    defaultValues: { body: "" },
  });

  const onSubmit = handleSubmit(async (values) => {
    await submit.mutateAsync(values.body);
    reset({ body: "" });
  });

  return (
    <form onSubmit={onSubmit} className="space-y-3 rounded-lg border border-amber-500/30 bg-amber-500/5 p-4">
      <div className="flex items-center gap-2 text-xs font-medium text-amber-800 dark:text-amber-300">
        <Lock className="h-3.5 w-3.5" />
        Internal note — visible to admins only
      </div>
      <Textarea
        rows={3}
        placeholder="Context, escalation reason, links to relevant info…"
        {...register("body")}
        aria-invalid={!!errors.body}
        className="resize-none bg-background"
      />
      {errors.body ? (
        <p className="text-xs text-destructive">{errors.body.message}</p>
      ) : null}
      <div className="flex justify-end">
        <Button
          type="submit"
          size="sm"
          variant="outline"
          disabled={submit.isPending}
          className="gap-2"
        >
          {submit.isPending ? (
            <Loader2 className="h-3.5 w-3.5 animate-spin" />
          ) : (
            <Lock className="h-3.5 w-3.5" />
          )}
          Save internal note
        </Button>
      </div>
    </form>
  );
}
