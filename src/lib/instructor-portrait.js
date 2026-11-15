// ============================================================
// instructor-portrait.js — where a lecturer's portrait is, and the monogram otherwise
// ============================================================
// A profile with an official staff portrait carries `photo: { w, h, v }` (its
// pixel size and a short content hash). The picture is not in the app: it sits
// beside the answer slides, under the address /api/evidence-pass gives to Chula
// members (src/lib/evidence.js), as `people/<slug>.webp`. A visitor that
// address is not given to sees the monogram. Where each picture came from is
// in scripts/instructor-portraits.mjs.

/** The portrait's address for this member's base, or null when there is none to draw. */
export function portraitUrl(base, instructor) {
  const photo = instructor?.photo;
  if (typeof base !== 'string' || !base || !photo || !/^[0-9a-f]{8}$/.test(photo.v || '')) return null;
  if (!/^[a-z0-9-]+$/.test(instructor.slug || '')) return null;
  return `${base}/people/${instructor.slug}.webp?v=${photo.v}`;
}

// Thai leading vowels are written before the consonant they follow in speech:
// the initial of เกรียงยศ is ก, not เ.
const LEADING = /^[เแโใไ]+/u;
const TITLE = /^(?:ศ|รศ|ผศ|อ|ดร|น\.สพ|สพ\.ญ|Dr|Prof|Assoc|Asst)\.\s*/iu;

function initialOf(word) {
  const rest = word.replace(LEADING, '');
  const ch = [...(rest || word)][0] || '';
  return /[a-z]/i.test(ch) ? ch.toUpperCase() : ch;
}

/** Up to two initials: first and last word of the name (Thai first, as the cards print it). */
export function initialsOf(instructor) {
  let name = String(instructor?.nameTh || instructor?.nameEn || '').trim();
  while (TITLE.test(name)) name = name.replace(TITLE, '');
  const words = name.split(/\s+/).filter(Boolean);
  if (!words.length) return '';
  if (words.length === 1) return initialOf(words[0]);
  return `${initialOf(words[0])}${initialOf(words.at(-1))}`;
}
