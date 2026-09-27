// Dates, including Buddhist Era [M1-DESIGN.md 8.2; methods.md 5.3]. Stored as days since
// 1970-01-01 in the proleptic Gregorian calendar (CE); displayed with the era named. Never
// new Date(string); never local time. OWNER: intake role.

/**
 * Inspect a column's text values and propose how to read them. Never decides silently: the result
 * is shown in the preview and confirmed by the student (G26).
 * @param {string[]} values
 * @returns {{ order: 'dmy'|'mdy'|'ymd'|null, era: 'BE'|'CE'|null, twoDigitYears: number, evidence: { key: string, params: Object }[], confident: boolean }}
 *   order is settled only when some value has a day above 12; era 'BE' when four-digit years fall in 2400..2700
 */
export function sniffDates(values) { void values; throw new Error('not implemented: intake/dates.sniffDates'); }

/**
 * Parse one value under a confirmed rule. 29 February exists in BE 2567 (CE 2024) but not in "2567"
 * read as CE: the rule decides which calendar the day is checked in.
 * @param {string} value
 * @param {{ order: 'dmy'|'mdy'|'ymd', era: 'BE'|'CE', twoDigitCentury: number }} rule  e.g. twoDigitCentury 2500 reads "69" as BE 2569
 * @returns {{ days: number } | { invalid: string }}   invalid carries an i18n key
 */
export function parseDate(value, rule) { void value; void rule; throw new Error('not implemented: intake/dates.parseDate'); }

/**
 * Excel serial to days since 1970-01-01 (1900 system with the Lotus leap-year bug, or 1904 system).
 * @param {number} serial @param {'1900'|'1904'} system @returns {number}
 */
export function excelSerialToDays(serial, system) { void serial; void system; throw new Error('not implemented: intake/dates.excelSerialToDays'); }

/** Whole months from birth to event, as numbers.json computes age (month difference minus one when the day has not come). */
export function monthsBetween(birthDays, eventDays) { void birthDays; void eventDays; throw new Error('not implemented: intake/dates.monthsBetween'); }

/**
 * Display a date with its era named. th: '25 ก.ย. 2569' with era label 'พ.ศ.'; en: '25 Sep 2026' with 'CE'.
 * @param {number} days @param {'th'|'en'} lang @returns {string}
 */
export function formatDate(days, lang) { void days; void lang; throw new Error('not implemented: intake/dates.formatDate'); }
