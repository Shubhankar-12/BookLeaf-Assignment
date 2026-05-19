"use client";

import { useMutation, useQueryClient } from "@tanstack/react-query";
import { useRouter } from "next/navigation";
import { toast } from "sonner";

import { queryKeys } from "@/lib/query-keys";
import { ApiException } from "@/services/api/client";
import { authApi, type LoginPayload } from "@/services/api/auth.api";
import { useAuthStore } from "@/store/auth.store";

export function useLogin() {
  const router = useRouter();
  const queryClient = useQueryClient();
  const setSession = useAuthStore((s) => s.setSession);

  return useMutation({
    mutationFn: (payload: LoginPayload) => authApi.login(payload),
    onSuccess: ({ token, user }) => {
      setSession(user, token);
      queryClient.setQueryData(queryKeys.auth.me, user);
      toast.success(`Welcome back, ${user.name}`);
      router.replace(
        user.role === "ADMIN" ? "/admin/dashboard" : "/author/dashboard",
      );
    },
    onError: (error) => {
      const message =
        error instanceof ApiException ? error.message : "Sign-in failed";
      toast.error(message);
    },
  });
}
