// Cronbach's alpha, standardized alpha, item-rest correlations and alpha if an item is dropped, with the
// Feldt (1965) interval (psych 2.6.5 alpha) [M2-DESIGN.md 3.3.3].
// OWNER: measure role.
//
// Sources: Cronbach LJ. Coefficient alpha and the internal structure of tests. Psychometrika
// 1951;16:297-334 (alpha = k / (k - 1) (1 - sum of item variances / variance of the total)).
// Feldt LS. The approximate sampling distribution of Kuder-Richardson reliability coefficient twenty.
// Psychometrika 1965;30:357-370 (with n respondents and k items, (1 - alpha_pop) / (1 - alpha) follows
// F(n - 1, (n - 1)(k - 1)); interval 1 - (1 - alpha) F(1 - a/2) to 1 - (1 - alpha) F(a/2), as psych's
// alpha.ci). Standardized alpha = k rbar / (1 + (k - 1) rbar), rbar the mean correlation between
// distinct items (psych std.alpha). Item-rest correlation = Pearson r of the item with the sum of the
// other items (psych r.drop, the "corrected item-total correlation" of SPSS RELIABILITY). Alpha if
// dropped = raw alpha of the other k - 1 items (psych alpha.drop raw_alpha).
//
// Items are number columns, or ordinal category columns whose every level is a number written as text
// (a Likert item coded 1 to 5): the score is the number the level says, never its position. A row with a
// missing answer to any item is dropped whole and counted against the first item it misses.
import { qf } from '../stats/dist.js';
import { mean, sumSqDev } from '../stats/common.js';
import { pearsonR } from '../stats/correlation.js';
import { getColumn, eachRow, invalidOutput, val, nul, guarded } from './_table.js';

function err(key) { return Object.assign(new Error(key), { key }); }

/** Sample variance (n - 1). */
function vr(xs) { return sumSqDev(xs, mean(xs)) / (xs.length - 1); }

/** Raw alpha of the columns of `cols` (arrays of equal length); NaN when undefined. */
export function rawAlpha(cols) {
  const k = cols.length, n = cols[0]?.length ?? 0;
  if (k < 2 || n < 2) return NaN;
  const total = new Array(n).fill(0);
  let sumVar = 0;
  for (const c of cols) { sumVar += vr(c); for (let i = 0; i < n; i++) total[i] += c[i]; }
  const vt = vr(total);
  if (!(vt > 0)) return NaN;
  return (k / (k - 1)) * (1 - sumVar / vt);
}

/**
 * Feldt (1965) interval for alpha.
 * @returns {[number, number]}
 */
export function feldtCi(alpha, n, k, confLevel = 0.95) {
  const a = 1 - confLevel;
  const d1 = n - 1, d2 = (n - 1) * (k - 1);
  return [1 - (1 - alpha) * qf(1 - a / 2, d1, d2), 1 - (1 - alpha) * qf(a / 2, d1, d2)];
}

/**
 * Everything the result shows, from item scores.
 * @param {number[][]} cols  one array per item, respondents in the same order
 * @param {{ ciMethod?: 'feldt'|'none', confLevel?: number }} [opts]
 */
export function cronbach(cols, opts = {}) {
  const k = cols.length, n = cols[0]?.length ?? 0;
  const conf = opts.confLevel ?? 0.95;
  const ciMethod = opts.ciMethod ?? 'feldt';
  if (k < 2) throw err('measure.error.needTwoItems');
  const out = { n, k, alpha: null, alphaCi: [null, null], alphaReason: null, standardized: null, standardizedReason: null, items: [] };
  if (n < 2) {
    out.alphaReason = n === 0 ? 'measure.undefined.noRespondents' : 'measure.undefined.needTwoRespondents';
    out.standardizedReason = out.alphaReason;
    out.items = cols.map((c) => ({ mean: n ? c[0] : null, sd: null, itemRest: null, itemRestReason: out.alphaReason, alphaIfDropped: null, alphaIfDroppedReason: out.alphaReason }));
    return out;
  }
  const a = rawAlpha(cols);
  if (Number.isNaN(a)) out.alphaReason = 'measure.undefined.noTotalVariance';
  else {
    out.alpha = a;
    if (ciMethod === 'feldt') out.alphaCi = feldtCi(a, n, k, conf);
  }
  const sds = cols.map((c) => Math.sqrt(vr(c)));
  if (sds.some((s) => !(s > 0))) out.standardizedReason = 'measure.undefined.itemNoVariance';
  else {
    let sum = 0, pairs = 0;
    for (let i = 0; i < k; i++) for (let j = i + 1; j < k; j++) { sum += pearsonR(cols[i], cols[j]); pairs++; }
    const rbar = sum / pairs;
    out.standardized = (k * rbar) / (1 + (k - 1) * rbar);
  }
  for (let j = 0; j < k; j++) {
    const rest = new Array(n).fill(0);
    const others = cols.filter((_, i) => i !== j);
    for (const c of others) for (let i = 0; i < n; i++) rest[i] += c[i];
    const r = pearsonR(cols[j], rest);
    const item = { mean: mean(cols[j]), sd: sds[j], itemRest: null, itemRestReason: null, alphaIfDropped: null, alphaIfDroppedReason: null };
    if (Number.isNaN(r)) item.itemRestReason = !(sds[j] > 0) ? 'measure.undefined.itemNoVariance' : 'measure.undefined.restNoVariance';
    else item.itemRest = r;
    if (k < 3) item.alphaIfDroppedReason = 'measure.undefined.oneItemLeft';
    else {
      const ad = rawAlpha(others);
      if (Number.isNaN(ad)) item.alphaIfDroppedReason = 'measure.undefined.noTotalVariance';
      else item.alphaIfDropped = ad;
    }
    out.items.push(item);
  }
  return out;
}

/** Score reader for one item column: number, or an ordinal level whose text is a number. */
function scoreReader(col) {
  if (col.kind === 'number') return (r) => col.values[r];
  if (col.kind === 'category') {
    const scores = (col.levels || []).map((l) => {
      const s = String(l).trim().replace(/[๐-๙]/g, (ch) => String(ch.charCodeAt(0) - 0x0e50));
      return /^[+-]?\d+(\.\d+)?$/.test(s) ? Number(s) : NaN;
    });
    if (scores.some((x) => Number.isNaN(x))) throw err('measure.error.itemsNeedScores');
    return (r) => scores[col.values[r]];
  }
  throw err('measure.error.itemsNeedScores');
}

/**
 * Implementation for 'rel.cronbach'. Roles items[] (two or more number columns, or ordinal columns whose
 * levels are numbers); rows with a missing item are dropped and counted; options ciMethod, confLevel.
 * Table 'items' (item, mean, sd, itemRest, alphaIfDropped) in the order the items were chosen.
 * @param {import('../runtime/types.js').AnalysisSpec} spec
 * @param {import('../runtime/types.js').WorkingTable|null} table
 * @returns {import('../runtime/registry.js').MethodOutput}
 */
export function runCronbach(spec, table) {
  return guarded(() => {
    if (!table) return invalidOutput('measure.error.noData');
    const o = spec.options || {};
    const conf = o.confLevel ?? 0.95;
    const raw = spec.roles?.items;
    const keys = Array.isArray(raw) ? raw : raw ? [raw] : [];
    if (keys.length < 2) return invalidOutput('measure.error.needTwoItems');
    if (new Set(keys).size !== keys.length) return invalidOutput('measure.error.sameColumnTwice');
    const readers = keys.map((key) => scoreReader(getColumn(table, key)));
    const cols = keys.map(() => []);
    const res = eachRow(table, keys, (r) => { readers.forEach((rd, j) => cols[j].push(rd(r))); return undefined; });
    const c = cronbach(cols, { ciMethod: o.ciMethod, confLevel: conf });
    const values = {
      n: val(c.n),
      k: val(c.k),
      alpha: c.alpha === null ? nul(c.alphaReason)
        : val(c.alpha, (o.ciMethod ?? 'feldt') === 'feldt' ? { ci: c.alphaCi, ciLevel: conf, ciMethod: 'feldt-1965' } : {}),
      alphaStandardized: c.standardized === null ? nul(c.standardizedReason) : val(c.standardized),
    };
    const notes = [];
    if (c.alpha !== null && c.alpha < 0) notes.push({ id: 'alphaNegative', severity: 'note', key: 'measure.note.alphaNegative' });
    const negative = keys.filter((_, j) => c.items[j].itemRest !== null && c.items[j].itemRest < 0);
    if (negative.length) notes.push({ id: 'itemRestNegative', severity: 'note', key: 'measure.note.itemRestNegative', params: { count: negative.length, columns: negative } });
    if (c.k === 2) notes.push({ id: 'twoItems', severity: 'note', key: 'measure.note.twoItems' });
    return {
      status: 'ok', values, tests: [],
      tables: [{
        id: 'items', columns: ['item', 'mean', 'sd', 'itemRest', 'alphaIfDropped'],
        rows: keys.map((key, j) => [key, c.items[j].mean, c.items[j].sd, c.items[j].itemRest, c.items[j].alphaIfDropped]),
      }],
      used: res.used, dropped: res.dropped, notes,
    };
  });
}
