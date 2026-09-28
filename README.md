# WIT · Women in Technology

Website for WIT, Tecnológico de Monterrey, Campus Monterrey.
Next.js 15 (App Router) · React 19 · TypeScript · Tailwind CSS v4.

## Run it

Requires Node 20 or newer.

```bash
npm install
npm run dev        # http://localhost:3000
npm run build      # production build, must pass before deploying
```

## Team assignments

Each page has a written brief in [`docs/`](docs/README.md): what to build, which
shared components to use, and what "done" means. Read yours first.

## Where to edit content

You should almost never need to touch a component. Content lives in two files.

| What | File |
|---|---|
| Team roster (Integrantes), incl. bios | `data/members.ts` |
| Events, next event, allies, Lumi's lines | `lib/site.ts` |
| Nav, socials, email, Hack4Her link, recruitment date, activities, photos | `lib/site.ts` |

## Shared components (already built)

| Component | What it does |
| --- | --- |
| `FlipCard` | 3D flip with equal heights, keyboard access, reduced motion |
| `CountUp` | Numbers that count up on scroll; handles "—" and "90%" |
| `useRegistrationCount` | Live Google Form response count (see the file header for the Apps Script) |
| `Lumi` | The firefly companion, site-wide. Lines come from `LUMI_LINES` |
| `RegisterPrompt` | Mobile prompt on Inicio that links to the next event |
| `Countdown`, `PageHero`, `PhotoFrame`, `Celestial`, `ui.tsx` | Brand primitives |

`app/not-found.tsx` is the 404 page. `public/og.png` is the link preview shown
in WhatsApp and iMessage.

### Placeholders to fill before launch

All in `lib/site.ts`. Each renders a graceful fallback while empty.

- `HACK4HER_URL`: the Hack4Her site. The nav button and Proyectos page link here.
- `CONTACT_EMAIL`: shows "Por confirmar" while `null`.
- `APPLICATIONS_OPEN`: ISO date like `'2027-01-15T09:00:00-06:00'`. Shows "Próximamente" while `null`.
- `COLLAGE_PHOTOS` and `MARQUEE_PHOTOS`: put images in `public/photos/` and set paths like `'/photos/wit25.jpg'`.
- WitCode group photo: `WITCODE_PHOTO` at the top of `app/witcode/page.tsx`.
- Ally logos: `ALLIES` at the top of `app/aliados/page.tsx`.

The old site's repo has real photos worth reusing (for example `images/wit25.JPG` and `images/proyectos/JTI24_3.JPG`).

### Updating the team

Add one row per person to `data/members.ts`. Adding rows with a new `generation` (for example `'2027-2028'`) creates a new year chip automatically, and the newest year is selected by default. Photos go in `public/team/`.

How the Integrantes filters behave:

1. Pick a generation → Presidenta, Vicepresidenta, and the six area directors appear.
2. Pick an area (or click a director's card) → that director stays and her coordinators appear.

## Project map

```
app/
  layout.tsx          fonts, background, nav, footer (shared by every page)
  globals.css         design tokens, glass surfaces, animations
  page.tsx            Inicio
  proyectos/          Nuestras actividades + Hack4Her feature
  witcode/            WitCode (servicio social)
  aliados/            Aliados
  integrantes/        Team explorer + recruitment countdown
  contacto/           Contáctanos
components/
  HomeHero.tsx        landing hero, ported from the Figma Make design
  FloatingShapes.tsx  3D brand shapes
  Atmosphere.tsx      fixed background glow
  TeamExplorer.tsx    generation + area filters
  ...
data/members.ts       roster
lib/site.ts           site content
public/brand/         logo SVGs + pre-rendered logo glow
public/shapes/        3D shapes, pre-blurred at three depths
```

## Design system

Brand tokens are defined once in `app/globals.css` under `@theme`, so Tailwind classes like `text-peri`, `bg-wit-deep`, and `font-display` all resolve to brand values.

- **Colors:** `#080414` base, `#47126B`, `#6411AD`, `#7C22C7`, `#9066D2`, `#C6C8EE` (periwinkle), `#FF5795` (accent only). Gradients run at 135deg per the brand guide.
- **Type:** Raleway for body and UI (a brand font), Playfair Display for headings. Both are self-hosted through `@fontsource`, so there are no Google Fonts requests at runtime.
- **Logo:** vector, traced from the high-resolution brand kit page. `wit-mark.svg` is the wordmark alone, `wit-lockup.svg` includes "WOMEN IN TECH".

## Performance notes (read before adding effects)

The original Figma Make landing page lagged. These are the causes and what replaced them. Please keep it this way.

| Lag source in the original | Replacement |
|---|---|
| Five orbs with `filter: blur(100–200px)` | Radial gradients on a fixed layer, painted once |
| Animated photo marquee inside a `blur()` filter, re-blurred every frame | No filter on the moving track |
| Floating shapes animated while carrying live blur filters | Blur baked into the images, only `transform` animates |
| `backdrop-filter` on the nav and panels | Nav only, desktop only; panels use a highlight recipe instead |
| Logo bloom as a duplicate image blurred at 40px | Pre-rendered `wit-bloom.webp` |

Rules of thumb:

- Animate only `transform` and `opacity`.
- Never put `filter: blur()` or `backdrop-filter` on something that moves or sits on top of something that moves.
- Use `next/image` (see `PhotoFrame.tsx`) for real photos, so each device gets a correctly sized file.
- Everything respects `prefers-reduced-motion`.

## Deploying to the WIT org repo

1. Push this project to your test repo and review there.
2. When it's approved, push to the org repo and connect it to Vercel. No environment variables are needed: every page is static.
