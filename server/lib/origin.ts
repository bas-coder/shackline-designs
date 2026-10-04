import type { Context } from 'hono';

/**
 * R139 — this app's own public origin, e.g. "https://sunset-diner.aiwacodes.com".
 *
 * Needed by anything that hands an absolute URL back to a third party and expects the user to land here
 * again: a Stripe Checkout success_url / cancel_url, a link inside an email, an OAuth redirect. The value
 * genuinely DIFFERS between the preview VM (a *.csb.app host) and the published site, so it can never be
 * hardcoded — that is the bug this exists to prevent.
 *
 * Resolution order, most to least trustworthy:
 *  1. APP_ORIGIN — injected by AIWA. Authoritative, and set on both the preview VM and the deployed
 *     service, so it is right in the overwhelming majority of requests.
 *  2. The proxy headers. This is the fallback that makes a CUSTOM DOMAIN work: the platform does not
 *     track when a user's DNS goes live, so APP_ORIGIN keeps pointing at the *.aiwacodes.com host while
 *     the customer is really browsing example.com. Trusting the request here is what keeps the redirect
 *     landing on the domain the user actually came from.
 *  3. The request URL. Covers plain local dev, where nothing is injected and nothing is proxied.
 *
 * Never returns a trailing slash, so `${appOrigin(c)}/success` is always well formed.
 */
export function appOrigin(c: Context): string {
  const injected = process.env.APP_ORIGIN?.trim();
  if (injected) return injected.replace(/\/+$/, '');

  // Behind a TLS-terminating proxy the socket is plain HTTP, so the scheme only survives in the header.
  const host = c.req.header('x-forwarded-host') ?? c.req.header('host');
  if (host) {
    const proto = c.req.header('x-forwarded-proto')?.split(',')[0]?.trim() ?? 'https';
    return `${proto}://${host}`.replace(/\/+$/, '');
  }

  return new URL(c.req.url).origin;
}
