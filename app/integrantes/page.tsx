import type { Metadata } from 'next'
import PageHero from '@/components/PageHero'
import TeamExplorer from '@/components/TeamExplorer'
import Countdown from '@/components/Countdown'
import StarField from '@/components/StarField'
import FloatingShapes from '@/components/FloatingShapes'
import { Button, Container, Heading, MicroLabel } from '@/components/ui'
import { APPLICATIONS_OPEN, SOCIALS } from '@/lib/site'

export const metadata: Metadata = {
  title: 'Integrantes',
  description: 'Conoce a las integrantes de WIT por generación y por área.',
}

export default function IntegrantesPage() {
  return (
    <>
      <div className="relative">
        <StarField />
        <PageHero
          label="Integrantes"
          title="Nuestras estrellas"
          intro="Las mujeres que hacen posible WIT, generación tras generación. Elige un año y explora cada área."
          shapes={[
            { shape: 'torus', depth: 'far', size: 280, rotate: -20, opacity: 0.4, pos: { top: '12%', left: '-1%' }, motion: 'slow', duration: 13, hideBelow: 'lg' },
            { shape: 'burst', depth: 'mid', size: 130, rotate: 14, opacity: 0.85, pos: { top: '20%', right: '9%' }, motion: 'medium', duration: 9, hideBelow: 'md' },
          ]}
        />
        <Container className="relative">
          <TeamExplorer />
        </Container>
      </div>

      {/* Recruitment */}
      <section id="unete" className="relative mt-32 scroll-mt-24 overflow-hidden py-28">
        <div
          className="pointer-events-none absolute inset-0"
          style={{ background: 'radial-gradient(ellipse 70% 60% at 50% 55%, rgba(71,18,107,0.55) 0%, rgba(8,4,20,0) 70%)' }}
          aria-hidden="true"
        />
        <StarField />
        <FloatingShapes
          items={[
            { shape: 'blob', depth: 'far', size: 300, rotate: 22, opacity: 0.35, pos: { bottom: '-8%', right: '2%' }, motion: 'slow', duration: 14, hideBelow: 'md' },
          ]}
        />
        <Container className="relative flex flex-col items-center text-center">
          <MicroLabel className="mb-6">Reclutamiento</MicroLabel>
          <Heading
            className="text-[clamp(4rem,14vw,9.5rem)] !leading-[0.9]"
          >
            <span
              style={{
                background: 'linear-gradient(135deg, #c6c8ee 0%, #9066d2 40%, #7c22c7 65%, #ff5795 100%)',
                WebkitBackgroundClip: 'text',
                backgroundClip: 'text',
                color: 'transparent',
                textShadow: 'none',
              }}
            >
              Únete.
            </span>
          </Heading>
          <p className="mt-8 mb-12 max-w-md text-[17px] font-light leading-relaxed text-white/70">
            Sé parte de algo estelar. Las aplicaciones abren cada semestre.
          </p>
          <Countdown target={APPLICATIONS_OPEN} />
          <div className="mt-12">
            <Button href={SOCIALS[0].href} external variant="glass">
              Entérate en Instagram →
            </Button>
          </div>
        </Container>
      </section>
    </>
  )
}
