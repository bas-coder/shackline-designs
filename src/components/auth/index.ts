/**
 * Auth barrel — the canonical import surface for the template's auth components. The codegen prompt
 * and the model's own convention reach for `@/components/auth` (the folder), so this re-export makes
 * `import { RequireAuth, SignIn } from '@/components/auth'` resolve to the real modules. Without it a
 * barrel import points at a non-existent `auth.tsx`, fails to resolve, and (since App.tsx is the entry)
 * white-screens the whole app. Importing the subpaths directly still works.
 */
export { RequireAuth } from './RequireAuth';
export { SignIn } from './SignIn';
export { AuthForm } from './AuthForm';
export { ResetPassword, getPasswordResetLanding } from './ResetPassword';
export { LOGIN_VARIANTS, LOGIN_VARIANT_NAMES, resolveLoginVariant } from './variants';
export type { LoginVariant, AuthVariantModule, AuthVariantManifest, AuthVariantProps } from './variants';
