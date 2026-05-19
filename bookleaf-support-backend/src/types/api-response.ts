export type Role = "ADMIN" | "AUTHOR";

export interface AuthUser {
  id: string;
  role: Role;
  email: string;
  name: string;
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

// `status` is an optional HTTP code hint the controller honors (defaults to 400).
export interface UseCaseError {
  error: string;
  status?: number;
}
export type UseCaseResult<T> = T | UseCaseError;
