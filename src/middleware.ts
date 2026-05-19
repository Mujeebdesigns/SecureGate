import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";
import { getToken } from "next-auth/jwt";
import { checkRateLimit } from "@/lib/rate-limit";

export async function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl;
  const ip = request.headers.get("x-forwarded-for")?.split(",")[0] || "127.0.0.1";

  // Rate Limiting checks (POST `/api/auth/signin` and `/forgot-password`)
  if (
    request.method === "POST" &&
    (pathname === "/api/auth/callback/credentials" || pathname === "/api/forgot-password")
  ) {
    const rateLimitType = pathname.includes("forgot") ? "forgot_password" : "login";
    const limitResult = await checkRateLimit(ip, rateLimitType);

    if (!limitResult.success) {
      return NextResponse.json(
        {
          success: false,
          message: "Too many attempts. Please try again in 10 minutes.",
        },
        {
          status: 429,
          headers: {
            "Retry-After": "600",
          },
        }
      );
    }
  }

  // Protect /dashboard — require authenticated AND verified user
  if (pathname.startsWith("/dashboard")) {
    const token = await getToken({
      req: request,
      secret: process.env.NEXTAUTH_SECRET,
    });

    // No session → redirect to login
    if (!token) {
      const loginUrl = new URL("/login", request.url);
      return NextResponse.redirect(loginUrl);
    }

    // Session exists but email not verified → redirect to login
    if (!token.emailVerified) {
      const loginUrl = new URL("/login", request.url);
      loginUrl.searchParams.set("error", "verify-email");
      return NextResponse.redirect(loginUrl);
    }
  }

  return NextResponse.next();
}

export const config = {
  matcher: [
    "/dashboard/:path*",
    "/api/auth/callback/credentials",
    "/api/forgot-password",
  ],
};
