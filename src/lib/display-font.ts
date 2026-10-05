export const DISPLAY_FONT_SPEC = '700 condensed 1em "Instrument Sans Variable"'

export function whenDisplayFontReady(): Promise<void> {
  if (typeof document === 'undefined') return Promise.resolve()
  try {
    if (document.fonts.check(DISPLAY_FONT_SPEC)) return Promise.resolve()
  } catch {
    return Promise.resolve()
  }
  return document.fonts.load(DISPLAY_FONT_SPEC).then(
    () => undefined,
    () => undefined,
  )
}
