/**
 * Simple in-memory rate limiter for API routes
 * For production, consider using Redis or a dedicated rate limiting service
 */

interface RateLimitStore {
  [key: string]: {
    count: number;
    resetTime: number;
  };
}

const store: RateLimitStore = {};

// Cleanup old entries every 10 minutes
setInterval(() => {
  const now = Date.now();
  Object.keys(store).forEach(key => {
    if (store[key].resetTime < now) {
      delete store[key];
    }
  });
}, 10 * 60 * 1000);

export interface RateLimitConfig {
  interval: number; // milliseconds
  maxRequests: number;
}

export interface RateLimitResult {
  allowed: boolean;
  remaining: number;
  reset: number;
}

export function rateLimit(
  identifier: string,
  config: RateLimitConfig = { interval: 60000, maxRequests: 10 }
): RateLimitResult {
  const now = Date.now();
  const key = `ratelimit:${identifier}`;

  if (!store[key] || store[key].resetTime < now) {
    store[key] = {
      count: 1,
      resetTime: now + config.interval,
    };
    return {
      allowed: true,
      remaining: config.maxRequests - 1,
      reset: store[key].resetTime,
    };
  }

  store[key].count++;

  return {
    allowed: store[key].count <= config.maxRequests,
    remaining: Math.max(0, config.maxRequests - store[key].count),
    reset: store[key].resetTime,
  };
}
