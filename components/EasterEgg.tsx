'use client'

import { useEffect, useRef, useState } from 'react'
import { EASTER_EGG } from '@/lib/motion-flags'

/*
  Two hidden treats, mounted once in the layout.

  1. Click the WIT logo in the nav 5 times within 3 s: Lumi flies across the
     screen in an arc, dropping 8 sparkles, and a toast says
     "¡Encontraste el secreto!" for 3 s.
  2. Type "wit" anywhere outside a text field: a burst of 24 confetti pieces
     (pre-rendered stars and dots in brand colors) flies out from the center
     and is removed afterwards.

  Transform and opacity only (Web Animations API). Neither re-triggers while
  one is playing. prefers-reduced-motion: the toast only, for both.

  The nav logo is found by its selector, so Nav.tsx doesn't need to know
  about any of this.
*/

const LOGO_SELECTOR = 'nav[aria-label="Principal"] a[href="/"]'
const CLICKS = 5
const WINDOW_MS = 3000
const TOAST_MS = 3000
const FLIGHT_MS = 1800
const SPARKLES = 8
const CONFETTI = 24
const CONFETTI_MS = 1200
const MESSAGE = '¡Encontraste el secreto!'

const COLORS = ['#ff5795', '#9066d2', '#c6c8ee', '#7c22c7']
const STARS = ['/fx/confetti-star-pink.svg', '/fx/confetti-star-peri.svg']

const reducedMotion = () => window.matchMedia('(prefers-reduced-motion: reduce)').matches

function isTyping(target: EventTarget | null) {
  if (!(target instanceof HTMLElement)) return false
  return target.isContentEditable || ['INPUT', 'TEXTAREA', 'SELECT'].includes(target.tagName)
}

/** A point on the flight arc, t in 0…1, in viewport px. */
function arcPoint(t: number, vw: number, vh: number) {
  return { x: -90 + t * (vw + 180), y: vh * 0.72 - Math.sin(t * Math.PI) * vh * 0.5 }
}

export default function EasterEgg() {
  const [toast, setToast] = useState(false)
  const busy = useRef(false)
  const lumiRef = useRef<HTMLImageElement>(null)
  const sparkRefs = useRef<(HTMLSpanElement | null)[]>([])
  const layerRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    if (!EASTER_EGG) return
    let clicks: number[] = []
    let typed = ''
    let toastTimer: number | undefined

    const showToast = () => {
      setToast(true)
      window.clearTimeout(toastTimer)
      toastTimer = window.setTimeout(() => setToast(false), TOAST_MS)
    }

    const finish = (ms: number) => window.setTimeout(() => (busy.current = false), ms)

    const fly = () => {
      busy.current = true
      showToast()
      const lumi = lumiRef.current
      if (reducedMotion() || !lumi) return finish(TOAST_MS)
      const vw = window.innerWidth
      const vh = window.innerHeight
      const steps = 12
      const frames = Array.from({ length: steps + 1 }, (_, i) => {
        const t = i / steps
        const p = arcPoint(t, vw, vh)
        return { transform: `translate3d(${p.x}px, ${p.y}px, 0) rotate(${(t - 0.5) * 30}deg)`, opacity: t === 0 || t === 1 ? 0 : 1 }
      })
      frames[1].opacity = 1
      frames[steps - 1].opacity = 1
      lumi.animate(frames, { duration: FLIGHT_MS, easing: 'ease-in-out' }).onfinish = function () {
        this.cancel()
      }
      sparkRefs.current.forEach((s, i) => {
        if (!s) return
        const t = (i + 1) / (SPARKLES + 1)
        const p = arcPoint(t, vw, vh)
        // The sparkle appears where Lumi passes, then fades and drifts down.
        s.animate(
          [
            { transform: `translate3d(${p.x + 20}px, ${p.y + 40}px, 0) scale(0.4)`, opacity: 0 },
            { transform: `translate3d(${p.x + 20}px, ${p.y + 40}px, 0) scale(1)`, opacity: 1, offset: 0.25 },
            { transform: `translate3d(${p.x + 20}px, ${p.y + 70}px, 0) scale(0.6)`, opacity: 0 },
          ],
          { duration: 900, delay: t * FLIGHT_MS, easing: 'ease-out', fill: 'backwards' },
        ).onfinish = function () {
          this.cancel()
        }
      })
      finish(Math.max(FLIGHT_MS + 900, TOAST_MS))
    }

    const confetti = () => {
      busy.current = true
      const layer = layerRef.current
      if (reducedMotion() || !layer) {
        showToast()
        return finish(TOAST_MS)
      }
      const cx = window.innerWidth / 2
      const cy = window.innerHeight / 2
      const pieces: HTMLElement[] = []
      for (let i = 0; i < CONFETTI; i++) {
        const el = document.createElement('span')
        const star = i % 3 === 0
        const size = star ? 16 : 8
        el.style.cssText = `position:absolute;left:${cx - size / 2}px;top:${cy - size / 2}px;width:${size}px;height:${size}px;border-radius:9999px;`
        if (star) el.style.background = `url('${STARS[i % 2]}') center / contain no-repeat`
        else el.style.background = COLORS[i % COLORS.length]
        layer.appendChild(el)
        pieces.push(el)
        const angle = (i / CONFETTI) * Math.PI * 2 + Math.random() * 0.4
        const dist = 140 + Math.random() * 200
        const dx = Math.cos(angle) * dist
        const dy = Math.sin(angle) * dist
        el.animate(
          [
            { transform: 'translate3d(0, 0, 0) scale(0.4) rotate(0deg)', opacity: 1 },
            { transform: `translate3d(${dx}px, ${dy}px, 0) scale(1) rotate(${180 + Math.random() * 180}deg)`, opacity: 1, offset: 0.6 },
            { transform: `translate3d(${dx * 1.1}px, ${dy * 1.1 + 60}px, 0) scale(0.8) rotate(360deg)`, opacity: 0 },
          ],
          { duration: CONFETTI_MS, easing: 'cubic-bezier(0.2, 0.7, 0.3, 1)' },
        )
      }
      window.setTimeout(() => {
        pieces.forEach((p) => p.remove())
        busy.current = false
      }, CONFETTI_MS + 50)
    }

    const onClick = (e: MouseEvent) => {
      if (!(e.target instanceof Element) || !e.target.closest(LOGO_SELECTOR)) return
      const now = performance.now()
      clicks = [...clicks.filter((t) => now - t < WINDOW_MS), now]
      if (clicks.length >= CLICKS && !busy.current) {
        clicks = []
        fly()
      }
    }

    const onKey = (e: KeyboardEvent) => {
      if (e.ctrlKey || e.metaKey || e.altKey || isTyping(e.target) || e.key.length !== 1) return
      typed = (typed + e.key.toLowerCase()).slice(-3)
      if (typed === 'wit' && !busy.current) {
        typed = ''
        confetti()
      }
    }

    document.addEventListener('click', onClick, true)
    window.addEventListener('keydown', onKey)
    return () => {
      document.removeEventListener('click', onClick, true)
      window.removeEventListener('keydown', onKey)
      window.clearTimeout(toastTimer)
    }
  }, [])

  if (!EASTER_EGG) return null

  return (
    <>
      {/* Effects layer: under the nav (z-50), above Lumi (z-40). */}
      <div ref={layerRef} className="pointer-events-none fixed inset-0 z-[45] overflow-hidden" aria-hidden="true">
        {/* eslint-disable-next-line @next/next/no-img-element -- small sprite, animated by transform */}
        <img ref={lumiRef} src="/lumi.webp" alt="" width={56} height={111} className="absolute top-0 left-0 w-14 opacity-0" />
        {Array.from({ length: SPARKLES }, (_, i) => (
          <span
            key={i}
            ref={(el) => {
              sparkRefs.current[i] = el
            }}
            className="absolute top-0 left-0 h-5 w-5 opacity-0"
            style={{ background: "url('/fx/firefly-glow.svg') center / contain no-repeat" }}
          />
        ))}
      </div>
      <div className="pointer-events-none fixed inset-x-0 top-24 z-[60] flex justify-center px-4" role="status" aria-live="polite">
        {toast && (
          <p className="glass-strong animate-rise m-0 rounded-full px-6 py-3 text-[14px] font-medium text-white">{MESSAGE}</p>
        )}
      </div>
    </>
  )
}
