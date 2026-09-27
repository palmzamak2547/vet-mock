// Diagnostic accuracy [M1-DESIGN.md 7.18]. Fixtures and their sources:
// - course-2026: tests/fixtures/course/epi-course-2026.json items 107013 (Se 90%, Sp 66.67%,
//   accuracy 75%), 107014 (FeLV kit Se 80%, Sp 98.33%), 107015 (PPV 60%, NPV 92.3%);
// - scipy-1.17.1: scipy-crosscheck.json dx.course107013 and dx.course107014 (Wilson and exact
//   intervals; LR by the log method of Simel et al. 1991; the R pin is epiR::epi.tests via rparity);
// - the main app's Module 5 bench (src/lib/screening.js, tests/unit/screening.test.mjs): 10,000
//   animals, prevalence 1%, Se 90%, Sp 95% gives 585 flagged, 90 true, PPV 15.4%.
// OWNER: epi role.
import { test } from 'node:test';
import assert from 'node:assert/strict';
import { diagnosticAccuracy, runDiagnostic } from '../../src/lib/epi/diagnostic.js';
import { LECTURE_SCENARIOS, screeningTable } from '../../../src/lib/screening.js';
import { spec, readFixture, close, CLOSED } from './epi-fixtures.mjs';

const course = readFixture('course/epi-course-2026.json');
const item = (id) => course.items.find((i) => i.id === id);
const x = readFixture('crosscheck/scipy-crosscheck.json');

for (const key of ['dx.course107013', 'dx.course107014']) {
  test(`${key}: Se, Sp, PPV, NPV, accuracy, LR+ and LR- with intervals (scipy-1.17.1)`, () => {
    const s = x[key];
    const counts = { TP: s.TP, FN: s.FN, FP: s.FP, TN: s.TN };
    for (const method of ['wilson', 'exact']) {
      const r = diagnosticAccuracy(counts, { ciMethod: method, confLevel: 0.95 });
      for (const m of ['Se', 'Sp', 'PPV', 'NPV']) {
        close(r[m].value, s[m], CLOSED, `${m}`);
        close(r[m].ci[0], s[`${m}.${method}`][0], 1e-9, `${m} ${method} lower`);
        close(r[m].ci[1], s[`${m}.${method}`][1], 1e-9, `${m} ${method} upper`);
      }
      close(r.accuracy.value, s.accuracy, CLOSED, 'accuracy');
      close(r.LRpos.value, s.LRpos, 1e-12, 'LR+');
      close(r.LRpos.ci[0], s['LRpos.log'][0], CLOSED, 'LR+ lower');
      close(r.LRpos.ci[1], s['LRpos.log'][1], CLOSED, 'LR+ upper');
      close(r.LRneg.value, s.LRneg, 1e-12, 'LR-');
      close(r.LRneg.ci[0], s['LRneg.log'][0], CLOSED, 'LR- lower');
      close(r.LRneg.ci[1], s['LRneg.log'][1], CLOSED, 'LR- upper');
    }
  });
}

test('course 107013, 107014, 107015: the course answers', () => {
  for (const id of [107013, 107014, 107015]) {
    const it = item(id);
    const r = diagnosticAccuracy(it.input, {});
    for (const [k, v] of Object.entries(it.value)) close(r[k].value, v, CLOSED, `${id} ${k}`);
  }
  const r = diagnosticAccuracy(item(107015).input, {});
  assert.equal((r.NPV.value * 100).toFixed(1), '92.3');
  assert.equal((diagnosticAccuracy(item(107014).input, {}).Sp.value * 100).toFixed(2), '98.33');
});

test('Module 5 bench: 585 flagged, 90 true, PPV 15.4% from the same arithmetic', () => {
  const s = LECTURE_SCENARIOS.find((c) => c.id === 'false-alerts');
  const tbl = screeningTable(s.input);
  const r = diagnosticAccuracy({ TP: tbl.tp, FN: tbl.fn, FP: tbl.fp, TN: tbl.tn }, {});
  assert.equal(tbl.tp + tbl.fp, s.expect.flagged);
  assert.equal((r.PPV.value * 100).toFixed(1), String(s.expect.ppvPct));
  close(r.Se.value, 0.9, CLOSED, 'Se');
  close(r.Sp.value, 0.95, CLOSED, 'Sp');
});

test('undefined values are null with a reason, never 0', () => {
  const noFP = diagnosticAccuracy({ TP: 10, FN: 2, FP: 0, TN: 20 }, {});
  assert.equal(noFP.LRpos.value, null);
  assert.equal(noFP.LRpos.reasonKey, 'epi.undefined.lrPosNoFalsePositive');
  const noPos = diagnosticAccuracy({ TP: 0, FN: 0, FP: 3, TN: 20 }, {});
  assert.equal(noPos.Se.value, null);
  assert.equal(noPos.Se.reasonKey, 'epi.undefined.noReferencePositive');
  assert.equal(noPos.PPV.value, 0, 'PPV of 0/3 is a real 0');
});

test('dataset: test and reference columns build the 2x2', () => {
  const t = {
    rowIds: ['r1', 'r2', 'r3', 'r4', 'r5', 'r6'], n: 6, recipeRev: 1, excluded: {}, fingerprint: 't',
    columns: {
      kit: { key: 'kit', kind: 'category', levels: ['pos', 'neg'], values: Int32Array.from([0, 0, 1, 1, 0, 1]), missing: new Uint8Array(6) },
      pcr: { key: 'pcr', kind: 'category', levels: ['neg', 'pos'], values: Int32Array.from([1, 0, 1, 0, 1, -1]), missing: Uint8Array.from([0, 0, 0, 0, 0, 2]) },
    },
  };
  const out = runDiagnostic(spec('dx.accuracy', { kind: 'dataset', datasetId: 'd', recipeRev: 1 }, { roles: { test: 'kit', reference: 'pcr' }, levels: { testPositive: 'pos', referencePositive: 'pos' } }), t);
  assert.deepEqual(out.tables[0].rows[0], ['positive', 2, 1, 3]);
  assert.deepEqual(out.tables[0].rows[1], ['negative', 1, 1, 2]);
  assert.equal(out.used, 5);
  assert.deepEqual(out.dropped, [{ reason: 'missing', column: 'pcr', count: 1 }]);
});
