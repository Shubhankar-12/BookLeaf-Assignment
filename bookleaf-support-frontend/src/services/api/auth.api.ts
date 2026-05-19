"use client";

import { http } from "./client";
import type { AuthUser } from "@/types/api";

export interface LoginPayload {
  email: string;
  password: string;
}

export interface LoginResponse {
  token: string;
  user: AuthUser;
}

export const authApi = {
  login: (payload: LoginPayload) =>
    http.post<LoginResponse>("/auth/login", payload),
  me: () => http.get<AuthUser>("/auth/me"),
  logout: () => http.post<{ loggedOut: true }>("/auth/logout"),
} as const;
