import { Types } from "mongoose";

export const isValidObjectId = (value: string | undefined | null): boolean => {
  if (typeof value !== "string" || value.length === 0) return false;
  return Types.ObjectId.isValid(value);
};

// Returns null (rather than throwing CastError) so callers can 404 cleanly.
export const toObjectId = (value: string): Types.ObjectId | null => {
  if (!isValidObjectId(value)) return null;
  return new Types.ObjectId(value);
};
