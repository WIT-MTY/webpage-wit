'use client'

import { useEffect, useRef } from 'react'
import { touchMotion } from '@/lib/touch'
import shine from './Shine.module.css'

/** How far the link leans toward the pointer at its edge, in px. */
const PULL = 6
/** Constant lift while hovered, in px. */
const LIFT = -2
const SCALE = 1.04

/**
 * An external link that leans toward the pointer and lifts slightly on hover.
 * Transform only, one update per frame. Fine-pointer devices only; touch
 * gets a tap press instead (TOUCH_MOTION). Nothing under prefers-reduced-motion.
 */
export default function MagneticLink({
  href,
  className = '',
  children,
  ...rest
}: { href: string; className?: string; children: React.ReactNode } & Omit<
  React.AnchorHTMLAttributes<HTMLAnchorElement>,
  'href' | 'className' | 'children' | 'target' | 'rel'
>) {
  const ref = useRef<HTMLAnchorElement>(null)

  useEffect(() => {
    const el = ref.current
    if (!el) return
    // Touch: no pointer to follow, just a tap press.
    if (touchMotion()) {
      el.classList.add(shine.press)
      return () => el.classList.remove(shine.press)
    }
    if (!window.matchMedia('(hover: hover) and (pointer: fine)').matches) return
    if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) return

    let raf = 0
    let dx = 0
    let dy = 0
    const paint = () => {
      raf = 0
      el.style.transform = `translate3d(${dx * PULL}px, ${dy * PULL + LIFT}px, 0) scale(${SCALE})`
    }
    const onMove = (e: PointerEvent) => {
      const r = el.getBoundingClientRect()
      // -1…1 from the center, clamped.
      dx = Math.max(-1, Math.min(1, (e.clientX - (r.left + r.width / 2)) / (r.width / 2)))
      dy = Math.max(-1, Math.min(1, (e.clientY - (r.top + r.height / 2)) / (r.height / 2)))
      if (!raf) raf = requestAnimationFrame(paint)
    }
    const onLeave = () => {
      cancelAnimationFrame(raf)
      raf = 0
      el.style.transform = ''
    }

    el.addEventListener('pointermove', onMove)
    el.addEventListener('pointerleave', onLeave)
    return () => {
      cancelAnimationFrame(raf)
      el.removeEventListener('pointermove', onMove)
      el.removeEventListener('pointerleave', onLeave)
    }
  }, [])

  return (
    <a
      ref={ref}
      href={href}
      target="_blank"
      rel="noopener noreferrer"
      className={`transition-transform duration-200 ease-out ${className}`}
      {...rest}
    >
      {children}
    </a>
  )
}
