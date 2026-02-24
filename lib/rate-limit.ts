/**
 * Simple in-memory per-IP rate limiter.
 *
 * Not suitable for multi-instance deployments (use Redis there),
 * but fine for a single-process MVP.
 */

interface RateLimitEntry {
  timestamps: number[];
}

const store = new Map<string, RateLimitEntry>();

const WINDOW_MS = 60 * 60 * 1000; // 1 hour
const MAX_REQUESTS = 5;

/**
 * Check whether the given IP is allowed to make a request.
 * Returns `{ allowed: true }` or `{ allowed: false, retryAfterMs }`.
 */
export function checkRateLimit(ip: string): {
  allowed: boolean;
  retryAfterMs?: number;
} {
  const now = Date.now();

  let entry = store.get(ip);
  if (!entry) {
    entry = { timestamps: [] };
    store.set(ip, entry);
  }

  // Prune timestamps outside the window
  entry.timestamps = entry.timestamps.filter((t) => now - t < WINDOW_MS);

  if (entry.timestamps.length >= MAX_REQUESTS) {
    const oldest = entry.timestamps[0];
    const retryAfterMs = WINDOW_MS - (now - oldest);
    return { allowed: false, retryAfterMs };
  }

  entry.timestamps.push(now);
  return { allowed: true };
}

/**
 * Periodic cleanup to prevent memory leaks from abandoned IPs.
 * Runs every 10 minutes.
 */
if (typeof globalThis !== "undefined") {
  const CLEANUP_INTERVAL = 10 * 60 * 1000;
  const cleanup = () => {
    const now = Date.now();
    for (const [ip, entry] of store) {
      entry.timestamps = entry.timestamps.filter((t) => now - t < WINDOW_MS);
      if (entry.timestamps.length === 0) store.delete(ip);
    }
  };
  // Use a global flag to avoid re-registering in hot-reload
  const key = "__rateLimit_cleanup";
  if (!(globalThis as Record<string, unknown>)[key]) {
    (globalThis as Record<string, unknown>)[key] = setInterval(
      cleanup,
      CLEANUP_INTERVAL
    );
  }
}
