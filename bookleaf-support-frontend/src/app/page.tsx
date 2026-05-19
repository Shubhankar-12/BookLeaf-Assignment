"use client";

import { useRouter } from "next/navigation";
import { useEffect } from "react";

import { useAuthStore } from "@/store/auth.store";

/**
 * Root landing — purely a router. Hydrate-aware so we don't bounce the user
 * to /login on the first paint while persisted auth state is still loading.
 */
export default function RootPage() {
  const router = useRouter();
  const hydrated = useAuthStore((s) => s.hydrated);
  const user = useAuthStore((s) => s.user);

  useEffect(() => {
    if (!hydrated) return;
    if (!user) {
      router.replace("/login");
      return;
    }
    router.replace(user.role === "ADMIN" ? "/admin/dashboard" : "/author/dashboard");
  }, [hydrated, user, router]);

  return (
    <div className="flex min-h-screen items-center justify-center text-sm text-muted-foreground">
      Redirecting…
    </div>
  );
}
