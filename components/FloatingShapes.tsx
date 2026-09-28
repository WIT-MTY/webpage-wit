/*
  The brand-kit 3D shapes, drifting behind content.

  Performance rule (measured, do not undo):
  Only the small foreground shapes animate. The large blurred ones stay still.
  On a hi-dpi 1920 screen, animating every shape dropped scrolling to ~37fps
  with constant stutter, because each moving shape is a big translucent layer
  the browser has to composite on every frame. Animating only the small ones
  holds 60fps, and the drift on a 40px-blurred 360px blob was invisible anyway.

  Performance: the original applied filter: blur() to each shape and to a glow
  layer under it, then animated them, which forced a re-blur every frame.
  Here the blur is baked into the image files (public/shapes/*-far|mid|near.webp),
  the glow is a plain radial gradient, and only `transform` animates.
*/

export type ShapeName =
  | 'chain' | 'zigzag' | 'cylinder' | 'loop' | 'burst'
  | 'slab' | 'torus' | 'blob' | 'blob2'

/** far = heavy blur, sits back. mid = light blur. near = sharp, foreground. */
export type Depth = 'far' | 'mid' | 'near'

export type FloatingShape = {
  shape: ShapeName
  depth: Depth
  size: number
  rotate: number
  opacity: number
  pos: React.CSSProperties
  motion: 'slow' | 'medium'
  duration: number
  /** Hide on small screens to keep phones light. */
  hideBelow?: 'sm' | 'md' | 'lg'
}

// Transparent padding baked around each blurred image, as a fraction of its size.
const PAD: Record<Depth, number> = { far: 0.0735, mid: 0.0441, near: 0 }
const GLOW: Record<Depth, number> = { far: 0.9, mid: 0.95, near: 1.1 }

const HIDE = { sm: 'hidden sm:block', md: 'hidden md:block', lg: 'hidden lg:block' } as const

/** Big, soft shapes stay put; small, sharp ones drift. */
const shouldAnimate = (o: FloatingShape) => o.depth !== 'far' && o.size <= 200

export default function FloatingShapes({ items, className = '' }: { items: FloatingShape[]; className?: string }) {
  return (
    <div className={`pointer-events-none absolute inset-0 overflow-hidden ${className}`} aria-hidden="true" data-ambient-group="">
      {items.map((o, i) => {
        const pad = PAD[o.depth]
        const glow = o.size * GLOW[o.depth]
        const animate = shouldAnimate(o)
        return (
          <div
            key={i}
            data-ambient={animate ? '' : undefined}
            className={`absolute ${o.hideBelow ? HIDE[o.hideBelow] : ''}`}
            style={{
              ...o.pos,
              width: o.size,
              height: o.size,
              ...(animate
                ? {
                    animation: `float-${o.motion} ${o.duration}s ease-in-out infinite`,
                    willChange: 'transform',
                  }
                : null),
            }}
          >
            {/* Glow is a pre-rendered image: a live CSS gradient here was re-painted
                every frame while the shape moved, and was the source of scroll lag. */}
            {/* eslint-disable-next-line @next/next/no-img-element -- decorative */}
            <img
              src="/shapes/glow.webp"
              alt=""
              decoding="async"
              draggable={false}
              className="absolute left-1/2 top-1/2 max-w-none select-none"
              style={{ width: glow * 2, height: glow * 2, transform: 'translate(-50%, -38%)' }}
            />
            {/* eslint-disable-next-line @next/next/no-img-element -- decorative, pre-optimized webp */}
            <img
              src={`/shapes/${o.shape}-${o.depth}.webp`}
              alt=""
              decoding="async"
              draggable={false}
              className="absolute max-w-none select-none"
              style={{
                width: `${(1 + 2 * pad) * 100}%`,
                height: `${(1 + 2 * pad) * 100}%`,
                left: `${-pad * 100}%`,
                top: `${-pad * 100}%`,
                objectFit: 'contain',
                opacity: o.opacity,
                transform: `rotate(${o.rotate}deg)`,
              }}
            />
          </div>
        )
      })}
    </div>
  )
}
