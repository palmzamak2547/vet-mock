// ============================================================
// omni-intents.js — deterministic query understanding for AI Search
// ============================================================
// The first agentic layer of VetMock's search: the query is read for
// INTENT before it is fuzzy-matched, and a recognized intent produces an
// ANSWER CARD computed from the app's own data — never generated text.
//
//   "ketamine 12 kg แมว"  → dose card via drugDose() over VET_DRUGS
//   "3104306"             → course card via the same subject system the
//                           question bank and the library shelf use
//
// Everything here derives from data modules at call time, so a drug edit
// or a new course shows up in the answers without touching this file.
// That is the contract of the whole search: the index follows the data.

import { VET_DRUGS } from '../data/vet-drug-database.js';
import { drugDose } from '../hooks/utils.js';
import { subjectMeta } from './library.js';
import { SUBJECTS, yearForSubject } from '../data/curriculum.js';
import { createStudyCatalog } from './study-catalog.js';

// ── Drug lookup ───────────────────────────────────────────────────────────

// generic + Thai brand names, lowered once. Brands are comma-separated in
// the DB ("Anesket, Ketamil") — each one should hit on its own.
let _drugIndex = null;
function drugIndex() {
  if (_drugIndex) return _drugIndex;
  _drugIndex = VET_DRUGS.map((d) => ({
    drug: d,
    names: [d.generic, ...(d.brand ? String(d.brand).split(/\s*,\s*/) : [])]
      .filter(Boolean)
      .map((n) => n.toLowerCase()),
  }));
  return _drugIndex;
}

const SPECIES_WORDS = [
  [/(แมว|\bcat\b|\bfeline\b)/i, 'cat'],
  [/(สุนัข|หมา|\bdog\b|\bcanine\b)/i, 'dog'],
];

// "12 kg" / "12กก" / "3.5 โล" — weight is optional; the card still shows
// the per-kg range without one.
const WEIGHT_RE = /(\d+(?:\.\d+)?)\s*(?:kg\b|kgs\b|กก\.?|กิโล(?:กรัม)?|โล\b)/i;

export function detectDoseIntent(query) {
  const q = String(query || '').trim();
  if (q.length < 3) return null;
  const qlc = q.toLowerCase();

  // Longest matching drug name wins — "dexmedetomidine" must not lose to
  // a shorter name that happens to be a substring of the query.
  let best = null;
  for (const { drug, names } of drugIndex()) {
    for (const n of names) {
      if (n.length >= 4 && qlc.includes(n) && (!best || n.length > best.n.length)) {
        best = { drug, n };
      }
    }
  }
  if (!best) return null;

  const weight = WEIGHT_RE.exec(q);
  const weightKg = weight ? Number(weight[1]) : null;
  let species = null;
  for (const [re, id] of SPECIES_WORDS) if (re.test(q)) { species = id; break; }
  // A dog-only or cat-only drug answers for its own species even when the
  // query names none.
  if (!species && best.drug.species !== 'both') species = best.drug.species;
  // A species the database does not list the drug for gets no number at all:
  // "carprofen แมว 4 kg" once answered with a green cat total under a note
  // that says DO NOT USE IN CATS. The calculator's Drug DB tab hides these
  // drugs for the other species; the card says the drug is not listed.
  const speciesMismatch = Boolean(species && best.drug.species !== 'both' && species !== best.drug.species);

  return {
    kind: 'dose',
    drug: best.drug,
    weightKg,
    species,
    speciesMismatch,
    dose: speciesMismatch ? null : drugDose(best.drug, weightKg, species),
    perKg: speciesMismatch ? null : drugDose(best.drug, null, species),
  };
}

// ── Course lookup ─────────────────────────────────────────────────────────

// Course numbers are the registrar's ids; subjectMeta covers both the
// curriculum subjects (via their code field) and the five gen-ed courses.
let _byCode = null;
function codeIndex() {
  if (_byCode) return _byCode;
  _byCode = new Map(SUBJECTS.filter((s) => s.code).map((s) => [s.code, s]));
  return _byCode;
}

export function detectCourseIntent(query) {
  const m = /(?:^|\D)(\d{7})(?:\D|$)/.exec(String(query || ''));
  if (!m) return null;
  const code = m[1];
  const meta = codeIndex().get(code) || subjectMeta(code);
  if (!meta) return null;
  return { kind: 'course', code, meta };
}

// ── Subject + what to open ("คลิป COM5", "สรุป epidem", "ข้อสอบ avian") ──
// Palm, 2026-10-11: typing คลิป, สรุปวิชา or แบบทดสอบ with a subject should
// bring up that subject's clips, summary or practice. This reads both halves
// and answers with the subject's real shelves, counted from the same catalog
// the topic screen uses, so a button only appears where there is something
// behind it.

const STUDY_WANTS = [
  { want: 'videos', re: /(คลิป|วิดีโอ|วีดีโอ|ย้อนหลัง|\bvideos?\b|\bclips?\b|youtube)/g },
  { want: 'notes', re: /(สรุป|โน้ต|โน๊ต|\bnotes?\b|\bsummar[a-z]*)/g },
  { want: 'practice', re: /(แบบทดสอบ|ข้อสอบ|ทดสอบ|ฝึกทำ|ฝึก|โจทย์|\bquiz\b|\bexam\b|\bpractice\b|\bmcq\b)/g },
  { want: 'library', re: /(คลังเอกสาร|เอกสาร|ชีท|สไลด์|\bslides?\b|\bpdf\b|\blibrary\b|\bhandouts?\b)/g },
  { want: 'wiki', re: /(vetwiki|\bwiki\b|วิกิ)/g },
];
// A schedule question is the timetable's to answer, not a shelf's.
const SCHEDULE_RE = /(ตารางสอบ|วันสอบ|สอบวันไหน|สอบเมื่อไหร่|สอบวันที่|ตารางเรียน|\bschedule\b)/;
// Words that ride along with a subject name and are not part of it.
const FILLER_RE = /(วิชา|ของ|เรื่อง|ทั้งหมด|ทั้งวิชา|ปี\s*\d|หน่อย|ครับ|ค่ะ|ขอ|เปิด|ดู|หา|อ่าน|\ball\b|\bof\b|\bfor\b|\bthe\b)/g;
// Words in English course names that name no particular course.
const GENERIC_NAME = new Set(['veterinary', 'animal', 'animals', 'clinical', 'medicine', 'science', 'sciences', 'principles',
  'laboratory', 'practice', 'management', 'health', 'profession', 'professional', 'introduction', 'student', 'students', 'and']);
// Short Thai names students use for this year's courses. Navigation, not
// medicine: each points at a course id that exists in the curriculum.
const THAI_SHORT = {
  'ระบาด': ['epidemiology'], 'สัตว์ปีก': ['avian-medicine'], 'สัตว์น้ำ': ['aquatic-clinic'],
  'ม้า': ['equine-medicine', 'equine-repro'], 'สุกร': ['swine-clinic'], 'หมู': ['swine-clinic'],
  'นม': ['milk-meat-hygiene'], 'โรคสัตว์สู่คน': ['zoonoses'], 'สัตว์ป่า': ['exotic'],
};
const ROMAN = { i: 1, ii: 2, iii: 3, iv: 4, v: 5 };

let _subjectIndex = null;
function subjectIndex() {
  if (_subjectIndex) return _subjectIndex;
  _subjectIndex = SUBJECTS.filter((s) => s.id && s.id !== 'all').map((s) => ({
    s,
    id: s.id.toLowerCase(),
    parts: s.id.toLowerCase().split('-').filter((p) => p.length >= 4),
    code: String(s.code || '').toLowerCase(),
    words: String(s.name_en || '').toLowerCase().split(/[^a-z0-9]+/).filter((w) => w.length >= 4 && !GENERIC_NAME.has(w)),
    nameTh: /[฀-๿]/.test(s.name || '') ? s.name : '',
    year: yearForSubject(s.id),
  }));
  return _subjectIndex;
}

/** "COM 5", "com v", "COM-5" → "com5", the way the course ids spell it. */
function normalizeCourseNames(q) {
  return q.replace(/\bcom\s*-?\s*(\d|i{1,3}|iv|v)\b/g, (_, n) => `com${ROMAN[n] || n}`);
}

/** Subjects a remainder names, best first: [{ entry, score }]. */
function matchSubjects(rest, selectedYear) {
  const tokens = rest.split(/\s+/).filter(Boolean);
  const scores = new Map();
  const bump = (entry, score) => { if (score > (scores.get(entry) || 0)) scores.set(entry, score); };
  for (const entry of subjectIndex()) {
    if (entry.nameTh && entry.nameTh.length >= 4 && rest.includes(entry.nameTh)) bump(entry, 90);
    for (const t of tokens) {
      if (t === entry.id || (entry.code && t === entry.code)) bump(entry, 100);
      else if (t.length >= 4 && /^[a-z0-9-]+$/.test(t)) {
        for (const key of [entry.id, ...entry.parts, ...entry.words]) {
          if (key.startsWith(t)) bump(entry, 60 + Math.round(20 * (t.length / key.length)));
        }
      }
      if (THAI_SHORT[t]?.includes(entry.s.id)) bump(entry, 80);
    }
  }
  const ranked = [...scores].map(([entry, score]) => ({
    entry,
    score: score + (selectedYear != null && Number(entry.year) === Number(selectedYear) ? 15 : 0),
  })).sort((a, b) => b.score - a.score || (a.entry.id < b.entry.id ? -1 : 1));
  if (!ranked.length) return [];
  const best = ranked[0].score;
  return ranked.filter((r) => r.score >= 60 && r.score >= best - 20).slice(0, 3);
}

/**
 * A subject the query names, and what the student wants from it.
 * @returns {{ kind: 'study', want: string|null, subjects: Array<{ meta, year, resources }> } | null}
 */
export function detectStudyIntent(query, { selectedYear } = {}) {
  const q = normalizeCourseNames(String(query || '').toLowerCase().normalize('NFC').trim());
  if (q.length < 3 || SCHEDULE_RE.test(q)) return null;
  // "anatomy ปี 1": the year the student names outranks the one selected.
  const yearHint = /ปี\s*([1-6])/.exec(q);
  const year = yearHint ? Number(yearHint[1]) : selectedYear;
  let want = null;
  let rest = q;
  for (const w of STUDY_WANTS) {
    w.re.lastIndex = 0;
    if (w.re.test(rest)) {
      if (!want) want = w.want;
      w.re.lastIndex = 0;
      rest = rest.replace(w.re, ' ');
    }
  }
  rest = rest.replace(FILLER_RE, ' ').replace(/\s+/g, ' ').trim();
  if (!rest) return null;
  // Without a word for what to open, only a course named outright (its id,
  // its code, its Thai name) earns a card; a partial name is already one of
  // the search results and a card would only repeat it.
  const matches = matchSubjects(rest, year).filter((m) => want || m.score - (year != null && Number(m.entry.year) === Number(year) ? 15 : 0) >= 90);
  if (!matches.length) return null;
  const catalog = createStudyCatalog();
  const subjects = matches.map(({ entry }) => ({
    meta: entry.s,
    year: entry.year,
    resources: catalog.browse({ subject: entry.s.id }).resources || {},
  })).filter((x) => ['questions', 'notes', 'videos', 'wiki'].some((k) => x.resources[k]?.available));
  // A course with nothing behind it would be a card that leads nowhere.
  return subjects.length ? { kind: 'study', want, subjects } : null;
}

// What each shelf is called on the card, and the unit its count is in —
// the same words the topic screen uses for the same shelves.
const SHELVES = {
  practice: { label: 'ฝึกข้อสอบ', unit: 'ข้อ', none: 'ยังไม่มีข้อสอบในวิชานี้' },
  notes: { label: 'สรุปบทเรียน', unit: 'หัวข้อ', none: 'ยังไม่มีสรุปบทเรียนในวิชานี้' },
  videos: { label: 'คลิปย้อนหลัง', unit: 'ชุดวิดีโอ', none: 'ยังไม่มีคลิปในวิชานี้' },
  wiki: { label: 'VetWiki', unit: 'บทความ', none: 'ยังไม่มีบทความ VetWiki ในวิชานี้' },
  library: { label: 'คลังเอกสาร', unit: 'ไฟล์', none: 'ยังไม่มีเอกสารของวิชานี้ในคลัง' },
};
const SHELF_ORDER = ['practice', 'notes', 'videos', 'wiki', 'library'];

/**
 * The buttons a study card shows for one subject: the shelf the student asked
 * for first when it has something on it, otherwise a plain line saying it is
 * empty and the shelves that are not. Only shelves with something behind them
 * become buttons.
 * @param {{ resources }} subject  one entry of detectStudyIntent().subjects
 * @param {string|null} want
 * @param {number} libraryCount  documents for this subject the student can open
 * @returns {{ actions: Array<{ target, label, count, unit }>, missing: string|null }}
 */
export function studyActions(subject, want, libraryCount = 0) {
  const r = subject?.resources || {};
  const counts = {
    practice: r.questions?.available ? r.questions.count : 0,
    notes: r.notes?.available ? r.notes.count : 0,
    videos: r.videos?.available ? r.videos.count : 0,
    wiki: r.wiki?.available ? r.wiki.count : 0,
    library: libraryCount > 0 ? libraryCount : 0,
  };
  const order = want ? [want, ...SHELF_ORDER.filter((t) => t !== want)] : SHELF_ORDER;
  const actions = order
    .filter((t) => counts[t] > 0)
    .map((t) => ({ target: t, label: SHELVES[t].label, count: counts[t], unit: SHELVES[t].unit }));
  return { actions, missing: want && !counts[want] ? SHELVES[want].none : null };
}

/** All intents for a query, strongest first. Cheap enough per keystroke —
 *  one pass over 57 drug names, one regex and the subject index. */
export function detectIntents(query, { selectedYear } = {}) {
  const out = [];
  const dose = detectDoseIntent(query);
  if (dose) out.push(dose);
  const study = detectStudyIntent(query, { selectedYear });
  if (study) out.push(study);
  const course = detectCourseIntent(query);
  // A curriculum course already has its shelves on the study card; the
  // course card stays for courses outside the curriculum (gen-ed).
  if (course && !study?.subjects.some((x) => x.meta.id === course.meta.id)) out.push(course);
  return out;
}
