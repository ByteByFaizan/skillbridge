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
 * Check whether the given key (IP or prefixed key) is allowed to make a request.
 * Use prefixed keys like `auth:${ip}` to maintain separate rate limit pools.
 * Returns `{ allowed: true }` or `{ allowed: false, retryAfterMs }`.
 */
export function checkRateLimit(key: string): {
  allowed: boolean;
  retryAfterMs?: number;
} {
  const now = Date.now();

  let entry = store.get(key);
  if (!entry) {
    entry = { timestamps: [] };
    store.set(key, entry);
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
    for (const [key, entry] of store) {
      entry.timestamps = entry.timestamps.filter((t) => now - t < WINDOW_MS);
      if (entry.timestamps.length === 0) store.delete(key);
    }
  };
  // Use a namespaced global flag to avoid re-registering in hot-reload
  const key = "__skillbridge_rateLimit_cleanup_v1";
  if (!(globalThis as Record<string, unknown>)[key]) {
    (globalThis as Record<string, unknown>)[key] = setInterval(
      cleanup,
      CLEANUP_INTERVAL
    );
  }
}
