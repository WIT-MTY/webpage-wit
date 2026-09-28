# WitCode — `app/witcode/page.tsx`

Figma: 🖥 Desktop → "WitCode — Desktop" · 📱 Mobile → "WitCode — Mobile"

The page has the content already. The design adds a photo background and turns
two cards into tabs.

## Tasks

- [ ] **Photo background in the hero.** A grid of WitCode photos, heavily
      darkened and blurred, with a purple wash and a fade to the page colour at
      the bottom. This is the one page whose hero uses photos instead of the
      plain background. Pre-blur or use a static blur; do not blur something
      that moves.
- [ ] **Liquid glass tabs.** Propósito / Programa / Impacto become one glass
      card with a tab switcher: a glass pill that slides between the tabs when
      you click. Keyboard accessible (arrow keys move between tabs,
      `role="tablist"`).
- [ ] **Impacto numbers** use `CountUp` (94, 76, 90%).
- [ ] **Cohort photo** with the "Bienvenida WitCode" caption: use `PhotoFrame`
      and add the real photo to `public/photos/`.

## Watch out

- The numbers are real and from 2024. Keep "En cifras totales del 2024" next to
  them so nobody reads them as current.
- The slide animation on the tab pill should be `transform` only.
