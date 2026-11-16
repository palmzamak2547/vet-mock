// The text of src/data/bank-registry.generated.js. Pure: entries in, text out
// (scripts/regen-bank-registry.mjs passes the real banks, the unit tests pass
// small ones).
//
// Each bank is three lines: its file, export and year, its subjects, and its
// loader. The first and last lines name the bank, so a change to one bank's
// subjects is never next to a change or an insertion at another bank.
//
// No count is stored. A bank's count moves with every question added to any
// of its topics, so two pull requests adding to different topics of one bank
// both wrote the same new count, git took it once, and the registry came out
// one short. Whoever needs a bank's size loads it.
//
// A bank's subjects and year are worked out over all its topics too. When a
// bank holds more than one subject or year, its subjects line ends with a
// digest of the subject, topic and year of every question, so two pull
// requests that each empty a different topic of one subject still meet on
// that line instead of both keeping a subject neither left in the bank. A bank
// of one subject and one year gets none: adding a topic to it stays clean.

import { digestOf } from './merge-friendly.mjs';

/**
 * Registry order: year ascending (null last), then file name by code unit.
 * Never localeCompare: without an explicit locale it follows the machine's
 * ICU, and Thai collation ignores the '.', so a th-TH machine sorted
 * [lect2, lect3, lect4, lect] where CI sorts [lect, lect2, lect3, lect4].
 */
export function compareRegistryEntries(a, b) {
  const ay = a.year ?? 99;
  const by = b.year ?? 99;
  if (ay !== by) return ay - by;
  return a.file < b.file ? -1 : a.file > b.file ? 1 : 0;
}

/**
 * @param {{ file: string, export: string, year: number | null, subjects: string[], leaves: unknown[][] }[]} entries
 *   already in registry order; `leaves` holds [subject, topic, year] of each question
 */
export function renderBankRegistry(entries) {
  const L = [];
  L.push('// ============================================================');
  L.push('// bank-registry.generated.js — AUTO-GENERATED, do NOT hand-edit');
  L.push('// ============================================================');
  L.push('// Run `npm run regen:registry` after adding/removing a questions-*.js');
  L.push('// bank or changing its export name / per-question year. Consumed by');
  L.push('// data/questions.js to build the lazy LOADERS. Literal import() strings');
  L.push('// below keep Vite per-bank chunk-splitting intact.');
  L.push('// One bank per three lines and no count or total, so pull requests that');
  L.push('// change different topics merge by themselves (scripts/lib/bank-registry-text.mjs).');
  L.push('// ============================================================');
  L.push('');
  L.push('export const BANK_REGISTRY = [');
  for (const e of entries) {
    const subj = e.subjects.map((s) => `'${s}'`).join(', ');
    L.push(`  { file: '${e.file}', export: '${e.export}', year: ${e.year === null ? 'null' : e.year},`);
    const where = new Set(e.leaves.map((leaf) => JSON.stringify(leaf)));
    const years = new Set(e.leaves.map((leaf) => leaf[2] ?? null));
    const tail = e.subjects.length > 1 || years.size > 1 ? ` // ${digestOf(where)}` : '';
    L.push(`    subjects: [${subj}],${tail}`);
    L.push(`    load: () => import('./${e.file}').then((m) => m.${e.export}) },`);
  }
  L.push('];');
  L.push('');
  return L.join('\n');
}
