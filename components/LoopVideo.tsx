'use client'

import { useEffect, useRef, useState } from 'react'
import PhotoFrame from './PhotoFrame'
import { watchInView } from '@/lib/inView'
import { INICIO_VIDEO } from '@/lib/motion-flags'

/*
  A photo slot that plays a short muted loop. Decorative: no controls, no
  audio, hidden from screen readers and the tab order. The poster underneath
  is the real image (with alt text) and stays the loading state.

  - Plays only while on screen and the tab is visible. Like ambient motion
    (MotionGovernor), it also stops while the page is scrolling.
  - The video starts transparent and fades in (opacity) on its first frame.
  - prefers-reduced-motion or play() rejected: poster only.
  - INICIO_VIDEO off: a plain PhotoFrame with the poster, no video element.
  - The poster is served unoptimized so the <img> and the video's poster
    attribute share one download.
*/
export default function LoopVideo({
  webm,
  mp4,
  poster,
  alt,
  className = '',
  style,
  sizes,
}: {
  webm: string
  mp4: string
  poster: string
  /** Describes the poster, which is what screen readers get. */
  alt: string
  /** Size and position of the slot, passed to PhotoFrame. */
  className?: string
  style?: React.CSSProperties
  sizes?: string
}) {
  const ref = useRef<HTMLVideoElement>(null)
  const [still, setStill] = useState(false)
  const [shown, setShown] = useState(false)

  useEffect(() => {
    const video = ref.current
    if (!INICIO_VIDEO || !video) return
    if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) {
      setStill(true)
      return
    }
    // React doesn't reliably set the muted property; browsers only autoplay muted video.
    video.muted = true
    const root = document.documentElement
    let onScreen = false
    let blocked = false

    const sync = () => {
      const want = onScreen && document.visibilityState === 'visible' && !root.classList.contains('is-scrolling')
      if (want && video.paused && !blocked) {
        video.play().catch((err: DOMException) => {
          // AbortError just means a pause() came first. Anything else (autoplay
          // refused, data saver): stop trying and keep the poster.
          if (err.name !== 'AbortError') blocked = true
        })
      } else if (!want && !video.paused) {
        video.pause()
      }
    }

    const stopWatching = watchInView(video, (inView) => {
      onScreen = inView
      sync()
    })
    // MotionGovernor toggles .is-scrolling on <html>.
    const scrolling = new MutationObserver(sync)
    scrolling.observe(root, { attributes: true, attributeFilter: ['class'] })
    document.addEventListener('visibilitychange', sync)
    return () => {
      stopWatching()
      scrolling.disconnect()
      document.removeEventListener('visibilitychange', sync)
      video.pause()
    }
  }, [])

  if (!INICIO_VIDEO) return <PhotoFrame src={poster} alt={alt} className={className} style={style} sizes={sizes} />

  return (
    <PhotoFrame src={poster} alt={alt} className={className} style={style} sizes={sizes} priority unoptimized>
      {!still && (
        <video
          ref={ref}
          muted
          loop
          playsInline
          preload="metadata"
          poster={poster}
          aria-hidden="true"
          tabIndex={-1}
          disablePictureInPicture
          onPlaying={() => setShown(true)}
          className="pointer-events-none absolute inset-0 h-full w-full object-cover object-center transition-opacity duration-700 ease-out"
          style={{ opacity: shown ? 1 : 0 }}
        >
          <source src={webm} type="video/webm" />
          <source src={mp4} type="video/mp4" />
        </video>
      )}
    </PhotoFrame>
  )
}
