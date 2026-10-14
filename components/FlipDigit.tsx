'use client'

import { useEffect, useRef, useState } from 'react'
import styles from './FlipDigit.module.css'

/** Must match the flip animations in FlipDigit.module.css. */
const FLIP_MS = 450

/** True when a flip would actually be seen: tab visible, digit on screen, motion allowed. */
function canFlip(el: HTMLElement | null) {
  if (!el || document.visibilityState !== 'visible') return false
  if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) return false
  const r = el.getBoundingClientRect()
  return r.bottom > 0 && r.top < window.innerHeight && r.right > 0 && r.left < window.innerWidth
}

/**
 * A single countdown character. When `value` changes, the previous face
 * flips down and fades while the new one flips in (FlipDigit.module.css).
 *
 * - The current value is always rendered; the flap is only an overlay.
 * - At most one flap at a time: a new value replaces the active flap.
 * - The flap is removed after FLIP_MS or on animationend, whichever comes
 *   first, so it can never get stuck if its animation doesn't run.
 * - Hidden tab, off-screen or prefers-reduced-motion: the digit just swaps.
 * - The "-" placeholder shown before mount never flips.
 */
export default function FlipDigit({ value }: { value: string }) {
  const rootRef = useRef<HTMLSpanElement>(null)
  const last = useRef(value)
  const counter = useRef(0) // only ever increases, so flap keys never repeat
  const timer = useRef<number | undefined>(undefined)
  const [flap, setFlap] = useState<{ char: string; id: number } | null>(null)

  useEffect(() => {
    const prev = last.current
    last.current = value
    if (prev === value) return
    window.clearTimeout(timer.current)
    if (prev === '-' || !canFlip(rootRef.current)) {
      setFlap(null)
      return
    }
    counter.current += 1
    const id = counter.current
    setFlap({ char: prev, id })
    timer.current = window.setTimeout(() => setFlap((f) => (f?.id === id ? null : f)), FLIP_MS)
  }, [value])

  useEffect(() => () => window.clearTimeout(timer.current), [])

  const endFlap = (id: number) => {
    window.clearTimeout(timer.current)
    setFlap((f) => (f?.id === id ? null : f))
  }

  return (
    <span ref={rootRef} className={styles.digit}>
      {/* Re-keyed per flip so its flip-in restarts; namespaced so it never collides with the flap's key. */}
      <span key={flap ? `face-${flap.id}` : 'face'} className={`${styles.face} ${flap ? styles.in : ''}`}>
        {value}
      </span>
      {flap && (
        <span
          key={`flap-${flap.id}`}
          className={styles.flap}
          onAnimationEnd={(e) => e.target === e.currentTarget && endFlap(flap.id)}
          aria-hidden="true"
        >
          {flap.char}
        </span>
      )}
    </span>
  )
}
