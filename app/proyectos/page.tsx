import type { Metadata } from 'next'
import Image from 'next/image'
import Link from 'next/link'
import PageHero from '@/components/PageHero'
import CollabCTA from '@/components/CollabCTA'
import CountUp from '@/components/CountUp'
import FlipCard from '@/components/FlipCard'
import FloatingShapes from '@/components/FloatingShapes'
import PhotoFrame from '@/components/PhotoFrame'
import { Button, Container, Heading, MicroLabel } from '@/components/ui'
import { EVENTS, HACK4HER_URL, NEXT_EVENT, SOCIALS, nextEvent, type WitEvent } from '@/lib/site'

export const metadata: Metadata = {
  title: 'Proyectos',
  description: 'Conferencias, Journey to Internship, talleres, Día de la Mujer, Hack4Her y Run4WIT.',
}

/*
  Rendering note: this page reads `searchParams` (the flip state below), so it
  renders on every request. That keeps the countdown exact; the registration
  count is still cached for 60s by its own fetch.
*/

/** Used until the event has its own photo in EVENTS[].photos. */
const FALLBACK_PHOTO = 'https://imagenes.excelsior.com.mx/files/og_thumbnail/uploads/2026/06/10/6a29c7cf67f0c.jpeg'

const COUNTDOWN_GRADIENT = 'linear-gradient(135deg, #ffffff 0%, #c4b5fd 50%, #ff5795 100%)'

// ── Flip state ───────────────────────────────────────────────
/*
  FlipCard is controlled (it needs a `side` prop), and this is a server
  component, so there's no useState here. The flip lives in the URL instead:
  /proyectos?card=talleres&side=impact. Links use scroll={false} + replace, so
  the page doesn't jump and Back doesn't replay every flip. Next keeps the DOM
  between these navigations, so FlipCard's CSS rotation still animates.
  One card is flipped at a time; flipping another one turns the first back.
*/
type Side = 'front' | 'impact' | 'sponsors'
type Flip = { slug: string; side: Exclude<Side, 'front'> }
type SearchParams = Record<string, string | string[] | undefined>

function readFlip(sp: SearchParams): Flip | null {
  const card = typeof sp.card === 'string' ? sp.card : null
  const side = sp.side
  if (!card || (side !== 'impact' && side !== 'sponsors')) return null
  if (!EVENTS.some((e) => e.slug === card)) return null
  return { slug: card, side }
}

function FlipLink({ slug, side, children }: { slug: string; side: Side; children: React.ReactNode }) {
  const href = side === 'front' ? '/proyectos' : `/proyectos?card=${encodeURIComponent(slug)}&side=${side}`
  return (
    <Link
      href={href}
      scroll={false}
      replace
      prefetch={false}
      className="glass-strong inline-flex items-center justify-center gap-2 rounded-full px-5 py-2.5 text-[11px] font-medium uppercase tracking-[0.2em] text-white/90 no-underline transition-colors duration-200 hover:bg-white/16 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-peri"
    >
      {children}
    </Link>
  )
}

// ── Event card faces ─────────────────────────────────────────

function CardFace({ children }: { children: React.ReactNode }) {
  return <div className="glass flex h-full flex-col rounded-3xl p-6 sm:p-7">{children}</div>
}

/** Swipeable strip (CSS scroll-snap, no JS). With no photos it shows one PhotoFrame placeholder. */
function PhotoStrip({ event }: { event: WitEvent }) {
  const photos: (string | null)[] = event.photos.length ? event.photos : [null]
  const many = photos.length > 1
  return (
    <div className="relative">
      <div
        className="flex snap-x snap-mandatory gap-3 overflow-x-auto [scrollbar-width:none] [&::-webkit-scrollbar]:hidden"
        {...(many ? { tabIndex: 0, role: 'region', 'aria-label': `Fotos de ${event.title}` } : {})}
      >
        {photos.map((src, i) => (
          <PhotoFrame
            key={src ?? `empty-${i}`}
            src={src}
            alt={`${event.title}, foto ${i + 1}`}
            sizes="(min-width: 1024px) 340px, (min-width: 768px) 45vw, 90vw"
            className="aspect-[4/3] w-full shrink-0 snap-center"
          />
        ))}
      </div>
      {many && (
        <span className="pointer-events-none absolute right-3 bottom-3 rounded-full bg-black/45 px-3 py-1 text-[10px] font-light uppercase tracking-[0.2em] text-white/85 backdrop-blur-sm">
          Desliza para ver {photos.length} fotos
        </span>
      )}
    </div>
  )
}

function EventFront({ event }: { event: WitEvent }) {
  return (
    <CardFace>
      <PhotoStrip event={event} />
      <p className="mt-6 mb-0 text-[11px] font-medium uppercase tracking-[0.3em] text-wit-pink/80">{event.category}</p>
      <h3 className="mt-2 mb-0 font-display text-2xl font-bold text-white">{event.title}</h3>
      <p className="mt-3 mb-0 text-[15px] font-light leading-relaxed text-white/70">{event.description}</p>
      <div className="mt-auto flex flex-wrap gap-3 pt-7">
        {event.formUrl && (
          <Button href={event.formUrl} external className="w-full">
            Registrarme ↗
          </Button>
        )}
        <FlipLink slug={event.slug} side="impact">
          Impacto
        </FlipLink>
        <FlipLink slug={event.slug} side="sponsors">
          Patrocinadores
        </FlipLink>
      </div>
    </CardFace>
  )
}

function BackHeader({ event, label }: { event: WitEvent; label: string }) {
  return (
    <div className="flex items-start justify-between gap-4">
      <div>
        <p className="m-0 text-[11px] font-medium uppercase tracking-[0.3em] text-wit-pink/80">{label}</p>
        <h3 className="mt-2 mb-0 font-display text-xl font-bold text-white">{event.title}</h3>
      </div>
      <FlipLink slug={event.slug} side="front">
        ← Volver
      </FlipLink>
    </div>
  )
}

/** `active` remounts CountUp each time this face is shown, so the numbers count up on every flip. */
function EventImpact({ event, active }: { event: WitEvent; active: boolean }) {
  return (
    <CardFace>
      <BackHeader event={event} label="Impacto" />
      <dl className="m-0 my-auto grid gap-5 py-8">
        {event.metrics.map((m) => (
          <div key={m.label} className="flex flex-col-reverse border-b border-white/10 pb-5 last:border-0 last:pb-0">
            <dt className="mt-1 text-[13px] font-light uppercase tracking-[0.25em] text-peri/80">{m.label}</dt>
            <dd className="m-0">
              <CountUp
                key={active ? 'shown' : 'hidden'}
                value={m.value}
                className="bg-[linear-gradient(135deg,#ffffff_0%,#c4b5fd_50%,#ff5795_100%)] bg-clip-text font-display text-[clamp(2.5rem,5vw,3.25rem)] font-extrabold leading-none text-transparent"
              />
            </dd>
          </div>
        ))}
      </dl>
    </CardFace>
  )
}

function EventSponsors({ event }: { event: WitEvent }) {
  return (
    <CardFace>
      <BackHeader event={event} label="Patrocinadores" />
      {event.sponsors.length ? (
        <ul className="m-0 my-auto grid list-none grid-cols-2 gap-3 p-0 py-8 sm:grid-cols-3">
          {event.sponsors.map((logo, i) => (
            <li
              key={`${logo ?? 'empty'}-${i}`}
              className={`relative flex aspect-[3/2] items-center justify-center rounded-2xl ${
                logo ? 'bg-white/[0.92]' : 'border border-dashed border-peri/35 bg-[rgba(71,18,107,0.28)]'
              }`}
            >
              {logo ? (
                <Image src={logo} alt={`Patrocinador de ${event.title}`} fill sizes="140px" className="object-contain p-4" />
              ) : (
                <span className="text-[10px] font-light uppercase tracking-[0.18em] text-peri/60">Logo pendiente</span>
              )}
            </li>
          ))}
        </ul>
      ) : (
        <p className="my-auto py-8 text-[15px] font-light leading-relaxed text-white/70">
          Pronto anunciaremos a quienes hacen posible este evento.
        </p>
      )}
    </CardFace>
  )
}

// ── Próximo evento ───────────────────────

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

/** Live count from the event's Apps Script, which returns { count }. Null shows "—" in the pill. */
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

/**
 * The three states of the "Próximo evento" panel:
 * - open:   event announced, registration open (default)
 * - closed: event announced, registrationOpen === false (or no form URL)
 * - none:   NEXT_EVENT === null, or its date already passed
 */
type PanelState = 'open' | 'closed' | 'none'

/** "Pronto" with no event or no date, "Hoy" on the day, otherwise "En N días". */
function CountdownDisplay({ state, daysLeft }: { state: PanelState; daysLeft: number | null }) {
  const big =
    'm-0 bg-clip-text font-display text-[clamp(4rem,10vw,7rem)] font-extrabold leading-none text-transparent'

  if (state === 'none' || daysLeft === null || daysLeft === 0) {
    return (
      <p className={big} style={{ backgroundImage: COUNTDOWN_GRADIENT }}>
        {state !== 'none' && daysLeft === 0 ? 'Hoy' : 'Pronto'}
      </p>
    )
  }

  return (
    <>
      <p className="m-0 font-display text-[clamp(1.75rem,4vw,2.5rem)] font-bold text-peri">En</p>
      <p className={big} style={{ backgroundImage: COUNTDOWN_GRADIENT }}>
        {daysLeft}
      </p>
      <p className="mt-2 mb-0 text-[15px] font-light uppercase tracking-[0.3em] text-peri/80">
        {daysLeft === 1 ? 'día' : 'días'}
      </p>
    </>
  )
}

// ── Page ─────────────────────────────────────────────────────

export default async function ProyectosPage({ searchParams }: { searchParams: Promise<SearchParams> }) {
  const flip = readFlip(await searchParams)

  const event = nextEvent()
  const daysLeft = daysUntil(NEXT_EVENT?.date ?? null)
  // An event whose date already passed counts as "no event".
  const upcoming = event && NEXT_EVENT && (daysLeft === null || daysLeft >= 0) ? event : null
  const registrations = upcoming ? await getRegistrationCount(NEXT_EVENT?.countUrl ?? null) : null
  const state: PanelState = !upcoming
    ? 'none'
    : NEXT_EVENT?.registrationOpen && upcoming.formUrl
      ? 'open'
      : 'closed'
  // Green dot only when registration is open and the count actually loaded.
  const live = state === 'open' && registrations !== null
  // Every event in EVENTS has a flip card with id={slug}, so "Conoce más" always has a target.
  const hasCard = upcoming ? EVENTS.some((e) => e.slug === upcoming.slug) : false
  const instagram = SOCIALS.find((s) => s.label === 'Instagram')
  const hack4her = EVENTS.find((e) => e.slug === 'hack4her')
  const hackHeadline = hack4her?.metrics[0]

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

      {/* Event flip cards. One per EVENTS entry; each <li> owns the #slug anchor. */}
      <Container>
        <ul className="m-0 grid list-none gap-6 p-0 md:grid-cols-2 lg:grid-cols-3">
          {EVENTS.map((e) => {
            const side: Side = flip?.slug === e.slug ? flip.side : 'front'
            return (
              <li key={e.slug} id={e.slug} className="scroll-mt-28">
                {/* The arbitrary variants stretch FlipCard's inner layers so cards in a row share a height. */}
                <FlipCard
                  side={side}
                  className="h-full [&>div]:h-full [&>div>div:first-child]:h-full"
                  faces={{
                    front: <EventFront event={e} />,
                    impact: <EventImpact event={e} active={side === 'impact'} />,
                    sponsors: <EventSponsors event={e} />,
                  }}
                />
              </li>
            )
          })}
        </ul>
      </Container>

      {/* Hack4Her feature. The event has its own site, so this links out. The anchor lives on its card above. */}
      <section className="pt-28">
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
                <MicroLabel className="mb-6 text-wit-pink/80">{hack4her?.category ?? 'Hackathon'}</MicroLabel>
                <Heading className="text-[clamp(2.6rem,6vw,4.75rem)]">{hack4her?.title ?? 'Hack4Her'}</Heading>
                <p className="mt-6 mb-10 max-w-md text-[17px] font-light leading-[1.75] text-white/80">
                  {hack4her?.description}
                </p>
                <Button href={HACK4HER_URL ?? '#hack4her'} external={Boolean(HACK4HER_URL)}>
                  Ir a Hack4Her ↗
                </Button>
              </div>
              {hackHeadline && (
                <div className="lg:text-right">
                  <p className="m-0 font-display text-[clamp(4rem,10vw,7rem)] font-extrabold leading-none text-white">
                    <CountUp value={hackHeadline.value} />
                  </p>
                  <p className="mt-2 mb-0 text-[15px] font-light uppercase tracking-[0.3em] text-peri/80">
                    {hackHeadline.label}
                  </p>
                </div>
              )}
            </div>
          </div>
        </Container>
      </section>

      {/* Próximo evento. Data: NEXT_EVENT and nextEvent() in lib/site.ts. States: see PanelState. */}
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
              style={{ background: 'linear-gradient(135deg, rgba(100,17,173,0.45) 0%, rgba(71,18,107,0.35) 45%, rgba(255,87,149,0.22) 100%)' }}
            />
            <FloatingShapes
              items={[
                { shape: 'torus', depth: 'mid', size: 200, rotate: 90, opacity: 0.7, pos: { top: '-12%', right: '-3%' }, motion: 'slow', duration: 12, hideBelow: 'md' },
              ]}
            />

            <div className="relative grid gap-10 lg:grid-cols-[1.2fr_1fr] lg:items-end">
              <div>
                <div className="mb-6 flex flex-wrap items-center gap-3">
                  <MicroLabel className="m-0 text-wit-pink/80">Próximo evento</MicroLabel>
                  {state === 'closed' && (
                    <span className="rounded-full border border-white/20 bg-white/10 px-3 py-1 text-[12px] font-medium uppercase tracking-[0.2em] text-white/70">
                      Registro cerrado
                    </span>
                  )}
                </div>

                {upcoming ? (
                  <>
                    <Heading className="text-[clamp(2.6rem,6vw,4.75rem)]">{upcoming.title}</Heading>
                    {/* Where / when */}
                    <p className="mt-4 mb-0 text-[14px] font-light uppercase tracking-[0.2em] text-peri/85">
                      {NEXT_EVENT?.whereWhen}
                    </p>
                    <p className="mt-6 mb-10 max-w-md text-[17px] font-light leading-[1.75] text-white/80">
                      {upcoming.description}
                    </p>

                    <div className="flex flex-wrap gap-4">
                      {state === 'open' && (
                        <Button href={upcoming.formUrl!} external>
                          Registrarme ↗
                        </Button>
                      )}
                      {hasCard && <Button href={`#${upcoming.slug}`}>Conoce más ↓</Button>}
                      {/* Closed and no card to scroll to: don't leave the panel without an action. */}
                      {state === 'closed' && !hasCard && instagram && (
                        <Button href={instagram.href} external>
                          {instagram.handle} ↗
                        </Button>
                      )}
                    </div>

                    {/* Live count: "—" when there's no countUrl or the script fails. Green dot = live. */}
                    <p className="mt-6 mb-0 inline-flex items-center gap-3 rounded-full border border-white/15 bg-white/5 px-4 py-2 text-[14px] font-light text-white/85 backdrop-blur-sm">
                      <span className="relative flex h-2 w-2">
                        {live && (
                          <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-green-400 opacity-75" />
                        )}
                        <span
                          className={`relative inline-flex h-2 w-2 rounded-full ${live ? 'bg-green-400' : 'bg-white/40'}`}
                        />
                      </span>
                      <span>
                        <strong className="font-semibold text-white">{registrations ?? '—'}</strong>{' '}
                        {registrations === 1 ? 'persona registrada' : 'personas registradas'}
                      </span>
                    </p>
                  </>
                ) : (
                  /* "No event" state: NEXT_EVENT is null or its date already passed. */
                  <>
                    <Heading className="text-[clamp(2.2rem,5vw,3.75rem)]">Estamos preparando lo que sigue</Heading>
                    <p className="mt-6 mb-10 max-w-md text-[17px] font-light leading-[1.75] text-white/80">
                      Síguenos para enterarte primero de nuestros eventos.
                    </p>
                    {instagram && (
                      <Button href={instagram.href} external>
                        {instagram.handle} ↗
                      </Button>
                    )}
                  </>
                )}
              </div>

              {/* Big gradient countdown: "En N días" / "Hoy" / "Pronto" */}
              <div className="lg:text-right">
                <CountdownDisplay state={state} daysLeft={daysLeft} />
              </div>
            </div>
          </div>
        </Container>
      </section>

      <CollabCTA />
    </>
  )
}