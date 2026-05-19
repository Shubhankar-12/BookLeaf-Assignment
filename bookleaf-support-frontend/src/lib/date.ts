import { format, formatDistanceToNowStrict, parseISO } from "date-fns";

export function relativeTime(iso: string): string {
  try {
    return `${formatDistanceToNowStrict(parseISO(iso))} ago`;
  } catch {
    return iso;
  }
}

export function absoluteTime(iso: string, pattern = "MMM d, yyyy h:mm a") {
  try {
    return format(parseISO(iso), pattern);
  } catch {
    return iso;
  }
}

export function shortDate(iso: string) {
  return absoluteTime(iso, "MMM d, yyyy");
}
