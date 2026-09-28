/*
  Faint twinkling stars for the Integrantes page. Positions are fixed
  (no randomness), so server and client render identically. Only opacity
  animates, which is compositor-only and effectively free.
*/
const STARS = Array.from({ length: 34 }, (_, i) => {
  const x = (i * 37.7 + 11) % 100
  const y = (i * 61.3 + 7) % 100
  const size = i % 5 === 0 ? 2.5 : i % 3 === 0 ? 1.8 : 1.2
  return { x, y, size, delay: (i * 0.73) % 5, dur: 3 + (i % 4) }
})

export default function StarField({ className = '' }: { className?: string }) {
  return (
    <div className={`pointer-events-none absolute inset-0 overflow-hidden ${className}`} aria-hidden="true" data-ambient-group="">
      {STARS.map((s, i) => (
        <span
          key={i}
          data-ambient=""
          className="absolute rounded-full bg-white"
          style={{
            left: `${s.x}%`,
            top: `${s.y}%`,
            width: s.size,
            height: s.size,
            boxShadow: s.size > 2 ? '0 0 6px rgba(198,200,238,0.9)' : undefined,
            animation: `twinkle ${s.dur}s ease-in-out ${s.delay}s infinite`,
          }}
        />
      ))}
    </div>
  )
}
