"use client";

import { create } from "zustand";
import { persist, createJSONStorage } from "zustand/middleware";

import type { AuthUser } from "@/types/api";

interface AuthState {
  user: AuthUser | null;
  token: string | null;
  hydrated: boolean;
  setSession: (user: AuthUser, token: string) => void;
  setUser: (user: AuthUser | null) => void;
  setHydrated: () => void;
  clear: () => void;
}

const SESSION_COOKIE = "bookleaf.session";

/**
 * Mirror the auth role into a JS-readable cookie so the Next.js Edge
 * middleware (which cannot read localStorage) can guard /author and /admin
 * before any client code runs. The cookie carries the role only — never the
 * JWT, never anything sensitive — so it being non-httpOnly is fine.
 */
function writeSessionCookie(role: string): void {
  if (typeof document === "undefined") return;
  // 8h matches the JWT expiry. Lax so it survives a same-site navigation.
  const maxAge = 8 * 60 * 60;
  document.cookie = `${SESSION_COOKIE}=${encodeURIComponent(role)}; Path=/; Max-Age=${maxAge}; SameSite=Lax`;
}

function clearSessionCookie(): void {
  if (typeof document === "undefined") return;
  document.cookie = `${SESSION_COOKIE}=; Path=/; Max-Age=0; SameSite=Lax`;
}

/**
 * Auth identity store. Persisted to localStorage so a refresh doesn't punt
 * the user to /login while we revalidate `/auth/me` in the background.
 *
 * `hydrated` flips to `true` once persistence has rehydrated — the route
 * guards key off this so they don't redirect on the first render before
 * the persisted token has been read back.
 */
export const useAuthStore = create<AuthState>()(
  persist(
    (set) => ({
      user: null,
      token: null,
      hydrated: false,
      setSession: (user, token) => {
        writeSessionCookie(user.role);
        set({ user, token });
      },
      setUser: (user) => {
        if (user) writeSessionCookie(user.role);
        set({ user });
      },
      setHydrated: () => set({ hydrated: true }),
      clear: () => {
        clearSessionCookie();
        set({ user: null, token: null });
      },
    }),
    {
      name: "bookleaf.auth",
      storage: createJSONStorage(() => localStorage),
      partialize: (state) => ({ user: state.user, token: state.token }),
      onRehydrateStorage: () => (state) => {
        state?.setHydrated();
        // After rehydration, re-establish the cookie. localStorage survives
        // browser sessions but the cookie may have expired — re-issuing it
        // keeps the middleware in sync with the stored identity.
        if (state?.user?.role) {
          writeSessionCookie(state.user.role);
        }
      },
    },
  ),
);
