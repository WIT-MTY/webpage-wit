'use client'

import { useMemo, useState } from 'react'
import MemberCard from './MemberCard'
import { AREAS, GENERATIONS, MEMBERS, areaLabel, isShown, type AreaId, type Member } from '@/data/members'

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

  const gen = useMemo(() => MEMBERS.filter((m) => isShown(m) && m.generation === generation), [generation])
  const leadership = gen.filter((m) => m.role === 'presidencia' || m.role === 'vicepresidencia')
  const directors = AREAS.map((a) => gen.find((m) => m.role === 'director' && m.area === a.id)).filter(Boolean) as Member[]
  const director = area ? gen.find((m) => m.role === 'director' && m.area === area) : undefined
  const coordinators = area ? gen.filter((m) => m.role === 'coordinador' && m.area === area) : []
  // Only areas with someone to show get a chip.
  const areas = AREAS.filter((a) => gen.some((m) => m.area === a.id))
  const isNewest = generation === GENERATIONS[0]

  // Stable seed per person so their icon never changes between renders.
  const seed = (m: Member) => `${m.name}|${m.generation}|${m.role}|${m.area ?? ''}|${gen.indexOf(m)}`

  const visibleCount = leadership.length + (area ? (director ? 1 : 0) + coordinators.length : directors.length)

  if (GENERATIONS.length === 0) {
    return <p className="m-0 text-center text-[15px] font-light text-white/60">Pronto conocerás a nuestro equipo.</p>
  }

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

      {/* Presidency */}
      <div key={`lead-${generation}`} className="mx-auto mt-12 grid max-w-2xl gap-5 sm:grid-cols-2">
        {leadership.map((m, i) => (
          <MemberCard key={seed(m)} m={m} seed={seed(m)} size="lg" delay={i * 60} />
        ))}
      </div>

      {/* Area filter */}
      {areas.length > 0 && (
      <div className="mt-16 flex flex-col items-center gap-4">
        <span className="text-[11px] uppercase tracking-[0.3em] text-peri/60" id="area-label">
          Áreas
        </span>
        <div className="flex max-w-4xl flex-wrap justify-center gap-2" role="group" aria-labelledby="area-label">
          <Chip active={area === null} onClick={() => setArea(null)}>
            Todas
          </Chip>
          {areas.map((a) => (
            <Chip key={a.id} active={area === a.id} onClick={() => setArea(a.id)}>
              {a.label}
            </Chip>
          ))}
        </div>
      </div>
      )}

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
                <div
                  className="my-8 h-10 w-px"
                  style={{ background: 'linear-gradient(to bottom, rgba(198,200,238,0.5), transparent)' }}
                />
                <ul className="m-0 flex w-full max-w-4xl list-none flex-wrap justify-center gap-4 p-0">
                  {coordinators.map((m, i) => (
                    <li key={seed(m)} className="w-[calc(50%-0.5rem)] md:w-[calc(33.333%-0.667rem)] lg:w-[calc(25%-0.75rem)]">
                      <MemberCard m={m} seed={seed(m)} delay={80 + i * 45} />
                    </li>
                  ))}
                </ul>
              </>
            ) : isNewest ? (
              <p className="mt-8 mb-0 text-center text-[15px] font-light text-white/55">
                Pronto conocerás al equipo de coordinación de esta área.
              </p>
            ) : null}
          </div>
        )}
      </div>
    </div>
  )
}