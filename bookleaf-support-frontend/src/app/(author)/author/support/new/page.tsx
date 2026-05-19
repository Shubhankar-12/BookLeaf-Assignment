"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { ArrowLeft, Loader2, Sparkles } from "lucide-react";
import Link from "next/link";
import { useRouter, useSearchParams } from "next/navigation";
import { useForm } from "react-hook-form";

import { PageHeader } from "@/components/common/page-header";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Textarea } from "@/components/ui/textarea";
import { useBooks } from "@/features/books";
import {
  createTicketSchema,
  type CreateTicketFormValues,
  useCreateTicket,
} from "@/features/tickets";

const NO_BOOK = "__none";

export default function NewTicketPage() {
  const router = useRouter();
  const params = useSearchParams();
  const prefillBookId = params.get("bookId") ?? "";
  const booksQuery = useBooks({ page: 1, limit: 100 });
  const createTicket = useCreateTicket();

  const {
    register,
    handleSubmit,
    setValue,
    watch,
    formState: { errors },
  } = useForm<CreateTicketFormValues>({
    resolver: zodResolver(createTicketSchema),
    defaultValues: {
      subject: "",
      description: "",
      bookId: prefillBookId,
    },
  });

  const bookId = watch("bookId");

  const onSubmit = handleSubmit(async (values) => {
    const created = await createTicket.mutateAsync({
      subject: values.subject,
      description: values.description,
      bookId: values.bookId && values.bookId !== NO_BOOK ? values.bookId : undefined,
    });
    router.push(`/author/tickets/${created.id}`);
  });

  return (
    <>
      <Button asChild variant="ghost" size="sm" className="w-fit gap-2 px-0">
        <Link href="/author/tickets">
          <ArrowLeft className="h-4 w-4" /> Back to tickets
        </Link>
      </Button>

      <PageHeader
        title="Raise a support ticket"
        description="Tell us what's happening — AI will route it to the right team in seconds."
      />

      <Card>
        <CardContent className="p-6">
          <form onSubmit={onSubmit} className="space-y-5" noValidate>
            <div className="space-y-2">
              <Label htmlFor="subject">Subject</Label>
              <Input
                id="subject"
                placeholder="Short summary of the issue"
                {...register("subject")}
                aria-invalid={!!errors.subject}
              />
              {errors.subject ? (
                <p className="text-xs text-destructive">
                  {errors.subject.message}
                </p>
              ) : null}
            </div>

            <div className="space-y-2">
              <Label htmlFor="bookId">Related book (optional)</Label>
              <Select
                value={bookId || NO_BOOK}
                onValueChange={(v) =>
                  setValue("bookId", v === NO_BOOK ? "" : v, {
                    shouldDirty: true,
                  })
                }
              >
                <SelectTrigger id="bookId">
                  <SelectValue placeholder="None" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value={NO_BOOK}>None</SelectItem>
                  {booksQuery.data?.data.map((b) => (
                    <SelectItem key={b.id} value={b.id}>
                      {b.title}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-2">
              <Label htmlFor="description">Description</Label>
              <Textarea
                id="description"
                rows={8}
                placeholder="Share the context, what you tried, and what you expected."
                {...register("description")}
                aria-invalid={!!errors.description}
                className="resize-none"
              />
              {errors.description ? (
                <p className="text-xs text-destructive">
                  {errors.description.message}
                </p>
              ) : null}
              <p className="flex items-center gap-1.5 text-xs text-muted-foreground">
                <Sparkles className="h-3 w-3 text-primary" />
                AI will classify priority and category automatically — admins
                can override.
              </p>
            </div>

            <div className="flex justify-end gap-2 pt-2">
              <Button asChild variant="outline" type="button">
                <Link href="/author/tickets">Cancel</Link>
              </Button>
              <Button type="submit" disabled={createTicket.isPending}>
                {createTicket.isPending ? (
                  <>
                    <Loader2 className="h-4 w-4 animate-spin" /> Submitting…
                  </>
                ) : (
                  "Submit ticket"
                )}
              </Button>
            </div>
          </form>
        </CardContent>
      </Card>
    </>
  );
}
