import RingPulse from './RingPulse'
import { Button, Heading } from './ui'
import styles from './AllyCTA.module.css'

/**
 * Full-width "become an ally" band (Aliados; WitCode reuses it with its own
 * copy). Defaults are the Aliados version.
 */
export default function AllyCTA({
  id = 'aliado-cta-title',
  heading = '¿Quieres ser nuestro aliado?',
  line,
  label = 'Contáctanos',
  href = '/contacto',
}: {
  /** id for the heading, unique per page. */
  id?: string
  heading?: string
  /** Optional short line under the heading. */
  line?: string
  label?: string
  /** A route or a mailto: link. */
  href?: string
}) {
  return (
    <section
      aria-labelledby={id}
      className="relative mt-28 overflow-hidden border-y border-white/10 py-20 md:py-28"
      data-ambient-group=""
    >
      <div
        className="pointer-events-none absolute inset-0"
        style={{ background: 'linear-gradient(135deg, rgba(100,17,173,0.5) 0%, rgba(71,18,107,0.35) 50%, rgba(255,87,149,0.18) 100%)' }}
        aria-hidden="true"
      />
      <div className="relative mx-auto flex max-w-6xl flex-col items-center px-6 text-center lg:px-10">
        <div id={id}>
          <Heading as="h2" className="text-[clamp(2.2rem,5.5vw,4rem)]">
            {heading}
          </Heading>
        </div>
        {line && <p className="mt-6 mb-0 max-w-lg text-[17px] font-light leading-relaxed text-white/75">{line}</p>}
        <div className="relative mt-10 transition-transform duration-200 hover:-translate-y-0.5">
          {/* eslint-disable-next-line @next/next/no-img-element -- decorative glow */}
          <img
            src="/fx/cta-glow.svg"
            alt=""
            aria-hidden="true"
            data-ambient=""
            className={`${styles.glow} pointer-events-none absolute top-1/2 left-1/2 w-[340px] max-w-none -translate-x-1/2 -translate-y-1/2 select-none`}
          />
          {/* Static gradient ring around the button. Touch only: ring flash on first view and a tap press. */}
          <RingPulse touchOnly>
            <span className="relative block rounded-full bg-[linear-gradient(135deg,#c6c8ee_0%,#9066d2_45%,#ff5795_100%)] p-[1.5px]">
              <Button href={href} className="hover:translate-y-0!">
                {label}
              </Button>
            </span>
          </RingPulse>
        </div>
      </div>
    </section>
  )
}
