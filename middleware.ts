// middleware.ts (racine)
import { NextRequest, NextResponse } from "next/server";

const PUBLIC_ROUTES = ["/admin/login", "/admin/register", "/admin/forgot-password"];

export function middleware(req: NextRequest) {
  const { pathname } = req.nextUrl;

  const isPublic = PUBLIC_ROUTES.some((route) => pathname.startsWith(route));
  const token = req.cookies.get("better-auth.session_token")?.value;

  if (!isPublic && !token) {
    return NextResponse.redirect(new URL("/admin/login", req.url));
  }

  if (isPublic && token) {
    return NextResponse.redirect(new URL("/admin/products", req.url));
  }

  return NextResponse.next();
}

export const config = {
  matcher: ["/admin/:path*"],
};