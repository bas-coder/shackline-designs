import { useState, type FormEvent } from 'react';
import { Key, CheckCircle, Warning } from '@phosphor-icons/react';
import { authClient } from '@/lib/auth';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { AuroraBackdrop, DotPattern, ShineBorder, StaggerReveal } from '@/components/fx';

/**
 * The password-reset LANDING screen. Better Auth's reset flow works like this: requesting a reset
 * (the "Forgot password?" link in <SignIn/>, or the app owner from the AIWA Control Panel) emails the
 * user a link to the auth server, which validates it and redirects to the app with `?token=<one-time
 * token>` appended (or `?error=INVALID_TOKEN` when expired). Both requesters set the redirect to
 * `/?aiwa_pw_reset=1`, so a reset landing is recognisable by the MARKER param plus token/error - a
 * bare `?token=` alone is never treated as a reset, leaving that name free for the app's own links
 * (invites etc). <RequireAuth> checks getPasswordResetLanding() and renders this screen ahead of the
 * session gate, so the link works whether or not the user still has a session.
 */

export const RESET_LANDING_PARAM = 'aiwa_pw_reset';

export type PasswordResetLanding = { token: string } | { invalid: true };

/** The reset landing carried by the current URL, or null when this is a normal page load. */
export function getPasswordResetLanding(): PasswordResetLanding | null {
  if (typeof window === 'undefined') return null;
  const q = new URLSearchParams(window.location.search);
  if (!q.has(RESET_LANDING_PARAM)) return null;
  const token = q.get('token');
  return token ? { token } : { invalid: true };
}

/** Leave the reset flow: strip its params and reload so the app boots normally (sign-in included). */
function exitToApp(): void {
  const url = new URL(window.location.href);
  url.searchParams.delete(RESET_LANDING_PARAM);
  url.searchParams.delete('token');
  url.searchParams.delete('error');
  window.location.replace(url.toString());
}

export function ResetPassword({ landing }: { landing: PasswordResetLanding }) {
  const [password, setPassword] = useState('');
  const [confirm, setConfirm] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const [done, setDone] = useState(false);

  async function onSubmit(e: FormEvent) {
    e.preventDefault();
    if (!('token' in landing)) return;
    if (password !== confirm) {
      setError('The passwords do not match.');
      return;
    }
    setError('');
    setLoading(true);
    try {
      // The client THROWS AuthApiError on a refused reset (it does not return { error }), so the
      // catch below is the real failure path; this branch only covers adapter versions that return.
      const res = await authClient.resetPassword({ newPassword: password, token: landing.token });
      if ((res as { error?: { message?: string } } | undefined)?.error) {
        setError('This reset link is no longer valid. Request a new one from the sign-in screen.');
        setLoading(false);
        return;
      }
      setDone(true);
    } catch (err) {
      // The token is single-use and expiring: the usual refusal here is a stale link. A 4xx from the
      // auth server means exactly that; anything else (network) gets the retry message.
      const status = (err as { status?: number })?.status;
      setError(
        typeof status === 'number' && status >= 400 && status < 500
          ? 'This reset link is no longer valid or has expired. Request a new one from the sign-in screen.'
          : 'Could not update the password. Please try again.'
      );
      setLoading(false);
    }
  }

  const invalid = !('token' in landing);

  return (
    <div className="relative flex min-h-screen items-center justify-center overflow-hidden bg-background px-6 py-12">
      <AuroraBackdrop intensity="subtle" position="top" />
      <DotPattern fade="center" className="opacity-50" />

      <div className="relative z-10 w-full max-w-sm">
        <StaggerReveal className="space-y-6">
          <div className="space-y-1.5 text-center">
            <h1 className="font-display text-3xl font-semibold tracking-tight text-foreground">
              {done ? 'Password updated' : invalid ? 'Link expired' : 'Choose a new password'}
            </h1>
            <p className="text-sm text-muted-foreground">
              {done
                ? 'Your password has been changed. Sign in with the new one.'
                : invalid
                  ? 'This reset link is invalid or has already been used.'
                  : 'Set a new password for your account.'}
            </p>
          </div>

          <ShineBorder duration={9} className="shadow-xl">
            <div className="rounded-[inherit] bg-card/70 p-8 backdrop-blur-xl">
              {done ? (
                <div className="space-y-5 text-center">
                  <CheckCircle className="mx-auto h-10 w-10 text-primary" />
                  <Button className="h-11 w-full text-sm font-semibold" onClick={exitToApp}>
                    Continue to sign in
                  </Button>
                </div>
              ) : invalid ? (
                <div className="space-y-5 text-center">
                  <Warning className="mx-auto h-10 w-10 text-muted-foreground" />
                  <p className="text-sm text-muted-foreground">
                    Request a new link from the sign-in screen and use it right away.
                  </p>
                  <Button className="h-11 w-full text-sm font-semibold" onClick={exitToApp}>
                    Back to sign in
                  </Button>
                </div>
              ) : (
                <form className="space-y-3" onSubmit={onSubmit}>
                  <div className="mb-2 flex justify-center">
                    <span className="grid h-11 w-11 place-items-center rounded-full bg-primary/10">
                      <Key className="h-5 w-5 text-primary" />
                    </span>
                  </div>
                  <Input
                    type="password"
                    placeholder="New password"
                    className="h-11 bg-background/50"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    autoComplete="new-password"
                    autoFocus
                    required
                    minLength={8}
                  />
                  <Input
                    type="password"
                    placeholder="Confirm new password"
                    className="h-11 bg-background/50"
                    value={confirm}
                    onChange={(e) => setConfirm(e.target.value)}
                    autoComplete="new-password"
                    required
                    minLength={8}
                  />
                  {error && <p className="rounded-md bg-destructive/10 px-3 py-2 text-sm text-destructive">{error}</p>}
                  <Button type="submit" className="h-11 w-full text-sm font-semibold shadow-lg" disabled={loading}>
                    {loading ? 'Please wait...' : 'Update password'}
                  </Button>
                  <button
                    type="button"
                    className="w-full text-center text-sm font-medium text-muted-foreground hover:text-foreground"
                    onClick={exitToApp}
                  >
                    Cancel
                  </button>
                </form>
              )}
            </div>
          </ShineBorder>
        </StaggerReveal>
      </div>
    </div>
  );
}
