import { type NextRequest, NextResponse } from "next/server";
import { updateSession } from "@/lib/supabase/proxy";
import { getCurrentProfile } from "@/lib/data/current-profile";

const ALLOWED_ROUTES_BY_ROLE: Record<string, string[]> = {
  user: ["/", "/mrm", "/profile"],
  hod: ["/", "/mrm", "/material-master", "/profile"],
  store: ["/", "/material-master", "/mrm", "/profile"],
};

const PUBLIC_ROUTES = ["/login", "/unauthorized"];

export async function proxy(request: NextRequest) {
  const { pathname, origin } = request.nextUrl;

  if (
    pathname.startsWith("/api/issue-callback") ||
    pathname.startsWith("/api/store")
  ) {
    return NextResponse.next();
  }

  const isPublicRoute = PUBLIC_ROUTES.some((route) =>
    pathname.startsWith(route),
  );
  if (isPublicRoute) {
    return updateSession(request);
  }

  // Fetch user
  const user = await getCurrentProfile();
  if (!user) {
    return NextResponse.redirect(new URL("/login", origin));
  }

  const { role, isActive } = user;

  // HARD BLOCK: inactive users
  if (!isActive) {
    return NextResponse.redirect(new URL("/unauthorized", origin));
  }

  // Admin bypass (active admin)
  if (role === "admin") {
    return updateSession(request);
  }

  // Role-based route check
  const allowedRoutes = ALLOWED_ROUTES_BY_ROLE[role] ?? [];

  const isAllowed = allowedRoutes.some((route) => {
    if (route === "/" && pathname === "/") return true;
    if (route !== "/" && pathname.startsWith(route)) return true;
    return false;
  });

  if (!isAllowed) {
    return NextResponse.redirect(new URL("/unauthorized", origin));
  }

  return updateSession(request);
}

export const config = {
  matcher: [
    "/((?!_next/static|_next/image|favicon.ico|.*\\.(?:svg|png|jpg|jpeg|gif|webp)$).*)",
  ],
};
