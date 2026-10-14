import RingPulse from './RingPulse'
import { SocialIcon } from './SocialIcon'
import shine from './Shine.module.css'
import styles from './InstagramHero.module.css'

/*
  The big Instagram action on Contáctanos.

  - Rotating conic ring and a live dot (see InstagramHero.module.css).
  - First time it is fully on screen: RingPulse's three-pulse flash, the
    same one as on Integrantes.
  - Hover and keyboard focus: lifts (translate + scale 1.03), the arrow
    nudges right, and the shared Shine glint sweeps once.
*/
export default function InstagramHero({ href, handle }: { href: string; handle: string }) {
  return (
    <div className="flex flex-col items-stretch gap-4" data-ambient-group="">
      <RingPulse>
        <a
          href={href}
          target="_blank"
          rel="noopener noreferrer"
          aria-label="Instagram de WIT (se abre en una pestaña nueva)"
          className={`${shine.host} group flex min-h-14 w-full items-center gap-3 rounded-full px-6 text-white no-underline transition-transform duration-200 ease-out hover:-translate-y-0.5 hover:scale-[1.03] focus-visible:-translate-y-0.5 focus-visible:scale-[1.03] focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-peri`}
        >
          <span className={styles.clip} aria-hidden="true">
            <span className={styles.spin} data-ambient="" />
            <span className={styles.fill} />
          </span>
          <span className={shine.track} aria-hidden="true">
            <span className={shine.strip} />
          </span>
          <span className="relative flex w-full items-center gap-3">
            <SocialIcon name="Instagram" size={20} />
            <span className="font-display text-[clamp(1.15rem,1.8vw,1.35rem)] font-bold">{handle}</span>
            <span
              className="ml-auto text-lg text-peri transition-transform duration-200 ease-out group-hover:translate-x-1 group-focus-visible:translate-x-1"
              aria-hidden="true"
            >
              →
            </span>
          </span>
        </a>
      </RingPulse>
      <p className="m-0 flex items-center gap-2.5 text-[13px] font-light text-white/70">
        <span className={styles.dot} aria-hidden="true" />
        Síguenos para lo más reciente
      </p>
    </div>
  )
}
