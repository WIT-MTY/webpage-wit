import { TOUCH_MOTION } from './motion-flags'

/** Touch-first device (no hover, coarse pointer). Desktop and laptops with a mouse never match. */
export const TOUCH_QUERY = '(hover: none) and (pointer: coarse)'

/** True when the touch-only motion should run: a touch device, TOUCH_MOTION on, and no reduced-motion preference. */
export function touchMotion() {
  if (!TOUCH_MOTION) return false
  if (!window.matchMedia(TOUCH_QUERY).matches) return false
  if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) return false
  enableActive()
  return true
}

let activeEnabled = false
/** iOS Safari only applies :active (the tap press) once the page has a touchstart listener. */
function enableActive() {
  if (activeEnabled) return
  activeEnabled = true
  document.addEventListener('touchstart', () => {}, { passive: true })
}
