/** Mirrors `bookleaf-support-backend/src/constants/uploads.ts`. */

export const MAX_UPLOAD_BYTES = 25 * 1024 * 1024;
export const UPLOAD_CONTENT_TYPE_PATTERN =
  /^image\/(png|jpeg|webp)$|^application\/pdf$/;
export const MAX_ATTACHMENTS_PER_TICKET = 5;

export const ALLOWED_UPLOAD_TYPES = [
  "image/png",
  "image/jpeg",
  "image/webp",
  "application/pdf",
] as const;
export type AllowedUploadType = (typeof ALLOWED_UPLOAD_TYPES)[number];
