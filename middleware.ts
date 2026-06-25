import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";
import { decrypt } from "@/lib/auth";

export async function middleware(request: NextRequest) {
  const token = request.cookies.get("auth_token")?.value;
  const { pathname } = request.nextUrl;

  const publicRoutes = ["/auth/login", "/auth/register", "/api/auth"];
  const isPublic = publicRoutes.some(r => pathname.startsWith(r));

  if (!token && !isPublic) {
    return NextResponse.redirect(new URL("/auth/login", request.url));
  }

  if (token) {
    const payload = await decrypt(token);
    if (!payload) {
      if (!isPublic) return NextResponse.redirect(new URL("/auth/login", request.url));
      return NextResponse.next();
    }

    const roleRouteMap: Record<string, string> = {
      "/patient": "PATIENT",
      "/doctor": "DOCTOR",
      "/lab": "LAB_TECH",
      "/radiology": "RADIOLOGIST",
      "/pharmacy": "PHARMACIST",
      "/admin": "ADMIN",
    };

    for (const [route, role] of Object.entries(roleRouteMap)) {
      if (pathname.startsWith(route) && payload.role !== role) {
        return NextResponse.redirect(new URL("/auth/login", request.url));
      }
    }

    // Redirect logged-in users away from auth pages or root
    if (pathname.startsWith("/auth/login") || pathname === "/") {
      const dashboards: Record<string, string> = {
        PATIENT: "/patient/dashboard",
        DOCTOR: "/doctor/queue",
        LAB_TECH: "/lab/dashboard",
        RADIOLOGIST: "/radiology/dashboard",
        PHARMACIST: "/pharmacy/dashboard",
        ADMIN: "/admin/dashboard",
      };
      const dest = dashboards[payload.role as string];
      if (dest) return NextResponse.redirect(new URL(dest, request.url));
    }
  }

  return NextResponse.next();
}

export const config = {
  matcher: ["/((?!_next/static|_next/image|favicon.ico).*)"],
};
