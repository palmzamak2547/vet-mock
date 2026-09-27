// Thai text handling [M1-DESIGN.md 8.2; methods.md 5.2]. OWNER: intake role.

/** Thai digits U+0E50..U+0E59 to Arabic digits; everything else unchanged. */
export function thaiDigitsToArabic(s) { void s; throw new Error('not implemented: intake/thai.thaiDigitsToArabic'); }

/** True when the string contains a Thai digit. */
export function hasThaiDigit(s) { void s; throw new Error('not implemented: intake/thai.hasThaiDigit'); }

/**
 * NFC (never NFKC: it splits SARA AM), trim, collapse inner whitespace runs, strip zero-width
 * characters (U+200B, U+200C, U+200D, U+FEFF, U+2060). Returns what changed so the preview can say so.
 * @param {string} s
 * @returns {{ value: string, trimmed: boolean, invisible: number, normalized: boolean }}
 */
export function cleanCell(s) { void s; throw new Error('not implemented: intake/thai.cleanCell'); }

/** Intl.Collator('th') comparator for category labels. */
export function compareThai(a, b) { void a; void b; throw new Error('not implemented: intake/thai.compareThai'); }
