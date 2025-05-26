import { createMiddlewareClient } from "@supabase/auth-helpers-nextjs"
import { NextResponse } from "next/server"
import type { NextRequest } from "next/server"

export async function middleware(req: NextRequest) {
  const res = NextResponse.next()
  const supabase = createMiddlewareClient({ req, res })

  // Refresh session if expired
  await supabase.auth.getSession()

  // Optional: Protect routes that require authentication
  const path = req.nextUrl.pathname
  const session = await supabase.auth.getSession()

  // Add protected routes here
  const protectedRoutes = ["/dashboard", "/courses/[slug]/learn"]

  const isProtectedRoute = protectedRoutes.some((route) => {
    if (route.includes("[") && route.includes("]")) {
      // Handle dynamic routes
      const routePattern = route.replace(/\[.*?\]/g, "[^/]+")
      const regex = new RegExp(`^${routePattern}$`)
      return regex.test(path)
    }
    return path === route
  })

  if (isProtectedRoute && !session.data.session) {
    return NextResponse.redirect(new URL("/sign-in?redirect=" + encodeURIComponent(path), req.url))
  }

  return res
}

export const config = {
  matcher: [
    /*
     * Match all request paths except for the ones starting with:
     * - _next/static (static files)
     * - _next/image (image optimization files)
     * - favicon.ico (favicon file)
     * - public (public files)
     */
    "/((?!_next/static|_next/image|favicon.ico|public).*)",
  ],
}
