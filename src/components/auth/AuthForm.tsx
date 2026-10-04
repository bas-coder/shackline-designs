import type { FormEvent } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';

export type AuthMode = 'signin' | 'signup' | 'forgot';

export interface AuthFormProps {
  /** The editorial treatment: hairline underline fields, no filled input chrome, pill buttons. */
  flush?: boolean;
  mode: AuthMode;
  name: string;
  email: string;
  password: string;
  error: string;
  loading: boolean;
  sent: boolean;
  onGoogle: () => void;
  onSubmit: (e: FormEvent) => void;
  onName: (v: string) => void;
  onEmail: (v: string) => void;
  onPassword: (v: string) => void;
  onToggleMode: () => void;
  onForgot: () => void;
}

/**
 * The one shared form (Google-first + divider + email/password + mode toggle). Every login variant
 * renders exactly this node once; the variant owns the page around it, never the fields. Defined at
 * MODULE scope on purpose: nesting it inside a variant gives it a fresh component identity on every
 * parent render, which makes React remount the tree and drop input focus after each keystroke.
 */
export function AuthForm({
  flush = false,
  mode,
  name,
  email,
  password,
  error,
  loading,
  sent,
  onGoogle,
  onSubmit,
  onName,
  onEmail,
  onPassword,
  onToggleMode,
  onForgot,
}: AuthFormProps) {
  const inputCls = flush
    ? 'h-12 rounded-none border-0 border-b border-border bg-transparent px-1 shadow-none focus-visible:ring-0 focus-visible:border-primary'
    : 'h-11 bg-background/50';

  // Forgot-password: email only, no Google chrome. The reset email's link lands back on this app
  // with `?aiwa_pw_reset=1&token=...`, which <RequireAuth> routes to the ResetPassword screen.
  if (mode === 'forgot') {
    return (
      <div className="space-y-5">
        {sent ? (
          <p className="rounded-md bg-primary/10 px-3 py-3 text-center text-sm text-foreground">
            If that email has an account, a reset link is on its way. Open it on this device.
          </p>
        ) : (
          <form className="space-y-3" onSubmit={onSubmit}>
            <p className="text-sm text-muted-foreground">
              Enter your email and we will send you a link to set a new password.
            </p>
            <Input
              type="email"
              placeholder="you@example.com"
              className={inputCls}
              value={email}
              onChange={(e) => onEmail(e.target.value)}
              autoComplete="email"
              autoFocus
              required
            />
            {error && <p className="rounded-md bg-destructive/10 px-3 py-2 text-sm text-destructive">{error}</p>}
            <Button
              type="submit"
              className={`h-11 w-full text-sm font-semibold transition-transform hover:-translate-y-0.5 ${flush ? 'rounded-full' : 'shadow-lg'}`}
              disabled={loading}
            >
              {loading ? 'Please wait...' : 'Send reset link'}
            </Button>
          </form>
        )}
        <p className="text-center text-sm text-muted-foreground">
          <button type="button" className="font-medium text-primary hover:underline" onClick={onToggleMode}>
            Back to sign in
          </button>
        </p>
      </div>
    );
  }

  return (
    <div className="space-y-5">
      <Button
        type="button"
        variant="outline"
        className={`h-11 w-full gap-2 text-sm font-medium transition-transform hover:-translate-y-0.5 ${flush ? 'rounded-full' : 'bg-background/50'}`}
        onClick={onGoogle}
        disabled={loading}
      >
        <svg className="h-4 w-4" viewBox="0 0 24 24" aria-hidden>
          <path fill="#4285F4" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92a5.06 5.06 0 0 1-2.2 3.32v2.77h3.57c2.08-1.92 3.27-4.74 3.27-8.1Z" />
          <path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.99.66-2.26 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84A11 11 0 0 0 12 23Z" />
          <path fill="#FBBC05" d="M5.84 14.1a6.6 6.6 0 0 1 0-4.2V7.06H2.18a11 11 0 0 0 0 9.88l3.66-2.84Z" />
          <path fill="#EA4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.06l3.66 2.84C6.71 7.31 9.14 5.38 12 5.38Z" />
        </svg>
        Continue with Google
      </Button>

      <div className="relative">
        <div className="absolute inset-0 flex items-center"><span className="w-full border-t border-border/60" /></div>
        <div className="relative flex justify-center">
          <span className="px-3 text-[11px] font-medium uppercase tracking-widest text-muted-foreground backdrop-blur-sm">or</span>
        </div>
      </div>

      <form className="space-y-3" onSubmit={onSubmit}>
        {mode === 'signup' && (
          <Input type="text" placeholder="Name" className={inputCls} value={name} onChange={(e) => onName(e.target.value)} autoComplete="name" autoFocus />
        )}
        <Input
          type="email"
          placeholder="you@example.com"
          className={inputCls}
          value={email}
          onChange={(e) => onEmail(e.target.value)}
          autoComplete="email"
          autoFocus={mode === 'signin'}
          required
        />
        <Input
          type="password"
          placeholder="Password"
          className={inputCls}
          value={password}
          onChange={(e) => onPassword(e.target.value)}
          autoComplete={mode === 'signin' ? 'current-password' : 'new-password'}
          required
          minLength={8}
        />
        {mode === 'signin' && (
          <div className="flex justify-end">
            <button
              type="button"
              className="text-xs font-medium text-muted-foreground transition-colors hover:text-primary"
              onClick={onForgot}
            >
              Forgot password?
            </button>
          </div>
        )}
        {error && <p className="rounded-md bg-destructive/10 px-3 py-2 text-sm text-destructive">{error}</p>}
        <Button
          type="submit"
          className={`h-11 w-full text-sm font-semibold transition-transform hover:-translate-y-0.5 ${flush ? 'rounded-full' : 'shadow-lg'}`}
          disabled={loading}
        >
          {loading ? 'Please wait...' : mode === 'signin' ? 'Sign in' : 'Create account'}
        </Button>
      </form>

      <p className="text-center text-sm text-muted-foreground">
        {mode === 'signin' ? "Don't have an account? " : 'Already have an account? '}
        <button type="button" className="font-medium text-primary hover:underline" onClick={onToggleMode}>
          {mode === 'signin' ? 'Create one' : 'Sign in'}
        </button>
      </p>
    </div>
  );
}
