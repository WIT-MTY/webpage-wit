import fs from 'node:fs'
import path from 'node:path'
import type { Metadata } from 'next'
import PageHero from '@/components/PageHero'
import AllyCTA from '@/components/AllyCTA'
import AllyTile from '@/components/AllyTile'
import Celestial, { type CelestialKind } from '@/components/Celestial'
import LogoConveyor from '@/components/LogoConveyor'
import RingPulse from '@/components/RingPulse'
import { RevealGroup } from '@/components/Reveal'
import Typewriter from '@/components/Typewriter'
import { Button, Container, Heading, MicroLabel } from '@/components/ui'
import { ACTIVITIES, ALLIES, CONTACT_EMAIL, SPONSOR_BENEFITS, SPONSOR_INTRO, SPONSOR_OTHER_WAYS } from '@/lib/site'

export const metadata: Metadata = {
  title: 'Aliados estratégicos',
  description: 'Las organizaciones que hacen posible el trabajo de WIT.',
}

const LOGO_EXTENSIONS = ['.png', '.jpg', '.jpeg', '.webp', '.svg']

/** Finds an ally's logo in /public/aliados by base name. Runs at build time. */
function resolveLogo(base: string | null): string | null {
  if (!base) return null
  const ext = LOGO_EXTENSIONS.find((e) => fs.existsSync(path.join(process.cwd(), 'public', 'aliados', base + e)))
  return ext ? `/aliados/${base}${ext}` : null
}

/** Sponsoring: mail with the subject filled in, or the contact page while there is no email. */
const SPONSOR_HREF = CONTACT_EMAIL
  ? `mailto:${CONTACT_EMAIL}?subject=${encodeURIComponent('Patrocinio de eventos WIT')}`
  : '/contacto'

/**
 * Grid classes that center the last row when it isn't full: a lone card on
 * tablet (4 tracks, cards span 2), a lone card or a pair on desktop (6 tracks).
 */
function centerOrphans(i: number, n: number) {
  const tablet = n % 2 === 1 && i === n - 1 ? 'sm:col-start-2' : ''
  const desktop =
    n % 3 === 1 && i === n - 1 ? 'lg:col-start-3' : n % 3 === 2 && i === n - 2 ? 'lg:col-start-2' : tablet ? 'lg:col-start-auto' : ''
  return `${tablet} ${desktop}`
}

const WAYS = [
  { title: 'Comparte tu experiencia', body: 'Imparte un taller o una charla para nuestra comunidad.', icon: 'burst' as const },
  { title: 'Abre puertas', body: 'Súmate a Journey to Internship con prácticas y mentorías.', icon: 'constellation' as const },
]

export default function AliadosPage() {
  const allies = ALLIES.map((ally) => ({ ally, logo: resolveLogo(ally.logo) }))
  return (
    <>
      <PageHero
        label="Aliados estratégicos"
        title="Las grandes ideas florecen en comunidad"
        intro="Gracias a nuestros aliados seguimos creando oportunidades, conectando talento y sembrando un futuro más inclusivo en tecnología."
        shapes={[
          { shape: 'chain', depth: 'far', size: 300, rotate: 18, opacity: 0.45, pos: { top: '10%', right: '-1%' }, motion: 'slow', duration: 13, hideBelow: 'lg' },
          { shape: 'blob2', depth: 'mid', size: 160, rotate: -12, opacity: 0.8, pos: { top: '20%', left: '6%' }, motion: 'medium', duration: 10, hideBelow: 'md' },
          { shape: 'burst', depth: 'near', size: 76, rotate: 8, opacity: 1, pos: { bottom: '12%', right: '16%' }, motion: 'medium', duration: 7, hideBelow: 'sm' },
        ]}
      >
        <p className="mt-10 mb-0 font-mono text-[13px] tracking-[0.12em] text-peri/85">
          <span className="text-wit-pink/85" aria-hidden="true">
            &gt;{' '}
          </span>
          <Typewriter
            text={[{ text: 'juntas construimos un futuro más inclusivo' }, { text: '();', tone: 'accent' }]}
            tones={{ accent: 'text-wit-pink' }}
          />
        </p>
      </PageHero>

      {/* data-lumi-anchor: where Lumi sits while this part is mid-screen (LumiCompanion). */}
      <div data-lumi-anchor="center">
        <Container>
          {/* RevealGroup / RingPulse touchOnly: touch devices only; desktop is unchanged. */}
          <RevealGroup>
          <div className="mb-10 text-center">
            <MicroLabel className="mb-5">Diferentes talentos, mismo propósito</MicroLabel>
            <Heading className="text-[clamp(2.2rem,5vw,3.75rem)]">Aliados estratégicos</Heading>
          </div>
          </RevealGroup>
          {/* Reduced motion: the static grid. Otherwise: the conveyor. CSS picks, so the server HTML already matches. */}
          <ul className="m-0 hidden list-none flex-wrap justify-center gap-5 p-0 motion-reduce:flex">
            {allies.map(({ ally, logo }) => (
              <li key={ally.name} className="flex w-[calc(50%-10px)] flex-col items-center text-center sm:w-[200px]">
                <AllyTile ally={ally} logo={logo} />
              </li>
            ))}
          </ul>
        </Container>
        <LogoConveyor items={allies} className="mx-auto max-w-[1440px] motion-reduce:hidden" />
      </div>

      <section data-lumi-anchor="left" className="pt-28">
        <Container>
          {/* Touch: the marked items fade up as they arrive; the sponsor card's frame stays put. */}
          <RevealGroup>
          <div data-reveal="">
            <Heading className="mb-10 text-center text-[clamp(2rem,4.5vw,3.25rem)]">Formas de colaborar</Heading>
          </div>

          {/* Sponsoring: intro, why, and how to join each event. Copy lives in lib/site.ts (SPONSOR_*, sponsorHow). */}
          <div className="glass rounded-3xl p-5 sm:p-8 lg:p-10">
            <span className="mb-5 block text-peri">
              <Celestial kind="star" size={26} />
            </span>
            <h3 data-reveal="" className="m-0 font-display text-[clamp(1.6rem,3.2vw,2.25rem)] font-bold text-white">Haz posible nuestros eventos</h3>
            <p data-reveal="" className="mt-4 mb-0 max-w-2xl text-[16px] font-light leading-relaxed text-white/75">{SPONSOR_INTRO}</p>

            <ul className="mt-8 mb-0 grid list-none gap-3 p-0 sm:grid-cols-3">
              {SPONSOR_BENEFITS.map((b) => (
                <li key={b.title} data-reveal="" className="flex min-w-0 items-start gap-3 rounded-2xl border border-peri/20 bg-peri/[0.06] p-4">
                  <span className="mt-0.5 shrink-0 text-wit-pink/80">
                    <Celestial kind={b.icon} size={18} />
                  </span>
                  <span className="min-w-0 [overflow-wrap:anywhere]">
                    <span className="block text-[13px] font-semibold uppercase tracking-[0.14em] text-white">{b.title}</span>
                    <span className="mt-1 block text-[14px] font-light leading-snug text-white/70">{b.body}</span>
                  </span>
                </li>
              ))}
            </ul>

            {/*
              Equal-height cards (auto-rows-fr) once they sit side by side: 1 column on phones, 2 on tablets
              (4-track grid, span 2), 3 on desktop (6-track grid, span 2). The
              tracks let a lone last card (or a last pair) start mid-row, centered.
            */}
            <ul className="mt-6 mb-0 grid list-none gap-3 p-0 sm:auto-rows-fr sm:grid-cols-4 lg:grid-cols-6">
              {ACTIVITIES.map((e, i) => (
                <li
                  key={e.slug}
                  data-reveal=""
                  className={`glass-strong flex min-w-0 items-start gap-3 rounded-2xl p-4 sm:col-span-2 ${centerOrphans(i, ACTIVITIES.length)}`}
                >
                  <span className="mt-0.5 shrink-0 text-peri/80">
                    <Celestial kind={e.icon as CelestialKind} size={18} />
                  </span>
                  <span className="min-w-0 [overflow-wrap:anywhere]">
                    <span className="block font-display text-[17px] font-bold text-white">{e.title}</span>
                    {e.sponsorHow && (
                      <>
                        <span className="mt-2 block text-[10px] uppercase tracking-[0.2em] text-peri/60">Cómo puedes sumarte</span>
                        <span className="mt-1 block text-[14px] font-light leading-snug text-white/75">{e.sponsorHow}</span>
                      </>
                    )}
                  </span>
                </li>
              ))}
            </ul>

            <div data-reveal="" className="mt-8">
              {/* Less side padding on phones so the label stays on one line at 320px. */}
              <RingPulse touchOnly className="w-full sm:w-auto">
                <Button href={SPONSOR_HREF} className="w-full px-5! sm:w-auto sm:px-9!">
                  Quiero patrocinar
                </Button>
              </RingPulse>
              <p className="mt-3 mb-0 text-[14px] font-light text-white/60">{SPONSOR_OTHER_WAYS}</p>
            </div>
          </div>

          <ul className="m-0 mt-5 grid list-none gap-5 p-0 md:grid-cols-2">
            {WAYS.map((w) => (
              <li key={w.title} data-reveal="" className="glass rounded-3xl p-8">
                <span className="mb-5 block text-peri">
                  <Celestial kind={w.icon} size={26} />
                </span>
                <h3 className="m-0 font-display text-2xl font-bold text-white">{w.title}</h3>
                <p className="mt-3 mb-0 text-[15px] font-light leading-relaxed text-white/72">{w.body}</p>
              </li>
            ))}
          </ul>
          </RevealGroup>
        </Container>
      </section>

      <RevealGroup>
        <AllyCTA />
      </RevealGroup>
    </>
  )
}
