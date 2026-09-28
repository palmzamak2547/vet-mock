// Randomisation lists (simple, permuted blocks with block sizes drawn from a list, stratified blocks) and
// blinding codes, as a method so the list carries its envelope, seed and options [M2-DESIGN.md 7].
// Pure; every draw comes from the seeded generator in random.js, in the order written below, so any
// language with PCG32 reproduces the list from the seed (tests/fixtures/plan/golden.py does, in Python).
// OWNER: ui-tools role.
//
// Order of draws (the contract the golden lists pin):
// 1. rng = PCG32(seed, stream). Units are listed stratum by stratum in the order the strata were typed
//    (one unnamed stratum when the scheme is not stratified).
// 2. 'simple': for each unit, k = bounded(R) with R the ratio sum; the arm is the first whose running
//    ratio sum exceeds k.
//    'block' and 'stratified-block': while units remain in the stratum, the block size is
//    blockSizes[bounded(len)] when more than one size is offered (no draw when one size is given);
//    the block holds arm i ratio_i x size / R times, in arm order, then is shuffled (Fisher-Yates from
//    the last index down); units take the block in order; a last block the stratum cannot fill is cut
//    and a note says so.
// 3. Blinding codes (when asked) after the whole list, one per unit in list order: four letters, each
//    ALPHABET[bounded(19)], then two digits, each bounded(10); a code already given is drawn again.
import { createRng, GENERATOR, isSeed } from './random.js';

/** Letters without look-alikes (no B, G, I, O, Q, S, Z) [M2-DESIGN.md 7]. */
export const CODE_ALPHABET = 'ACDEFHJKLMNPRTUVWXY';

/** Limits the screen and the method share. */
export const LIMITS = Object.freeze({ maxUnits: 10000, maxArms: 10, maxRatio: 10, maxStrata: 50, maxBlock: 100, maxBlockSizes: 6 });

const nul = (reasonKey) => ({ value: null, reasonKey });
const val = (value) => ({ value });

/**
 * Settings from spec params and options, or the i18n key of the first thing wrong with them.
 * @param {Record<string, any>} params  n or strata + strataN, arms, ratio, seed, stream
 * @param {Record<string, any>} options scheme, blockSizes, blinding
 * @returns {{ ok: true, settings: { scheme: string, arms: string[], ratio: number[], strata: { name: string|null, n: number }[], blockSizes: number[], blinding: boolean, seed: number, stream: number } } | { ok: false, key: string, params?: Record<string, any> }}
 */
export function checkRandomisation(params = {}, options = {}) {
  const scheme = options.scheme || 'block';
  if (!['simple', 'block', 'stratified-block'].includes(scheme)) return { ok: false, key: 'tools.invalid.scheme' };
  const arms = Array.isArray(params.arms) ? params.arms.map((a) => String(a ?? '').trim()) : [];
  if (arms.length < 2 || arms.length > LIMITS.maxArms) return { ok: false, key: 'tools.invalid.armCount', params: { max: LIMITS.maxArms } };
  if (arms.some((a) => !a) || new Set(arms).size !== arms.length) return { ok: false, key: 'tools.invalid.armNames' };
  const ratio = Array.isArray(params.ratio) && params.ratio.length ? params.ratio.map(Number) : arms.map(() => 1);
  if (ratio.length !== arms.length || ratio.some((r) => !Number.isInteger(r) || r < 1 || r > LIMITS.maxRatio)) return { ok: false, key: 'tools.invalid.ratio', params: { max: LIMITS.maxRatio } };
  const R = ratio.reduce((a, b) => a + b, 0);

  let strata;
  if (scheme === 'stratified-block') {
    const names = Array.isArray(params.strata) ? params.strata.map((s) => String(s ?? '').trim()) : [];
    const sizes = Array.isArray(params.strataN) ? params.strataN.map(Number) : [];
    if (names.length < 1 || names.length > LIMITS.maxStrata || sizes.length !== names.length) return { ok: false, key: 'tools.invalid.strata', params: { max: LIMITS.maxStrata } };
    if (names.some((s) => !s) || new Set(names).size !== names.length) return { ok: false, key: 'tools.invalid.strataNames' };
    if (sizes.some((n) => !Number.isInteger(n) || n < 1)) return { ok: false, key: 'tools.invalid.units', params: { max: LIMITS.maxUnits } };
    strata = names.map((name, i) => ({ name, n: sizes[i] }));
  } else {
    const n = Number(params.n);
    if (!Number.isInteger(n) || n < 1) return { ok: false, key: 'tools.invalid.units', params: { max: LIMITS.maxUnits } };
    strata = [{ name: null, n }];
  }
  const total = strata.reduce((a, s) => a + s.n, 0);
  if (total > LIMITS.maxUnits) return { ok: false, key: 'tools.invalid.units', params: { max: LIMITS.maxUnits } };

  let blockSizes = [];
  if (scheme !== 'simple') {
    // The option default (plan.options.js) when a caller leaves it out.
    blockSizes = Array.isArray(options.blockSizes) ? options.blockSizes.map(Number) : [4];
    if (!blockSizes.length || blockSizes.length > LIMITS.maxBlockSizes || blockSizes.some((b) => !Number.isInteger(b) || b < 2 || b > LIMITS.maxBlock)) return { ok: false, key: 'tools.invalid.blockSizes', params: { max: LIMITS.maxBlock } };
    const bad = blockSizes.find((b) => b % R !== 0);
    if (bad !== undefined) return { ok: false, key: 'tools.invalid.blockMultiple', params: { size: bad, sum: R } };
  }
  const seed = Number(params.seed);
  if (!isSeed(seed)) return { ok: false, key: 'tools.invalid.seed' };
  const stream = params.stream === undefined || params.stream === null || params.stream === '' ? GENERATOR.defaultStream : Number(params.stream);
  if (!isSeed(stream)) return { ok: false, key: 'tools.invalid.stream' };
  return { ok: true, settings: { scheme, arms, ratio, strata, blockSizes, blinding: options.blinding !== false, seed, stream } };
}

/**
 * The list itself, from checked settings. Pure and deterministic.
 * @param {ReturnType<typeof checkRandomisation> & { ok: true }} checked
 * @returns {{ units: { unit: number, stratum: string|null, block: number|null, arm: string, code: string|null }[], cut: { stratum: string|null, size: number, taken: number }[], blocks: number, draws: number }}
 */
export function drawList({ settings }) {
  const { scheme, arms, ratio, strata, blockSizes, blinding, seed, stream } = settings;
  const rng = createRng(seed, stream);
  const R = ratio.reduce((a, b) => a + b, 0);
  const cumulative = [];
  ratio.reduce((acc, r, i) => { cumulative[i] = acc + r; return acc + r; }, 0);
  const armFor = (k) => cumulative.findIndex((c) => k < c);

  const units = [];
  const cut = [];
  let blocks = 0;
  for (const s of strata) {
    if (scheme === 'simple') {
      for (let u = 0; u < s.n; u += 1) units.push({ unit: units.length + 1, stratum: s.name, block: null, arm: arms[armFor(rng.bounded(R))], code: null });
      continue;
    }
    let left = s.n;
    let b = 0;
    while (left > 0) {
      const size = blockSizes.length > 1 ? blockSizes[rng.bounded(blockSizes.length)] : blockSizes[0];
      b += 1;
      blocks += 1;
      const base = [];
      for (let i = 0; i < arms.length; i += 1) for (let r = 0; r < (ratio[i] * size) / R; r += 1) base.push(i);
      const block = rng.shuffle(base);
      const taken = Math.min(size, left);
      for (let j = 0; j < taken; j += 1) units.push({ unit: units.length + 1, stratum: s.name, block: b, arm: arms[block[j]], code: null });
      if (taken < size) cut.push({ stratum: s.name, size, taken });
      left -= taken;
    }
  }

  if (blinding) {
    const seen = new Set();
    for (const u of units) {
      let code;
      do {
        code = '';
        for (let i = 0; i < 4; i += 1) code += CODE_ALPHABET[rng.bounded(CODE_ALPHABET.length)];
        for (let i = 0; i < 2; i += 1) code += String(rng.bounded(10));
      } while (seen.has(code));
      seen.add(code);
      u.code = code;
    }
  }
  return { units, cut, blocks, draws: rng.draws() };
}

/**
 * input params: n (units) or strata + strataN (names and units per stratum, as two flat lists: spec
 * params hold plain values and flat lists only), arms (labels), ratio (integers), seed, stream;
 * options scheme, blockSizes, blinding.
 * Tables 'list' (unit, stratum, block, arm, code) and 'arms' (stratum, arm, units); values seed, stream, units, blocks.
 * @param {import('../runtime/types.js').AnalysisSpec} spec
 * @param {import('../runtime/types.js').WorkingTable|null} table
 * @returns {import('../runtime/registry.js').MethodOutput}
 */
export function runRandomisation(spec, table) {
  const params = spec?.input?.kind === 'params' ? spec.input.params || {} : {};
  const checked = checkRandomisation(params, spec?.options || {});
  if (!checked.ok) {
    return { status: 'invalid', values: { units: nul(checked.key) }, tests: [], tables: [], used: 0, dropped: [], notes: [{ id: 'plan', severity: 'note', key: checked.key, params: checked.params || {} }] };
  }
  const { settings } = checked;
  const { units, cut, blocks } = drawList(checked);
  const counts = new Map();
  for (const u of units) {
    const k = `${u.stratum ?? ''}\u0000${u.arm}`;
    counts.set(k, (counts.get(k) || 0) + 1);
  }
  const armRows = [];
  for (const s of settings.strata) for (const a of settings.arms) armRows.push([s.name, a, counts.get(`${s.name ?? ''}\u0000${a}`) || 0]);
  const values = { seed: val(settings.seed), stream: val(settings.stream), units: val(units.length) };
  if (settings.scheme !== 'simple') values.blocks = val(blocks);
  return {
    status: 'ok',
    values,
    tests: [],
    tables: [
      { id: 'list', columns: ['unit', 'stratum', 'block', 'arm', 'code'], rows: units.map((u) => [u.unit, u.stratum, u.block, u.arm, u.code]) },
      { id: 'arms', columns: ['stratum', 'arm', 'units'], rows: armRows },
    ],
    used: 0,
    dropped: [],
    notes: cut.map((c) => ({ id: 'plan', severity: 'note', key: c.stratum === null ? 'tools.note.lastBlockCut' : 'tools.note.lastBlockCutStratum', params: { stratum: c.stratum ?? '', size: c.size, taken: c.taken } })),
  };
}
