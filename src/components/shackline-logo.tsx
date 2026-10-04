import logoRaw from '../../others/SHACKLINE_LOGO.svg?raw'

/**
 * Header wordmark. Black fills become the current text color so the mark
 * stays readable on the dark hero; the brand red stays as drawn.
 * Width is 10em of the Extrafazant nav root, height follows the viewBox.
 */
const LOGO_MARKUP = logoRaw
  .replace(/<svg\b([^>]*)>/, (_match, attrs: string) => {
    const cleaned = attrs.replace(/\swidth="[^"]*"/, '').replace(/\sheight="[^"]*"/, '')
    return `<svg${cleaned} class="ef-logo" aria-hidden="true" focusable="false">`
  })
  .replace(/fill="black"/g, 'fill="currentColor"')

export function ShacklineLogo() {
  return <span className="inline-flex items-center" dangerouslySetInnerHTML={{ __html: LOGO_MARKUP }} />
}
