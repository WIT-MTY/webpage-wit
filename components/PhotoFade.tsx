'use client'

import { useEffect, useRef, useState } from 'react'
import PhotoFrame from './PhotoFrame'

/*
  A photo slot that crossfades through several photos. Opacity only.

  - No photos: PhotoFrame's dashed placeholder (described by `alt`).
  - One photo: a plain static PhotoFrame, no timer.
  - Several: stacked PhotoFrames; the first loads eagerly, the rest lazily.
    The timer runs only while the slot is on-screen and the tab is visible,
    and skips a beat while the page is scrolling (MotionGovernor's
    .is-scrolling), so a big fade never lands mid-scroll.
  - `staggerOffset` delays the first change, so several slots on one page
    don't switch in sync.
  - prefers-reduced-motion: first photo only.
*/
export default function PhotoFade({
  photos,
  alt,
  interval = 5500,
  staggerOffset = 0,
  className = '',
  sizes,
  quality,
}: {
  /** `position`: optional CSS object-position for that photo. */
  photos: { src: string; alt: string; position?: string }[]
  /** Placeholder description when `photos` is empty. */
  alt: string
  interval?: number
  staggerOffset?: number
  /** Size and shape of the slot, e.g. "aspect-[4/3] w-full". */
  className?: string
  sizes?: string
  /** next/image quality, passed to every photo. */
  quality?: number
}) {
  const ref = useRef<HTMLDivElement>(null)
  const [index, setIndex] = useState(0)
  const count = photos.length

  useEffect(() => {
    if (count < 2 || window.matchMedia('(prefers-reduced-motion: reduce)').matches) return
    const el = ref.current
    if (!el) return
    let timer: number | undefined
    let onScreen = false
    let first = true

    const stop = () => {
      window.clearTimeout(timer)
      timer = undefined
    }
    const tick = () => {
      timer = undefined
      first = false
      if (document.documentElement.classList.contains('is-scrolling')) {
        timer = window.setTimeout(tick, 400)
        return
      }
      setIndex((i) => (i + 1) % count)
      timer = window.setTimeout(tick, interval)
    }
    const sync = () => {
      if (onScreen && document.visibilityState === 'visible') {
        if (timer === undefined) timer = window.setTimeout(tick, interval + (first ? staggerOffset : 0))
      } else {
        stop()
      }
    }

    const io = new IntersectionObserver(([entry]) => {
      onScreen = entry.isIntersecting
      sync()
    })
    io.observe(el)
    document.addEventListener('visibilitychange', sync)
    return () => {
      stop()
      io.disconnect()
      document.removeEventListener('visibilitychange', sync)
    }
  }, [count, interval, staggerOffset])

  if (count === 0) return <PhotoFrame src={null} alt={alt} className={className} />
  if (count === 1) return (
      <PhotoFrame
        src={photos[0].src}
        alt={photos[0].alt}
        className={className}
        sizes={sizes}
        quality={quality}
        objectPosition={photos[0].position}
      />
    )

  return (
    <div ref={ref} className={`relative ${className}`}>
      {photos.map((p, i) => (
        <div
          key={p.src}
          aria-hidden={i !== index}
          className="absolute inset-0 transition-opacity duration-[1200ms] ease-in-out motion-reduce:transition-none"
          style={{ opacity: i === index ? 1 : 0 }}
        >
          <PhotoFrame
            src={p.src}
            alt={p.alt}
            className="h-full w-full"
            sizes={sizes}
            quality={quality}
            objectPosition={p.position}
            loading={i === 0 ? 'eager' : 'lazy'}
          />
        </div>
      ))}
    </div>
  )
}
