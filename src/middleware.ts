import { defineMiddleware } from "astro:middleware";
import { isValidRegion, DEFAULT_REGION } from "./regions";

export const onRequest = defineMiddleware(async (context, next) => {
  const url = new URL(context.request.url);
  const pathParts = url.pathname.split('/').filter(Boolean);
  const regionInPath = pathParts[0];

  // Skip middleware for static assets
  if (url.pathname.includes('.') || url.pathname.startsWith('/_astro')) {
    return next();
  }

  // Handle Root Redirect
  if (url.pathname === '/') {
    const preferredRegion = context.cookies.get('preferred_region')?.value;
    if (preferredRegion && isValidRegion(preferredRegion)) {
      return context.redirect(`/${preferredRegion}`);
    }
    return context.redirect(`/${DEFAULT_REGION}`);
  }

  // Strictly validate region-prefixed paths
  // If the first part of the path looks like a region but isn't valid, redirect or 404
  // We check if it's not a common static path like /favicon.svg which is already handled above
  if (regionInPath && !isValidRegion(regionInPath)) {
    // If it's a legacy top-level path (e.g. /roles), we could redirect to /us/roles
    // This provides backward compatibility
    const legacyPaths = ['roles', 'cities', 'skills', 'salaries', 'trends', 'layoffs', 'about', 'contact', 'search'];
    if (legacyPaths.includes(regionInPath)) {
      return context.redirect(`/${DEFAULT_REGION}${url.pathname}`);
    }
  }

  // Persist region preference
  if (regionInPath && isValidRegion(regionInPath)) {
    context.cookies.set('preferred_region', regionInPath, {
      path: '/',
      maxAge: 60 * 60 * 24 * 30, // 30 days
      httpOnly: true,
      sameSite: 'lax'
    });
  }

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
