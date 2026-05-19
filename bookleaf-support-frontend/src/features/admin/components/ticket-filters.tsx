"use client";

import { Search, X } from "lucide-react";
import { useEffect, useState } from "react";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
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

const ALL = "__all";

export interface AdminFilterState {
  status?: TicketStatus;
  priority?: TicketPriority;
  category?: TicketCategory;
  search?: string;
}

interface TicketFiltersProps {
  value: AdminFilterState;
  onChange: (next: AdminFilterState) => void;
}

export function TicketFilters({ value, onChange }: TicketFiltersProps) {
  const [search, setSearch] = useState(value.search ?? "");

  // Debounced free-text search keeps the queue from refetching on every keystroke.
  useEffect(() => {
    const timeout = setTimeout(() => {
      if ((value.search ?? "") !== search) {
        onChange({ ...value, search: search || undefined });
      }
    }, 300);
    return () => clearTimeout(timeout);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [search]);

  const hasActiveFilters = Boolean(
    value.status || value.priority || value.category || value.search,
  );

  return (
    <div className="flex flex-wrap items-center gap-2 rounded-lg border bg-card/40 px-3 py-2">
      <div className="relative w-full sm:w-72">
        <Search className="pointer-events-none absolute left-2.5 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
        <Input
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          placeholder="Search subject…"
          className="pl-8"
        />
      </div>

      <Select
        value={value.status ?? ALL}
        onValueChange={(v) =>
          onChange({
            ...value,
            status: v === ALL ? undefined : (v as TicketStatus),
          })
        }
      >
        <SelectTrigger className="w-44">
          <SelectValue placeholder="Status" />
        </SelectTrigger>
        <SelectContent>
          <SelectItem value={ALL}>All statuses</SelectItem>
          {TICKET_STATUSES.map((s) => (
            <SelectItem key={s} value={s}>
              {STATUS_LABEL[s]}
            </SelectItem>
          ))}
        </SelectContent>
      </Select>

      <Select
        value={value.priority ?? ALL}
        onValueChange={(v) =>
          onChange({
            ...value,
            priority: v === ALL ? undefined : (v as TicketPriority),
          })
        }
      >
        <SelectTrigger className="w-40">
          <SelectValue placeholder="Priority" />
        </SelectTrigger>
        <SelectContent>
          <SelectItem value={ALL}>All priorities</SelectItem>
          {TICKET_PRIORITIES.map((p) => (
            <SelectItem key={p} value={p}>
              {PRIORITY_LABEL[p]}
            </SelectItem>
          ))}
        </SelectContent>
      </Select>

      <Select
        value={value.category ?? ALL}
        onValueChange={(v) =>
          onChange({
            ...value,
            category: v === ALL ? undefined : (v as TicketCategory),
          })
        }
      >
        <SelectTrigger className="w-56">
          <SelectValue placeholder="Category" />
        </SelectTrigger>
        <SelectContent>
          <SelectItem value={ALL}>All categories</SelectItem>
          {TICKET_CATEGORIES.map((c) => (
            <SelectItem key={c} value={c}>
              {c}
            </SelectItem>
          ))}
        </SelectContent>
      </Select>

      {hasActiveFilters ? (
        <Button
          variant="ghost"
          size="sm"
          className="gap-1.5 text-xs"
          onClick={() => {
            setSearch("");
            onChange({});
          }}
        >
          <X className="h-3 w-3" />
          Clear
        </Button>
      ) : null}
    </div>
  );
}
