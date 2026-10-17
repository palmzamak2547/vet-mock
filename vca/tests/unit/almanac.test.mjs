// The almanac as printed ("VCA ALMANAC, CUVET: สถิติจำนวนข้อสอบ VCA ปี 58 ถึง 68", 15 ต.ค. 2569):
// every figure the site derives from the transcribed table must equal the one in print, so a
// mistyped cell in src/data/almanac.js fails here before it reaches a page.
import { test } from 'node:test';
import assert from 'node:assert/strict';
import {
  YEARS, RECENT, GROUPS, NOTES, SUBJECTS, cellValue, yearTotal, yearSubjects, recentMean, trend, longRun,
  groupTotals, domainSeries, domainMeans, domainTrend, domainProfile, domainShares, examWeights,
} from '../../src/data/almanac.js';
import { DOMAINS } from '../../src/data/domains.js';

const bySubject = (en) => {
  const s = SUBJECTS.find((x) => x.en === en);
  assert.ok(s, `no subject "${en}"`);
  return s;
};
const close = (actual, printed, half, label) => {
  assert.ok(Math.abs(actual - printed) <= half + 1e-9, `${label}: ${actual} does not round to the printed ${printed}`);
};

test('eleven years, 2558 to 2568, and the three latest as the recent window', () => {
  assert.deepEqual(YEARS, [2558, 2559, 2560, 2561, 2562, 2563, 2564, 2565, 2566, 2567, 2568]);
  assert.deepEqual(RECENT, [2566, 2567, 2568]);
});

test('forty subjects in six groups, each with one cell per year', () => {
  assert.equal(SUBJECTS.length, 40);
  assert.equal(new Set(SUBJECTS.map((s) => s.en)).size, 40);
  const groups = new Set(GROUPS.map((g) => g.id));
  for (const s of SUBJECTS) {
    assert.ok(groups.has(s.group), `${s.en}: unknown group ${s.group}`);
    assert.equal(s.y.length, YEARS.length, `${s.en}: ${s.y.length} cells`);
    for (const cell of s.y) {
      const ok = cell === null || typeof cell === 'string' || Number.isInteger(cell)
        || (Array.isArray(cell) && cell.length === 2 && cell.every(Number.isInteger));
      assert.ok(ok, `${s.en}: unexpected cell ${JSON.stringify(cell)}`);
    }
    if (s.note) assert.ok(NOTES[s.note], `${s.en}: note ${s.note} has no text`);
  }
  assert.deepEqual(GROUPS.map((g) => g.id), ['small', 'livestock', 'avian', 'exotic', 'preclinic', 'public']);
  assert.deepEqual(Object.keys(NOTES).map(Number), [1, 2, 3, 4, 5, 6, 7, 8]);
});

test('a cell reads as one number: parts summed, words and missing years as null', () => {
  assert.equal(cellValue(7), 7);
  assert.equal(cellValue(0), 0);
  assert.equal(cellValue([6, 8]), 14);
  assert.equal(cellValue(null), null);
  assert.equal(cellValue('med'), null);
});

test('the yearly totals equal the printed "ผลรวมที่บันทึกได้" row', () => {
  assert.deepEqual(YEARS.map(yearTotal), [139, 156, 148, 176, 190, 204, 268, 257, 241, 249, 261]);
});

test('the subjects recorded each year equal the printed "จำนวนวิชาที่บันทึก" row', () => {
  assert.deepEqual(YEARS.map(yearSubjects), [23, 23, 23, 23, 23, 23, 24, 25, 40, 39, 38]);
});

// Table 2: the three-year mean (a year without a record counts as 0) and the direction
// (2568 less the mean of 2566 and 2567), as printed. null where the table prints a dash.
const TABLE_2 = [
  ['Diseases dogs & cats', 14.3, 7.0], ['Surgery', 14.3, -0.5], ['Repro dogs & cats', 8.3, 7.0],
  ['Anesthesiology', 7.7, 0.5], ['Neurology', 4.0, -1.5], ['Ophthalmology', 3.3, -2.0],
  ['Dermatology', 2.7, 0.5], ['Emergency', 2.0, null],
  ['Ruminant medicine', 15.7, -2.5], ['Swine medicine', 11.0, 1.5], ['Ruminant mgmt & nutrition', 10.3, -5.0],
  ['Ruminant reproduction', 6.7, 2.0], ['Swine reproduction', 3.7, 0.5], ['Nutrition', 2.0, -3.0],
  ['Avian medicine', 14.7, 9.5], ['Aquatic medicine', 11.3, 4.0], ['Equine medicine & surgery', 9.7, 2.0],
  ['Reproduction in horses', 3.7, 0.5],
  ['Exotic medicine', 8.0, 9.0], ['Wildlife medicine', 1.3, 1.0],
  ['Pharmacology', 9.3, -0.5], ['Helminthology', 8.3, -0.5], ['Anatomy', 7.7, -4.0],
  ['Hematology (+Cytology)', 6.3, 2.5], ['Radiology', 5.7, 0.5], ['Pathology', 5.0, -3.0],
  ['Protozoology', 4.7, -2.5], ['Physiology', 3.7, -1.0], ['Clinical chemistry', 2.7, -2.5],
  ['Immunology & Vaccinology', 2.7, -2.5], ['Entomology', 2.7, 2.0], ['Bacteriology', 2.3, -2.0],
  ['Mycology', 1.3, -0.5], ['Virology', 0.3, null],
  ['Epidemiology', 10.3, 4.0], ['VPH (Milk/Meat/FIQC)', 9.7, -4.0], ['Animal welfare', 4.7, 0.5],
  ['One health / Food safety', 3.7, 2.0], ['Juris & Ethics', 3.0, 1.5], ['Zoonosis', 1.7, -1.0],
];

test('Table 2 covers every subject', () => {
  assert.deepEqual(new Set(TABLE_2.map(([en]) => en)), new Set(SUBJECTS.map((s) => s.en)));
});

for (const [en, mean, direction] of TABLE_2) {
  test(`Table 2: ${en} averages ${mean.toFixed(1)} and moves ${direction === null ? 'no figure' : direction.toFixed(1)}`, () => {
    const s = bySubject(en);
    assert.equal(recentMean(s).toFixed(1), mean.toFixed(1));
    const t = trend(s);
    if (direction === null) assert.equal(t, null);
    else assert.equal(t.toFixed(1), direction.toFixed(1));
  });
}

test('Table 2 (cont.): group totals for 2566, 2567 and 2568', () => {
  const expected = {
    small: [55, 53, 62], livestock: [53, 50, 45], avian: [36, 32, 50],
    exotic: [2, 10, 16], preclinic: [64, 71, 53], public: [31, 33, 35],
  };
  RECENT.forEach((year, k) => {
    const totals = groupTotals(year);
    assert.deepEqual(totals.map((g) => g.id), GROUPS.map((g) => g.id));
    for (const g of totals) assert.equal(g.total, expected[g.id][k], `${g.id} ${year}`);
    assert.equal(totals.reduce((sum, g) => sum + g.total, 0), yearTotal(year));
  });
});

// Table 3: subjects recorded at least 8 years, over the years that hold a number, with the
// population standard deviation. [years, mean, SD, min, max, CV] as printed.
const TABLE_3 = {
  'Diseases dogs & cats': [11, 24.9, 9.0, 11, 40, 0.36],
  Surgery: [11, 17.2, 6.5, 11, 36, 0.38],
  'Avian medicine': [11, 17.1, 5.6, 8, 26, 0.32],
  'Equine medicine & surgery': [11, 12.2, 4.1, 5, 19, 0.34],
  'Aquatic medicine': [11, 12.0, 4.8, 6, 21, 0.40],
  'Ruminant reproduction': [11, 10.7, 3.3, 4, 17, 0.31],
  Epidemiology: [11, 8.9, 4.8, 0, 20, 0.54],
  Radiology: [11, 7.8, 2.7, 4, 14, 0.34],
  Anesthesiology: [11, 7.8, 2.1, 4, 12, 0.27],
  'Repro dogs & cats': [10, 7.5, 3.5, 4, 14, 0.47],
  'Swine reproduction': [9, 7.4, 4.1, 3, 15, 0.55],
  Helminthology: [11, 7.2, 3.3, 1, 12, 0.46],
  'Exotic medicine': [11, 7.1, 5.4, 0, 16, 0.76],
  'Immunology & Vaccinology': [11, 6.0, 3.7, 0, 12, 0.62],
  Virology: [9, 4.8, 4.4, 0, 14, 0.93],
  Physiology: [11, 4.3, 1.8, 1, 7, 0.42],
  Bacteriology: [11, 3.9, 3.8, 0, 12, 0.96],
  'Animal welfare': [11, 3.5, 1.6, 1, 5, 0.47],
  'Reproduction in horses': [11, 2.9, 1.8, 0, 7, 0.63],
  Dermatology: [10, 2.8, 2.2, 1, 9, 0.80],
  'Wildlife medicine': [11, 1.8, 1.7, 0, 5, 0.96],
  Entomology: [11, 1.6, 1.6, 0, 4, 0.95],
  Mycology: [11, 1.4, 1.3, 0, 5, 0.95],
};

test('Table 3 lists exactly the subjects recorded at least eight years', () => {
  const long = SUBJECTS.filter((s) => longRun(s).years >= 8).map((s) => s.en);
  assert.deepEqual(new Set(long), new Set(Object.keys(TABLE_3)));
});

for (const [en, [years, mean, sd, min, max, cv]] of Object.entries(TABLE_3)) {
  test(`Table 3: ${en}`, () => {
    const r = longRun(bySubject(en));
    assert.equal(r.years, years);
    close(r.mean, mean, 0.05, `${en} mean`);
    close(r.sd, sd, 0.05, `${en} SD`);
    assert.equal(r.min, min);
    assert.equal(r.max, max);
    close(r.cv, cv, 0.005, `${en} CV`);
  });
}

test('every domain a subject names is a domain of the site', () => {
  const ids = new Set(DOMAINS.map((d) => d.id));
  for (const s of SUBJECTS) {
    const named = s.domain === null ? [] : Array.isArray(s.domain) ? s.domain : [s.domain];
    for (const id of named) assert.ok(ids.has(id), `${s.en}: no domain ${id}`);
    if (Array.isArray(s.domain)) {
      // A split subject has two counts wherever it has a number.
      for (const cell of s.y) if (typeof cell === 'number') assert.fail(`${s.en}: one count for two domains`);
    }
  }
});

test('domain series add up to the yearly totals, split cells included', () => {
  const series = domainSeries();
  RECENT.forEach((year, k) => {
    const sum = [...series.values()].reduce((acc, s) => acc + s[k], 0);
    assert.equal(sum, yearTotal(year), `${year}`);
  });
  const all = domainSeries(YEARS);
  YEARS.forEach((year, k) => {
    assert.equal([...all.values()].reduce((acc, s) => acc + s[k], 0), yearTotal(year), `${year} over all years`);
  });
});

test('domain means and shares describe the whole recent record', () => {
  const means = domainMeans();
  const total = [...means.values()].reduce((a, b) => a + b, 0);
  close(total, (241 + 249 + 261) / 3, 1e-9, 'sum of means');
  const profile = domainProfile();
  close([...profile.values()].reduce((sum, p) => sum + p.share, 0), 1, 1e-9, 'sum of shares');
  for (const [id, p] of profile) {
    close(p.mean, means.get(id), 1e-9, `${id} mean`);
    assert.ok(p.share > 0 && p.share < 1, `${id} share ${p.share}`);
  }
  const { all, shares } = domainShares();
  close(all, total, 1e-9, 'domainShares total');
  for (const [id, share] of shares) close(share, profile.get(id).share, 1e-9, `${id} share`);
  // Ruminant leads the recent record; the subjects no domain covers (Physiology, Nutrition) sit under null.
  const ranked = [...profile].filter(([id]) => id).sort((a, b) => b[1].mean - a[1].mean);
  assert.equal(ranked[0][0], 'ruminant');
  close(profile.get(null).mean, (4 + 4 + 3 + 0 + 6 + 0) / 3, 1e-9, 'unmapped mean');
});

test('domain directions follow the almanac rule', () => {
  assert.equal(domainTrend([2, 10, 16]), 10);
  assert.equal(domainTrend([10, 10, 10]), 0);
  const profile = domainProfile();
  assert.equal(profile.get('avian').move, 9.5);
  assert.equal(profile.get('exotic').move, 10);
  assert.equal(profile.get('ruminant').move, -7.5);
});

test('exam weights cover all nineteen domains, each above zero', () => {
  const weights = examWeights();
  assert.equal(Object.keys(weights).length, DOMAINS.length);
  for (const d of DOMAINS) assert.ok(weights[d.id] > 0, `${d.id}: weight ${weights[d.id]}`);
  assert.ok(!('null' in weights), 'unmapped subjects never weigh a draw');
});
