// Compares two R parity fixture documents (research/tests/fixtures/r/out/*.json) value by value.
// Used by run-webr.mjs --check (same webR build, so the tolerance is 0) and by run-native.mjs in CI
// (native R 4.6.0 on Linux against the committed webR files; libm differs, see NATIVE_REL below).
// Only `cases` is compared; `_meta` records where each file was made and legitimately differs.

/** Relative tolerance between native R and webR. Both are R 4.6.0; they differ only in the C
 * library's exp/log/pow in the last bit or two, which the iterative methods can amplify. */
export const NATIVE_REL = 1e-9;

/** Turns the three strings the R writer uses back into numbers. */
export function revive(v) {
  if (v === 'Infinity') return Infinity;
  if (v === '-Infinity') return -Infinity;
  if (v === 'NaN') return NaN;
  return v;
}

function sameNumber(a, b, rel) {
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
 */
export function diffValues(want, got, rel, path, out) {
  want = revive(want);
  got = revive(got);
  if (typeof want === 'number' || typeof got === 'number') {
    if (typeof want !== 'number' || typeof got !== 'number' || !sameNumber(want, got, rel)) {
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
  const keys = new Set([...Object.keys(want), ...Object.keys(got)]);
  for (const k of keys) {
    if (!(k in want)) { out.push(`${path}.${k}: new key`); continue; }
    if (!(k in got)) { out.push(`${path}.${k}: key disappeared`); continue; }
    diffValues(want[k], got[k], rel, `${path}.${k}`, out);
  }
}

/** @returns {string[]} differences in `cases` and `_fixture` (empty = same) */
export function compareFixtureDocs(committed, fresh, rel) {
  const out = [];
  diffValues(committed._fixture, fresh._fixture, 0, '_fixture', out);
  diffValues(committed.cases, fresh.cases, rel, 'cases', out);
  return out;
}
