// Shared data and helpers for the models role's tests (not a test file itself). OWNER: models role.
//
// Sources of every number the models tests pin:
//   docs/research/M2-DESIGN.md 3.2 (the architect's run, 28 Sep 2026: R 4.6.0 (2026-04-24) in webR 0.6.0 under
//   Node, survival 3.8.6, sandwich 3.1.1, printed with sprintf('%.17g')), and
//   the models role's own run of the same R through the same webR (28 Sep 2026), for the values the design
//   does not list: the infert rows (datasets::infert, written out below as digit strings), the Dobson and
//   British doctors drop1(test = 'LRT') and the doctors null deviance, AIC and profile intervals of every
//   coefficient, the survfit median rule on exact 0.5 stretches, and a three-group survdiff. The R script is
//   in work/loop-2026-09-26/research-m2/models.md; the rparity role writes it into tests/fixtures/r/.
//
// MODELS_INJECT=1 shifts every pinned number (1e-5 relative, whole numbers by 1) before comparing: each pin
// test must then fail. That is the injected-wrong-value proof of M2-DESIGN.md 3 for this role.
import assert from 'node:assert/strict';
import { readFileSync } from 'node:fs';

export { makeTable, spec } from './stats-fixtures.mjs';

const INJECT = process.env.MODELS_INJECT === '1';

/** A pinned number (or array of numbers), shifted under MODELS_INJECT. */
export function pin(v) {
  if (!INJECT) return v;
  if (Array.isArray(v)) return v.map(pin);
  if (typeof v !== 'number' || !Number.isFinite(v)) return v;
  if (Number.isInteger(v)) return v + 1;
  return v === 0 ? 1e-5 : v * (1 + 1e-5);
}

/**
 * |got - want| <= rel |want|, or <= abs when given (values that are mathematically zero). `want` is pinned
 * here, so a caller passes the raw fixture value. null and Infinity must match exactly.
 */
export function near(got, want, { rel = 1e-6, abs = 0 } = {}, label = '') {
  const w = pin(want);
  if (w === null) { assert.equal(got, null, `${label}: expected null, got ${got}`); return; }
  if (!Number.isFinite(w)) { assert.equal(got, w, `${label}: expected ${w}, got ${got}`); return; }
  assert.equal(typeof got, 'number', `${label}: expected a number, got ${got}`);
  const err = Math.abs(got - w);
  const ok = err <= rel * Math.abs(w) || err <= abs;
  assert.ok(ok, `${label}: got ${got}, want ${w} (error ${err.toExponential(3)})`);
}

/** Element-wise near for arrays of the same length. */
export function nearAll(got, want, tol, label) {
  assert.equal(got.length, want.length, `${label}: length ${got.length} != ${want.length}`);
  want.forEach((w, i) => near(got[i], w, tol, `${label}[${i}]`));
}

/** An integer pin (iterations, counts, df). */
export function same(got, want, label) {
  assert.equal(got, pin(want), label);
}

// ---------------------------------------------------------------- R datasets

/** datasets::infert (Trichopoulos et al. 1976), 248 rows: education 1..3 = 0-5yrs, 6-11yrs, 12+ yrs. */
export const INFERT = {
  education: '11112222222222222222222222222222222222222222333333333333333333333333333333333333333111122222222222222222222222222222222222222223333333333333333333333333333333333333311112222222222222222222222222222222222222222333333333333333333333333333333333333333',
  spontaneous: '20001100100100101111102112222010020212012001002002221122021221120112200112211011011000101001101010020100000100021000000002000000001001110001000000010101000120000001100020201011102002010000120001100000000100000010000010111000000002000200002101110011',
  induced: '11221200001212122020020010001201101001000001010220111000100000001001011000000100200202021020001001100000000000001011000020110001012112111111211210000021010000200000020200000100000101111002000002100020002000000001211222010210111010102010100110000200',
  case: '11111111111111111111111111111111111111111111111111111111111111111111111111111111111000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000',
  levels: ['0-5yrs', '6-11yrs', '12+ yrs'],
};

/** Dobson (1990) p. 93, the ?glm example: counts by outcome (1..3) and treatment (1..3). */
export const DOBSON = { counts: [18, 17, 15, 20, 10, 20, 25, 13, 12], outcome: [1, 2, 3, 1, 2, 3, 1, 2, 3], treatment: [1, 1, 1, 2, 2, 2, 3, 3, 3] };

/** British doctors (Doll and Hill, tabulated by Breslow and Day 1987), as in M2-DESIGN.md 3 `doctors`. */
export const DOCTORS = {
  deaths: [32, 104, 206, 186, 102, 2, 12, 28, 28, 31],
  py: [52407, 43248, 28612, 12663, 5317, 18790, 10673, 5710, 2585, 1462],
  smoke: ['yes', 'yes', 'yes', 'yes', 'yes', 'no', 'no', 'no', 'no', 'no'],
  age: ['35-44', '45-54', '55-64', '65-74', '75-84', '35-44', '45-54', '55-64', '65-74', '75-84'],
};

/** survival::aml (Miller 1981): Maintained rows first, then Nonmaintained. */
export const AML = {
  time: [9, 13, 13, 18, 23, 28, 31, 34, 45, 48, 161, 5, 5, 8, 8, 12, 16, 23, 27, 30, 33, 43, 45],
  status: [1, 1, 0, 1, 1, 0, 1, 1, 0, 1, 0, 1, 1, 1, 1, 1, 0, 1, 1, 1, 1, 1, 1],
  x: [...Array(11).fill('Maintained'), ...Array(12).fill('Nonmaintained')],
};

/** M2-DESIGN.md 3 `sep` (made-up data): y by a three-level factor with complete separation at a and b. */
export const SEP = { y: [0, 0, 0, 0, 0, 1, 1, 1, 1, 0, 1, 0], x: ['a', 'a', 'a', 'a', 'a', 'b', 'b', 'b', 'b', 'c', 'c', 'c'] };

// ---------------------------------------------------------------- the serosurvey (made-up data)

/**
 * The 728 serosurvey rows as check.py reads them (cp874, Thai digits, two-digit Buddhist years, age in
 * whole months at sampling; codes ไม่ทราบ, -, 999 and blank are missing): farm, ELISA positive, age, the
 * vaccine answer (ฉีด, ไม่ฉีด, ไม่ทราบ) and herd size.
 */
export function serosurveyRows() {
  const bytes = readFileSync(new URL('../fixtures/serosurvey/serosurvey-2569.csv', import.meta.url));
  const text = new TextDecoder('windows-874').decode(bytes);
  const lines = text.split(/\r?\n/).filter((l) => l.length).map((l) => l.split(','));
  const C = Object.fromEntries(lines[0].map((h, i) => [h, i]));
  const TH = (s) => s.replace(/[๐-๙]/g, (d) => String(d.charCodeAt(0) - 0x0e50));
  const MISS = new Set(['ไม่ทราบ', '-', '', '999']);
  const date = (s) => {
    const [d, m, y0] = TH(s.trim()).split('/');
    let y = Number(y0);
    if (String(y).length === 2) y += 2500;
    return [y - 543, Number(m), Number(d)];
  };
  return lines.slice(1).map((r) => {
    const s = date(r[C['วันที่เก็บตัวอย่าง']]);
    const b = MISS.has(r[C['วันเกิด']]) ? null : date(r[C['วันเกิด']]);
    const age = b ? (s[0] - b[0]) * 12 + (s[1] - b[1]) - (s[2] < b[2] ? 1 : 0) : null;
    return { farm: r[0], pos: r[C['ผล ELISA']] === 'บวก' ? 1 : 0, age, vaccine: r[C['วัคซีนใน 6 เดือน']], herd: Number(TH(r[C['ขนาดฝูง (ตัว)']])) };
  });
}
