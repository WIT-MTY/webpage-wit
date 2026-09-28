import HomeHero from '@/components/HomeHero'
import ActivityGrid from '@/components/ActivityGrid'
import CollabCTA from '@/components/CollabCTA'
import PhotoFrame from '@/components/PhotoFrame'
import FloatingShapes from '@/components/FloatingShapes'
import { Button, Container, Heading, MicroLabel } from '@/components/ui'
import { COLLAGE_PHOTOS } from '@/lib/site'

const WITCODE_STATS = [
  { value: '94', label: 'participantes' },
  { value: '76', label: 'universitarias en servicio social' },
  { value: '90%', label: 'de permanencia en los talleres' },
]

export default function Home() {
  return (
    <>
      <HomeHero />

      {/* Sobre nosotras */}
      <section id="sobre-nosotras" className="scroll-mt-24 pt-24">
        <Container className="grid items-center gap-16 lg:grid-cols-[1fr_1.05fr]">
          <div>
            <MicroLabel className="mb-6">Sobre nosotras</MicroLabel>
            <Heading className="text-[clamp(2.4rem,5.5vw,4.25rem)]">Una comunidad que abre camino</Heading>
            <p className="mt-8 mb-0 max-w-[34rem] text-[17px] font-light leading-[1.75] text-white/78">
              Women in Technology es un grupo estudiantil del Tecnológico de Monterrey, Campus Monterrey. Somos una
              comunidad de mujeres que busca atender la brecha de género en el ámbito de la tecnología.
            </p>
            <div className="mt-10">
              <Button href="/integrantes" variant="glass">
                Conócenos
              </Button>
            </div>
          </div>

          {/* Collage: three overlapping frames at slight angles */}
          <div className="relative mx-auto h-[420px] w-full max-w-[520px] sm:h-[480px]">
            <PhotoFrame
              src={COLLAGE_PHOTOS[0].src}
              alt={COLLAGE_PHOTOS[0].alt}
              className="absolute left-0 top-6 h-[62%] w-[62%]"
              style={{ transform: 'rotate(-4deg)' }}
            />
            <PhotoFrame
              src={COLLAGE_PHOTOS[1].src}
              alt={COLLAGE_PHOTOS[1].alt}
              className="absolute right-0 top-0 h-[50%] w-[48%]"
              style={{ transform: 'rotate(3deg)' }}
            />
            <PhotoFrame
              src={COLLAGE_PHOTOS[2].src}
              alt={COLLAGE_PHOTOS[2].alt}
              className="absolute bottom-0 right-[8%] h-[46%] w-[58%]"
              style={{ transform: 'rotate(-1.5deg)' }}
            />
            <FloatingShapes
              items={[
                { shape: 'burst', depth: 'near', size: 70, rotate: 12, opacity: 0.95, pos: { bottom: '8%', left: '4%' }, motion: 'medium', duration: 8 },
              ]}
              className="overflow-visible"
            />
          </div>
        </Container>
      </section>

      {/* Proyectos */}
      <section className="pt-32">
        <Container>
          <div className="mb-12 flex flex-col items-start justify-between gap-6 md:flex-row md:items-end">
            <div>
              <MicroLabel className="mb-6">Proyectos</MicroLabel>
              <Heading className="text-[clamp(2.4rem,5.5vw,4.25rem)]">Más que eventos</Heading>
            </div>
            <p className="m-0 max-w-sm text-[16px] font-light leading-relaxed text-white/70">
              Durante el semestre organizamos actividades para aprender, conectar y crear juntas.
            </p>
          </div>
          <ActivityGrid />
        </Container>
      </section>

      {/* WitCode */}
      <section className="pt-32">
        <Container>
          <div className="glass relative overflow-hidden rounded-[2rem] p-8 sm:p-12 lg:p-16">
            <div
              className="pointer-events-none absolute inset-0"
              style={{ background: 'linear-gradient(135deg, rgba(100,17,173,0.4) 0%, rgba(144,102,210,0.12) 60%, transparent 100%)' }}
              aria-hidden="true"
            />
            <div className="relative grid gap-12 lg:grid-cols-[1.1fr_1fr] lg:items-center">
              <div>
                <MicroLabel className="mb-6">Servicio social</MicroLabel>
                <Heading className="text-[clamp(2.4rem,5vw,4rem)]">WitCode</Heading>
                <p className="mt-6 mb-10 max-w-md text-[17px] font-light leading-[1.75] text-white/78">
                  Talleres de programación para alumnas de secundaria de la escuela Ciudad de los Niños, impartidos por
                  estudiantes del Tec.
                </p>
                <Button href="/witcode">Conoce WitCode</Button>
              </div>
              <dl className="m-0 grid gap-4">
                {WITCODE_STATS.map((s) => (
                  <div key={s.label} className="flex items-baseline gap-5 border-b border-white/10 pb-4 last:border-0">
                    <dt className="sr-only">{s.label}</dt>
                    <dd className="m-0 min-w-28 shrink-0 whitespace-nowrap font-display text-5xl font-extrabold text-peri">{s.value}</dd>
                    <dd className="m-0 text-[15px] font-light text-white/75">{s.label}</dd>
                  </div>
                ))}
                <p className="m-0 text-xs font-light text-white/45">Cifras totales del 2024.</p>
              </dl>
            </div>
          </div>
        </Container>
      </section>

      <CollabCTA />
    </>
  )
}
