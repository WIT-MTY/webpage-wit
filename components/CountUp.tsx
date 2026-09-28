'use client'

import { useEffect, useRef, useState } from 'react'

/*
  Counts up to a number when it scrolls into view. Used for event metrics.

  Non-numeric values ("—", "90%", "TBD") are printed as-is, so you can pass
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
  const ref = useRef<HTMLSpanElement>(null)
  const [shown, setShown] = useState<string>(value)
  const target = parseFloat(value.replace(/[^\d.]/g, ''))
  const numeric = Number.isFinite(target) && /\d/.test(value)
  const suffix = numeric ? value.replace(/[\d.,]/g, '') : ''

  useEffect(() => {
    if (!numeric) {
      setShown(value)
      return
    }
    const reduce = window.matchMedia('(prefers-reduced-motion: reduce)').matches
    if (reduce) {
      setShown(value)
      return
    }
    const el = ref.current
    if (!el) return
    let raf = 0
    const io = new IntersectionObserver(
      (entries) => {
        if (!entries[0].isIntersecting) return
        io.disconnect()
        const start = performance.now()
        const tick = (now: number) => {
          const p = Math.min(1, (now - start) / duration)
          const eased = 1 - Math.pow(1 - p, 3)
          setShown(Math.round(target * eased).toLocaleString('es-MX') + suffix)
          if (p < 1) raf = requestAnimationFrame(tick)
        }
        setShown('0' + suffix)
        raf = requestAnimationFrame(tick)
      },
      { threshold: 0.4 },
    )
    io.observe(el)
    return () => {
      io.disconnect()
      cancelAnimationFrame(raf)
    }
  }, [value, duration, numeric, target, suffix])

  return (
    <span ref={ref} className={className}>
      {shown}
    </span>
  )
}
