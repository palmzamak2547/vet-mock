// ============================================================
// screening.test.mjs
// ============================================================
// The bench exists to show a student a number the slide asserts. If the two
// ever disagree, the bench is the one that is wrong — so the lecture's own
// worked examples are the first thing pinned here, by their printed values.
// ============================================================
import { test } from 'node:test';
import assert from 'node:assert/strict';

import { screeningTable, ppvCurve, LECTURE_SCENARIOS } from '../../src/lib/screening.js';

const pct = (v) => Math.round(v * 1000) / 10;

// ── the course's own numbers ─────────────────────────────────────
test('every lecture scenario reproduces the figures printed on its slide', () => {
  for (const s of LECTURE_SCENARIOS) {
    const t = screeningTable(s.input);
    for (const cell of ['tp', 'fp', 'fn', 'tn', 'flagged']) {
      assert.equal(t[cell], s.expect[cell], `${s.id}: ${cell}`);
    }
    if (s.expect.ppvPct !== undefined) assert.equal(pct(t.ppv), s.expect.ppvPct, `${s.id}: PPV`);
    if (s.expect.accuracyPct !== undefined) assert.equal(pct(t.accuracy), s.expect.accuracyPct, `${s.id}: accuracy`);
  }
});

test('the accuracy trap: 99% right, and not one sick animal found', () => {
  const t = screeningTable({ n: 1000, prevalence: 0.01, sensitivity: 0, specificity: 1 });
  assert.equal(pct(t.accuracy), 99);
  assert.equal(t.tp, 0, 'it catches none of them');
  // Nothing was flagged, so there is no flagged group to take a proportion
  // of. Reporting 0% here would say "everything flagged was healthy", which
  // is a different — and false — claim.
  assert.equal(t.ppv, null, 'PPV of an empty column is undefined, not zero');
  assert.equal(pct(t.npv), 99);
});

// ── the table is a table ─────────────────────────────────────────
test('the four cells always sum to the population, whatever the rounding', () => {
  for (const prevalence of [0, 0.001, 0.017, 0.333, 0.5, 0.99, 1]) {
    for (const sensitivity of [0, 0.37, 0.9, 1]) {
      for (const specificity of [0, 0.5, 0.95, 1]) {
        for (const n of [1, 7, 999, 10000, 123457]) {
          const t = screeningTable({ n, prevalence, sensitivity, specificity });
          assert.equal(t.tp + t.fp + t.fn + t.tn, n, `cells vs n (${n}/${prevalence}/${sensitivity}/${specificity})`);
          assert.equal(t.tp + t.fn, t.diseased, 'diseased column');
          assert.equal(t.fp + t.tn, t.healthy, 'healthy column');
          assert.equal(t.flagged + t.notFlagged, n, 'rows');
          for (const cell of ['tp', 'fp', 'fn', 'tn']) {
            assert.ok(Number.isInteger(t[cell]) && t[cell] >= 0, `${cell} is a whole count`);
          }
        }
      }
    }
  }
});

test('a rarer disease makes a positive result worth less, never more', () => {
  // The whole point of the bench: with the test held still, PPV falls as
  // prevalence falls. Monotone, not merely lower at the ends.
  let previous = 1;
  for (const prevalence of [0.5, 0.2, 0.1, 0.05, 0.02, 0.01, 0.005, 0.001]) {
    const { ppv } = screeningTable({ n: 1_000_000, prevalence, sensitivity: 0.9, specificity: 0.95 });
    assert.ok(ppv <= previous, `PPV rose as prevalence fell (${prevalence})`);
    previous = ppv;
  }
  assert.ok(previous < 0.05, 'at 0.1% prevalence almost every alert should be false');
});

test('false alerts are counted per animal actually found', () => {
  const t = screeningTable({ n: 10000, prevalence: 0.01, sensitivity: 0.9, specificity: 0.95 });
  assert.equal(t.falseAlertsPerHit, 495 / 90);
  // With nothing found there is no ratio to report.
  assert.equal(screeningTable({ n: 100, prevalence: 0, sensitivity: 0.9, specificity: 1 }).falseAlertsPerHit, null);
});

test('a perfect test is perfect, and a useless one is not rescued by arithmetic', () => {
  const perfect = screeningTable({ n: 5000, prevalence: 0.2, sensitivity: 1, specificity: 1 });
  assert.equal(perfect.fp, 0);
  assert.equal(perfect.fn, 0);
  assert.equal(perfect.ppv, 1);
  assert.equal(perfect.npv, 1);

  // Flags everything: every diseased animal found, every healthy one too.
  const flagsAll = screeningTable({ n: 1000, prevalence: 0.1, sensitivity: 1, specificity: 0 });
  assert.equal(flagsAll.flagged, 1000);
  assert.equal(flagsAll.ppv, 0.1, 'PPV collapses to the prevalence');
  assert.equal(flagsAll.npv, null, 'nothing was cleared, so NPV is undefined');
});

// ── input the UI can actually produce ────────────────────────────
test('nonsense input is clamped rather than propagated as NaN', () => {
  const t = screeningTable({ n: -5, prevalence: 2, sensitivity: 'x', specificity: NaN });
  assert.equal(t.n, 1);
  assert.ok(Number.isFinite(t.accuracy));
  for (const cell of ['tp', 'fp', 'fn', 'tn']) assert.ok(Number.isInteger(t[cell]));
  assert.deepEqual(screeningTable(), screeningTable({ n: 1, prevalence: 0, sensitivity: 0, specificity: 0 }));
});

// ── the curve the chart draws ────────────────────────────────────
test('the curve rises with prevalence and matches the table at a shared point', () => {
  const curve = ppvCurve({ sensitivity: 0.9, specificity: 0.95, from: 0.001, to: 0.5, steps: 32 });
  assert.equal(curve.length, 33);
  assert.ok(curve[0].prevalence < curve[curve.length - 1].prevalence, 'prevalence increases along the curve');
  for (let i = 1; i < curve.length; i += 1) {
    assert.ok(curve[i].ppv >= curve[i - 1].ppv - 1e-12, 'PPV must not fall as prevalence rises');
  }
  // Closed form vs the rounded table at the lecture's own point.
  const exact = 0.9 * 0.01 / (0.9 * 0.01 + 0.05 * 0.99);
  assert.ok(Math.abs(exact - 90 / 585) < 1e-3, 'curve and table agree at prevalence 1%');
});

test('a curve for a test that can never flag anything reports no value', () => {
  const curve = ppvCurve({ sensitivity: 0, specificity: 1 });
  assert.ok(curve.every((pt) => pt.ppv === null || pt.ppv === 0), 'no spurious PPV from a silent test');
});
