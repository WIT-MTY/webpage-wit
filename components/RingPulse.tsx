'use client'

import { useEffect, useRef } from 'react'
import { onceInView } from '@/lib/inView'
import { touchMotion } from '@/lib/touch'
import shine from './Shine.module.css'
import styles from './RingPulse.module.css'

/**
 * Wraps a pill button: a faint gradient ring that flashes three times the
 * first time it is fully in view.
 *
 * `touchOnly`: no ring at all on desktop (the button looks exactly as
 * before); on touch devices the ring is hidden at rest and only shows for
 * the three-pulse flash. Either way, touch devices also get a tap press.
 * prefers-reduced-motion: no flash, no press. TOUCH_MOTION off: touchOnly
 * rings never show, and there is no press.
 */
export default function RingPulse({
  children,
  touchOnly = false,
  className = '',
}: {
  children: React.ReactNode
  touchOnly?: boolean
  /** Wrapper classes, e.g. `w-full sm:w-auto` when the button is full width on phones. */
  className?: string
}) {
  const ref = useRef<HTMLSpanElement>(null)

  useEffect(() => {
    const el = ref.current
    if (!el || window.matchMedia('(prefers-reduced-motion: reduce)').matches) return
    const touch = touchMotion()
    if (touchOnly && !touch) return
    const button = el.firstElementChild
    if (touch) button?.classList.add(shine.press)
    const stop = onceInView(el, () => el.classList.add(styles.play), 1)
    return () => {
      stop()
      button?.classList.remove(shine.press)
    }
  }, [touchOnly])

  return (
    <span ref={ref} className={`${touchOnly ? styles.flashOnly : styles.ring} ${className}`}>
      {children}
    </span>
  )
}
