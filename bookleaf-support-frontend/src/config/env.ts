/**
 * Validated, typed access to public env vars. Throws at module-load time if
 * a required variable is missing so a misconfigured deploy fails fast instead
 * of falling over the first time a request goes out.
 */

const required = (name: string, value: string | undefined): string => {
  if (!value || value.trim() === "") {
    throw new Error(
      `Missing required environment variable: ${name}. ` +
        `Add it to .env.local (see .env.example).`,
    );
  }
  return value;
};

export const env = {
  API_URL: required("NEXT_PUBLIC_API_URL", process.env.NEXT_PUBLIC_API_URL),
  SOCKET_URL: required(
    "NEXT_PUBLIC_SOCKET_URL",
    process.env.NEXT_PUBLIC_SOCKET_URL,
  ),
} as const;
