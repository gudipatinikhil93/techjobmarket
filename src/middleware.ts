import { defineMiddleware } from "astro:middleware";

export const onRequest = defineMiddleware(async (context, next) => {
  const response = await next();
  
  // Production Security Headers
  response.headers.set("X-Frame-Options", "DENY");
  response.headers.set("X-Content-Type-Options", "nosniff");
  response.headers.set("Referrer-Policy", "strict-origin-when-cross-origin");
  response.headers.set("X-XSS-Protection", "1; mode=block");
  response.headers.set("Strict-Transport-Security", "max-age=31536000; includeSubDomains; preload");
  
  // Content Security Policy (Optimized for performance and local assets)
  response.headers.set(
    "Content-Security-Policy",
    "default-src 'self'; " +
    "script-src 'self' 'unsafe-inline' https://www.googletagmanager.com https://www.google-analytics.com https://static.cloudflareinsights.com; " +
    "style-src 'self' 'unsafe-inline'; " +
    "img-src 'self' data: https://www.google-analytics.com https://www.googletagmanager.com; " +
    "font-src 'self' data:; " +
    "connect-src 'self' https://www.google-analytics.com https://stats.g.doubleclick.net https://cloudflareinsights.com; " +
    "frame-ancestors 'none'; " +
    "upgrade-insecure-requests;"
  );

  return response;
});
