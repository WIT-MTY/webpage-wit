'use client'

import Image from 'next/image'
import { useEffect, useRef, useState, type CSSProperties } from 'react'
import { LUMI_LINES } from '@/lib/site'
import geometry from './lumi-keychain.json'
import styles from './LumiKeychain.module.css'

// There is no /contacto line in LUMI_LINES yet. The Aliados line ("¡Escríbenos!")
// fits this page, so it is reused rather than writing new copy.
// TODO(kat): add a '/contacto' line to LUMI_LINES if you want one of its own.
const LINE = LUMI_LINES['/contacto'] ?? LUMI_LINES['/aliados']

// Damped swing: each value is a fraction of the first (peak) angle.
const DECAY = [1, -0.66, 0.42, -0.25, 0.12, 0]
const SWING_MS = 2600
const CHARM_FOLLOW = 0.4 // the charm swings at 40% of the chain's angle…
const CHARM_LAG_MS = 200 // …and this much later
const ENTER_DEG = 12
const KICK_DEG = 16
const GLINT_DELAY_MS = 600
const GLINT_MS = 700
const FIREFLY_MS = 550 // her belly glow pulse
const FIREFLY_PEAK = 0.6
const WAVE_SPEED = 2.6 // px per ms: how fast the ring of light spreads from her
const WAVE_MIN_MS = 450
const WAVE_PEAK = 0.65 // light, not a strobe
const WAVE_RING = 128 * 0.88 // radius of the ring's bright band in flash-ring.svg at scale 1

const reducedMotion = () => window.matchMedia('(prefers-reduced-motion: reduce)').matches

/** Current rotation in degrees, wherever the element is mid-animation. */
function currentAngle(el: HTMLElement) {
  const t = getComputedStyle(el).transform
  if (!t || t === 'none') return 0
  const m = new DOMMatrixReadOnly(t)
  return (Math.atan2(m.b, m.a) * 180) / Math.PI
}

/** A decaying swing from `from` through peak × DECAY, eased between every keyframe. */
function swingKeyframes(from: number, peak: number): Keyframe[] {
  const angles = [from, ...DECAY.map((f) => f * peak)]
  return angles.map((a) => ({ transform: `rotate(${a}deg)`, easing: 'ease-in-out' }))
}

/**
  The border light a block shows when Lumi's flash passes it. Put it inside an
  element with `data-lumi-flash` and `position: relative`; it follows the
  element's rounded corners and lights only its outline.
*/
export function FlashOutline() {
  return (
    <span className={styles.outline} aria-hidden="true">
      <span className={styles.wave} data-lumi-flash-wave="" />
    </span>
  )
}

/*
  Lumi as an acrylic keychain charm hanging from the nav on Contáctanos. The
  global Lumi hides on this route (components/Lumi.tsx).

  Motion:
    - Enter: swings out to 12° and settles over ~2.6s (decaying overshoot).
      It starts from her resting angle, so hydration never makes her jump.
    - Idle: soft CSS pendulum (±3°, 5.2s), data-ambient so MotionGovernor
      stops it while scrolling and off-screen.
    - Click: a 16° kick with the same decay. Rapid clicks restart from the
      current angle, so nothing jumps.
    - Flash, 600ms after load and on every click: her belly glows like a
      firefly, a glint crosses the charm, and a ring of light spreads out from
      her. The ring only shows on the outlines of [data-lumi-flash] blocks
      (see FlashOutline), lighting the nearest edges first. Every block runs
      the same ring with the same timing, so it reads as one wave. Small
      pre-rendered images, transform and opacity only; no page-wide layer.
    - prefers-reduced-motion: none of the above; a still charm.
  The swing-in and kick use the Web Animations API on top of the CSS idle
  sway; when one finishes, the idle restarts from the center to match.
*/
export default function LumiKeychain() {
  const chainRef = useRef<HTMLDivElement>(null)
  const charmRef = useRef<HTMLDivElement>(null)
  const streakRef = useRef<HTMLSpanElement>(null)
  const fireflyRef = useRef<HTMLSpanElement>(null)
  const swings = useRef<Animation[]>([])
  const glintAnim = useRef<Animation | null>(null)
  const [talking, setTalking] = useState(false)

  const restartIdle = () => {
    for (const el of [chainRef.current, charmRef.current]) {
      el?.getAnimations().forEach((a) => {
        if (a instanceof CSSAnimation) a.currentTime = 0
      })
    }
  }

  // Swing out to `peak` from wherever she is now, then decay back to 0°.
  const swing = (peak: number) => {
    const chain = chainRef.current
    const charm = charmRef.current
    if (!chain || !charm || reducedMotion()) return
    const chainFrom = currentAngle(chain)
    const charmFrom = currentAngle(charm)
    swings.current.forEach((a) => a.cancel())

    // Both hold their end (0°) until the charm, which lags, is done too.
    const chainAnim = chain.animate(swingKeyframes(chainFrom, peak), { duration: SWING_MS, fill: 'forwards' })
    const charmAnim = charm.animate(swingKeyframes(charmFrom, peak * CHARM_FOLLOW), {
      duration: SWING_MS,
      delay: CHARM_LAG_MS,
      fill: 'both',
    })
    swings.current = [chainAnim, charmAnim]
    charmAnim.onfinish = () => {
      if (swings.current[1] !== charmAnim) return // a newer kick took over
      swings.current.forEach((a) => a.cancel())
      swings.current = []
      restartIdle()
    }
  }

  const glint = () => {
    const streak = streakRef.current
    if (!streak || reducedMotion()) return
    glintAnim.current?.cancel()
    const anim = streak.animate(
      [
        { transform: 'translate3d(-130%, 0, 0) rotate(18deg)', opacity: 0 },
        { opacity: 1, offset: 0.2 },
        { opacity: 1, offset: 0.75 },
        { transform: 'translate3d(200%, 0, 0) rotate(18deg)', opacity: 0 },
      ],
      { duration: GLINT_MS, easing: 'ease-out' },
    )
    glintAnim.current = anim
    anim.onfinish = () => anim.cancel() // no lingering animation
    flashPage()
  }

  // Firefly flash: belly glow, then a ring of light across the blocks' outlines.
  const flashPage = () => {
    const firefly = fireflyRef.current
    if (!firefly) return
    firefly.getAnimations().forEach((a) => a.cancel())
    const pulse = firefly.animate(
      [
        { opacity: 0, transform: 'scale(0.6)' },
        { opacity: FIREFLY_PEAK, transform: 'scale(1)', offset: 0.25 },
        { opacity: 0, transform: 'scale(1.3)' },
      ],
      { duration: FIREFLY_MS, easing: 'ease-out' },
    )
    pulse.onfinish = () => pulse.cancel()

    const g = firefly.getBoundingClientRect()
    const ox = g.left + g.width / 2
    const oy = g.top + g.height / 2
    const blocks = Array.from(document.querySelectorAll<HTMLElement>('[data-lumi-flash]'))
    const rects = blocks.map((b) => b.getBoundingClientRect())
    // Page-wide: the ring sweeps the whole viewport (and any block beyond it).
    const vw = window.innerWidth
    const vh = window.innerHeight
    const reach = Math.max(
      Math.hypot(ox, oy),
      Math.hypot(vw - ox, oy),
      Math.hypot(ox, vh - oy),
      Math.hypot(vw - ox, vh - oy),
      ...rects.flatMap((r) => [
        Math.hypot(r.left - ox, r.top - oy),
        Math.hypot(r.right - ox, r.top - oy),
        Math.hypot(r.left - ox, r.bottom - oy),
        Math.hypot(r.right - ox, r.bottom - oy),
      ]),
    )
    const endScale = (reach + 40) / WAVE_RING
    const duration = Math.max(WAVE_MIN_MS, reach / WAVE_SPEED)

    blocks.forEach((block, i) => {
      const wave = block.querySelector<HTMLElement>(':scope > * > [data-lumi-flash-wave]')
      if (!wave) return
      // Center the ring on Lumi, in this block's coordinates.
      wave.style.left = `${ox - rects[i].left}px`
      wave.style.top = `${oy - rects[i].top}px`
      wave.getAnimations().forEach((a) => a.cancel())
      const anim = wave.animate(
        [
          { transform: 'scale(0)', opacity: WAVE_PEAK },
          { opacity: WAVE_PEAK, offset: 0.6 },
          { transform: `scale(${endScale})`, opacity: 0 },
        ],
        { duration, easing: 'cubic-bezier(0.2, 0.6, 0.4, 1)' },
      )
      anim.onfinish = () => anim.cancel()
    })
  }

  // On page enter: swing in, then the glint as she starts to settle.
  useEffect(() => {
    swing(ENTER_DEG)
    const id = window.setTimeout(glint, GLINT_DELAY_MS)
    return () => {
      window.clearTimeout(id)
      swings.current.forEach((a) => a.cancel())
      glintAnim.current?.cancel()
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps -- once, on mount
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

  const onClick = () => {
    swing(KICK_DEG)
    glint()
    setTalking((t) => !t)
  }

  const vars = {
    '--img-w': geometry.width,
    '--img-h': geometry.height,
    '--hx': geometry.holeX,
    '--hy': geometry.holeY,
  } as CSSProperties

  return (
    <div className={styles.keychain} style={vars} data-ambient-group="">
      <div ref={chainRef} className={styles.chain} data-idle="" data-ambient="">
        <span className={styles.rig}>
          <span className={styles.clasp} />
          {/* eslint-disable-next-line @next/next/no-img-element -- vector part, native size */}
          <img src="/keychain/chain.svg" alt="" width={25} height={184} className={styles.chainImg} />
        </span>

        <div ref={charmRef} className={styles.charm} data-idle="" data-ambient="">
          <button
            type="button"
            onClick={onClick}
            aria-label={talking ? 'Ocultar el mensaje de Lumi' : 'Mostrar el mensaje de Lumi'}
            aria-expanded={talking}
            className={styles.button}
          >
            <Image
              src="/lumi-keychain.webp"
              alt="Lumi, la mascota de WIT, como llavero de acrílico"
              width={geometry.width}
              height={geometry.height}
              sizes="96px"
              className={styles.image}
            />
            <span ref={fireflyRef} className={styles.firefly} aria-hidden="true" />
            <span className={styles.glint} aria-hidden="true">
              <span ref={streakRef} className={styles.streak} />
            </span>
          </button>
        </div>

        {/* The ring goes over the charm, through its hole. */}
        <span className={styles.rig}>
          {/* eslint-disable-next-line @next/next/no-img-element -- vector part, native size */}
          <img src="/keychain/split-ring.svg" alt="" width={46} height={46} className={styles.ring} />
        </span>
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
