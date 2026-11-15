// The defect sweep's counts against its baseline (tests/e2e/defect-baseline.json), shared by
// scripts/defect-sweep.mjs and tests/unit/defect-baseline.test.mjs. A count is the number of findings
// one detector made that no allow-list row explains, over one full sweep of the built app.
export const DETECTORS = ['overlap', 'overflow-x', 'clipped', 'off-screen', 'target', 'raw', 'console', 'shift', 'dead', 'stuck', 'contrast', 'focus'];

/** Counts per detector from findings rows (allowed rows, sweep notes and the dev pass's layout rows left out). */
export function countFindings(rows) {
  const counts = Object.fromEntries(DETECTORS.map((d) => [d, 0]));
  for (const r of rows) {
    if (!r || r.allowed || r.unreached || !(r.detector in counts)) continue;
    if (r.build === 'dev' && r.detector !== 'console') continue; // the dev pass is read for React's warnings only
    counts[r.detector] += 1;
  }
  return counts;
}

/**
 * over: a detector above its baseline. under: below it (record it with --write).
 * rose: the baseline itself above main's, so a hand edit cannot raise it either.
 */
export function compareBaseline(counts, baseline, main = null) {
  const over = []; const under = []; const rose = [];
  for (const d of DETECTORS) {
    const have = counts[d] ?? 0; const allowed = baseline[d] ?? 0;
    if (have > allowed) over.push(`${d}: ${have} > baseline ${allowed}`);
    else if (have < allowed) under.push(`${d}: ${have} < baseline ${allowed}`);
    if (main && (baseline[d] ?? 0) > (main[d] ?? 0)) rose.push(`${d}: ${baseline[d]} > main's ${main[d] ?? 0}`);
  }
  return { over, under, rose };
}

/** The baseline after a sweep: each number lowered to what was counted, never raised. */
export function lowerBaseline(counts, baseline) {
  return Object.fromEntries(DETECTORS.map((d) => [d, Math.min(baseline[d] ?? 0, counts[d] ?? 0)]));
}

/** The file's shape: every detector, each a whole number of zero or more, nothing else. */
export function baselineProblems(file) {
  const problems = [];
  if (!file || typeof file !== 'object' || !file.counts || typeof file.counts !== 'object') return ['no counts object'];
  for (const d of DETECTORS) {
    if (!Number.isInteger(file.counts[d]) || file.counts[d] < 0) problems.push(`${d} is not a whole number of zero or more`);
  }
  for (const k of Object.keys(file.counts)) if (!DETECTORS.includes(k)) problems.push(`${k} is not a detector`);
  return problems;
}
