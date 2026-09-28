# Proyectos — `app/proyectos/page.tsx`

Figma: 🖥 Desktop → "Proyectos — Desktop", "Proyectos — Next Event States",
"Proyectos — Flipped Card (Impact)" · 📱 Mobile → "Proyectos — Mobile"

This is the biggest rebuild. The page currently shows four static activity
cards; the design replaces them with a countdown panel and flip cards.

## Tasks

- [ ] **"Próximo evento" panel.** Blurred event photo behind, event name,
      where/when, the live registration count, and the big gradient
      "En N días". Two buttons: **Registrarme** (primary, opens
      `formUrl` in a new tab) and **Conoce más** (scrolls to that event's card).
      Data: `NEXT_EVENT` and `nextEvent()` in `lib/site.ts`.
- [ ] **Three panel states** (see the states board in Figma):
      1. registration open (default)
      2. `registrationOpen: false` → hide Registrarme, make Conoce más primary,
         grey dot, add a "Registro cerrado" tag
      3. `NEXT_EVENT === null` → "Estamos preparando lo que sigue", single
         Instagram button, countdown shows "Pronto"
- [ ] **Live count.** Use `useRegistrationCount(NEXT_EVENT.countUrl)`. Shows
      "—" while loading or if it fails. Green dot = live.
- [ ] **Event flip cards.** One card per entry in `EVENTS`. Front: category,
      title, description, photo carousel, sign-up button (only when `formUrl`
      exists), and the Impacto / Patrocinadores buttons. Backs: three metrics
      using `CountUp`, and a sponsor logo grid. Build it with
      `components/FlipCard.tsx`.
- [ ] **Carousel.** Desktop: centered card with neighbours peeking and
      arrows + dots. Mobile: horizontal scroll with scroll-snap, one card
      visible and the next peeking ~24px.
- [ ] **Deep links.** `/proyectos#<slug>` must scroll to that event's card and
      pulse it once (periwinkle ring, ~600ms). The mobile register prompt and
      the "Conoce más" button both rely on this.
- [ ] Mobile layout for the card: photo on top, content below. Same component
      with `md:` classes, not a second component.

## Watch out

- Never invent metrics. Only Hack4Her's 482 participantes is real; everything
  else stays "—".
- Both faces of a flip card are always rendered, which is what keeps heights
  equal. Don't "optimize" that away.
