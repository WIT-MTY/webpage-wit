import type { Metadata } from 'next'
import PageHero from '@/components/PageHero'
import CollabCTA from '@/components/CollabCTA'
import Celestial from '@/components/Celestial'
import { Container, Heading, MicroLabel } from '@/components/ui'

export const metadata: Metadata = {
  title: 'Aliados',
  description: 'Las organizaciones que hacen posible el trabajo de WIT.',
}

/**
 * Allies. Add a logo by dropping an SVG/PNG in /public/aliados and setting `logo`.
 * Leave `name: null` for an open slot.
 */
const ALLIES: { name: string | null; logo?: string; note?: string }[] = [
  { name: 'Tecnológico de Monterrey', note: 'Aliado académico' },
  { name: null },
  { name: null },
  { name: null },
  { name: null },
]

const WAYS = [
  { title: 'Patrocina un evento', body: 'Haz posible Hack4Her, el Día de la Mujer y nuestras conferencias.', icon: 'star' as const },
  { title: 'Comparte tu experiencia', body: 'Imparte un taller o una charla para nuestra comunidad.', icon: 'burst' as const },
  { title: 'Abre puertas', body: 'Súmate a Journey to Internship con prácticas y mentorías.', icon: 'constellation' as const },
]

export default function AliadosPage() {
  return (
    <>
      <PageHero
        label="Aliados"
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
          <Heading className="text-[clamp(2.2rem,5vw,3.75rem)]">Nuestros aliados</Heading>
        </div>
        <ul className="m-0 grid list-none grid-cols-2 gap-5 p-0 sm:grid-cols-3 lg:grid-cols-5">
          {ALLIES.map((a, i) => (
            <li key={i} className="flex flex-col items-center text-center">
              <div
                className={`flex aspect-square w-full max-w-[180px] items-center justify-center rounded-full p-6 ${
                  a.name ? 'glass-strong' : 'border border-dashed border-peri/25'
                }`}
              >
                {a.logo ? (
                  // eslint-disable-next-line @next/next/no-img-element -- ally logos, mixed formats
                  <img src={a.logo} alt={a.name ?? ''} className="max-h-[60%] max-w-[75%] object-contain" />
                ) : a.name ? (
                  <span className="font-display text-[15px] font-semibold leading-tight text-white">{a.name}</span>
                ) : (
                  <span className="text-peri/35">
                    <Celestial kind="star" size={22} />
                  </span>
                )}
              </div>
              <span className="mt-4 text-[11px] uppercase tracking-[0.25em] text-peri/65">
                {a.note ?? (a.name ? '' : 'Próximamente')}
              </span>
            </li>
          ))}
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
