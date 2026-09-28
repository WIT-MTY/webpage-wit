import Link from 'next/link'
import { Button, Container, Heading, MicroLabel } from '@/components/ui'

export default function NotFound() {
  return (
    <Container className="flex min-h-[80svh] flex-col items-center justify-center py-24 text-center">
      <MicroLabel className="mb-6">Error 404</MicroLabel>
      <p
        className="m-0 font-display text-[clamp(5rem,18vw,12.5rem)] font-extrabold leading-none"
        style={{
          background: 'linear-gradient(135deg, #c6c8ee 0%, #9066d2 55%, #ff5795 100%)',
          WebkitBackgroundClip: 'text',
          backgroundClip: 'text',
          color: 'transparent',
        }}
      >
        404
      </p>
      <Heading as="h1" className="mt-6 text-[clamp(1.75rem,4vw,2.75rem)]">
        Esta página no existe
      </Heading>
      <p className="mx-auto mt-6 mb-10 max-w-md text-[17px] font-light leading-relaxed text-white/75">
        Lumi buscó por todos lados y no la encontró. Puede que el enlace haya cambiado.
      </p>
      <div className="flex flex-col items-center gap-4 sm:flex-row">
        <Button href="/">Volver al inicio</Button>
        <Button href="/proyectos" variant="glass">
          Ver eventos
        </Button>
      </div>
    </Container>
  )
}
