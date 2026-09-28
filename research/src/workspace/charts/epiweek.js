// Date bins for epidemic curves: day, ISO 8601 week (Monday start), month; dates as days since 1970-01-01
// [M2-DESIGN.md 8.2]. Pinned by tests/unit/graphs-epiweek.test.mjs against Python's
// datetime.date.isocalendar(). Pure, calendar arithmetic in UTC days (no time zone can move a date).
// OWNER: graphs role.

const DAY_MS = 86400000;

/** Day of the week, Monday 1 to Sunday 7, of a day number (1970-01-01 was a Thursday). */
export function isoWeekday(days) {
  return ((((days + 3) % 7) + 7) % 7) + 1;
}

/** { year, month (1-12), day } of a day number. */
export function civil(days) {
  const d = new Date(days * DAY_MS);
  return { year: d.getUTCFullYear(), month: d.getUTCMonth() + 1, day: d.getUTCDate() };
}

/** Day number of a calendar date. */
export function dayNumber(year, month, day) {
  return Math.round(Date.UTC(year, month - 1, day) / DAY_MS);
}

/**
 * ISO 8601 week: the week belongs to the year of its Thursday.
 * @param {number} days
 * @returns {{ year: number, week: number }}
 */
export function isoWeek(days) {
  const thursday = days - isoWeekday(days) + 4;
  const year = civil(thursday).year;
  const week = Math.floor((thursday - dayNumber(year, 1, 1)) / 7) + 1;
  return { year, week };
}

/** Monday of the ISO week that holds `days`. */
export function isoWeekStart(days) {
  return days - isoWeekday(days) + 1;
}

function binStart(days, unit) {
  if (unit === 'day') return days;
  if (unit === 'isoWeek') return isoWeekStart(days);
  const c = civil(days);
  return dayNumber(c.year, c.month, 1);
}

function nextStart(start, unit) {
  if (unit === 'day') return start + 1;
  if (unit === 'isoWeek') return start + 7;
  const c = civil(start);
  return c.month === 12 ? dayNumber(c.year + 1, 1, 1) : dayNumber(c.year, c.month + 1, 1);
}

/**
 * Counts per bin from the first to the last date, every bin in between drawn (an empty bin is a zero,
 * not a gap). `start` is the first day of the bin and `end` the first day of the next (half-open).
 * Non-finite entries (missing dates) are skipped; the caller counts them.
 * @param {number[]} days
 * @param {'day'|'isoWeek'|'month'} unit
 * @returns {{ start: number, end: number, count: number }[]}
 */
export function binDates(days, unit) {
  if (!['day', 'isoWeek', 'month'].includes(unit)) throw new Error(`unknown bin ${unit}`);
  const ds = days.filter((d) => Number.isFinite(d)).map((d) => Math.floor(d));
  if (!ds.length) return [];
  const lo = binStart(Math.min(...ds), unit);
  const hi = Math.max(...ds);
  const bins = [];
  const at = new Map();
  for (let s = lo; s <= hi; s = nextStart(s, unit)) {
    at.set(s, bins.length);
    bins.push({ start: s, end: nextStart(s, unit), count: 0 });
    if (bins.length > 20000) throw new Error('too many bins');
  }
  for (const d of ds) bins[at.get(binStart(d, unit))].count += 1;
  return bins;
}

/** ISO date text YYYY-MM-DD of a day number (for tables and file names; never shown as a date alone). */
export function isoDate(days) {
  const c = civil(days);
  return `${String(c.year).padStart(4, '0')}-${String(c.month).padStart(2, '0')}-${String(c.day).padStart(2, '0')}`;
}
