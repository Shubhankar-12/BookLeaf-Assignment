"use client";

import { useRouter } from "next/navigation";
import { useEffect, type ReactNode } from "react";

import { useAuthStore } from "@/store/auth.store";
import type { Role } from "@/types/api";

interface RouteGuardProps {
  role: Role;
  children: ReactNode;
}

/**
 * Client-side route protection. Pairs the persisted auth state with a
 * role check; anything that fails bounces to /login (or the user's correct
 * portal home if they're logged in as the wrong role).
 *
 * Gated on `hydrated` so the persisted token has a chance to load before we
 * declare the user unauthenticated. While unhydrated we render nothing
 * (loader UI lives in the layout) — never wrong content.
 */
export function RouteGuard({ role, children }: RouteGuardProps) {
  const router = useRouter();
  const hydrated = useAuthStore((s) => s.hydrated);
  const user = useAuthStore((s) => s.user);
  const token = useAuthStore((s) => s.token);

  useEffect(() => {
    if (!hydrated) return;
    if (!user || !token) {
      router.replace("/login");
      return;
    }
    if (user.role !== role) {
      router.replace(
        user.role === "ADMIN" ? "/admin/dashboard" : "/author/dashboard",
      );
    }
  }, [hydrated, user, token, role, router]);

  if (!hydrated || !user || user.role !== role) {
    return (
      <div className="flex min-h-screen items-center justify-center text-sm text-muted-foreground">
        Loading…
      </div>
    );
  }

  return <>{children}</>;
}
