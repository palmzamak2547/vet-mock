// Friedman rank sum test (R friedman.test) [M2-DESIGN.md 3.1.3]. OWNER: lab role.
//
// Values are ranked within each block (average ranks for ties) and the statistic is R's, with the tie
// correction in the denominator:
//   12 sum_j (R_j - n (k + 1) / 2)^2 / (n k (k + 1) - sum over blocks and tie groups (t^3 - t) / (k - 1))
// on k - 1 df, upper tail from the regularised incomplete gamma (never 1 - cdf). From long data the
// treatments are the levels of `group` and the blocks the values of `subject`; a block without exactly
// one value for every treatment is dropped whole (reason 'incomplete'), as friedman.test refuses a
// design that is not an unreplicated complete block design. Two values for the same block and treatment
// make the analysis invalid (lab.invalid.replicated): averaging them would be a choice the student did
// not make.
import { pchisqUpper } from './dist.js';
import { rankAvg, val, nullVal, testRow, role, completeRows, column, numbersAt, invalid } from './common.js';
import { quantile } from './descriptive.js';

/**
 * @param {number[][]} blocks   one row per block, one column per treatment
 * @returns {{ statistic: number|null, df: number|null, p: number|null, rankSums: number[], reasonKey?: string }}
 */
export function friedman(blocks) {
  const n = blocks.length;
  const k = n ? blocks[0].length : 0;
  const rankSums = new Array(k).fill(0);
  // No complete block: nothing to rank, and no df (review round 1: "df -1" and "needs 2 groups" were shown
  // although there were 3 groups; the real reason is that no animal has a value in every group).
  if (n < 1) return { statistic: null, df: null, p: null, rankSums, reasonKey: 'lab.undefined.noCompleteBlock' };
  if (k < 2) return { statistic: null, df: null, p: null, rankSums, reasonKey: 'lab.undefined.needTwoTreatments' };
  let tieSum = 0;
  for (const b of blocks) {
    const { ranks, ties } = rankAvg(b);
    ranks.forEach((r, j) => { rankSums[j] += r; });
    for (const t of ties) tieSum += t ** 3 - t;
  }
  const center = (n * (k + 1)) / 2;
  let num = 0;
  for (const s of rankSums) num += (s - center) ** 2;
  const den = n * k * (k + 1) - tieSum / (k - 1);
  if (!(den > 0)) return { statistic: null, df: k - 1, p: null, rankSums, reasonKey: 'stats.undefined.allTied' };
  const statistic = (12 * num) / den;
  return { statistic, df: k - 1, p: pchisqUpper(statistic, k - 1), rankSums };
}

/**
 * roles outcome, group (the treatments or times), subject (the blocks); a block with any missing value is dropped whole.
 * @param {import('../runtime/types.js').AnalysisSpec} spec
 * @param {import('../runtime/types.js').WorkingTable|null} table
 * @returns {import('../runtime/registry.js').MethodOutput}
 */
export function runFriedman(spec, table) {
  const yKey = role(spec, 'outcome');
  const gKey = role(spec, 'group') ?? role(spec, 'time');
  const sKey = role(spec, 'subject');
  if (!yKey || !gKey || !sKey) return invalid('stats.error.missingRole');
  const gc = column(table, gKey);
  if (gc.kind !== 'category') throw Object.assign(new Error(`stats: ${gKey} is not a category column`), { key: 'stats.error.needsCategory', detail: gKey });
  const sc = column(table, sKey);
  const { rows, dropped } = completeRows(table, [yKey, gKey, sKey]);
  const y = numbersAt(table, yKey, rows);
  const seen = new Set(rows.map((i) => gc.values[i]));
  const levels = (gc.levels || []).map((l, j) => [l, j]).filter(([, j]) => seen.has(j));
  const idx = new Map(levels.map(([, j], x) => [j, x]));
  const k = levels.length;
  const blocks = new Map();
  for (let r = 0; r < rows.length; r++) {
    const i = rows[r];
    const id = sc.values[i];
    if (!blocks.has(id)) blocks.set(id, { values: new Array(k).fill(null), rows: 0 });
    const b = blocks.get(id);
    const t = idx.get(gc.values[i]);
    if (b.values[t] !== null) return invalid('lab.invalid.replicated', { used: rows.length, dropped });
    b.values[t] = y[r];
    b.rows += 1;
  }
  const complete = [];
  let incompleteRows = 0;
  let incompleteBlocks = 0;
  for (const b of blocks.values()) {
    if (b.values.every((v) => v !== null)) complete.push(b.values);
    else { incompleteRows += b.rows; incompleteBlocks += 1; }
  }
  const allDropped = incompleteRows ? [...dropped, { reason: 'incomplete', column: sKey, count: incompleteRows }] : dropped;
  const used = complete.length * k;
  const r = friedman(complete);
  const median = (xs) => quantile(xs.slice().sort((a, b) => a - b), 0.5, 7);
  const notes = incompleteBlocks ? [{ id: 'incomplete', severity: 'note', key: 'lab.note.incompleteAnimals', params: { animals: incompleteBlocks, rows: incompleteRows } }] : [];
  return {
    status: r.statistic === null ? 'invalid' : 'ok',
    values: { blocks: val(complete.length), treatments: val(k), nIncomplete: val(incompleteBlocks), ...(r.statistic === null ? { reason: nullVal(r.reasonKey) } : {}) },
    tests: [testRow({ id: 'friedman', name: 'chi-squared', statistic: r.statistic, df: r.df, p: r.p, variant: 'tie-corrected', reasonKey: r.reasonKey })],
    tables: [{
      id: 'groups',
      columns: ['level', 'n', 'median', 'rankSum', 'meanRank'],
      rows: levels.map(([l], j) => [l, complete.length, complete.length ? median(complete.map((b) => b[j])) : null, r.rankSums[j], complete.length ? r.rankSums[j] / complete.length : null]),
    }],
    used,
    dropped: allDropped,
    notes,
  };
}
