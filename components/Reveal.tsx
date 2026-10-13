'use client'

import { useEffect, useRef } from 'react'
import styles from './Reveal.module.css'

/**
 * Fades its content up the first time it scrolls into view. `delay` (ms)
 * staggers siblings.
 *
 * Only elements that start below the fold animate: anything already on
 * screen when the page loads stays put, so nothing visible blinks out on
 * hydration. With `onLoad`, on-screen elements get a CSS entrance from the
 * first paint instead. Classes are toggled on the DOM directly; no re-renders.
 * prefers-reduced-motion: no scroll reveal, and the entrance is cut to its end.
 */
export default function Reveal({
  children,
  delay = 0,
  onLoad = false,
  className = '',
}: {
  children: React.ReactNode
  delay?: number
  /** Also animate when already on screen at load (a CSS entrance from first paint). */
  onLoad?: boolean
  className?: string
}) {
  const ref = useRef<HTMLDivElement>(null)

  useEffect(() => {
    const el = ref.current
    if (!el || window.matchMedia('(prefers-reduced-motion: reduce)').matches) return
    if (el.getBoundingClientRect().top < window.innerHeight) return

    el.classList.remove(styles.enter)
    el.classList.add(styles.hidden)
    const io = new IntersectionObserver(
      ([entry]) => {
        if (!entry.isIntersecting) return
        io.disconnect()
        el.style.setProperty('--reveal-delay', `${delay}ms`)
        el.classList.add(styles.shown)
        el.classList.remove(styles.hidden)
      },
      { threshold: 0.15 },
    )
    io.observe(el)
    return () => io.disconnect()
  }, [delay])

  return (
    <div
      ref={ref}
      className={`${onLoad ? styles.enter : ''} ${className}`}
      style={onLoad ? ({ '--reveal-delay': `${delay}ms` } as React.CSSProperties) : undefined}
    >
      {children}
    </div>
  )
}
