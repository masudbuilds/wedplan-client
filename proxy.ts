import { NextResponse } from "next/server"
import type { NextRequest } from "next/server"

// Next.js 16 Proxy Convention for lightweight request interception
export function proxy(request: NextRequest) {
  const { pathname } = request.nextUrl

  // Check for Better Auth session token cookie
  const sessionToken =
    request.cookies.get("better-auth.session_token")?.value ||
    request.cookies.get("__Secure-better-auth.session_token")?.value

  const isDashboardRoute = pathname.startsWith("/dashboard")
  const isServiceDetailsRoute =
    pathname.startsWith("/services/") && pathname !== "/services"

  // If visiting protected routes without a session token, redirect to sign-in
  if ((isDashboardRoute || isServiceDetailsRoute) && !sessionToken) {
    const signInUrl = new URL("/sign-in", request.url)
    signInUrl.searchParams.set("redirect", pathname)
    return NextResponse.redirect(signInUrl)
  }

  return NextResponse.next()
}

export const config = {
  matcher: ["/dashboard/:path*", "/services/:path*"],
}
