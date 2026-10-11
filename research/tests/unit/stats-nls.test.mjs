// The nonlinear least-squares core (stats/nls.js) against the NIST StRD nonlinear regression sets [M3-DESIGN.md
// 3.1.1, C2]: tests/fixtures/stats/nist-strd-nls/ (README there; the declaration is stats/nist-strd-nls/fixture.json).
// Every certified parameter, standard deviation, the residual sum of squares and the residual SD are parsed from
// the .dat files (never retyped) and checked from both NIST starting points by log relative error (LRE, capped at
// 15): at least 6 for the lower sets, at least 5 for the higher sets that converge. A higher set that does not
// converge from Start 1 must refuse with lab.invalid.notConverged and print no number; which ones do is pinned
// below and recorded in the lab notes. Each model and its analytic Jacobian are coded as the file states them.
// Injected-wrong-value proof: STATS_INJECT=1 node --test tests/unit/stats-nls.test.mjs must go red (lab notes).
// OWNER: lab role.
import { test } from 'node:test';
import assert from 'node:assert/strict';
import { nlsFit, deltaSe, aicc, extraSsF, rSquared } from '../../src/lib/stats/nls.js';
import { readJson, readText, lre } from './stats-fixtures.mjs';

const FIXTURE = readJson('stats/nist-strd-nls/fixture.json');

/** The certified values and data of one NIST .dat file. */
function parse(name) {
  const lines = readText(`stats/nist-strd-nls/${name}.dat`).split(/\r?\n/);
  const params = lines.filter((l) => /^\s+b\d+\s+=/.test(l)).map((l) => {
    const [b, , s1, s2, cert, sd] = l.trim().split(/\s+/);
    return { name: b, start1: Number(s1), start2: Number(s2), cert: Number(cert), sd: Number(sd) };
  });
  const last = (re) => Number(lines.find((l) => re.test(l)).trim().split(/\s+/).pop());
  const start = lines.findIndex((l) => /^Data:\s+y\s+x\s*$/.test(l));
  const data = lines.slice(start + 1).map((l) => l.trim()).filter(Boolean).map((l) => l.split(/\s+/).map(Number));
  return {
    params, rss: last(/^Residual Sum of Squares:/), rsd: last(/^Residual Standard Deviation:/), dfHeader: last(/^Degrees of Freedom:/),
    nHeader: last(/^Number of Observations:/), y: data.map((r) => r[0]), x: data.map((r) => r[1]),
  };
}

const ex = Math.exp;
/** Each NIST model as its .dat file writes it: value and analytic gradient at one x. */
const MODELS = {
  Misra1a: { f: (x, b) => b[0] * (1 - ex(-b[1] * x)), g: (x, b) => [1 - ex(-b[1] * x), b[0] * x * ex(-b[1] * x)] },
  Chwirut2: {
    f: (x, b) => ex(-b[0] * x) / (b[1] + b[2] * x),
    g: (x, b) => { const E = ex(-b[0] * x); const D = b[1] + b[2] * x; return [(-x * E) / D, -E / (D * D), (-x * E) / (D * D)]; },
  },
  DanWood: { f: (x, b) => b[0] * x ** b[1], g: (x, b) => [x ** b[1], b[0] * x ** b[1] * Math.log(x)] },
  Misra1b: { f: (x, b) => b[0] * (1 - (1 + (b[1] * x) / 2) ** -2), g: (x, b) => [1 - (1 + (b[1] * x) / 2) ** -2, b[0] * x * (1 + (b[1] * x) / 2) ** -3] },
  Rat42: {
    f: (x, b) => b[0] / (1 + ex(b[1] - b[2] * x)),
    g: (x, b) => { const E = ex(b[1] - b[2] * x); const D = 1 + E; return [1 / D, (-b[0] * E) / (D * D), (b[0] * x * E) / (D * D)]; },
  },
  Rat43: {
    f: (x, b) => b[0] / (1 + ex(b[1] - b[2] * x)) ** (1 / b[3]),
    g: (x, b) => {
      const E = ex(b[1] - b[2] * x); const D = 1 + E; const P = D ** (-1 / b[3]);
      return [P, ((-b[0] / b[3]) * P * E) / D, ((b[0] * x) / b[3]) * (P * E) / D, (b[0] * P * Math.log(D)) / (b[3] * b[3])];
    },
  },
  MGH09: {
    f: (x, b) => (b[0] * (x * x + x * b[1])) / (x * x + x * b[2] + b[3]),
    g: (x, b) => { const N = x * x + x * b[1]; const D = x * x + x * b[2] + b[3]; return [N / D, (b[0] * x) / D, (-b[0] * N * x) / (D * D), (-b[0] * N) / (D * D)]; },
  },
  Thurber: {
    f: (x, b) => (b[0] + b[1] * x + b[2] * x ** 2 + b[3] * x ** 3) / (1 + b[4] * x + b[5] * x ** 2 + b[6] * x ** 3),
    g: (x, b) => {
      const N = b[0] + b[1] * x + b[2] * x ** 2 + b[3] * x ** 3; const D = 1 + b[4] * x + b[5] * x ** 2 + b[6] * x ** 3;
      return [1 / D, x / D, x ** 2 / D, x ** 3 / D, (-N * x) / (D * D), (-N * x ** 2) / (D * D), (-N * x ** 3) / (D * D)];
    },
  },
  BoxBOD: { f: (x, b) => b[0] * (1 - ex(-b[1] * x)), g: (x, b) => [1 - ex(-b[1] * x), b[0] * x * ex(-b[1] * x)] },
  Eckerle4: {
    f: (x, b) => (b[0] / b[1]) * ex(-0.5 * ((x - b[2]) / b[1]) ** 2),
    g: (x, b) => { const z = (x - b[2]) / b[1]; const G = ex(-0.5 * z * z); return [G / b[1], ((b[0] * G) / (b[1] * b[1])) * (z * z - 1), (b[0] * G * z) / (b[1] * b[1])]; },
  },
};

function nlsModel(name, d) {
  const k = d.params.length;
  const n = d.y.length;
  const m = MODELS[name];
  return {
    k,
    fitted: (p) => Float64Array.from(d.x, (x) => m.f(x, p)),
    jacobian: (p) => {
      const cols = Array.from({ length: k }, () => new Float64Array(n));
      d.x.forEach((x, i) => m.g(x, p).forEach((v, j) => { cols[j][i] = v; }));
      return cols;
    },
  };
}

// The higher sets that do not converge from NIST's Start 1 (each refuses with no number; recorded in the notes):
// MGH09 and Eckerle4 run out of the 200 steps. BoxBOD Start 1 refused before 0.2.0 (b2 ran away to 8e47); with
// Gauss-Newton step halving first it converges to the certified values (LRE 8.4), and is checked like the rest.
const REFUSE_FROM_START1 = ['Eckerle4', 'MGH09'];

test('the fixture declares the ten sets with their difficulty and LRE thresholds', () => {
  assert.equal(FIXTURE._fixture.family, 'nist-strd');
  assert.deepEqual([...FIXTURE.lower, ...FIXTURE.higher].sort(), Object.keys(MODELS).sort());
  assert.deepEqual(FIXTURE.minLre, { lower: 6, higher: 5 });
});

for (const level of ['lower', 'higher']) {
  for (const name of FIXTURE[level]) {
    test(`NIST ${name} (${level}): certified values from both starts`, () => {
      const d = parse(name);
      assert.equal(d.y.length, d.nHeader, 'every data row parsed');
      const min = FIXTURE.minLre[level];
      for (const s of ['start1', 'start2']) {
        const fit = nlsFit(nlsModel(name, d), d.y, d.params.map((p) => p[s]));
        if (level === 'higher' && s === 'start1' && REFUSE_FROM_START1.includes(name)) {
          assert.equal(fit.status, 'invalid', `${name} ${s} must refuse`);
          assert.equal(fit.reasonKey, 'lab.invalid.notConverged', `${name} ${s}`);
          assert.equal(fit.se, null, 'no standard errors from a fit that did not converge');
          assert.ok(Number.isNaN(fit.rss), 'no residual sum of squares either');
          continue;
        }
        assert.equal(fit.status, 'ok', `${name} ${s}: ${fit.reasonKey} after ${fit.iterations} steps`);
        d.params.forEach((p, j) => {
          const a = lre(fit.p[j], p.cert);
          const b = lre(fit.se[j], p.sd);
          assert.ok(a >= min, `${name} ${s} ${p.name}: LRE ${a.toFixed(2)} < ${min}`);
          assert.ok(b >= min, `${name} ${s} sd(${p.name}): LRE ${b.toFixed(2)} < ${min}`);
        });
        const r = lre(fit.rss, d.rss);
        const sd = lre(fit.sigma, d.rsd);
        assert.ok(r >= min, `${name} ${s} residual sum of squares: LRE ${r.toFixed(2)}`);
        assert.ok(sd >= min, `${name} ${s} residual SD: LRE ${sd.toFixed(2)}`);
        // df from the certified values themselves: Rat43's header prints 9, its certified SD needs 15 - 4 = 11.
        assert.equal(fit.df, Math.round(d.rss / (d.rsd * d.rsd)), `${name} df`);
        assert.ok(fit.offset <= 1e-5, `${name} ${s} relative offset ${fit.offset}`);
      }
    });
  }
}

test('NIST Rat43: the header\'s 9 degrees of freedom is a typo the certified residual SD does not share', () => {
  const d = parse('Rat43');
  assert.equal(d.dfHeader, 9);
  assert.equal(d.y.length - d.params.length, 11);
  assert.equal(Math.round(d.rss / (d.rsd * d.rsd)), 11);
});

test('a parameter the data cannot determine is singular; a fit with fewer rows than parameters is refused', () => {
  // y = a + b x + c x with x twice: b and c are the same column
  const x = [1, 2, 3, 4, 5];
  const y = [2.1, 3.9, 6.2, 7.8, 10.1];
  const twin = { k: 3, fitted: (p) => Float64Array.from(x, (v) => p[0] + p[1] * v + p[2] * v), jacobian: () => [Float64Array.from(x, () => 1), Float64Array.from(x), Float64Array.from(x)] };
  const s = nlsFit(twin, y, [0, 1, 1]);
  assert.equal(s.status, 'invalid');
  assert.equal(s.reasonKey, 'lab.invalid.singular');
  assert.equal(s.se, null);
  const line = { k: 2, fitted: (p) => Float64Array.from(x.slice(0, 2), (v) => p[0] + p[1] * v), jacobian: () => [Float64Array.from([1, 1]), Float64Array.from([1, 2])] };
  assert.equal(nlsFit(line, y.slice(0, 2), [0, 1]).reasonKey, 'lab.invalid.tooFewPoints');
});

test('a start whose fitted values are not finite refuses instead of printing numbers', () => {
  const x = [1, 2, 3, 4];
  const m = { k: 1, fitted: (p) => Float64Array.from(x, (v) => Math.exp(p[0] * v)), jacobian: (p) => [Float64Array.from(x, (v) => v * Math.exp(p[0] * v))] };
  const fit = nlsFit(m, [1, 2, 3, 4], [1e6]);
  assert.equal(fit.status, 'invalid');
  assert.equal(fit.reasonKey, 'lab.invalid.notConverged');
});

test('helpers: delta-method SE, AICc, extra sum-of-squares F and R squared', () => {
  // sqrt(g' V g) for g = (1, 2), V = [[4, 1], [1, 9]]: 4 + 4 + 36 = 44
  assert.ok(Math.abs(deltaSe([1, 2], [[4, 1], [1, 9]]) - Math.sqrt(44)) < 1e-15);
  // AICc = n ln(RSS/n) + 2K + 2K(K+1)/(n-K-1), K = parameters + 1
  const n = 24;
  const K = 5;
  assert.ok(Math.abs(aicc(5.4, n, 4) - (n * Math.log(5.4 / n) + 2 * K + (2 * K * (K + 1)) / (n - K - 1))) < 1e-12);
  assert.ok(Number.isNaN(aicc(5.4, 6, 4)), 'n - K - 1 must be above 0');
  const F = extraSsF(10, 20, 8, 19);
  assert.ok(Math.abs(F.F - (2 / 1) / (8 / 19)) < 1e-12);
  assert.deepEqual([F.df1, F.df2], [1, 19]);
  assert.deepEqual(extraSsF(7, 20, 8, 19).F, 0, 'a restricted fit below the fuller one counts as no improvement');
  assert.ok(Math.abs(rSquared([1, 2, 3, 4], 1) - (1 - 1 / 5)) < 1e-15);
});
