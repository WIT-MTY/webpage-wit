/*
  Kill switches for the bigger motion features. Set one to false and that
  feature renders its plain version; nothing else changes. Handy if one of
  them misbehaves on a device right before an event.
*/

/** Lumi glides between section anchors, leaves a glow trail, tilts toward the cursor and wiggles on clicks. Off: the classic corner Lumi. */
export const LUMI_COMPANION = true

/** Nav logo ×5 in 3 s → Lumi's flight + toast; typing "wit" → confetti. Off: nothing listens. */
export const EASTER_EGG = true

/** Shared glint sweep (hover, focus, first view) and light pointer tilt on cards. Off: plain cards. */
export const SHINE_TILT = true

/** Contáctanos terminal types its command and lines in. Off: the terminal shows everything statically. */
export const TERMINAL_TYPING = true

/** Flip digits on the Próximo evento countdown. Off: the plain countdown cells. */
export const FLIP_COUNTDOWN = true

/** Contáctanos Instagram hero button (rotating ring, live dot, enter flash). Off: a plain pill like LinkedIn. */
export const INSTAGRAM_HERO = true

/** Touch-device motion: scroll reveals, glint on first view, tap press, button ring flash, drifting Contáctanos spotlight. Off: touch devices get the static versions. Desktop never changes. */
export const TOUCH_MOTION = true
