import { useSyncExternalStore } from 'react';

/**
 * Light/dark theme control. LOCKED (see LOCKED_FILE_PATHS in @aiwa-codes/shared): the storage key, the
 * `dark` class on <html>, and the boot order are load-bearing outside this file. The AIWA preview's
 * theme toggle and the mobile store-readiness scan both drive this exact code path, so a regenerated
 * copy with a different class name or key would break both while still looking correct in isolation.
 *
 * Resolution order: an explicit user choice wins, otherwise follow the OS. That ordering matters — a
 * user who picked light must stay light when their laptop flips to dark at sunset.
 *
 * Generated apps build a theme toggle by calling setTheme() / useTheme(). They must NEVER write the
 * `dark` class themselves; going through here is what keeps the preview, the scan, and the shipped app
 * in agreement.
 */

export type ThemePreference = 'light' | 'dark' | 'system';
export type ResolvedTheme = 'light' | 'dark';

const STORAGE_KEY = 'app-theme';
const DARK_QUERY = '(prefers-color-scheme: dark)';

declare global {
  interface Window {
    /** Preview-only hook: lets the AIWA readiness scan drive the app's real theme path. */
    __aiwaSetTheme?: (theme: ResolvedTheme) => void;
  }
}

function osPrefersDark(): boolean {
  try {
    return window.matchMedia(DARK_QUERY).matches;
  } catch {
    return false; // very old WebViews have no matchMedia
  }
}

// The AIWA preview toggle's current choice. In-memory ON PURPOSE: it must win while set (so the DOM
// and useTheme() agree about what is on screen), never persist (a scan must not pin the user's app
// dark), and yield to any explicit in-app setTheme() call.
let previewOverride: ResolvedTheme | null = null;

export function getThemePreference(): ThemePreference {
  try {
    const v = localStorage.getItem(STORAGE_KEY);
    return v === 'light' || v === 'dark' ? v : 'system';
  } catch {
    return 'system'; // private mode / disabled storage
  }
}

export function resolveTheme(pref: ThemePreference = getThemePreference()): ResolvedTheme {
  if (previewOverride) return previewOverride;
  return pref === 'system' ? (osPrefersDark() ? 'dark' : 'light') : pref;
}

/** The ONLY place the `dark` class is written. */
function apply(theme: ResolvedTheme): void {
  const el = document.documentElement;
  el.classList.toggle('dark', theme === 'dark');
  el.style.colorScheme = theme; // native form controls + scrollbars follow the app
}

const listeners = new Set<() => void>();
function notify(): void {
  for (const fn of listeners) {
    try {
      fn();
    } catch {
      /* a broken subscriber must not stop the others */
    }
  }
}

export function setTheme(pref: ThemePreference): void {
  // An explicit in-app choice beats the preview toggle's override.
  previewOverride = null;
  try {
    if (pref === 'system') localStorage.removeItem(STORAGE_KEY);
    else localStorage.setItem(STORAGE_KEY, pref);
  } catch {
    /* ignore: the theme still applies for this session */
  }
  apply(resolveTheme(pref));
  notify();
}

/** Cycle light → dark → light, pinning an explicit preference. */
export function toggleTheme(): void {
  setTheme(resolveTheme() === 'dark' ? 'light' : 'dark');
}

/** React binding: `const { theme, preference, setTheme } = useTheme()`. */
export function useTheme(): {
  theme: ResolvedTheme;
  preference: ThemePreference;
  setTheme: typeof setTheme;
  toggleTheme: typeof toggleTheme;
} {
  const subscribe = (fn: () => void) => {
    listeners.add(fn);
    return () => {
      listeners.delete(fn);
    };
  };
  const theme = useSyncExternalStore(
    subscribe,
    () => resolveTheme(),
    () => 'light' as ResolvedTheme
  );
  const preference = useSyncExternalStore(
    subscribe,
    () => getThemePreference(),
    () => 'system' as ThemePreference
  );
  return { theme, preference, setTheme, toggleTheme };
}

/**
 * Called from the locked main.tsx BEFORE render. Strictly speaking this runs after the whole module
 * graph evaluates (it is a deferred module script, not an inline head script), so a very large app on
 * a cold load can still flash the default light surface briefly; what it does guarantee is that React
 * never renders under the wrong theme, which is where the visible flash-and-repaint came from.
 */
export function initTheme(): void {
  apply(resolveTheme());

  try {
    // Only repaint on an OS change while the preference is still 'system'. An explicit choice must
    // survive the user's laptop flipping theme.
    window.matchMedia(DARK_QUERY).addEventListener('change', () => {
      if (getThemePreference() === 'system') {
        apply(resolveTheme());
        notify();
      }
    });
  } catch {
    /* older WebViews expose only the deprecated addListener; skipping just means no live OS sync */
  }

  // Preview bridge: the AIWA workspace toggle flips the theme through the app's OWN apply path rather
  // than emulating a media query the app would not have honored. Sets the in-memory override (not
  // just the class) so useTheme() and any `theme === 'dark'` render branch agree with what is on
  // screen; without it a toggle icon showed the sun on a dark app. Never persists. No-op outside the
  // preview.
  window.__aiwaSetTheme = (theme: ResolvedTheme) => {
    previewOverride = theme === 'dark' ? 'dark' : 'light';
    apply(previewOverride);
    notify();
  };
}
