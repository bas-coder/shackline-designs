import { useState, type ReactNode } from 'react';
import { useSession } from '@/lib/auth';
import { SignIn } from './SignIn';
import { ResetPassword, getPasswordResetLanding } from './ResetPassword';
import type { LoginVariant } from './variants';

/**
 * Gate any page behind sign-in. Wrap a protected page: `<RequireAuth><Dashboard/></RequireAuth>`. While the
 * session loads it shows a skeleton; signed out it shows <SignIn/>; signed in it renders the children. Leave
 * public pages unwrapped. All SignIn props pass through: title/subtitle plus the layout props (variant from
 * the login registry, logoUrl, tagline, highlights).
 *
 * A password-reset landing (`?aiwa_pw_reset=1&token=...` from the emailed link - see ResetPassword.tsx)
 * renders the reset screen AHEAD of the session gate: the link must work whether or not the visitor
 * still has a session. Read once into state so the branch stays stable across re-renders even after
 * the reset flow rewrites the URL.
 */
export function RequireAuth({
  children,
  title,
  subtitle,
  variant,
  logoUrl,
  tagline,
  highlights,
}: {
  children: ReactNode;
  title?: string;
  subtitle?: string;
  variant?: LoginVariant;
  logoUrl?: string;
  tagline?: string;
  highlights?: string[];
}) {
  const [resetLanding] = useState(getPasswordResetLanding);
  const { loading, user } = useSession();
  if (resetLanding) return <ResetPassword landing={resetLanding} />;
  if (loading) {
    // Shimmer skeleton instead of bare text — the pre-auth flash should feel like part of the app.
    return (
      <div className="flex min-h-screen items-center justify-center bg-background">
        <div className="relative h-2.5 w-40 overflow-hidden rounded-full bg-muted">
          <span
            aria-hidden
            className="absolute inset-y-0 w-1/2"
            style={{
              background: 'linear-gradient(90deg, transparent, color-mix(in oklab, var(--color-foreground) 12%, transparent), transparent)',
              animation: 'fx-shimmer 1.6s ease-in-out infinite',
            }}
          />
          <span className="sr-only">Loading</span>
        </div>
      </div>
    );
  }
  if (!user) return <SignIn title={title} subtitle={subtitle} variant={variant} logoUrl={logoUrl} tagline={tagline} highlights={highlights} />;
  return <>{children}</>;
}
