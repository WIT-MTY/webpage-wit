'use client'

import { useEffect, useRef } from 'react'
import styles from './HeroTypewriter.module.css'

/*
  Inicio's "Tech needs ___" line: types "Tech needs WIT", tries a couple of
  fillers, and lands on "Tech needs you!".

  - Text is written straight to the DOM (textContent / classList), so typing
    causes no React re-renders. The spans below have no React children, so
    React never overwrites what the timeline wrote.
  - Plays once per session. Afterwards, and under prefers-reduced-motion,
    "Tech needs you!" is written immediately, with no caret.
  - Stops while the tab is hidden and resumes where it left off.
  - Layout: full width, centered, so the text grows from the center while
    typing and "Tech needs you!" ends exactly centered. A fixed min-height
    (one line on desktop, two on mobile, where it may wrap) keeps anything
    below from moving.
*/

/** Every timing in the animation, in ms. Tune here. */
const TIMING = {
  /** Step 1: caret blinks alone before anything is typed. */
  START_MS: 400,
  /** Step 2: "Tech needs ", per character. */
  TYPE_FAST_MS: 55,
  /** Random ± added to every per-character delay. */
  JITTER_MS: 20,
  /** Step 3: "WIT", per character. */
  TYPE_SLOW_MS: 140,
  /** Step 3: hold on "Tech needs WIT", caret blinking. */
  HOLD_WIT_MS: 1400,
  /** Step 4: how long "WIT" stays highlighted before it is deleted. */
  SELECT_WIT_MS: 350,
  /** Step 5: pause before "coffee". */
  DELETE_PAUSE_COFFEE_MS: 250,
  TYPE_COFFEE_MS: 70,
  HOLD_COFFEE_MS: 700,
  SELECT_COFFEE_MS: 250,
  /** Step 6: pause before "fewer bugs". */
  DELETE_PAUSE_BUGS_MS: 200,
  TYPE_BUGS_MS: 60,
  HOLD_BUGS_MS: 800,
  SELECT_BUGS_MS: 250,
  /** Step 7: suspense beat, caret blinking alone. */
  SUSPENSE_MS: 900,
  /** Step 8: "you", per character. */
  TYPE_YOU_MS: 130,
  /** Step 8: gap between "you" and the "!". */
  BANG_GAP_MS: 180,
  /** Step 9: caret keeps blinking this long, then fades out. */
  FINAL_HOLD_MS: 2500,
}

const FINAL_TEXT = 'Tech needs you!'
/** Must match the tracking-[…] class on the line; cancels the last character's trailing spacing. */
const TRACKING = '0.35em'
const ONCE_KEY = 'wit-hero-typed'

type Els = { prefix: HTMLSpanElement; sel: HTMLSpanElement; word: HTMLSpanElement; bang: HTMLSpanElement; caret: HTMLSpanElement }
/** One timeline step: wait `wait` ms, then `run`. */
type Op = { wait: number; run?: (els: Els) => void }

const jitter = (ms: number) => Math.max(0, ms + (Math.random() * 2 - 1) * TIMING.JITTER_MS)

const idle = (on: boolean): Op => ({ wait: 0, run: (e) => e.caret.classList.toggle(styles.idle, on) })
const pause = (ms: number): Op[] => [idle(true), { wait: ms }]

const type = (target: 'prefix' | 'word' | 'bang', text: string, perChar: number): Op[] => [
  idle(false),
  ...[...text].map((ch) => ({ wait: jitter(perChar), run: (e: Els) => void (e[target].textContent += ch) })),
]

const tone = (t: 'accent' | 'muted'): Op => ({
  wait: 0,
  run: (e) => {
    e.word.classList.toggle(styles.accent, t === 'accent')
    e.word.classList.toggle(styles.muted, t === 'muted')
  },
})

/** Highlight the word like a selection, then delete it in one go. */
const selectAndDelete = (ms: number): Op[] => [
  idle(false),
  { wait: 0, run: (e) => e.sel.classList.add(styles.selected) },
  {
    wait: ms,
    run: (e) => {
      e.word.textContent = ''
      e.sel.classList.remove(styles.selected)
    },
  },
]

const T = TIMING
const TIMELINE: Op[] = [
  ...pause(T.START_MS),
  ...type('prefix', 'Tech needs ', T.TYPE_FAST_MS),
  tone('accent'),
  ...type('word', 'WIT', T.TYPE_SLOW_MS),
  ...pause(T.HOLD_WIT_MS),
  ...selectAndDelete(T.SELECT_WIT_MS),
  ...pause(T.DELETE_PAUSE_COFFEE_MS),
  tone('muted'),
  ...type('word', 'coffee', T.TYPE_COFFEE_MS),
  ...pause(T.HOLD_COFFEE_MS),
  ...selectAndDelete(T.SELECT_COFFEE_MS),
  ...pause(T.DELETE_PAUSE_BUGS_MS),
  ...type('word', 'fewer bugs', T.TYPE_BUGS_MS),
  ...pause(T.HOLD_BUGS_MS),
  ...selectAndDelete(T.SELECT_BUGS_MS),
  ...pause(T.SUSPENSE_MS),
  tone('accent'),
  ...type('word', 'you', T.TYPE_YOU_MS),
  { wait: T.BANG_GAP_MS, run: (e) => void (e.bang.textContent = '!') },
  { wait: 0, run: (e) => e.bang.classList.add(styles.pop) },
  ...pause(T.FINAL_HOLD_MS),
  { wait: 0, run: (e) => e.caret.classList.replace(styles.idle, styles.gone) },
]

function readPlayed() {
  try {
    return window.sessionStorage.getItem(ONCE_KEY) === '1'
  } catch {
    return false
  }
}

function markPlayed() {
  try {
    window.sessionStorage.setItem(ONCE_KEY, '1')
  } catch {
    // Storage blocked: it just plays again next time.
  }
}

/** Straight to "Tech needs you!", no caret, no motion. */
function showFinal(e: Els) {
  e.prefix.textContent = 'Tech needs '
  e.word.textContent = 'you'
  e.word.className = styles.accent
  e.bang.textContent = '!'
  e.caret.style.display = 'none'
}

export default function HeroTypewriter() {
  const rootRef = useRef<HTMLParagraphElement>(null)
  const prefixRef = useRef<HTMLSpanElement>(null)
  const selRef = useRef<HTMLSpanElement>(null)
  const wordRef = useRef<HTMLSpanElement>(null)
  const bangRef = useRef<HTMLSpanElement>(null)
  const caretRef = useRef<HTMLSpanElement>(null)

  useEffect(() => {
    const root = rootRef.current
    const els = {
      prefix: prefixRef.current,
      sel: selRef.current,
      word: wordRef.current,
      bang: bangRef.current,
      caret: caretRef.current,
    }
    if (!root || !els.prefix || !els.sel || !els.word || !els.bang || !els.caret) return
    const e = els as Els

    if (window.matchMedia('(prefers-reduced-motion: reduce)').matches || readPlayed()) {
      showFinal(e)
      return
    }

    let i = 0
    let timer: number | undefined
    let dueAt = 0
    /** Time left on the current wait when the tab was hidden. */
    let remaining: number | null = null
    let started = false

    const schedule = (ms: number) => {
      dueAt = performance.now() + ms
      timer = window.setTimeout(next, ms)
    }
    // Runs every zero-wait op right away, then waits for the next timed one.
    function next() {
      timer = undefined
      ops[i++].run?.(e)
      while (i < ops.length && ops[i].wait === 0) ops[i++].run?.(e)
      if (i < ops.length) schedule(ops[i].wait)
      else stopListening()
    }
    // `next` runs ops[i] after its wait; a leading dummy op makes the first wait apply.
    const ops: Op[] = [{ wait: 0 }, ...TIMELINE]

    const onVisibility = () => {
      if (!started) return
      if (document.visibilityState === 'hidden') {
        if (timer === undefined) return
        window.clearTimeout(timer)
        timer = undefined
        remaining = Math.max(0, dueAt - performance.now())
      } else if (remaining !== null) {
        const ms = remaining
        remaining = null
        dueAt = performance.now() + ms
        timer = window.setTimeout(next, ms)
      }
    }

    const io = new IntersectionObserver(
      ([entry]) => {
        if (!entry.isIntersecting || started) return
        started = true
        io.disconnect()
        markPlayed()
        if (document.visibilityState === 'visible') next()
        else remaining = 0
      },
      { threshold: 0.5 },
    )
    io.observe(root)
    document.addEventListener('visibilitychange', onVisibility)

    function stopListening() {
      io.disconnect()
      document.removeEventListener('visibilitychange', onVisibility)
    }
    return () => {
      window.clearTimeout(timer)
      stopListening()
    }
  }, [])

  return (
    <p
      ref={rootRef}
      lang="en"
      className="m-0 mb-10 min-h-[3.2em] w-full text-center font-light italic uppercase leading-[1.6] tracking-[0.35em] text-white/88 sm:min-h-[1.6em] sm:whitespace-nowrap"
      style={{ fontSize: 'clamp(11px, 1.2vw, 15px)' }}
    >
      <span className="sr-only">{FINAL_TEXT}</span>
      <span aria-hidden="true">
        {/* The last character's tracking sits on its right; the negative margin cancels it so the glyphs center. */}
        <span style={{ marginRight: `-${TRACKING}` }}>
          <span ref={prefixRef} />
          <span ref={selRef}>
            <span ref={wordRef} />
          </span>
          <span ref={bangRef} className={`${styles.bang} ${styles.accent}`} />
        </span>
        {/* Zero-width box (bar drawn by a pseudo-element), so it never moves the text. */}
        <span ref={caretRef} className={`${styles.caret} ${styles.idle}`} />
      </span>
    </p>
  )
}
