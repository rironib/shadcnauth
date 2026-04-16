import { env } from "@/lib/validateEnv";
import { getToken } from "next-auth/jwt";
import { NextResponse } from "next/server";
import { rateLimit } from "@/lib/rate-limit";

/**
 * 🛡️ Security Headers
 * Best practices to prevent clickjacking, MIME sniffing, and XSS.
 */
const SECURITY_HEADERS = {
  "X-Frame-Options": "DENY",
  "X-Content-Type-Options": "nosniff",
  "Referrer-Policy": "strict-origin-when-cross-origin",
  "X-XSS-Protection": "1; mode=block",
};

/**
 * 🏗️ Dashboard Access Rules
 */
const DASHBOARD_ACCESS = {
  user: ["/dashboard"],
  moderator: ["/dashboard", "/moderator"],
  admin: ["/dashboard", "/moderator", "/admin"],
};

/**
 * 🔐 API Access Rules (Deny-First Model)
 */
const API_ACCESS = {
  user: { deny: ["/api/admin", "/api/moderator"] },
  moderator: { deny: ["/api/admin"] },
  admin: { deny: [] },
};

/**
 * 🚪 Public Auth Pages (Blocked for logged-in users)
 */
const AUTH_PAGES = new Set([
  "/login",
  "/register",
  "/verify",
  "/forgot-password",
  "/reset-password",
]);

/**
 * 🏠 Default Entry Points for Roles
 */
const ROLE_DASHBOARD_HOME = {
  user: "/dashboard",
  moderator: "/moderator",
  admin: "/admin",
};

/**
 * 🌐 System & Asset Paths (Always Allowed)
 */
const PUBLIC_PREFIXES = [
  "/api/auth",
  "/_next",
  "/favicon.ico",
  "/images",
  "/fonts",
];

/**
 * 🚀 Proxy Middleware for Next.js 16
 */
export async function proxy(req) {
  const { pathname } = req.nextUrl;

  // 1. Path Normalization: Prevent case-sensitivity bypasses and trailing slash issues
  const normalizedPath = pathname.toLowerCase().replace(/\/$/, "") || "/";

  // 2. Rate Limiting (Global / In-Memory)
  // Only apply to non-asset paths
  if (!PUBLIC_PREFIXES.some((p) => pathname.startsWith(p))) {
    const ip = req.ip || req.headers.get("x-forwarded-for") || "anonymous";
    const limiter = rateLimit(`global_${ip}`, 100, 60000); // 100 requests per minute

    if (!limiter.success) {
      return NextResponse.json(
        {
          success: false,
          message: "Too many requests. Please try again later.",
        },
        {
          status: 429,
          headers: {
            "Retry-After": Math.ceil(
              (limiter.resetTime - Date.now()) / 1000,
            ).toString(),
          },
        },
      );
    }
  }

  // 3. Specific Auth Rate Limiting (Login/Register)
  if (AUTH_PAGES.has(normalizedPath)) {
    const ip = req.ip || req.headers.get("x-forwarded-for") || "anonymous";
    const authLimiter = rateLimit(`auth_${ip}`, 10, 300000); // 10 attempts per 5 minutes

    if (!authLimiter.success) {
      return NextResponse.json(
        {
          success: false,
          message: "Too many attempts. Please try again in 5 minutes.",
        },
        { status: 429 },
      );
    }
  }

  // Initialize response
  let response = NextResponse.next();

  /**
   * 1️⃣ Skip system and static routes early
   */
  if (PUBLIC_PREFIXES.some((p) => pathname.startsWith(p))) {
    return applySecurityHeaders(response);
  }

  /**
   * 2️⃣ Authentication Check
   */
  const token = await getToken({
    req,
    secret: env.NEXTAUTH_SECRET,
  });

  const isLoggedIn = !!token;
  const role = token?.role || "user";

  /**
   * 3️⃣ Auth Page Protection
   * If logged in, don't let them go to /login or /register
   */
  if (AUTH_PAGES.has(normalizedPath)) {
    if (isLoggedIn) {
      const redirectTo = ROLE_DASHBOARD_HOME[role] || "/";
      return NextResponse.redirect(new URL(redirectTo, req.url));
    }
    return applySecurityHeaders(response);
  }

  /**
   * 4️⃣ API Security (Strict Protection)
   */
  if (normalizedPath.startsWith("/api")) {
    const isProtectedAPI =
      normalizedPath.startsWith("/api/admin") ||
      normalizedPath.startsWith("/api/moderator") ||
      normalizedPath.startsWith("/api/user");

    // Block unauthenticated requests to internal APIs
    if (isProtectedAPI && !isLoggedIn) {
      return NextResponse.json(
        { success: false, message: "Authentication required" },
        { status: 401 },
      );
    }

    // Check Role Permissions
    if (isLoggedIn) {
      const deniedPrefixes = API_ACCESS[role]?.deny || [];
      if (deniedPrefixes.some((p) => normalizedPath.startsWith(p))) {
        return NextResponse.json(
          { success: false, message: "Forbidden: Insufficient permissions" },
          { status: 403 },
        );
      }
    }

    return applySecurityHeaders(response);
  }

  /**
   * 5️⃣ Dashboard & Admin Protection
   */
  const isProtectedPage =
    normalizedPath.startsWith("/dashboard") ||
    normalizedPath.startsWith("/moderator") ||
    normalizedPath.startsWith("/admin");

  if (isProtectedPage) {
    // If not logged in, redirect to login with callback URL
    if (!isLoggedIn) {
      const loginUrl = new URL("/login", req.url);
      loginUrl.searchParams.set("callbackUrl", pathname);
      return NextResponse.redirect(loginUrl);
    }

    // Verify hierarchical access
    const allowedTargets = DASHBOARD_ACCESS[role] || [];
    const hasAccess = allowedTargets.some((p) => normalizedPath.startsWith(p));

    if (!hasAccess) {
      // Gracefully redirect to their own dashboard instead of a hard error
      const fallbackUrl = ROLE_DASHBOARD_HOME[role] || "/";
      return NextResponse.redirect(new URL(fallbackUrl, req.url));
    }
  }

  return applySecurityHeaders(response);
}

/**
 * 🔒 Utility: Apply security headers to every response
 */
function applySecurityHeaders(res) {
  Object.entries(SECURITY_HEADERS).forEach(([key, value]) => {
    res.headers.set(key, value);
  });
  return res;
}

export const config = {
  matcher: [
    /*
     * Match all request paths except for the ones starting with:
     * - api/auth (NextAuth)
     * - _next/static (static files)
     * - _next/image (image optimization files)
     * - favicon.ico (favicon file)
     * - images (public images)
     * - fonts (public fonts)
     */
    "/((?!api/auth|_next/static|_next/image|favicon.ico|images|fonts).*)",
  ],
};
