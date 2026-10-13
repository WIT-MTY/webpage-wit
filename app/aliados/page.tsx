import fs from 'node:fs'
import path from 'node:path'
import type { Metadata } from 'next'
import PageHero from '@/components/PageHero'
import AllyCTA from '@/components/AllyCTA'
import AllyTile from '@/components/AllyTile'
import Celestial from '@/components/Celestial'
import LogoConveyor from '@/components/LogoConveyor'
import Typewriter from '@/components/Typewriter'
import { Container, Heading, MicroLabel } from '@/components/ui'
import { ALLIES } from '@/lib/site'

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

const WAYS = [
  { title: 'Patrocina un evento', body: 'Haz posible Hack4Her, el Día de la Mujer y nuestros eventos.', icon: 'star' as const },
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

      <Container>
        <div className="mb-10 text-center">
          <MicroLabel className="mb-5">Diferentes talentos, mismo propósito</MicroLabel>
          <Heading className="text-[clamp(2.2rem,5vw,3.75rem)]">Aliados estratégicos</Heading>
        </div>
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

      <section className="pt-28">
        <Container>
          <Heading className="mb-10 text-center text-[clamp(2rem,4.5vw,3.25rem)]">Formas de colaborar</Heading>
          <ul className="m-0 grid list-none gap-5 p-0 md:grid-cols-3">
            {WAYS.map((w) => (
              <li key={w.title} className="glass rounded-3xl p-8">
                <span className="mb-5 block text-peri">
                  <Celestial kind={w.icon} size={26} />
                </span>
                <h3 className="m-0 font-display text-2xl font-bold text-white">{w.title}</h3>
                <p className="mt-3 mb-0 text-[15px] font-light leading-relaxed text-white/72">{w.body}</p>
              </li>
            ))}
          </ul>
        </Container>
      </section>

      <AllyCTA />
    </>
  )
}
