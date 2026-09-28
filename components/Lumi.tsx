'use client'

import Image from 'next/image'
import { usePathname } from 'next/navigation'
import { useEffect, useState } from 'react'
import { LUMI_LINES } from '@/lib/site'

/*
  Lumi, the WIT firefly. Floats in the corner on every page except
  /contacto, where she is the hanging keychain instead.

  Behaviour:
    - Desktop: small and quiet in the bottom-right. Click her for the page line.
    - Mobile: small in the bottom-left. Tap for the line; the bubble opens to
      the right so it stays on screen.
    - The bubble closes on a second tap, on "Ocultar a Lumi", or after 6s.
    - "Ocultar a Lumi" hides her for the rest of the visit (sessionStorage).
    - Hidden while the mobile register prompt is open (see RegisterPrompt).
    - prefers-reduced-motion: no bobbing.

  Assets: /public/lumi.webp. The single existing pose is used at every size;
  a flying/sitting pose would need new renders from the illustrator.
*/
export default function Lumi() {
  const pathname = usePathname()
  const [hidden, setHidden] = useState(true) // start hidden, decide after mount
  const [talking, setTalking] = useState(false)

  useEffect(() => {
    const dismissed = sessionStorage.getItem('lumi-hidden') === '1'
    setHidden(dismissed)
  }, [])

  // close the bubble on route change
  useEffect(() => setTalking(false), [pathname])

  // auto-close after 6s
  useEffect(() => {
    if (!talking) return
    const id = window.setTimeout(() => setTalking(false), 6000)
    return () => window.clearTimeout(id)
  }, [talking])

  // Escape closes the bubble
  useEffect(() => {
    const onKey = (e: KeyboardEvent) => e.key === 'Escape' && setTalking(false)
    window.addEventListener('keydown', onKey)
    return () => window.removeEventListener('keydown', onKey)
  }, [])

  const line = LUMI_LINES[pathname]
  if (hidden || !line || pathname.startsWith('/contacto')) return null

  const hide = () => {
    sessionStorage.setItem('lumi-hidden', '1')
    setHidden(true)
  }

  return (
    <div
      data-lumi
      className="pointer-events-none fixed bottom-4 left-4 z-40 flex items-end gap-3 md:bottom-6 md:left-auto md:right-6 md:flex-row-reverse"
    >
      <button
        type="button"
        onClick={() => setTalking((t) => !t)}
        aria-label={talking ? 'Ocultar el mensaje de Lumi' : 'Mostrar el mensaje de Lumi'}
        aria-expanded={talking}
        className="pointer-events-auto relative cursor-pointer border-none bg-transparent p-0"
      >
        <Image
          src="/lumi.webp"
          alt="Lumi, la mascota de WIT"
          width={46}
          height={91}
          data-ambient
          className="h-auto w-[46px] select-none md:w-[64px]"
          style={{
            animation: 'lumi-bob 3.2s ease-in-out infinite',
            willChange: 'transform',
            // her own glow, baked as a shadow rather than a live gradient layer
            filter: 'drop-shadow(0 0 14px rgba(255,158,217,0.45))',
          }}
          priority={false}
        />
      </button>

      {talking && (
        <div
          role="status"
          aria-live="polite"
          className="glass pointer-events-auto max-w-[228px] animate-rise rounded-2xl rounded-bl-sm px-4 py-3 md:rounded-bl-2xl md:rounded-br-sm"
        >
          <p className="m-0 text-[13px] font-medium leading-relaxed text-white/92">{line}</p>
          <button
            type="button"
            onClick={hide}
            className="mt-2 cursor-pointer border-none bg-transparent p-0 text-[11px] text-peri/60 underline"
          >
            Ocultar a Lumi
          </button>
        </div>
      )}
    </div>
  )
}
