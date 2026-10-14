'use client'

import { useEffect, useRef, useState, type FocusEvent } from 'react'
import { ActivityCard } from './ActivityGrid'
import ShineCard from './ShineCard'
import { ACTIVITIES, INICIO_FEATURED } from '@/lib/site'

const FEATURED = INICIO_FEATURED.map((slug) => ACTIVITIES.find((a) => a.slug === slug)).filter(
  (a): a is (typeof ACTIVITIES)[number] => Boolean(a),
)
const PAIRS = Array.from({ length: Math.ceil(FEATURED.length / 2) }, (_, p) => FEATURED.slice(p * 2, p * 2 + 2))
const DESKTOP = '(min-width: 768px)'
const INTERVAL_MS = 6000

/** Stacked slide: every slide shares one grid cell, so the tallest sets the height and nothing shifts. */
function Slide({ active, children }: { active: boolean; children: React.ReactNode }) {
  return (
    <div
      className={`[grid-area:1/1] transition-[opacity,visibility] duration-700 motion-reduce:transition-none ${active ? 'visible opacity-100' : 'invisible opacity-0'}`}
      aria-hidden={!active}
      inert={!active}
    >
      {children}
    </div>
  )
}

/*
  Inicio's event summary: four featured events, one card at a time on mobile,
  two on desktop. Opacity crossfade only. Auto-advances every 6s, paused on
  hover/focus, off-screen, while the tab is hidden, and under
  prefers-reduced-motion (the dots and arrows still work).

  `index` is a card index. Mobile shows card `index`; desktop shows pair
  floor(index / 2). Both layouts are rendered and CSS picks one, so the server
  HTML already matches the viewport.
*/
export default function EventCarousel() {
  const ref = useRef<HTMLDivElement>(null)
  const [index, setIndex] = useState(0)
  const [hovered, setHovered] = useState(false)
  const [focused, setFocused] = useState(false)
  const [onScreen, setOnScreen] = useState(false)
  const [tabVisible, setTabVisible] = useState(true)
  const [reduced, setReduced] = useState(true)
  const paused = hovered || focused || !onScreen || !tabVisible || reduced

  const go = (dir: 1 | -1) => {
    const n = FEATURED.length
    if (window.matchMedia(DESKTOP).matches) {
      setIndex((i) => ((Math.floor(i / 2) + dir + PAIRS.length) % PAIRS.length) * 2)
    } else {
      setIndex((i) => (i + dir + n) % n)
    }
  }

  useEffect(() => {
    const el = ref.current
    const io = el ? new IntersectionObserver(([entry]) => setOnScreen(entry.isIntersecting)) : null
    if (el && io) io.observe(el)
    const onVisibility = () => setTabVisible(document.visibilityState === 'visible')
    onVisibility()
    document.addEventListener('visibilitychange', onVisibility)
    const mq = window.matchMedia('(prefers-reduced-motion: reduce)')
    const onMotion = () => setReduced(mq.matches)
    onMotion()
    mq.addEventListener('change', onMotion)
    return () => {
      io?.disconnect()
      document.removeEventListener('visibilitychange', onVisibility)
      mq.removeEventListener('change', onMotion)
    }
  }, [])

  // Restarts on every slide change, so a manual jump gets a full 6s too.
  useEffect(() => {
    if (paused) return
    const id = window.setTimeout(() => go(1), INTERVAL_MS)
    return () => window.clearTimeout(id)
  }, [index, paused])

  const onBlur = (e: FocusEvent<HTMLDivElement>) => {
    if (!e.currentTarget.contains(e.relatedTarget as Node | null)) setFocused(false)
  }

  const pair = Math.floor(index / 2)
  const arrow =
    'glass-strong flex h-11 w-11 cursor-pointer items-center justify-center rounded-full text-lg text-white/85 hover:text-peri'
  const dot = (active: boolean) =>
    `h-11 w-6 cursor-pointer border-none bg-transparent p-0 after:mx-auto after:block after:h-2 after:rounded-full ${
      active ? 'after:w-5 after:bg-peri' : 'after:w-2 after:bg-white/30'
    }`

  return (
    <div
      ref={ref}
      role="region"
      aria-roledescription="carrusel"
      aria-label="Proyectos destacados"
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
      onFocus={() => setFocused(true)}
      onBlur={onBlur}
    >
      <div className="grid md:hidden" aria-live={paused ? 'polite' : 'off'}>
        {FEATURED.map((a, i) => (
          <Slide key={a.slug} active={i === index}>
            <ShineCard className="h-full">
              <ActivityCard a={a} />
            </ShineCard>
          </Slide>
        ))}
      </div>
      <div className="hidden md:grid" aria-live={paused ? 'polite' : 'off'}>
        {PAIRS.map((cards, p) => (
          <Slide key={p} active={p === pair}>
            <div className="grid h-full grid-cols-2 gap-5">
              {cards.map((a) => (
                <ShineCard key={a.slug} className="h-full">
                  <ActivityCard a={a} />
                </ShineCard>
              ))}
            </div>
          </Slide>
        ))}
      </div>

      <div className="mt-8 flex items-center justify-center gap-4">
        <button type="button" onClick={() => go(-1)} aria-label="Anterior" className={arrow}>
          ‹
        </button>
        <div className="flex md:hidden">
          {FEATURED.map((a, i) => (
            <button
              key={a.slug}
              type="button"
              onClick={() => setIndex(i)}
              aria-label={`Ir a ${a.title}`}
              aria-current={i === index}
              className={dot(i === index)}
            />
          ))}
        </div>
        <div className="hidden md:flex">
          {PAIRS.map((cards, p) => (
            <button
              key={p}
              type="button"
              onClick={() => setIndex(p * 2)}
              aria-label={`Ir a ${cards.map((a) => a.title).join(' y ')}`}
              aria-current={p === pair}
              className={dot(p === pair)}
            />
          ))}
        </div>
        <button type="button" onClick={() => go(1)} aria-label="Siguiente" className={arrow}>
          ›
        </button>
      </div>
    </div>
  )
}
