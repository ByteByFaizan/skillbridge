import { createServerClient } from "@supabase/ssr";
import { NextResponse, type NextRequest } from "next/server";
import { checkRateLimit, rateLimitHeaders } from "@/lib/rate-limit";
import { corsHeaders, preflightResponse } from "@/lib/cors";

// ─── Route classification ───────────────────────────────

/** Routes that require a valid Supabase session (user must be logged in). */
const PROTECTED_API_PREFIXES = ["/api/career", "/api/recommendations"];

/** Auth routes get stricter rate limits but don't require authentication. */
const AUTH_API_PREFIXES = ["/api/auth/login", "/api/auth/signup"];

/** Routes that are fully public (no auth required). */
const PUBLIC_API_ROUTES = ["/api/auth/callback", "/api/auth/logout"];

function isProtectedApi(pathname: string): boolean {
    return PROTECTED_API_PREFIXES.some((p) => pathname.startsWith(p));
}

function isAuthApi(pathname: string): boolean {
    return AUTH_API_PREFIXES.some((p) => pathname.startsWith(p));
}

function isPublicApi(pathname: string): boolean {
    return PUBLIC_API_ROUTES.some((p) => pathname.startsWith(p));
}

function isApiRoute(pathname: string): boolean {
    return pathname.startsWith("/api/");
}

// ─── Helpers ────────────────────────────────────────────

function getClientIp(req: NextRequest): string {
    return (
        req.headers.get("x-forwarded-for")?.split(",")[0]?.trim() ??
        req.headers.get("x-real-ip") ??
        "unknown"
    );
}

function jsonResponse(
    body: object,
    status: number,
    extraHeaders: Record<string, string> = {}
): NextResponse {
    return NextResponse.json(body, { status, headers: extraHeaders });
}

// ─── Proxy (Next.js 16 convention) ──────────────────────

export async function proxy(request: NextRequest) {
    const { pathname } = request.nextUrl;
    const origin = request.headers.get("origin");

    // ── 1. Preflight (OPTIONS) for API routes ─────────────
    if (isApiRoute(pathname) && request.method === "OPTIONS") {
        return preflightResponse(origin);
    }

    // ── 2. Rate limiting on API routes ────────────────────
    if (isApiRoute(pathname)) {
        const ip = getClientIp(request);
        const tier = isAuthApi(pathname) ? "auth" : "api";
        const key = tier === "auth" ? `auth:${ip}` : `api:${ip}`;
        const rl = checkRateLimit(key, tier);

        if (!rl.allowed) {
            const headers = {
                ...rateLimitHeaders(rl),
                ...corsHeaders(origin),
            };
            return jsonResponse(
                {
                    error: {
                        code: "RATE_LIMITED",
                        message: "Too many requests. Please try again later.",
                    },
                },
                429,
                headers
            );
        }

        // We'll attach rate-limit headers to the final response below.
        // Store the result so we can use it after Supabase session refresh.
        request.headers.set("x-rl-limit", String(rl.limit));
        request.headers.set("x-rl-remaining", String(rl.remaining));
        request.headers.set("x-rl-reset", String(rl.resetAt));
    }

    // ── 3. Supabase session refresh ───────────────────────
    let response = NextResponse.next({ request });

    const url = process.env.NEXT_PUBLIC_SUPABASE_URL;
    const anonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;

    if (!url || !anonKey) {
        throw new Error(
            "Missing NEXT_PUBLIC_SUPABASE_URL or NEXT_PUBLIC_SUPABASE_ANON_KEY env vars"
        );
    }

    const supabase = createServerClient(url, anonKey, {
        cookies: {
            getAll() {
                return request.cookies.getAll();
            },
            setAll(cookiesToSet) {
                cookiesToSet.forEach(({ name, value }) =>
                    request.cookies.set(name, value)
                );
                response = NextResponse.next({ request });
                cookiesToSet.forEach(({ name, value, options }) =>
                    response.cookies.set(name, value, options)
                );
            },
        },
    });

    // Refresh the session — MUST be called before getUser().
    const {
        data: { user },
    } = await supabase.auth.getUser();

    // ── 4. Auth enforcement on protected API routes ───────
    if (isApiRoute(pathname) && isProtectedApi(pathname) && !user) {
        const headers = { ...corsHeaders(origin) };
        return jsonResponse(
            {
                error: {
                    code: "UNAUTHORIZED",
                    message: "Authentication required. Please log in.",
                },
            },
            401,
            headers
        );
    }

    // ── 5. Page-level auth guards ─────────────────────────
    if (pathname.startsWith("/dashboard") && !user) {
        const loginUrl = request.nextUrl.clone();
        loginUrl.pathname = "/login";
        loginUrl.searchParams.set("redirect", pathname);
        return NextResponse.redirect(loginUrl);
    }

    if (pathname === "/login" && user) {
        const dashUrl = request.nextUrl.clone();
        dashUrl.pathname = "/dashboard";
        return NextResponse.redirect(dashUrl);
    }

    // ── 6. Attach CORS + rate-limit headers to response ───
    if (isApiRoute(pathname)) {
        const cors = corsHeaders(origin);
        for (const [key, value] of Object.entries(cors)) {
            response.headers.set(key, value);
        }

        // Propagate rate-limit headers stored in step 2
        const rlLimit = request.headers.get("x-rl-limit");
        if (rlLimit) {
            response.headers.set("X-RateLimit-Limit", rlLimit);
            response.headers.set(
                "X-RateLimit-Remaining",
                request.headers.get("x-rl-remaining") ?? "0"
            );
            response.headers.set(
                "X-RateLimit-Reset",
                request.headers.get("x-rl-reset") ?? "0"
            );
        }
    }

    return response;
}

// ─── Matcher ────────────────────────────────────────────

export const config = {
    matcher: [
        /*
         * Run middleware on all routes except:
         * - _next/static, _next/image (Next.js internals)
         * - favicon.ico, sitemap.xml, robots.txt (metadata files)
         * - public folder assets (images, etc.)
         */
        "/((?!_next/static|_next/image|favicon.ico|sitemap.xml|robots.txt|.*\\.(?:svg|png|jpg|jpeg|gif|webp)$).*)",
    ],
};
