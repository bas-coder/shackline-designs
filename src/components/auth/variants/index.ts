import * as center from './center';
import * as split from './split';
import * as editorial from './editorial';
import * as providerGate from './provider-gate';
import * as blueprintGrid from './blueprint-grid';
import * as horizonGlow from './horizon-glow';
import * as cinematicScene from './cinematic-scene';
import * as gateOnIntent from './gate-on-intent';
import type { AuthVariantModule } from './types';

/**
 * The login variant registry. Adding a variant = one file exporting `manifest` and `Variant`, one
 * line here, and a matching entry in packages/shared/src/constants.ts LOGIN_VARIANT_CATALOG (the
 * planner's catalog; a parity test keeps the names equal). The names are the values RequireAuth's
 * `variant` prop accepts and the design contract carries.
 */
export const LOGIN_VARIANTS = {
  center,
  split,
  editorial,
  'provider-gate': providerGate,
  'blueprint-grid': blueprintGrid,
  'horizon-glow': horizonGlow,
  'cinematic-scene': cinematicScene,
  'gate-on-intent': gateOnIntent,
} satisfies Record<string, AuthVariantModule>;

export type LoginVariant = keyof typeof LOGIN_VARIANTS;
export const LOGIN_VARIANT_NAMES = Object.keys(LOGIN_VARIANTS) as LoginVariant[];

export function resolveLoginVariant(name: string | undefined): AuthVariantModule {
  // uat run 9: the fallback is a Bricx variant. Existing projects always name theirs (center, split
  // and editorial stay resolvable); only a project with no contract line reaches this default.
  return (name && (LOGIN_VARIANTS as Record<string, AuthVariantModule>)[name]) || blueprintGrid;
}

export type { AuthVariantModule, AuthVariantManifest, AuthVariantProps } from './types';
