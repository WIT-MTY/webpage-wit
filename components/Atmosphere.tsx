/*
  The landing page's five depth orbs, rebuilt as radial gradients.

  The original used solid circles with filter: blur(100–200px). Those are the most
  expensive thing a browser can paint, and they were the main source of lag.
  A radial gradient that fades to transparent produces the same soft glow with
  zero filter cost. This layer is position: fixed and never animates, so the
  browser paints it once and simply composites it while you scroll.
*/

const ORBS: React.CSSProperties[] = [
  // Central large glow
  { top: '45%', left: '50%', width: 1500, height: 1500, marginLeft: -750, marginTop: -750, color: 'rgba(71,18,107,0.55)' },
  // Upper-left corner
  { top: -440, left: -440, width: 1280, height: 1280, color: 'rgba(45,8,90,0.65)' },
  // Lower-right pink accent
  { bottom: -340, right: -320, width: 1060, height: 1060, color: 'rgba(122,16,80,0.45)' },
  // Small bright crown
  { top: -240, left: '50%', width: 820, height: 820, marginLeft: -410, color: 'rgba(139,48,208,0.28)' },
  // Bottom-left cool accent
  { bottom: -120, left: -140, width: 640, height: 640, color: 'rgba(58,15,128,0.35)' },
]

export default function Atmosphere() {
  return (
    <div className="pointer-events-none fixed inset-0 -z-10 overflow-hidden bg-night" aria-hidden="true">
      {ORBS.map(({ color, ...pos }, i) => (
        <div
          key={i}
          className="absolute rounded-full"
          style={{
            ...pos,
            background: `radial-gradient(circle, ${color} 0%, ${String(color).replace(/[\d.]+\)$/, (m) => `${parseFloat(m) * 0.45})`)} 32%, transparent 68%)`,
          }}
        />
      ))}
      {/* Vignette */}
      <div
        className="absolute inset-0"
        style={{ background: 'radial-gradient(ellipse 80% 70% at 50% 50%, transparent 20%, rgba(8,4,20,0.85) 90%)' }}
      />
      {/* Diagonal sheen, 135deg per the brand guide */}
      <div
        className="absolute inset-0"
        style={{ background: 'linear-gradient(135deg, rgba(124,34,193,0.08) 0%, transparent 50%, rgba(255,87,149,0.05) 100%)' }}
      />
    </div>
  )
}
