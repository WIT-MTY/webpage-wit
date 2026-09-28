import FloatingShapes, { type FloatingShape } from './FloatingShapes'
import { Heading, MicroLabel, Rule } from './ui'

/**
 * Subpage hero. Same recipe as the landing page, scaled down:
 * micro label, big display title, one supporting line, drifting shapes.
 */
export default function PageHero({
  label,
  title,
  intro,
  shapes,
  children,
}: {
  label: string
  title: React.ReactNode
  intro?: React.ReactNode
  shapes: FloatingShape[]
  children?: React.ReactNode
}) {
  return (
    <section className="relative flex min-h-[72svh] flex-col items-center justify-center px-6 pb-16 pt-32 text-center">
      <FloatingShapes items={shapes} />
      <div className="relative z-10 flex max-w-3xl flex-col items-center">
        <MicroLabel className="mb-7">{label}</MicroLabel>
        <Heading as="h1" className="text-[clamp(2.75rem,8vw,6rem)]">
          {title}
        </Heading>
        {intro && (
          <>
            <Rule className="my-8" />
            <p className="m-0 max-w-xl text-[clamp(15px,1.4vw,18px)] font-light leading-relaxed text-white/75">{intro}</p>
          </>
        )}
        {children}
      </div>
    </section>
  )
}
