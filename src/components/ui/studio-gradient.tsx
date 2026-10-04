import { useEffect, useRef, useState } from 'react'
import {
  buildGradientBackgroundFallback,
  resolveGradientBackgroundConfig,
  type BalsaBackgroundConfig,
} from '@/components/ui/gradient-background'
import { GradientBackgroundRenderer } from '@/components/ui/gradient-background-renderer'

/** How strongly the live shader covers the hero. The CSS stand-in stays solid until WebGL is ready. */
const SHADER_OPACITY = 0.5

/** The Balsa studio field, as a React canvas. A CSS gradient shows until WebGL is ready. */
export function StudioGradient({ config }: { config: BalsaBackgroundConfig }) {
  const rootRef = useRef<HTMLDivElement>(null)
  const canvasRef = useRef<HTMLCanvasElement>(null)
  const [ready, setReady] = useState(false)
  const resolved = resolveGradientBackgroundConfig({ config })
  const fallback = buildGradientBackgroundFallback(resolved.colors, resolved.direction)

  useEffect(() => {
    const root = rootRef.current
    const canvas = canvasRef.current
    if (!root || !canvas) return
    const active = resolveGradientBackgroundConfig({ config })

    let renderer: GradientBackgroundRenderer | undefined
    let frame = 0
    let start = 0
    const paint = () => {
      if (!renderer) return
      const bounds = root.getBoundingClientRect()
      renderer.resize(bounds.width, bounds.height)
      renderer.render(0)
    }

    // Wait one frame so development mode can tear down its extra setup
    // before this canvas takes a WebGL context.
    start = window.requestAnimationFrame(() => {
      start = 0
      try {
        renderer = new GradientBackgroundRenderer(canvas, active, active.colors)
        paint()
        setReady(true)
      } catch {
        setReady(false)
      }
    })

    const observer = new ResizeObserver(() => {
      if (!renderer || frame) return
      frame = window.requestAnimationFrame(() => {
        frame = 0
        paint()
      })
    })
    observer.observe(root)

    return () => {
      observer.disconnect()
      if (start) window.cancelAnimationFrame(start)
      if (frame) window.cancelAnimationFrame(frame)
      renderer?.dispose()
    }
  }, [config])

  return (
    <div
      ref={rootRef}
      data-balsa="gradient-background"
      aria-hidden="true"
      className="pointer-events-none absolute inset-0 z-0 isolate overflow-hidden"
    >
      <div
        className="absolute inset-0 transition-opacity"
        style={{ backgroundImage: fallback, opacity: ready ? 0 : 1 }}
      />
      <canvas
        ref={canvasRef}
        className="absolute inset-0 block size-full transition-opacity"
        style={{ opacity: ready ? SHADER_OPACITY : 0 }}
      />
    </div>
  )
}
