'use client'

import { useEffect, useRef } from 'react'
import { SHINE_TILT } from '@/lib/motion-flags'
import { onceInView } from '@/lib/inView'
import { touchMotion } from '@/lib/touch'
import shine from './Shine.module.css'

const MAX_TILT_DEG = 4

/*
  The site's signature glint for any card, plus an optional light tilt.
  Meant to be reused anywhere: wrap a card and pass its corner radius.

  - Glint: Shine.module.css's band (a pre-rendered image moved by transform),
    clipped to the card's corners. Plays on hover, on keyboard focus inside
    the card, and once the first time the card is mostly on screen.
  - Touch (TOUCH_MOTION): no tilt; cards that are a single link or button scale
    to 0.97 while pressed (Shine.module.css .press).
  - Tilt (desktop, fine pointer): up to 4° toward the pointer, one update
    per frame, with perspective on the outer wrapper. `tilt={false}` for
    cards that move on their own (e.g. the Aliados conveyor).
  - prefers-reduced-motion: no glint and no tilt.
  - SHINE_TILT off (lib/motion-flags.ts): a plain wrapper.
*/
export default function ShineCard({
  children,
  radius = 'rounded-3xl',
  tilt = true,
  className = '',
}: {
  children: React.ReactNode
  /** The card's border-radius class, so the glint follows its corners. */
  radius?: string
  tilt?: boolean
  /** Classes for the outer wrapper (size, grid placement). */
  className?: string
}) {
  const hostRef = useRef<HTMLDivElement>(null)
  const innerRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    const host = hostRef.current
    const inner = innerRef.current
    if (!SHINE_TILT || !host || !inner || window.matchMedia('(prefers-reduced-motion: reduce)').matches) return

    // One pass on first view.
    const strip = host.querySelector<HTMLElement>(`.${shine.strip}`)
    const onEnd = () => host.classList.remove(shine.played)
    strip?.addEventListener('animationend', onEnd)
    const stopView = onceInView(host, () => host.classList.add(shine.played), 0.6)

    // Touch: a quick press, only on cards that are one link or button (not cards that hold several).
    const press = touchMotion() && Boolean(inner.firstElementChild?.matches('a, button'))
    if (press) inner.classList.add(shine.press)

    // Tilt toward the pointer.
    let raf = 0
    let rx = 0
    let ry = 0
    const canTilt = tilt && window.matchMedia('(hover: hover) and (pointer: fine)').matches
    const paint = () => {
      raf = 0
      inner.style.transform = `rotateX(${rx}deg) rotateY(${ry}deg)`
    }
    const onMove = (e: PointerEvent) => {
      const r = host.getBoundingClientRect()
      const dx = Math.max(-1, Math.min(1, ((e.clientX - r.left) / r.width) * 2 - 1))
      const dy = Math.max(-1, Math.min(1, ((e.clientY - r.top) / r.height) * 2 - 1))
      ry = dx * MAX_TILT_DEG
      rx = -dy * MAX_TILT_DEG
      if (!raf) raf = requestAnimationFrame(paint)
    }
    const onLeave = () => {
      cancelAnimationFrame(raf)
      raf = 0
      inner.style.transform = ''
    }
    if (canTilt) {
      host.addEventListener('pointermove', onMove)
      host.addEventListener('pointerleave', onLeave)
    }

    return () => {
      stopView()
      if (press) inner.classList.remove(shine.press)
      strip?.removeEventListener('animationend', onEnd)
      cancelAnimationFrame(raf)
      host.removeEventListener('pointermove', onMove)
      host.removeEventListener('pointerleave', onLeave)
    }
  }, [tilt])

  if (!SHINE_TILT) return <div className={className}>{children}</div>

  return (
    <div ref={hostRef} className={`${shine.host} ${className}`} style={tilt ? { perspective: '900px' } : undefined}>
      <div ref={innerRef} className={`relative h-full ${radius} transition-transform duration-200 ease-out`}>
        {children}
        <span className={shine.track} aria-hidden="true">
          <span className={shine.strip} />
        </span>
      </div>
    </div>
  )
}
