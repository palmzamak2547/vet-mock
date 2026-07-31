// ============================================================
// thai-text — truncation that doesn't break Thai
// ============================================================
// `str.slice(0, n)` counts UTF-16 code units, which is the wrong unit for
// Thai. Thai writes a syllable as a base consonant plus marks that sit
// before, above, below or after it, and slicing lands in the middle of
// those clusters. The chip on the home screen was the visible case:
//
//   ชำระค่าเล่าเรียน ผ่านแอป CUNEX   .slice(0, 22)
//   ชำระค่าเล่าเรียน ผ่านแ…
//
// The cut fell between แ and อ. แ is a LEADING vowel — it is typed before
// its consonant but pronounced after it — so on its own it has nothing to
// attach to and reads as a rendering fault rather than an abbreviation.
//
// Two rules fix every case we hit:
//   1. never end on a leading vowel (เ แ โ ใ ไ) — back up past it
//   2. never cut a base character away from the marks that belong to it —
//      if the first dropped character is a combining mark, back up past
//      its base too
//
// This is not a full grapheme segmenter. Intl.Segmenter would be, but it
// still can't find Thai WORD boundaries without a dictionary (Thai has no
// spaces between words), so a "smarter" version would not read better —
// it would just be slower. These two rules remove the broken-glyph case,
// which is the whole complaint.
// ============================================================

// เ แ โ ใ ไ — typed before the consonant they attach to.
const LEADING_VOWELS = /[เ-ไ]/;

// Marks that attach to a preceding base: ั, ิ-ฺ (upper/lower vowels,
// tone marks, phinthu), and ็-๎ (maitaikhu through yamakkan).
const COMBINING = /[ัิ-ฺ็-๎]/;

/**
 * Truncate to at most `max` characters, adding an ellipsis, without
 * leaving an orphaned Thai vowel or splitting a mark from its base.
 * Returns the string unchanged when it already fits.
 */
export function truncateThai(str, max, ellipsis = '…') {
  const s = String(str ?? '');
  if (max <= 0) return '';
  if (s.length <= max) return s;

  let cut = max;
  // Don't strip a combining mark off a base we're keeping — drop the base too.
  while (cut > 0 && COMBINING.test(s[cut])) cut -= 1;
  // Don't end on a leading vowel; it has no consonant to sit before.
  while (cut > 0 && LEADING_VOWELS.test(s[cut - 1])) cut -= 1;
  // Tidy a trailing space left behind by the backtracking.
  while (cut > 0 && s[cut - 1] === ' ') cut -= 1;

  // Backtracking should never eat the whole string; if it somehow does,
  // fall back to the naive cut rather than rendering an empty chip.
  if (cut === 0) return s.slice(0, max) + ellipsis;
  return s.slice(0, cut) + ellipsis;
}
