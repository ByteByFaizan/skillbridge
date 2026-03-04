/**
 * Production-grade in-memory sliding-window rate limiter.
 *
 * Configurable via environment variables:
 *   RATE_LIMIT_WINDOW_MS          – general API window  (default: 60 000 ms = 1 min)
 *   RATE_LIMIT_MAX_REQUESTS       – general API max     (default: 100)
 *   RATE_LIMIT_AUTH_WINDOW_MS     – auth routes window  (default: 900 000 ms = 15 min)
 *   RATE_LIMIT_AUTH_MAX_REQUESTS  – auth routes max     (default: 10)
 *
 * Returns quota metadata so callers can attach standard headers.
 *
 * ⚠️  In-memory store — suitable for single-instance deployments.
 *     For multi-instance, swap the Map for Redis (e.g. @upstash/ratelimit).
 */

// ─── Types ──────────────────────────────────────────────

interface RateLimitEntry {
  timestamps: number[];
}

export interface RateLimitResult {
  allowed: boolean;
  /** Max requests in the window */
  limit: number;
  /** Remaining requests in the current window */
  remaining: number;
  /** Unix epoch (seconds) when the window resets */
  resetAt: number;
  /** Seconds until the oldest request expires (only set when blocked) */
  retryAfterSec?: number;
}

// ─── Configuration ──────────────────────────────────────

function envInt(key: string, fallback: number): number {
  const v = process.env[key];
  if (!v) return fallback;
  const n = parseInt(v, 10);
  return Number.isFinite(n) && n > 0 ? n : fallback;
}

/** General API: 100 requests per 1 minute (configurable) */
const API_WINDOW_MS = envInt("RATE_LIMIT_WINDOW_MS", 60_000);
const API_MAX_REQUESTS = envInt("RATE_LIMIT_MAX_REQUESTS", 100);

/** Auth routes: 10 requests per 15 minutes (configurable) */
const AUTH_WINDOW_MS = envInt("RATE_LIMIT_AUTH_WINDOW_MS", 15 * 60_000);
const AUTH_MAX_REQUESTS = envInt("RATE_LIMIT_AUTH_MAX_REQUESTS", 10);

// ─── Store ──────────────────────────────────────────────

const store = new Map<string, RateLimitEntry>();

// ─── Core ───────────────────────────────────────────────

/**
 * Check whether the given key is allowed to make a request.
 *
 * @param key     Unique identifier — e.g. an IP or `auth:<ip>`
 * @param tier    `"api"` (default) or `"auth"` — selects the limit tier
 */
export function checkRateLimit(
  key: string,
  tier: "api" | "auth" = "api"
): RateLimitResult {
  const windowMs = tier === "auth" ? AUTH_WINDOW_MS : API_WINDOW_MS;
  const maxReqs = tier === "auth" ? AUTH_MAX_REQUESTS : API_MAX_REQUESTS;
  const now = Date.now();

  let entry = store.get(key);
  if (!entry) {
    entry = { timestamps: [] };
    store.set(key, entry);
  }

  // Prune timestamps outside the sliding window
  entry.timestamps = entry.timestamps.filter((t) => now - t < windowMs);

  const resetAt = Math.ceil((now + windowMs) / 1000);

  if (entry.timestamps.length >= maxReqs) {
    const oldest = entry.timestamps[0];
    const retryAfterSec = Math.ceil((windowMs - (now - oldest)) / 1000);
    return {
      allowed: false,
      limit: maxReqs,
      remaining: 0,
      resetAt,
      retryAfterSec,
    };
  }

  entry.timestamps.push(now);
  return {
    allowed: true,
    limit: maxReqs,
    remaining: maxReqs - entry.timestamps.length,
    resetAt,
  };
}

// ─── Header helpers ─────────────────────────────────────

/**
 * Build standard rate-limit response headers from a RateLimitResult.
 * Attach these to every API response (both allowed and blocked).
 */
export function rateLimitHeaders(
  result: RateLimitResult
): Record<string, string> {
  const headers: Record<string, string> = {
    "X-RateLimit-Limit": String(result.limit),
    "X-RateLimit-Remaining": String(result.remaining),
    "X-RateLimit-Reset": String(result.resetAt),
  };
  if (!result.allowed && result.retryAfterSec !== undefined) {
    headers["Retry-After"] = String(result.retryAfterSec);
  }
  return headers;
}

// ─── Periodic cleanup ───────────────────────────────────

if (typeof globalThis !== "undefined") {
  const CLEANUP_INTERVAL = 10 * 60_000; // 10 minutes
  const maxWindow = Math.max(API_WINDOW_MS, AUTH_WINDOW_MS);
  const cleanup = () => {
    const now = Date.now();
    for (const [key, entry] of store) {
      entry.timestamps = entry.timestamps.filter((t) => now - t < maxWindow);
      if (entry.timestamps.length === 0) store.delete(key);
    }
  };
  const flag = "__skillbridge_rateLimit_cleanup_v2";
  if (!(globalThis as Record<string, unknown>)[flag]) {
    (globalThis as Record<string, unknown>)[flag] = setInterval(
      cleanup,
      CLEANUP_INTERVAL
    );
  }
}
