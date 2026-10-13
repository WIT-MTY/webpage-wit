import type { Metadata } from 'next'
import PageHero from '@/components/PageHero'
import LumiKeychain, { FlashOutline } from '@/components/LumiKeychain'
import { SocialIcon } from '@/components/SocialIcon'
import CopyEmail from '@/components/CopyEmail'
import InstagramHero from '@/components/InstagramHero'
import MagneticLink from '@/components/MagneticLink'
import Reveal from '@/components/Reveal'
import ShineCard from '@/components/ShineCard'
import Spotlight from '@/components/Spotlight'
import { Container, MicroLabel } from '@/components/ui'
import { ADDRESS, ADDRESS_MAP_URL, CONTACT_EMAIL, SOCIALS } from '@/lib/site'

export const metadata: Metadata = {
  title: 'Contáctanos',
  description: 'Escríbenos o síguenos en redes. Estamos en el Tec de Monterrey, Campus Monterrey.',
}

export default function ContactoPage() {
  const addressLines = ADDRESS.map((line, i) => (
    <span key={line} className={`block leading-relaxed ${i === 0 ? 'font-display text-xl font-bold text-white' : 'mt-2 text-[15px] font-light text-white/75'}`}>
      {line}
    </span>
  ))

  const instagram = SOCIALS.find((s) => s.label === 'Instagram')
  const otherSocials = SOCIALS.filter((s) => s !== instagram)

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

      <Container className="grid gap-6 md:grid-cols-3">
        {/* data-lumi-flash: Lumi's flash lights these blocks' outlines on load, on click and on copy. */}

        {/* Primary card: the email. Static gradient border (padding-box / border-box backgrounds). */}
        <Reveal onLoad className="md:col-span-2 md:row-span-2">
          <ShineCard className="h-full" radius="rounded-[2rem]">
            <div
              data-lumi-flash=""
              className="relative flex h-full flex-col justify-center rounded-[2rem] p-8 sm:p-12 lg:p-14"
              style={{
                border: '1.5px solid transparent',
                background:
                  'linear-gradient(135deg, rgba(100,17,173,0.45) 0%, rgba(30,10,58,0.85) 55%, rgba(71,18,107,0.6) 100%) padding-box, linear-gradient(135deg, #ff5795 0%, #9066d2 45%, #c6c8ee 100%) border-box',
              }}
            >
              <FlashOutline />
              <Spotlight />
              <div className="relative">
                <MicroLabel className="mb-6">Correo</MicroLabel>
                {CONTACT_EMAIL ? (
                  <>
                    <a
                      id="correo"
                      href={`mailto:${CONTACT_EMAIL}`}
                      className="break-all font-display text-[clamp(1.9rem,4.4vw,3.4rem)] font-bold leading-tight text-white transition-colors hover:text-peri"
                    >
                      {CONTACT_EMAIL}
                    </a>
                    <div className="mt-10">
                      <CopyEmail email={CONTACT_EMAIL} targetId="correo" />
                    </div>
                  </>
                ) : (
                  <p className="m-0 font-display text-[clamp(1.9rem,4.4vw,3.4rem)] font-bold text-white/60">Por confirmar</p>
                )}
              </div>
            </div>
          </ShineCard>
        </Reveal>

        <Reveal onLoad delay={120}>
          <ShineCard className="h-full" radius="rounded-3xl">
            <div data-lumi-flash="" className="glass relative h-full rounded-3xl p-8">
              <FlashOutline />
              <Spotlight />
              <div className="relative">
                <MicroLabel className="mb-6">Redes</MicroLabel>
                {/* Instagram is the hero action; the other networks follow as pills. */}
                {instagram && <InstagramHero href={instagram.href} handle={instagram.handle} />}
                <ul className={`m-0 flex list-none flex-col items-start gap-3 p-0 ${instagram ? 'mt-8' : ''}`}>
                  {otherSocials.map((s) => (
                    <li key={s.label}>
                      <MagneticLink
                        href={s.href}
                        data-lumi-flash=""
                        className="glass-strong relative inline-flex items-center gap-3 rounded-full px-5 py-3 text-[14px] text-white/85 hover:text-peri"
                      >
                        <FlashOutline />
                        <SocialIcon name={s.label} />
                        <span>
                          {s.label} <span className="text-white/45">{s.handle}</span>
                        </span>
                      </MagneticLink>
                    </li>
                  ))}
                </ul>
              </div>
            </div>
          </ShineCard>
        </Reveal>

        <Reveal onLoad delay={240}>
          <ShineCard className="h-full" radius="rounded-3xl">
            <div
              data-lumi-flash=""
              className="relative h-full rounded-3xl border border-white/10 p-8"
              style={{ background: 'linear-gradient(135deg, rgba(100,17,173,0.5) 0%, rgba(71,18,107,0.4) 100%)' }}
            >
              <FlashOutline />
              <Spotlight />
              <div className="relative">
                <MicroLabel className="mb-6">Dirección</MicroLabel>
                <address className="not-italic">
                  {/* The address opens Google Maps when there is a link; otherwise it is plain text. */}
                  {ADDRESS_MAP_URL ? (
                    <a
                      href={ADDRESS_MAP_URL}
                      target="_blank"
                      rel="noopener noreferrer"
                      aria-label={`${ADDRESS.join(', ')}. Ver en Google Maps (se abre en una pestaña nueva)`}
                      className="group block decoration-peri/50 underline-offset-4 hover:underline"
                    >
                      {addressLines}
                      <span className="mt-4 block text-[13px] font-medium text-peri group-hover:text-white">Ver en Google Maps ↗</span>
                    </a>
                  ) : (
                    addressLines
                  )}
                </address>
              </div>
            </div>
          </ShineCard>
        </Reveal>
      </Container>
    </>
  )
}
