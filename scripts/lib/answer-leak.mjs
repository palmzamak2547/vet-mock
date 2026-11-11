// ============================================================
// answer-leak.mjs — does text shown before an answer give the key away?
// ============================================================
// Palm, 1 Nov 2026: "ตรงที่มาตอนทำโจทย์ บางอันอ่านแล้วสามารถรู้เฉลยได้ แก้ที".
// The "ที่มา" line under a question printed the source pointer while the
// question was open, and some pointers named the key: "Master 86 p6
// (Cysteine + Tyrosine semi-essential)" under "กรดอะมิโนคู่ใดที่จัดเป็น
// semi-essential ในไก่". This is the check, shared by
// scripts/lint-source-line.mjs and tests/unit/source-line-no-spoiler.test.mjs.
//
// Text leaks when it does one of three things the student could not
// already read on the card (the stem, the passage, the course's name):
//   key-words     it carries a word of the correct option that no other
//                 option carries: an English word of four letters or more
//                 or an acronym ("GKX"), two Thai words, or a three-word
//                 Thai phrase ("เกี่ยวกับสัตว์และผลิตภัณฑ์");
//   names-answer  it names the disease, drug or organism the correct option
//                 names, in either language, through the glossary's own
//                 names for it (src/data/glossary.js term, aliases, thai);
//   states-fact   for a written item, it carries the expected answer (a
//                 fill-in blank, a short answer's keywords) the same way;
//                 for a true/false item, two words of the explanation's
//                 verdict that the statement itself does not use.
// Words are compared after NFC, lower case and Thai word segmentation,
// without stopwords, numbers (page numbers are everywhere) or the words
// every source line carries (pdf, slide, final, Vet, หน้า, ข้อสอบ ...).
//
// It reads words, not meaning: "Metencephalon lecture deck" above a question
// whose key is the pons is a hint it cannot see. It is the floor a line must
// clear, not proof that a line is safe.
// ============================================================
import { GLOSSARY } from '../../src/data/glossary.js';
import { SUBJECTS } from '../../src/data/curriculum.js';
import { explainText, passageText } from '../../src/lib/rich-blocks.js';

const SEG = new Intl.Segmenter('th', { granularity: 'word' });
const words = (list) => new Set(list.trim().split(/\s+/));

const EN_STOP = words(`a an the of in on at to for from by with without and or nor but not no is are was were be been
  being it its this that these those as than then so such which who whom whose what when where why how all any each both
  either neither few more most other some same own very can could may might must shall should will would do does did done
  has have had having into onto over under about above below between through during before after again further once here
  there only also via per vs etc eg ie use used using one two three four five six seven eight nine ten first second third
  least`);
// Words a provenance line carries whatever the question is: file and page
// words, paper words, cohort and author words. A key that happens to hold
// one is not given away by a line that says "final" or "slide".
const SOURCE_STOP = words(`pdf pptx docx jpg png deck decks slide slides page pages lecture lectures lect note notes
  summary summaries master supplemental supplement handout handouts sheet sheets file files doc document documents final
  finals midterm midterms mid term exam exams examination recall recalled past paper papers quiz test tests mock part
  section sec chapter unit course key script answer answers question questions item items vet vets cuvet aj ajarn dr prof
  dvm phd textbook book books reference references ref refs year years round rev version ver draft review verified verify
  source sources tj audit compilation compiled online station osce`);
const TH_STOP = words(`และ หรือ ของ ใน ที่ เป็น การ ความ ได้ มี ไม่ จาก กับ โดย ให้ ว่า ซึ่ง คือ จะ ไป มา แล้ว ก็ ยัง อยู่ ต่อ
  เพื่อ แต่ ถ้า เมื่อ นั้น นี้ นี่ ทั้ง อย่าง ตาม ทาง แบบ ด้วย หรือไม่ ข้อ ข้อใด ใด อะไร ไหน ทำ ใช้ เกิด พบ ตัว ชนิด ประเภท กลุ่ม ส่วน
  ระหว่าง มาก น้อย สูง ต่ำ เพิ่ม ลด ครั้ง เรื่อง หลัก จุด ช่วง ระยะ วัน เวลา คน สัตว์ เช่น ได้แก่ เท่านั้น ทุก บาง หลาย อื่น ๆ ไว้ ขึ้น
  ลง ออก เข้า กัน เอง จึง ดัง สามารถ ต้อง ควร อาจ หาก เพราะ เนื่องจาก สำหรับ ภายใน ภายนอก ก่อน หลัง ถึง จน แก่ แห่ง ณ`);
const TH_SOURCE_STOP = words(`สไลด์ หน้า ข้อสอบ เก่า บันทึก หลังสอบ สอบ คาบ รุ่น รุ่นพี่ ชีท สรุป ไฟล์ เอกสาร กลางภาค ปลายภาค
  ภาค ไฟนอล มิดเทอม อาจารย์ อ. วิชา บท ตอน ปรนัย อัตนัย ถูก ผิด โน้ต ภาพ สแกน คลิป นาที ตรวจ อ้างอิง ที่มา หมายเหตุ ไม่ระบุ
  ระบุ ฉบับ เรียน แบบทดสอบ ทดสอบ`);
// The chip's own controls, the same on every question: "▾ ดูเต็ม", "▴ ซ่อน"
// and, before the key, "ดูเต็มหลังเฉลย". Read as words they matched
// "โตเต็มวัย ใช้ดูเพศ" in a key, which no student would take for a hint.
const CHIP_STOP = words('ดู เต็ม ซ่อน เห็น เฉลย');
// Too general to give an answer away in a veterinary course.
const GENERIC = words(`disease diseases infection infections infectious syndrome syndromes animal animals veterinary
  clinical sign signs treatment treatments diagnosis control prevention management case cases cause causes caused type
  types group groups species patient patients normal abnormal acute chronic primary secondary general basic introduction
  overview principle principles method methods system systems health medicine medical โรค ภาวะ อาการ การรักษา รักษา
  วินิจฉัย ป้องกัน ควบคุม สาเหตุ ผู้ป่วย ปกติ ผิดปกติ เฉียบพลัน เรื้อรัง`);

const THAI = /[฀-๿]/;
const LATIN = /[a-z]/i;

// NFC, then the one decomposed spelling PDF extraction leaves behind
// (nikhahit + sara aa for sara am), as exam-origin-parse.js does.
function prepare(text) {
  return String(text ?? '').normalize('NFC').replace(/ํา/g, 'ำ');
}
// RichText markup out: images, links (their label stays), tags, emphasis.
function plain(text) {
  return prepare(text)
    .replace(/!\[[^\]]*\]\([^)]*\)/g, ' ')
    .replace(/\[([^\]]*)\]\([^)]*\)/g, '$1')
    .replace(/<[^>]+>/g, ' ')
    .replace(/[*_`~^|#>\\]/g, ' ');
}
const isNumber = (t) => /^[\d.,%]+$/.test(t);
// A plural is the same word: "vaccines" is "vaccine". Not -ss, -us, -is.
const stem = (t) => (t.length > 4 && /[a-z]s$/.test(t) && !/(?:ss|us|is|ys|os)$/.test(t) ? t.slice(0, -1) : t);

function segments(text) {
  const out = [];
  for (const { segment, isWordLike } of SEG.segment(plain(text))) {
    if (!isWordLike) continue;
    // Marks stay: Thai tone marks and thanthakhat are \p{M}, and trimming
    // them turned ไม่ into ไม and สัตว์ into สัตว, past every stopword.
    const raw = segment.trim().replace(/^[^\p{L}\p{N}\p{M}]+|[^\p{L}\p{N}\p{M}]+$/gu, '');
    if (raw && !isNumber(raw)) out.push(raw);
  }
  return out;
}

const cache = new Map();
/** Content words, lower case: { words, acronyms, tokens } where tokens keeps every word in order for phrases. */
export function textWords(text, { sourceWordsCount = false } = {}) {
  const k = `${sourceWordsCount ? 1 : 0}\u0000${text}`;
  if (cache.has(k)) return cache.get(k);
  const out = { words: new Set(), acronyms: new Set(), tokens: [] };
  for (const raw of segments(text)) {
    const lower = raw.toLowerCase();
    if (THAI.test(lower)) {
      out.tokens.push(lower);
      if ([...lower].length < 2 || TH_STOP.has(lower) || GENERIC.has(lower)) continue;
      if (!sourceWordsCount && (TH_SOURCE_STOP.has(lower) || CHIP_STOP.has(lower))) continue;
      out.words.add(lower);
    } else if (LATIN.test(lower)) {
      const s = stem(lower);
      out.tokens.push(s);
      if (/^[A-Z][A-Z0-9]{1,5}$/.test(raw)) out.acronyms.add(s);
      if (s.length < 3 && !out.acronyms.has(s)) continue;
      if (EN_STOP.has(s) || GENERIC.has(s)) continue;
      if (!sourceWordsCount && SOURCE_STOP.has(s)) continue;
      out.words.add(s);
    }
  }
  if (cache.size > 50_000) cache.clear();
  cache.set(k, out);
  return out;
}

/** Every run of n words in a row, in order. */
function runs(tokens, n) {
  const out = new Set();
  for (let i = 0; i + n <= tokens.length; i++) out.add(tokens.slice(i, i + n).join(' '));
  return out;
}
const trigrams = (tokens) => runs(tokens, 3);

// ── The glossary's names for a disease, drug or organism ──────────────
const CONCEPTS = GLOSSARY
  .filter((e) => ['disease', 'drug', 'organism'].includes(e.category))
  .map((e) => ({
    key: e.term,
    forms: [...new Set([e.term, ...(e.aliases || []), ...String(e.thai || '').split(/[/,;]| หรือ /)]
      .map((f) => prepare(f).trim())
      .filter((f) => (THAI.test(f) ? [...f].length >= 3 : f.length >= 2)))],
  }));
const formPattern = new Map();
function hasForm(prepared, form) {
  if (THAI.test(form)) return prepared.includes(form);
  let re = formPattern.get(form);
  if (!re) {
    const escaped = form.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
    // A short all-caps alias ("ND") counts only in capitals, so "nd" in
    // "2nd" or a lower-case word is never read as Newcastle disease.
    const caseSensitive = form.length <= 3 && form === form.toUpperCase();
    re = new RegExp(`(?:^|[^A-Za-z0-9])${escaped}(?:$|[^A-Za-z0-9])`, caseSensitive ? '' : 'i');
    formPattern.set(form, re);
  }
  return re.test(prepared);
}
const conceptCache = new Map();
/** The glossary concepts a text names, by their keys. */
function conceptsIn(text) {
  const k = String(text ?? '');
  let hit = conceptCache.get(k);
  if (!hit) {
    const prepared = prepare(k);
    hit = new Set(CONCEPTS.filter((c) => c.forms.some((f) => hasForm(prepared, f))).map((c) => c.key));
    if (conceptCache.size > 50_000) conceptCache.clear();
    conceptCache.set(k, hit);
  }
  return hit;
}

/** The course's names, in both languages: the student knows which course they are in. */
export function courseNames(question) {
  const subject = SUBJECTS.find((s) => s.id === question?.subject);
  return subject ? [subject.name, subject.name_en].filter(Boolean) : [];
}

/**
 * What a question asks the student to produce, and what they can already read.
 * kind: 'option' (a choice question), 'written' (fill, short), 'statement'
 * (true/false); null for item types with no single key (match, essay).
 */
export function answerParts(question) {
  const q = question || {};
  const seen = [q.q, passageText(q), ...courseNames(q)].filter(Boolean).join('\n');
  if (q.type === 'mcq' && Array.isArray(q.options) && Number.isInteger(q.answer) && q.options[q.answer] != null) {
    return { kind: 'option', key: [String(q.options[q.answer])], seen, rivals: q.options.filter((_, i) => i !== q.answer).map(String) };
  }
  if (q.type === 'fill' && Array.isArray(q.blanks)) return { kind: 'written', key: q.blanks.map(String), seen, rivals: [] };
  if (q.type === 'short' && Array.isArray(q.keywords)) return { kind: 'written', key: q.keywords.map(String), seen, rivals: [] };
  if (q.type === 'tf' && typeof q.answer === 'boolean') {
    // The fact a true/false item tests is what its explanation's first
    // sentence says is so, which the statement states or contradicts.
    const firstLine = explainText(q).split('\n')[0];
    const verdict = (firstLine.match(/^.*?[.!?](?=\s|$)/) || [firstLine])[0];
    return { kind: 'statement', key: [verdict], seen, rivals: [] };
  }
  return null;
}

/**
 * Whether `shown`, text a student reads before answering `question`, gives
 * the key away. null, or { rule: 'key-words' | 'names-answer' | 'states-fact', words }.
 */
export function leakOf(question, shown) {
  const parts = answerParts(question);
  if (!parts || !String(shown ?? '').trim()) return null;
  const line = textWords(shown);
  const lineConcepts = parts.kind === 'statement' ? new Set() : conceptsIn(shown);
  // A line with no content word and no named concept cannot leak; most
  // lines, and every kind-of-source line, stop here.
  if (!line.words.size && !lineConcepts.size) return null;
  const seen = textWords(parts.seen, { sourceWordsCount: true });
  const rivalWords = new Set(parts.rivals.flatMap((r) => [...textWords(r, { sourceWordsCount: true }).words]));
  const keyWords = new Set();
  const keyAcronyms = new Set();
  for (const k of parts.key) {
    const kw = textWords(k);
    for (const w of kw.words) if (!seen.words.has(w) && !rivalWords.has(w)) keyWords.add(w);
    for (const a of kw.acronyms) keyAcronyms.add(a);
  }
  const hits = [...keyWords].filter((w) => line.words.has(w));
  const latin = hits.filter((w) => !THAI.test(w) && (w.length >= 4 || (keyAcronyms.has(w) && line.acronyms.has(w))));
  const thai = hits.filter((w) => THAI.test(w));
  const rule = parts.kind === 'option' ? 'key-words' : 'states-fact';

  if (parts.kind === 'statement') {
    return latin.length + thai.length >= 2 ? { rule, words: [...latin, ...thai] } : null;
  }
  if (latin.length || thai.length >= 2) return { rule, words: [...latin, ...thai] };
  if (thai.length) {
    // One Thai word is common enough to be chance ("ท้อง" in ท้องมาน and in
    // ท้องเสีย); a three-word phrase the key and the line share, that the
    // stem and the other options do not, is not.
    const lineGrams = trigrams(line.tokens);
    const seenGrams = trigrams(seen.tokens);
    const rivalGrams = new Set(parts.rivals.flatMap((r) => [...trigrams(textWords(r, { sourceWordsCount: true }).tokens)]));
    for (const k of parts.key) {
      for (const g of trigrams(textWords(k).tokens)) {
        if (lineGrams.has(g) && !seenGrams.has(g) && !rivalGrams.has(g) && g.split(' ').some((w) => keyWords.has(w))) {
          return { rule, words: [g] };
        }
      }
    }
  }
  // The disease, drug or organism the key names, in either language.
  if (!lineConcepts.size) return null;
  const known = new Set([parts.seen, ...parts.rivals].flatMap((t) => [...conceptsIn(t)]));
  const named = [...new Set(parts.key.flatMap((k) => [...conceptsIn(k)]))]
    .filter((c) => !known.has(c) && lineConcepts.has(c));
  if (named.length) return { rule: parts.kind === 'option' ? 'names-answer' : rule, words: named };
  return null;
}

// ── A figure's own words: its caption and its credit ──────────────────
// Epidemiology 100004 asked which animal is the mixing vessel and which the
// natural reservoir, above a caption that read "สุกรเป็น mixing vessel;
// นกป่าและนกอพยพเป็น natural reservoir". leakOf passed it: every word of that
// key is in the stem or in another option, and the four options differ only
// in which animal goes with which role. A caption is written for one question
// and sits under its picture while the question is open, so it is held to
// more than a source line is.
const numbersIn = (text) => new Set((plain(text).match(/\d+(?:[.,]\d+)*/g) || []).map((n) => n.replace(/,/g, '')));

/**
 * Whether a figure's caption or credit, shown under the picture before the
 * answer, gives the key away. leakOf's rules first; then, for a choice or a
 * written item:
 *   key-words     one Thai word, or one number, of the key that neither the
 *                 stem nor another option carries (leakOf asks for two Thai
 *                 words and reads no numbers, since a document's title shares
 *                 a word by chance and every source line carries page numbers);
 *   restates-key  the whole of the key, word for word, and of no other option;
 *                 or three words in a row of the key, in the key's order, that
 *                 the stem does not carry and that not every option carries
 *                 ("สุกร เป็น mixing").
 * null, or { rule, words }.
 */
export function figureTextLeak(question, shown) {
  const found = leakOf(question, shown);
  if (found) return found;
  const parts = answerParts(question);
  if (!parts || parts.kind === 'statement' || !String(shown ?? '').trim()) return null;
  const all = { sourceWordsCount: true };
  const line = textWords(shown);
  const seen = textWords(parts.seen, all);
  const rivals = parts.rivals.map((r) => textWords(r, all));
  const rivalWords = new Set(rivals.flatMap((r) => [...r.words]));

  // One Thai word of the key, or one of its numbers.
  const thai = new Set();
  for (const k of parts.key) {
    for (const w of textWords(k).words) if (THAI.test(w) && !seen.words.has(w) && !rivalWords.has(w) && line.words.has(w)) thai.add(w);
  }
  if (thai.size) return { rule: 'key-words', words: [...thai] };
  const lineNumbers = numbersIn(shown);
  const knownNumbers = new Set([parts.seen, ...parts.rivals].flatMap((t) => [...numbersIn(t)]));
  const numbers = [...new Set(parts.key.flatMap((k) => [...numbersIn(k)]))].filter((n) => !knownNumbers.has(n) && lineNumbers.has(n));
  if (numbers.length) return { rule: 'key-words', words: numbers };

  // The key itself, word for word, where no other option is.
  const within = (tokens) => tokens.length > 0 && runs(line.tokens, tokens.length).has(tokens.join(' '));
  const whole = parts.key.filter((k) => textWords(k).words.size > 0 && within(textWords(k, all).tokens));
  if (whole.length && !rivals.some((r) => within(r.tokens))) return { rule: 'restates-key', words: whole.map((k) => textWords(k, all).tokens.join(' ')) };

  // Three words in a row of the key that tell it from another option.
  const lineRuns = trigrams(line.tokens);
  const seenRuns = trigrams(seen.tokens);
  const rivalRuns = rivals.map((r) => trigrams(r.tokens));
  const told = new Set();
  for (const k of parts.key) {
    const kw = textWords(k, all);
    for (const g of trigrams(kw.tokens)) {
      if (!lineRuns.has(g) || seenRuns.has(g)) continue;
      if (rivalRuns.length && rivalRuns.every((r) => r.has(g))) continue;
      if (g.split(' ').some((w) => kw.words.has(w))) told.add(g);
    }
  }
  return told.size ? { rule: 'restates-key', words: [...told] } : null;
}
