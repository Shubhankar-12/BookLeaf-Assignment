/**
 * Shared API envelope shapes. The backend wraps every response in
 * `{ success, message, data }` on success or `{ success, error, details? }`
 * on failure — see `bookleaf-support-backend/src/types/api-response.ts`.
 */

export type Role = "ADMIN" | "AUTHOR";

export interface AuthUser {
  id: string;
  email: string;
  name: string;
  role: Role;
}

export interface ApiSuccess<T> {
  success: true;
  message: string;
  data: T;
}

export interface ApiError {
  success: false;
  error: string;
  details?: unknown;
}

export type ApiResponse<T> = ApiSuccess<T> | ApiError;

/** Pagination envelope (mirrors backend `paginatedResponse`). */
export interface Paginated<T> {
  data: T[];
  total: number;
  page: number;
  limit: number;
}

export interface PaginationParams {
  page?: number;
  limit?: number;
}
