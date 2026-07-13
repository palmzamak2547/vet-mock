import assert from 'node:assert/strict';
import test from 'node:test';

let freshImportId = 0;

async function importFreshQuestions() {
  const url = new URL('../../src/data/questions.js', import.meta.url);
  url.searchParams.set('test-run', String(freshImportId++));
  return import(url.href);
}

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

  assert.deepEqual(observedLengths, [2411, 2650, 2650, 2948, 2948]);
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

  assert.equal(QB.length, 2948);
  assert.ok(results.every((questions) => questions === QB));
  assert.equal(isQBFullyLoaded(), true);
  assertUniqueSubjectIds(QB);
});
