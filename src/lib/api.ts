/**
 * The one fetch wrapper for every client call: on a 5xx or network failure
 * it retries ONCE after ~1.5s (the database may be waking on first
 * interaction), and only then rejects with the server's `error` string when
 * the body carries one. Callers render a pending state during the retry and
 * a designed error state if it still fails.
 */
export class ApiError extends Error {
  status: number
  constructor(message: string, status: number) {
    super(message)
    this.name = 'ApiError'
    this.status = status
  }
}

const RETRY_DELAY_MS = 1500

const sleep = (ms: number) => new Promise((resolve) => setTimeout(resolve, ms))

async function parseError(res: Response): Promise<string> {
  try {
    const body = (await res.json()) as { error?: string }
    if (body && typeof body.error === 'string' && body.error.length > 0) return body.error
  } catch {
    // Not JSON - fall through to the status text.
  }
  return `Request failed (${res.status})`
}

/**
 * POST JSON and parse a JSON answer. Retries once on 5xx/network failure
 * before rejecting with an ApiError carrying a UI-ready message.
 */
export async function postJson<T>(url: string, body: unknown): Promise<T> {
  const send = () =>
    fetch(url, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(body),
    })

  let res: Response
  try {
    res = await send()
  } catch {
    // Network-level failure (cold start, offline): one retry.
    await sleep(RETRY_DELAY_MS)
    try {
      res = await send()
    } catch {
      throw new ApiError('Could not reach the studio. Check your connection and try again.', 0)
    }
  }

  if (res.status >= 500) {
    await sleep(RETRY_DELAY_MS)
    try {
      res = await send()
    } catch {
      throw new ApiError('Could not reach the studio. Check your connection and try again.', 0)
    }
  }

  if (!res.ok) throw new ApiError(await parseError(res), res.status)
  return (await res.json()) as T
}

/** GET JSON with the same single-retry resilience. */
export async function getJson<T>(url: string): Promise<T> {
  const send = () => fetch(url, { headers: { 'Content-Type': 'application/json' } })

  let res: Response
  try {
    res = await send()
  } catch {
    await sleep(RETRY_DELAY_MS)
    try {
      res = await send()
    } catch {
      throw new ApiError('Could not reach the studio. Check your connection and try again.', 0)
    }
  }

  if (res.status >= 500) {
    await sleep(RETRY_DELAY_MS)
    try {
      res = await send()
    } catch {
      throw new ApiError('Could not reach the studio. Check your connection and try again.', 0)
    }
  }

  if (!res.ok) throw new ApiError(await parseError(res), res.status)
  return (await res.json()) as T
}