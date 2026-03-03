// src/middleware.ts
import { defineMiddleware } from 'astro:middleware';

const PROTECTED_PREFIXES = ['/admin', '/api/articles'];

export const onRequest = defineMiddleware(async (context, next) => {
  const { pathname } = context.url;

  const isProtected = PROTECTED_PREFIXES.some((prefix) =>
    pathname === prefix || pathname.startsWith(prefix + '/')
  );

  if (!isProtected) return next();

  // Skip auth check in local dev
  if (import.meta.env.DEV) return next();

  const email = context.request.headers.get('cf-access-authenticated-user-email');

  if (!email) {
    return new Response('403 Forbidden', { status: 403 });
  }

  return next();
});
