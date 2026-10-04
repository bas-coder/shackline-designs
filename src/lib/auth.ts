import { useEffect, useState } from 'react';
import { createAuthClient } from '@neondatabase/neon-js/auth';

const NEON_AUTH_URL = import.meta.env?.VITE_NEON_AUTH_URL ?? '';

// The per-app Neon Auth client (Google + email/password). VITE_NEON_AUTH_URL is injected by AIWA when the
// app needs accounts; for a no-auth app it is undefined (-> '') and this client is simply never used.
// Neon Auth's client is iframe-aware: created here at module load, it wires up its OAuth-popup completion
// handler (the popup half of Google sign-in self-completes just by importing this module).
export const authClient = createAuthClient(NEON_AUTH_URL);

// After a Google popup completes, Neon navigates THIS window (the opener) to
// `<origin>/?neon_auth_session_verifier=<token>`. That verifier is a ONE-TIME token: getSession() exchanges it
// for a session, caches it, and strips the param. It must be exchanged EXACTLY ONCE. React StrictMode
// double-invokes effects in the Vite dev preview, so an unguarded useSession() would fire two concurrent
// getSession() calls that double-spend the token (the second fails -> stuck on the sign-in screen). So exchange
// it ONCE here at module load, before React renders; useSession() awaits this and then reads the cached session.
const VERIFIER_PARAM = 'neon_auth_session_verifier';
export const sessionReady: Promise<void> = (async () => {
  try {
    if (typeof window === 'undefined' || !NEON_AUTH_URL) return;
    if (!new URLSearchParams(window.location.search).has(VERIFIER_PARAM)) return;
    console.info('[aiwa-auth] consuming one-time OAuth session verifier');
    await authClient.getSession(); // exchanges the verifier -> caches the session -> strips the URL param (SDK)
    console.info('[aiwa-auth] verifier exchanged; session established');
  } catch (e) {
    console.warn('[aiwa-auth] verifier exchange failed:', e);
  }
})();

export interface SessionUser {
  id: string;
  email: string;
  name?: string | null;
  image?: string | null;
}

/** The current session's bearer token (a JWT the server verifies via JWKS), or null when signed out. */
export async function getToken(): Promise<string | null> {
  try {
    const { data } = await authClient.getSession();
    return data?.session?.token ?? null;
  } catch {
    return null;
  }
}

export async function signOut(): Promise<void> {
  try {
    await authClient.signOut();
  } catch {
    /* best-effort */
  }
  window.location.reload();
}

/**
 * Start Google sign-in. Neon Auth's client is iframe-aware: inside an embedded development preview it
 * automatically runs OAuth in a POPUP and completes via a one-time session verifier it hands back to this
 * window (no full-page redirect of the workspace, no cross-partition cookie); outside an iframe it does the
 * normal full-page redirect. Either way `authClient.signIn.social` IS the whole flow.
 *
 * Do NOT hand-roll a popup protocol on top of this. The previous version did (a custom `aiwa_oauth_popup`
 * handshake that never matched Neon's `neon_popup` + `neon_auth_session_verifier` flow, plus a boot-time
 * delete of that verifier param) — which left the popup blank and destroyed the completion token.
 */
export async function signInWithGoogle(): Promise<void> {
  await authClient.signIn.social({ provider: 'google', callbackURL: `${window.location.origin}/` });
}

/**
 * React hook for the current session. Reads the live Neon Auth session once on mount; `<RequireAuth>` uses
 * it to decide whether to show the sign-in screen or the app. Returns { loading, user }.
 */
export function useSession(): { loading: boolean; user: SessionUser | null } {
  const [state, setState] = useState<{ loading: boolean; user: SessionUser | null }>({ loading: true, user: null });
  useEffect(() => {
    let alive = true;
    // Await the one-time verifier exchange (sessionReady) first, so StrictMode's double-invoked dev effect
    // can't double-spend the token; by the time it resolves the session is cached and getSession() is a hit.
    sessionReady
      .then(() => authClient.getSession())
      .then((res) => {
        if (!alive) return;
        const u = res?.data?.user;
        setState({
          loading: false,
          user: u ? { id: u.id, email: u.email, name: u.name ?? null, image: u.image ?? null } : null,
        });
      })
      .catch(() => {
        if (alive) setState({ loading: false, user: null });
      });
    return () => {
      alive = false;
    };
  }, []);
  return state;
}
