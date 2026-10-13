'use client'

import Image from 'next/image'
import { useEffect, useState } from 'react'
import { LUMI_LINES } from '@/lib/site'
import styles from './LumiKeychain.module.css'

// There is no /contacto line in LUMI_LINES yet. The Aliados line ("¡Escríbenos!")
// fits this page, so it is reused rather than writing new copy.
// TODO(kat): add a '/contacto' line to LUMI_LINES if you want one of its own.
const LINE = LUMI_LINES['/contacto'] ?? LUMI_LINES['/aliados']

/*
  Lumi as a keychain hanging from the nav on Contáctanos. The global Lumi
  hides on this route (components/Lumi.tsx), so the two never show together.

  Motion (see LumiKeychain.module.css):
    - Intro once per session: drop, light wave, dangle. Server HTML includes
      it, so there is no flash of the resting keychain before it drops.
    - Rest: slow ±1.5° sway, data-ambient (stops while scrolling/off-screen).
    - prefers-reduced-motion: resting keychain, no motion.
  Click shows Lumi's line, same pattern as the global Lumi: second click,
  Escape or 6s closes it.
*/
export default function LumiKeychain() {
  const [intro, setIntro] = useState(true)
  const [talking, setTalking] = useState(false)

  // Intro plays once per visit.
  useEffect(() => {
    if (sessionStorage.getItem('lumi-keychain-intro') === '1') setIntro(false)
    else sessionStorage.setItem('lumi-keychain-intro', '1')
  }, [])

  useEffect(() => {
    if (!talking) return
    const id = window.setTimeout(() => setTalking(false), 6000)
    return () => window.clearTimeout(id)
  }, [talking])

  useEffect(() => {
    const onKey = (e: KeyboardEvent) => e.key === 'Escape' && setTalking(false)
    window.addEventListener('keydown', onKey)
    return () => window.removeEventListener('keydown', onKey)
  }, [])

  return (
    <div className={`${styles.keychain} ${intro ? styles.intro : ''}`} data-ambient-group="">
      {/* eslint-disable-next-line @next/next/no-img-element -- decorative pre-rendered glow */}
      <img src="/keychain/wave.svg" alt="" aria-hidden="true" className={styles.wave} />

      <div className={styles.drop}>
        <div className={styles.dangle}>
          <div className={styles.sway} data-ambient="">
            <button
              type="button"
              onClick={() => setTalking((t) => !t)}
              aria-label={talking ? 'Ocultar el mensaje de Lumi' : 'Mostrar el mensaje de Lumi'}
              aria-expanded={talking}
              className={styles.button}
            >
              <span className={styles.nudge}>
                <span className={styles.rig}>
                  <span className={styles.clasp} />
                  {/* eslint-disable-next-line @next/next/no-img-element -- vector part, native size */}
                  <img src="/keychain/chain.svg" alt="" width={25} height={184} className={styles.chain} />
                  <Image
                    src="/lumi.webp"
                    alt="Lumi, la mascota de WIT, colgando como llavero"
                    width={180}
                    height={355}
                    sizes="180px"
                    className={styles.lumi}
                  />
                  {/* eslint-disable-next-line @next/next/no-img-element -- vector part, native size */}
                  <img src="/keychain/split-ring.svg" alt="" width={46} height={46} className={styles.ring} />
                </span>
              </span>
            </button>
          </div>
        </div>
      </div>

      {talking && LINE && (
        // Centering lives on the outer box; animate-rise owns the inner box's transform.
        <div className={styles.bubble}>
          <div role="status" aria-live="polite" className="glass animate-rise rounded-2xl px-4 py-3">
            <p className="m-0 text-[13px] font-medium leading-relaxed text-white/92">{LINE}</p>
          </div>
        </div>
      )}
    </div>
  )
}
