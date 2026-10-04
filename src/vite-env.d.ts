/// <reference types="vite/client" />

interface ImportMetaEnv {
  // Injected by AIWA when the app has auth; undefined for a no-auth app.
  readonly VITE_NEON_AUTH_URL?: string;
  /** Absolute backend origin, set only for the Capacitor/mobile build (see lib/authed-fetch.ts). */
  readonly VITE_API_ORIGIN?: string;
}

interface ImportMeta {
  readonly env: ImportMetaEnv;
}
