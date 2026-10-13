import AllyTile from './AllyTile'
import type { Ally } from '@/lib/site'
import styles from './LogoConveyor.module.css'

/**
 * Allies on an endless sideways belt. CSS only, no JS. The second copy of the
 * list is aria-hidden, so screen readers hear each ally once.
 * Hidden under prefers-reduced-motion; the page renders the static grid then.
 */
export default function LogoConveyor({ items, className = '' }: { items: { ally: Ally; logo: string | null }[]; className?: string }) {
  return (
    <div className={`${styles.viewport} ${className}`} data-ambient-group="">
      <ul className={`${styles.track} m-0 list-none p-0`}>
        {[0, 1].map((copy) =>
          items.map(({ ally, logo }) => (
            <li
              key={`${copy}-${ally.name}`}
              aria-hidden={copy === 1 || undefined}
              className="mr-5 flex w-[160px] shrink-0 flex-col items-center text-center sm:w-[200px]"
            >
              <AllyTile ally={ally} logo={logo} />
            </li>
          )),
        )}
      </ul>
    </div>
  )
}
