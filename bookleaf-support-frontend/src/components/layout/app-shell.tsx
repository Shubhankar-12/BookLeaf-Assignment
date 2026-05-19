"use client";

import type { ReactNode } from "react";

import { MobileNav } from "./mobile-nav";
import { Sidebar } from "./sidebar";
import { Topbar } from "./topbar";
import type { Role } from "@/types/api";

export function AppShell({
  role,
  children,
}: {
  role: Role;
  children: ReactNode;
}) {
  return (
    <div className="flex min-h-screen bg-background">
      <Sidebar role={role} />
      <div className="flex min-h-screen flex-1 flex-col">
        <Topbar />
        <main className="flex-1 px-4 py-6 md:px-8 md:py-8">
          <div className="mx-auto w-full max-w-7xl space-y-6">{children}</div>
        </main>
        <MobileNav role={role} />
      </div>
    </div>
  );
}
