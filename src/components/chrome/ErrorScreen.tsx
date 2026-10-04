import type { ErrorComponentProps } from '@tanstack/react-router';

/**
 * 2026-09-24: the app's own error screen, wired as createRouter's defaultErrorComponent by the
 * template seed (src/App.tsx). Calm and on-palette instead of the router's red default, and it
 * carries data-aiwa-error-boundary so the preview probe and the platform's render check can tell
 * an error screen from a rendered page and hand the exact message to the self-heal round. The
 * message itself stays out of sight in a hidden <pre>. Locked kit: generated code imports it,
 * never re-creates it.
 */
export function ErrorScreen({ error, reset }: ErrorComponentProps) {
  const message = error instanceof Error ? error.message : String(error);
  return (
    <div data-aiwa-error-boundary="true" role="alert" className="flex min-h-[60vh] items-center justify-center bg-background px-6 text-foreground">
      <div className="max-w-md space-y-3 text-center">
        <p className="text-sm font-medium">This page hit a snag while loading.</p>
        <p className="text-sm text-muted-foreground">It is being looked at. Try again in a moment.</p>
        <button type="button" onClick={() => reset()} className="rounded-md border border-border bg-card px-3 py-1.5 text-sm text-foreground">
          Try again
        </button>
        <pre data-aiwa-error-message hidden>{message}</pre>
      </div>
    </div>
  );
}
