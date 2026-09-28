import type { Metadata } from 'next'
import PageHero from '@/components/PageHero'
import ActivityGrid from '@/components/ActivityGrid'
import CollabCTA from '@/components/CollabCTA'
import FloatingShapes from '@/components/FloatingShapes'
import { Button, Container, Heading, MicroLabel } from '@/components/ui'
import { HACK4HER_URL } from '@/lib/site'

export const metadata: Metadata = {
  title: 'Proyectos',
  description: 'Conferencias, Journey to Internship, talleres, Día de la Mujer y Hack4Her.',
}

export default function ProyectosPage() {
  return (
    <>
      <PageHero
        label="Proyectos"
        title="Nuestras actividades"
        intro="Durante el semestre realizamos conferencias, Journey to Internship, talleres, Día de la Mujer y más. Juntas creamos más que eventos."
        shapes={[
          { shape: 'cylinder', depth: 'far', size: 300, rotate: -30, opacity: 0.45, pos: { top: '10%', left: '-2%' }, motion: 'slow', duration: 13, hideBelow: 'lg' },
          { shape: 'torus', depth: 'mid', size: 150, rotate: 20, opacity: 0.85, pos: { top: '18%', right: '8%' }, motion: 'medium', duration: 9, hideBelow: 'md' },
          { shape: 'burst', depth: 'near', size: 84, rotate: -10, opacity: 1, pos: { bottom: '14%', left: '12%' }, motion: 'medium', duration: 7, hideBelow: 'sm' },
        ]}
      />

      <Container>
        <ActivityGrid detailed />
      </Container>

      {/* Hack4Her feature. The event has its own site, so this links out. */}
      <section className="pt-28">
        <Container>
          <div className="relative overflow-hidden rounded-[2rem] border border-wit-pink/25 p-8 sm:p-12 lg:p-16"
            style={{ background: 'linear-gradient(135deg, rgba(100,17,173,0.45) 0%, rgba(71,18,107,0.35) 45%, rgba(255,87,149,0.22) 100%)' }}
          >
            <FloatingShapes
              items={[
                { shape: 'blob2', depth: 'mid', size: 190, rotate: 12, opacity: 0.7, pos: { top: '-12%', right: '-3%' }, motion: 'slow', duration: 12, hideBelow: 'md' },
              ]}
            />
            <div className="relative grid gap-10 lg:grid-cols-[1.2fr_1fr] lg:items-end">
              <div>
                <MicroLabel className="mb-6 text-wit-pink/80">Hackathon</MicroLabel>
                <Heading className="text-[clamp(2.6rem,6vw,4.75rem)]">Hack4Her</Heading>
                <p className="mt-6 mb-10 max-w-md text-[17px] font-light leading-[1.75] text-white/80">
                  Nuestro hackathon para impulsar a más mujeres en tecnología: equipos, mentoras y retos reales de la
                  industria.
                </p>
                <Button href={HACK4HER_URL ?? '#'} external={Boolean(HACK4HER_URL)}>
                  Ir a Hack4Her ↗
                </Button>
              </div>
              <div className="lg:text-right">
                <p className="m-0 font-display text-[clamp(4rem,10vw,7rem)] font-extrabold leading-none text-white">482</p>
                <p className="mt-2 mb-0 text-[15px] font-light uppercase tracking-[0.3em] text-peri/80">participantes</p>
              </div>
            </div>
          </div>
        </Container>
      </section>

      <CollabCTA />
    </>
  )
}
