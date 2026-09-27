// Thai text handling [M1-DESIGN.md 8.2; methods.md 5.2]. Pure: runs in the worker, on the main
// thread and in Node. OWNER: intake role.

const THAI_ZERO = 0x0e50;
const THAI_DIGIT_RE = /[๐-๙]/;
const THAI_DIGIT_RE_G = /[๐-๙]/g;
// Zero-width space, non-joiner, joiner, word joiner and the byte order mark used as a zero-width
// no-break space. They look like nothing and make "ไก่" and "ไก่​" two different categories.
const INVISIBLE_RE_G = /[​‌‍⁠﻿]/g;
// Every run of whitespace (space, tab, no-break space, line breaks inside a quoted cell) becomes one space.
const SPACE_RUN_RE_G = /[\s ]+/g;
// NIKHAHIT + SARA AA typed as two keys instead of SARA AM. NFC keeps both spellings as they are
// (they are not canonically equivalent), so the preview names it and offers a recode rule.
const SPLIT_SARA_AM_RE = /ํา/;

/** Thai digits U+0E50..U+0E59 to Arabic digits; everything else unchanged. */
export function thaiDigitsToArabic(s) {
  if (typeof s !== 'string' || !THAI_DIGIT_RE.test(s)) return s;
  return s.replace(THAI_DIGIT_RE_G, (d) => String(d.charCodeAt(0) - THAI_ZERO));
}

/** True when the string contains a Thai digit. */
export function hasThaiDigit(s) {
  return typeof s === 'string' && THAI_DIGIT_RE.test(s);
}

/** True when the string spells SARA AM as NIKHAHIT + SARA AA (looks identical, compares unequal). */
export function hasSplitSaraAm(s) {
  return typeof s === 'string' && SPLIT_SARA_AM_RE.test(s);
}

/** The SARA AM spelling of a string typed as NIKHAHIT + SARA AA (used to propose a recode, never applied silently). */
export function joinSaraAm(s) {
  return s.replace(/ํา/g, 'ำ');
}

/**
 * NFC (never NFKC: it splits SARA AM), trim, collapse inner whitespace runs, strip zero-width
 * characters (U+200B, U+200C, U+200D, U+FEFF, U+2060). Returns what changed so the preview can say so.
 * @param {string} s
 * @param {{ nfc?: boolean, invisible?: boolean, trim?: boolean }} [opts]  each step on by default
 * @returns {{ value: string, trimmed: boolean, invisible: number, normalized: boolean }}
 *   trimmed is true when leading or trailing space was removed or an inner run was collapsed
 */
export function cleanCell(s, opts = {}) {
  const doNfc = opts.nfc !== false;
  const doInvisible = opts.invisible !== false;
  const doTrim = opts.trim !== false;
  let v = s == null ? '' : String(s);
  let normalized = false;
  if (doNfc) {
    const n = v.normalize('NFC');
    normalized = n !== v;
    v = n;
  }
  let invisible = 0;
  if (doInvisible) {
    v = v.replace(INVISIBLE_RE_G, () => {
      invisible += 1;
      return '';
    });
  }
  let trimmed = false;
  if (doTrim) {
    const t = v.replace(SPACE_RUN_RE_G, ' ').trim();
    trimmed = t !== v;
    v = t;
  }
  return { value: v, trimmed, invisible, normalized };
}

let collator = null;
/** Intl.Collator('th') comparator for category labels. */
export function compareThai(a, b) {
  if (!collator) collator = new Intl.Collator('th');
  return collator.compare(a, b);
}
