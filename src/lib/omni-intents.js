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
import { SUBJECTS } from '../data/curriculum.js';

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

  return {
    kind: 'dose',
    drug: best.drug,
    weightKg,
    species,
    dose: drugDose(best.drug, weightKg, species),
    perKg: drugDose(best.drug, null, species),
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

/** All intents for a query, strongest first. Cheap enough per keystroke —
 *  one pass over 57 drug names + one regex. */
export function detectIntents(query) {
  const out = [];
  const dose = detectDoseIntent(query);
  if (dose) out.push(dose);
  const course = detectCourseIntent(query);
  if (course) out.push(course);
  return out;
}
