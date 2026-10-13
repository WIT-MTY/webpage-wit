import type { Metadata } from 'next'
import Image from 'next/image'
import Link from 'next/link'
import Script from 'next/script'
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

// ── Event carousel ───────────────────────────────────────────
/*
  The carousel is CSS only. This page is a server component, and it must stay
  that way without adding a client component, so there is no JS here.

  Mobile: horizontal scroll-snap, one card visible, the next one peeks 24px.
  Desktop (md+): the active card is centered at 62% of the track, with its
  neighbours peeking on both sides. Arrows and dots come from CSS scroll
  markers (::scroll-button / ::scroll-marker).

  Why 62%: the native arrows scroll by about one viewport of the track, not by
  one card. Snapping then lands on the nearest card. If cards are at least
  ~58% of the track, one press is exactly one card. Below that, the arrows
  skip cards. Don't make the slides narrower without checking this.

  Browsers without scroll markers still get the full swipe/snap track, plus
  plain anchor dots (.wit-fallback-dots) that jump to each card's #slug.

  Photos: when an event has several photos, the card's strip would be a
  horizontal swipe nested inside the horizontal carousel. Where scroll markers
  are supported, the strip stops swiping and gets its own dots, so swiping
  always moves the carousel. Elsewhere it keeps the old swipe + hint.

  Unlayered CSS beats Tailwind's layered utilities, so these rules win over
  the classes on the same elements (e.g. overflow-x-auto on .wit-photos).
*/
const CAROUSEL_CSS = `
.wit-track {
  display: flex;
  gap: 0.75rem;
  margin: 0;
  padding: 1.5rem 0; /* room for the card shadow and the 3D flip */
  list-style: none;
  overflow-x: auto;
  overscroll-behavior-x: contain;
  scroll-snap-type: x mandatory;
  scroll-behavior: smooth;
  scrollbar-width: none;
  anchor-name: --wit-track;
}
.wit-track::-webkit-scrollbar { display: none; }

.wit-slide {
  position: relative; /* anchors the deep-link pulse ring */
  flex: 0 0 calc(100% - 24px - 0.75rem);
  scroll-snap-align: start;
  scroll-snap-stop: always;
}

@media (min-width: 768px) {
  .wit-carousel { max-width: 56rem; margin-inline: auto; }
  .wit-track { gap: 1.5rem; }
  /* Spacers so the first and last cards can sit in the center. 19% + gap math = (100% - 62%) / 2. */
  .wit-track::before,
  .wit-track::after { content: ''; flex: 0 0 calc(19% - 1.5rem); }
  .wit-slide { flex-basis: 62%; scroll-snap-align: center; }
}

@media (prefers-reduced-motion: reduce) {
  .wit-track { scroll-behavior: auto; }
}

/*
  Deep-link pulse. DEEP_LINK_JS adds .wit-pulse for ~600ms. The ring is drawn
  inside the card's edge (inset shadow), so the track's overflow can't clip it
  on mobile, where the card touches the track's edge. Opacity + transform only.
*/
.wit-slide.wit-pulse::after {
  content: '';
  position: absolute;
  inset: 0;
  z-index: 1;
  border-radius: 1.5rem; /* matches CardFace's rounded-3xl */
  pointer-events: none;
  box-shadow:
    inset 0 0 0 2px var(--color-peri),
    inset 0 0 0 6px rgba(198, 200, 238, 0.22),
    0 0 32px rgba(198, 200, 238, 0.45);
  animation: wit-pulse 600ms cubic-bezier(0.2, 0.7, 0.2, 1) both;
}
@keyframes wit-pulse {
  0% { opacity: 0; transform: scale(0.97); }
  35% { opacity: 1; transform: scale(1); }
  100% { opacity: 0; transform: scale(1); }
}
/* Reduced motion: no animation, the ring just shows for the same 600ms. */
@media (prefers-reduced-motion: reduce) {
  .wit-slide.wit-pulse::after { animation: none; opacity: 1; }
}

@supports (scroll-marker-group: after) {
  .wit-fallback-dots,
  .wit-swipe-hint { display: none; }

  .wit-track { scroll-marker-group: after; }
  .wit-track::scroll-marker-group {
    display: flex;
    justify-content: center;
    gap: 0.25rem;
  }

  .wit-photos { overflow-x: hidden; scroll-marker-group: after; }
  .wit-photos::scroll-marker-group {
    position: absolute;
    inset-inline: 0;
    bottom: 0.375rem;
    display: flex;
    justify-content: center;
    gap: 0.125rem;
  }

  /* Dots: 8px visible, 24px tap target (the padding is clipped from the paint). */
  .wit-track > .wit-slide::scroll-marker,
  .wit-photos > .wit-photo::scroll-marker {
    content: '' / attr(data-label);
    box-sizing: content-box;
    width: 0.5rem;
    height: 0.5rem;
    padding: 0.5rem;
    border-radius: 999px;
    background-color: rgba(198, 200, 238, 0.35);
    background-clip: content-box;
    cursor: pointer;
    transition: width 0.3s ease, background-color 0.3s ease;
  }
  .wit-photos > .wit-photo::scroll-marker { background-color: rgba(255, 255, 255, 0.5); }
  .wit-track > .wit-slide::scroll-marker:target-current {
    width: 1.5rem;
    background-color: var(--color-wit-pink);
  }
  .wit-photos > .wit-photo::scroll-marker:target-current {
    width: 1.25rem;
    background-color: #fff;
  }
  .wit-track > .wit-slide::scroll-marker:focus-visible,
  .wit-photos > .wit-photo::scroll-marker:focus-visible {
    outline: 2px solid var(--color-peri);
    outline-offset: 0;
  }

  @media (min-width: 768px) {
    .wit-track::scroll-button(*) {
      position: fixed;
      position-anchor: --wit-track;
      top: anchor(center);
      translate: 0 -50%;
      z-index: 2;
      display: grid;
      place-items: center;
      width: 2.75rem;
      height: 2.75rem;
      border-radius: 999px;
      border: 1px solid rgba(255, 255, 255, 0.12);
      background: rgba(20, 10, 40, 0.78);
      box-shadow: inset 0 1px 0 rgba(255, 255, 255, 0.2), 0 8px 30px rgba(0, 0, 0, 0.35);
      color: #fff;
      font: 500 1rem/1 var(--font-sans);
      cursor: pointer;
      transition: background-color 0.2s ease, opacity 0.2s ease;
    }
    .wit-track::scroll-button(inline-start) {
      content: '←' / 'Evento anterior';
      left: calc(anchor(left) + 0.75rem);
    }
    .wit-track::scroll-button(inline-end) {
      content: '→' / 'Siguiente evento';
      right: calc(anchor(right) + 0.75rem);
    }
    .wit-track::scroll-button(*):hover:not(:disabled) { background: rgba(60, 25, 100, 0.9); }
    .wit-track::scroll-button(*):focus-visible { outline: 2px solid var(--color-peri); outline-offset: 3px; }
    .wit-track::scroll-button(*):disabled { opacity: 0.3; cursor: default; }
  }

  @media (prefers-reduced-motion: reduce) {
    .wit-track > .wit-slide::scroll-marker,
    .wit-photos > .wit-photo::scroll-marker,
    .wit-track::scroll-button(*) { transition: none; }
  }
}
`

// ── Deep links ───────────────────────────────────────────────
/*
  /proyectos#<slug> scrolls that event's card into view (centered in the
  carousel) and pulses it once.

  Why JS, and why inline: CSS :target would be enough for real browser
  navigations, but "Conoce más" (Button) and the mobile RegisterPrompt both
  use Next's <Link>, which changes the URL with history.pushState. Browsers
  don't update :target for that, and a second click on the same link changes
  nothing. Pages can't add components here, so this lives in a next/script.

  next/script runs an inline script with an `id` once per visit, even across
  client navigations, so everything below installs global listeners once and
  then reacts to:
    - the first load (reload / shared link with a hash),
    - pushState / replaceState that change the path or hash (arriving from
      Inicio via RegisterPrompt),
    - clicks on links to /proyectos#slug while already here (same-hash
      re-clicks included),
    - hashchange (plain <a> links, e.g. the fallback dots).
  Several of these can fire for one navigation; `token` makes only the last
  one count, so the card pulses once.

  The pulse waits until the card stops moving, so it isn't spent mid-scroll.
*/
const DEEP_LINK_JS = `
(function () {
  if (window.__witDeepLinks) return;
  window.__witDeepLinks = true;

  var PULSE_MS = 600;
  var token = 0;

  function onProyectos(u) {
    return u.pathname === '/proyectos' || u.pathname === '/proyectos/';
  }
  function reduce() {
    return window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  }

  function go(url) {
    if (!onProyectos(url) || url.hash.length < 2) return;
    var slug;
    try { slug = decodeURIComponent(url.hash.slice(1)); } catch (e) { return; }
    var mine = ++token;
    var t0 = performance.now();
    (function find() {
      if (mine !== token) return;
      var el = document.getElementById(slug);
      if (el && el.classList.contains('wit-slide')) land(el, mine);
      else if (performance.now() - t0 < 3000) requestAnimationFrame(find);
    })();
  }

  function land(el, mine) {
    el.scrollIntoView({ block: 'start', inline: 'center', behavior: reduce() ? 'auto' : 'smooth' });
    var last = '', still = 0, t0 = performance.now();
    (function settle() {
      if (mine !== token) return;
      var r = el.getBoundingClientRect();
      var key = Math.round(r.top) + ',' + Math.round(r.left);
      still = key === last ? still + 1 : 0;
      last = key;
      if (still >= 6 || performance.now() - t0 > 1500) pulse(el);
      else requestAnimationFrame(settle);
    })();
  }

  function pulse(el) {
    el.classList.remove('wit-pulse');
    void el.offsetWidth; /* restart the animation if it is already there */
    el.classList.add('wit-pulse');
    clearTimeout(el.__witPulse);
    el.__witPulse = setTimeout(function () { el.classList.remove('wit-pulse'); }, PULSE_MS + 50);
  }

  function schedule(url) {
    setTimeout(function () { go(url || new URL(location.href)); }, 0);
  }

  ['pushState', 'replaceState'].forEach(function (m) {
    var orig = history[m];
    history[m] = function () {
      var before = location.pathname + location.hash;
      var out = orig.apply(this, arguments);
      if (location.pathname + location.hash !== before) schedule();
      return out;
    };
  });

  document.addEventListener('click', function (e) {
    if (e.defaultPrevented || e.button !== 0 || e.metaKey || e.ctrlKey || e.shiftKey || e.altKey) return;
    var a = e.target instanceof Element ? e.target.closest('a[href]') : null;
    if (!a || a.target === '_blank') return;
    var url = new URL(a.href, location.href);
    if (url.origin !== location.origin || !onProyectos(url) || url.hash.length < 2) return;
    if (!onProyectos(location)) return; /* arriving from another page: pushState handles it */
    schedule(url);
  }, true);

  window.addEventListener('hashchange', function () { schedule(); });

  schedule();
})();
`

// ── Flip state ───────────────────────────────────────────────
/*
  FlipCard is controlled (it needs a `side` prop), and this is a server
  component, so there's no useState here. The flip lives in the URL instead:
  /proyectos?card=talleres&side=impact. Links use scroll={false} + replace, so
  the page doesn't jump and Back doesn't replay every flip. Next keeps the DOM
  between these navigations, so FlipCard's CSS rotation still animates and the
  carousel keeps its scroll position.
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

/**
 * Photo strip. With scroll markers: dots, no swipe (the carousel owns the swipe).
 * Without: CSS scroll-snap swipe + hint, as before. No photos: one PhotoFrame placeholder.
 */
function PhotoStrip({ event }: { event: WitEvent }) {
  const photos: (string | null)[] = event.photos.length ? event.photos : [null]
  const many = photos.length > 1
  return (
    <div className="relative">
      <div
        className={`flex snap-x snap-mandatory gap-3 overflow-x-auto [scrollbar-width:none] [&::-webkit-scrollbar]:hidden ${many ? 'wit-photos' : ''}`}
        {...(many ? { tabIndex: 0, role: 'region', 'aria-label': `Fotos de ${event.title}` } : {})}
      >
        {photos.map((src, i) => (
          <div
            key={src ?? `empty-${i}`}
            data-label={`Foto ${i + 1} de ${photos.length}`}
            className="wit-photo w-full shrink-0 snap-center"
          >
            <PhotoFrame
              src={src}
              alt={`${event.title}, foto ${i + 1}`}
              sizes="(min-width: 768px) 560px, 90vw"
              className="aspect-[4/3] w-full md:aspect-[16/9]"
            />
          </div>
        ))}
      </div>
      {many && (
        <span className="wit-swipe-hint pointer-events-none absolute right-3 bottom-3 rounded-full bg-black/45 px-3 py-1 text-[10px] font-light uppercase tracking-[0.2em] text-white/85 backdrop-blur-sm">
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
  // Every event in EVENTS has a carousel slide with id={slug}, so "Conoce más" always has a target.
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

      {/* Event carousel. One slide per EVENTS entry; each <li> owns the #slug anchor. Styles: CAROUSEL_CSS. */}
      <style dangerouslySetInnerHTML={{ __html: CAROUSEL_CSS }} />
      <Script id="wit-deep-links" strategy="afterInteractive" dangerouslySetInnerHTML={{ __html: DEEP_LINK_JS }} />
      <Container>
        <div className="wit-carousel">
          <ul className="wit-track" aria-label="Eventos">
            {EVENTS.map((e) => {
              const side: Side = flip?.slug === e.slug ? flip.side : 'front'
              return (
                <li key={e.slug} id={e.slug} data-label={e.title} className="wit-slide scroll-mt-28">
                  {/* Slides stretch to the tallest one; these variants pass that height down through FlipCard's layers. */}
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

          {/* Only shown where CSS scroll markers aren't supported. */}
          <nav aria-label="Ir a un evento" className="wit-fallback-dots flex justify-center gap-1">
            {EVENTS.map((e) => (
              <a key={e.slug} href={`#${e.slug}`} aria-label={e.title} className="rounded-full p-2">
                <span className="block h-2 w-2 rounded-full bg-peri/35" />
              </a>
            ))}
          </nav>
        </div>
      </Container>

      {/* Hack4Her feature. The event has its own site, so this links out. The anchor lives on its slide above. */}
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
