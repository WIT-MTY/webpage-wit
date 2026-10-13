import fs from 'node:fs'
import path from 'node:path'
import type { Metadata } from 'next'
import PageHero from '@/components/PageHero'
import CollabCTA from '@/components/CollabCTA'
import Celestial from '@/components/Celestial'
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
        <p className="mt-10 mb-0 font-mono text-[13px] tracking-[0.12em] text-wit-pink/85">
          &gt; juntas construimos un futuro más inclusivo();
        </p>
      </PageHero>

      <Container>
        <div className="mb-10 text-center">
          <MicroLabel className="mb-5">Diferentes talentos, mismo propósito</MicroLabel>
          <Heading className="text-[clamp(2.2rem,5vw,3.75rem)]">Aliados estratégicos</Heading>
        </div>
        <ul className="m-0 flex list-none flex-wrap justify-center gap-5 p-0">
          {ALLIES.map((a) => {
            const logo = resolveLogo(a.logo)
            return (
              <li key={a.name} className="flex w-[calc(50%-10px)] flex-col items-center text-center sm:w-[200px]">
                {logo ? (
                  <div
                    className={`flex aspect-[3/2] w-full items-center justify-center rounded-2xl ${
                      a.tileBg === 'black' ? 'bg-black' : 'bg-white'
                    } ${a.wideLogo ? 'px-3 py-4' : 'p-5'}`}
                  >
                    {/* eslint-disable-next-line @next/next/no-img-element -- ally logos, mixed formats */}
                    <img src={logo} alt={`Logotipo de ${a.name}`} className="h-full w-full object-contain" />
                  </div>
                ) : (
                  <div className="glass-strong flex aspect-[3/2] w-full items-center justify-center rounded-2xl p-5">
                    <span className="font-display text-[15px] font-semibold leading-tight text-white">{a.name}</span>
                  </div>
                )}
                {logo && !a.nameInLogo && (
                  <span className="mt-4 text-[11px] uppercase tracking-[0.25em] text-peri/65">{a.name}</span>
                )}
                {a.years && <span className="mt-1 text-[11px] tracking-[0.15em] text-white/50">{a.years}</span>}
              </li>
            )
          })}
        </ul>
      </Container>

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

      <CollabCTA />
    </>
  )
}
