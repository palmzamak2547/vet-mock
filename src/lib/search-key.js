// @ts-check
// One folding rule for every search box in the app. The same word stored or
// typed in two forms is still one word: a key is the text in NFC, without
// zero-width characters or soft hyphens (PDF exports and LINE pastes carry
// them, and they sit inside names in the faculty data), with a decomposed
// sara am (NIKHAHIT, an optional tone mark, SARA AA) written as the one
// character a keyboard types, Thai digits as 0-9, in lower case, with every
// run of space as one space. Tone marks stay: "ไก่" and "ไก" are two words.
// The PDF reader's matcher (thai-search.js) does the same folding with an
// index map back to the page; this is the cheap form for lists.

const ZERO_WIDTH = /[\u200B-\u200D\u2060\uFEFF\u00AD]/g;
const DECOMPOSED_SARA_AM = /\u0E4D([\u0E48-\u0E4B]?)\u0E32/g;
const THAI_DIGIT = /[\u0E50-\u0E59]/g;

/** @param {unknown} text */
export function searchKey(text) {
  return String(text ?? '')
    .normalize('NFC')
    .replace(ZERO_WIDTH, '')
    .replace(DECOMPOSED_SARA_AM, '$1\u0E33')
    .replace(THAI_DIGIT, (d) => String(d.charCodeAt(0) - 0x0E50))
    .toLowerCase()
    .replace(/\s+/g, ' ')
    .trim();
}

/** The words of a query, each folded; every one must be found. @param {unknown} query */
export function searchTerms(query) {
  const key = searchKey(query);
  return key ? key.split(' ') : [];
}

/** @param {string} hayKey a searchKey() of the haystack @param {string[]} terms */
export function matchesAll(hayKey, terms) {
  for (const term of terms) if (!hayKey.includes(term)) return false;
  return true;
}
