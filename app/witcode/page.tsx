import type { Metadata } from 'next'
import PageHero from '@/components/PageHero'
import PhotoFade from '@/components/PhotoFade'
import CountUp from '@/components/CountUp'
import Reveal from '@/components/Reveal'
import ShineCard from '@/components/ShineCard'
import RingPulse from '@/components/RingPulse'
import { RevealGroup } from '@/components/Reveal'
import CollabCTA from '@/components/CollabCTA'
import { SocialIcon } from '@/components/SocialIcon'
import { Button, Container, Heading, MicroLabel } from '@/components/ui'
import { CONTACT_EMAIL, WITCODE_APPLY_URL, WITCODE_DESCRIPTION, WITCODE_INSTAGRAM_URL, WITCODE_PHOTOS, WITCODE_STATS } from '@/lib/site'
import AllyCTA from '@/components/AllyCTA'

export const metadata: Metadata = {
  title: 'WitCode',
  description:
    'WitCode: talleres de tecnología para alumnas de 1° a 3° de secundaria de la escuela Ciudad de los Niños.',
}

const PROGRAMA = [
  'Clases semanales sobre diferentes temas tecnológicos.',
  'Grupos de principiantes (para alumnas nuevas al programa) y avanzadas.',
  'Modalidad en línea, con sesiones presenciales de inicio y clausura.',
]

/** Caption laid over a photo block. */
function PhotoCaption({ className, children }: { className: string; children: React.ReactNode }) {
  return (
    <p
      className={`absolute m-0 font-display font-extrabold leading-none text-white ${className}`}
      style={{ textShadow: '0 2px 20px rgba(0,0,0,0.6)' }}
    >
      {children}
    </p>
  )
}

export default function WitCodePage() {
  const [big, small] = WITCODE_PHOTOS
  return (
    <>
      <PageHero
        label="Servicio social · @witcode.mty"
        title="WitCode"
        intro="Educación en tecnología para nivelar las oportunidades desde la secundaria."
        shapes={[
          { shape: 'zigzag', depth: 'far', size: 300, rotate: 16, opacity: 0.45, pos: { top: '12%', right: '-2%' }, motion: 'slow', duration: 12, hideBelow: 'lg' },
          { shape: 'loop', depth: 'mid', size: 150, rotate: -14, opacity: 0.85, pos: { top: '22%', left: '8%' }, motion: 'medium', duration: 10, hideBelow: 'md' },
          { shape: 'burst', depth: 'near', size: 80, rotate: 20, opacity: 1, pos: { bottom: '14%', right: '14%' }, motion: 'medium', duration: 7, hideBelow: 'sm' },
        ]}
      />

      {/* data-lumi-anchor: where Lumi sits while this part is mid-screen (LumiCompanion). */}
      <div data-lumi-anchor="left">
        <Container className="grid gap-10 lg:grid-cols-[1fr_1.1fr] lg:items-start">
          {/*
            Touch only (RevealGroup): the marked parts fade up as they arrive; the
            later paragraphs already have their own Reveal. Desktop is unchanged.
          */}
          <RevealGroup>
          <div className="glass rounded-[2rem] p-8 sm:p-10">
            <div data-reveal="">
              <MicroLabel className="mb-5">Propósito</MicroLabel>
            </div>
            <p data-reveal="" className="m-0 font-display text-[clamp(1.35rem,2.4vw,1.75rem)] font-semibold leading-snug text-white">
              {WITCODE_DESCRIPTION[0]}
            </p>
            {WITCODE_DESCRIPTION.slice(1).map((p, i) => (
              <Reveal key={p} delay={i * 120}>
                <p className="mt-6 mb-0 text-[16px] font-light leading-[1.75] text-white/75">{p}</p>
              </Reveal>
            ))}
            <div data-reveal="" className="mt-10 flex flex-wrap gap-3">
              {WITCODE_APPLY_URL ? (
                // TODO(kat): confirm the button label once applications open.
                <RingPulse touchOnly>
                  <Button href={WITCODE_APPLY_URL} external>
                    Aplicar
                  </Button>
                </RingPulse>
              ) : (
                <button
                  type="button"
                  disabled
                  className="cursor-not-allowed rounded-full border border-white/15 bg-white/[0.06] px-7 py-3.5 text-[12px] font-medium uppercase tracking-[0.2em] text-white/55"
                >
                  Convocatoria no abierta por ahora
                </button>
              )}
              {WITCODE_INSTAGRAM_URL && (
                // Same one-shot ring flash as the Instagram buttons on Integrantes and Contáctanos.
                <RingPulse>
                  <Button
                    href={WITCODE_INSTAGRAM_URL}
                    external
                    variant="glass"
                    ariaLabel="Síguenos en Instagram @witcode.mty (se abre en una pestaña nueva)"
                  >
                    <SocialIcon name="Instagram" size={16} />
                    {/* One text run, so it wraps as a sentence on narrow screens. */}
                    <span>
                      Síguenos en Instagram <span className="normal-case tracking-normal">@witcode.mty</span>
                    </span>
                  </Button>
                </RingPulse>
              )}
            </div>
          </div>

          {/*
            Two photo blocks: a large one and a smaller one that overlaps its
            lower-right corner (md+). Stacked on mobile. Sticky beside the long
            text on desktop. Static: the rotation is not animated.
          */}
          <div className="flex flex-col gap-5 md:relative md:block md:pb-48 lg:sticky lg:top-28">
            <div data-reveal="" className="relative md:w-[86%]">
              <PhotoFade
                photos={big.photos}
                alt={big.alt}
                className="aspect-[4/3] w-full"
                sizes="(min-width: 1024px) 480px, (min-width: 768px) 86vw, 92vw"
              />
              <PhotoCaption className="bottom-6 left-7 max-w-[10ch] text-[clamp(1.6rem,3vw,2.25rem)]">{big.caption}</PhotoCaption>
            </div>
            {/* Solid backing so the translucent placeholder doesn't show the big block through it. */}
            <div data-reveal="" className="relative rounded-3xl bg-night md:absolute md:right-0 md:bottom-0 md:w-[50%] md:rotate-3">
              {/* Offset so the two blocks never change at the same moment. */}
              <PhotoFade
                photos={small.photos}
                alt={small.alt}
                staggerOffset={2750}
                className="aspect-[4/3] w-full md:aspect-[4/5]"
                sizes="(min-width: 1024px) 280px, (min-width: 768px) 50vw, 92vw"
              />
              <PhotoCaption className="bottom-5 left-6 max-w-[14ch] text-[clamp(1.1rem,1.8vw,1.35rem)]">{small.caption}</PhotoCaption>
            </div>
          </div>
          </RevealGroup>
        </Container>
      </div>

      <section data-lumi-anchor="right" className="pt-24">
        <Container className="grid gap-6 md:grid-cols-2">
          <Reveal>
            <ShineCard className="h-full" radius="rounded-[2rem]">
              <div className="glass h-full rounded-[2rem] p-8 sm:p-10">
                <Heading as="h2" className="text-4xl">
                  Programa
                </Heading>
                <ul className="mt-8 mb-0 flex list-none flex-col gap-5 p-0">
                  {PROGRAMA.map((item) => (
                    <li key={item} className="flex gap-4 text-[16px] font-light leading-relaxed text-white/80">
                      <span className="mt-2.5 h-1.5 w-1.5 shrink-0 rounded-full bg-peri shadow-[0_0_10px_rgba(198,200,238,0.8)]" />
                      {item}
                    </li>
                  ))}
                </ul>
              </div>
            </ShineCard>
          </Reveal>

          <Reveal delay={120}>
            <ShineCard className="h-full" radius="rounded-[2rem]">
              <div
                className="h-full rounded-[2rem] border border-white/10 p-8 sm:p-10"
                style={{ background: 'linear-gradient(135deg, rgba(100,17,173,0.55) 0%, rgba(71,18,107,0.4) 60%, rgba(144,102,210,0.3) 100%)' }}
              >
                <Heading as="h2" className="text-4xl">
                  Impacto
                </Heading>
                <MicroLabel className="mt-6">Métricas anuales</MicroLabel>
                <dl className="mt-6 mb-0 flex flex-col gap-5">
                  {WITCODE_STATS.map((s, i) => (
                    <Reveal key={s.label} delay={240 + i * 120} className="flex items-baseline gap-5">
                      <dt className="sr-only">{s.label}</dt>
                      {/* Server HTML holds the final value; it counts up from 0 once on screen. */}
                      <dd className="m-0 min-w-24 shrink-0 whitespace-nowrap font-display text-4xl font-extrabold tabular-nums text-peri">
                        <CountUp value={s.value} duration={1200} />
                      </dd>
                      <dd className="m-0 text-[15px] font-light leading-snug text-white/80">{s.label}</dd>
                    </Reveal>
                  ))}
                </dl>
              </div>
            </ShineCard>
          </Reveal>
        </Container>
      </section>

      {/* Ally band, same component as Aliados. Mail with the subject filled in, or the contact page without an email. */}
      <RevealGroup>
      <AllyCTA
        id="witcode-aliado-title"
        heading="¿Quieres ser aliado estratégico de WitCode?"
        line="Escríbenos y conversemos cómo sumarte."
        label="Escríbenos"
        href={CONTACT_EMAIL ? `mailto:${CONTACT_EMAIL}?subject=${encodeURIComponent('Aliado estratégico WitCode')}` : '/contacto'}
      />
      </RevealGroup>

      <RevealGroup>
        <CollabCTA />
      </RevealGroup>
    </>
  )
}
