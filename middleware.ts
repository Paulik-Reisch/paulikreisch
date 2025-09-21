import { NextRequest, NextResponse } from "next/server";
import { getSession } from "@/lib/session";

export const config = {
  matcher: ["/admin/:path*"],
};

export async function middleware(request: NextRequest) {
  const session = await getSession();
  const loginUrl = new URL("/admin/login", request.url);

  // If there's no session, redirect to the login page.
  if (!session) {
    return NextResponse.redirect(loginUrl);
  }

  return NextResponse.next();
}
