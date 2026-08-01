import assert from 'node:assert/strict';
import test from 'node:test';

import { BANK_REGISTRY } from '../../src/data/bank-registry.generated.js';

let freshImportId = 0;

async function importFreshQuestions() {
  const url = new URL('../../src/data/questions.js', import.meta.url);
  url.searchParams.set('test-run', String(freshImportId++));
  return import(url.href);
}

// Expected totals come from the registry, not from literals. The point of these
// tests is that overlapping scopes union without duplicating, so hard-coding the
// counts only meant every content commit had to hand-edit them — and a number you
// re-paste from the failing run is a number that has stopped checking anything.
// Bank loss is still caught, by lint:registry, lint:curriculum and `npm run stats`.
const banks = Object.values(BANK_REGISTRY);
const sumWhere = (pred) => banks.filter(pred).reduce((n, b) => n + b.count, 0);

const CROSS_YEAR_TOTAL = sumWhere((b) => b.year === null);
const YEAR_4_TOTAL = CROSS_YEAR_TOTAL + sumWhere((b) => b.year === 4);
const YEAR_4_AND_5_TOTAL = CROSS_YEAR_TOTAL + sumWhere((b) => b.year === 4 || b.year === 5);
const ALL_TOTAL = sumWhere(() => true);

function assertUniqueSubjectIds(questions) {
  const keys = questions.map(({ subject, id }) => `${subject}:${id}`);
  assert.equal(
    new Set(keys).size,
    questions.length,
    'every loaded question must have a unique subject:id identity',
  );
}

test('overlapping sequential scopes merge each registry bank once', async () => {
  const {
    QB,
    isQBLoaded,
    isQBYearLoaded,
    isQBFullyLoaded,
    loadQB,
    loadQBForYear,
  } = await importFreshQuestions();

  assert.equal(QB.length, 0);
  assert.equal(isQBLoaded(), false);
  assert.equal(isQBYearLoaded(4), false);
  assert.equal(isQBFullyLoaded(), false);

  const observedLengths = [];

  assert.strictEqual(await loadQBForYear(4), QB);
  observedLengths.push(QB.length);
  assert.equal(isQBLoaded(), true);
  assert.equal(isQBYearLoaded(4), true);
  assert.equal(isQBYearLoaded(5), false);
  assert.equal(isQBFullyLoaded(), false);
  assertUniqueSubjectIds(QB);

  assert.strictEqual(await loadQBForYear(5), QB);
  observedLengths.push(QB.length);
  assert.equal(isQBYearLoaded(5), true);
  assert.equal(isQBFullyLoaded(), false);
  assertUniqueSubjectIds(QB);

  assert.strictEqual(await loadQBForYear(4), QB);
  observedLengths.push(QB.length);
  assert.equal(isQBFullyLoaded(), false);
  assertUniqueSubjectIds(QB);

  assert.strictEqual(await loadQB(), QB);
  observedLengths.push(QB.length);
  assert.equal(isQBFullyLoaded(), true);
  assertUniqueSubjectIds(QB);

  assert.strictEqual(await loadQB(), QB);
  observedLengths.push(QB.length);
  assert.equal(isQBFullyLoaded(), true);
  assertUniqueSubjectIds(QB);

  assert.deepEqual(observedLengths, [
    YEAR_4_TOTAL,
    YEAR_4_AND_5_TOTAL,
    YEAR_4_AND_5_TOTAL,
    ALL_TOTAL,
    ALL_TOTAL,
  ]);
  // the union must actually have grown at each new scope, not just matched a formula
  assert.ok(YEAR_4_TOTAL > 0 && YEAR_4_AND_5_TOTAL > YEAR_4_TOTAL && ALL_TOTAL > YEAR_4_AND_5_TOTAL);
});

test('concurrent overlapping scopes remain duplicate-free', async () => {
  const {
    QB,
    isQBFullyLoaded,
    loadQB,
    loadQBForYear,
  } = await importFreshQuestions();

  const results = await Promise.all([
    loadQBForYear(4),
    loadQBForYear(5),
    loadQB(),
  ]);

  assert.equal(QB.length, ALL_TOTAL);
  assert.ok(results.every((questions) => questions === QB));
  assert.equal(isQBFullyLoaded(), true);
  assertUniqueSubjectIds(QB);
});
