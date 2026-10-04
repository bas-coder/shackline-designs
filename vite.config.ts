import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';
import tailwindcss from '@tailwindcss/vite';
import path from 'path';

export default defineConfig({
  plugins: [react(), tailwindcss()],
  resolve: {
    alias: {
      '@': path.resolve(__dirname, './src'),
    },
  },
  // Pre-bundle the SMALL, near-universal runtime deps that GENERATED code imports but the placeholder
  // App.tsx does not, so a generated import doesn't trigger a mid-flight "optimized dependencies changed.
  // reloading" that races the CSS → unstyled. NOTE: the host now kill+respawns vite on every client build
  // (a fresh cold start pre-bundles whatever the app actually imports), so this list is mostly a
  // belt-and-suspenders for that path — keep it CHEAP. @tabler/icons-react is deliberately OMITTED: it's a
  // multi-thousand-module barrel that added ~15s to EVERY restart even for lucide-only apps; the cold
  // restart pre-bundles it only when an app truly uses it.
  optimizeDeps: {
    include: [
      'lucide-react',
      'clsx',
      'tailwind-merge',
      'class-variance-authority',
      'zustand',
    ],
  },
  server: {
    port: 4010,
    strictPort: true, // pin 4010 so the host can key the iframe on vite's port deterministically
    // Files stream into the sandbox in dependency-violating order during a build, so vite throws
    // transient "failed to resolve" errors that self-heal once the rest land — don't flash vite's
    // red overlay for those. Genuine errors are surfaced (after the build settles) by the host app.
    hmr: { overlay: false },
    proxy: {
      // The generated Hono server runs in the SAME preview VM on 3001 (intra-container localhost
      // works — only outbound TCP is blocked). IPv4 pin: `localhost` can resolve to ::1 and miss it.
      '/api': 'http://127.0.0.1:3001',
    },
  },
});
