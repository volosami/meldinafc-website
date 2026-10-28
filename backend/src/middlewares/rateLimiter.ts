import { Request, Response, NextFunction } from "express";

interface RateLimitOptions {
  windowMs: number;
  max: number;
  message: string;
}

interface ClientBucket {
  count: number;
  resetAt: number;
}

export function createRateLimiter(options: RateLimitOptions) {
  const buckets = new Map<string, ClientBucket>();

  return function rateLimitMiddleware(req: Request, res: Response, next: NextFunction): void {
    // Em testes automatizados, só aplica rate-limit se o header x-test-rate-limit for enviado
    if (process.env.NODE_ENV === "test" && req.headers["x-test-rate-limit"] !== "true") {
      return next();
    }

    const now = Date.now();
    const ip =
      (typeof req.headers["x-forwarded-for"] === "string"
        ? req.headers["x-forwarded-for"].split(",")[0].trim()
        : undefined) ||
      req.ip ||
      req.socket.remoteAddress ||
      "unknown";

    let bucket = buckets.get(ip);
    if (!bucket || now > bucket.resetAt) {
      bucket = { count: 0, resetAt: now + options.windowMs };
      buckets.set(ip, bucket);
    }

    bucket.count += 1;

    const remaining = Math.max(0, options.max - bucket.count);
    res.setHeader("X-RateLimit-Limit", String(options.max));
    res.setHeader("X-RateLimit-Remaining", String(remaining));

    if (bucket.count > options.max) {
      const retryAfterSec = Math.ceil((bucket.resetAt - now) / 1000);
      res.setHeader("Retry-After", String(retryAfterSec));
      res.status(429).json({
        success: false,
        error: options.message,
      });
      return;
    }

    // Limpeza periódica leve caso o mapa cresça
    if (buckets.size > 5000) {
      for (const [key, val] of buckets.entries()) {
        if (now > val.resetAt) buckets.delete(key);
      }
    }

    next();
  };
}

export const authLimiter = createRateLimiter({
  windowMs: 15 * 60 * 1000, // 15 minutos
  max: 10,
  message: "Muitas tentativas de autenticação. Aguarde 15 minutos e tente novamente.",
});

export const memberRegisterLimiter = createRateLimiter({
  windowMs: 15 * 60 * 1000, // 15 minutos
  max: 10,
  message: "Limite de cadastros atingido para este endereço. Tente novamente mais tarde.",
});

export const uploadLimiter = createRateLimiter({
  windowMs: 15 * 60 * 1000, // 15 minutos
  max: 25,
  message: "Limite de uploads atingido. Aguarde alguns minutos.",
});

export const apiLimiter = createRateLimiter({
  windowMs: 60 * 1000, // 1 minuto
  max: 200,
  message: "Muitas requisições em sequência. Aguarde um instante.",
});

