'use client'

import { useEffect, useRef } from 'react'
import { onceInView } from '@/lib/inView'

/*
  Counts up to a number when it scrolls into view. Used for the WitCode
  metrics on Inicio and on WitCode.

  - The server HTML holds the final value, so no-JS shows it as-is.
  - Only the digits count; a prefix or suffix ("+", "%", " años") is its own
    static text. The digits are written straight to the DOM; no re-renders.
  - Starts once, when 40% of it is on screen. Ease-out cubic.
  - prefers-reduced-motion: the final number, no count.
  - Non-numeric values ("—", "TBD") are printed as-is, so you can pass
    whatever is in the data file without checking first.
*/
export default function CountUp({
  value,
  duration = 1100,
  className = '',
}: {
  value: string
  duration?: number
  className?: string
}) {
  const numRef = useRef<HTMLSpanElement>(null)
  const match = value.match(/^(\D*)(\d[\d.,]*)(.*)$/)
  const [, prefix = '', digits = '', suffix = ''] = match ?? []
  const target = match ? parseFloat(digits.replace(/,/g, '')) : NaN

  useEffect(() => {
    const el = numRef.current
    if (!el || !Number.isFinite(target)) return
    if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) return

    let raf = 0
    const stop = onceInView(
      el,
      () => {
        const start = performance.now()
        const tick = (now: number) => {
          const p = Math.min(1, (now - start) / duration)
          const eased = 1 - Math.pow(1 - p, 3)
          el.textContent = p < 1 ? Math.round(target * eased).toLocaleString('es-MX') : digits
          if (p < 1) raf = requestAnimationFrame(tick)
        }
        el.textContent = '0'
        raf = requestAnimationFrame(tick)
      },
      0.4,
    )
    return () => {
      stop()
      cancelAnimationFrame(raf)
      el.textContent = digits
    }
  }, [target, digits, duration])

  if (!match) return <span className={className}>{value}</span>

  return (
    <span className={className}>
      {prefix}
      <span ref={numRef}>{digits}</span>
      {suffix}
    </span>
  )
}
