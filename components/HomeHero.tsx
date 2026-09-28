/*
  Ported 1:1 from the approved Figma Make landing page (App.tsx).
  Same layout, sizes, colors, copy and motion. What changed is how the
  soft effects are produced, so it runs smoothly on phones:
    - depth orbs: blur filters → radial gradients (now in <Atmosphere />)
    - photo marquee: no longer inside a blur filter that re-rendered every frame
    - floating shapes: blur baked into images, only transform animates
    - logo bloom: pre-rendered image instead of a live 40px blur
*/

import FloatingShapes, { type FloatingShape } from './FloatingShapes'
import { Button } from './ui'
import { MARQUEE_MOTION, MARQUEE_PHOTOS } from '@/lib/site'

const PERIWINKLE = '#c6c8ee'

// Same placements as the Figma file: two large far back, two mid, one sharp foreground.
const HERO_SHAPES: FloatingShape[] = [
  { shape: 'chain', depth: 'far', size: 320, rotate: -22, opacity: 0.5, pos: { top: '8%', left: '3%' }, motion: 'slow', duration: 12, hideBelow: 'lg' },
  { shape: 'blob', depth: 'far', size: 360, rotate: 26, opacity: 0.45, pos: { bottom: '-4%', right: '4%' }, motion: 'medium', duration: 14, hideBelow: 'lg' },
  { shape: 'torus', depth: 'mid', size: 148, rotate: 34, opacity: 0.9, pos: { top: '13%', right: '9%' }, motion: 'medium', duration: 9, hideBelow: 'md' },
  { shape: 'zigzag', depth: 'mid', size: 172, rotate: -13, opacity: 0.82, pos: { bottom: '11%', left: '6%' }, motion: 'slow', duration: 10, hideBelow: 'md' },
  { shape: 'burst', depth: 'near', size: 96, rotate: 17, opacity: 1, pos: { top: '38%', right: '13%' }, motion: 'medium', duration: 7, hideBelow: 'sm' },
]

const TINTS = [
  'linear-gradient(135deg, #2d085a, #47126b)',
  'linear-gradient(135deg, #47126b, #7c22c7)',
  'linear-gradient(135deg, #1a0733, #3a0f80)',
  'linear-gradient(135deg, #7a1050, #47126b)',
  'linear-gradient(135deg, #3a0f80, #2d085a)',
  'linear-gradient(135deg, #47126b, #1a0733)',
]

export default function HomeHero() {
  const hasPhotos = MARQUEE_PHOTOS.some(Boolean)
  // A moving strip needs a doubled track for a seamless loop; a static one doesn't.
  const tiles = MARQUEE_MOTION ? [...MARQUEE_PHOTOS, ...MARQUEE_PHOTOS] : MARQUEE_PHOTOS

  return (
    <section className="relative min-h-[100svh] overflow-hidden">
      {/* Photo marquee, pushed far back. Photos are desaturated per-tile (static),
          the moving track itself carries no filter. */}
      {hasPhotos && (
      <div className="pointer-events-none absolute inset-0 overflow-hidden" style={{ opacity: 0.05 }} aria-hidden="true" data-ambient-group="">
        <div
          data-ambient=""
          className="flex h-full"
          style={
            MARQUEE_MOTION
              ? { width: 'max-content', animation: 'marquee 75s linear infinite', willChange: 'transform' }
              : { width: '100%' }
          }
        >
          {tiles.map((src, i) => (
            <div
              key={i}
              className="h-full"
              style={{
                width: MARQUEE_MOTION ? '22vw' : `${100 / tiles.length}%`,
                minWidth: MARQUEE_MOTION ? 260 : undefined,
                background: src ? undefined : TINTS[i % TINTS.length],
              }}
            >
              {src && (
                // eslint-disable-next-line @next/next/no-img-element -- 5% opacity texture
                <img src={src} alt="" className="block h-full w-full object-cover grayscale" />
              )}
            </div>
          ))}
        </div>
      </div>
      )}

      {/* Top and bottom fade into the page base */}
      <div
        className="pointer-events-none absolute inset-0"
        style={{ background: 'linear-gradient(to bottom, #080414 0%, transparent 12%, transparent 82%, #080414 100%)' }}
      />

      <FloatingShapes items={HERO_SHAPES} className="z-[5]" />

      <div className="relative z-10 flex min-h-[100svh] flex-col items-center justify-center px-6 text-center">
        <p className="mb-7 text-[10px] font-normal uppercase tracking-[0.6em] text-peri/60">Tec de Monterrey</p>

        <div className="relative flex flex-col items-center">
          {/* Wide periwinkle radial. Was a gradient plus blur(22px); widened stops do the same job. */}
          <div
            className="pointer-events-none absolute left-1/2 top-[46%] h-[340%] w-[240%] -translate-x-1/2 -translate-y-1/2"
            style={{
              background: `radial-gradient(ellipse at center, ${PERIWINKLE}4d 0%, ${PERIWINKLE}1f 30%, ${PERIWINKLE}0a 50%, transparent 70%)`,
            }}
          />

          {/* Bloom, pre-rendered. The image has 200px padding around an 880px mark, hence 1280/880. */}
          {/* eslint-disable-next-line @next/next/no-img-element -- decorative */}
          <img
            src="/brand/wit-bloom.webp"
            alt=""
            aria-hidden="true"
            className="pointer-events-none absolute left-1/2 max-w-none -translate-x-1/2 select-none"
            style={{
              top: 'calc(clamp(200px, 32vw, 440px) * -0.227)',
              width: 'calc(clamp(200px, 32vw, 440px) * 1.4545)',
              opacity: 0.85,
              mixBlendMode: 'plus-lighter',
            }}
          />

          {/* eslint-disable-next-line @next/next/no-img-element -- vector mark, crisp at any size */}
          <img
            src="/brand/wit-mark.svg"
            alt="WIT, Women in Tech"
            width={440}
            height={217}
            fetchPriority="high"
            className="relative h-auto select-none"
            style={{
              width: 'clamp(200px, 32vw, 440px)',
              filter: 'drop-shadow(0 0 28px rgba(139,48,208,0.65))',
            }}
          />

          <p
            className="m-0 mt-[18px] pl-[0.6em] uppercase tracking-[0.6em]"
            style={{ color: `${PERIWINKLE}bb`, fontSize: 'clamp(9px, 1.1vw, 13px)' }}
          >
            Women in Tech
          </p>
        </div>

        <div
          className="my-9 h-px w-20"
          style={{ background: 'linear-gradient(to right, transparent, rgba(198,200,238,0.35), transparent)' }}
        />

        <p
          className="m-0 mb-10 font-light italic uppercase tracking-[0.35em] text-white/88"
          style={{ fontSize: 'clamp(11px, 1.2vw, 15px)' }}
        >
          Tech needs <span style={{ color: PERIWINKLE, textShadow: '0 0 20px rgba(198,200,238,0.6)' }}>WIT</span>
        </p>

        <div className="flex flex-col items-center gap-4 sm:flex-row">
          <Button href="/integrantes#unete">Únete</Button>
          <Button href="#sobre-nosotras" variant="glass">
            Conoce más
          </Button>
        </div>
      </div>

      <div className="absolute bottom-8 left-1/2 z-10 flex -translate-x-1/2 flex-col items-center gap-2" aria-hidden="true">
        <span className="text-[9px] uppercase tracking-[0.45em] text-white/25">Scroll</span>
        <div className="flex flex-col items-center gap-[3px]">
          {[0, 1, 2].map((i) => (
            <svg
              key={i}
              width={12}
              height={7}
              viewBox="0 0 12 7"
              fill="none"
              style={{ animation: 'chevron-bounce 2s ease-in-out infinite', animationDelay: `${i * 0.2}s`, opacity: 1 - i * 0.25 }}
            >
              <polyline points="1,1 6,6 11,1" stroke="rgba(198,200,238,0.6)" strokeWidth={1.5} strokeLinecap="round" strokeLinejoin="round" />
            </svg>
          ))}
        </div>
      </div>
    </section>
  )
}
