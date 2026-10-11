// Compares two R parity fixture documents (research/tests/fixtures/r/out/*.json) value by value.
// Used by run-webr.mjs --check (same webR build, so the tolerance is 0) and by run-native.mjs in CI
// (native R 4.6.0 on Linux against the committed webR files; libm differs, see NATIVE_REL and
// NATIVE_REL_BY_FIXTURE below).
// `cases` (and `datasets`, exactly) are compared; `_meta` records where each file was made and legitimately differs.

/** Relative tolerance between native R and webR. Both are R 4.6.0; they differ only in the C
 * library's exp/log/pow in the last bit or two, which the iterative methods can amplify. */
export const NATIVE_REL = 1e-9;

/**
 * Native tolerances that differ from NATIVE_REL, by fixture script name, each sized from a native run.
 *
 * nonlinear (5e-8): every fit is an nls Gauss-Newton run. nls stops at the first iterate whose
 * relative-offset value, sqrt(|Q1'r|^2 / |Q2'r|^2), is below the tol that tight() in nonlinear.R settles
 * on (1e-10, else 1e-9, else 1e-8), and returns that iterate without the last step, which is at most
 * tol * sqrt(n - p) standard errors in each parameter. Whether a tol converges at all is decided at the
 * rounding-noise floor ("step factor reduced below minFactor"): in webR 0.6.0 Michaelis-Menten, growth
 * and the shared-EC50 fit settle only at 1e-8, the separate-curves fit at 1e-10. So the last bits of
 * exp/log pick which point near the minimum each platform returns. Native R 4.6.0 on ubuntu-24.04 (main
 * 919d96b2, Research R parity run 38164236656, every package pin matched) put 17 values of this fixture
 * more than 1e-9 from the committed webR file, the largest 1.10e-8 relative
 * (cases.compare.values.separate.2), while every other fixture, glm's IRLS, logistf and glm.nb
 * included, agreed within 1e-9. 5e-8 is that maximum with a margin of about 4.5, and stays 20 times
 * tighter than the engine's own 1e-6 pin for iterative fits, so a webR result far enough off to move
 * the engine pin still fails here. `_fixture` and `datasets` stay exact for this fixture as for all.
 */
export const NATIVE_REL_BY_FIXTURE = Object.freeze({ nonlinear: 5e-8 });

/** The native tolerance of one fixture script: its documented exception above, else NATIVE_REL. */
export function nativeRel(name) {
  return Object.hasOwn(NATIVE_REL_BY_FIXTURE, name) ? NATIVE_REL_BY_FIXTURE[name] : NATIVE_REL;
}

/** Turns the three strings the R writer uses back into numbers. */
export function revive(v) {
  if (v === 'Infinity') return Infinity;
  if (v === '-Infinity') return -Infinity;
  if (v === 'NaN') return NaN;
  return v;
}

function sameNumber(a, b, rel, absoluteZero, evidenceDirection) {
  if (rel > 0 && evidenceDirection) {
    return Number.isFinite(a) && Number.isFinite(b) && a * evidenceDirection > 0 && b * evidenceDirection > 0;
  }
  if (rel > 0 && absoluteZero) {
    return Number.isFinite(a) && Number.isFinite(b) && Math.abs(a) <= 1e-10 && Math.abs(a - b) <= 1e-10;
  }
  if (Number.isNaN(a) && Number.isNaN(b)) return true;
  if (!Number.isFinite(a) || !Number.isFinite(b)) return a === b;
  if (rel === 0) return Object.is(a, b) || a === b;
  return Math.abs(a - b) <= rel * Math.max(Math.abs(a), Math.abs(b), Number.MIN_VALUE);
}

/**
 * @param {unknown} want  committed value
 * @param {unknown} got   freshly computed value
 * @param {number} rel    relative tolerance for numbers (0 = identical)
 * @param {string} path
 * @param {string[]} out  collects one line per difference
 * @param {Set<string>} [absoluteZeroPaths] committed, analytically known zero slots only
 * @param {Map<string, number>} [evidenceDirections] non-pinned separated-fit estimates only
 */
export function diffValues(want, got, rel, path, out, absoluteZeroPaths, evidenceDirections) {
  want = revive(want);
  got = revive(got);
  if (typeof want === 'number' || typeof got === 'number') {
    if (typeof want !== 'number' || typeof got !== 'number' || !sameNumber(want, got, rel, absoluteZeroPaths?.has(path), evidenceDirections?.get(path))) {
      out.push(`${path}: committed ${String(want)}, now ${String(got)}`);
    }
    return;
  }
  if (want === null || got === null || typeof want !== 'object' || typeof got !== 'object') {
    if (want !== got) out.push(`${path}: committed ${JSON.stringify(want)}, now ${JSON.stringify(got)}`);
    return;
  }
  if (Array.isArray(want) !== Array.isArray(got)) {
    out.push(`${path}: one side is an array, the other is not`);
    return;
  }
  if (Array.isArray(want) && want.length !== got.length) out.push(`${path}: array length ${want.length}, now ${got.length}`);
  const keys = new Set([...Object.keys(want), ...Object.keys(got)]);
  for (const k of keys) {
    if (!(k in want)) { out.push(`${path}.${k}: new key`); continue; }
    if (!(k in got)) { out.push(`${path}.${k}: key disappeared`); continue; }
    diffValues(want[k], got[k], rel, `${path}.${k}`, out, absoluteZeroPaths, evidenceDirections);
  }
}

function analyticZeroPaths(committed) {
  const paths = new Set();
  for (const [id, c] of Object.entries(committed.cases || {})) {
    for (const key of c.absoluteZero || []) {
      // The authored R keys are 1-based; diffValues' array paths are 0-based.
      const valuePath = key.replace(/\.(\d+)$/, (_, index) => `.${Number(index) - 1}`);
      paths.add(`cases.${id}.values.${valuePath}`);
    }
  }
  if (committed.cases?.['shapiro.three.residuals']?.data === 'three residuals') {
    // _data.R: A sums 120/5 = 24 (row 5 is 24); C sums 189/7 = 27 (row 18 is 27).
    // lm(y ~ g) fits each group mean, so these two derived residuals are exactly zero.
    // ponytail: only this proved fixture mask; replace with authored residual-zero metadata when available.
    paths.add('cases.shapiro.three.residuals.x.4');
    paths.add('cases.shapiro.three.residuals.x.17');
  }
  return paths;
}

function separationEvidenceDirections(committed, out) {
  const directions = new Map();
  const c = committed.cases?.['logistic.separation'];
  if (c?.tol !== 'evidence' || c.data !== 'sep' || c.values?.separation !== true) return directions;
  // glm.R declares B/SE evidence, not pins: the separated likelihood has no finite MLE.
  // For this dataset beta(t)=(-t,2t,t+log(1/2)); finite IRLS B has these directions, SE is positive.
  for (const [key, signs] of [['B', [-1, 1, 1]], ['SE', [1, 1, 1]]]) {
    const values = c.values[key];
    if (!Array.isArray(values) || values.length !== 3 || Object.keys(values).length !== 3 ||
        !signs.every((sign, i) => Number.isFinite(values[i]) && values[i] * sign > 0)) {
      out.push(`cases.logistic.separation.values.${key}: invalid reference evidence vector`);
      continue;
    }
    signs.forEach((sign, i) => directions.set(`cases.logistic.separation.values.${key}.${i}`, sign));
  }
  return directions;
}

/** @returns {string[]} differences in `cases`, `_fixture` and `datasets` (empty = same) */
export function compareFixtureDocs(committed, fresh, rel) {
  const out = [];
  diffValues(committed._fixture, fresh._fixture, 0, '_fixture', out);
  // Input data (M2 files) must be identical: a dataset that moves is a different fixture, not noise.
  if ('datasets' in committed || 'datasets' in fresh) diffValues(committed.datasets ?? null, fresh.datasets ?? null, 0, 'datasets', out);
  diffValues(committed.cases, fresh.cases, rel, 'cases', out,
    rel > 0 ? analyticZeroPaths(committed) : undefined,
    rel > 0 ? separationEvidenceDirections(committed, out) : undefined);
  return out;
}

/** run-native.mjs's comparison of one fixture script, at that script's native tolerance (nativeRel). */
export function compareNative(name, committed, fresh) {
  return compareFixtureDocs(committed, fresh, nativeRel(name));
}
