'use client'

import { useEffect, useRef, useState } from 'react'
import styles from './FlipDigit.module.css'

/**
 * A single countdown character. When `value` changes, the previous face
 * flips down and fades while the new one fades in (FlipDigit.module.css).
 * The "-" placeholder shown before mount never flips, so the first real
 * value just appears.
 */
export default function FlipDigit({ value }: { value: string }) {
  const last = useRef(value)
  const [flap, setFlap] = useState<{ char: string; id: number } | null>(null)

  useEffect(() => {
    const prev = last.current
    last.current = value
    if (prev === value || prev === '-') return
    setFlap((f) => ({ char: prev, id: (f?.id ?? 0) + 1 }))
  }, [value])

  return (
    <span className={styles.digit}>
      <span key={value} className={`${styles.face} ${flap ? styles.in : ''}`}>
        {value}
      </span>
      {flap && (
        <span key={flap.id} className={styles.flap} onAnimationEnd={() => setFlap(null)} aria-hidden="true">
          {flap.char}
        </span>
      )}
    </span>
  )
}
