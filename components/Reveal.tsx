'use client'

import { useEffect, useRef } from 'react'
import { onceInView } from '@/lib/inView'
import { touchMotion } from '@/lib/touch'
import styles from './Reveal.module.css'

/**
 * Fades its content up the first time it scrolls into view. `delay` (ms)
 * staggers siblings.
 *
 * Only elements that start below the fold animate: anything already on
 * screen when the page loads stays put, so nothing visible blinks out on
 * hydration. With `onLoad`, on-screen elements get a CSS entrance from the
 * first paint instead. Classes are toggled on the DOM directly; no re-renders.
 * prefers-reduced-motion: no scroll reveal, and the entrance is cut to its end.
 */
export default function Reveal({
  children,
  delay = 0,
  onLoad = false,
  className = '',
}: {
  children: React.ReactNode
  delay?: number
  /** Also animate when already on screen at load (a CSS entrance from first paint). */
  onLoad?: boolean
  className?: string
}) {
  const ref = useRef<HTMLDivElement>(null)

  useEffect(() => {
    const el = ref.current
    if (!el || window.matchMedia('(prefers-reduced-motion: reduce)').matches) return
    if (el.getBoundingClientRect().top < window.innerHeight) return

    el.classList.remove(styles.enter)
    el.classList.add(styles.hidden)
    return onceInView(
      el,
      () => {
        el.style.setProperty('--reveal-delay', `${delay}ms`)
        el.classList.add(styles.shown)
        el.classList.remove(styles.hidden)
      },
      0.15,
    )
  }, [delay])

  return (
    <div
      ref={ref}
      className={`${onLoad ? styles.enter : ''} ${className}`}
      style={onLoad ? ({ '--reveal-delay': `${delay}ms` } as React.CSSProperties) : undefined}
    >
      {children}
    </div>
  )
}

const STAGGER_MS = 60

/**
 * Touch devices only: fades up each item of a section or card grid the first
 * time it scrolls into view (opacity + 16px). Items that come into view
 * together are staggered 60 ms apart. Plays once per item.
 *
 * Items are the elements marked `data-reveal` inside it, or its direct
 * children when none are marked. The wrapper is `display: contents`, so it
 * never changes the layout around it. Same rules as Reveal: anything already
 * on screen when it mounts stays put, and nothing is hidden in the server
 * HTML. Desktop, prefers-reduced-motion and TOUCH_MOTION off: nothing happens.
 */
export function RevealGroup({ children }: { children: React.ReactNode }) {
  const ref = useRef<HTMLDivElement>(null)

  useEffect(() => {
    const root = ref.current
    if (!root || !touchMotion()) return
    const marked = root.querySelectorAll<HTMLElement>('[data-reveal]')
    const items = marked.length ? [...marked] : [...root.children].filter((c): c is HTMLElement => c instanceof HTMLElement)

    // Items revealed in the same frame share a stagger counter.
    let batch = 0
    let frame = 0
    const stops = items
      .filter((el) => el.getBoundingClientRect().top >= window.innerHeight)
      .map((el) => {
        el.classList.add(styles.itemHidden)
        return onceInView(
          el,
          () => {
            el.style.transitionDelay = `${batch++ * STAGGER_MS}ms`
            if (!frame) frame = requestAnimationFrame(() => ((frame = 0), (batch = 0)))
            el.classList.add(styles.itemShown)
            el.classList.remove(styles.itemHidden)
            // Hand the element back to its own styles once it has arrived.
            const done = (e: TransitionEvent) => {
              if (e.target !== el) return
              el.removeEventListener('transitionend', done)
              el.classList.remove(styles.itemShown)
              el.style.transitionDelay = ''
            }
            el.addEventListener('transitionend', done)
          },
          0.15,
        )
      })
    return () => {
      cancelAnimationFrame(frame)
      stops.forEach((stop) => stop())
    }
  }, [])

  return (
    <div ref={ref} className="contents">
      {children}
    </div>
  )
}
