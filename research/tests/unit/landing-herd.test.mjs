// The front door prints only numbers its herd produces [M1-DESIGN.md 15.2]. Port of
// work/research-studio/design/check-herd.mjs: the dots themselves, on both boards, give 146 positives,
// ICC 0.05, DEFF 1.70, effective n 428 and the Wald CIs the page shows. The herd's design copies the
// course example (bank item 107039, tests/fixtures/course/epi-course-2026.json), and no herd number
// is typed into the dictionaries. OWNER: landing role.
import { test } from 'node:test';
import assert from 'node:assert/strict';
import { readFileSync } from 'node:fs';
import { fileURLToPath } from 'node:url';
import { HERD_DESIGN, HERD_LAYOUTS, STILL_STYLE, herdData, herdStats, herdDisplay, herdFacts, stillHalf } from '../../src/landing/herd/data.js';
import { conversionCounts, cleanRows, markedCells, RAW_ROWS } from '../../src/landing/story/demo.js';
import landing from '../../src/i18n/landing.js';
import entrance from '../../src/i18n/entrance.js';

// Expected values: the design prototype's printed numbers (check-herd.mjs, 25 Sep 2026).
const PRINTED = { positives: 146, icc: '0.05', deff: '1.70', effN: 428, lo: '16.3', hi: '23.8', indLo: '17.1', indHi: '23.0' };

for (const [name, layout] of Object.entries(HERD_LAYOUTS)) {
  test(`${name} herd: its own dots give the printed numbers (check-herd.mjs)`, () => {
    const d = herdData(layout);
    assert.equal(d.N, 728);
    assert.equal(d.FARMS, 49);
    const s = herdStats(d.pos, d.sizes);
    assert.equal(s.positives, PRINTED.positives, 'positives');
    assert.equal(s.icc.toFixed(2), PRINTED.icc, 'ICC');
    assert.equal(s.deff.toFixed(2), PRINTED.deff, 'DEFF');
    assert.equal(Math.round(s.effN), PRINTED.effN, 'effective n');
    assert.equal((s.ci[0] * 100).toFixed(1), PRINTED.lo, 'adjusted lower');
    assert.equal((s.ci[1] * 100).toFixed(1), PRINTED.hi, 'adjusted upper');
    assert.equal((s.ciIndependent[0] * 100).toFixed(1), PRINTED.indLo, 'independent lower');
    assert.equal((s.ciIndependent[1] * 100).toFixed(1), PRINTED.indHi, 'independent upper');
  });
}

test('the data are the same for every layout (layout only moves dots)', () => {
  const a = herdData(HERD_LAYOUTS.desktop).pos;
  const b = herdData(HERD_LAYOUTS.phone).pos;
  assert.deepEqual(Array.from(a), Array.from(b));
});

test('display strings come from the statistics, and the DEFF line adds up from the digits it shows', () => {
  const { stats, display } = herdFacts();
  assert.equal(display.prevalence, (stats.p * 100).toFixed(1));
  assert.equal(display.deffFromShown, display.deff, `1 + (${display.meanSize} - 1) x ${display.iccFormula} must round to ${display.deff}`);
  assert.equal(Number(display.widen), Number(Math.sqrt(stats.deff).toFixed(2)));
  // The adjusted interval is the independent one widened by sqrt(DEFF) around p (what the bar shows).
  const indHalf = (stats.ciIndependent[1] - stats.ciIndependent[0]) / 2;
  const adjHalf = (stats.ci[1] - stats.ci[0]) / 2;
  assert.ok(Math.abs(adjHalf / indHalf - stats.widen) < 1e-12);
});

test('changing one dot changes the printed numbers (they are not typed)', () => {
  const d = herdData(HERD_LAYOUTS.desktop);
  const pos = Float32Array.from(d.pos);
  const i = pos.indexOf(0);
  pos[i] = 1;
  const moved = herdDisplay(herdStats(pos, d.sizes));
  assert.equal(moved.positives, '147');
  assert.notEqual(moved.prevalence, herdFacts().display.prevalence);
});

test('the herd copies the course sample-size example (bank item 107039)', () => {
  const course = JSON.parse(readFileSync(fileURLToPath(new URL('../fixtures/course/epi-course-2026.json', import.meta.url)), 'utf8'));
  const item = course.items.find((x) => x.id === HERD_DESIGN.courseItem);
  assert.ok(item, 'course item 107039');
  assert.equal(item.input.m, HERD_DESIGN.perFarm);
  assert.equal(item.input.rho, HERD_DESIGN.icc);
  assert.equal(Math.ceil(item.value.n), HERD_DESIGN.animals);
  assert.match(item.courseAnswer, new RegExp(`n = ${HERD_DESIGN.animals}\\b`));
});

test('no herd or evidence number is typed into the landing or entrance dictionaries', () => {
  const forbidden = ['146', '728', '49', '20.1', '16.3', '23.8', '17.1', '23.0', '1.70', '1.30', '428', '0.05', '14.9', '698', '220', '3107508'];
  for (const dict of [landing, entrance]) {
    for (const lang of ['th', 'en']) {
      for (const [k, v] of Object.entries(dict[lang])) {
        for (const n of forbidden) {
          const re = new RegExp(`(^|[^0-9.])${n.replace('.', '\\.')}($|[^0-9])`);
          assert.ok(!re.test(v), `${lang} ${k} types the number ${n}: ${v}`);
        }
      }
    }
  }
});

for (const [name, layout] of Object.entries(HERD_LAYOUTS)) {
  test(`${name} still herd: every ring and every dot lies inside the viewBox (review round 3: edge rings cut)`, () => {
    const d = herdData(layout);
    const s = STILL_STYLE[name];
    const half = stillHalf(name);
    const ringOuter = layout.R + s.ringPad + s.ringStroke / 2;
    for (let f = 0; f < d.FARMS; f++) {
      for (const c of [d.centers[f * 2], d.centers[f * 2 + 1]]) {
        assert.ok(Math.abs(c) + ringOuter <= half, `${name} farm ${f}: ring reaches ${Math.abs(c) + ringOuter} past ${half}`);
      }
    }
    for (let j = 0; j < d.N; j++) {
      for (const c of [d.farm[j * 2], d.farm[j * 2 + 1]]) assert.ok(Math.abs(c) + s.dot * 1.25 <= half, `${name} dot ${j}`);
    }
  });
}

test('sample cells: marked cells and conversion counts are derived from the cells', () => {
  assert.equal(RAW_ROWS.length, 5);
  assert.deepEqual(conversionCounts(), { be: 4, confirmed: 1, confirmedExample: '2/4/2025', thaiDigits: 1, missing: 2 });
  const rows = cleanRows();
  assert.deepEqual(rows.map((r) => r[2]), ['2025-03-12', '2025-03-13', '2025-04-02']);
  assert.deepEqual(rows[0], ['C-0412', 'F03', '2025-03-12', '4', 'บวก']);
  assert.equal(rows[1][3], null);
  assert.equal(rows[2][4], null);
  // Every date cell is marked (BE or needs confirming), plus the Thai digit and the two missing cells.
  assert.equal(markedCells().length, 5 + 1 + 2);
});
