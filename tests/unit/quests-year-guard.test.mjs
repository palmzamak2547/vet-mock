// ============================================================
// quests-year-guard.test.mjs -- only someone who knows the year may
// generate the day's quest set
// ============================================================
// Daily quests are generated lazily by readState(date, year) the first
// time anything touches today's key, and the generated set is persisted
// for the rest of the day. The panel (getTodaysQuests / getBonusState)
// passes the student's year so subject-locked templates from other years
// are filtered out. recordQuestEvent and the claim functions do not know
// the year -- and they can be the first caller of the day: a practice set
// started at 23:50 and submitted at 00:05 records its answers against a
// date that has no set yet. Generating there skipped the year filter
// (templateFitsYear returns true for a non-finite year), used a different
// seed, and PERSISTED the result, so the panel then served a year-2
// student "COM V" missions nobody in that year can earn, all day.
//
// The fix: readState refuses to generate without a year. It hands back an
// empty state that is neither persisted nor cached, so the event is simply
// not counted and the next getTodaysQuests(year) creates the real set.
// ============================================================

import test, { mock } from 'node:test';
import assert from 'node:assert/strict';
import { readFileSync } from 'node:fs';
import { SUBJECTS } from '../../src/data/curriculum.js';

// quests.js reads window.localStorage, so the shim hangs off `window`.
const store = new Map();
const localStorage = {
  get length() { return store.size; },
  key: (i) => Array.from(store.keys())[i] ?? null,
  getItem: (k) => store.get(k) ?? null,
  setItem: (k, v) => { store.set(k, String(v)); },
  removeItem: (k) => { store.delete(k); },
  clear: () => store.clear(),
};
globalThis.window = {
  localStorage,
  dispatchEvent: () => true,
  addEventListener() {},
  removeEventListener() {},
};

// The night-owl case from the report: it is five past midnight and the
// day's set does not exist yet. Pinning the date also pins the seeded
// picks, so every assertion below is the same on every run.
mock.timers.enable({ apis: ['Date'], now: new Date(2026, 8, 6, 0, 5, 0) });
test.after(() => mock.timers.reset());

const STREAK_KEY = 'vmx-quests-streak';
const questKeys = () =>
  Array.from(store.keys()).filter((k) => k.startsWith('vmx-quests-') && k !== STREAK_KEY);

// Each instance gets its own module-level cache, like a fresh page load.
let instance = 0;
const freshQuests = () =>
  import(new URL(`../../src/lib/quests.js?instance=${++instance}`, import.meta.url).href);

// Template id -> subject id (or null), read off the source so the test
// does not restate the pool. The checkout may be CRLF, so normalise first.
const SRC = readFileSync(new URL('../../src/lib/quests.js', import.meta.url), 'utf8').replace(/\r\n/g, '\n');
const TEMPLATE_SUBJECT = new Map();
for (const chunk of SRC.split(/\n  \{\n/).slice(1)) {
  const id = chunk.match(/^\s*id: '([^']+)'/)?.[1];
  const subject = chunk.match(/\n\s*subject: '([^']+)'/)?.[1];
  if (id) TEMPLATE_SUBJECT.set(id, subject ?? null);
}
const SUBJECT_YEAR = new Map(SUBJECTS.map((s) => [s.id, s.year]));

function assertFitsYear(ids, year) {
  for (const id of ids) {
    const subject = TEMPLATE_SUBJECT.get(id);
    if (!subject) continue;
    assert.equal(
      SUBJECT_YEAR.get(subject),
      year,
      `${id} is a year-${SUBJECT_YEAR.get(subject)} mission handed to a year-${year} student`,
    );
  }
}

test('the template parser sees the whole pool', async () => {
  const quests = await freshQuests();
  assert.equal(TEMPLATE_SUBJECT.size, quests.getQuestPoolSize());
  assert.ok([...TEMPLATE_SUBJECT.values()].some(Boolean), 'the pool should still have subject-locked templates');
});

test('an answer recorded before the day has a set does not conjure a year-blind one', async () => {
  store.clear();
  const quests = await freshQuests();

  // finishExam at 00:05 -> recordQuestEvent('answered', ...) with no year.
  quests.recordQuestEvent('answered', { subject: 'com5', correct: true });
  assert.deepEqual(
    questKeys(),
    [],
    'recordQuestEvent persisted a quest set it could not scope to a year',
  );

  // The panel then asks with the year it knows and must get a set that
  // fits that year...
  const mine = quests.getTodaysQuests(2).map((q) => q.id);
  assert.equal(mine.length, 3);
  assertFitsYear(mine, 2);

  // ...and exactly the set a classmate who opened Home first gets, so the
  // cohort still sees the same daily three.
  store.clear();
  const fromHome = (await freshQuests()).getTodaysQuests(2).map((q) => q.id);
  assert.deepEqual(mine, fromHome);
});

test('claiming before the day has a set is a refusal, not a generator', async () => {
  store.clear();
  const quests = await freshQuests();
  assert.equal(quests.claimQuestReward('answer-10-any'), false);
  assert.equal(quests.claimBonusReward(), false);
  assert.deepEqual(questKeys(), [], 'a claim persisted a quest set it could not scope to a year');
});

test('the panel, which knows the year, still generates the set and events land on it', async () => {
  store.clear();
  const quests = await freshQuests();
  const today = quests.getTodaysQuests(5);
  assert.equal(today.length, 3);
  assert.equal(questKeys().length, 1, 'the panel should persist exactly one set for the day');
  assertFitsYear(today.map((q) => q.id), 5);

  quests.recordQuestEvent('answered', { subject: 'com5', correct: true });
  for (const q of quests.getTodaysQuests(5)) {
    const subject = TEMPLATE_SUBJECT.get(q.id);
    const counts = q.id.startsWith('answer-') && (!subject || subject === 'com5');
    assert.equal(q.progress, counts ? 1 : 0, `${q.id} progress after one com5 answer`);
  }
  assert.equal(questKeys().length, 1);
});
