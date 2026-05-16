import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";

export function middleware(request: NextRequest) {
  const token = request.cookies.get("auth_token")?.value;
  const role = request.cookies.get("auth_role")?.value?.toLowerCase();

  const path = request.nextUrl.pathname;

  const isPublicPath =
    path.startsWith("/signin") ||
    path.startsWith("/signup") ||
    path.startsWith("/forgot-password") ||
    path.startsWith("/reset-password") ||
    path.startsWith("/verify-email") ||
    path.startsWith("/verify-reset-otp");

  const isAdmin = role === "admin";

  // Auth pages are only blocked for authenticated admin users.
  if (isPublicPath && token && isAdmin) {
    return NextResponse.redirect(new URL("/", request.url));
  }

  // Protected pages require both a token and admin role.
  if (!isPublicPath && (!token || !isAdmin)) {
    return NextResponse.redirect(new URL("/signin", request.url));
  }

  return NextResponse.next();
}

export const config = {
  matcher: [
    "/((?!api|_next/static|_next/image|favicon.ico|.*\\.png$|.*\\.jpg$|.*\\.svg$).*)",
  ],
};
