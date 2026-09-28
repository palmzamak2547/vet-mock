// Random selection from a sampling frame (the project dataset: one row per farm or animal): simple,
// systematic with a random start, stratified with proportional or equal allocation [M2-DESIGN.md 7].
// Pure; every draw comes from the seeded generator in random.js in the order written below
// (tests/fixtures/plan/golden.py reproduces it in Python). OWNER: ui-tools role.
//
// The frame is the rows in use, in table order (rows a recipe step excluded are not in the frame).
// - 'simple': without replacement by a forward partial Fisher-Yates: for i = 0..n-1, j = i +
//   bounded(N - i), swap positions i and j; the first n positions are the sample, in the order drawn.
// - 'systematic': k = N / n (a real number); start = u k with u = nextUint32() / 2^32, so start is in
//   [0, k); unit i (0-based) is frame position floor(start + i k).
// - 'stratified': strata are the levels of the strata column in codebook order (a row without a
//   stratum is left out and counted); allocation 'proportional' gives n N_h / N rounded down, the
//   units left over going to the largest remainders (ties to the earlier stratum), 'equal' gives
//   n / H the same way; each stratum is then drawn as 'simple', strata in level order.
import { createRng, GENERATOR, isSeed } from './random.js';

const nul = (reasonKey) => ({ value: null, reasonKey });
const val = (value) => ({ value });

/**
 * Largest-remainder rounding of shares that sum to n (ties to the earlier entry).
 * @param {number[]} weights  non-negative, sum > 0
 * @param {number} n
 * @returns {number[]}
 */
export function largestRemainder(weights, n) {
  const total = weights.reduce((a, b) => a + b, 0);
  const exact = weights.map((w) => (n * w) / total);
  const out = exact.map((x) => Math.floor(x + 1e-12));
  let left = n - out.reduce((a, b) => a + b, 0);
  const order = exact.map((x, i) => ({ i, r: x - Math.floor(x + 1e-12) })).sort((a, b) => b.r - a.r || a.i - b.i);
  for (let k = 0; left > 0 && k < order.length; k += 1, left -= 1) out[order[k].i] += 1;
  return out;
}

/**
 * Positions drawn from a frame of size N: 'simple' (n of them, in the order drawn) or 'systematic'.
 * @param {{ bounded: (n: number) => number, nextUint32: () => number }} rng
 * @returns {{ positions: number[], interval?: number, start?: number }}
 */
export function drawPositions(rng, N, n, scheme) {
  if (scheme === 'systematic') {
    const k = N / n;
    const start = (rng.nextUint32() / 4294967296) * k;
    const positions = [];
    for (let i = 0; i < n; i += 1) positions.push(Math.min(N - 1, Math.floor(start + i * k)));
    return { positions, interval: k, start };
  }
  const idx = Array.from({ length: N }, (_, i) => i);
  for (let i = 0; i < n; i += 1) {
    const j = i + rng.bounded(N - i);
    const tmp = idx[i];
    idx[i] = idx[j];
    idx[j] = tmp;
  }
  return { positions: idx.slice(0, n) };
}

/** Text of a stratum cell, or null when it is missing. */
function stratumOf(col, r) {
  if (!col) return null;
  if (col.missing?.[r]) return null;
  const v = col.values[r];
  if (col.kind === 'category') return v >= 0 ? col.levels[v] : null;
  if (col.kind === 'number' || col.kind === 'date') return Number.isNaN(v) ? null : String(v);
  return v == null || v === '' ? null : String(v);
}

/**
 * input dataset; options size, seed, stream, scheme, allocation; roles strata (for 'stratified'); options scheme, allocation.
 * Table 'selected' (row id, stratum, order drawn) and 'strata' (stratum, frame, selected); values seed,
 * stream, frame, size, interval (systematic).
 * @param {import('../runtime/types.js').AnalysisSpec} spec
 * @param {import('../runtime/types.js').WorkingTable|null} table
 * @returns {import('../runtime/registry.js').MethodOutput}
 */
export function runSampling(spec, table) {
  const opts = spec?.options || {};
  const scheme = opts.scheme || 'simple';
  const bad = (key) => ({ status: 'invalid', values: { size: nul(key) }, tests: [], tables: [], used: 0, dropped: [], notes: [{ id: 'plan', severity: 'note', key }] });
  if (!table) return bad('tools.invalid.noFrame');
  // A dataset spec carries no params object: the size, seed and stream are options (plan.options.js),
  // so the provenance line and the log hold them with the other settings.
  const size = Number(opts.size);
  const seed = Number(opts.seed);
  const streamRaw = opts.stream;
  const stream = streamRaw === undefined || streamRaw === null ? GENERATOR.defaultStream : Number(streamRaw);
  if (!isSeed(seed)) return bad('tools.invalid.seed');
  if (!isSeed(stream)) return bad('tools.invalid.stream');

  const excluded = table.excluded || {};
  const frame = [];
  for (let r = 0; r < table.n; r += 1) if (!excluded[table.rowIds[r]]) frame.push(r);
  const dropped = [];
  let strataKey = null;
  if (scheme === 'stratified') {
    strataKey = Array.isArray(spec.roles?.strata) ? spec.roles.strata[0] : spec.roles?.strata;
    if (!strataKey || !table.columns[strataKey]) return bad('tools.invalid.strataColumn');
  }
  const col = strataKey ? table.columns[strataKey] : null;
  let rows = frame;
  if (col) {
    const kept = [];
    let missing = 0;
    for (const r of frame) { if (stratumOf(col, r) === null) missing += 1; else kept.push(r); }
    if (missing) dropped.push({ reason: 'missing', column: strataKey, count: missing });
    rows = kept;
  }
  const N = rows.length;
  if (!Number.isInteger(size) || size < 1) return bad('tools.invalid.size');
  if (size > N) return { ...bad('tools.invalid.sizeTooLarge'), values: { size: nul('tools.invalid.sizeTooLarge'), frame: val(N) } };

  const rng = createRng(seed, stream);
  const selected = [];
  const strataRows = [];
  const values = { seed: val(seed), stream: val(stream), frame: val(N), size: val(size) };
  if (scheme === 'stratified') {
    const names = col.kind === 'category' ? col.levels.slice() : [];
    const groups = new Map(names.map((nm) => [nm, []]));
    for (const r of rows) {
      const s = stratumOf(col, r);
      if (!groups.has(s)) groups.set(s, []);
      groups.get(s).push(r);
    }
    const list = [...groups.entries()].filter(([, rs]) => rs.length > 0);
    const alloc = opts.allocation === 'equal' ? largestRemainder(list.map(() => 1), size) : largestRemainder(list.map(([, rs]) => rs.length), size);
    const tooSmall = list.findIndex(([, rs], i) => alloc[i] > rs.length);
    if (tooSmall >= 0) return { ...bad('tools.invalid.stratumTooSmall'), notes: [{ id: 'plan', severity: 'note', key: 'tools.invalid.stratumTooSmall', params: { stratum: list[tooSmall][0], n: alloc[tooSmall], frame: list[tooSmall][1].length } }] };
    list.forEach(([name, rs], i) => {
      const { positions } = drawPositions(rng, rs.length, alloc[i], 'simple');
      for (const pos of positions) selected.push([table.rowIds[rs[pos]], name, selected.length + 1]);
      strataRows.push([name, rs.length, alloc[i]]);
    });
  } else {
    const { positions, interval } = drawPositions(rng, N, size, scheme === 'systematic' ? 'systematic' : 'simple');
    for (const pos of positions) selected.push([table.rowIds[rows[pos]], null, selected.length + 1]);
    if (interval !== undefined) values.interval = val(interval);
  }
  return {
    status: 'ok',
    values,
    tests: [],
    tables: [
      { id: 'selected', columns: ['rowId', 'stratum', 'order'], rows: selected },
      ...(strataRows.length ? [{ id: 'strata', columns: ['stratum', 'frame', 'selected'], rows: strataRows }] : []),
    ],
    used: N,
    dropped,
  };
}
