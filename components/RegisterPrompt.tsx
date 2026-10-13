'use client'

import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { useEffect, useState } from 'react'
import { useCountdown, type CountdownState } from './Countdown'
import { NEXT_EVENT, nextEvent } from '@/lib/site'
import { eventWhen } from '@/lib/eventDate'
import { useRegistrationCount } from '@/lib/useRegistrationCount'

/*
  Mobile-only registration prompt on Inicio. This is the only place Inicio
  mentions the next event; the full panel lives on Proyectos.

  Compact by default: a slim bar above the bottom edge, clear of the hero
  buttons. Tapping the text expands it to a full bottom sheet.

  Rules:
    - Appears 2.5s after load, or once the visitor scrolls ~30%.
    - Only when there is an upcoming event with registration open.
    - Never if it was dismissed this visit, or if the visitor is already
      on /proyectos.
    - Non-blocking: no dark overlay, the page keeps scrolling, no focus trap.
    - "Registrarme" opens the event's form in a new tab. Once the event
      starts it becomes a disabled "Registro cerrado".
    - "Ver evento" goes to /proyectos, where the Próximo evento panel is.
*/

/** "32d 04h 10m" */
function shortCountdown(state: CountdownState) {
  if (state === 'pending') return '–d –h –m'
  if (typeof state === 'string') return null
  return `${state.d}d ${String(state.h).padStart(2, '0')}h ${String(state.m).padStart(2, '0')}m`
}

export default function RegisterPrompt() {
  const pathname = usePathname()
  const [visible, setVisible] = useState(false)
  const [expanded, setExpanded] = useState(false)
  const ev = nextEvent()
  const count = useRegistrationCount(NEXT_EVENT?.countUrl ?? null)

  const eligible = pathname === '/' && Boolean(ev) && Boolean(NEXT_EVENT?.registrationOpen)
  // Only ticks while the prompt is actually on screen.
  const countdown = useCountdown(NEXT_EVENT?.date ?? null, undefined, eligible && visible)

  useEffect(() => {
    if (!eligible) return
    if (sessionStorage.getItem('register-prompt-dismissed') === '1') return
    let done = false
    const show = () => {
      if (done) return
      done = true
      setVisible(true)
      window.removeEventListener('scroll', onScroll)
    }
    const onScroll = () => {
      const p = window.scrollY / Math.max(1, document.body.scrollHeight - window.innerHeight)
      if (p > 0.3) show()
    }
    const id = window.setTimeout(show, 2500)
    window.addEventListener('scroll', onScroll, { passive: true })
    return () => {
      window.clearTimeout(id)
      window.removeEventListener('scroll', onScroll)
    }
  }, [eligible])

  // While the prompt is up, Lumi hides on mobile so the two never stack
  // in the same corner (CSS rule in globals.css).
  useEffect(() => {
    const root = document.documentElement
    if (eligible && visible) root.dataset.registerPrompt = '1'
    else delete root.dataset.registerPrompt
    return () => {
      delete root.dataset.registerPrompt
    }
  }, [eligible, visible])

  if (!eligible || !visible || !ev || !NEXT_EVENT) return null

  const dismiss = () => {
    sessionStorage.setItem('register-prompt-dismissed', '1')
    setVisible(false)
  }

  const when = NEXT_EVENT.date ? eventWhen(NEXT_EVENT.date, NEXT_EVENT.endTime, null) : null
  const left = shortCountdown(countdown)
  // Registration closes when the event starts.
  const formUrl = countdown === 'done' ? null : ev.formUrl

  const meta = (
    <span className="flex flex-wrap items-center gap-x-2.5 gap-y-1 text-[11px]">
      {when && <span className="text-white/75">{when}</span>}
      {left && (
        <span className="font-medium tabular-nums text-peri" role="timer" aria-label={`Tiempo para ${ev.title}`}>
          {left}
        </span>
      )}
      {NEXT_EVENT.countUrl && (
        <span className="flex items-center gap-1.5">
          <span className="inline-block h-[6px] w-[6px] rounded-full bg-[#73edaa] shadow-[0_0_5px_#73edaa]" />
          <span className="font-semibold text-white">{count ?? '—'}</span>
          <span className="text-white/65">inscritas</span>
        </span>
      )}
    </span>
  )

  return (
    <div className="fixed inset-x-4 bottom-4 z-50 md:hidden" role="dialog" aria-modal="false" aria-label="Próximo evento">
      <div
        className="animate-rise rounded-[22px] border border-peri/28 p-3 shadow-[0_10px_30px_rgba(0,0,0,0.5)]"
        style={{
          background:
            'linear-gradient(135deg, rgba(100,17,173,0.55), rgba(255,87,149,0.18)), rgba(26,8,51,0.96)',
        }}
      >
        {!expanded ? (
          <div className="flex items-center gap-2">
            <button
              type="button"
              onClick={() => setExpanded(true)}
              className="min-w-0 flex-1 cursor-pointer border-none bg-transparent p-0 text-left"
            >
              <span className="block text-[9px] uppercase tracking-[0.3em] text-peri/80">Próximo evento</span>
              <span className="mt-0.5 block font-display text-base font-extrabold text-white">{ev.title}</span>
              <span className="mt-1 block">{meta}</span>
            </button>
            {formUrl ? (
              <a
                href={formUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="shrink-0 rounded-full bg-[linear-gradient(135deg,#7c22c7,#47126b)] px-3.5 py-2.5 text-[12px] font-semibold uppercase tracking-[0.06em] text-white shadow-[0_0_18px_rgba(124,34,199,0.5)]"
              >
                Registrarme
              </a>
            ) : (
              <button
                type="button"
                disabled
                className="shrink-0 cursor-not-allowed rounded-full border border-white/15 bg-white/[0.06] px-3.5 py-2.5 text-[12px] font-semibold uppercase tracking-[0.06em] text-white/55"
              >
                Registro cerrado
              </button>
            )}
            <button
              type="button"
              onClick={dismiss}
              aria-label="Cerrar"
              className="flex h-11 w-9 shrink-0 cursor-pointer items-center justify-center border-none bg-transparent text-lg text-white/70"
            >
              ✕
            </button>
          </div>
        ) : (
          <div className="px-2 pb-2 pt-1">
            <div className="mx-auto mb-3 h-1 w-10 rounded-full bg-white/30" />
            <div className="flex items-start justify-between gap-3">
              <span className="text-[10px] uppercase tracking-[0.3em] text-peri/85">Próximo evento</span>
              <button
                type="button"
                onClick={dismiss}
                aria-label="Cerrar"
                className="-mt-2 flex h-11 w-11 cursor-pointer items-center justify-center border-none bg-transparent text-xl text-white/70"
              >
                ✕
              </button>
            </div>
            <p className="mb-2 mt-2 font-display text-2xl font-extrabold leading-tight text-white">{ev.title}</p>
            <div>{meta}</div>
            {formUrl ? (
              <a
                href={formUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="mt-4 block rounded-full bg-[linear-gradient(135deg,#7c22c7,#47126b)] py-3.5 text-center text-[12px] font-medium uppercase tracking-[0.2em] text-white shadow-[0_0_24px_rgba(124,34,199,0.45)]"
              >
                Registrarme ↗
              </a>
            ) : (
              <button
                type="button"
                disabled
                className="mt-4 block w-full cursor-not-allowed rounded-full border border-white/15 bg-white/[0.06] py-3.5 text-center text-[12px] font-medium uppercase tracking-[0.2em] text-white/55"
              >
                Registro cerrado
              </button>
            )}
            <Link
              href="/proyectos"
              className="mt-3 block rounded-full border border-peri/30 py-3 text-center text-[12px] font-medium uppercase tracking-[0.2em] text-white/85"
            >
              Ver evento
            </Link>
            <button
              type="button"
              onClick={dismiss}
              className="mx-auto mt-3 block cursor-pointer border-none bg-transparent text-[13px] text-white/55"
            >
              Solo estoy explorando
            </button>
          </div>
        )}
      </div>
    </div>
  )
}
