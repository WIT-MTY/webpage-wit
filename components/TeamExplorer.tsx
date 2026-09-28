'use client'

import Image from 'next/image'
import { useMemo, useState } from 'react'
import Celestial, { celestialFor } from './Celestial'
import { AREAS, GENERATIONS, MEMBERS, areaLabel, roleLabel, type AreaId, type Member } from '@/data/members'

type Size = 'lg' | 'md' | 'sm'

function Avatar({ m, size, seed }: { m: Member; size: Size; seed: string }) {
  const px = size === 'lg' ? 104 : size === 'md' ? 84 : 68
  return (
    <span
      className="relative flex shrink-0 items-center justify-center overflow-hidden rounded-full text-peri"
      style={{
        width: px,
        height: px,
        background: 'radial-gradient(circle at 32% 28%, rgba(124,34,199,0.55), rgba(45,8,90,0.9) 70%)',
        boxShadow: '0 0 0 1px rgba(198,200,238,0.18), 0 0 30px rgba(124,34,199,0.35)',
      }}
    >
      {m.photo ? (
        <Image src={m.photo} alt="" fill sizes={`${px}px`} className="object-cover" />
      ) : (
        <Celestial kind={celestialFor(seed)} size={Math.round(px * 0.36)} />
      )}
    </span>
  )
}

function MemberCard({
  m,
  seed,
  size = 'sm',
  onSelect,
  highlight,
  delay = 0,
}: {
  m: Member
  seed: string
  size?: Size
  onSelect?: () => void
  highlight?: boolean
  delay?: number
}) {
  const body = (
    <>
      <Avatar m={m} size={size} seed={seed} />
      <span className="mt-5 block font-display text-[19px] font-bold leading-tight text-white">{m.name}</span>
      <span className="mt-1.5 block text-[14px] font-light text-white/65">{roleLabel(m)}</span>
    </>
  )

  const cls = `glass animate-rise flex h-full w-full flex-col items-center rounded-3xl px-5 py-7 text-center ${
    highlight ? 'border-peri/45 shadow-[0_0_40px_rgba(124,34,199,0.35)]' : ''
  }`

  if (onSelect) {
    return (
      <button
        type="button"
        onClick={onSelect}
        className={`${cls} cursor-pointer transition-colors duration-200 hover:border-peri/40 hover:bg-white/[0.09]`}
        style={{ animationDelay: `${delay}ms` }}
        aria-label={`${m.name}, ${roleLabel(m)}. Ver equipo de ${areaLabel(m.area)}`}
      >
        {body}
      </button>
    )
  }
  return (
    <div className={cls} style={{ animationDelay: `${delay}ms` }}>
      {body}
    </div>
  )
}

function Chip({ active, onClick, children }: { active: boolean; onClick: () => void; children: React.ReactNode }) {
  return (
    <button
      type="button"
      onClick={onClick}
      aria-pressed={active}
      className={`cursor-pointer whitespace-nowrap rounded-full px-5 py-2.5 text-[13px] font-medium tracking-[0.04em] transition-all duration-200 ${
        active
          ? 'text-white shadow-[0_0_24px_rgba(124,34,199,0.55)] bg-[linear-gradient(135deg,#7c22c7_0%,#47126b_100%)]'
          : 'glass text-white/70 hover:text-white'
      }`}
    >
      {children}
    </button>
  )
}

export default function TeamExplorer() {
  const [generation, setGeneration] = useState(GENERATIONS[0])
  const [area, setArea] = useState<AreaId | null>(null)

  const gen = useMemo(() => MEMBERS.filter((m) => m.generation === generation), [generation])
  const leadership = gen.filter((m) => m.role === 'presidencia' || m.role === 'vicepresidencia')
  const directors = AREAS.map((a) => gen.find((m) => m.role === 'director' && m.area === a.id)).filter(Boolean) as Member[]
  const director = area ? gen.find((m) => m.role === 'director' && m.area === area) : undefined
  const coordinators = area ? gen.filter((m) => m.role === 'coordinador' && m.area === area) : []

  // Stable seed per person so their icon never changes between renders.
  const seed = (m: Member) => `${m.name}|${m.generation}|${m.role}|${m.area ?? ''}|${gen.indexOf(m)}`

  const visibleCount = leadership.length + (area ? (director ? 1 : 0) + coordinators.length : directors.length)

  return (
    <div>
      {/* Generation */}
      <div className="flex flex-col items-center gap-4">
        <span className="text-[11px] uppercase tracking-[0.3em] text-peri/60" id="gen-label">
          Generación
        </span>
        <div className="flex flex-wrap justify-center gap-2" role="group" aria-labelledby="gen-label">
          {GENERATIONS.map((g) => (
            <Chip
              key={g}
              active={g === generation}
              onClick={() => {
                setGeneration(g)
                setArea(null)
              }}
            >
              {g.replace('-', '–')}
            </Chip>
          ))}
        </div>
      </div>

      <p className="sr-only" aria-live="polite">
        Generación {generation}, {area ? areaLabel(area) : 'todas las áreas'}: {visibleCount} integrantes
      </p>

      {/* Presidency, always visible for the selected generation */}
      <div key={`lead-${generation}`} className="mx-auto mt-12 grid max-w-2xl gap-5 sm:grid-cols-2">
        {leadership.map((m, i) => (
          <MemberCard key={seed(m)} m={m} seed={seed(m)} size="lg" delay={i * 60} />
        ))}
      </div>

      {/* Area filter */}
      <div className="mt-16 flex flex-col items-center gap-4">
        <span className="text-[11px] uppercase tracking-[0.3em] text-peri/60" id="area-label">
          Áreas
        </span>
        <div className="flex max-w-4xl flex-wrap justify-center gap-2" role="group" aria-labelledby="area-label">
          <Chip active={area === null} onClick={() => setArea(null)}>
            Todas
          </Chip>
          {AREAS.map((a) => (
            <Chip key={a.id} active={area === a.id} onClick={() => setArea(a.id)}>
              {a.label}
            </Chip>
          ))}
        </div>
      </div>

      {/* Directors grid, or one area's director + coordinators */}
      <div key={`${generation}-${area ?? 'all'}`} className="mt-12">
        {area === null ? (
          <ul className="m-0 grid list-none grid-cols-2 gap-4 p-0 md:grid-cols-3 lg:grid-cols-6">
            {directors.map((m, i) => (
              <li key={seed(m)}>
                <MemberCard m={m} seed={seed(m)} onSelect={() => setArea(m.area!)} delay={i * 45} />
              </li>
            ))}
          </ul>
        ) : (
          <div className="flex flex-col items-center">
            {director ? (
              <div className="w-full max-w-xs">
                <MemberCard m={director} seed={seed(director)} size="md" highlight />
              </div>
            ) : (
              <p className="m-0 text-white/60">Dirección por anunciar.</p>
            )}

            {coordinators.length > 0 ? (
              <>
                <div className="my-8 h-10 w-px" style={{ background: 'linear-gradient(to bottom, rgba(198,200,238,0.5), transparent)' }} />
                <ul className="m-0 flex w-full max-w-4xl list-none flex-wrap justify-center gap-4 p-0">
                  {coordinators.map((m, i) => (
                    <li key={seed(m)} className="w-[calc(50%-0.5rem)] md:w-[calc(33.333%-0.667rem)] lg:w-[calc(25%-0.75rem)]">
                      <MemberCard m={m} seed={seed(m)} delay={80 + i * 45} />
                    </li>
                  ))}
                </ul>
              </>
            ) : (
              <p className="mt-8 mb-0 text-center text-[15px] font-light text-white/55">
                Pronto conocerás al equipo de coordinación de esta área.
              </p>
            )}
          </div>
        )}
      </div>
    </div>
  )
}
