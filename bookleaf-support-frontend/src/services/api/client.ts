"use client";

import axios, {
  AxiosError,
  AxiosHeaders,
  type AxiosInstance,
  type AxiosResponse,
  type InternalAxiosRequestConfig,
} from "axios";

import { env } from "@/config/env";
import { useAuthStore } from "@/store/auth.store";
import type { ApiError, ApiSuccess } from "@/types/api";

/**
 * Thrown for every non-2xx HTTP response and every network error. Keeps the
 * call-site logic clean: `try { ... } catch (e) { if (e instanceof ApiException) ... }`.
 */
export class ApiException extends Error {
  readonly status: number;
  readonly details?: unknown;

  constructor(message: string, status: number, details?: unknown) {
    super(message);
    this.name = "ApiException";
    this.status = status;
    this.details = details;
  }

  static fromAxios(error: AxiosError<ApiError>): ApiException {
    if (error.response) {
      const body = error.response.data as ApiError | undefined;
      return new ApiException(
        body?.error ?? error.message ?? "Request failed",
        error.response.status,
        body?.details,
      );
    }
    return new ApiException(
      error.message || "Network error",
      0,
      error.code ?? null,
    );
  }
}

const requestInterceptor = (config: InternalAxiosRequestConfig) => {
  // Reading the store at request time keeps us subscribed to the latest token
  // without coupling the client module to React render cycles.
  const token = useAuthStore.getState().token;
  if (token) {
    const headers = AxiosHeaders.from(config.headers);
    headers.set("Authorization", `Bearer ${token}`);
    config.headers = headers;
  }
  return config;
};

const responseInterceptor = <T,>(response: AxiosResponse<ApiSuccess<T>>) =>
  response;

const responseErrorInterceptor = (error: AxiosError<ApiError>) => {
  const status = error.response?.status;
  // 401 from the API layer means the token is missing/expired/invalid — drop
  // the cached identity and let route protection redirect to /login.
  if (status === 401) {
    if (typeof window !== "undefined") {
      useAuthStore.getState().clear();
    }
  }
  return Promise.reject(ApiException.fromAxios(error));
};

export const apiClient: AxiosInstance = axios.create({
  baseURL: env.API_URL,
  withCredentials: false,
  timeout: 20000,
});

apiClient.interceptors.request.use(requestInterceptor);
apiClient.interceptors.response.use(responseInterceptor, responseErrorInterceptor);

/**
 * Strips the envelope: every successful response is `{ success, message, data }`.
 * Generic helpers below let services stay terse — `await get<Book[]>("/books")`.
 */
const unwrap = <T,>(response: AxiosResponse<ApiSuccess<T>>): T =>
  response.data.data;

export const http = {
  get: async <T,>(url: string, params?: unknown) =>
    unwrap<T>(await apiClient.get<ApiSuccess<T>>(url, { params })),

  post: async <T,>(url: string, body?: unknown) =>
    unwrap<T>(await apiClient.post<ApiSuccess<T>>(url, body ?? {})),

  patch: async <T,>(url: string, body?: unknown) =>
    unwrap<T>(await apiClient.patch<ApiSuccess<T>>(url, body ?? {})),

  put: async <T,>(url: string, body?: unknown) =>
    unwrap<T>(await apiClient.put<ApiSuccess<T>>(url, body ?? {})),

  delete: async <T,>(url: string) =>
    unwrap<T>(await apiClient.delete<ApiSuccess<T>>(url)),
} as const;
