/*
  One shared IntersectionObserver for every "do this once when it scrolls
  into view" effect (Reveal, ShineCard's glint, RingPulse, CountUp, the touch
  glint on member cards). One observer instead of one per element.

  `ratio` is how much of the element must be visible (0 = any part).
  The callback runs once, then the element is unobserved.
*/
const THRESHOLDS = [0, 0.15, 0.4, 0.6, 1]

type Watch = { ratio: number; cb: () => void }

let io: IntersectionObserver | null = null
const watches = new Map<Element, Watch[]>()

function observer() {
  if (io) return io
  io = new IntersectionObserver(
    (entries) => {
      for (const entry of entries) {
        if (!entry.isIntersecting) continue
        const list = watches.get(entry.target)
        if (!list) continue
        // 0.99: a fully visible element can report 0.999… after rounding.
        const due = list.filter((w) => entry.intersectionRatio >= Math.min(w.ratio, 0.99))
        if (!due.length) continue
        const rest = list.filter((w) => !due.includes(w))
        if (rest.length) watches.set(entry.target, rest)
        else {
          watches.delete(entry.target)
          io?.unobserve(entry.target)
        }
        due.forEach((w) => w.cb())
      }
    },
    { threshold: THRESHOLDS },
  )
  return io
}

/** Runs `cb` once, the first time `ratio` of `el` is on screen. Returns a cleanup. */
export function onceInView(el: Element, cb: () => void, ratio = 0): () => void {
  const watch: Watch = { ratio, cb }
  const list = watches.get(el)
  if (list) list.push(watch)
  else watches.set(el, [watch])
  // Re-observing makes the observer report the current state for the new watch.
  observer().unobserve(el)
  observer().observe(el)
  return () => {
    const current = watches.get(el)?.filter((w) => w !== watch)
    if (current?.length) watches.set(el, current)
    else {
      watches.delete(el)
      io?.unobserve(el)
    }
  }
}
