'use client'

import { useRef } from 'react'
import { CountdownCells, useCountdown } from './Countdown'
import { Button, Container, Heading, MicroLabel } from './ui'
import { NEXT_EVENT, nextEvent } from '@/lib/site'
import { eventWhen } from '@/lib/eventDate'
import { useRegistrationCount } from '@/lib/useRegistrationCount'
import { FLIP_COUNTDOWN } from '@/lib/motion-flags'

/** "Próximo evento" panel at the top of Proyectos. Reads NEXT_EVENT; renders nothing without one. */
export default function NextEventPanel() {
  const ref = useRef<HTMLElement>(null)
  const ev = nextEvent()
  const state = useCountdown(NEXT_EVENT?.date ?? null, ref)
  const count = useRegistrationCount(NEXT_EVENT?.countUrl ?? null)

  if (!NEXT_EVENT || !ev) return null

  const when = NEXT_EVENT.date ? eventWhen(NEXT_EVENT.date, NEXT_EVENT.endTime, NEXT_EVENT.venue) : NEXT_EVENT.venue
  const closed = state === 'done' || !NEXT_EVENT.registrationOpen
  const showCountdown = state !== 'none' && state !== 'done'

  return (
    <section ref={ref} id="proximo-evento" aria-labelledby="proximo-evento-title" className="scroll-mt-24 pb-20">
      <Container>
        <div className="glass relative overflow-hidden rounded-[2rem] p-8 sm:p-12 lg:p-16">
          <div
            className="pointer-events-none absolute inset-0"
            style={{ background: 'linear-gradient(135deg, rgba(100,17,173,0.4) 0%, rgba(144,102,210,0.12) 60%, transparent 100%)' }}
            aria-hidden="true"
          />
          <div className="relative grid gap-12 lg:grid-cols-[1.15fr_1fr] lg:items-center">
            <div>
              <MicroLabel className="mb-6">Próximo evento</MicroLabel>
              <div id="proximo-evento-title">
                <Heading className="text-[clamp(2.4rem,5.5vw,4.25rem)]">{ev.title}</Heading>
              </div>
              {ev.tagline && <p className="mt-4 mb-0 text-[17px] font-light leading-relaxed text-peri/90">{ev.tagline}</p>}
              {when && (
                <p className="mt-6 mb-0 text-[13px] font-medium uppercase tracking-[0.18em] text-white/85">{when}</p>
              )}
              {ev.description && (
                <p className="mt-6 mb-0 max-w-xl text-[16px] font-light leading-[1.75] text-white/75">{ev.description}</p>
              )}
              {ev.chips && ev.chips.length > 0 && (
                <ul className="mt-8 mb-0 flex list-none flex-wrap gap-2.5 p-0">
                  {ev.chips.map((c) => (
                    <li key={c} className="glass-strong rounded-full px-4 py-2 text-[13px] text-white/85">
                      {c}
                    </li>
                  ))}
                </ul>
              )}
            </div>

            <div className="flex flex-col items-center gap-10">
              {showCountdown && (
                <CountdownCells state={state} label={`Tiempo para ${ev.title}`} variant={FLIP_COUNTDOWN ? 'flip' : 'plain'} />
              )}
              {NEXT_EVENT.countUrl && (
                <p className="m-0 flex items-center gap-2 text-[14px]">
                  <span className="inline-block h-[7px] w-[7px] rounded-full bg-[#73edaa] shadow-[0_0_5px_#73edaa]" />
                  <span className="font-semibold text-white">{count ?? '—'}</span>
                  <span className="text-white/65">inscritas</span>
                </p>
              )}
              {closed || !ev.formUrl ? (
                <button
                  type="button"
                  disabled
                  className="cursor-not-allowed rounded-full border border-white/15 bg-white/[0.06] px-9 py-3.5 text-[12px] font-medium uppercase tracking-[0.2em] text-white/55"
                >
                  Registro cerrado
                </button>
              ) : (
                <Button href={ev.formUrl} external>
                  Registrarme
                </Button>
              )}
            </div>
          </div>
        </div>
      </Container>
    </section>
  )
}
