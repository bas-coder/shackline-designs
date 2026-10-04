import { useSession } from '@/lib/auth';
import { buttonVariants } from '@/components/ui/button';
import { isSplitPrimary, SPLIT_PRIMARY, SplitPrimaryParts, splitPrimaryStyle } from '@/components/split-primary';
import { cn } from '@/lib/utils';

/**
 * An auth-aware nav CTA for PUBLIC pages. Reads the live session and swaps automatically: "Sign In"
 * when signed out, and an authed CTA (default "Dashboard") when signed in. This fixes the "logged in
 * via Google but the landing still shows Sign In" gap: a public page must never show a static Sign In
 * button. Renders a real anchor (router-agnostic; right/middle-click work). Only for apps with accounts.
 * Style it via className (it already carries the primary button look).
 */
export function AuthCTA({
  signedOutLabel = 'Sign In',
  signedInLabel = 'Dashboard',
  appHref = '/app/dashboard',
  // Defaults to appHref, NOT '/sign-in'. Auth in this template is an in-route GATE: RequireAuth renders
  // <SignIn/> IN PLACE of the page it wraps, so no standalone /sign-in route exists unless the app
  // author writes one, and the old default pointed live apps at TanStack's "Not Found" inside their own
  // layout, which reads as a broken page rather than a missing route. Sending a signed-out visitor to
  // the app's own gated route lands them on the gate, which IS the sign-in screen.
  // appHref's default is deliberately unchanged: moving it would silently redirect signed-IN users in
  // any app that passes signInHref but not appHref, breaking something that works today.
  // NOTE: appHref must stay ABOVE this line. Destructuring defaults evaluate left to right, so the
  // reverse order is a TDZ ReferenceError at runtime and a "used before declaration" error in tsc.
  signInHref = appHref,
  className,
  signedOutAppearance,
}: {
  signedOutLabel?: string;
  signedInLabel?: string;
  signInHref?: string;
  appHref?: string;
  className?: string;
  signedOutAppearance?: { className?: string; 'data-aiwa-ve'?: string; 'data-aiwa-vh'?: string };
}) {
  const { loading, user } = useSession();
  if (loading) return <div className={cn('h-9 w-24 animate-pulse rounded-md bg-muted', className)} aria-hidden />;
  const href = user ? appHref : signInHref;
  const label = user ? signedInLabel : signedOutLabel;
  const look = cn(buttonVariants(), className, !user && signedOutAppearance?.className);
  const split = isSplitPrimary(look);
  return (
    <a
      href={href}
      {...(!user ? signedOutAppearance : {})}
      className={cn(look, split && SPLIT_PRIMARY)}
      style={split ? splitPrimaryStyle(look) : undefined}
    >
      {split ? <SplitPrimaryParts>{label}</SplitPrimaryParts> : label}
    </a>
  );
}
