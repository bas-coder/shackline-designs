import { getToken } from './auth';

/**
 * Resolve an API path against the right origin.
 *
 * On the web this returns the path unchanged, so behaviour is byte-identical to before. Inside a
 * native WebView (Capacitor) the bundled app is served from `https://localhost`, so a relative
 * `/api/...` would hit the WebView itself and 404 — every data-backed screen would come up empty.
 * The mobile build sets VITE_API_ORIGIN to the deployed backend and this prefixes it.
 *
 * Vite inlines VITE_-prefixed vars at BUILD time, so this costs nothing at runtime and the web bundle
 * is unaffected when the var is unset.
 */
export function apiUrl(path: string): string {
  const origin = import.meta.env?.VITE_API_ORIGIN ?? '';
  if (!origin || !path.startsWith('/')) return path;
  return `${origin.replace(/\/$/, '')}${path}`;
}

/**
 * Mobile-bundle safety net, called from the locked main.tsx. Generated code is TOLD to use
 * `fetch('/api/...')` for public routes (only protected ones go through authedFetch), so routing only
 * authedFetch through apiUrl() still left every public data call 404ing inside the WebView. Wrapping
 * window.fetch catches all of them at one choke point. Compiles to nothing on the web: when
 * VITE_API_ORIGIN is unset (preview and every published site), this returns before touching fetch.
 */
export function initMobileFetch(): void {
  const origin = import.meta.env?.VITE_API_ORIGIN ?? '';
  if (!origin || typeof window === 'undefined') return;
  const raw = window.fetch.bind(window);
  window.fetch = (input: RequestInfo | URL, init?: RequestInit) => {
    try {
      if (typeof input === 'string' && input.startsWith('/api/')) {
        input = apiUrl(input);
      } else if (input instanceof URL && input.origin === window.location.origin && input.pathname.startsWith('/api/')) {
        input = apiUrl(input.pathname + input.search);
      }
    } catch {
      /* never let URL parsing break a request that would otherwise have gone through */
    }
    return raw(input, init);
  };
}

/**
 * fetch() with the signed-in user's Neon Auth bearer token attached. Use this (NOT raw fetch) for any
 * request to a protected `/api/...` route, so the server's requireUser middleware can verify the user.
 * Retries once on a 401 after re-reading the token (it may have just refreshed). JSON Content-Type is set
 * by default except for FormData, whose multipart Content-Type and boundary must be set by fetch.
 * Pass your own headers to override.
 */
export async function authedFetch(input: string, init: RequestInit = {}): Promise<Response> {
  const send = async () => {
    const token = await getToken();
    const headers = new Headers(init.headers);
    if (!headers.has('Content-Type') && init.body && !(init.body instanceof FormData)) {
      headers.set('Content-Type', 'application/json');
    }
    if (token) headers.set('Authorization', `Bearer ${token}`);
    return fetch(apiUrl(input), { ...init, headers });
  };
  let res = await send();
  if (res.status === 401) res = await send();
  return res;
}
