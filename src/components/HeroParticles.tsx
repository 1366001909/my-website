import {
  useCallback,
  useLayoutEffect,
  useRef,
  type RefObject,
} from 'react'

type HeroParticlesProps = {
  containerRef: RefObject<HTMLElement | null>
}

/**
 * Static particle field: one draw per schedule (resize / theme / mount).
 * Uses requestAnimationFrame only to coalesce callbacks, not as an animation loop.
 */
export function HeroParticles({ containerRef }: HeroParticlesProps) {
  const canvasRef = useRef<HTMLCanvasElement>(null)
  const rafRef = useRef<number | null>(null)

  const draw = useCallback(() => {
    const container = containerRef.current
    const canvas = canvasRef.current
    if (!container || !canvas) return

    const cssW = container.clientWidth
    const cssH = container.clientHeight
    if (cssW <= 0 || cssH <= 0) return

    const dpr = Math.min(window.devicePixelRatio ?? 1, 2)
    const pxW = Math.max(1, Math.floor(cssW * dpr))
    const pxH = Math.max(1, Math.floor(cssH * dpr))

    canvas.style.width = `${cssW}px`
    canvas.style.height = `${cssH}px`
    canvas.width = pxW
    canvas.height = pxH

    const ctx = canvas.getContext('2d', { alpha: true })
    if (!ctx) {
      canvas.style.display = 'none'
      return
    }

    ctx.setTransform(1, 0, 0, 1, 0, 0)
    ctx.clearRect(0, 0, pxW, pxH)
    ctx.scale(dpr, dpr)

    const count = Math.min(140, Math.max(36, Math.floor(cssW / 10)))
    const accent =
      getComputedStyle(document.documentElement)
        .getPropertyValue('--accent')
        .trim() || '#aa3bff'

    for (let i = 0; i < count; i += 1) {
      const x = Math.random() * cssW
      const y = Math.random() * cssH
      const r = Math.random() * 1.1 + 0.35
      ctx.globalAlpha = 0.1 + Math.random() * 0.22
      ctx.fillStyle = accent
      ctx.beginPath()
      ctx.arc(x, y, r, 0, Math.PI * 2)
      ctx.fill()
    }
    ctx.globalAlpha = 1
    canvas.style.display = ''
    canvas.style.visibility = 'visible'
  }, [containerRef])

  useLayoutEffect(() => {
    const scheduleDraw = () => {
      if (rafRef.current !== null) {
        cancelAnimationFrame(rafRef.current)
      }
      rafRef.current = requestAnimationFrame(() => {
        rafRef.current = null
        try {
          draw()
        } catch {
          const canvas = canvasRef.current
          if (canvas) {
            canvas.style.display = 'none'
          }
        }
      })
    }

    scheduleDraw()

    const el = containerRef.current
    let ro: ResizeObserver | undefined
    if (el && typeof ResizeObserver !== 'undefined') {
      ro = new ResizeObserver(scheduleDraw)
      ro.observe(el)
    }

    window.addEventListener('resize', scheduleDraw)

    const mo = new MutationObserver(scheduleDraw)
    mo.observe(document.documentElement, {
      attributes: true,
      attributeFilter: ['data-theme'],
    })

    return () => {
      window.removeEventListener('resize', scheduleDraw)
      ro?.disconnect()
      mo.disconnect()
      if (rafRef.current !== null) {
        cancelAnimationFrame(rafRef.current)
        rafRef.current = null
      }
    }
  }, [containerRef, draw])

  return (
    <canvas
      ref={canvasRef}
      className="pointer-events-none absolute inset-0 z-[1] h-full w-full"
      aria-hidden="true"
    />
  )
}
