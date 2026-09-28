import type { Metadata } from 'next'
import PageHero from '@/components/PageHero'
import PhotoFrame from '@/components/PhotoFrame'
import CollabCTA from '@/components/CollabCTA'
import { Container, Heading, MicroLabel } from '@/components/ui'

export const metadata: Metadata = {
  title: 'WitCode',
  description:
    'WitCode: talleres de tecnología para alumnas de 1° a 3° de secundaria de la escuela Ciudad de los Niños.',
}

/** TODO: drop the group photo in /public/photos and set the path here. */
const WITCODE_PHOTO: string | null = null

const PROGRAMA = [
  'Clases semanales sobre diferentes temas tecnológicos.',
  'Grupos de principiantes (para alumnas nuevas al programa) y avanzadas.',
  'Modalidad en línea, con sesiones presenciales de inicio y clausura.',
]

const IMPACTO = [
  { value: '94', label: 'participantes' },
  { value: '76', label: 'estudiantes universitarias realizando su servicio social' },
  { value: '90%', label: 'de permanencia en los talleres' },
]

export default function WitCodePage() {
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

      <Container className="grid gap-10 lg:grid-cols-[1fr_1.1fr] lg:items-center">
        <div className="glass rounded-[2rem] p-8 sm:p-10">
          <MicroLabel className="mb-5">Propósito</MicroLabel>
          <p className="m-0 font-display text-[clamp(1.35rem,2.4vw,1.75rem)] font-semibold leading-snug text-white">
            WitCode tiene como objetivo atender la brecha de género en la tecnología por medio de una educación que
            brinde herramientas para nivelar las oportunidades de manera igualitaria en este ámbito.
          </p>
          <p className="mt-6 mb-0 text-[16px] font-light leading-[1.75] text-white/75">
            Lo anterior, mediante talleres a alumnas de 1° a 3° de secundaria de la escuela Ciudad de los Niños.
          </p>
        </div>

        <div className="relative">
          <PhotoFrame src={WITCODE_PHOTO} alt="Generación de WitCode" className="aspect-[4/3] w-full" sizes="(min-width: 1024px) 560px, 92vw" />
          <p
            className="absolute bottom-6 left-7 m-0 font-display text-[clamp(1.6rem,3vw,2.25rem)] font-extrabold leading-none text-white"
            style={{ textShadow: '0 2px 20px rgba(0,0,0,0.6)' }}
          >
            Bienvenida
            <br />
            WitCode
          </p>
        </div>
      </Container>

      <section className="pt-24">
        <Container className="grid gap-6 md:grid-cols-2">
          <div className="glass rounded-[2rem] p-8 sm:p-10">
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

          <div
            className="rounded-[2rem] border border-white/10 p-8 sm:p-10"
            style={{ background: 'linear-gradient(135deg, rgba(100,17,173,0.55) 0%, rgba(71,18,107,0.4) 60%, rgba(144,102,210,0.3) 100%)' }}
          >
            <Heading as="h2" className="text-4xl">
              Impacto
            </Heading>
            <dl className="mt-8 mb-0 flex flex-col gap-5">
              {IMPACTO.map((s) => (
                <div key={s.label} className="flex items-baseline gap-5">
                  <dt className="sr-only">{s.label}</dt>
                  <dd className="m-0 min-w-24 shrink-0 whitespace-nowrap font-display text-4xl font-extrabold text-peri">{s.value}</dd>
                  <dd className="m-0 text-[15px] font-light leading-snug text-white/80">{s.label}</dd>
                </div>
              ))}
            </dl>
            <p className="mt-8 mb-0 text-xs font-light text-white/50">En cifras totales del 2024.</p>
          </div>
        </Container>
      </section>

      <CollabCTA />
    </>
  )
}
