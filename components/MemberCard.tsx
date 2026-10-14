'use client'

import { useEffect, useRef, useState } from 'react'
import Image from 'next/image'
import FlipCard from '@/components/FlipCard'
import { areaLabel, initials, type Member } from '@/data/members'
import { SHINE_TILT } from '@/lib/motion-flags'
import { onceInView } from '@/lib/inView'
import { touchMotion } from '@/lib/touch'
import shine from './Shine.module.css'

type Size = 'lg' | 'md' | 'sm' | 'xs'

export function Avatar({ m, size }: { m: Member; size: Size }) {
  const px = size === 'lg' ? 104 : size === 'md' ? 84 : size === 'sm' ? 68 : 52
  return (
    <span
      className="relative flex shrink-0 items-center justify-center overflow-hidden rounded-full font-display font-bold text-white"
      style={{
        width: px,
        height: px,
        fontSize: Math.round(px * 0.34),
        background: 'linear-gradient(135deg, #7c22c7 0%, #47126b 100%)',
        boxShadow: '0 0 0 1px rgba(198,200,238,0.18), 0 0 30px rgba(124,34,199,0.35)',
      }}
    >
      {m.photo ? (
        // Square headshot cropped to the circle; fixed size, so no layout shift.
        <Image
          src={m.photo}
          alt={`Foto de ${m.name}`}
          width={px}
          height={px}
          sizes={`${px}px`}
          loading="lazy"
          className="h-full w-full object-cover"
        />
      ) : (
        <span aria-hidden="true">{initials(m)}</span>
      )}
    </span>
  )
}

interface MemberCardProps {
  m: Member
  seed: string
  size?: Size
  onSelect?: () => void
  highlight?: boolean
  delay?: number
}

export default function MemberCard({
  m,
  seed,
  size = 'sm',
  onSelect,
  highlight,
  delay = 0,
}: MemberCardProps) {
  const [side, setSide] = useState<'front' | 'back'>('front')
  const frontRef = useRef<HTMLDivElement>(null)

  // Touch devices have no hover glint: one pass on first view instead, plus a
  // tap press when the whole card is a button (onSelect).
  const pressable = Boolean(onSelect)
  useEffect(() => {
    const front = frontRef.current
    if (!front || !touchMotion()) return
    if (pressable) front.classList.add(shine.press)
    if (!SHINE_TILT) return () => front.classList.remove(shine.press)
    const strip = front.querySelector<HTMLElement>(`.${shine.strip}`)
    const onEnd = () => front.classList.remove(shine.played)
    strip?.addEventListener('animationend', onEnd)
    const stop = onceInView(front, () => front.classList.add(shine.played), 0.6)
    return () => {
      stop()
      strip?.removeEventListener('animationend', onEnd)
      front.classList.remove(shine.press, shine.played)
    }
  }, [pressable])
  const hasBio = Boolean(m.bio)
  const compact = size === 'xs'
  const area = areaLabel(m.area)
  // Area, then the optional title under it.
  const roleText = [area, m.title].filter(Boolean).join(' · ')

  const cardContent = (
    <>
      <Avatar m={m} size={size} />
      <span
        className={`block w-full break-words hyphens-auto font-display font-bold leading-tight text-white ${
          compact ? 'mt-3 text-[15px]' : 'mt-4 text-[19px]'
        }`}
      >
        {m.name}
      </span>
      {area && (
        <span className={`mt-1.5 block w-full break-words font-light text-white/65 ${compact ? 'text-[12px]' : 'text-[14px]'}`}>
          {area}
        </span>
      )}
      {m.title && (
        <span className={`mt-0.5 block w-full break-words font-light text-white/50 ${compact ? 'text-[12px]' : 'text-[13px]'}`}>
          {m.title}
        </span>
      )}
    </>
  )

  return (
    <div className="animate-rise h-full w-full" style={{ animationDelay: `${delay}ms` }}>
      <FlipCard
        side={side}
        className="h-full w-full"
        faces={{
          /* ── FRONT SIDE ────────────────────────────────── */
          front: (
            <div
              ref={frontRef}
              className={`${shine.host} glass flex h-full w-full flex-col items-center justify-between rounded-3xl text-center ${
                compact ? 'px-3 py-5' : 'px-5 py-7'
              } ${
                highlight ? 'border-peri/45 shadow-[0_0_40px_rgba(124,34,199,0.35)]' : ''
              }`}
            >
              {/* Glint: one light pass on hover or focus. */}
              <span className={shine.track} aria-hidden="true">
                <span className={shine.strip} />
              </span>
              {onSelect ? (
                <button
                  type="button"
                  onClick={onSelect}
                  className="flex w-full cursor-pointer flex-col items-center text-center transition-opacity hover:opacity-90"
                  aria-label={`${m.name}, ${roleText}.`}
                >
                  {cardContent}
                </button>
              ) : (
                <div className="flex w-full flex-col items-center text-center">
                  {cardContent}
                </div>
              )}

              {/* Bottom "Dónde está hoy?" Button */}
              <div className={`${compact ? 'mt-4' : 'mt-6'} border-t border-white/10 pt-3 w-full flex justify-center`}>
                {hasBio ? (
                  <button
                    type="button"
                    onClick={(e) => {
                      e.stopPropagation()
                      setSide('back')
                    }}
                    className="group inline-flex items-center gap-2 cursor-pointer text-[12px] font-medium tracking-wide text-peri transition-colors hover:text-white focus:outline-none focus-visible:underline"
                  >
                    <span
                      className="h-1.5 w-1.5 rounded-full bg-peri shadow-[0_0_8px_rgba(198,200,238,0.9)]"
                      aria-hidden="true"
                    />
                    <span>¿Dónde está hoy?</span>
                    <span
                      className="inline-block transition-transform duration-200 group-hover:translate-x-0.5"
                      aria-hidden="true"
                    >
                      →
                    </span>
                  </button>
                ) : (
                  <button
                    type="button"
                    aria-disabled="true"
                    tabIndex={-1}
                    className="inline-flex items-center gap-2 text-[12px] font-light tracking-wide text-white/35 cursor-not-allowed select-none"
                  >
                    <span
                      className="h-1.5 w-1.5 rounded-full border border-white/30"
                      aria-hidden="true"
                    />
                    <span>¿Dónde está hoy?</span>
                  </button>
                )}
              </div>
            </div>
          ),

          /* ── BACK SIDE ─────────────────────────────────── */
          back: (
            <div className="glass flex h-full w-full flex-col justify-between rounded-3xl border border-peri/30 bg-purple-950/50 p-6 text-left backdrop-blur-md">
              <div>
                {/* Small Star + "Dónde está hoy" Label */}
                <div className="flex items-center gap-1.5 text-peri">
                  <svg className="h-3.5 w-3.5 fill-current" viewBox="0 0 24 24" aria-hidden="true">
                    <path d="M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z" />
                  </svg>
                  <span className="text-[11px] font-semibold uppercase tracking-[0.2em] text-peri/90">
                    Dónde está hoy
                  </span>
                </div>

                {/* Name + Role */}
                <div className="mt-3">
                  <span className="block font-display text-[17px] font-bold leading-tight text-white">
                    {m.name}
                  </span>
                  <span className="block text-[12px] font-light text-white/65">
                    {roleText}
                  </span>
                </div>

                {/* Member Bio */}
                <p className="mt-3 text-[13px] font-light leading-relaxed text-white/85">
                  {m.bio}
                </p>
              </div>

              {/* Bottom Actions: "← Volver" & Optional LinkedIn */}
              <div className="mt-5 flex items-center justify-between border-t border-white/10 pt-3">
                <button
                  type="button"
                  onClick={() => setSide('front')}
                  className="cursor-pointer text-[12px] font-medium text-white/70 transition-colors hover:text-white focus:outline-none focus-visible:underline"
                >
                  ← Volver
                </button>

                {m.linkedin && (
                  <a
                    href={m.linkedin}
                    target="_blank"
                    rel="noopener noreferrer"
                    onClick={(e) => e.stopPropagation()}
                    className="inline-flex items-center gap-1 text-[12px] font-medium text-peri transition-colors hover:text-white"
                  >
                    LinkedIn
                    <svg className="h-3 w-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14"
                      />
                    </svg>
                  </a>
                )}
              </div>
            </div>
          ),
        }}
      />
    </div>
  )
}