# Aliados — `app/aliados/page.tsx`

Figma: 🖥 Desktop → "Aliados — Desktop" · 📱 Mobile → "Aliados — Mobile"

## Tasks

- [ ] **Aliados actuales.** Circular logo chips from `ALLIES` where
      `current: true`. Greyscale until hover. Empty slots show a dashed circle
      with "Próximamente".
- [ ] **Past allies wall.** Two rows of logos scrolling slowly in opposite
      directions, fading out at both edges, paused on hover or touch. Fed by
      `ALLIES` where `current: false`.
- [ ] **Formas de colaborar.** Three cards. Already close to the design, check
      spacing against Figma.
- [ ] **"¿Quieres ser patrocinador?"** replaces the generic collaborate CTA on
      this page only.
- [ ] Logos go in `public/aliados/` and get referenced from `ALLIES`.

## Watch out

- The scrolling rows are the one marquee we allow, because the logos are small
  and there is no blur. Animate `transform` only, add `data-ambient` so it
  pauses while scrolling, and keep it off under `prefers-reduced-motion`.
- Never invent a sponsor. If we don't have the logo or permission, leave the
  slot as "Próximamente".
