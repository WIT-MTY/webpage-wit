'use client'

import { useEffect, useRef } from 'react'

const SIZE = 480

/*
  Soft highlight that follows the pointer across its parent card.

  - One element per card, moved with transform only; the glow is a
    pre-rendered image (/fx/spotlight.svg). Pointer moves are coalesced to one
    update per animation frame.
  - Fades in on enter and out on leave (opacity).
  - Only on devices with a fine pointer that hovers; nothing on touch or under
    prefers-reduced-motion (the element is never shown).

  Put it as the first child of a `relative` card; it clips itself to the
  card's rounded corners.
*/
export default function Spotlight() {
  const wrapRef = useRef<HTMLSpanElement>(null)
  const glowRef = useRef<HTMLSpanElement>(null)

  useEffect(() => {
    const wrap = wrapRef.current
    const glow = glowRef.current
    const card = wrap?.parentElement
    if (!wrap || !glow || !card) return
    if (!window.matchMedia('(hover: hover) and (pointer: fine)').matches) return
    if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) return

    let raf = 0
    let x = 0
    let y = 0
    const paint = () => {
      raf = 0
      glow.style.transform = `translate3d(${x - SIZE / 2}px, ${y - SIZE / 2}px, 0)`
    }
    const onMove = (e: PointerEvent) => {
      const r = card.getBoundingClientRect()
      x = e.clientX - r.left
      y = e.clientY - r.top
      if (!raf) raf = requestAnimationFrame(paint)
    }
    const onEnter = (e: PointerEvent) => {
      onMove(e)
      glow.style.opacity = '1'
    }
    const onLeave = () => {
      glow.style.opacity = '0'
    }

    card.addEventListener('pointerenter', onEnter)
    card.addEventListener('pointermove', onMove)
    card.addEventListener('pointerleave', onLeave)
    return () => {
      cancelAnimationFrame(raf)
      card.removeEventListener('pointerenter', onEnter)
      card.removeEventListener('pointermove', onMove)
      card.removeEventListener('pointerleave', onLeave)
    }
  }, [])

  return (
    <span ref={wrapRef} className="pointer-events-none absolute inset-0 overflow-hidden rounded-[inherit]" aria-hidden="true">
      <span
        ref={glowRef}
        className="absolute top-0 left-0 transition-opacity duration-300 will-change-transform"
        style={{ width: SIZE, height: SIZE, opacity: 0, background: "url('/fx/spotlight.svg') center / contain no-repeat" }}
      />
    </span>
  )
}
