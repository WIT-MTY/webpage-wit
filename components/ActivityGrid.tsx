import Link from 'next/link'
import Celestial, { type CelestialKind } from './Celestial'
import { ACTIVITIES } from '@/lib/site'

type Activity = (typeof ACTIVITIES)[number]

// What an event without a sign-up form says instead of a button.
const STATUS_LABEL = { soon: 'Próximamente', ended: 'Evento finalizado' } as const

/** One activity card. `detailed` renders a plain card instead of a link (Proyectos page). */
export function ActivityCard({ a, detailed = false }: { a: Activity; detailed?: boolean }) {
  const inner = (
    <>
      <span
        className="mb-6 flex h-12 w-12 shrink-0 items-center justify-center rounded-full text-peri"
        style={{ background: 'radial-gradient(circle at 30% 30%, #7c22c7, #47126b)', boxShadow: '0 0 24px rgba(124,34,199,0.45)' }}
      >
        <Celestial kind={a.icon as CelestialKind} size={20} />
      </span>
      <h3 className="m-0 font-display text-2xl font-bold text-white">{a.title}</h3>
      {a.tagline && <p className="mt-2 mb-0 text-[15px] font-light leading-relaxed text-peri/85">{a.tagline}</p>}
      {a.body && <p className="mt-4 mb-0 text-[15px] font-light leading-relaxed text-white/70">{a.body}</p>}
      {a.status && (
        <span className="mt-5 inline-flex self-start rounded-full border border-white/15 px-3 py-1 text-[11px] uppercase tracking-[0.2em] text-white/60">
          {STATUS_LABEL[a.status]}
        </span>
      )}
    </>
  )
  if (detailed) return <div className="glass h-full rounded-3xl p-8">{inner}</div>
  return (
    <Link
      href={`/proyectos#${a.slug}`}
      className="glass group flex h-full flex-col rounded-3xl p-7 transition-colors duration-200 hover:border-peri/35 hover:bg-white/[0.09]"
    >
      {inner}
      <span className="mt-auto pt-6 text-[11px] uppercase tracking-[0.25em] text-white/50 transition-colors group-hover:text-peri">
        Ver más →
      </span>
    </Link>
  )
}

/** One card per event, in EVENT_ORDER. `detailed` renders plain cards instead of links (Proyectos page). */
export default function ActivityGrid({ detailed = false }: { detailed?: boolean }) {
  return (
    <ul className="m-0 grid list-none gap-5 p-0 md:grid-cols-2">
      {ACTIVITIES.map((a) => (
        <li key={a.slug}>
          <ActivityCard a={a} detailed={detailed} />
        </li>
      ))}
    </ul>
  )
}
