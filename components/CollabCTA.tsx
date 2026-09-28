import FloatingShapes from './FloatingShapes'
import { Button, Heading } from './ui'

export default function CollabCTA() {
  return (
    <section className="relative mx-auto mt-28 max-w-6xl px-6 lg:px-10">
      <div className="glass relative overflow-hidden rounded-[2rem] px-8 py-16 text-center sm:px-14 md:py-20">
        <div
          className="pointer-events-none absolute inset-0"
          style={{ background: 'linear-gradient(135deg, rgba(100,17,173,0.35) 0%, rgba(71,18,107,0.15) 50%, rgba(255,87,149,0.12) 100%)' }}
          aria-hidden="true"
        />
        <FloatingShapes
          items={[
            { shape: 'loop', depth: 'mid', size: 150, rotate: -18, opacity: 0.7, pos: { top: '-10%', left: '-3%' }, motion: 'slow', duration: 11, hideBelow: 'md' },
            { shape: 'slab', depth: 'mid', size: 140, rotate: 14, opacity: 0.6, pos: { bottom: '-18%', right: '2%' }, motion: 'medium', duration: 13, hideBelow: 'md' },
          ]}
        />
        <div className="relative">
          <Heading className="text-[clamp(2rem,5vw,3.5rem)]">¿Quieres colaborar con WIT?</Heading>
          <p className="mx-auto mt-6 mb-10 max-w-lg text-[17px] font-light leading-relaxed text-white/75">
            Juntas podemos seguir creando oportunidades y hacer florecer más talento en tecnología.
          </p>
          <Button href="/contacto">Contáctanos</Button>
        </div>
      </div>
    </section>
  )
}
