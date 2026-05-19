"use client";

import { useMutation, useQueryClient } from "@tanstack/react-query";
import { useRouter } from "next/navigation";

import { authApi } from "@/services/api/auth.api";
import { useAuthStore } from "@/store/auth.store";

export function useLogout() {
  const router = useRouter();
  const queryClient = useQueryClient();
  const clear = useAuthStore((s) => s.clear);

  return useMutation({
    mutationFn: () => authApi.logout(),
    onSettled: () => {
      clear();
      queryClient.clear();
      router.replace("/login");
    },
  });
}
