'use client'

import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { useEffect, useState } from 'react'
import { HACK4HER_URL, NAV_LINKS } from '@/lib/site'

function ArrowUpRight() {
  return (
    <svg width={11} height={11} viewBox="0 0 12 12" fill="none" aria-hidden="true">
      <path d="M3 9L9 3M9 3H4M9 3V8" stroke="currentColor" strokeWidth={1.4} strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  )
}

function Hack4HerLink({ className }: { className: string }) {
  return (
    <a
      href={HACK4HER_URL ?? '#'}
      target={HACK4HER_URL ? '_blank' : undefined}
      rel={HACK4HER_URL ? 'noopener noreferrer' : undefined}
      className={className}
    >
      Hack4Her
      <span className="text-peri">
        <ArrowUpRight />
      </span>
      <span className="sr-only">(abre en otra pestaña)</span>
    </a>
  )
}

export default function Nav() {
  const pathname = usePathname()
  const [open, setOpen] = useState(false)

  // Close the drawer whenever the route changes.
  useEffect(() => setOpen(false), [pathname])

  // Lock page scroll and allow Escape while the drawer is open.
  useEffect(() => {
    if (!open) return
    const prev = document.body.style.overflow
    document.body.style.overflow = 'hidden'
    const onKey = (e: KeyboardEvent) => e.key === 'Escape' && setOpen(false)
    window.addEventListener('keydown', onKey)
    return () => {
      document.body.style.overflow = prev
      window.removeEventListener('keydown', onKey)
    }
  }, [open])

  const isActive = (href: string) => (href === '/' ? pathname === '/' : pathname.startsWith(href))

  return (
    <>
      <nav
        className="nav-glass fixed inset-x-0 top-0 z-50 flex items-center justify-between px-6 py-4 lg:px-10"
        style={{
          borderBottom: '1px solid rgba(0,0,0,0.22)',
          boxShadow: 'inset 0 1px 0 rgba(255,255,255,0.18), 0 8px 30px rgba(0,0,0,0.3)',
        }}
        aria-label="Principal"
      >
        <Link href="/" className="flex items-center select-none" aria-label="WIT, inicio">
          {/* eslint-disable-next-line @next/next/no-img-element -- tiny SVG */}
          <img
            src="/brand/wit-mark.svg"
            alt="WIT, Women in Tech"
            width={56}
            height={28}
            className="h-7 w-auto"
            style={{ filter: 'drop-shadow(0 0 12px rgba(139,48,208,0.6))' }}
          />
        </Link>

        <ul className="m-0 hidden list-none items-center gap-6 p-0 lg:flex xl:gap-7">
          {NAV_LINKS.map((link) => {
            const active = isActive(link.href)
            return (
              <li key={link.href}>
                <Link
                  href={link.href}
                  aria-current={active ? 'page' : undefined}
                  className={`relative whitespace-nowrap text-[12px] font-medium uppercase tracking-[0.08em] transition-colors duration-200 hover:text-peri ${
                    active ? 'text-peri' : 'text-white/78'
                  }`}
                >
                  {link.label}
                  {active && (
                    <span className="absolute -bottom-2 left-1/2 h-[3px] w-[3px] -translate-x-1/2 rounded-full bg-peri shadow-[0_0_8px_rgba(198,200,238,0.9)]" />
                  )}
                </Link>
              </li>
            )
          })}
          <li>
            <Hack4HerLink className="inline-flex items-center gap-1.5 whitespace-nowrap rounded-full border border-peri/40 px-3.5 py-1.5 text-[12px] font-semibold uppercase tracking-[0.08em] text-white transition-colors duration-200 hover:border-peri hover:bg-peri/12" />
          </li>
        </ul>

        <button
          type="button"
          className="flex cursor-pointer flex-col items-end gap-[5px] border-none bg-transparent p-2 lg:hidden"
          onClick={() => setOpen((o) => !o)}
          aria-label={open ? 'Cerrar menú' : 'Abrir menú'}
          aria-expanded={open}
          aria-controls="mobile-menu"
        >
          <span className={`block h-px w-[22px] bg-white/80 transition-transform duration-200 ${open ? 'translate-y-[6px] rotate-45' : ''}`} />
          <span className={`block h-px w-[22px] bg-white/80 transition-opacity duration-200 ${open ? 'opacity-0' : ''}`} />
          <span className={`block h-px bg-white/80 transition-all duration-200 ${open ? 'w-[22px] -translate-y-[6px] -rotate-45' : 'w-[14px]'}`} />
        </button>
      </nav>

      {open && (
        <div
          id="mobile-menu"
          className="fixed inset-0 z-40 flex flex-col items-center justify-center lg:hidden"
          style={{ background: 'rgba(8,4,20,0.97)' }}
          onClick={() => setOpen(false)}
        >
          <ul className="m-0 flex list-none flex-col items-center gap-8 p-0">
            {NAV_LINKS.map((link, i) => (
              <li key={link.href} className="animate-rise" style={{ animationDelay: `${i * 40}ms` }}>
                <Link
                  href={link.href}
                  aria-current={isActive(link.href) ? 'page' : undefined}
                  className={`text-lg font-light uppercase tracking-[0.25em] ${isActive(link.href) ? 'text-peri' : 'text-white/85'}`}
                >
                  {link.label}
                </Link>
              </li>
            ))}
            <li className="animate-rise" style={{ animationDelay: `${NAV_LINKS.length * 40}ms` }}>
              <Hack4HerLink className="inline-flex items-center gap-2 text-lg font-light uppercase tracking-[0.25em] text-white/85" />
            </li>
          </ul>
        </div>
      )}
    </>
  )
}
