import type { Metadata } from 'next'
import PageHero from '@/components/PageHero'
import LumiKeychain, { FlashTrack } from '@/components/LumiKeychain'
import { SocialIcon } from '@/components/SocialIcon'
import { Container, MicroLabel } from '@/components/ui'
import { ADDRESS, CONTACT_EMAIL, SOCIALS } from '@/lib/site'

export const metadata: Metadata = {
  title: 'Contáctanos',
  description: 'Escríbenos o síguenos en redes. Estamos en el Tec de Monterrey, Campus Monterrey.',
}

export default function ContactoPage() {
  return (
    <>
      {/* Under 640px the keychain hangs above the heading, so the hero starts lower. */}
      <div className="relative max-sm:pt-40">
        <LumiKeychain />
        <PageHero
          label="Contáctanos"
          title="Hablemos"
          intro="¿Quieres colaborar, patrocinar un evento o unirte a la comunidad? Escríbenos."
          shapes={[
            { shape: 'slab', depth: 'far', size: 280, rotate: -16, opacity: 0.4, pos: { top: '14%', right: '-1%' }, motion: 'slow', duration: 13, hideBelow: 'lg' },
            { shape: 'loop', depth: 'mid', size: 140, rotate: 18, opacity: 0.85, pos: { top: '22%', left: '8%' }, motion: 'medium', duration: 10, hideBelow: 'md' },
          ]}
        />
      </div>

      <Container className="grid gap-5 md:grid-cols-3">
        {/* data-lumi-flash: Lumi's flash sweeps across these blocks on load and on click. */}
        <div data-lumi-flash="" className="glass relative rounded-3xl p-8 md:col-span-2">
          <FlashTrack />
          <MicroLabel className="mb-5">Correo</MicroLabel>
          {CONTACT_EMAIL ? (
            <a
              href={`mailto:${CONTACT_EMAIL}`}
              className="break-all font-display text-[clamp(1.6rem,3.4vw,2.6rem)] font-bold text-white transition-colors hover:text-peri"
            >
              {CONTACT_EMAIL}
            </a>
          ) : (
            <p className="m-0 font-display text-[clamp(1.6rem,3.4vw,2.6rem)] font-bold text-white/60">Por confirmar</p>
          )}

          <MicroLabel className="mt-12 mb-5">Redes</MicroLabel>
          <ul className="m-0 flex list-none flex-col gap-3 p-0 sm:flex-row sm:flex-wrap">
            {SOCIALS.map((s) => (
              <li key={s.label}>
                <a
                  href={s.href}
                  target="_blank"
                  rel="noopener noreferrer"
                  data-lumi-flash=""
                  className="glass-strong relative inline-flex items-center gap-3 rounded-full px-5 py-3 text-[14px] text-white/85 transition-colors hover:text-peri"
                >
                  <FlashTrack />
                  <SocialIcon name={s.label} />
                  <span>
                    {s.label} <span className="text-white/45">{s.handle}</span>
                  </span>
                </a>
              </li>
            ))}
          </ul>
        </div>

        <div
          data-lumi-flash=""
          className="relative rounded-3xl border border-white/10 p-8"
          style={{ background: 'linear-gradient(135deg, rgba(100,17,173,0.5) 0%, rgba(71,18,107,0.4) 100%)' }}
        >
          <FlashTrack />
          <MicroLabel className="mb-5">Dirección</MicroLabel>
          <address className="not-italic">
            {ADDRESS.map((line, i) => (
              <p key={line} className={`m-0 leading-relaxed ${i === 0 ? 'font-display text-xl font-bold text-white' : 'mt-2 text-[15px] font-light text-white/75'}`}>
                {line}
              </p>
            ))}
          </address>
        </div>
      </Container>
    </>
  )
}
