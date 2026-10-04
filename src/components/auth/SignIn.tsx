import { useState, type FormEvent } from 'react';
import { authClient, signInWithGoogle } from '@/lib/auth';
import { AuthForm, type AuthMode } from './AuthForm';
import { resolveLoginVariant, type LoginVariant } from './variants';

/**
 * Drop-in sign-in screen: "Continue with Google" plus an email + password form (sign in / create account).
 * Auth is fully provisioned by AIWA (Neon Auth) — this component just drives the client. On success the
 * page reloads so the session is re-read and the app renders. Use it directly, or via <RequireAuth>.
 *
 * The page around the form is a registered login variant (./variants): SignIn owns the state, the
 * submit logic and the shared <AuthForm/>; the variant owns the frame, the atmosphere and the
 * conviction half, and renders the form node once. The design contract names the variant; it is a
 * divergence lever rotated against sibling projects. An unknown name falls back to 'blueprint-grid'
 * (uat run 9: the legacy center, split and editorial exist for projects that already carry them).
 */
export function SignIn({
  title = 'Welcome',
  subtitle = 'Sign in to continue',
  variant = 'blueprint-grid',
  logoUrl,
  tagline,
  highlights,
}: {
  title?: string;
  subtitle?: string;
  variant?: LoginVariant;
  logoUrl?: string;
  tagline?: string;
  highlights?: string[];
}) {
  const [mode, setMode] = useState<AuthMode>('signin');
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const [sent, setSent] = useState(false);

  async function onGoogle() {
    setError('');
    setLoading(true);
    try {
      await signInWithGoogle();
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Could not start Google sign-in. Please try again.');
      setLoading(false);
    }
  }

  async function onSubmit(e: FormEvent) {
    e.preventDefault();
    setError('');
    setLoading(true);
    if (mode === 'forgot') {
      try {
        // The marker param makes the emailed link's landing recognisable as a reset (see
        // ResetPassword.tsx); the auth server appends `&token=...` to it on click-through.
        const res = await authClient.requestPasswordReset({
          email,
          redirectTo: `${window.location.origin}/?aiwa_pw_reset=1`,
        });
        if (res.error) {
          setError(res.error.message || 'Could not send the reset email. Please try again.');
        } else {
          setSent(true);
        }
      } catch {
        setError('Could not send the reset email. Please try again.');
      }
      setLoading(false);
      return;
    }
    try {
      const res =
        mode === 'signin'
          ? await authClient.signIn.email({ email, password })
          : await authClient.signUp.email({ email, password, name: name.trim() || email.split('@')[0] });
      const err = (res as { error?: { message?: string } } | undefined)?.error;
      if (err) {
        setError(err.message || 'Authentication failed. Check your details and try again.');
        setLoading(false);
        return;
      }
      window.location.reload(); // session is set; re-read on reload
    } catch {
      setError('Authentication failed. Please try again.');
      setLoading(false);
    }
  }

  const { manifest, Variant } = resolveLoginVariant(variant);
  const form = (
    <AuthForm
      flush={manifest.flush}
      mode={mode}
      name={name}
      email={email}
      password={password}
      error={error}
      loading={loading}
      sent={sent}
      onGoogle={onGoogle}
      onSubmit={onSubmit}
      onName={setName}
      onEmail={setEmail}
      onPassword={setPassword}
      // From forgot the only way out is back to sign-in; otherwise the link toggles signin/signup.
      onToggleMode={() => {
        setError('');
        setSent(false);
        setMode(mode === 'signin' ? 'signup' : 'signin');
      }}
      onForgot={() => {
        setError('');
        setSent(false);
        setMode('forgot');
      }}
    />
  );

  return <Variant title={title} subtitle={subtitle} logoUrl={logoUrl} tagline={tagline} highlights={highlights} form={form} mode={mode} />;
}
