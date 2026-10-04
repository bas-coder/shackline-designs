import { Hono } from 'hono'
import { zValidator } from '@hono/zod-validator'
import { z } from 'zod'
import { sendEmail } from '../lib/email'

const app = new Hono()

/** The studio's supplied quote inbox. RESEND_NOTIFY_TO (configured by the
 *  owner under Connectors > Resend) takes precedence when set. */
const QUOTE_INBOX_EMAIL = 'MariaReynel@ShackLineDesigns.com'

// zValidator with NO hook answers a bad body with a raw ZodError object the
// UI cannot render. This hook always returns { error: string } on a 400.
const invalid = (
  result: { success: boolean; error?: { issues: Array<{ path: PropertyKey[]; message: string }> } },
  c: any,
) => {
  if (!result.success) {
    const first = result.error?.issues[0]
    return c.json(
      { error: first ? `${first.path.join('.') || 'input'}: ${first.message}` : 'Invalid input' },
      400,
    )
  }
}

const quoteInput = z.object({
  name: z.string().trim().min(1, 'Tell us your name').max(120),
  email: z.string().trim().email('Enter a valid email address').max(200),
  message: z.string().trim().min(1, 'Add a line about your project').max(2000),
  phone: z.string().trim().max(40).optional().default(''),
  smsOptIn: z.boolean().optional().default(false),
})

/** Scheduling availability: the Calendly booking path renders on the page
 *  only when the connector is actually configured, so the live site never
 *  shows a dead or placeholder booking link. */
let cachedScheduling: { connected: boolean; url: string | null } | null = null

async function calendlyScheduling(): Promise<{ connected: boolean; url: string | null }> {
  if (cachedScheduling) return cachedScheduling
  const token = process.env.CALENDLY_API_TOKEN
  if (!token) return { connected: false, url: null }

  const api = async (path: string) => {
    const res = await fetch(`https://api.calendly.com${path}`, {
      headers: { Authorization: `Bearer ${token}`, 'Content-Type': 'application/json' },
    })
    if (!res.ok) throw new Error(`Calendly ${res.status}`)
    return res.json()
  }

  try {
    // Both /event_types and /scheduled_events require the user uri.
    const me = await api('/users/me')
    const userUri: string | undefined = me?.resource?.uri
    if (!userUri) return { connected: false, url: null }

    const chosen = process.env.CALENDLY_EVENT_TYPE_URI
    const list = await api(
      `/event_types?user=${encodeURIComponent(userUri)}&active=true`,
    )
    const types: Array<{ uri: string; scheduling_url?: string; active?: boolean }> =
      list?.collection ?? []
    const offered = chosen ? types.filter((t) => t.uri === chosen) : types
    if (chosen && offered.length === 0) {
      console.warn('[quote] CALENDLY_EVENT_TYPE_URI matches no active event type')
    }
    const withUrl = offered.find((t) => typeof t.scheduling_url === 'string')
    if (!withUrl) return { connected: false, url: null }

    cachedScheduling = { connected: true, url: withUrl.scheduling_url as string }
    return cachedScheduling
  } catch (err) {
    console.error('[quote] Calendly scheduling lookup failed', err)
    return { connected: false, url: null }
  }
}

app.get('/api/quote/scheduling', async (c) => {
  try {
    const scheduling = await calendlyScheduling()
    return c.json(scheduling)
  } catch (err) {
    console.error('[quote] scheduling check failed', err)
    return c.json({ connected: false, url: null })
  }
})

app.post('/api/quote', zValidator('json', quoteInput, invalid), async (c) => {
  const input = c.req.valid('json')
  try {
    // This app's schema declares no tables, so there is no quote_requests
    // row to persist. The request is recorded here as an acknowledged
    // submission with a generated reference, and the email copy to the
    // studio inbox is the record of the request.
    const saved = {
      id: crypto.randomUUID(),
      name: input.name,
      email: input.email,
      phone: input.phone,
      smsOptIn: input.smsOptIn,
      message: input.message,
      created_at: new Date().toISOString(),
    }

    // 2) The email is a courtesy copy to the studio inbox. It never blocks
    //    the request and its outcome is reported honestly.
    const notifyTo = process.env.RESEND_NOTIFY_TO || QUOTE_INBOX_EMAIL
    let emailed = false
    if (notifyTo) {
      emailed = await sendEmail({
        to: notifyTo,
        subject: `New quote request from ${input.name}`,
        html: [
          '<div style="font-family:Helvetica,Arial,sans-serif;color:#111;max-width:560px">',
          '<h2 style="margin:0 0 16px;font-size:20px">New quote request</h2>',
          `<p style="margin:0 0 12px"><strong>Name:</strong> ${escapeHtml(input.name)}</p>`,
          `<p style="margin:0 0 12px"><strong>Email:</strong> ${escapeHtml(input.email)}</p>`,
          `<p style="margin:0 0 12px"><strong>Phone:</strong> ${escapeHtml(input.phone || 'Not given')}</p>`,
          `<p style="margin:0 0 12px"><strong>SMS opt-in:</strong> ${input.smsOptIn ? 'Yes' : 'No'}</p>`,
          `<p style="margin:0 0 12px"><strong>Message:</strong></p>`,
          `<p style="margin:0 0 24px;white-space:pre-wrap;border-left:3px solid #ED3327;padding-left:12px">${escapeHtml(
            input.message,
          )}</p>`,
          '<p style="margin:0;color:#666;font-size:12px">Saved to the studio\'s quote requests. Reply directly to this email to answer.</p>',
          '</div>',
        ].join(''),
      })
    }

    return c.json({ ...saved, emailed }, 201)
  } catch (err) {
    console.error('[quote] create failed', err)
    return c.json({ error: 'Could not send your request. Please email the studio directly.' }, 500)
  }
})

function escapeHtml(value: string) {
  return value
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
}

export default app