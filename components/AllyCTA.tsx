import { Button, Heading } from './ui'
import styles from './AllyCTA.module.css'

/** Full-width "become an ally" band at the bottom of Aliados. */
export default function AllyCTA() {
  return (
    <section
      aria-labelledby="aliado-cta-title"
      className="relative mt-28 overflow-hidden border-y border-white/10 py-20 md:py-28"
      data-ambient-group=""
    >
      <div
        className="pointer-events-none absolute inset-0"
        style={{ background: 'linear-gradient(135deg, rgba(100,17,173,0.5) 0%, rgba(71,18,107,0.35) 50%, rgba(255,87,149,0.18) 100%)' }}
        aria-hidden="true"
      />
      <div className="relative mx-auto flex max-w-6xl flex-col items-center px-6 text-center lg:px-10">
        <div id="aliado-cta-title">
          <Heading as="h2" className="text-[clamp(2.2rem,5.5vw,4rem)]">
            ¿Quieres ser nuestro aliado?
          </Heading>
        </div>
        <div className="relative mt-10 transition-transform duration-200 hover:-translate-y-0.5">
          {/* eslint-disable-next-line @next/next/no-img-element -- decorative glow */}
          <img
            src="/fx/cta-glow.svg"
            alt=""
            aria-hidden="true"
            data-ambient=""
            className={`${styles.glow} pointer-events-none absolute top-1/2 left-1/2 w-[340px] max-w-none -translate-x-1/2 -translate-y-1/2 select-none`}
          />
          {/* Static gradient ring around the button. */}
          <span className="relative block rounded-full bg-[linear-gradient(135deg,#c6c8ee_0%,#9066d2_45%,#ff5795_100%)] p-[1.5px]">
            <Button href="/contacto" className="hover:translate-y-0!">
              Contáctanos
            </Button>
          </span>
        </div>
      </div>
    </section>
  )
}
