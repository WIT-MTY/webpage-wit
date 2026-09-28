export type CelestialKind = 'star' | 'burst' | 'constellation' | 'planet' | 'diamond' | 'moon'

export const CELESTIAL_KINDS: CelestialKind[] = ['star', 'burst', 'constellation', 'planet', 'diamond', 'moon']

/** Same input always yields the same icon, so a member keeps their star between visits. */
export function celestialFor(seed: string): CelestialKind {
  let h = 0
  for (let i = 0; i < seed.length; i++) h = (h * 31 + seed.charCodeAt(i)) | 0
  return CELESTIAL_KINDS[Math.abs(h) % CELESTIAL_KINDS.length]
}

export default function Celestial({
  kind,
  size = 28,
  className = '',
}: {
  kind: CelestialKind
  size?: number
  className?: string
}) {
  const common = {
    width: size,
    height: size,
    viewBox: '0 0 32 32',
    fill: 'none',
    'aria-hidden': true,
    className,
  } as const

  switch (kind) {
    case 'star':
      return (
        <svg {...common}>
          <path d="M16 2c1 7.5 6.5 13 14 14-7.5 1-13 6.5-14 14-1-7.5-6.5-13-14-14 7.5-1 13-6.5 14-14z" fill="currentColor" />
        </svg>
      )
    case 'burst':
      return (
        <svg {...common} stroke="currentColor" strokeWidth={2} strokeLinecap="round">
          <path d="M16 3v26M3 16h26M6.8 6.8l18.4 18.4M25.2 6.8L6.8 25.2" />
          <circle cx="16" cy="16" r="2.5" fill="currentColor" stroke="none" />
        </svg>
      )
    case 'constellation':
      return (
        <svg {...common}>
          <path d="M9 23l7-15 8 10-15 5z" stroke="currentColor" strokeWidth={1.2} opacity={0.55} />
          <circle cx="16" cy="8" r="2.6" fill="currentColor" />
          <circle cx="24" cy="18" r="2" fill="currentColor" />
          <circle cx="9" cy="23" r="2.2" fill="currentColor" />
        </svg>
      )
    case 'planet':
      return (
        <svg {...common}>
          <ellipse cx="16" cy="16" rx="14" ry="4.5" stroke="currentColor" strokeWidth={1.6} opacity={0.7} />
          <circle cx="16" cy="16" r="7" fill="currentColor" />
        </svg>
      )
    case 'diamond':
      return (
        <svg {...common}>
          <path d="M16 3l11 13-11 13L5 16 16 3z" fill="currentColor" opacity={0.9} />
          <path d="M16 9l5.8 7-5.8 7-5.8-7L16 9z" fill="#fff" opacity={0.25} />
        </svg>
      )
    case 'moon':
      return (
        <svg {...common}>
          <path d="M20.5 4.5A12 12 0 1 0 27.5 21 9.5 9.5 0 0 1 20.5 4.5z" fill="currentColor" />
        </svg>
      )
  }
}
