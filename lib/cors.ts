/**
 * Strict CORS configuration for SkillBridge API routes.
 *
 * Reads allowed origins from CORS_ALLOWED_ORIGINS (comma-separated).
 * Falls back to NEXT_PUBLIC_APP_URL, then http://localhost:3000 in dev.
 *
 * Never uses wildcard (*) for authenticated routes.
 * Sets Access-Control-Allow-Credentials: true for cookie-based auth.
 */

// ─── Configuration ──────────────────────────────────────

function getAllowedOrigins(): string[] {
    const raw = process.env.CORS_ALLOWED_ORIGINS;
    if (raw) {
        return raw
            .split(",")
            .map((o) => o.trim())
            .filter(Boolean);
    }

    // Fallback: use the app URL if set
    const appUrl = process.env.NEXT_PUBLIC_APP_URL;
    if (appUrl) return [appUrl];

    // Development default
    return ["http://localhost:3000"];
}

const ALLOWED_METHODS = "GET, POST, PUT, PATCH, DELETE, OPTIONS";
const ALLOWED_HEADERS =
    "Content-Type, Authorization, X-Requested-With, Accept, Origin";
const MAX_AGE = "86400"; // preflight cache: 24 hours

// ─── Helpers ────────────────────────────────────────────

/**
 * Check whether the given origin is in the whitelist.
 */
export function isOriginAllowed(origin: string | null): boolean {
    if (!origin) return false;
    return getAllowedOrigins().includes(origin);
}

/**
 * Build CORS response headers for a given request origin.
 * Returns an empty object if the origin is not allowed.
 */
export function corsHeaders(
    requestOrigin: string | null
): Record<string, string> {
    if (!requestOrigin || !isOriginAllowed(requestOrigin)) {
        return {};
    }

    return {
        "Access-Control-Allow-Origin": requestOrigin,
        "Access-Control-Allow-Methods": ALLOWED_METHODS,
        "Access-Control-Allow-Headers": ALLOWED_HEADERS,
        "Access-Control-Allow-Credentials": "true",
        "Access-Control-Max-Age": MAX_AGE,
        Vary: "Origin",
    };
}

/**
 * Build a 204 No Content preflight response with CORS headers.
 */
export function preflightResponse(
    requestOrigin: string | null
): Response {
    const headers = corsHeaders(requestOrigin);

    // Even for disallowed origins, return 204 — the browser will
    // block the actual request because Allow-Origin is absent.
    return new Response(null, {
        status: 204,
        headers,
    });
}
