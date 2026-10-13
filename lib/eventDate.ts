const WEEKDAYS = ['Dom', 'Lun', 'Mar', 'Mié', 'Jue', 'Vie', 'Sáb']
const MONTHS = ['ene', 'feb', 'mar', 'abr', 'may', 'jun', 'jul', 'ago', 'sep', 'oct', 'nov', 'dic']

/** "08:00" → "8:00" */
const shortTime = (hhmm: string) => hhmm.replace(/^0(\d)/, '$1')

/**
 * Formats the event's own local date and time, read straight from the ISO
 * string (e.g. "2026-11-14T08:00:00-06:00"), so it reads the same on the
 * server and in every visitor's browser, whatever their time zone.
 */
export function eventDay(iso: string) {
  const m = iso.match(/^(\d{4})-(\d{2})-(\d{2})T(\d{2}:\d{2})/)
  if (!m) return { day: '', time: '' }
  const [, y, mo, d, time] = m
  const weekday = new Date(Date.UTC(+y, +mo - 1, +d)).getUTCDay()
  return { day: `${WEEKDAYS[weekday]} ${+d} ${MONTHS[+mo - 1]}`, time: shortTime(time) }
}

/** "Sáb 14 nov · 8:00 a 18:00 · Innovation Gym, Tec de Monterrey" */
export function eventWhen(iso: string, endTime: string | null, venue: string | null) {
  const { day, time } = eventDay(iso)
  const hours = endTime ? `${time} a ${shortTime(endTime)}` : time
  return [day, hours, venue].filter(Boolean).join(' · ')
}
