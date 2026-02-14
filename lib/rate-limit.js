/**
 * 🚀 Simple In-Memory Rate Limiter
 * Suitable for single-instance deployments.
 * For serverless/multi-instance, use Redis or a Database.
 */
const cache = new Map();

export function rateLimit(identifier, limit = 10, windowMs = 60000) {
  const now = Date.now();
  const resetTime = now + windowMs;

  let record = cache.get(identifier);

  if (!record) {
    record = { count: 1, resetTime };
    cache.set(identifier, record);
    return { success: true, count: 1, limit, remaining: limit - 1, resetTime };
  }

  if (now > record.resetTime) {
    record.count = 1;
    record.resetTime = resetTime;
    return { success: true, count: 1, limit, remaining: limit - 1, resetTime };
  }

  record.count++;

  if (record.count > limit) {
    return {
      success: false,
      count: record.count,
      limit,
      remaining: 0,
      resetTime: record.resetTime,
    };
  }

  return {
    success: true,
    count: record.count,
    limit,
    remaining: limit - record.count,
    resetTime: record.resetTime,
  };
}

// Cleanup expired records every 5 minutes
if (typeof setInterval !== "undefined") {
  setInterval(() => {
    const now = Date.now();
    for (const [key, record] of cache.entries()) {
      if (now > record.resetTime) {
        cache.delete(key);
      }
    }
  }, 300000);
}
