// Dates on the landing show their era [M1-DESIGN.md 4.3]: "25 ก.ย. พ.ศ. 2569", "25 Sep 2026 CE" (the
// Thai era is written before the year, as Thai writes it).
// ISO dates are read as calendar days in UTC so no time zone can move them. OWNER: landing role.

function utc(iso) {
  const [y, m, d] = iso.split('-').map(Number);
  return new Date(Date.UTC(y, m - 1, d));
}

/**
 * @param {string} iso  YYYY-MM-DD
 * @param {'th'|'en'} lang
 * @param {(key: string, params?: Record<string, string|number>) => string} t
 */
export function formatDate(iso, lang, t) {
  const date = lang === 'th'
    ? `${new Intl.DateTimeFormat('th-TH-u-nu-latn', { day: 'numeric', month: 'short', timeZone: 'UTC' }).format(utc(iso))} พ.ศ. ${utc(iso).getUTCFullYear() + 543}`
    : `${utc(iso).getUTCDate()} ${new Intl.DateTimeFormat('en-US', { month: 'short', timeZone: 'UTC' }).format(utc(iso))} ${utc(iso).getUTCFullYear()}`;
  return t('landing.date', { date });
}

/** Day and month only ("2 เม.ย.", "2 April"). @param {string} iso @param {'th'|'en'} lang */
export function formatDayMonth(iso, lang) {
  return new Intl.DateTimeFormat(lang === 'th' ? 'th-TH-u-nu-latn' : 'en-GB', { day: 'numeric', month: lang === 'th' ? 'short' : 'long', timeZone: 'UTC' }).format(utc(iso));
}

/** The current year in the page's era (Buddhist era for Thai). @param {'th'|'en'} lang */
export function currentYear(lang) {
  const y = new Date().getFullYear();
  return lang === 'th' ? y + 543 : y;
}
