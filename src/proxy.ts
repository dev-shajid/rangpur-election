import { NextRequest, NextResponse } from "next/server";
import { auth } from "./auth";
import { authRoutes, DEFAUTL_AUTH_REDIRECT, superAdminRoutes } from "./routes";
import { isSuperAdmin } from "./services/session.service";

/**
 * Authentication middleware for Next.js 15
 * Handles route protection and redirects based on authentication status
 */
export async function proxy(request: NextRequest) {
  const { pathname } = request.nextUrl;

  const isPrivateRoute = superAdminRoutes.includes(pathname);
  const isAuthRoute = authRoutes.includes(pathname);
  const session = await auth();
  const superAdmin = await isSuperAdmin();

  const isAuthenticated = !!session;

  if (isAuthRoute) {
    if (isAuthenticated) {
      return NextResponse.redirect(new URL(DEFAUTL_AUTH_REDIRECT, request.url));
    }
    return NextResponse.next();
  }

  if (!superAdmin && isPrivateRoute) {
    return NextResponse.redirect(new URL(DEFAUTL_AUTH_REDIRECT, request.url));
  }

  return NextResponse.next();
}

export const config = {
  matcher: [
    "/((?!api/(?!auth)|_next/static|_next/image|favicon.ico).*)",
  ],
};