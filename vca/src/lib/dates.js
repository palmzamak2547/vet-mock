// Days are the student's own calendar days: a streak is about when they sat down to study,
// which a UTC date would move to 7 am in Bangkok.

const pad = (n) => String(n).padStart(2, '0');

/** 'YYYY-MM-DD' of a timestamp in the device's time zone. */
export function localDay(ts = Date.now()) {
  const d = new Date(ts);
  return `${d.getFullYear()}-${pad(d.getMonth() + 1)}-${pad(d.getDate())}`;
}

/** Midnight of a 'YYYY-MM-DD' day in the device's time zone. */
export function dayStart(day) {
  const [y, m, d] = String(day).split('-').map(Number);
  return new Date(y, m - 1, d).getTime();
}

/** Whole calendar days from `from` to `to` (both 'YYYY-MM-DD'), negative when `to` is earlier. */
export function daysBetween(from, to) {
  // Noon to noon, so a daylight-saving change never rounds a day away.
  const a = dayStart(from) + 12 * 3600e3;
  const b = dayStart(to) + 12 * 3600e3;
  return Math.round((b - a) / 86400e3);
}

/** The day before a 'YYYY-MM-DD' day. */
export function previousDay(day) {
  const t = new Date(dayStart(day));
  t.setDate(t.getDate() - 1);
  return localDay(t.getTime());
}

export const isDay = (s) => typeof s === 'string' && /^\d{4}-\d{2}-\d{2}$/.test(s) && !Number.isNaN(dayStart(s));
