// ============================================================
// thai-search — finding Thai text in a PDF, accurately
// ============================================================
//
// Searching a Thai lecture deck fails in ways an English-only matcher never
// meets, and every one of these is a real thing that happens in the decks on
// this shelf:
//
//  1. pdf.js hands back a page as a list of text RUNS, and it splits Thai
//     lines wherever the font changes or the renderer moved the pen — which is
//     routinely mid-word. Join the runs with a space and "การวินิจฉัย" is
//     stored as "การวินิจ ฉัยโรค", so searching for วินิจฉัย finds nothing.
//     Join them with nothing and English words fuse instead. Both are wrong,
//     so the haystack is folded per-script.
//
//  2. Thai has no spaces between words, so an exported line frequently carries
//     ZERO-WIDTH SPACE (U+200B) as a word-break hint. It is invisible and it
//     breaks an exact match.
//
//  3. สระอำ is one codepoint (U+0E33) or two (U+0E4D + U+0E32) depending on
//     the exporter, and NFC does not merge them. The same word then exists in
//     two forms that do not compare equal.
//
//  4. Thai digits ๐-๙ and Arabic digits are the same number to a reader.
//
//  5. Tone marks and some vowels are the commonest typing slips. An exact
//     match is right to try first, but coming back with nothing when the only
//     difference is a ้ is a worse answer than finding it and saying so.
//
// The matcher therefore folds both sides, keeps an index map back to the
// original text so the quote it shows is real, and falls back to a
// tone-insensitive pass ONLY when the exact pass found nothing — labelled, so
// the reader knows which one answered.

const ZERO_WIDTH = /[​-‏⁠﻿­]/g;
// Thai above/below vowels, tone marks and thanthakhat — the marks that a
// reader hears as the same word and a keyboard gets wrong.
//
// NOT global: a /g regex keeps `lastIndex` between calls, so `.test()` on the
// same pattern alternates true and false as it walks a string. That is what
// made a tone-insensitive search miss — every other mark was let through.
const THAI_MARKS = /[ัิ-ฺ็-๎]/;
const THAI_CHAR = /[฀-๿]/;

const THAI_DIGITS = { '๐': '0', '๑': '1', '๒': '2', '๓': '3', '๔': '4', '๕': '5', '๖': '6', '๗': '7', '๘': '8', '๙': '9' };

export function hasThai(s) { return THAI_CHAR.test(String(s || '')); }

/** Normalises one character-worth of text the same way on both sides. */
function foldChar(ch, { dropMarks }) {
  if (THAI_DIGITS[ch]) return THAI_DIGITS[ch];
  if (dropMarks && THAI_MARKS.test(ch)) return '';
  return ch.toLowerCase();
}

/**
 * Folds `text` for matching and returns the folded string together with a map
 * from each folded index back to the index in the ORIGINAL text.
 *
 * `dropSpaces` removes whitespace entirely, which is correct when the query is
 * Thai (a Thai word never contains a space, so any space in the haystack is an
 * artefact of how the PDF was cut into runs) and wrong when it is not (English
 * "the cat" must not match "theca t").
 */
export function fold(text, { dropSpaces = false, dropMarks = false } = {}) {
  const src = String(text || '')
    .normalize('NFC')
    // Decomposed สระอำ -> the single codepoint, before anything else looks at it.
    .replace(/ํา/g, 'ำ')
    .replace(ZERO_WIDTH, '');
  let out = '';
  const map = [];
  for (let i = 0; i < src.length; i++) {
    const ch = src[i];
    if (dropSpaces && /\s/.test(ch)) continue;
    const folded = foldChar(ch, { dropMarks });
    for (let k = 0; k < folded.length; k++) { out += folded[k]; map.push(i); }
  }
  return { text: out, map, src };
}

/**
 * Finds `needle` in `haystack`.
 *
 * Returns { at, end, loose } in ORIGINAL-text coordinates, or null. `loose`
 * says the match only succeeded once tone marks were ignored, so the caller
 * can tell the reader rather than quietly pretending it was exact.
 */
export function findIn(haystack, needle) {
  const q = String(needle || '').trim();
  if (!q) return null;
  const thai = hasThai(q);

  const attempt = (dropMarks) => {
    const h = fold(haystack, { dropSpaces: thai, dropMarks });
    const n = fold(q, { dropSpaces: thai, dropMarks });
    if (!n.text) return null;
    const at = h.text.indexOf(n.text);
    if (at < 0) return null;
    const endFolded = at + n.text.length - 1;
    return {
      at: h.map[at],
      // +1 so the caller can slice; the last mapped index is inclusive.
      end: (h.map[endFolded] ?? h.map[at]) + 1,
      loose: dropMarks,
    };
  };

  // Exact first. Only if that finds nothing is it worth relaxing.
  return attempt(false) || (thai ? attempt(true) : null);
}

/**
 * Searches a list of page texts. Returns one hit per page, in page order, each
 * carrying a quote taken from the ORIGINAL text so it reads the way the slide
 * reads.
 */
export function searchPages(pages, needle, { limit = 200, context = 45 } = {}) {
  const out = [];
  if (!needle || !needle.trim()) return out;
  for (let i = 1; i < (pages?.length || 0); i++) {
    const text = pages[i];
    if (!text) continue;
    const hit = findIn(text, needle);
    if (!hit) continue;
    const from = Math.max(0, hit.at - context);
    const to = Math.min(text.length, hit.end + context);
    out.push({
      page: i,
      at: hit.at,
      end: hit.end,
      loose: hit.loose,
      // The quote is display text, so the invisible characters that made the
      // match hard in the first place should not travel into it.
      quote: (from > 0 ? '…' : '')
        + text.slice(from, to).replace(ZERO_WIDTH, '').replace(/\s+/g, ' ').trim()
        + (to < text.length ? '…' : ''),
    });
    if (out.length >= limit) break;
  }
  return out;
}

/**
 * Turns pdf.js text items into one string per page.
 *
 * The separator matters more than it looks. pdf.js emits `hasEOL` on the item
 * that ends a visual line, and its own extractor inserts a newline there; runs
 * WITHIN a line are pieces of the same sentence and often the same word, so
 * joining those with a space is what breaks Thai search. Runs are joined with
 * nothing and lines with a newline; the fold above then removes the newlines
 * for Thai queries and keeps them for everything else.
 */
export function pageTextFromItems(items) {
  let out = '';
  for (const it of items || []) {
    out += it.str || '';
    if (it.hasEOL) out += '\n';
  }
  return out;
}
