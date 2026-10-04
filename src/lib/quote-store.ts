import { create } from 'zustand'
import { postJson, getJson } from '@/lib/api'

export type QuoteStatus = 'idle' | 'submitting' | 'success' | 'error'

export type QuoteResult = {
  id: string
  name: string
  email: string
  phone?: string
  smsOptIn?: boolean
  message: string
  created_at: string
}

export type SchedulingInfo = { connected: boolean; url: string | null }

type QuoteState = {
  status: QuoteStatus
  error: string | null
  result: QuoteResult | null
  scheduling: SchedulingInfo
  schedulingLoaded: boolean
  submit: (input: {
    name: string
    email: string
    message: string
    phone?: string
    smsOptIn?: boolean
  }) => Promise<boolean>
  loadScheduling: () => Promise<void>
  reset: () => void
}

/**
 * The one store for quote-submission state. The submit action owns the
 * lifecycle: it flips to a pending state immediately, performs the request
 * (with the api helper's single retry), and rolls back to the form on
 * failure so every subscriber renders the same truth. No sibling callbacks.
 */
export const useQuoteStore = create<QuoteState>((set) => ({
  status: 'idle',
  error: null,
  result: null,
  scheduling: { connected: false, url: null },
  schedulingLoaded: false,

  submit: async (input) => {
    set({ status: 'submitting', error: null, result: null })
    try {
      const result = await postJson<QuoteResult>('/api/quote', input)
      set({ status: 'success', result })
      return true
    } catch (err) {
      const message =
        err instanceof Error && err.message ? err.message : 'Something went wrong sending your request.'
      // Roll back to the form: the caller keeps its field values and shows
      // this inline message.
      set({ status: 'error', error: message })
      return false
    }
  },

  loadScheduling: async () => {
    try {
      const scheduling = await getJson<SchedulingInfo>('/api/quote/scheduling')
      set({ scheduling, schedulingLoaded: true })
    } catch {
      // The email path stands alone when the scheduling check cannot be
      // made - never a placeholder or an error surface on the page.
      set({ scheduling: { connected: false, url: null }, schedulingLoaded: true })
    }
  },

  reset: () => set({ status: 'idle', error: null, result: null }),
}))