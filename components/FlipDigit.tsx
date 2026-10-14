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

/** One clipped half of a split-flap card, showing its half of `char`. */
function Half({ char, part, className = '', children }: { char: string; part: 'top' | 'bottom'; className?: string; children?: React.ReactNode }) {
  return (
    <span className={`${styles.half} ${styles[part]} ${className}`}>
      <span className={styles.glyph}>{char}</span>
      {children}
    </span>
  )
}

/**
 * A single split-flap countdown character (FlipDigit.module.css). When
 * `value` changes, the old top half flips down onto the new digit, then the
 * new bottom half flips down into place.
 *
 * - With no flip running, both static halves show the current value; the
 *   flaps are overlays that exist only during a flip.
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
      {/* prefers-reduced-motion: CSS shows this plain glyph instead of the card. */}
      <span className={styles.plain}>{value}</span>
      <span className={styles.card} aria-hidden="true">
        {/* Static halves: the new top shows at once; the old bottom stays until the bottom flap lands. */}
        <Half char={value} part="top" />
        <Half char={flap ? flap.char : value} part="bottom" />
        {flap && (
          <>
            <Half key={`flap-top-${flap.id}`} char={flap.char} part="top" className={styles.flapTop}>
              <span className={styles.shade} />
            </Half>
            {/* The last animation to finish; ends the flip (the timeout is the fallback). */}
            <span
              key={`flap-bottom-${flap.id}`}
              className={`${styles.half} ${styles.bottom} ${styles.flapBottom}`}
              onAnimationEnd={(e) => e.target === e.currentTarget && endFlap(flap.id)}
            >
              <span className={styles.glyph}>{value}</span>
              <span className={styles.shade} />
            </span>
          </>
        )}
      </span>
    </span>
  )
}
