'use client'

import { useRef } from 'react'
import { useTypewriter, type Segment, type TypeStep } from '@/hooks/useTypewriter'
import { Caret } from './Typewriter'

/*
  Inicio's "Tech needs ___" line. Starts as the original "Tech needs WIT",
  tries a few fillers, and lands on "Tech needs you!".

  - Server HTML (and no-JS) shows "Tech needs WIT".
  - Plays once per session; afterwards, and under prefers-reduced-motion,
    "Tech needs you!" shows immediately.
  - Layout: an invisible copy of the final line sizes the box; the animated
    line sits on top of it, left-aligned and unwrapped, so longer fillers run
    past the right edge instead of moving anything.
*/

const PAUSE = 700
const PREFIX: Segment = { text: 'Tech needs ' }
const WIT: Segment = { text: 'WIT', tone: 'accent' }
const FINAL: Segment[] = [PREFIX, { text: 'you!', tone: 'accent' }]

const swap = (from: string, to: Segment): TypeStep[] => [
  { erase: from.length },
  { pause: 250 },
  { type: to.text, tone: to.tone },
  { pause: PAUSE },
]

const STEPS: TypeStep[] = [
  { pause: 900 },
  ...swap('WIT', { text: 'coffee', tone: 'muted' }),
  ...swap('coffee', WIT),
  ...swap('WIT', { text: 'a rubber duck', tone: 'muted' }),
  ...swap('a rubber duck', WIT),
  ...swap('WIT', { text: 'fewer bugs', tone: 'muted' }),
  { erase: 'fewer bugs'.length },
  { pause: 250 },
  { type: 'you!', tone: 'accent' },
]

const ACCENT: React.CSSProperties = {
  background: 'linear-gradient(135deg, #c6c8ee 0%, #9066d2 45%, #ff5795 100%)',
  WebkitBackgroundClip: 'text',
  backgroundClip: 'text',
  color: 'transparent',
}

function Line({ segments }: { segments: Segment[] }) {
  return segments.map((s, i) => (
    <span key={i} style={s.tone === 'accent' ? ACCENT : undefined} className={s.tone === 'muted' ? 'text-peri/55' : undefined}>
      {s.text}
    </span>
  ))
}

export default function HeroTypewriter() {
  const ref = useRef<HTMLParagraphElement>(null)
  const { segments, done, started } = useTypewriter({
    ref,
    initial: [PREFIX, WIT],
    steps: STEPS,
    final: FINAL,
    onceKey: 'wit-hero-typed',
  })

  return (
    <p
      ref={ref}
      lang="en"
      className="relative m-0 mb-10 whitespace-nowrap font-light italic uppercase tracking-[0.35em] text-white/88"
      style={{ fontSize: 'clamp(11px, 1.2vw, 15px)' }}
    >
      <span className="sr-only">Tech needs you!</span>
      <span className="invisible" aria-hidden="true">
        <Line segments={FINAL} />
      </span>
      <span className="absolute top-0 left-0" aria-hidden="true">
        <Line segments={segments} />
        {/* No caret when the line was shown finished from the start. */}
        {(started || !done) && <Caret finished={done} />}
      </span>
    </p>
  )
}
