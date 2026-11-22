import { NextResponse } from "next/server"
import type { NextRequest } from "next/server"
import { getSessionCookie } from "better-auth/cookies"

// Next.js 16 Proxy Convention for lightweight request interception
export function proxy(request: NextRequest) {
  const { pathname } = request.nextUrl

  // Retrieve session cookie using Better Auth's helper (handles dev and __Secure- in production)
  const sessionToken = getSessionCookie(request)

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
