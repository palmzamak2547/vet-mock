// The text of src/data/bank-registry.generated.js. Pure: entries in, text out
// (scripts/regen-bank-registry.mjs passes the real banks, the unit tests pass
// small ones).
//
// Each bank is three lines: its file, export and year (which never change),
// its count and subjects (the line a pull request changes), and its loader.
// The first and last lines name the bank, so a change to one bank's count is
// never next to a change or an insertion at another bank, and two pull
// requests that touch different banks merge by themselves. No total and no
// build time is written: a reader sums the counts.

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
 * @param {{ file: string, export: string, year: number | null, count: number, subjects: string[] }[]} entries
 *   already in registry order
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
  L.push('// One bank per three lines and no total, so pull requests that change');
  L.push('// different banks merge by themselves (scripts/lib/merge-friendly.mjs).');
  L.push('// ============================================================');
  L.push('');
  L.push('export const BANK_REGISTRY = [');
  for (const e of entries) {
    const subj = e.subjects.map((s) => `'${s}'`).join(', ');
    L.push(`  { file: '${e.file}', export: '${e.export}', year: ${e.year === null ? 'null' : e.year},`);
    L.push(`    count: ${e.count}, subjects: [${subj}],`);
    L.push(`    load: () => import('./${e.file}').then((m) => m.${e.export}) },`);
  }
  L.push('];');
  L.push('');
  return L.join('\n');
}
