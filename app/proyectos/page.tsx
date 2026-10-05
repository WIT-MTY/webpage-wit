import type { Metadata } from 'next'
import Image from 'next/image'
import PageHero from '@/components/PageHero'
import ActivityGrid from '@/components/ActivityGrid'
import CollabCTA from '@/components/CollabCTA'
import FloatingShapes from '@/components/FloatingShapes'
import { Button, Container, Heading, MicroLabel } from '@/components/ui'
import { ACTIVITIES, HACK4HER_URL, NEXT_EVENT, SOCIALS, nextEvent } from '@/lib/site'

export const metadata: Metadata = {
  title: 'Proyectos',
  description: 'Conferencias, Journey to Internship, talleres, Día de la Mujer y Hack4Her.',
}

/** Re-render every minute so the countdown and the registration count stay current. */
export const revalidate = 60

/** Used until the event has its own photo in EVENTS[].photos. */
const FALLBACK_PHOTO = 'https://imagenes.excelsior.com.mx/files/og_thumbnail/uploads/2026/06/10/6a29c7cf67f0c.jpeg'

const COUNTDOWN_GRADIENT = 'linear-gradient(135deg, #ffffff 0%, #c4b5fd 50%, #ff5795 100%)'

/** Calendar days from today until `iso`, in Mexico City time. Null if there's no valid date. */
function daysUntil(iso: string | null): number | null {
  if (!iso) return null
  const dayKey = (d: Date) => new Intl.DateTimeFormat('en-CA', { timeZone: 'America/Mexico_City' }).format(d)
  // A bare 'YYYY-MM-DD' is already a calendar day; anything with a time gets converted.
  const target = /^\d{4}-\d{2}-\d{2}$/.test(iso) ? iso : new Date(iso)
  if (typeof target !== 'string' && Number.isNaN(target.getTime())) return null
  const targetKey = typeof target === 'string' ? target : dayKey(target)
  return Math.round((Date.parse(targetKey) - Date.parse(dayKey(new Date()))) / 86_400_000)
}

/** Live count from the event's Apps Script, which returns { count }. Null hides the pill. */
async function getRegistrationCount(url: string | null): Promise<number | null> {
  if (!url) return null
  try {
    const res = await fetch(url, { next: { revalidate: 60 } })
    if (!res.ok) return null
    const data = await res.json()
    return typeof data?.count === 'number' ? data.count : null
  } catch {
    return null
  }
}

export default async function ProyectosPage() {
  const event = nextEvent()
  const daysLeft = daysUntil(NEXT_EVENT?.date ?? null)
  // An event whose date already passed counts as "no event".
  const upcoming = event && NEXT_EVENT && (daysLeft === null || daysLeft >= 0) ? event : null
  const registrations = upcoming ? await getRegistrationCount(NEXT_EVENT?.countUrl ?? null) : null
  const canRegister = Boolean(upcoming?.formUrl && NEXT_EVENT?.registrationOpen)
  const hasCard = upcoming
    ? upcoming.slug === 'hack4her' || ACTIVITIES.some((a) => a.slug === upcoming.slug)
    : false
  const instagram = SOCIALS.find((s) => s.label === 'Instagram')

  return (
    <>
      <PageHero
        label="Proyectos"
        title="Nuestras actividades"
        intro="Durante el semestre realizamos conferencias, Journey to Internship, talleres, Día de la Mujer y más. Juntas creamos más que eventos."
        shapes={[
          { shape: 'cylinder', depth: 'far', size: 300, rotate: -30, opacity: 0.45, pos: { top: '10%', left: '-2%' }, motion: 'slow', duration: 13, hideBelow: 'lg' },
          { shape: 'torus', depth: 'mid', size: 150, rotate: 20, opacity: 0.85, pos: { top: '18%', right: '8%' }, motion: 'medium', duration: 9, hideBelow: 'md' },
          { shape: 'burst', depth: 'near', size: 84, rotate: -10, opacity: 1, pos: { bottom: '14%', left: '12%' }, motion: 'medium', duration: 7, hideBelow: 'sm' },
        ]}
      />

      <Container>
        <ActivityGrid detailed />
      </Container>

      {/* Hack4Her feature. The event has its own site, so this links out. */}
      <section id="hack4her" className="scroll-mt-28 pt-28">
        <Container>
          <div className="relative overflow-hidden rounded-[2rem] border border-wit-pink/25 p-8 sm:p-12 lg:p-16"
            style={{ background: 'linear-gradient(135deg, rgba(100,17,173,0.45) 0%, rgba(71,18,107,0.35) 45%, rgba(255,87,149,0.22) 100%)' }}
          >
            <FloatingShapes
              items={[
                { shape: 'blob2', depth: 'mid', size: 190, rotate: 12, opacity: 0.7, pos: { top: '-12%', right: '-3%' }, motion: 'slow', duration: 12, hideBelow: 'md' },
              ]}
            />
            <div className="relative grid gap-10 lg:grid-cols-[1.2fr_1fr] lg:items-end">
              <div>
                <MicroLabel className="mb-6 text-wit-pink/80">Hackathon</MicroLabel>
                <Heading className="text-[clamp(2.6rem,6vw,4.75rem)]">Hack4Her</Heading>
                <p className="mt-6 mb-10 max-w-md text-[17px] font-light leading-[1.75] text-white/80">
                  Nuestro hackathon para impulsar a más mujeres en tecnología: equipos, mentoras y retos reales de la
                  industria.
                </p>
                <Button href={HACK4HER_URL ?? '#'} external={Boolean(HACK4HER_URL)}>
                  Ir a Hack4Her ↗
                </Button>
              </div>
              <div className="lg:text-right">
                <p className="m-0 font-display text-[clamp(4rem,10vw,7rem)] font-extrabold leading-none text-white">482</p>
                <p className="mt-2 mb-0 text-[15px] font-light uppercase tracking-[0.3em] text-peri/80">participantes</p>
              </div>
            </div>
          </div>
        </Container>
      </section>

      {/* Próximo evento. Data: NEXT_EVENT and nextEvent() in lib/site.ts. */}
      <section className="pt-10">
        <Container>
          <div className="relative isolate overflow-hidden rounded-[2rem] border border-wit-pink/25 p-8 sm:p-12 lg:p-16">
            {/* Blurred background image */}
            {upcoming && (
              <Image
                src={upcoming.photos[0] ?? FALLBACK_PHOTO}
                alt=""
                aria-hidden
                fill
                sizes="100vw"
                className="-z-20 scale-110 object-cover blur-2xl"
              />
            )}
            <div
              className="absolute inset-0 -z-10"
              style={{ background: 'linear-gradient(135deg, rgba(100,17,173,0.45) 0%, rgba(71,18,107,0.35) 45%, rgba(255,87,149,0.22) 100%)'  }}
            />
            <FloatingShapes
              items={[
                { shape: 'torus', depth: 'mid', size: 200, rotate: 90, opacity: 0.7, pos: { top: '-12%', right: '-3%' }, motion: 'slow', duration: 12, hideBelow: 'md' },
              ]}
            />

            {upcoming ? (
              <div className="relative grid gap-10 lg:grid-cols-[1.2fr_1fr] lg:items-end">
                <div>
                  <MicroLabel className="mb-6 text-wit-pink/80">Próximo evento</MicroLabel>
                  <Heading className="text-[clamp(2.6rem,6vw,4.75rem)]">{upcoming.title}</Heading>
                  {/* Where / when */}
                  <p className="mt-4 mb-0 text-[14px] font-light uppercase tracking-[0.2em] text-peri/85">
                    {NEXT_EVENT?.whereWhen}
                  </p>
                  <p className="mt-6 mb-10 max-w-md text-[17px] font-light leading-[1.75] text-white/80">
                    {upcoming.description}
                  </p>
                  <div className="flex flex-wrap gap-4">
                    <Button href={canRegister ? upcoming.formUrl! : '#'} external={canRegister}>
                      Registrarme ↗
                    </Button>
                    {hasCard && <Button href={`#${upcoming.slug}`}>Conoce más ↓</Button>}
                  </div>
                  {registrations !== null && (
                    <p className="mt-6 mb-0 inline-flex items-center gap-3 rounded-full border border-white/15 bg-white/5 px-4 py-2 text-[14px] font-light text-white/85 backdrop-blur-sm">
                      <span className="relative flex h-2 w-2">
                        <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-wit-pink opacity-75" />
                        <span className="relative inline-flex h-2 w-2 rounded-full bg-wit-pink" />
                      </span>
                      <span>
                        <strong className="font-semibold text-white">{registrations}</strong>{' '}
                        {registrations === 1 ? 'persona registrada' : 'personas registradas'}
                      </span>
                    </p>
                  )}
                </div>

                {/* Big gradient "En N días" */}
                <div className="lg:text-right">
                  {daysLeft === null || daysLeft === 0 ? (
                    <p
                      className="m-0 bg-clip-text font-display text-[clamp(4rem,10vw,7rem)] font-extrabold leading-none text-transparent"
                      style={{ backgroundImage: COUNTDOWN_GRADIENT }}
                    >
                      {daysLeft === 0 ? 'Hoy' : 'En N días'}
                    </p>
                  ) : (
                    <>
                      <p className="m-0 font-display text-[clamp(1.75rem,4vw,2.5rem)] font-bold text-peri">En</p>
                      <p
                        className="m-0 bg-clip-text font-display text-[clamp(4rem,10vw,7rem)] font-extrabold leading-none text-transparent"
                        style={{ backgroundImage: COUNTDOWN_GRADIENT }}
                      >
                        {daysLeft}
                      </p>
                      <p className="mt-2 mb-0 text-[15px] font-light uppercase tracking-[0.3em] text-peri/80">
                        {daysLeft === 1 ? 'día' : 'días'}
                      </p>
                    </>
                  )}
                </div>
              </div>
            ) : (
              /* "No event" state, shown when NEXT_EVENT is null or its date already passed. */
              <div className="relative">
                <MicroLabel className="mb-6 text-wit-pink/80">Próximo evento</MicroLabel>
                <Heading className="text-[clamp(2.2rem,5vw,3.75rem)]">Muy pronto anunciamos el siguiente</Heading>
                <p className="mt-6 mb-10 max-w-md text-[17px] font-light leading-[1.75] text-white/80">
                  Síguenos para enterarte primero de nuestros eventos.
                </p>
                {instagram && (
                  <Button href={instagram.href} external>
                    {instagram.handle} ↗
                  </Button>
                )}
              </div>
            )}
          </div>
        </Container>
      </section>

      <CollabCTA />
    </>
  )
}