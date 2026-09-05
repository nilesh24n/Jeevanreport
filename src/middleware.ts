import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";

// Simple in-memory cache for Edge rate limiting
const ipCache = new Map<string, { count: number; resetTime: number }>();

// Cleanup interval to prevent memory leaks (every 10 minutes)
let lastCleanup = Date.now();
function cleanupCache() {
  const now = Date.now();
  if (now - lastCleanup > 600000) {
    for (const [ip, data] of ipCache.entries()) {
      if (now > data.resetTime) {
        ipCache.delete(ip);
      }
    }
    lastCleanup = now;
  }
}

export function middleware(request: NextRequest) {
  const path = request.nextUrl.pathname;

  // Rate limit dynamic API endpoints only
  if (path.startsWith("/api/")) {
    cleanupCache();

    // Retrieve client IP address
    const ip =
      request.headers.get("x-forwarded-for")?.split(",")[0] ||
      request.headers.get("x-real-ip") ||
      "127.0.0.1";

    const now = Date.now();
    const limit = 60; // 60 requests per minute
    const windowMs = 60000; // 1 minute window

    const ipData = ipCache.get(ip);

    if (!ipData || now > ipData.resetTime) {
      // New window or new IP
      ipCache.set(ip, {
        count: 1,
        resetTime: now + windowMs,
      });
    } else {
      // Existing window
      ipData.count += 1;
      if (ipData.count > limit) {
        return new NextResponse(
          JSON.stringify({ error: "Too many requests. Please try again later." }),
          {
            status: 429,
            headers: {
              "Content-Type": "application/json",
              "Retry-After": Math.ceil((ipData.resetTime - now) / 1000).toString(),
            },
          }
        );
      }
    }
  }

  return NextResponse.next();
}

// Scope middleware config
export const config = {
  matcher: "/api/:path*",
};
