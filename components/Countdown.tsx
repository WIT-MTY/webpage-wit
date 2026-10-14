'use client'

import { useEffect, useRef, useState, type RefObject } from 'react'
import FlipDigit from './FlipDigit'
import { FLIP_COUNTDOWN } from '@/lib/motion-flags'

export type Parts = { d: number; h: number; m: number; s: number }

/** 'pending' until mounted, 'none' without a target, 'done' once the target has passed. */
export type CountdownState = Parts | 'pending' | 'none' | 'done'

function diff(target: number): Parts | null {
  const ms = target - Date.now()
  if (ms <= 0) return null
  return {
    d: Math.floor(ms / 86_400_000),
    h: Math.floor((ms / 3_600_000) % 24),
    m: Math.floor((ms / 60_000) % 60),
    s: Math.floor((ms / 1000) % 60),
  }
}

/**
 * Ticks once a second, text only. Renders nothing time-based on the server,
 * so there is no hydration mismatch. The interval stops while the tab is
 * hidden, while `ref` is off-screen, when `enabled` is false, and for good
 * once the target passes.
 */
export function useCountdown(target: string | null, ref?: RefObject<Element | null>, enabled = true): CountdownState {
  const [state, setState] = useState<CountdownState>(target ? 'pending' : 'none')

  useEffect(() => {
    if (!target) {
      setState('none')
      return
    }
    if (!enabled) return
    const t = new Date(target).getTime()
    let id: number | undefined
    let onScreen = true

    const stop = () => {
      if (id !== undefined) window.clearInterval(id)
      id = undefined
    }
    const tick = () => {
      const p = diff(t)
      setState(p ?? 'done')
      if (!p) stop()
    }
    const sync = () => {
      if (document.visibilityState === 'visible' && onScreen) {
        if (id !== undefined) return
        tick()
        if (Date.now() < t) id = window.setInterval(tick, 1000)
      } else {
        stop()
      }
    }

    const el = ref?.current
    const io = el
      ? new IntersectionObserver(([entry]) => {
          onScreen = entry.isIntersecting
          sync()
        })
      : null
    if (el && io) io.observe(el)
    document.addEventListener('visibilitychange', sync)
    sync()
    return () => {
      stop()
      io?.disconnect()
      document.removeEventListener('visibilitychange', sync)
    }
  }, [target, ref, enabled])

  return state
}

/**
 * The big four-cell readout: Días, Horas, Min, Seg.
 * variant="flip": every cell shows two fixed-width digits ("--" before
 * mount) and only the digits that change flip (FlipDigit).
 */
export function CountdownCells({
  state,
  label,
  variant = 'plain',
}: {
  state: Parts | 'pending'
  label: string
  variant?: 'plain' | 'flip'
}) {
  const cells: [keyof Parts, string][] = [
    ['d', 'Días'],
    ['h', 'Horas'],
    ['m', 'Min'],
    ['s', 'Seg'],
  ]

  return (
    <div className="flex items-start justify-center gap-2 sm:gap-4" role="timer" aria-label={label}>
      {cells.map(([k, cellLabel], i) => (
        <div key={k} className="flex items-start gap-2 sm:gap-4">
          <div className="flex flex-col items-center">
            <span
              className={`glass-strong flex h-[72px] items-center justify-center rounded-2xl font-display text-3xl font-extrabold tabular-nums text-white sm:h-24 sm:text-5xl ${
                // Flip: same size for two digits, but it grows for a third (100+ days) instead of overflowing.
                variant === 'flip' ? 'relative min-w-[68px] gap-[0.06em] px-[0.2em] sm:min-w-24' : 'w-[68px] sm:w-24'
              }`}
            >
              {variant === 'flip' && (
                // Split-flap seam and its two pins, static. Hidden with reduced motion (plain digits then).
                <span className="pointer-events-none absolute inset-x-0 top-1/2 z-10 motion-reduce:hidden" aria-hidden="true">
                  <span className="absolute inset-x-0 -top-px h-[2px] bg-black/55" />
                  <span className="absolute -top-[3px] left-[5px] h-1.5 w-1.5 rounded-full bg-black/60 shadow-[inset_0_1px_0_rgba(255,255,255,0.18)]" />
                  <span className="absolute -top-[3px] right-[5px] h-1.5 w-1.5 rounded-full bg-black/60 shadow-[inset_0_1px_0_rgba(255,255,255,0.18)]" />
                </span>
              )}
              {variant === 'flip'
                ? [...(state === 'pending' ? '--' : String(state[k]).padStart(2, '0'))].map((ch, i, all) => (
                    // Keyed from the right, so the ones digit keeps its identity if days drop from 3 to 2 digits.
                    <FlipDigit key={all.length - i} value={ch} />
                  ))
                : state === 'pending'
                  ? '–'
                  : String(state[k]).padStart(k === 'd' ? 1 : 2, '0')}
            </span>
            <span className="mt-3 text-[10px] uppercase tracking-[0.3em] text-white/50">{cellLabel}</span>
          </div>
          {i < cells.length - 1 && <span className="mt-6 text-2xl text-peri/40 sm:mt-8" aria-hidden="true">:</span>}
        </div>
      ))}
    </div>
  )
}

/**
 * Countdown to applications opening (Integrantes), split-flap when
 * FLIP_COUNTDOWN is on. Pauses while off-screen.
 * Renders nothing without a target; once the target passes, the cells give
 * way to "Las aplicaciones ya abrieron".
 */
export default function Countdown({ target, note }: { target: string | null; note: string }) {
  const ref = useRef<HTMLDivElement>(null)
  const state = useCountdown(target, ref)

  return (
    <div ref={ref} className="flex flex-col items-center">
      {state === 'done' ? (
        <p className="m-0 font-display text-[clamp(1.75rem,4vw,2.5rem)] font-bold text-peri">Las aplicaciones ya abrieron</p>
      ) : state !== 'none' ? (
        <>
          <CountdownCells state={state} label="Tiempo para que abran las aplicaciones" variant={FLIP_COUNTDOWN ? 'flip' : 'plain'} />
          <p className="mt-8 mb-0 text-[13px] font-light tracking-[0.04em] text-white/60">{note}</p>
        </>
      ) : null}
    </div>
  )
}
