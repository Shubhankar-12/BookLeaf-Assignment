"use client";

import { AppShell } from "@/components/layout/app-shell";
import { RouteGuard } from "@/components/layout/route-guard";

export default function AuthorLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <RouteGuard role="AUTHOR">
      <AppShell role="AUTHOR">{children}</AppShell>
    </RouteGuard>
  );
}
