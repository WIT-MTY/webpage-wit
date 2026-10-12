# WIT website

Next.js 15 (App Router) + React 19 + TypeScript + Tailwind v4.
Site for WIT (Women in Technology), Tec de Monterrey, Campus Monterrey.

## Source of truth
The Figma file is the design's source of truth. If code and design disagree,
the design wins. Per-page briefs live in `docs/TODO-*.md`. Read the brief for a
page before changing it.

## Language
Site content (UI copy, headings, alt text) is in Spanish, with correct accents.
Everything else is English: code comments, variable names, commit messages, TODOs.

## Content lives in data files, not components
- `lib/site.ts` — nav, socials, email, events, NEXT_EVENT, allies, Lumi's lines,
  motion switches
- `data/members.ts` — team roster, incl. `bio` and `linkedin`
Never hardcode content in a component if it belongs in these files.

## Never invent content
No fake names, numbers, dates, sponsors or metrics, not even as filler. Leave
placeholders or `TODO`. Only Hack4Her's "482 participantes" is a real number.

## Shared files: ask before editing
`app/globals.css`, `components/ui.tsx`, `components/Nav.tsx`,
`components/Footer.tsx`, `components/Lumi.tsx`, `components/RegisterPrompt.tsx`,
`app/layout.tsx`. Other people's pages depend on them.

## Use what exists
`FlipCard`, `CountUp`, `useRegistrationCount`, `Countdown`, `PageHero`,
`PhotoFrame`, `Celestial`, and the primitives in `ui.tsx`. Don't write a second
version of any of these.

## Performance rules (measured, do not undo)
1. Animate only `transform` and `opacity`.
2. Never put `filter: blur()` or `backdrop-filter` on anything that moves, or
   anything sitting over moving content. The nav's backdrop blur cost ~3fps and
   visible stutter; it's a solid translucent fill now.
3. Only small shapes animate; big blurred ones stay still. `SHAPE_MOTION` in
   `lib/site.ts` is off by default.
4. Ambient motion gets `data-ambient` so `MotionGovernor` switches it off while
   scrolling and off-screen. It sets `animation: none`, not `paused`: a paused
   animation keeps its compositor layer and still costs a composite per frame.
5. Glows and blurs are pre-rendered images, not live CSS gradients.

## Accessibility and browser rules
- Every image needs Spanish alt text.
- Respect `prefers-reduced-motion` in anything that moves.
- Keep `<meta name="darkreader-lock">` and `colorScheme: 'dark'` in `layout.tsx`.
  Dark Reader otherwise re-darkens the site and breaks hydration.

## Definition of done
`npm run build` passes, the page matches Figma at 375 / 768 / 1440px, no
invented content, no shared file touched, and I can explain every line.

## Working style
Tell me your plan before making multi-file changes. Small commits with English
messages. Don't install packages without asking.