"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { Loader2, Send } from "lucide-react";
import { useForm } from "react-hook-form";

import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";

import { replySchema, type ReplyFormValues } from "../schemas/reply.schema";

interface ReplyComposerProps {
  isSubmitting?: boolean;
  placeholder?: string;
  submitLabel?: string;
  onSubmit: (values: ReplyFormValues) => Promise<unknown> | unknown;
}

export function ReplyComposer({
  isSubmitting,
  placeholder = "Type your reply…",
  submitLabel = "Send reply",
  onSubmit,
}: ReplyComposerProps) {
  const {
    register,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm<ReplyFormValues>({
    resolver: zodResolver(replySchema),
    defaultValues: { body: "" },
  });

  const submit = handleSubmit(async (values) => {
    await onSubmit(values);
    reset({ body: "" });
  });

  return (
    <form onSubmit={submit} className="space-y-3">
      <Textarea
        rows={4}
        placeholder={placeholder}
        {...register("body")}
        aria-invalid={!!errors.body}
        className="resize-none"
      />
      {errors.body ? (
        <p className="text-xs text-destructive">{errors.body.message}</p>
      ) : null}
      <div className="flex justify-end">
        <Button type="submit" disabled={isSubmitting} className="gap-2">
          {isSubmitting ? (
            <Loader2 className="h-4 w-4 animate-spin" />
          ) : (
            <Send className="h-4 w-4" />
          )}
          {submitLabel}
        </Button>
      </div>
    </form>
  );
}
