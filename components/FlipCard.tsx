'use client'

import { useId, useState } from 'react'

/*
  Shared 3D flip card.

  Used by the event cards (Proyectos) and the member cards (Integrantes).
  You give it a front and one or more backs; it handles the 3D rotation,
  equal heights, keyboard access and reduced motion.

  Usage:
    const [side, setSide] = useState('front')
    <FlipCard
      side={side}
      faces={{
        front: <MyFront onFlip={() => setSide('impact')} />,
        impact: <MyBack onBack={() => setSide('front')} />,
      }}
    />

  Both faces are always rendered (that is how the browser can animate between
  them), so the card is as tall as its tallest face and never jumps.
*/
export default function FlipCard({
  side,
  faces,
  className = '',
}: {
  side: string
  faces: Record<string, React.ReactNode>
  className?: string
}) {
  const id = useId()
  const keys = Object.keys(faces)
  const active = keys.includes(side) ? side : keys[0]
  const isFront = active === keys[0]
  return (
    <div className={`[perspective:1600px] ${className}`}>
      <div
        className="relative transition-transform duration-500 [transform-style:preserve-3d] motion-reduce:transition-none"
        style={{ transform: isFront ? 'rotateY(0deg)' : 'rotateY(180deg)' }}
      >
        {keys.map((k, i) => {
          const shown = k === active
          return (
            <div
              key={`${id}-${k}`}
              aria-hidden={!shown}
              className={`${i === 0 ? '' : 'absolute inset-0'} [backface-visibility:hidden]`}
              style={{
                transform: i === 0 ? undefined : 'rotateY(180deg)',
                // faces that are neither the front nor the active back stay out of the way
                visibility: i === 0 || shown ? 'visible' : 'hidden',
                pointerEvents: shown ? 'auto' : 'none',
              }}
            >
              {faces[k]}
            </div>
          )
        })}
      </div>
    </div>
  )
}
