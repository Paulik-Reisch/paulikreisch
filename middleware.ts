
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
     */
    '/((?!api|_next/static|_next/image|favicon.ico).*)',
  ],
};

export async function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl;

  // Only apply middleware to /admin routes
  if (!pathname.startsWith('/admin')) {
    return NextResponse.next();
  }

  const session = await getSession();
  const isLoginPage = pathname === '/admin/login';

  // If user is on the login page
  if (isLoginPage) {
    // If they have a session, redirect to the dashboard
    if (session) {
      return NextResponse.redirect(new URL('/admin', request.url));
    }
    // Otherwise, show the login page
    return NextResponse.next();
  }

  // For any other /admin page, if there's no session, redirect to login
  if (!session) {
    return NextResponse.redirect(new URL('/admin/login', request.url));
  }

  // If there is a session, allow access
  return NextResponse.next();
}

    