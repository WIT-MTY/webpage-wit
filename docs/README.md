# Page assignments

One file per page. Read yours before you start, and read
`../README.md` for how to run the project.

| Page | File | Brief |
| --- | --- | --- |
| Inicio | `app/page.tsx` | [TODO-inicio.md](TODO-inicio.md) |
| Proyectos | `app/proyectos/page.tsx` | [TODO-proyectos.md](TODO-proyectos.md) |
| WitCode | `app/witcode/page.tsx` | [TODO-witcode.md](TODO-witcode.md) |
| Aliados | `app/aliados/page.tsx` | [TODO-aliados.md](TODO-aliados.md) |
| Integrantes | `app/integrantes/page.tsx` | [TODO-integrantes.md](TODO-integrantes.md) |
| Contáctanos | `app/contacto/page.tsx` | Kat (Lumi animation) |

## What already exists for you

Every page runs today and already matches the brand. Your job is to bring it
up to the new Figma design. These shared pieces are done, use them instead of
writing your own:

| Piece | Where | What it does |
| --- | --- | --- |
| `FlipCard` | `components/FlipCard.tsx` | 3D flip with equal heights, keyboard access, reduced motion |
| `CountUp` | `components/CountUp.tsx` | Numbers that count up when scrolled into view. Handles "—" and "90%" safely |
| `useRegistrationCount` | `lib/useRegistrationCount.ts` | Live Google Form response count |
| `Countdown` | `components/Countdown.tsx` | Days / hours / min / sec tiles |
| `Button`, `Heading`, `MicroLabel`, `Container`, `Rule` | `components/ui.tsx` | Brand UI primitives |
| `PageHero` | `components/PageHero.tsx` | Standard page hero |
| `PhotoFrame` | `components/PhotoFrame.tsx` | Photo slot with a branded placeholder |
| `Celestial` | `components/Celestial.tsx` | Star / burst / planet icons |
| Content | `lib/site.ts`, `data/members.ts` | All text, links, events, allies |
| Lumi, register prompt, nav, footer, 404 | — | Done. Don't edit. |

## Definition of done

1. Matches the Figma frame for your page: spacing, sizes, colors.
2. Works at 375px, 768px and 1440px wide.
3. `npm run build` passes with no errors.
4. No invented content. Placeholders stay placeholders.
5. Nothing edited outside your page and your own new components.
6. You can explain your code.

## Performance rules (measured, please don't undo)

The old site lagged and the client noticed, so these are not style opinions:

1. **Animate only `transform` and `opacity`.** Never animate blur, filters, or
   gradients.
2. **Never put `filter: blur()` or `backdrop-filter` on something that moves,
   or on something that sits over moving content.** The nav's backdrop blur cost
   ~3fps and visible stutter on a hi-dpi screen; it is now a solid translucent fill.
3. **Only small shapes animate.** Big blurred shapes stay still. Animating all of
   them dropped scrolling from 60fps to ~37fps at 1920 on a retina screen.
4. **Ambient motion gets `data-ambient`** so `MotionGovernor` switches it off
   while scrolling and off-screen. It sets `animation: none`, not `paused`,
   because a paused animation keeps its compositor layer and still costs a
   composite every frame.
5. **Glows and blurs are pre-rendered images**, not live CSS.
6. **Test by scrolling**, at your real screen size, after every visual change.
