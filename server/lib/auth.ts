import { createRemoteJWKSet, jwtVerify } from 'jose';
import type { Context, Next } from 'hono';
import { adoptDemoRows } from '../db';

// Make `userId` / `userEmail` typed on every Hono context, so generated routes can read
// `c.get('userId')` without per-file typing. Type-only; erased at runtime.
declare module 'hono' {
  interface ContextVariableMap {
    userId: string;
    userEmail: string;
  }
}

// Build the JWKS set LAZILY on first protected request — NOT at module load. A no-auth app never sets
// NEON_AUTH_BASE_URL, and eager construction with an undefined URL would throw the moment this file is
// imported. AIWA injects NEON_AUTH_BASE_URL into the VM .env when the app has auth.
let jwks: ReturnType<typeof createRemoteJWKSet> | null = null;
function getJwks() {
  if (!jwks) {
    const base = process.env.NEON_AUTH_BASE_URL;
    if (!base) throw new Error('NEON_AUTH_BASE_URL is not set (auth is not provisioned for this app)');
    jwks = createRemoteJWKSet(new URL(`${base}/.well-known/jwks.json`));
  }
  return jwks;
}

/**
 * Protect a route: verify the Bearer JWT against this app's Neon Auth JWKS and expose the signed-in user.
 * Usage: `app.use('/api/todos/*', requireUser)` then read `const userId = c.get('userId')` in handlers and
 * scope every query/insert by it. Never trust a user id from the request body — only this verified value.
 * Non-/api paths pass through unauthenticated (see the guard below), so this must never be relied on to
 * gate a page — only API routes.
 */
export async function requireUser(c: Context, next: Next) {
  // Generated code sometimes mounts this on '*' (imitating the platform's own broad middleware).
  // Every real API path starts with /api/, so anything else (/, /assets/*, SPA routes) must fall
  // through to static serving in prod, never 401. NOTE: this makes requireUser a no-op off /api/.
  if (!c.req.path.startsWith('/api/')) return next();
  const authHeader = c.req.header('Authorization');
  if (!authHeader?.startsWith('Bearer ')) return c.json({ error: 'Unauthorized' }, 401);
  let userId: string;
  let userEmail: string;
  try {
    // 60s clock-skew tolerance, matching the platform's own verification. Only the verification sits
    // inside this try: a handler exception used to surface as "Invalid token" 401.
    const { payload } = await jwtVerify(authHeader.slice(7), getJwks(), { clockTolerance: '60s' });
    userId = payload.sub as string;
    userEmail = (payload.email as string) ?? '';
  } catch {
    return c.json({ error: 'Invalid token' }, 401);
  }
  c.set('userId', userId);
  c.set('userEmail', userEmail);
  // The boot seed's rows in user-owned tables belong to the demo owner until the first account signs
  // in; that account adopts them here, once per database, BEFORE its first handler runs its
  // userId-scoped query. Memoised and never throws (see db/index.ts).
  await adoptDemoRows(userId);
  await next();
}
