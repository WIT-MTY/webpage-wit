'use client'

import { useRef } from 'react'
import { lengthOf, useTypewriter, type Segment } from '@/hooks/useTypewriter'
import styles from './Typewriter.module.css'

/** Blinking caret. Fades out once `finished`. */
export function Caret({ finished }: { finished: boolean }) {
  return <span className={`${styles.caret} ${finished ? styles.finished : ''}`} aria-hidden="true" />
}

/**
 * Types `text` out once, when it scrolls into view.
 *
 * The full text is always laid out: the part not typed yet is `invisible`,
 * so the line already has its final size and wraps exactly as it will at the
 * end. Zero layout shift, also when it is centered or wraps on mobile.
 *
 * Screen readers get the final text from the sr-only copy; the animated
 * layer is aria-hidden.
 */
export default function Typewriter({
  text,
  tones = {},
  delay = 400,
  className = '',
}: {
  /** The final text, in styled runs. */
  text: Segment[]
  /** tone → class name. */
  tones?: Record<string, string>
  /** Pause before the first character, in ms. */
  delay?: number
  className?: string
}) {
  const ref = useRef<HTMLSpanElement>(null)
  const { segments, done, started } = useTypewriter({
    ref,
    initial: [],
    steps: [{ pause: delay }, ...text.map((s) => ({ type: s.text, tone: s.tone }))],
    final: text,
  })
  const typed = lengthOf(segments)
  const full = text.map((s) => s.text).join('')

  // Split each final run into its typed and not-yet-typed parts.
  let left = typed
  const runs = text.map((s, i) => {
    const shown = s.text.slice(0, Math.max(0, left))
    left -= s.text.length
    return { key: i, tone: s.tone, shown, rest: s.text.slice(shown.length) }
  })
  const caretAt = runs.findIndex((r) => r.rest.length > 0)

  return (
    <span ref={ref} className={className}>
      <span className="sr-only">{full}</span>
      <span aria-hidden="true">
        {runs.map((r, i) => (
          <span key={r.key} className={r.tone ? tones[r.tone] : undefined}>
            {r.shown}
            {i === caretAt && <Caret finished={false} />}
            {r.rest && <span className="invisible">{r.rest}</span>}
          </span>
        ))}
        {caretAt === -1 && !(done && !started) && <Caret finished={done} />}
      </span>
    </span>
  )
}
