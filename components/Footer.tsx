import Link from 'next/link'
import { HACK4HER_URL, NAV_LINKS, SOCIALS } from '@/lib/site'
import { SocialIcon } from './SocialIcon'

export default function Footer() {
  return (
    <footer className="relative mt-24 overflow-hidden border-t border-white/8">
      <div
        className="pointer-events-none absolute inset-0"
        style={{ background: 'linear-gradient(135deg, rgba(71,18,107,0.55) 0%, rgba(8,4,20,0.2) 60%, rgba(122,16,80,0.18) 100%)' }}
        aria-hidden="true"
      />
      <div className="relative mx-auto grid max-w-6xl gap-12 px-6 py-16 md:grid-cols-[1.3fr_1fr_1fr] lg:px-10">
        <div className="flex flex-col items-center text-center md:items-start md:text-left">
          {/* eslint-disable-next-line @next/next/no-img-element -- SVG lockup */}
          <img src="/brand/wit-lockup.svg" alt="WIT, Women in Tech" width={200} height={125} className="h-auto w-[200px]" />
          <p className="mt-6 mb-0 text-[13px] font-light italic uppercase tracking-[0.35em] text-white/70">
            Tech needs <span className="text-peri">WIT</span>
          </p>
        </div>

        <nav aria-label="Pie de página" className="text-center md:text-left">
          <p className="m-0 mb-4 text-[11px] uppercase tracking-[0.3em] text-peri/60">Sitio</p>
          <ul className="m-0 flex list-none flex-col gap-2.5 p-0">
            {NAV_LINKS.map((l) => (
              <li key={l.href}>
                <Link href={l.href} className="text-sm font-light text-white/75 transition-colors hover:text-peri">
                  {l.label}
                </Link>
              </li>
            ))}
            <li>
              <a
                href={HACK4HER_URL ?? '#'}
                target={HACK4HER_URL ? '_blank' : undefined}
                rel={HACK4HER_URL ? 'noopener noreferrer' : undefined}
                className="text-sm font-light text-white/75 transition-colors hover:text-peri"
              >
                Hack4Her ↗
              </a>
            </li>
          </ul>
        </nav>

        <div className="text-center md:text-left">
          <p className="m-0 mb-4 text-[11px] uppercase tracking-[0.3em] text-peri/60">Síguenos</p>
          <ul className="m-0 flex list-none flex-col items-center gap-3 p-0 md:items-start">
            {SOCIALS.map((s) => (
              <li key={s.label}>
                <a
                  href={s.href}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center gap-3 text-sm font-light text-white/75 transition-colors hover:text-peri"
                >
                  <SocialIcon name={s.label} />
                  {s.handle}
                </a>
              </li>
            ))}
          </ul>
        </div>
      </div>

      <div className="relative border-t border-white/8 bg-wit-deep/60">
        <div className="mx-auto flex max-w-6xl flex-col items-center justify-between gap-3 px-6 py-5 text-center text-xs font-light text-white/55 sm:flex-row sm:text-left lg:px-10">
          <span>Grupo estudiantil del Tecnológico de Monterrey, Campus Monterrey</span>
          <span>© {new Date().getFullYear()} Women in Technology</span>
        </div>
      </div>
    </footer>
  )
}
