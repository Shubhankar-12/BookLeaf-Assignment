import { NextResponse, type NextRequest } from "next/server";

/**
 * Edge middleware — guards /author/* and /admin/* before any client code
 * runs. Backstops the client-side <RouteGuard> so an unauthenticated user
 * never sees a flash of the protected layout while React hydrates.
 *
 * Source of truth: the `bookleaf.session` cookie, which the auth store
 * writes alongside its localStorage state (store/auth.store.ts). We only
 * trust the cookie for *presence*, not authorisation — the API enforces
 * role on every request and the in-app guard enforces it on every render.
 */

const SESSION_COOKIE = "bookleaf.session";

export function middleware(req: NextRequest): NextResponse {
  const { pathname, searchParams } = req.nextUrl;

  const role = req.cookies.get(SESSION_COOKIE)?.value ?? null;

  // If the user already has a session, bounce them away from /login back
  // to their role's home — saves them seeing the login screen on refresh.
  if (pathname === "/login" && role) {
    const target = role === "ADMIN" ? "/admin/dashboard" : "/author/dashboard";
    return NextResponse.redirect(new URL(target, req.url));
  }

  // Protected segments. If no session cookie, redirect to /login carrying
  // ?next so we can come back here after sign-in (the login page can read
  // it via useSearchParams).
  if (pathname.startsWith("/author") || pathname.startsWith("/admin")) {
    if (!role) {
      const url = req.nextUrl.clone();
      url.pathname = "/login";
      url.searchParams.set("next", pathname + (searchParams.toString() ? `?${searchParams}` : ""));
      return NextResponse.redirect(url);
    }
    // Cross-role landing: an AUTHOR cookie hitting /admin (or vice versa)
    // gets bounced to their own home rather than to /login.
    if (pathname.startsWith("/admin") && role !== "ADMIN") {
      return NextResponse.redirect(new URL("/author/dashboard", req.url));
    }
    if (pathname.startsWith("/author") && role !== "AUTHOR") {
      return NextResponse.redirect(new URL("/admin/dashboard", req.url));
    }
  }

  return NextResponse.next();
}

export const config = {
  // Apply to login + every protected segment. We deliberately do NOT match
  // the root "/" — the root page handles its own redirect once the auth
  // store has hydrated.
  matcher: ["/login", "/author/:path*", "/admin/:path*"],
};
