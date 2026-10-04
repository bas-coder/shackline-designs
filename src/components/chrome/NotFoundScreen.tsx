/**
 * 2026-09-24: the app's own not-found screen, wired as createRouter's defaultNotFoundComponent by
 * the template seed (src/App.tsx) beside ErrorScreen. Without it TanStack renders a bare
 * "Not Found" paragraph inside the app's own navbar for any route the model linked but never
 * registered (the September 2026 audit found 124 of 126 live apps in that state). On-palette, one
 * link home, no chrome of its own: the root layout around it stays the app's. Locked kit: generated
 * code imports it, never re-creates it.
 */
export function NotFoundScreen() {
  return (
    <div data-aiwa-not-found="true" className="flex min-h-[60vh] items-center justify-center bg-background px-6 text-foreground">
      <div className="max-w-md space-y-3 text-center">
        <p className="font-mono text-xs uppercase tracking-widest text-muted-foreground">Page not found</p>
        <p className="text-sm font-medium">There is nothing at this address.</p>
        <p className="text-sm text-muted-foreground">The link may be old, or the page has moved. Head back to the start.</p>
        <a
          href="/"
          className="inline-flex min-h-11 items-center rounded-lg border border-border bg-card px-4 text-sm font-medium text-foreground transition-colors hover:bg-muted/50 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[var(--color-ring)]"
        >
          Back to the start
        </a>
      </div>
    </div>
  );
}
