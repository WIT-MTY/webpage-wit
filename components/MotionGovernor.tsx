'use client'

import { usePathname } from 'next/navigation'
import { useEffect } from 'react'

/*
  Ambient motion (floating shapes, marquee, twinkling stars) is paused:
    1. while the page is scrolling, and resumes ~200ms after it stops
    2. whenever its section is off-screen

  Measured on the home page with 4x CPU throttling: floating shapes running during
  scroll dropped it to ~44fps with 50+ stutter frames; paused, it holds 60fps.
  The float cycles are 7–14s long, so a pause mid-scroll is not noticeable.

  Elements opt in with the `data-ambient` attribute. Groups that should pause
  off-screen use `data-ambient-group`.
*/
export default function MotionGovernor() {
  const pathname = usePathname()

  // 1. Pause during scroll
  useEffect(() => {
    const root = document.documentElement
    let timer: number | undefined
    const onScroll = () => {
      if (!root.classList.contains('is-scrolling')) root.classList.add('is-scrolling')
      window.clearTimeout(timer)
      timer = window.setTimeout(() => root.classList.remove('is-scrolling'), 200)
    }
    window.addEventListener('scroll', onScroll, { passive: true })
    return () => {
      window.removeEventListener('scroll', onScroll)
      window.clearTimeout(timer)
      root.classList.remove('is-scrolling')
    }
  }, [])

  // 2. Pause off-screen groups. Re-scan on every route change.
  useEffect(() => {
    const groups = document.querySelectorAll<HTMLElement>('[data-ambient-group]')
    const io = new IntersectionObserver(
      (entries) => {
        for (const e of entries) {
          if (e.isIntersecting) delete (e.target as HTMLElement).dataset.offscreen
          else (e.target as HTMLElement).dataset.offscreen = ''
        }
      },
      { rootMargin: '100px' },
    )
    groups.forEach((g) => io.observe(g))
    return () => io.disconnect()
  }, [pathname])

  return null
}
