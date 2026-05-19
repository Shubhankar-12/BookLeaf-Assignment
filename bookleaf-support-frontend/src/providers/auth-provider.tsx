"use client";

import { useQuery } from "@tanstack/react-query";
import { useEffect, type ReactNode } from "react";

import { queryKeys } from "@/lib/query-keys";
import { authApi } from "@/services/api/auth.api";
import { useAuthStore } from "@/store/auth.store";

/**
 * Background revalidator. On mount (and whenever the persisted token
 * changes) it asks the API "who am I?" — if the JWT is dead, the response
 * interceptor wipes the session via `useAuthStore.clear()` and the route
 * guards bounce the user to /login.
 *
 * Render-side it's a no-op: the visible auth state still comes from the
 * Zustand store so consumers never wait on a network round-trip.
 */
export function AuthProvider({ children }: { children: ReactNode }) {
  const token = useAuthStore((s) => s.token);
  const setUser = useAuthStore((s) => s.setUser);

  const { data, isSuccess } = useQuery({
    queryKey: queryKeys.auth.me,
    queryFn: authApi.me,
    enabled: Boolean(token),
    staleTime: 60_000,
    retry: false,
  });

  useEffect(() => {
    if (isSuccess && data) setUser(data);
  }, [isSuccess, data, setUser]);

  return <>{children}</>;
}
