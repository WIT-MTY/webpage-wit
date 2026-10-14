'use client'

import { useEffect, useRef, useState } from 'react'
import { TERMINAL_TYPING } from '@/lib/motion-flags'
import { Caret } from './Typewriter'

export type TerminalLine = { key: string; label: string; text: string; href: string; external?: boolean }

const COMMAND = 'contactar_wit();'
const CHAR_MS = 75 // ≤ ~13 text updates a second
const START_MS = 300
const BEFORE_OUTPUT_MS = 350
const LINE_MS = 260

/*
  Terminal-style contact block on Contáctanos.

  - Everything is in the server HTML and laid out from the start (the
    untyped command is `invisible`, output lines are transparent), so the
    height never changes and no-JS shows it all.
  - If it starts below the fold, it types "> contactar_wit();" once when it
    scrolls into view, then shows each output line. Text is written straight
    to the DOM; the only re-render is the caret finishing.
  - Already on screen at load, prefers-reduced-motion, or TERMINAL_TYPING
    off: everything shows at once, no caret.
  - The timer stops while the tab is hidden and picks up where it left off.
  - Screen readers get the plain contact info from the group's aria-label;
    the links stay reachable.
*/
export default function TerminalContact({ lines, summary }: { lines: TerminalLine[]; summary: string }) {
  const rootRef = useRef<HTMLDivElement>(null)
  const typedRef = useRef<HTMLSpanElement>(null)
  const restRef = useRef<HTMLSpanElement>(null)
  const lineRefs = useRef<(HTMLLIElement | null)[]>([])
  const [caret, setCaret] = useState<'none' | 'on' | 'done'>('none')

  useEffect(() => {
    const root = rootRef.current
    const typed = typedRef.current
    const rest = restRef.current
    if (!TERMINAL_TYPING || !root || !typed || !rest) return
    if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) return
    if (root.getBoundingClientRect().top < window.innerHeight) return

    // Hide what will be typed; it is all still laid out.
    typed.textContent = ''
    rest.textContent = COMMAND
    const items = lineRefs.current.filter((l): l is HTMLLIElement => Boolean(l))
    items.forEach((l) => (l.style.opacity = '0'))
    setCaret('on')

    // The script: a list of [wait, action] steps.
    const steps: [number, () => void][] = [
      ...[...COMMAND].map((_, i): [number, () => void] => [
        i === 0 ? START_MS : CHAR_MS,
        () => {
          typed.textContent = COMMAND.slice(0, i + 1)
          rest.textContent = COMMAND.slice(i + 1)
        },
      ]),
      ...items.map((l, i): [number, () => void] => [i === 0 ? BEFORE_OUTPUT_MS : LINE_MS, () => (l.style.opacity = '1')]),
      [0, () => setCaret('done')],
    ]

    let i = 0
    let timer: number | undefined
    let dueAt = 0
    let remaining: number | null = null
    let started = false
    const schedule = (ms: number) => {
      dueAt = performance.now() + ms
      timer = window.setTimeout(run, ms)
    }
    function run() {
      timer = undefined
      steps[i++][1]()
      if (i < steps.length) schedule(steps[i][0])
    }
    const onVisibility = () => {
      if (!started) return
      if (document.visibilityState === 'hidden' && timer !== undefined) {
        window.clearTimeout(timer)
        timer = undefined
        remaining = Math.max(0, dueAt - performance.now())
      } else if (document.visibilityState === 'visible' && remaining !== null) {
        const ms = remaining
        remaining = null
        schedule(ms)
      }
    }
    const io = new IntersectionObserver(
      ([entry]) => {
        if (!entry.isIntersecting) return
        io.disconnect()
        started = true
        if (document.visibilityState === 'visible') schedule(steps[0][0])
        else remaining = steps[0][0]
      },
      { threshold: 0.5 },
    )
    io.observe(root)
    document.addEventListener('visibilitychange', onVisibility)
    return () => {
      window.clearTimeout(timer)
      io.disconnect()
      document.removeEventListener('visibilitychange', onVisibility)
    }
  }, [])

  return (
    <div ref={rootRef} role="group" aria-label={summary} className="glass overflow-hidden rounded-3xl font-mono">
      <div className="flex items-center gap-2 border-b border-white/10 px-5 py-3" aria-hidden="true">
        <span className="h-3 w-3 rounded-full bg-wit-pink/80" />
        <span className="h-3 w-3 rounded-full bg-wit-violet/80" />
        <span className="h-3 w-3 rounded-full bg-peri/70" />
        <span className="ml-3 text-[12px] text-white/45">wit@tec ~ contacto</span>
      </div>
      <div className="bg-black/30 px-5 py-6 text-[13px] leading-relaxed sm:px-8 sm:text-[14px]">
        <p className="m-0 text-white/90" aria-hidden="true">
          <span className="text-wit-pink">&gt; </span>
          <span ref={typedRef}>{COMMAND}</span>
          {caret !== 'none' && <Caret finished={caret === 'done'} />}
          <span ref={restRef} className="invisible" />
        </p>
        <ul className="m-0 mt-4 flex list-none flex-col gap-2 p-0">
          {lines.map((l, i) => (
            <li
              key={l.key}
              ref={(el) => {
                lineRefs.current[i] = el
              }}
              className="break-words text-white/75 transition-opacity duration-300"
            >
              <span className="text-[#73edaa]" aria-hidden="true">
                ✔{' '}
              </span>
              <span className="text-peri/70">{l.label}: </span>
              <a
                href={l.href}
                {...(l.external ? { target: '_blank', rel: 'noopener noreferrer' } : {})}
                className="text-white underline decoration-peri/40 underline-offset-4 transition-colors hover:text-peri"
              >
                {l.text}
              </a>
            </li>
          ))}
        </ul>
      </div>
    </div>
  )
}
