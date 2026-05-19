"use client";

import {
  BookOpen,
  BookOpenCheck,
  LayoutDashboard,
  LifeBuoy,
  type LucideIcon,
  Tags,
  Tickets,
} from "lucide-react";
import Link from "next/link";
import { usePathname } from "next/navigation";

import { cn } from "@/lib/utils";
import type { Role } from "@/types/api";

interface NavItem {
  href: string;
  label: string;
  icon: LucideIcon;
}

const AUTHOR_NAV: NavItem[] = [
  { href: "/author/dashboard", label: "Dashboard", icon: LayoutDashboard },
  { href: "/author/books", label: "My Books", icon: BookOpen },
  { href: "/author/tickets", label: "Support Tickets", icon: Tickets },
  { href: "/author/support/new", label: "New Ticket", icon: LifeBuoy },
];

const ADMIN_NAV: NavItem[] = [
  { href: "/admin/dashboard", label: "Dashboard", icon: LayoutDashboard },
  { href: "/admin/tickets", label: "Ticket Queue", icon: Tags },
];

export function Sidebar({ role }: { role: Role }) {
  const pathname = usePathname();
  const items = role === "ADMIN" ? ADMIN_NAV : AUTHOR_NAV;

  return (
    <aside className="hidden border-r bg-card/40 md:block md:w-64 md:shrink-0">
      <div className="flex h-16 items-center gap-2 border-b px-5 text-base font-semibold">
        <BookOpenCheck className="h-5 w-5 text-primary" />
        BookLeaf
        <span className="ml-1 rounded bg-muted px-2 py-0.5 text-[10px] font-medium uppercase tracking-wider text-muted-foreground">
          {role === "ADMIN" ? "Admin" : "Author"}
        </span>
      </div>
      <nav className="flex flex-col gap-1 p-3 text-sm">
        {items.map((item) => {
          const active =
            pathname === item.href || pathname.startsWith(`${item.href}/`);
          const Icon = item.icon;
          return (
            <Link
              key={item.href}
              href={item.href}
              className={cn(
                "flex items-center gap-3 rounded-md px-3 py-2 transition-colors",
                active
                  ? "bg-primary/10 text-primary font-medium"
                  : "text-muted-foreground hover:bg-muted hover:text-foreground",
              )}
            >
              <Icon className="h-4 w-4" />
              {item.label}
            </Link>
          );
        })}
      </nav>
    </aside>
  );
}
