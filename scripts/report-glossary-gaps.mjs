#!/usr/bin/env node
// ============================================================
// report-glossary-gaps.mjs — terms students meet with no card to tap
// ============================================================
// A term in a question opens a definition only when the glossary has an entry
// scoped to that question's subject. On 2026-09-22 3 of 346 aquatic questions
// (0.9%) had one, against about one in four overall, because no entry used
// the aquatic family: WSSV, EHP, hepatopancreas and Aeromonas were plain text.
//
// This lists, per subject, the words that five or more of its questions use
// (stem, explanation, model answer) and that no in-scope entry resolves. It is
// a worklist for authors, not a gate: a word on it may not deserve a card, and
// a card must still be written from the subject's own notes or recordings.
//
// Usage: node scripts/report-glossary-gaps.mjs [--subject <id>] [--min 5] [--top 25]
// ============================================================
import path from 'node:path';
import { fileURLToPath, pathToFileURL } from 'node:url';

// Words common enough in the bank's English that they are never a term.
const PLAIN = new Set(`
acute chronic clinical disease diseases infection infections infected virus viruses viral bacteria bacterial
treatment treatments temperature syndrome necrosis mortality pathogen pathogens diagnosis parasite parasites
parasitic system systemic protein proteins oxygen ammonia nitrite nitrate quality species animal animals
culture cultured positive negative control organic hemorrhage hemorrhagic secondary primary antibiotic
antibiotics vaccine vaccines vaccination immunity response larvae juvenile lesion lesions freshwater saltwater
marine aquatic aquarium aquaculture ornamental shrimp frog frogs turtle turtles tortoise tortoises amphibian
amphibians reptile reptiles gram environment environmental management production commercial condition
conditions function functions structure structures specific associated increase decrease between including
because however therefore symptoms swimming abnormal behavior behaviour transmission prevention outbreak
outbreaks examination sample samples important different disinfection concentration population
`.trim().split(/\s+/));

const TOKEN = /(?<![A-Za-z0-9])([A-Z][A-Za-z0-9-]{2,}|[a-z][a-z-]{6,})(?![A-Za-z0-9])/g;

const textOf = (q) => `${q.q || ''}\n${q.explain || ''}\n${q.model_answer || ''}`;

/**
 * @param questions bank rows
 * @param resolve (term, subject) -> entry | null, as the term detector uses it
 * @param covered (text, subject) -> [{ start, end }] spans that already open a
 *   card (detectTerms). A word inside one ("antennal" in "antennal gland") is
 *   not a gap, and listing it would send an author to write a card that exists.
 * @returns [{ subject, term, questions }] for terms used by >= minQuestions
 */
export function glossaryGaps(questions, { resolve, covered = null, minQuestions = 5, subjects = null } = {}) {
  const bySubject = new Map();
  for (const q of questions) {
    if (!q?.subject || (subjects && !subjects.has(q.subject))) continue;
    const seen = new Set();
    const counts = bySubject.get(q.subject) || new Map();
    bySubject.set(q.subject, counts);
    let text = textOf(q);
    // Blank each covered span with spaces of the same length, so the offsets
    // of the spans after it still hold.
    for (const s of covered ? covered(text, q.subject) : []) {
      text = text.slice(0, s.start) + ' '.repeat(s.end - s.start) + text.slice(s.end);
    }
    for (const m of text.matchAll(TOKEN)) {
      const key = m[1].toLowerCase();
      if (PLAIN.has(key) || seen.has(key)) continue;
      seen.add(key);
      const c = counts.get(key) || { n: 0, spellings: new Map() };
      c.n++;
      c.spellings.set(m[1], (c.spellings.get(m[1]) || 0) + 1);
      counts.set(key, c);
    }
  }
  const gaps = [];
  for (const [subject, counts] of [...bySubject].sort(([a], [b]) => a.localeCompare(b))) {
    const rows = [];
    for (const [, c] of counts) {
      if (c.n < minQuestions) continue;
      const term = [...c.spellings].sort((a, b) => b[1] - a[1])[0][0];
      if (resolve(term, subject)) continue;
      rows.push({ subject, term, questions: c.n });
    }
    gaps.push(...rows.sort((a, b) => b.questions - a.questions || a.term.localeCompare(b.term)));
  }
  return gaps;
}

if (process.argv[1] && import.meta.url === pathToFileURL(process.argv[1]).href) {
  const root = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..');
  const arg = (name, fallback) => { const i = process.argv.indexOf(name); return i > 0 ? process.argv[i + 1] : fallback; };
  const { QB, loadQB } = await import(pathToFileURL(path.join(root, 'src/data/questions.js')).href);
  const { resolveGlossaryEntry } = await import(pathToFileURL(path.join(root, 'src/data/glossary.js')).href);
  const { isQuestionDeliverable } = await import(pathToFileURL(path.join(root, 'src/data/question-delivery.generated.js')).href);
  const { detectTerms } = await import(pathToFileURL(path.join(root, 'src/lib/term-detect.js')).href);
  await loadQB();
  const only = arg('--subject', null);
  const top = Number(arg('--top', 25));
  const gaps = glossaryGaps(QB.filter(isQuestionDeliverable), {
    resolve: resolveGlossaryEntry,
    covered: detectTerms,
    minQuestions: Number(arg('--min', 5)),
    subjects: only ? new Set([only]) : null,
  });
  const bySubject = new Map();
  for (const g of gaps) bySubject.set(g.subject, [...(bySubject.get(g.subject) || []), g]);
  for (const [subject, rows] of bySubject) {
    console.log(`${subject}: ${rows.length} term(s) with no in-scope card`);
    console.log(`  ${rows.slice(0, top).map((g) => `${g.term} ${g.questions}`).join(', ')}`);
  }
  if (!gaps.length) console.log('no gaps at this threshold');
}
