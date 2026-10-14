'use client'

import { useEffect, useRef } from 'react'
import styles from './RingPulse.module.css'

/** Wraps a pill button: a faint gradient ring that flashes three times the first time it scrolls into view. */
export default function RingPulse({ children }: { children: React.ReactNode }) {
  const ref = useRef<HTMLSpanElement>(null)

  useEffect(() => {
    const el = ref.current
    if (!el || window.matchMedia('(prefers-reduced-motion: reduce)').matches) return
    const io = new IntersectionObserver(
      ([entry]) => {
        if (!entry.isIntersecting) return
        io.disconnect()
        el.classList.add(styles.play)
      },
      { threshold: 1 },
    )
    io.observe(el)
    return () => io.disconnect()
  }, [])

  return (
    <span ref={ref} className={styles.ring}>
      {children}
    </span>
  )
}
