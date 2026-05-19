export interface ValidationResult<T> {
  data: T | null;
  errors: string[];
}
