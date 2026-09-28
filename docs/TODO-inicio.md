# Inicio — `app/page.tsx`

Figma: 🖥 Desktop → "Inicio — Desktop" · 📱 Mobile → "Inicio — Mobile"

The page already has the hero, About, activities, WitCode band and CTA. What's
missing is the interaction the client specifically asked for.

## Tasks

- [ ] **Draggable 3D figures (hero).** The client asked that the 3D shapes be
      draggable across the hero. Add pointer dragging to the shapes in
      `components/FloatingShapes.tsx` (a `dragConstraints`-style clamp so they
      stay inside the hero). Rules: `transform` only, disabled under
      `prefers-reduced-motion`, and no dragging on touch devices (it fights
      page scroll).
- [ ] **Typed slogan.** "TECH NEEDS WIT" should type itself out with a blinking
      cursor, then hold. One pass on load, not a loop. Skip the typing under
      `prefers-reduced-motion` and show the finished text.
- [ ] **Interactive logo.** On hover, the sparkle in the mark brightens and a
      soft periwinkle glow follows the cursor across the wordmark. No layout
      shift. Reference: stanfordwomenincomputerscience.com
- [ ] **Photo collage.** Replace the three placeholder rectangles in the About
      section with real photos through `PhotoFrame`. Add files to
      `public/photos/` and fill `COLLAGE_PHOTOS` in `lib/site.ts`.

## Watch out

- Do not add blur to anything that moves. That is what made the first version
  lag. Animate `transform` and `opacity` only.
- Decorative moving things get `data-ambient` so they pause while scrolling
  (see `components/MotionGovernor.tsx`).
