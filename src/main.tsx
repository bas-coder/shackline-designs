import { StrictMode, type ComponentType } from 'react';
import { createRoot } from 'react-dom/client';
import { MotionConfig } from 'motion/react';
import * as AppModule from './App';
// Import the auth module for its side effect: it creates the (iframe-aware) Neon Auth client at load, which
// wires up the OAuth-popup completion handler. So when THIS window is the Google popup returning to the app's
// own origin, Neon's client detects it, hands the session verifier back to the opener, and closes — no custom
// popup protocol needed. For a no-auth app the client is created with an empty URL and simply never used.
import './lib/auth';
import { initMobileFetch } from './lib/authed-fetch';
import { initTheme } from './lib/theme';
import { beginCriticalLoad } from './lib/critical-load';
// Inter replaces Helvetica Now. Instrument Sans (width axis) is declared in
// globals.css with font-display: block so the condensed face is the one that paints.
import '@fontsource/instrument-serif/400.css';
import '@fontsource-variable/inter';
import './globals.css';

// Tolerate either a named `export function App` or an `export default` from the (generated) App.tsx so an
// export-style slip doesn't blank the preview.
const App = ((AppModule as { App?: ComponentType }).App ??
  (AppModule as { default?: ComponentType }).default) as ComponentType;

// Resolve light/dark BEFORE the first paint. Doing this in an effect instead shows a flash of the
// wrong palette on every cold load, which is especially obvious in a native WebView.
initTheme();
beginCriticalLoad();
// Inside a Capacitor bundle (VITE_API_ORIGIN set) every relative /api call must become absolute,
// including the raw fetch('/api/...') calls generated code uses for public routes. No-op on the web.
initMobileFetch();

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    {/* Global motion guardrail: every motion/react animation (the fx kit's and any the generated
        app adds) automatically respects the OS prefers-reduced-motion setting. The CSS fx layer
        has its own matching @media gate in globals.css. */}
    <MotionConfig reducedMotion="user">
      <App />
    </MotionConfig>
  </StrictMode>
);
