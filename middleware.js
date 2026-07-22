import { NextResponse } from "next/server";

export function middleware(request) {
  const { pathname } = request.nextUrl;

  const isAdminPath = pathname.startsWith("/admin") && !pathname.startsWith("/admin/login");
  const isNotesPath = pathname === "/notes";

  if (isAdminPath || isNotesPath) {
    // Better Auth sets this cookie on successful sign-in
    const sessionToken =
      request.cookies.get("better-auth.session_token") ||
      request.cookies.get("__Secure-better-auth.session_token");

    if (!sessionToken) {
      if (isAdminPath) {
        const loginUrl = new URL("/admin/login", request.url);
        loginUrl.searchParams.set("from", pathname);
        return NextResponse.redirect(loginUrl);
      } else {
        // Redirect public user to home if trying to access notes
        return NextResponse.redirect(new URL("/", request.url));
      }
    }
  }

  return NextResponse.next();
}

export const config = {
  matcher: ["/admin/:path*", "/notes"],
};
