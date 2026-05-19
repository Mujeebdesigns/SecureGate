import { Ratelimit } from "@upstash/ratelimit";
import { Redis } from "@upstash/redis";

const isUpstashConfigured =
  !!process.env.UPSTASH_REDIS_REST_URL && !!process.env.UPSTASH_REDIS_REST_TOKEN;

const redis = isUpstashConfigured
  ? new Redis({
      url: process.env.UPSTASH_REDIS_REST_URL!,
      token: process.env.UPSTASH_REDIS_REST_TOKEN!,
    })
  : null;

// Create rate limiter: max 5 attempts per 10 minutes (sliding window)
export const rateLimiter = redis
  ? new Ratelimit({
      redis,
      limiter: Ratelimit.slidingWindow(5, "10 m"),
      analytics: true,
      prefix: "securegate_ratelimit",
    })
  : null;

/**
 * Checks the rate limit based on the client IP address.
 * Gracefully falls back to mock passing if Upstash is not configured.
 */
export async function checkRateLimit(
  ip: string,
  identifier: string
): Promise<{ success: boolean; limit: number; remaining: number; reset: number }> {
  if (!rateLimiter) {
    // Local dev fallback
    return {
      success: true,
      limit: 5,
      remaining: 5,
      reset: Date.now() + 10 * 60 * 1000,
    };
  }

  try {
    const key = `${identifier}:${ip}`;
    const result = await rateLimiter.limit(key);
    return {
      success: result.success,
      limit: result.limit,
      remaining: result.remaining,
      reset: result.reset,
    };
  } catch (error) {
    console.error("Rate limiting check error:", error);
    // Fail-safe: fail-open in local development/production if Redis is down
    return {
      success: true,
      limit: 5,
      remaining: 5,
      reset: Date.now() + 10 * 60 * 1000,
    };
  }
}
