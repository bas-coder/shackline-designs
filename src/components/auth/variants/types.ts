import type { ReactNode } from 'react';
import type { AuthMode } from '../AuthForm';

/**
 * The login variant registry contract. A variant owns the PAGE around the form (the frame, the
 * atmosphere, the conviction half) and renders the `form` node exactly once; it never owns state,
 * fetches, or auth logic (SignIn does). The manifest is what the planner reads to pick a variant
 * (mirrored in packages/shared/src/constants.ts LOGIN_VARIANT_CATALOG; a parity test keeps the
 * names equal), and `flush` decides which treatment of the shared form the variant receives.
 */

export interface AuthVariantProps {
  title: string;
  subtitle: string;
  logoUrl?: string;
  tagline?: string;
  highlights?: string[];
  /** The wired <AuthForm/>; render it once. */
  form: ReactNode;
  mode: AuthMode;
}

export interface AuthVariantManifest {
  name: string;
  label: string;
  /** 3 to 5 tags: the moods this frame suits. */
  mood: readonly string[];
  atmosphere: 'aurora' | 'spotlight' | 'grid' | 'dot' | 'meteors' | 'none';
  borderEffect: 'shine' | 'glow' | 'none';
  /** Hairline underline fields and pill buttons (the editorial treatment) instead of filled inputs. */
  flush: boolean;
  whenToUse: string;
  avoidWhen: string;
  /** uat run 9: kept for projects that already carry it; never chosen for a new build. */
  legacy?: boolean;
}

export interface AuthVariantModule {
  manifest: AuthVariantManifest;
  Variant: (props: AuthVariantProps) => React.JSX.Element;
}
