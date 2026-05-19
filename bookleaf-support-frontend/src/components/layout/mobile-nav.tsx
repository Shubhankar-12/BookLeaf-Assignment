"use client";

import {
  BookOpen,
  LayoutDashboard,
  LifeBuoy,
  Tags,
  Tickets,
  type LucideIcon,
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
  { href: "/author/dashboard", label: "Home", icon: LayoutDashboard },
  { href: "/author/books", label: "Books", icon: BookOpen },
  { href: "/author/tickets", label: "Tickets", icon: Tickets },
  { href: "/author/support/new", label: "Ask", icon: LifeBuoy },
];

const ADMIN_NAV: NavItem[] = [
  { href: "/admin/dashboard", label: "Home", icon: LayoutDashboard },
  { href: "/admin/tickets", label: "Queue", icon: Tags },
];

export function MobileNav({ role }: { role: Role }) {
  const pathname = usePathname();
  const items = role === "ADMIN" ? ADMIN_NAV : AUTHOR_NAV;

  return (
    <nav className="sticky bottom-0 z-30 grid border-t bg-card/95 backdrop-blur md:hidden"
         style={{ gridTemplateColumns: `repeat(${items.length}, 1fr)` }}>
      {items.map((item) => {
        const active =
          pathname === item.href || pathname.startsWith(`${item.href}/`);
        const Icon = item.icon;
        return (
          <Link
            key={item.href}
            href={item.href}
            className={cn(
              "flex flex-col items-center justify-center gap-1 py-2 text-[11px]",
              active ? "text-primary" : "text-muted-foreground",
            )}
          >
            <Icon className="h-4 w-4" />
            {item.label}
          </Link>
        );
      })}
    </nav>
  );
}
