"use client";

import { ArrowLeft, Paperclip } from "lucide-react";
import Link from "next/link";
import { useParams } from "next/navigation";

import { ErrorState } from "@/components/common/error-state";
import { PageHeader } from "@/components/common/page-header";
import {
  TicketCategoryBadge,
  TicketPriorityBadge,
  TicketStatusBadge,
} from "@/components/common/status-badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";
import {
  ActivityLog,
  AiDraftPanel,
  InternalNoteComposer,
  TicketOverrides,
  useAdminRespond,
  useAdminTicket,
} from "@/features/admin";
import {
  AiClassificationCard,
  MessageThread,
  ReplyComposer,
} from "@/features/tickets";
import { absoluteTime } from "@/lib/date";
import { formatBytes } from "@/lib/utils";
import { useAuthStore } from "@/store/auth.store";

export default function AdminTicketDetailPage() {
  const params = useParams<{ id: string }>();
  const id = params.id;
  const user = useAuthStore((s) => s.user);
  const { data, isLoading, isError, refetch } = useAdminTicket(id);
  const respond = useAdminRespond(id);

  return (
    <>
      <Button asChild variant="ghost" size="sm" className="w-fit gap-2 px-0">
        <Link href="/admin/tickets">
          <ArrowLeft className="h-4 w-4" /> Back to queue
        </Link>
      </Button>

      {isLoading ? (
        <div className="space-y-4">
          <Skeleton className="h-24" />
          <Skeleton className="h-40" />
          <Skeleton className="h-32" />
        </div>
      ) : isError || !data ? (
        <ErrorState onRetry={() => refetch()} />
      ) : (
        <>
          <PageHeader
            title={data.subject}
            description={`Author #${data.authorId.slice(-6)} · Opened ${absoluteTime(data.createdAt)}`}
            actions={
              <div className="flex flex-wrap items-center gap-2">
                <TicketStatusBadge status={data.status} />
                <TicketPriorityBadge priority={data.priority} />
                <TicketCategoryBadge category={data.category} />
              </div>
            }
          />

          <AiClassificationCard
            ai={data.aiMetadata}
            category={data.category}
            priority={data.priority}
          />

          <div className="grid gap-4 lg:grid-cols-[1fr,320px]">
            <div className="space-y-4">
              <Card>
                <CardContent className="space-y-2 p-6">
                  <p className="text-xs font-medium uppercase tracking-wider text-muted-foreground">
                    Description
                  </p>
                  <p className="whitespace-pre-wrap text-sm leading-relaxed">
                    {data.description}
                  </p>
                </CardContent>
              </Card>

              {data.attachments?.length ? (
                <Card>
                  <CardContent className="space-y-3 p-6">
                    <p className="text-xs font-medium uppercase tracking-wider text-muted-foreground">
                      Attachments
                    </p>
                    <ul className="space-y-2">
                      {data.attachments.map((a) => (
                        <li
                          key={a.key}
                          className="flex items-center justify-between rounded border bg-muted/40 px-3 py-2 text-xs"
                        >
                          <div className="flex items-center gap-2">
                            <Paperclip className="h-3 w-3" />
                            <span className="truncate">
                              {a.key.split("/").pop()}
                            </span>
                          </div>
                          <span className="text-muted-foreground">
                            {formatBytes(a.size)}
                          </span>
                        </li>
                      ))}
                    </ul>
                  </CardContent>
                </Card>
              ) : null}

              <Card>
                <CardContent className="space-y-5 p-6">
                  <div className="space-y-1">
                    <p className="text-xs font-medium uppercase tracking-wider text-muted-foreground">
                      Conversation
                    </p>
                    <p className="text-sm text-muted-foreground">
                      Public replies go to the author. Internal notes stay
                      visible only to admins.
                    </p>
                  </div>
                  <MessageThread
                    messages={data.messages}
                    selfName={user?.name ?? "Admin"}
                    selfRole="ADMIN"
                  />
                  <ReplyComposer
                    isSubmitting={respond.isPending}
                    submitLabel="Reply to author"
                    placeholder="Reply to the author…"
                    onSubmit={(values) => respond.mutateAsync(values.body)}
                  />
                  <InternalNoteComposer ticketId={id} />
                </CardContent>
              </Card>

              <AiDraftPanel ticketId={id} />
            </div>

            <div className="space-y-4">
              <TicketOverrides ticket={data} />
              <Card>
                <CardContent className="space-y-3 p-5">
                  <p className="text-sm font-semibold">Activity log</p>
                  <ActivityLog entries={data.activity ?? []} />
                </CardContent>
              </Card>
            </div>
          </div>
        </>
      )}
    </>
  );
}
