
import { NextRequest, NextResponse } from "next/server";
import { getSession } from "@/lib/session";

export const config = {
  matcher: [
    /*
     * Match all request paths except for the ones starting with:
     * - api (API routes)
     * - _next/static (static files)
     * - _next/image (image optimization files)
     * - favicon.ico (favicon file)
     * - admin/login (the login page itself)
     */
    "/admin/:path*",
    "/((?!api|_next/static|_next/image|favicon.ico|admin/login).*)",
  ],
};

export async function middleware(request: NextRequest) {
  // Only apply middleware to /admin routes
  if (!request.nextUrl.pathname.startsWith("/admin")) {
    return NextResponse.next();
  }

  // Allow access to the login page
  if (request.nextUrl.pathname === "/admin/login") {
    return NextResponse.next();
  }

  const session = await getSession();
  const loginUrl = new URL("/admin/login", request.url);

  // If there's no session, redirect to the login page.
  if (!session) {
    return NextResponse.redirect(loginUrl);
  }

  return NextResponse.next();
}

    