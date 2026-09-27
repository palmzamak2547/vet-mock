// Dates, including Buddhist Era [M1-DESIGN.md 8.2; methods.md 5.3]. Stored as days since
// 1970-01-01 in the proleptic Gregorian calendar (CE); displayed with the era named. Never
// new Date(string); never local time. OWNER: intake role.
import { thaiDigitsToArabic } from './thai.js';

// ---------------------------------------------------------------- civil calendar arithmetic
// Howard Hinnant's days_from_civil / civil_from_days: exact for every proleptic Gregorian date.

/** @param {number} y @param {number} m 1..12 @param {number} d @returns {number} days since 1970-01-01 */
export function daysFromCivil(y, m, d) {
  const yy = m <= 2 ? y - 1 : y;
  const era = Math.floor(yy / 400);
  const yoe = yy - era * 400;
  const doy = Math.floor((153 * (m + (m > 2 ? -3 : 9)) + 2) / 5) + d - 1;
  const doe = yoe * 365 + Math.floor(yoe / 4) - Math.floor(yoe / 100) + doy;
  return era * 146097 + doe - 719468;
}

/** @param {number} days @returns {[number, number, number]} [year CE, month 1..12, day] */
export function civilFromDays(days) {
  const z = Math.floor(days) + 719468;
  const era = Math.floor(z / 146097);
  const doe = z - era * 146097;
  const yoe = Math.floor((doe - Math.floor(doe / 1460) + Math.floor(doe / 36524) - Math.floor(doe / 146096)) / 365);
  const doy = doe - (365 * yoe + Math.floor(yoe / 4) - Math.floor(yoe / 100));
  const mp = Math.floor((5 * doy + 2) / 153);
  const d = doy - Math.floor((153 * mp + 2) / 5) + 1;
  const m = mp + (mp < 10 ? 3 : -9);
  return [yoe + era * 400 + (m <= 2 ? 1 : 0), m, d];
}

export const isLeapYear = (y) => (y % 4 === 0 && y % 100 !== 0) || y % 400 === 0;
export const daysInMonth = (y, m) => [31, isLeapYear(y) ? 29 : 28, 31, 30, 31, 30, 31, 31, 30, 31, 30, 31][m - 1];

/**
 * BE year to CE year for a given month. Before 1 January 1941 (BE 2484) the Thai year began on
 * 1 April, so January to March of BE years up to 2483 are 542 years ahead, not 543 (methods.md 5.3).
 */
export function beToCe(beYear, month) {
  return beYear < 2484 && month <= 3 ? beYear - 542 : beYear - 543;
}
export function ceToBe(ceYear, month) {
  return ceYear < 1941 && month <= 3 ? ceYear + 542 : ceYear + 543;
}

/** @param {number} days @returns {string} 'YYYY-MM-DD' (CE) */
export function isoFromDays(days) {
  const [y, m, d] = civilFromDays(days);
  const ys = y < 0 ? '-' + String(-y).padStart(4, '0') : String(y).padStart(4, '0');
  return `${ys}-${String(m).padStart(2, '0')}-${String(d).padStart(2, '0')}`;
}

// ---------------------------------------------------------------- month names

const TH_ABBR = ['ม.ค.', 'ก.พ.', 'มี.ค.', 'เม.ย.', 'พ.ค.', 'มิ.ย.', 'ก.ค.', 'ส.ค.', 'ก.ย.', 'ต.ค.', 'พ.ย.', 'ธ.ค.'];
const TH_FULL = ['มกราคม', 'กุมภาพันธ์', 'มีนาคม', 'เมษายน', 'พฤษภาคม', 'มิถุนายน', 'กรกฎาคม', 'สิงหาคม', 'กันยายน', 'ตุลาคม', 'พฤศจิกายน', 'ธันวาคม'];
const EN_ABBR = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];
const EN_FULL = ['january', 'february', 'march', 'april', 'may', 'june', 'july', 'august', 'september', 'october', 'november', 'december'];

const MONTHS = new Map();
TH_ABBR.forEach((s, i) => MONTHS.set(s.replace(/[.\s]/g, ''), i + 1));
TH_FULL.forEach((s, i) => MONTHS.set(s, i + 1));
EN_ABBR.forEach((s, i) => MONTHS.set(s.toLowerCase(), i + 1));
EN_FULL.forEach((s, i) => MONTHS.set(s, i + 1));
MONTHS.set('sept', 9);

/** @param {string} word @returns {number|null} month 1..12 from a Thai or English month name or abbreviation */
export function monthFromName(word) {
  const k = word.normalize('NFC').replace(/[.\s]/g, '').toLowerCase();
  return MONTHS.get(k) ?? null;
}

// ---------------------------------------------------------------- shapes

const TIME_SUFFIX = /(?:[T\s]+\d{1,2}:\d{2}(?::\d{2}(?:\.\d+)?)?)?$/;
const NUMERIC_DATE = /^(\d{1,4})[/\-.](\d{1,2})[/\-.](\d{1,4})$/;
const DAY_NAME_YEAR = /^(\d{1,2})[\s\-]+([^\d\s\-,]+)[\s\-,]+(\d{2}|\d{4})$/u;
const NAME_DAY_YEAR = /^([A-Za-z]+)\.?\s+(\d{1,2}),?\s+(\d{2}|\d{4})$/;
const SERIAL = /^\d{1,6}(\.\d+)?$/;
const EXCEL_DATE_ID_DM = /^(\d{1,2})-([^\d\s\-]+)$/u;
const EXCEL_DATE_ID_MD = /^([A-Za-z]{3,4})-(\d{1,2})$/;

/**
 * Break one value into date parts without deciding anything.
 * @param {string} value
 * @returns {null | { shape: 'numeric'|'ymd'|'name', a: number, b: number, year: number, yearDigits: number, month?: number, time: boolean }}
 *   numeric: a/b are the first two numbers (order decides which is the day); ymd: a = month, b = day;
 *   name: a = day, month known
 */
export function dateParts(value) {
  if (typeof value !== 'string') return null;
  let s = thaiDigitsToArabic(value.trim());
  if (!s) return null;
  const tm = s.match(TIME_SUFFIX);
  let time = false;
  if (tm && tm[0] && tm.index > 0) {
    time = true;
    s = s.slice(0, tm.index).trim();
  }
  let m = s.match(NUMERIC_DATE);
  if (m) {
    if (m[1].length === 4) return { shape: 'ymd', a: +m[2], b: +m[3], year: +m[1], yearDigits: 4, time };
    if (m[3].length !== 2 && m[3].length !== 4) return null;
    return { shape: 'numeric', a: +m[1], b: +m[2], year: +m[3], yearDigits: m[3].length, time };
  }
  m = s.match(DAY_NAME_YEAR);
  if (m) {
    const month = monthFromName(m[2]);
    if (month) return { shape: 'name', a: +m[1], b: 0, month, year: +m[3], yearDigits: m[3].length, time };
  }
  m = s.match(NAME_DAY_YEAR);
  if (m) {
    const month = monthFromName(m[1]);
    if (month) return { shape: 'name', a: +m[2], b: 0, month, year: +m[3], yearDigits: m[3].length, time };
  }
  return null;
}

/**
 * An ID that Excel turned into a date ("4-7" typed, "7-Apr" shown). Returns the day and month Excel
 * read, or null.
 * @param {string} value @returns {{ day: number, month: number } | null}
 */
export function excelDateIdParts(value) {
  if (typeof value !== 'string') return null;
  const s = thaiDigitsToArabic(value.trim());
  let m = s.match(EXCEL_DATE_ID_DM);
  if (m) {
    const month = monthFromName(m[2]);
    if (month && +m[1] >= 1 && +m[1] <= 31) return { day: +m[1], month };
  }
  m = s.match(EXCEL_DATE_ID_MD);
  if (m) {
    const month = monthFromName(m[1]);
    if (month && +m[2] >= 1 && +m[2] <= 31) return { day: +m[2], month };
  }
  return null;
}

// ---------------------------------------------------------------- sniffing

const inBE = (y) => y >= 2400 && y <= 2700;
const inCE = (y) => y >= 1800 && y <= 2200;

/**
 * Inspect a column's text values and propose how to read them. Never decides silently: the result
 * is shown in the preview and confirmed by the student (G26).
 * @param {string[]} values
 * @returns {{ order: 'dmy'|'mdy'|'ymd'|null, era: 'BE'|'CE'|null, twoDigitYears: number, evidence: { key: string, params: Object }[], confident: boolean,
 *   matched: number, total: number, fourDigit: { be: number, ce: number, other: number }, feb29: null | { count: number, example: string, validAsBE: number, validAsCE: number },
 *   twoDigitExample: string|null, orderConflict: boolean, timeParts: number, numeric: number, ymd: number, ymdBE: number }}
 *   fourDigit counts d/m/y and month-name values only (the era question decides them); ymd counts
 *   ISO-shaped values, which are CE by definition, and ymdBE the ones with a BE year
 *   numeric counts values written as numbers only (d/m/y or m/d/y), the ones the order question decides
 *   order is settled only when some value has a day above 12; era 'BE' when four-digit years fall in 2400..2700.
 *   matched counts values that look like dates; total counts non-empty values.
 */
export function sniffDates(values) {
  let matched = 0;
  let total = 0;
  let firstAbove12 = null;
  let secondAbove12 = null;
  let ymd = 0;
  let numeric = 0;
  let twoDigitYears = 0;
  let twoDigitExample = null;
  let timeParts = 0;
  let ymdBE = 0;
  const fourDigit = { be: 0, ce: 0, other: 0 };
  const feb29 = { count: 0, example: '', validAsBE: 0, validAsCE: 0 };
  for (const v of values) {
    if (v == null || String(v).trim() === '') continue;
    total += 1;
    const p = dateParts(String(v));
    if (!p) continue;
    matched += 1;
    if (p.time) timeParts += 1;
    if (p.shape === 'ymd') ymd += 1;
    if (p.shape === 'numeric') {
      numeric += 1;
      if (p.a > 12 && p.b <= 12 && firstAbove12 === null) firstAbove12 = String(v).trim();
      if (p.b > 12 && p.a <= 12 && secondAbove12 === null) secondAbove12 = String(v).trim();
    }
    if (p.yearDigits === 2) {
      twoDigitYears += 1;
      if (twoDigitExample === null) twoDigitExample = String(v).trim();
    } else if (p.shape === 'ymd') {
      // ISO dates (what spreadsheet date cells become) are CE; a year in 2400..2700 is a BE year typed into a date cell
      if (inBE(p.year)) ymdBE += 1;
    } else if (inBE(p.year)) fourDigit.be += 1;
    else if (inCE(p.year)) fourDigit.ce += 1;
    else fourDigit.other += 1;
    // 29 February with a four-digit year: which calendar makes it exist?
    let day;
    let month;
    if (p.shape === 'ymd') { month = p.a; day = p.b; }
    else if (p.shape === 'name') { month = p.month; day = p.a; }
    else if (p.a === 29 && p.b === 2) { day = 29; month = 2; }
    else if (p.a === 2 && p.b === 29) { day = 29; month = 2; }
    if (day === 29 && month === 2 && p.yearDigits === 4) {
      feb29.count += 1;
      if (!feb29.example) feb29.example = String(v).trim();
      if (isLeapYear(beToCe(p.year, 2))) feb29.validAsBE += 1;
      if (isLeapYear(p.year)) feb29.validAsCE += 1;
    }
  }
  const evidence = [];
  let order = null;
  const orderConflict = firstAbove12 !== null && secondAbove12 !== null;
  if (numeric === 0 && ymd > 0) order = 'ymd';
  else if (orderConflict) evidence.push({ key: 'intake.date.evidence.orderConflict', params: { dmy: firstAbove12, mdy: secondAbove12 } });
  else if (firstAbove12 !== null) { order = 'dmy'; evidence.push({ key: 'intake.date.evidence.dayFirst', params: { example: firstAbove12 } }); }
  else if (secondAbove12 !== null) { order = 'mdy'; evidence.push({ key: 'intake.date.evidence.monthFirst', params: { example: secondAbove12 } }); }
  else if (numeric > 0) evidence.push({ key: 'intake.date.evidence.orderUnsettled', params: {} });

  let era = null;
  if (fourDigit.be > 0 && fourDigit.ce === 0) {
    era = 'BE';
    evidence.push({ key: 'intake.date.evidence.beYears', params: { count: fourDigit.be } });
  } else if (fourDigit.ce > 0 && fourDigit.be === 0) {
    era = 'CE';
    evidence.push({ key: 'intake.date.evidence.ceYears', params: { count: fourDigit.ce } });
  } else if (fourDigit.ce > 0 && fourDigit.be > 0) {
    evidence.push({ key: 'intake.date.evidence.mixedEra', params: { be: fourDigit.be, ce: fourDigit.ce } });
  }
  if (feb29.count > 0) {
    if (feb29.validAsBE === feb29.count && feb29.validAsCE === 0) evidence.push({ key: 'intake.date.evidence.feb29OnlyBE', params: { example: feb29.example, count: feb29.count } });
    else if (feb29.validAsCE === feb29.count && feb29.validAsBE === 0) evidence.push({ key: 'intake.date.evidence.feb29OnlyCE', params: { example: feb29.example, count: feb29.count } });
  }
  if (twoDigitYears > 0) evidence.push({ key: 'intake.date.evidence.twoDigit', params: { count: twoDigitYears, example: twoDigitExample } });
  const confident = order !== null && era !== null && twoDigitYears === 0 && !orderConflict;
  return {
    order: /** @type {any} */ (order), era: /** @type {any} */ (era), twoDigitYears, evidence, confident, matched, total, fourDigit,
    feb29: feb29.count ? feb29 : null, twoDigitExample, orderConflict, timeParts, numeric, ymd, ymdBE,
  };
}

// ---------------------------------------------------------------- parsing

/**
 * Parse one value under a confirmed rule. 29 February exists in BE 2567 (CE 2024) but not in "2567"
 * read as CE: the rule decides which calendar the day is checked in.
 * ISO-shaped values (YYYY-MM-DD, what a spreadsheet date cell becomes) are CE unless the year is in
 * 2400..2700, which means a BE year typed into a CE date cell; they ignore rule.era.
 * @param {string} value
 * @param {{ order: 'dmy'|'mdy'|'ymd'|null, era: 'BE'|'CE'|'mixed'|null, twoDigitCentury?: number|null, excelSystem?: '1900'|'1904'|null }} rule
 *   twoDigitCentury e.g. 2500 reads "69" as BE 2569, 2000 reads it as CE 2069; 'mixed' reads years
 *   from 2400 as BE and the rest as CE; excelSystem reads plain serial numbers as Excel dates
 * @returns {{ days: number, ceYear: number, time: boolean } | { invalid: string }}   invalid carries an i18n key
 */
export function parseDate(value, rule) {
  const raw = typeof value === 'string' ? value.trim() : String(value ?? '').trim();
  if (!raw) return { invalid: 'intake.date.invalid.empty' };
  const ascii = thaiDigitsToArabic(raw);
  if (rule.excelSystem && SERIAL.test(ascii)) {
    const days = excelSerialToDays(Number(ascii), rule.excelSystem);
    if (!Number.isFinite(days)) return { invalid: 'intake.date.invalid.serial' };
    return { days, ceYear: civilFromDays(days)[0], time: ascii.includes('.') };
  }
  const p = dateParts(raw);
  if (!p) return { invalid: 'intake.date.invalid.format' };
  let day;
  let month;
  if (p.shape === 'ymd') { month = p.a; day = p.b; }
  else if (p.shape === 'name') { month = p.month; day = p.a; }
  else {
    if (!rule.order || rule.order === 'ymd') return { invalid: 'intake.date.invalid.orderUnanswered' };
    if (rule.order === 'dmy') { day = p.a; month = p.b; } else { month = p.a; day = p.b; }
  }
  if (!(month >= 1 && month <= 12)) return { invalid: 'intake.date.invalid.month' };
  let ceYear;
  if (p.yearDigits === 2) {
    const c = rule.twoDigitCentury;
    if (c == null) return { invalid: 'intake.date.invalid.twoDigitUnanswered' };
    const y = c + p.year;
    ceYear = c >= 2400 ? beToCe(y, month) : y;
  } else if (p.shape === 'ymd') {
    ceYear = inBE(p.year) ? beToCe(p.year, month) : p.year;
  } else {
    const era = rule.era === 'mixed' ? (inBE(p.year) ? 'BE' : 'CE') : rule.era;
    if (!era) return { invalid: 'intake.date.invalid.eraUnanswered' };
    ceYear = era === 'BE' ? beToCe(p.year, month) : p.year;
  }
  if (!(day >= 1 && day <= daysInMonth(ceYear, month))) return { invalid: day === 29 && month === 2 ? 'intake.date.invalid.feb29' : 'intake.date.invalid.day' };
  return { days: daysFromCivil(ceYear, month, day), ceYear, time: p.time };
}

/**
 * Excel serial to days since 1970-01-01 (1900 system with the Lotus leap-year bug, or 1904 system).
 * The time of day (the fraction) is dropped. Serial 60 in the 1900 system is 29 February 1900, a day
 * that never existed: it returns NaN, as does anything below 1 (1900) or below 0 (1904).
 * @param {number} serial @param {'1900'|'1904'} system @returns {number}
 */
export function excelSerialToDays(serial, system) {
  if (!Number.isFinite(serial)) return NaN;
  const whole = Math.floor(serial);
  if (system === '1904') return whole < 0 ? NaN : whole - 24107;
  if (whole < 1 || whole === 60) return NaN;
  // 25569 = serial of 1970-01-01 once the phantom 1900-02-29 is counted; before it, one day less.
  return whole > 60 ? whole - 25569 : whole - 25568;
}

/** Whole months from birth to event, as numbers.json computes age (month difference minus one when the day has not come). */
export function monthsBetween(birthDays, eventDays) {
  if (!Number.isFinite(birthDays) || !Number.isFinite(eventDays)) return NaN;
  const [by, bm, bd] = civilFromDays(birthDays);
  const [ey, em, ed] = civilFromDays(eventDays);
  return (ey - by) * 12 + (em - bm) - (ed < bd ? 1 : 0);
}

/**
 * Display a date with its era named: th '25 ก.ย. 2569 (พ.ศ.)', en '25 Sep 2026 CE' (M1-DESIGN.md 4.3).
 * @param {number} days @param {'th'|'en'} lang @returns {string}
 */
export function formatDate(days, lang) {
  if (!Number.isFinite(days)) return '—';
  const [y, m, d] = civilFromDays(days);
  if (lang === 'th') return `${d} ${TH_ABBR[m - 1]} ${ceToBe(y, m)} (พ.ศ.)`;
  return `${d} ${EN_ABBR[m - 1]} ${y} CE`;
}
