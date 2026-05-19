"use client";

import { Loader2 } from "lucide-react";

import { Card, CardContent } from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  PRIORITY_LABEL,
  STATUS_LABEL,
  TICKET_CATEGORIES,
  TICKET_PRIORITIES,
  TICKET_STATUSES,
  type TicketCategory,
  type TicketPriority,
  type TicketStatus,
} from "@/constants/ticket";
import type { AdminTicketDetail } from "@/types/ticket";

import {
  useUpdateCategory,
  useUpdatePriority,
  useUpdateStatus,
} from "../hooks/use-admin-tickets";

export function TicketOverrides({ ticket }: { ticket: AdminTicketDetail }) {
  const updateStatus = useUpdateStatus(ticket.id);
  const updateCategory = useUpdateCategory(ticket.id);
  const updatePriority = useUpdatePriority(ticket.id);

  const busy =
    updateStatus.isPending ||
    updateCategory.isPending ||
    updatePriority.isPending;

  return (
    <Card>
      <CardContent className="space-y-4 p-5">
        <div className="flex items-center justify-between">
          <p className="text-sm font-semibold">Overrides</p>
          {busy ? (
            <span className="inline-flex items-center gap-1 text-xs text-muted-foreground">
              <Loader2 className="h-3 w-3 animate-spin" /> Saving…
            </span>
          ) : null}
        </div>

        <div className="space-y-3">
          <div className="space-y-1.5">
            <Label className="text-xs uppercase tracking-wider text-muted-foreground">
              Status
            </Label>
            <Select
              value={ticket.status}
              onValueChange={(v) => updateStatus.mutate(v as TicketStatus)}
            >
              <SelectTrigger>
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                {TICKET_STATUSES.map((s) => (
                  <SelectItem key={s} value={s}>
                    {STATUS_LABEL[s]}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          <div className="space-y-1.5">
            <Label className="text-xs uppercase tracking-wider text-muted-foreground">
              Priority
            </Label>
            <Select
              value={ticket.priority ?? ""}
              onValueChange={(v) => updatePriority.mutate(v as TicketPriority)}
            >
              <SelectTrigger>
                <SelectValue placeholder="Set priority" />
              </SelectTrigger>
              <SelectContent>
                {TICKET_PRIORITIES.map((p) => (
                  <SelectItem key={p} value={p}>
                    {PRIORITY_LABEL[p]}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          <div className="space-y-1.5">
            <Label className="text-xs uppercase tracking-wider text-muted-foreground">
              Category
            </Label>
            <Select
              value={ticket.category ?? ""}
              onValueChange={(v) => updateCategory.mutate(v as TicketCategory)}
            >
              <SelectTrigger>
                <SelectValue placeholder="Set category" />
              </SelectTrigger>
              <SelectContent>
                {TICKET_CATEGORIES.map((c) => (
                  <SelectItem key={c} value={c}>
                    {c}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
