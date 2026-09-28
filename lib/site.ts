/*
  ─────────────────────────────────────────────────────────────
  SITE CONTENT. Edit here, not in the components.
  ─────────────────────────────────────────────────────────────
  Anything set to null renders a graceful placeholder instead of breaking.
  Shared file: if you are working on one page, ask Kat before changing
  anything outside your own page's data.
*/

export const NAV_LINKS = [
  { label: 'Inicio', href: '/' },
  { label: 'Proyectos', href: '/proyectos' },
  { label: 'WitCode', href: '/witcode' },
  { label: 'Aliados', href: '/aliados' },
  { label: 'Integrantes', href: '/integrantes' },
  { label: 'Contáctanos', href: '/contacto' },
] as const

/** Hack4Her lives on its own site. TODO: paste the real URL. */
export const HACK4HER_URL: string | null = null

export const CONTACT_EMAIL: string | null = 'wit.mty@gmail.com'

export const SOCIALS = [
  { label: 'Instagram', handle: '@wit.mty', href: 'https://instagram.com/wit.mty' },
  { label: 'TikTok', handle: '@wit.mty', href: 'https://www.tiktok.com/@wit.mty' },
  { label: 'LinkedIn', handle: 'Women in Technology', href: 'https://www.linkedin.com/company/82364150/' },
] as const

export const ADDRESS = [
  'Tecnológico de Monterrey, Campus Monterrey',
  'Av. Eugenio Garza Sada 2501 Sur, Col. Tecnológico',
  '64849 Monterrey, N.L.',
]

/**
 * Recruitment countdown on /integrantes.
 * ISO date string, e.g. '2027-01-15T09:00:00-06:00'. While null: "Próximamente".
 */
export const APPLICATIONS_OPEN: string | null = null

// ── Events ───────────────────────────────────────────────────

export type EventMetric = { value: string; label: string }

export type WitEvent = {
  slug: string
  title: string
  category: string
  tagline: string
  description: string
  /** Google Form for this event. Null hides the sign-up button. */
  formUrl: string | null
  /** Photos for the card carousel: put files in /public/photos. */
  photos: string[]
  metrics: EventMetric[]
  /** Sponsor logos for the back of the card: /public/aliados/... */
  sponsors: (string | null)[]
}

export const EVENTS: WitEvent[] = [
  {
    slug: 'hack4her',
    title: 'Hack4Her',
    category: 'Hackathon',
    tagline: 'Un fin de semana para construir con causa.',
    description:
      'Nuestro hackathon para impulsar a más mujeres en tecnología: equipos, mentoras y retos reales de la industria.',
    formUrl: null,
    photos: [],
    metrics: [
      { value: '482', label: 'participantes' },
      { value: '—', label: 'equipos' },
      { value: '—', label: 'retos' },
    ],
    sponsors: [null, null, null, null, null, null],
  },
  {
    slug: 'conferencias',
    title: 'Conferencias',
    category: 'Evento',
    tagline: 'Voces que inspiran nuevos caminos.',
    description:
      'Mujeres de la industria y la academia comparten su trayectoria, sus aprendizajes y el camino que las llevó a donde están.',
    formUrl: null,
    photos: [],
    metrics: [
      { value: '—', label: 'asistentes' },
      { value: '—', label: 'ponentes' },
      { value: '—', label: 'ediciones' },
    ],
    sponsors: [null, null, null],
  },
  {
    slug: 'journey-to-internship',
    title: 'Journey to Internship',
    category: 'Programa',
    tagline: 'Puentes hacia grandes oportunidades.',
    description:
      'Preparación y vinculación para conseguir tu primera práctica profesional: CV, entrevistas y contacto directo con empresas.',
    // TODO: paste the Journey to Internship Google Form URL here.
    formUrl: null,
    photos: [],
    metrics: [
      { value: '—', label: 'participantes' },
      { value: '—', label: 'empresas' },
      { value: '—', label: 'prácticas conseguidas' },
    ],
    sponsors: [null, null, null],
  },
  {
    slug: 'talleres',
    title: 'Talleres',
    category: 'Evento',
    tagline: 'Herramientas para crear sin límites.',
    description:
      'Sesiones prácticas para aprender haciendo, desde tus primeras líneas de código hasta proyectos completos.',
    formUrl: null,
    photos: [],
    metrics: [
      { value: '—', label: 'talleres' },
      { value: '—', label: 'asistentes' },
      { value: '—', label: 'horas' },
    ],
    sponsors: [null, null, null],
  },
  {
    slug: 'dia-de-la-mujer',
    title: 'Día de la Mujer',
    category: 'Evento',
    tagline: 'Celebramos hoy para un mañana más justo.',
    description:
      'Una jornada para reconocer a las mujeres en tecnología y abrir la conversación sobre la brecha de género.',
    formUrl: null,
    photos: [],
    metrics: [
      { value: '—', label: 'asistentes' },
      { value: '—', label: 'actividades' },
      { value: '—', label: 'aliados' },
    ],
    sponsors: [null, null, null],
  },
  {
    slug: 'run4wit',
    title: 'Run4WIT',
    category: 'Carrera',
    tagline: 'Corremos por más mujeres en tecnología.',
    // TODO: fill in from the Instagram post (date, distance, cause).
    description: 'Descripción pendiente.',
    formUrl: null,
    photos: [],
    metrics: [
      { value: '—', label: 'corredoras' },
      { value: '—', label: 'kilómetros' },
      { value: '—', label: 'recaudado' },
    ],
    sponsors: [null, null, null],
  },
]

/**
 * The upcoming event, shown in the "Próximo evento" panel and the mobile
 * register prompt. Set to null when there is nothing coming up: both switch
 * to their "no event" state on their own.
 */
export const NEXT_EVENT: {
  slug: string
  /** ISO date of the event itself, drives the "En N días" countdown. */
  date: string | null
  whereWhen: string
  registrationOpen: boolean
  /** Google Apps Script URL that returns { count } for this event's form. */
  countUrl: string | null
} | null = {
  slug: 'journey-to-internship',
  date: null,
  whereWhen: 'Fecha y lugar por confirmar',
  registrationOpen: true,
  countUrl: null,
}

/** The full event record for NEXT_EVENT, or null. */
export const nextEvent = () => (NEXT_EVENT ? EVENTS.find((e) => e.slug === NEXT_EVENT.slug) ?? null : null)

// ── Activities (Inicio teaser + Proyectos) ───────────────────

/** Celestial icon per activity, see components/Celestial.tsx for the options. */
const ACTIVITY_ICONS: Record<string, string> = {
  conferencias: 'burst',
  'journey-to-internship': 'constellation',
  talleres: 'diamond',
  'dia-de-la-mujer': 'star',
}

export const ACTIVITIES = EVENTS.filter((e) => e.slug in ACTIVITY_ICONS).map((e) => ({
  title: e.title,
  tagline: e.tagline,
  body: e.description,
  slug: e.slug,
  icon: ACTIVITY_ICONS[e.slug],
}))

// ── Allies ───────────────────────────────────────────────────

export type Ally = {
  name: string
  /** Logo in /public/aliados. Without one, the name shows as text. */
  logo: string | null
  note?: string
  /** true = "Aliados actuales", false = the past-allies wall. */
  current: boolean
}

export const ALLIES: Ally[] = [
  { name: 'Tecnológico de Monterrey', logo: null, note: 'Aliado académico', current: true },
]

// ── Lumi ─────────────────────────────────────────────────────

/** What Lumi says on each route. */
export const LUMI_LINES: Record<string, string> = {
  '/': '¡Hola! Soy Lumi. ¿Te enseño nuestros eventos?',
  '/proyectos': 'Voltea las tarjetas para ver su impacto.',
  '/integrantes': 'Toca "¿Dónde está hoy?" para conocer su historia.',
  '/witcode': '¡Aquí enseñamos a programar a chicas de secundaria!',
  '/aliados': '¿Tu organización quiere sumarse? ¡Escríbenos!',
}

// ── Photos ───────────────────────────────────────────────────

/** Home collage. Drop files in /public/photos and fill `src`. */
export const COLLAGE_PHOTOS: { src: string | null; alt: string }[] = [
  { src: null, alt: 'Integrantes de WIT en un evento' },
  { src: null, alt: 'Taller de WitCode' },
  { src: null, alt: 'Equipo WIT en Hack4Her' },
]

/** Hero background photos, kept at ~5% opacity. */
export const MARQUEE_PHOTOS: (string | null)[] = [null, null, null, null, null, null]

/**
 * Whether the hero photo strip scrolls sideways. Measured: the moving strip
 * costs ~13fps of scroll smoothness. Static looks nearly identical at 5%.
 */
export const MARQUEE_MOTION = false
