// What a study archive holds, before anyone reads it: the pure half of
// scripts/archive-inventory.mjs, kept apart so the rules are unit-tested.
//
// Two questions decide what a file costs to use:
//   1. What kind of file is it? An exam recall or a compilation is read first,
//      a summary next, a syllabus settles the midterm/final split, a lecture
//      deck is usually already on the shelf from MyCourseVille.
//   2. Can its text layer be trusted? Thai display fonts lose their marks on
//      extraction (memory: thai-pdf-fonts-corrupt-text). A page whose Thai is
//      damaged must be rendered and read as an image, never quoted from text.

const THAI_LETTER = /[ก-ฮ]/g;
const TONE_MARK = /[่-๋]/g;
// A non-Thai character wedged between two Thai letters: a substituted glyph.
const WEDGE = /(?<=[ก-๎])[^฀-๿\s\d.,()\-/:;%+]+(?=[ก-๎])/g;
// Shifted tone-mark glyphs that some fonts put in the private use area.
const PUA = /[-]/g;
// Sara am split into a space and sara aa ("ส าหรับ", "น ้า"): a broken font.
const AM_SPLIT = /(?<=[ก-ฮ]) (?=[่-๋]?า)/g;

const count = (text, re) => (text.match(re) || []).length;

/** Classify one page's extracted text: 'image' (no text layer), 'bad' (the
 * font damaged the Thai), 'low' (few tone marks, which terse slide Thai also
 * shows, so render before quoting) or 'ok'. */
export function thaiPageQuality(raw) {
  const text = String(raw || '').normalize('NFC');
  const chars = text.replace(/\s+/g, '').length;
  const thai = count(text, THAI_LETTER);
  const tone = count(text, TONE_MARK);
  const wedges = count(text, WEDGE);
  const pua = count(text, PUA);
  const amSplit = count(text, AM_SPLIT);
  const toneRatio = thai ? tone / thai : null;
  let kind = 'ok';
  if (chars < 20) kind = 'image';
  else if (thai && (pua || amSplit || wedges / thai > 0.01)) kind = 'bad';
  else if (thai >= 40 && toneRatio < 0.09) kind = 'low';
  return { chars, thai, toneRatio, wedges, pua, amSplit, kind };
}

// File-name signals, checked in this order. `\b` here is ASCII-only, which is
// what keeps "Gastrointestinal" from reading as a test.
const EXAM = /ข้อสอบ|โพย|เฉลย|recall|quiz|exam|\btj\b|tj\d|แนวข้อ|past|\btest\b|ทบทวน|ติว|mock|\bq ?[-&] ?a\b|ชีท|pre-?test|post-?test|answer|รวมข้อ|แบบฝึก|exercise|worksheet|assignment|ติ๊ก|เส้นสีแดง|ดาว/i;
const SUMMARY = /สรุป|summary|\bsum\b|\bnote|โน้ต|โน๊ต/i;
const SYLLABUS = /ตาราง|syllabus|course|^list\b|outline|schedule|เนื้อหาที่เรียน|orientation|แผนการสอน|ประมวลรายวิชา/i;
const YEAR_FOLDER = /^(ปี|year|y)\s*\d/i;

/** What a file is, from its path inside the archive. */
export function categorise(relPath) {
  const parts = String(relPath).replace(/\\/g, '/').split('/');
  const name = parts.at(-1);
  if (/\.goodnotes$/i.test(name)) return 'goodnotes';
  if (parts.some((p) => /textbook/i.test(p))) return 'textbook';
  if (!YEAR_FOLDER.test(parts[0])) return 'outside';
  if (EXAM.test(name)) return 'exam';
  if (SUMMARY.test(name) || parts.slice(3, -1).some((p) => SUMMARY.test(p))) return 'summary';
  if (SYLLABUS.test(name) || parts.length <= 3) return 'syllabus';
  return 'deck';
}

/** One page list in, one document verdict out: how many pages need a render. */
export function documentQuality(pageKinds) {
  const pages = pageKinds.length;
  const tally = { ok: 0, low: 0, bad: 0, image: 0 };
  for (const k of pageKinds) tally[k]++;
  const needsRender = pageKinds.map((k, i) => (k === 'ok' ? null : i + 1)).filter(Boolean);
  let verdict = 'text';
  if (pages && tally.image / pages > 0.8) verdict = 'scan';
  else if (pages && tally.bad / pages > 0.3) verdict = 'damaged-thai';
  else if (pages && (tally.image + tally.bad) / pages > 0.3) verdict = 'mixed';
  return { pages, ...tally, needsRender, verdict };
}
