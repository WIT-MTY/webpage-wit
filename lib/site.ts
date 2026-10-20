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
  { label: 'Aliados estratégicos', href: '/aliados' },
  { label: 'Integrantes', href: '/integrantes' },
  { label: 'Contáctanos', href: '/contacto' },
] as const

/** Hack4Her lives on its own site. */
export const HACK4HER_URL: string | null = 'https://www.hack4her.com/'

export const CONTACT_EMAIL: string | null = 'wit.mty@gmail.com'

/** Only networks with a confirmed URL. Anything not listed here is not shown. */
export const SOCIALS = [
  { label: 'Instagram', handle: '@wit.mty', href: 'https://www.instagram.com/wit.mty/?hl=es' },
  { label: 'LinkedIn', handle: 'Women in Technology', href: 'https://mx.linkedin.com/company/wit-mty' },
] as const

export const ADDRESS = [
  'Tecnológico de Monterrey, Campus Monterrey',
  'Av. Eugenio Garza Sada 2501 Sur, Col. Tecnológico',
  '64849 Monterrey, N.L.',
]

/** Google Maps link for ADDRESS. The address text links here wherever it is shown. */
export const ADDRESS_MAP_URL: string | null = 'https://maps.app.goo.gl/hNCyZcVZoSddFUPw6'

/**
 * Recruitment countdown on /integrantes ("Únete"), as ISO with the Monterrey
 * offset. Once it passes, the countdown is replaced by "Las aplicaciones ya
 * abrieron". Null hides the countdown.
 */
// ESTIMATE, replace with the official date.
export const RECRUITMENT_OPENS_AT: string | null = '2027-02-05T00:00:00-06:00'

/** Line shown with the recruitment countdown. Update it together with the date. */
export const RECRUITMENT_NOTE = 'Las aplicaciones abren aproximadamente el 5 de febrero'

/**
 * Form for applying to WitCode. While null, /witcode shows a disabled
 * "Convocatoria no abierta por ahora" button instead of a link.
 */
export const WITCODE_APPLY_URL: string | null = null

/** WitCode's own Instagram (@witcode.mty), shown on /witcode. Not part of SOCIALS. */
export const WITCODE_INSTAGRAM_URL: string | null = 'https://www.instagram.com/witcode.mty/'

// ── Events ───────────────────────────────────────────────────

export type EventMetric = { value: string; label: string }

export type WitEvent = {
  slug: string
  title: string
  /** Other name the event is known by. Reference only, never displayed. */
  aka?: string
  category: string
  /** Empty string = not written yet; the line is hidden on public cards. */
  tagline: string
  /** Empty string = not written yet; the line is hidden on public cards. */
  description: string
  /** "Cómo puedes sumarte" line on the Aliados sponsor cards. */
  sponsorHow?: string
  /** Short highlights shown as chips in the Próximo evento panel. */
  chips?: string[]
  /** ISO date of the event. Null until it is confirmed. */
  date: string | null
  /** Google Form for this event. Null hides the sign-up button. */
  formUrl: string | null
  /** Photos for the card carousel: put files in /public/photos. */
  photos: string[]
  metrics: EventMetric[]
  /** Sponsor logos for the back of the card: /public/aliados/... */
  sponsors: (string | null)[]
}

/** The order events are listed in, everywhere. */
export const EVENT_ORDER = [
  'hackwitu',
  'journey-to-internship',
  'dia-de-la-mujer',
  'empowerhack',
  'reunion-nacional',
  'hack4her',
  'run4wit',
] as const

/** Placeholder for an event we only know the name of. */
const pendingEvent = (slug: string, title: string): WitEvent => ({
  slug,
  title,
  // TODO: category, tagline, description and date.
  category: '',
  tagline: '',
  description: '',
  date: null,
  formUrl: null,
  photos: [],
  metrics: [],
  sponsors: [],
})

const EVENT_LIST: WitEvent[] = [
  {
    ...pendingEvent('hackwitu', 'HackWITu'),
    // DRAFT: confirm with WIT leadership before launch
    sponsorHow: 'Premios, mentoría para los equipos, talleres o apoyo con comida y merch.',
    aka: 'Hack4Prepa',
    category: 'Hackathon',
    tagline: 'No necesitas ser experta en STEM, ¡solo tener curiosidad, creatividad y ganas de intentarlo!',
    // TODO(kat): confirm wording
    description:
      'HackWITu es un hackathon dirigido a estudiantes de preparatoria con el propósito de fomentar la participación de mujeres en la tecnología.',
    chips: ['Equipos de cuatro integrantes', 'Merch oficial', 'Networking', 'Comida'],
    date: '2026-11-14T08:00:00-06:00',
    formUrl:
      'https://docs.google.com/forms/d/e/1FAIpQLSfEkFMz5DSeC2yTq1MsO7lmwlY9WV48x-Hdld0OBFYmQjy07Q/viewform',
  },
  {
    ...pendingEvent('empowerhack', 'EmpowerHack'),
    // DRAFT: confirm with WIT leadership before launch
    sponsorHow: 'Premios, mentoría y talleres para chicas de secundaria.',
    description:
      'Un hackathon dirigido a chicas de secundaria con el propósito de fomentar la participación de mujeres en la tecnología desde una temprana edad.',
  },
  {
    ...pendingEvent('reunion-nacional', 'Reunión Nacional'),
    // DRAFT: confirm with WIT leadership before launch
    sponsorHow: 'Patrocina paneles y coffee breaks, o participa como panelista.',
    // TODO confirm with Dana
    description:
      'Una reunión que invita a mujeres de todo el país: investigadoras, docentes, profesionistas, estudiantes y mujeres de todas las áreas STEM. Entre paneles y coffee breaks, conversamos sobre las adversidades y los retos que enfrentan las mujeres.',
  },
  {
    slug: 'hack4her',
    // DRAFT: confirm with WIT leadership before launch
    sponsorHow: 'Apoya el hackathon con premios, mentoría y retos de tu empresa.',
    title: 'Hack4Her',
    category: 'Hackathon',
    tagline: 'Un fin de semana para construir con causa.',
    description:
      'Hack4Her es un hackathon organizado por mujeres y dirigido a mujeres. El objetivo es fomentar la participación de mujeres en hackathons y en el área de la tecnología.',
    date: null,
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
    slug: 'journey-to-internship',
    // DRAFT: confirm with WIT leadership before launch
    sponsorHow: 'Imparte una conferencia o taller y conecta con estudiantes que buscan su primer internship.',
    title: 'Journey to Internship',
    category: 'Programa',
    tagline: 'Puentes hacia grandes oportunidades.',
    description:
      'Las y los estudiantes del Tecnológico de Monterrey son invitados a una serie de conferencias y talleres impartidos por empresas con reconocimiento nacional y/o internacional con el objetivo de prepararse para internships.',
    date: null,
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
    slug: 'dia-de-la-mujer',
    // DRAFT: confirm with WIT leadership before launch
    sponsorHow: 'Apoya el desayuno conmemorativo o participa como ponente en el diálogo sobre liderazgo femenino.',
    title: 'Día de la Mujer',
    category: 'Evento',
    tagline: 'Celebramos hoy para un mañana más justo.',
    description:
      'Desayuno conmemorativo donde alumnas, docentes y profesionales dialogan sobre experiencias y liderazgo femenino. Un espacio para inspirar y visibilizar su impacto.',
    date: null,
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
    // DRAFT: confirm with WIT leadership before launch
    sponsorHow: 'Apoya la carrera con kits de corredor, premios o hidratación.',
    title: 'Run4WIT',
    category: 'Carrera',
    tagline: 'Corremos por más mujeres en tecnología.',
    description:
      'Una carrera con causa en colaboración con RUNIIS, donde cada paso impulsa oportunidades en STEM. Categorías de 3K y 5K en el Ágora de las Artes.',
    date: null,
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

const orderOf = (slug: string) => (EVENT_ORDER as readonly string[]).indexOf(slug)

/** All events, sorted by EVENT_ORDER. */
export const EVENTS: WitEvent[] = [...EVENT_LIST].sort((a, b) => orderOf(a.slug) - orderOf(b.slug))

/**
 * The upcoming event, shown in the "Próximo evento" panel (Proyectos) and the
 * mobile register prompt (Inicio). Set to null when there is nothing coming
 * up: the panel disappears and the prompt never shows.
 * The registration link is the event's own `formUrl`.
 */
export const NEXT_EVENT: {
  slug: string
  /**
   * Start, as ISO with an explicit Monterrey offset. Drives the countdown,
   * which is then the same for every visitor whatever their time zone.
   */
  date: string | null
  /** End time, same day, "HH:MM" Monterrey time. */
  endTime: string | null
  venue: string | null
  registrationOpen: boolean
  /** Google Apps Script URL that returns { count } for this event's form. Null hides the counter. */
  countUrl: string | null
} | null = {
  slug: 'hackwitu',
  date: '2026-11-14T08:00:00-06:00',
  endTime: '18:00',
  venue: 'Innovation Gym, Tec de Monterrey',
  registrationOpen: true,
  countUrl: null,
}

/** The full event record for NEXT_EVENT, or null. */
export const nextEvent = () => (NEXT_EVENT ? EVENTS.find((e) => e.slug === NEXT_EVENT.slug) ?? null : null)

// ── Activities (Inicio carousel + Proyectos) ─────────────────

/**
 * Celestial icon per event, see components/Celestial.tsx for the options.
 * There are 6 icons for 7 events: the one repeat sits far apart in the grid.
 */
const ACTIVITY_ICONS: Record<(typeof EVENT_ORDER)[number], string> = {
  hackwitu: 'burst',
  'journey-to-internship': 'constellation',
  'dia-de-la-mujer': 'star',
  empowerhack: 'diamond',
  'reunion-nacional': 'planet',
  hack4her: 'burst',
  run4wit: 'moon',
}

/** One card per event, in EVENT_ORDER. */
export const ACTIVITIES = EVENTS.map((e) => ({
  title: e.title,
  tagline: e.tagline,
  sponsorHow: e.sponsorHow,
  body: e.description,
  slug: e.slug,
  icon: ACTIVITY_ICONS[e.slug as keyof typeof ACTIVITY_ICONS] ?? 'star',
}))

/** The events featured in the Inicio carousel, in this order. */
export const INICIO_FEATURED = ['hack4her', 'journey-to-internship', 'empowerhack', 'dia-de-la-mujer'] as const

// ── Sponsoring (Aliados, "Haz posible nuestros eventos") ──────

// DRAFT: confirm with WIT leadership before launch
export const SPONSOR_INTRO =
  'Cada evento de WIT es posible gracias a aliados que creen en el talento femenino en tecnología. Elige el evento que más te interese y conversemos cómo sumarte.'

// DRAFT: confirm with WIT leadership before launch
export const SPONSOR_BENEFITS = [
  { title: 'Visibilidad', body: 'Tu marca frente a la comunidad estudiantil del Tec de Monterrey.', icon: 'star' },
  { title: 'Networking', body: 'Conexión directa con talento joven en STEM.', icon: 'constellation' },
  { title: 'Impacto', body: 'Contribuyes a cerrar la brecha de género en tecnología.', icon: 'burst' },
] as const

// DRAFT: confirm with WIT leadership before launch
export const SPONSOR_OTHER_WAYS = 'También puedes escribirnos para proponer otra forma de colaborar.'

// ── WitCode ──────────────────────────────────────────────────

/** Annual metrics, shown on /witcode and the Inicio band. */
export const WITCODE_STATS = [
  { value: '34', label: 'estudiantes universitarios haciendo su servicio social' },
  { value: '92%', label: 'de permanencia en los talleres' },
  { value: '5', label: 'años cambiando vidas' },
]

/** Program description, one string per paragraph. Verbatim, do not edit. */
export const WITCODE_DESCRIPTION = [
  'WitCode no es solo un programa de servicio social; es el lugar donde la tecnología abre la puerta a un mundo de posibilidades para quienes más lo necesitan.',
  'Nacido del grupo estudiantil WIT (Women in Technology) en el Tecnológico de Monterrey, WitCode toma inspiración de iniciativas globales como Hour of Code y la transforma en una herramienta de aprendizaje y visión.',
  'Aquí, estudiantes universitarios se convierten en mentores para niñas de la escuela “Ciudad de los Niños”. Más allá de enseñar a programar con plataformas interactivas como Scratch, WitCode tiene la misión de decirle a cada niña y joven que pertenecen aquí, que su voz cuenta, que sus ideas tienen el poder de cambiar el futuro y que la brecha de género y la brecha digital se cierran comenzando por su propia convicción.',
]

// ── Allies ───────────────────────────────────────────────────

export type Ally = {
  name: string
  /** Logo file name in /public/aliados, without extension (.png, .jpg and
   *  .webp are detected). Null or a missing file shows the name as text. */
  logo: string | null
  note?: string
  /** true = "Aliados actuales", false = the past-allies wall. */
  current: boolean
  /** Years of the alliance. Shown under the name when present. */
  years?: string
  /** Tile background behind the logo. Default white. */
  tileBg?: 'black'
  /**
   * Solid tile color (CSS color) that overrides tileBg. Use it when the logo
   * sits on a flat color square, so the square blends into the tile.
   */
  tileColor?: string
  /** Wide horizontal lockup: less padding so it fills the tile width. */
  wideLogo?: boolean
}

/**
 * The flat purple behind the Ingenia emblem, sampled from
 * public/aliados/ingenia.jpg (median of its outer 8px band, every pixel
 * 91,34,139). Its tile uses it, so the logo's square disappears into the card.
 * Re-sample if the logo file changes.
 */
export const INGENIA_PURPLE = '#5b228b'

export const ALLIES: Ally[] = [
  { name: 'Arca Continental', logo: 'arca-continental', current: true },
  { name: 'Peckers', logo: 'peckers', current: true, tileBg: 'black' },
  { name: 'Heineken', logo: 'heineken', current: true },
  { name: 'Apex Systems', logo: 'apex-systems', current: true },
  {
    name: 'Escuela de Ingeniería y Ciencias',
    logo: 'escuela-ingenieria-ciencias',
    current: true,
    wideLogo: true,
  },
  { name: 'Ingenia', logo: 'ingenia', current: true, tileColor: INGENIA_PURPLE },
  { name: 'Carrier', logo: 'carrier', current: true },
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

/**
 * The two photo blocks beside the description on /witcode: the first sits
 * behind, lower right; the second in front, upper left. Each block crossfades
 * through its `photos`. Drop the files in /public/witcode and add entries like
 * { src: '/witcode/bienvenida.jpg', alt: '…' }. One photo = static; an empty
 * list shows the dashed placeholder, described by `alt`. `position` is an
 * optional CSS object-position that keeps the subject in frame if cropped.
 */
export const WITCODE_PHOTOS: {
  caption: string
  /** Placeholder description while `photos` is empty. */
  alt: string
  photos: { src: string; alt: string; position?: string }[]
}[] = [
  {
    caption: 'Bienvenida WitCode',
    alt: 'Generación de WitCode',
    photos: [{ src: '/witcode/witcode-group.webp', alt: 'Grupo de WitCode con estudiantes y equipo de WIT en el campus' }],
  },
  {
    caption: 'Talleres con Ciudad de los Niños',
    alt: 'Taller de WitCode con alumnas de Ciudad de los Niños',
    photos: [
      {
        src: '/witcode/witcode-class.webp',
        alt: 'Clase de WitCode con la bienvenida en pantalla',
        // Projector screen and instructors are on the left.
        position: '25% 40%',
      },
    ],
  },
]

/**
 * Home "Sobre nosotras" collage. The big slot is a muted loop (webm first, mp4
 * fallback); its poster is the still shown while loading, under
 * prefers-reduced-motion and with INICIO_VIDEO off. The second is a photo.
 */
export const ABOUT_VIDEO = {
  webm: '/inicio/run4wit-loop.webm',
  mp4: '/inicio/run4wit-loop.mp4',
  poster: '/inicio/run4wit-poster.webp',
  alt: 'Integrantes de WIT con medallas y un cartel de «Running on Connection»',
}
export const ABOUT_PHOTO = {
  src: '/inicio/officers.webp',
  alt: 'Equipo directivo de WIT haciendo la seña de WIT con las manos',
}

/** Hero background photos, kept at ~5% opacity. */
export const MARQUEE_PHOTOS: (string | null)[] = [null, null, null, null, null, null]

/**
 * Whether the hero photo strip scrolls sideways. Measured: the moving strip
 * costs ~13fps of scroll smoothness. Static looks nearly identical at 5%.
 */
export const MARQUEE_MOTION = false
