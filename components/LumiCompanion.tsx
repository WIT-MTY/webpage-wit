'use client'

import Image from 'next/image'
import { usePathname } from 'next/navigation'
import { useEffect, useRef, useState } from 'react'
import styles from './LumiCompanion.module.css'

type Anchor = 'left' | 'center' | 'right'

const DEFAULT_ANCHOR: Anchor = 'right'
const TRAIL = 4
const TRAIL_STAGGER_MS = 70
const TRAIL_FADE_MS = 600
const GLIDE_MS = 900
const MAX_TILT_DEG = 8
const PARALLAX_PX = 6
const WIGGLE_MS = 600

const isAnchor = (v: string | undefined): v is Anchor => v === 'left' || v === 'center' || v === 'right'
const desktop = () => window.matchMedia('(min-width: 768px)').matches
const finePointer = () => window.matchMedia('(hover: hover) and (pointer: fine)').matches
const reducedMotion = () => window.matchMedia('(prefers-reduced-motion: reduce)').matches

/*
  Lumi as a companion that follows the page (see LumiCompanion.module.css).

  - Sections opt in with data-lumi-anchor="left|center|right". The one
    crossing the middle of the viewport (IntersectionObserver band, no scroll
    listener) sets where she sits; with none, she rests bottom-right.
  - On an anchor change, four pooled glow dots chase her and fade.
  - Desktop + fine pointer: she leans up to 8° and drifts 6px toward the
    cursor (one update per frame), and wiggles when any link or button is
    clicked.
  - Mobile: bottom-right, smaller, idle bob only.
  - prefers-reduced-motion: she jumps between anchors; no trail, lean,
    wiggle or bob.
*/
export default function LumiCompanion({
  talking,
  onToggle,
  bubble,
}: {
  talking: boolean
  onToggle: () => void
  bubble: React.ReactNode
}) {
  const pathname = usePathname()
  const [anchor, setAnchor] = useState<Anchor>(DEFAULT_ANCHOR)
  const rootRef = useRef<HTMLDivElement>(null)
  const leanRef = useRef<HTMLDivElement>(null)
  const wiggleRef = useRef<HTMLDivElement>(null)
  const dotRefs = useRef<(HTMLSpanElement | null)[]>([])
  const prevAnchor = useRef<Anchor>(DEFAULT_ANCHOR)

  // Which section is crossing the middle of the viewport. Re-scanned per route.
  useEffect(() => {
    const sections = Array.from(document.querySelectorAll<HTMLElement>('[data-lumi-anchor]'))
    const inBand = new Set<HTMLElement>()
    const io = new IntersectionObserver(
      (entries) => {
        for (const e of entries) {
          const el = e.target as HTMLElement
          if (e.isIntersecting) inBand.add(el)
          else inBand.delete(el)
        }
        // Topmost section in the band wins; none → rest bottom-right.
        const current = sections.find((s) => inBand.has(s))
        const value = current?.dataset.lumiAnchor
        setAnchor(isAnchor(value) ? value : DEFAULT_ANCHOR)
      },
      { rootMargin: '-45% 0px -45% 0px' },
    )
    sections.forEach((s) => io.observe(s))
    return () => io.disconnect()
  }, [pathname])

  // Glow trail: the pooled dots start where she was and follow her, fading.
  useEffect(() => {
    const from = prevAnchor.current
    prevAnchor.current = anchor
    if (from === anchor || !desktop() || reducedMotion()) return
    dotRefs.current.forEach((dot, i) => {
      if (!dot) return
      dot.style.transition = 'none'
      dot.dataset.anchor = from
      dot.style.opacity = '0.8'
      void dot.offsetWidth // commit the start position before transitioning
      const delay = (i + 1) * TRAIL_STAGGER_MS
      dot.style.transition = `transform ${GLIDE_MS}ms cubic-bezier(0.45, 0, 0.2, 1) ${delay}ms, opacity ${TRAIL_FADE_MS}ms ease-out ${delay}ms`
      dot.dataset.anchor = anchor
      dot.style.opacity = '0'
    })
  }, [anchor])

  // Lean toward the cursor (desktop, fine pointer).
  useEffect(() => {
    const root = rootRef.current
    const lean = leanRef.current
    if (!root || !lean || !desktop() || !finePointer() || reducedMotion()) return
    let raf = 0
    let px = 0
    let py = 0
    const paint = () => {
      raf = 0
      const r = root.getBoundingClientRect()
      const dx = Math.max(-1, Math.min(1, (px - (r.left + r.width / 2)) / 400))
      const dy = Math.max(-1, Math.min(1, (py - (r.top + r.height / 2)) / 400))
      lean.style.transform = `translate3d(${dx * PARALLAX_PX}px, ${dy * PARALLAX_PX}px, 0) rotate(${dx * MAX_TILT_DEG}deg)`
    }
    const onMove = (e: PointerEvent) => {
      px = e.clientX
      py = e.clientY
      if (!raf) raf = requestAnimationFrame(paint)
    }
    window.addEventListener('pointermove', onMove, { passive: true })
    return () => {
      cancelAnimationFrame(raf)
      window.removeEventListener('pointermove', onMove)
    }
  }, [])

  // Happy wiggle on any link or button click (desktop).
  useEffect(() => {
    const onClick = (e: MouseEvent) => {
      const wiggle = wiggleRef.current
      if (!wiggle || !desktop() || reducedMotion()) return
      if (!(e.target instanceof Element) || !e.target.closest('a, button')) return
      wiggle.getAnimations().forEach((a) => a.cancel())
      const anim = wiggle.animate(
        [
          { transform: 'rotate(0deg) scale(1)' },
          { transform: 'rotate(-10deg) scale(1.06)', offset: 0.2 },
          { transform: 'rotate(8deg) scale(1.06)', offset: 0.45 },
          { transform: 'rotate(-4deg) scale(1.03)', offset: 0.7 },
          { transform: 'rotate(0deg) scale(1)' },
        ],
        { duration: WIGGLE_MS, easing: 'ease-in-out' },
      )
      anim.onfinish = () => anim.cancel()
    }
    document.addEventListener('click', onClick, true)
    return () => document.removeEventListener('click', onClick, true)
  }, [])

  return (
    <>
      {Array.from({ length: TRAIL }, (_, i) => (
        <span
          key={i}
          ref={(el) => {
            dotRefs.current[i] = el
          }}
          className={styles.dot}
          data-anchor={DEFAULT_ANCHOR}
          aria-hidden="true"
        />
      ))}
      <div ref={rootRef} data-lumi="" data-anchor={anchor} className={styles.root}>
        <div ref={leanRef} className={styles.lean}>
          <div ref={wiggleRef} className={styles.wiggle}>
            <div className={styles.bob} data-ambient="">
              <span className={styles.glow} aria-hidden="true" />
              <button
                type="button"
                onClick={onToggle}
                aria-label={talking ? 'Ocultar el mensaje de Lumi' : 'Mostrar el mensaje de Lumi'}
                aria-expanded={talking}
                className={styles.button}
              >
                <Image src="/lumi.webp" alt="Lumi, la mascota de WIT" width={64} height={127} className={styles.image} />
              </button>
            </div>
          </div>
        </div>
        {bubble && <div className={styles.bubble}>{bubble}</div>}
      </div>
    </>
  )
}
