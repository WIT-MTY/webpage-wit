import Link from 'next/link'
import Celestial, { type CelestialKind } from './Celestial'
import { ACTIVITIES } from '@/lib/site'

/** The four signature activities. `detailed` shows the long description (Proyectos page). */
export default function ActivityGrid({ detailed = false }: { detailed?: boolean }) {
  return (
    <ul className={`m-0 grid list-none gap-5 p-0 ${detailed ? 'md:grid-cols-2' : 'sm:grid-cols-2 lg:grid-cols-4'}`}>
      {ACTIVITIES.map((a) => {
        const inner = (
          <>
            <span
              className="mb-6 flex h-12 w-12 items-center justify-center rounded-full text-peri"
              style={{ background: 'radial-gradient(circle at 30% 30%, #7c22c7, #47126b)', boxShadow: '0 0 24px rgba(124,34,199,0.45)' }}
            >
              <Celestial kind={a.icon as CelestialKind} size={20} />
            </span>
            <h3 className="m-0 font-display text-2xl font-bold text-white">{a.title}</h3>
            <p className="mt-2 mb-0 text-[15px] font-light leading-relaxed text-peri/85">{a.tagline}</p>
            {detailed && <p className="mt-4 mb-0 text-[15px] font-light leading-relaxed text-white/70">{a.body}</p>}
          </>
        )
        return (
          <li key={a.title}>
            {detailed ? (
              <div className="glass h-full rounded-3xl p-8">{inner}</div>
            ) : (
              <Link
                href="/proyectos"
                className="glass group flex h-full flex-col rounded-3xl p-7 transition-colors duration-200 hover:border-peri/35 hover:bg-white/[0.09]"
              >
                {inner}
                <span className="mt-auto pt-6 text-[11px] uppercase tracking-[0.25em] text-white/50 transition-colors group-hover:text-peri">
                  Ver más →
                </span>
              </Link>
            )}
          </li>
        )
      })}
    </ul>
  )
}
