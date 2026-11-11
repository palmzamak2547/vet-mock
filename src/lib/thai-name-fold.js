// ============================================================
// thai-name-fold — a loose key for Thai names, for a second search pass
// ============================================================
// Typing "อนุวัฒน์" found nobody for the record spelled "อนุวัตน์" (screens
// hunt, 11 Nov 2026), while "anuwat" found it. Thai names are misspelled in a
// few predictable ways, and this folds exactly those, nothing else:
//   1. tone marks (่ ้ ๊ ๋) are dropped;
//   2. a silent letter, the consonant under ์ (with an ิ or ุ it carries, as in
//      ศักดิ์), is dropped with its mark;
//   3. a final consonant becomes the first letter of its final sound class
//      (มาตราตัวสะกด): กก ข ค ฆ -> ก, กด จ ช ซ ฎ ฏ ฐ ฑ ฒ ต ถ ท ธ ศ ษ ส -> ด,
//      กบ ป พ ฟ ภ -> บ, กน ญ ณ ร ล ฬ -> น.
// "Final" is read from spelling alone: a consonant that is not a word's first,
// not right after a leading vowel (เ แ โ ใ ไ), and followed by a consonant, a
// leading vowel, a space or the end. Both sides are folded the same way, so a
// name always finds itself. Callers use it only when the exact pass finds
// nobody (FacultyView), so an exact spelling always ranks first.
// ============================================================

const TONES = /[่-๋]/g;
const SILENT = /[ก-ฮ][ิุ]?์/g;
const LEADING = new Set(['เ', 'แ', 'โ', 'ใ', 'ไ']);
const FINAL_CLASS = new Map([
  ...[...'ขคฆ'].map((c) => [c, 'ก']),
  ...[...'จชซฎฏฐฑฒตถทธศษส'].map((c) => [c, 'ด']),
  ...[...'ปพฟภ'].map((c) => [c, 'บ']),
  ...[...'ญณรลฬ'].map((c) => [c, 'น']),
]);
const isConsonant = (c) => c >= 'ก' && c <= 'ฮ';

function foldWord(word) {
  const w = word.replace(SILENT, '').replace(TONES, '');
  let out = '';
  for (let i = 0; i < w.length; i++) {
    const c = w[i];
    const next = w[i + 1];
    const final = i > 0 && isConsonant(c) && !LEADING.has(w[i - 1])
      && (next === undefined || isConsonant(next) || LEADING.has(next));
    out += final ? (FINAL_CLASS.get(c) || c) : c;
  }
  return out;
}

/** The loose key of a text: lower-cased, each word folded. A title written
 *  onto a name (รศ.ดร.น.สพ.อนุวัตน์) is split at its dots. */
export function foldThaiName(text) {
  return String(text || '').toLowerCase().split(/[\s.]+/).filter(Boolean).map(foldWord).join(' ');
}

/** Does a text hold Thai letters? */
export function hasThai(text) {
  return /[ก-๛]/.test(String(text || ''));
}

/**
 * The two passes over entries carrying `_hayLc` (every field, lower-cased)
 * and `_looseHay` (the Thai names, folded): the exact text, and only when it
 * finds nobody, the folded one. Returns { hits, loose }.
 */
export function twoPassSearch(pool, query) {
  const q = String(query || '').trim().toLowerCase();
  if (!q) return { hits: pool, loose: false };
  const exact = pool.filter((entry) => entry._hayLc.includes(q));
  if (exact.length) return { hits: exact, loose: false };
  const folded = foldThaiName(q);
  if (!hasThai(folded)) return { hits: exact, loose: false };
  // From the start of a word: a folded key is short, and inside a word it
  // matched strangers (กัญจณ์ found เตชิกันตภัสร).
  const near = pool.filter((entry) => (' ' + entry._looseHay).includes(' ' + folded));
  return { hits: near, loose: near.length > 0 };
}

/** Does `query` match `text` loosely? Only queries holding Thai are folded:
 *  Latin spelling has its own exact pass. */
export function looseThaiMatch(text, query) {
  const q = foldThaiName(query);
  if (!q || !hasThai(q)) return false;
  return (' ' + foldThaiName(text)).includes(' ' + q);
}
