import { Resend } from 'resend';

// The sender is CONFIGURATION, set once by the app owner under Connectors > Resend in AIWA and injected
// as RESEND_FROM. Generated code never chooses it: it just calls sendEmail(). When no sender is set, or
// Resend rejects the configured one (its domain is not verified yet), the shared test sender below is
// the final fallback; it works with no setup but only delivers to the Resend account owner's address.
// Keep this literal identical to RESEND_TEST_SENDER in packages/shared (the template cannot import it).
const TEST_SENDER = 'onboarding@resend.dev';

let warnedIgnoredFrom = false;

/** Resend's "this sender's domain is not verified" refusal: a 403 whose message names the domain. */
function isDomainRejection(error: { statusCode?: number; message?: string }): boolean {
  return error.statusCode === 403 || /domain|not verified/i.test(error.message ?? '');
}

/**
 * Send an email via the project's connected Resend account. Safe to call ALWAYS: it NO-OPS (returns false)
 * when RESEND_API_KEY is not set (the user has not connected Resend), and never throws (a send failure is
 * logged, not propagated), so it can never break the request it is called from. Use this for welcome /
 * notification emails; do not import 'resend' directly.
 *
 * The sender is always RESEND_FROM when it is set. `from` is IGNORED in that case (and logged once): the
 * owner configures the sender in AIWA, and a hardcoded one is how an app ends up sending from an address
 * Resend rejects. It is honoured only by an older app with no configured sender, so nothing that worked
 * before stops working.
 *
 * The return value is the ONLY signal that a send worked. A caller that reports success to the user must
 * check it. R139: this used to `await` the send and return true unconditionally, which was wrong in the
 * worst way. The Resend SDK resolves with `{ data, error }` on a 4xx instead of throwing, so a rejected
 * send (an unverified sender domain being the common one) read as success and was never logged anywhere.
 * A live contact form notified nobody for weeks and reported 200 every time.
 */
export async function sendEmail(opts: {
  to: string;
  subject: string;
  html: string;
  /** Ignored when RESEND_FROM is set. Do not pass it; the sender is configured under Connectors > Resend. */
  from?: string;
}): Promise<boolean> {
  const key = process.env.RESEND_API_KEY;
  if (!key) return false; // Resend not connected -> skip silently (the feature is "leave for later")

  // Read per call, not at module load: the platform can change RESEND_FROM on a running server.
  const configured = process.env.RESEND_FROM?.trim();
  const requested = opts.from?.trim();
  if (configured && requested && requested !== configured && !warnedIgnoredFrom) {
    warnedIgnoredFrom = true;
    console.warn(`[email] ignoring from=${requested}: the sender is configured in Connectors > Resend (RESEND_FROM=${configured})`);
  }
  const from = configured || requested || TEST_SENDER;

  const resend = new Resend(key);
  const attempt = async (sender: string) => {
    // Handle BOTH failure shapes: the SDK returns `{ error }` for an API rejection, but a transport
    // failure still throws. Treating only one as failure is how this bug happened the first time.
    const result = await resend.emails.send({ from: sender, to: opts.to, subject: opts.subject, html: opts.html });
    return (result as { error?: { name?: string; message?: string; statusCode?: number } } | null)?.error ?? null;
  };

  try {
    let error = await attempt(from);
    if (error && from !== TEST_SENDER && isDomainRejection(error)) {
      // The configured sender's domain is not verified in this Resend account (yet). Fall back to the
      // test sender so the owner still gets their own notifications, and say loudly what to fix.
      console.error(
        `[email] ${from} is on a domain Resend has not verified; retrying from the test sender, which only ` +
          `delivers to your own Resend account email. Verify the domain at resend.com/domains.`
      );
      error = await attempt(TEST_SENDER);
    }
    if (error) {
      console.error(
        `[email] Resend rejected a message to ${opts.to} from ${from}: ` +
          `${error.name ?? 'error'}${error.statusCode ? ` (${error.statusCode})` : ''} ${error.message ?? ''}`.trim()
      );
      // The single most common cause, and invisible otherwise: the shared test sender is only allowed to
      // deliver to the Resend account owner's own address. Any other recipient is rejected outright.
      console.error(
        `[email] Resend's shared test address only delivers to your own Resend account email. To email ` +
          `anyone else, verify a domain at resend.com/domains and set the sender under Connectors > Resend.`
      );
      return false;
    }
    return true;
  } catch (e) {
    console.error(`[email] send to ${opts.to} failed:`, (e as Error).message);
    return false;
  }
}
