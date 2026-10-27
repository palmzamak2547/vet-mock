// ============================================================
// ai/subjects.js — which course a student means
// ============================================================
// "ขอข้อสอบ COM5", "ข้อสอบ COM V", "3107417", "คลินิกสัตว์น้ำ", "epidem" all
// name a course in curriculum.js. The planner is given the id list and
// usually answers with an id; this is the deterministic half: it reads ids,
// codes, Thai and English names, the "COM V" → com5 numbering, and a few
// unambiguous nicknames straight out of the text, and it is the only way a
// subject id gets into a quiz or an action (a model's id is re-checked here).
//
// Ambiguous nicknames (ม้า: medicine or reproduction? สัตว์ปีก: year 4 or
// year 5?) are deliberately absent. Picking one for the student would hand
// them the wrong course's questions with full confidence.
// ============================================================

import { SUBJECTS } from '../../../src/data/curriculum.js';

const ROMAN = { i: 1, ii: 2, iii: 3, iv: 4, v: 5, vi: 6 };

// Shorthand students actually type, each naming exactly one course.
const NICKNAMES = {
  epidemiology: ['ระบาด', 'ระบาดวิทยา', 'epid', 'epidem', 'epidemio'],
  zoonoses: ['zoonosis', 'ซูโนซิส', 'ซูโนซีส'],
  'one-health': ['one health', 'ohvph'],
  'food-industry': ['fiqc'],
  'poa-clinical': ['poa'],
  'rec-adv-bioscience': ['ravb'],
  'aquatic-clinic': ['สัตว์น้ำ', 'aqua', 'aquatic'],
  vca: ['vca'],
  'milk-meat-hygiene': ['milk meat', 'meat inspection', 'milk hygiene'],
  'swine-clinic': ['swine medicine', 'swine med'],
  'equine-medicine': ['equine med'],
  'repro-lect': ['repro lecture', 'repro lect'],
  exotic: ['wildlife', 'exotic'],
};

const norm = (s) => String(s || '').toLowerCase().normalize('NFC').replace(/[_]+/g, ' ').replace(/\s+/g, ' ').trim();

let table = null;
function aliasTable() {
  if (table) return table;
  const rows = [];
  const add = (alias, id) => {
    const a = norm(alias);
    if (a.length >= 3 && !rows.some((r) => r.alias === a)) rows.push({ alias: a, id });
  };
  for (const s of SUBJECTS) {
    if (s.id === 'all') continue;
    add(s.id, s.id);
    if (s.id.includes('-')) add(s.id.replace(/-/g, ' '), s.id);
    if (s.code && /^\d{7}$/.test(s.code)) add(s.code, s.id);
    if (s.name) add(s.name, s.id);
    if (s.name_en && s.name_en.length <= 60) add(s.name_en, s.id);
    // COM V ↔ com5 ↔ com 5
    const m = /^com\s*(\d|i{1,3}|iv|vi?)$/i.exec(norm(s.name)) || /^com(\d)$/.exec(s.id);
    if (m) {
      const n = /\d/.test(m[1]) ? Number(m[1]) : ROMAN[m[1].toLowerCase()];
      add(`com${n}`, s.id);
      add(`com ${n}`, s.id);
    }
  }
  for (const [id, list] of Object.entries(NICKNAMES)) {
    if (!SUBJECTS.some((s) => s.id === id)) continue;
    for (const a of list) add(a, id);
  }
  rows.sort((a, b) => b.alias.length - a.alias.length);
  table = rows.map((r) => ({
    ...r,
    // Latin aliases match as whole words; Thai ones as substrings (Thai has no spaces).
    re: /[a-z0-9]/.test(r.alias) ? new RegExp(`(?:^|[^a-z0-9])${r.alias.replace(/[.*+?^${}()|[\]\\]/g, '\\$&')}(?![a-z0-9])`) : null,
  }));
  return table;
}

const KNOWN = new Set(SUBJECTS.filter((s) => s.id !== 'all').map((s) => s.id));

/** Subject ids named in a text, in order of first appearance, longest names first. */
export function subjectsInText(text) {
  let t = norm(text);
  const found = [];
  for (const row of aliasTable()) {
    let at = -1;
    if (row.re) {
      const m = row.re.exec(t);
      if (m) at = m.index + (m[0].length - row.alias.length);
    } else {
      at = t.indexOf(row.alias);
    }
    if (at < 0) continue;
    if (!found.some((f) => f.id === row.id)) found.push({ id: row.id, at });
    // Blank the match so a shorter alias inside it ("com 5" inside a code-less
    // name) cannot fire a second, wrong course.
    t = t.slice(0, at) + ' '.repeat(row.alias.length) + t.slice(at + row.alias.length);
  }
  return found.sort((a, b) => a.at - b.at).map((f) => f.id);
}

/** A model-supplied subject reference → a real id, or null. */
export function resolveSubjectRef(ref) {
  const r = norm(ref);
  if (!r) return null;
  if (KNOWN.has(r)) return r;
  return subjectsInText(r)[0] || null;
}

export const isKnownSubject = (id) => KNOWN.has(id);
