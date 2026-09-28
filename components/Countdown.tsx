'use client'

import { useEffect, useState } from 'react'

type Parts = { d: number; h: number; m: number; s: number }

function diff(target: number): Parts | null {
  const ms = target - Date.now()
  if (ms <= 0) return null
  return {
    d: Math.floor(ms / 86_400_000),
    h: Math.floor((ms / 3_600_000) % 24),
    m: Math.floor((ms / 60_000) % 60),
    s: Math.floor((ms / 1000) % 60),
  }
}

/** Renders nothing time-based on the server, so there is no hydration mismatch. */
export default function Countdown({ target }: { target: string | null }) {
  const [parts, setParts] = useState<Parts | null | 'pending'>('pending')

  useEffect(() => {
    if (!target) return
    const t = new Date(target).getTime()
    setParts(diff(t))
    const id = window.setInterval(() => setParts(diff(t)), 1000)
    return () => window.clearInterval(id)
  }, [target])

  if (!target) {
    return <p className="m-0 font-display text-[clamp(1.75rem,4vw,2.5rem)] font-bold text-peri">Próximamente</p>
  }
  if (parts === null) {
    return <p className="m-0 font-display text-[clamp(1.75rem,4vw,2.5rem)] font-bold text-peri">¡Aplicaciones abiertas!</p>
  }

  const cells: [keyof Parts, string][] = [
    ['d', 'Días'],
    ['h', 'Horas'],
    ['m', 'Min'],
    ['s', 'Seg'],
  ]

  return (
    <div className="flex items-start justify-center gap-2 sm:gap-4" role="timer" aria-label="Tiempo para que abran las aplicaciones">
      {cells.map(([k, label], i) => (
        <div key={k} className="flex items-start gap-2 sm:gap-4">
          <div className="flex flex-col items-center">
            <span className="glass-strong flex h-[72px] w-[68px] items-center justify-center rounded-2xl font-display text-3xl font-extrabold tabular-nums text-white sm:h-24 sm:w-24 sm:text-5xl">
              {parts === 'pending' ? '–' : String(parts[k]).padStart(k === 'd' ? 1 : 2, '0')}
            </span>
            <span className="mt-3 text-[10px] uppercase tracking-[0.3em] text-white/50">{label}</span>
          </div>
          {i < cells.length - 1 && <span className="mt-6 text-2xl text-peri/40 sm:mt-8" aria-hidden="true">:</span>}
        </div>
      ))}
    </div>
  )
}
