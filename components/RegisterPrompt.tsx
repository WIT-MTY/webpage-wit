'use client'

import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { useEffect, useState } from 'react'
import { NEXT_EVENT, nextEvent } from '@/lib/site'
import { useRegistrationCount } from '@/lib/useRegistrationCount'

/*
  Mobile-only registration prompt on Inicio.

  Compact by default: a slim bar above the bottom edge, clear of the hero
  buttons. Tapping the text expands it to a full bottom sheet.

  Rules:
    - Appears 2.5s after load, or once the visitor scrolls ~30%.
    - Only when there is an upcoming event with registration open.
    - Never if it was dismissed this visit, or if the visitor is already
      on /proyectos.
    - Non-blocking: no dark overlay, the page keeps scrolling, no focus trap.
    - "Registrarme" goes to /proyectos#<slug>, where the carousel jumps to
      that event's card.
*/
export default function RegisterPrompt() {
  const pathname = usePathname()
  const [visible, setVisible] = useState(false)
  const [expanded, setExpanded] = useState(false)
  const ev = nextEvent()
  const count = useRegistrationCount(NEXT_EVENT?.countUrl ?? null)

  const eligible = pathname === '/' && Boolean(ev) && Boolean(NEXT_EVENT?.registrationOpen)

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

  if (!eligible || !visible || !ev) return null

  const dismiss = () => {
    sessionStorage.setItem('register-prompt-dismissed', '1')
    setVisible(false)
  }
  const days = NEXT_EVENT?.date
    ? Math.max(0, Math.ceil((new Date(NEXT_EVENT.date).getTime() - Date.now()) / 86_400_000))
    : null

  const meta = (
    <span className="flex items-center gap-1.5 text-[11px]">
      <span className="inline-block h-[6px] w-[6px] rounded-full bg-[#73edaa] shadow-[0_0_5px_#73edaa]" />
      <span className="font-semibold text-white">{count ?? '—'}</span>
      <span className="text-white/65">inscritas</span>
    </span>
  )

  return (
    <div className="fixed inset-x-4 bottom-4 z-50 md:hidden" role="dialog" aria-modal="false" aria-label="Registro al próximo evento">
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
              className="flex-1 cursor-pointer border-none bg-transparent p-0 text-left"
            >
              <span className="block text-[9px] uppercase tracking-[0.3em] text-peri/80">¿Vienes a registrarte?</span>
              <span className="mt-0.5 block font-display text-base font-extrabold text-white">{ev.title}</span>
              <span className="mt-1 flex items-center gap-2">
                {days !== null && <span className="text-[11px] font-medium text-peri">En {days} días</span>}
                {meta}
              </span>
            </button>
            <Link
              href={`/proyectos#${ev.slug}`}
              className="rounded-full bg-[linear-gradient(135deg,#7c22c7,#47126b)] px-3.5 py-2.5 text-[12px] font-semibold uppercase tracking-[0.06em] text-white shadow-[0_0_18px_rgba(124,34,199,0.5)]"
            >
              Registrarme
            </Link>
            <button
              type="button"
              onClick={dismiss}
              aria-label="Cerrar"
              className="flex h-11 w-9 cursor-pointer items-center justify-center border-none bg-transparent text-lg text-white/70"
            >
              ✕
            </button>
          </div>
        ) : (
          <div className="px-2 pb-2 pt-1">
            <div className="mx-auto mb-3 h-1 w-10 rounded-full bg-white/30" />
            <div className="flex items-start justify-between gap-3">
              <span className="text-[10px] uppercase tracking-[0.3em] text-peri/85">¿Vienes a registrarte?</span>
              <button
                type="button"
                onClick={dismiss}
                aria-label="Cerrar"
                className="-mt-2 flex h-11 w-11 cursor-pointer items-center justify-center border-none bg-transparent text-xl text-white/70"
              >
                ✕
              </button>
            </div>
            <p className="mb-1 mt-2 font-display text-2xl font-extrabold leading-tight text-white">{ev.title}</p>
            <span className="flex items-center gap-3">
              {days !== null && <span className="text-[13px] font-medium text-peri">En {days} días</span>}
              {meta}
            </span>
            <Link
              href={`/proyectos#${ev.slug}`}
              className="mt-4 block rounded-full bg-[linear-gradient(135deg,#7c22c7,#47126b)] py-3.5 text-center text-[12px] font-medium uppercase tracking-[0.2em] text-white shadow-[0_0_24px_rgba(124,34,199,0.45)]"
            >
              Registrarme →
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
