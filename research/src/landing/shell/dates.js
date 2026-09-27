// Dates on the landing show their era [M1-DESIGN.md 4.3]: "25 ก.ย. 2569 (พ.ศ.)", "25 Sep 2026 CE".
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
    ? new Intl.DateTimeFormat('th-TH-u-ca-buddhist-nu-latn', { day: 'numeric', month: 'short', year: 'numeric', timeZone: 'UTC' }).format(utc(iso))
    : `${utc(iso).getUTCDate()} ${new Intl.DateTimeFormat('en-US', { month: 'short', timeZone: 'UTC' }).format(utc(iso))} ${utc(iso).getUTCFullYear()}`;
  return t('landing.date', { date: date.replace(/^(\D*)พ\.ศ\.\s*/, '$1') });
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
