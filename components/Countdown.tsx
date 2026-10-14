'use client'

import { Fragment, useEffect, useRef, useState, type RefObject } from 'react'
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
 *
 * Fluid: a 7-column grid (4 equal tile columns, 3 colon columns) that always
 * fits one row, down to 320px screens. Each tile is square, capped at 96px,
 * and its numerals are sized from the column width (container query units),
 * so the flip cards, seam and pins scale with it. Two rows: tiles and colons
 * share the first, so the colons sit at the tiles' middle; labels the second.
 *
 * variant="flip": every cell shows at least two fixed-width digits ("--"
 * before mount) and only the digits that change flip (FlipDigit).
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
  const text = (k: keyof Parts) =>
    variant === 'flip'
      ? state === 'pending'
        ? '--'
        : String(state[k]).padStart(2, '0')
      : state === 'pending'
        ? '–'
        : String(state[k]).padStart(k === 'd' ? 1 : 2, '0')

  return (
    <div
      className="mx-auto grid w-full max-w-[29rem] grid-cols-[minmax(0,1fr)_auto_minmax(0,1fr)_auto_minmax(0,1fr)_auto_minmax(0,1fr)] items-center gap-x-1 sm:gap-x-2"
      role="timer"
      aria-label={label}
    >
      {/* Row 1: tiles and colons. */}
      {cells.map(([k], i) => {
        const value = text(k)
        return (
          <Fragment key={k}>
            {/* The container the tile's font-size is measured against (cqi). */}
            <div className="@container flex min-w-0 justify-center">
              <span
                className={`glass-strong relative flex aspect-square w-full max-w-24 items-center justify-center rounded-[17%] font-display font-extrabold tabular-nums text-white ${
                  // Three digits (100+ days) get a smaller size so they still fit the tile.
                  value.length > 2 ? 'text-[clamp(12px,34cqi,40px)]' : 'text-[clamp(14px,48cqi,48px)]'
                } ${variant === 'flip' ? 'gap-[0.06em] px-[0.12em]' : ''}`}
              >
                {variant === 'flip' && (
                  // Split-flap seam and its two pins, static, sized in em so they scale with the tile.
                  // Hidden with reduced motion (plain digits then).
                  <span className="pointer-events-none absolute inset-x-0 top-1/2 z-10 motion-reduce:hidden" aria-hidden="true">
                    <span className="absolute inset-x-0 top-0 h-[max(1px,0.04em)] -translate-y-1/2 bg-black/55" />
                    <span className="absolute top-0 left-[6%] h-[max(3px,0.12em)] w-[max(3px,0.12em)] -translate-y-1/2 rounded-full bg-black/60 shadow-[inset_0_1px_0_rgba(255,255,255,0.18)]" />
                    <span className="absolute top-0 right-[6%] h-[max(3px,0.12em)] w-[max(3px,0.12em)] -translate-y-1/2 rounded-full bg-black/60 shadow-[inset_0_1px_0_rgba(255,255,255,0.18)]" />
                  </span>
                )}
                {variant === 'flip'
                  ? [...value].map((ch, j, all) => (
                      // Keyed from the right, so the ones digit keeps its identity if days drop from 3 to 2 digits.
                      <FlipDigit key={all.length - j} value={ch} />
                    ))
                  : value}
              </span>
            </div>
            {i < cells.length - 1 && (
              <span className="text-[clamp(14px,4vw,24px)] leading-none text-peri/40" aria-hidden="true">
                :
              </span>
            )}
          </Fragment>
        )
      })}
      {/* Row 2: labels under their tiles; empty cells under the colons. */}
      {cells.map(([k, cellLabel], i) => (
        <Fragment key={`label-${k}`}>
          <span className="mt-2 min-w-0 text-center text-[9px] uppercase tracking-[0.12em] text-white/50 sm:mt-3 sm:text-[10px] sm:tracking-[0.3em]">
            {cellLabel}
          </span>
          {i < cells.length - 1 && <span aria-hidden="true" />}
        </Fragment>
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
    <div ref={ref} className="flex w-full flex-col items-center">
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
