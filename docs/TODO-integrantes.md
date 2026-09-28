# Integrantes — `app/integrantes/page.tsx`

Figma: 🖥 Desktop → "Integrantes — Desktop", "Integrantes — Area Selected
(Software)" · 📱 Mobile → "Integrantes — Mobile"

The filters already work (`components/TeamExplorer.tsx`). The design adds the
"where are they now" flip and two button states.

## Tasks

- [ ] **"¿Dónde está hoy?" flip.** Each member card gets a small link at the
      bottom. Clicking flips the card to a back side with: small star, name,
      role, a "Dónde está hoy" label, the member's `bio`, an optional LinkedIn
      link, and "← Volver". Build it with `components/FlipCard.tsx`.
- [ ] **Two button states.**
      - `bio` present → periwinkle text, glowing dot, arrow, clickable
      - `bio` missing → muted grey, hollow dot, no arrow, `aria-disabled`,
        never flips
      In code: `const hasBio = Boolean(member.bio)`. This also lets us see at a
      glance whose bio is still missing.
- [ ] **Mobile:** two cards per row, area chips scroll horizontally with
      scroll-snap and an edge fade.
- [ ] **Únete section:** already built. Check it against Figma and wire
      `APPLICATIONS_OPEN` when Kat has the date.

## Watch out

- All names are placeholders ("Nombre Apellido"). Don't replace them with real
  or invented names; Kat will paste the roster into `data/members.ts`.
- Bios are written by the members themselves, max ~280 characters, so cards
  stay a similar height.
