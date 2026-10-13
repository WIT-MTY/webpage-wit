'use client'

import { useEffect, useRef, useState } from 'react'
import { kickLumi } from './LumiKeychain'

type Status = 'idle' | 'copied' | 'manual'

/** Old-style copy for browsers that block the async Clipboard API (plain http, older Safari, some in-app browsers). */
function legacyCopy(text: string) {
  const ta = document.createElement('textarea')
  ta.value = text
  ta.setAttribute('readonly', '')
  ta.style.position = 'fixed'
  ta.style.opacity = '0'
  document.body.appendChild(ta)
  ta.select()
  let ok = false
  try {
    ok = document.execCommand('copy')
  } catch {
    ok = false
  }
  ta.remove()
  return ok
}

/**
 * Big "Copiar correo" button. Copies `email`, swaps to "¡Copiado!" with a
 * check for 2 s and kicks Lumi's keychain. If the browser refuses both copy
 * methods, it selects the address text (element `targetId`) so it can be
 * copied by hand.
 */
export default function CopyEmail({ email, targetId }: { email: string; targetId: string }) {
  const [status, setStatus] = useState<Status>('idle')
  const timer = useRef<number | undefined>(undefined)

  useEffect(() => () => window.clearTimeout(timer.current), [])

  const onClick = async () => {
    let ok = false
    try {
      await navigator.clipboard.writeText(email)
      ok = true
    } catch {
      ok = legacyCopy(email)
    }
    if (ok) {
      kickLumi()
    } else {
      const target = document.getElementById(targetId)
      const sel = window.getSelection()
      if (target && sel) {
        const range = document.createRange()
        range.selectNodeContents(target)
        sel.removeAllRanges()
        sel.addRange(range)
      }
    }
    setStatus(ok ? 'copied' : 'manual')
    window.clearTimeout(timer.current)
    timer.current = window.setTimeout(() => setStatus('idle'), 2000)
  }

  const copied = status === 'copied'
  const icon = 'absolute inset-0 transition-[opacity,scale] duration-200'
  return (
    <>
      <button
        type="button"
        onClick={onClick}
        className="inline-flex min-h-14 w-full cursor-pointer items-center justify-center gap-3 rounded-full border-none bg-[linear-gradient(135deg,#7c22c7_0%,#47126b_100%)] px-9 text-[13px] font-medium uppercase tracking-[0.2em] text-white shadow-[0_0_30px_rgba(124,34,199,0.45),0_4px_20px_rgba(0,0,0,0.4)] transition-transform duration-200 hover:-translate-y-0.5 sm:w-auto"
      >
        {/* Copy and check icons share one slot; only opacity and scale change. */}
        <span className="relative inline-block h-4 w-4 shrink-0" aria-hidden="true">
          <svg viewBox="0 0 16 16" fill="none" className={`${icon} ${copied ? 'scale-50 opacity-0' : 'opacity-100'}`}>
            <rect x="5" y="5" width="9" height="9" rx="2" stroke="currentColor" strokeWidth="1.4" />
            <path d="M11 5V3.5A1.5 1.5 0 0 0 9.5 2h-6A1.5 1.5 0 0 0 2 3.5v6A1.5 1.5 0 0 0 3.5 11H5" stroke="currentColor" strokeWidth="1.4" />
          </svg>
          <svg viewBox="0 0 16 16" fill="none" className={`${icon} text-[#73edaa] ${copied ? 'opacity-100' : 'scale-50 opacity-0'}`}>
            <path d="M3 8.5 6.5 12 13 4.5" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" />
          </svg>
        </span>
        {copied ? '¡Copiado!' : 'Copiar correo'}
      </button>
      <span className="sr-only" role="status" aria-live="polite">
        {copied ? 'Correo copiado' : status === 'manual' ? 'No se pudo copiar. El correo quedó seleccionado.' : ''}
      </span>
      {status === 'manual' && (
        <p className="mt-3 mb-0 text-[13px] font-light text-white/60" aria-hidden="true">
          Tu navegador no permitió copiar. El correo quedó seleccionado.
        </p>
      )}
    </>
  )
}
