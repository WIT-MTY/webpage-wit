'use client'

import { useEffect, useState, type RefObject } from 'react'

/** A run of text in one style. `tone` is whatever the caller maps to a class. */
export type Segment = { text: string; tone?: string }

/** One step of a typing script. */
export type TypeStep = { type: string; tone?: string } | { erase: number } | { pause: number }

type Op = { add: string; tone?: string } | { del: true } | { wait: number }

/** Natural per-character delay, in ms. */
const CHAR_MIN = 40
const CHAR_MAX = 90
/** Text updates at most ~15 times a second: characters due sooner are batched into one update. */
const MIN_FRAME = 67

const charDelay = () => CHAR_MIN + Math.random() * (CHAR_MAX - CHAR_MIN)

function flatten(steps: TypeStep[]): Op[] {
  const ops: Op[] = []
  for (const s of steps) {
    if ('type' in s) for (const ch of s.type) ops.push({ add: ch, tone: s.tone })
    else if ('erase' in s) for (let i = 0; i < s.erase; i++) ops.push({ del: true })
    else ops.push({ wait: s.pause })
  }
  return ops
}

function apply(segs: Segment[], op: Op) {
  if ('add' in op) {
    const last = segs[segs.length - 1]
    if (last && last.tone === op.tone) last.text += op.add
    else segs.push({ text: op.add, tone: op.tone })
  } else if ('del' in op) {
    const last = segs[segs.length - 1]
    if (!last) return
    last.text = last.text.slice(0, -1)
    if (!last.text) segs.pop()
  }
}

const clone = (segs: Segment[]) => segs.map((s) => ({ ...s }))

function readPlayed(key: string) {
  try {
    return window.sessionStorage.getItem(key) === '1'
  } catch {
    return false
  }
}

function markPlayed(key: string) {
  try {
    window.sessionStorage.setItem(key, '1')
  } catch {
    // Storage blocked: it just plays again next time.
  }
}

/**
 * Plays a typing script once `ref` scrolls into view.
 *
 * - Renders `initial` on the server and until it starts, so there is no
 *   hydration mismatch.
 * - prefers-reduced-motion, or `onceKey` already set in sessionStorage: jumps
 *   straight to `final`, no motion.
 * - The timer stops while the tab is hidden and picks up where it left off.
 */
export function useTypewriter({
  ref,
  initial,
  steps,
  final,
  onceKey,
}: {
  ref: RefObject<Element | null>
  initial: Segment[]
  steps: TypeStep[]
  /** Where the script ends. Shown directly when motion is skipped. */
  final: Segment[]
  /** sessionStorage key: when set, the script plays once per session. */
  onceKey?: string
}) {
  const [segments, setSegments] = useState<Segment[]>(initial)
  const [done, setDone] = useState(false)
  const [started, setStarted] = useState(false)

  useEffect(() => {
    const skip =
      window.matchMedia('(prefers-reduced-motion: reduce)').matches || (onceKey ? readPlayed(onceKey) : false)
    if (skip) {
      setSegments(clone(final))
      setDone(true)
      return
    }

    const ops = flatten(steps)
    const segs = clone(initial)
    let i = 0
    let pending: Op[] = []
    let timer: number | undefined
    let running = false

    const schedule = (ms: number) => {
      timer = window.setTimeout(step, ms)
    }
    function step() {
      timer = undefined
      if (pending.length) {
        pending.forEach((op) => apply(segs, op))
        pending = []
        setSegments(clone(segs))
      }
      if (i >= ops.length) {
        setDone(true)
        cleanup()
        return
      }
      const op = ops[i]
      if ('wait' in op) {
        i++
        schedule(op.wait)
        return
      }
      let delay = 0
      while (i < ops.length && !('wait' in ops[i]) && delay < MIN_FRAME) {
        delay += charDelay()
        pending.push(ops[i++])
      }
      schedule(delay)
    }

    const onVisibility = () => {
      if (!running) return
      if (document.visibilityState === 'hidden') {
        window.clearTimeout(timer)
        timer = undefined
      } else if (timer === undefined) {
        schedule(300)
      }
    }

    const el = ref.current
    const io = new IntersectionObserver(
      ([entry]) => {
        if (!entry.isIntersecting || running) return
        running = true
        io.disconnect()
        if (onceKey) markPlayed(onceKey)
        setStarted(true)
        if (document.visibilityState === 'visible') step()
      },
      { threshold: 0.5 },
    )
    if (el) io.observe(el)
    document.addEventListener('visibilitychange', onVisibility)

    function cleanup() {
      io.disconnect()
      document.removeEventListener('visibilitychange', onVisibility)
    }
    return () => {
      window.clearTimeout(timer)
      cleanup()
    }
    // Runs once: the script is static per component, and re-running it mid-play would restart it.
  }, [])

  return { segments, done, started }
}

/** Total characters in a list of segments. */
export const lengthOf = (segs: Segment[]) => segs.reduce((n, s) => n + s.text.length, 0)
