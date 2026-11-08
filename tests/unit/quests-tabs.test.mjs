// ============================================================
// quests-tabs.test.mjs -- two open tabs keep one day of quests
// ============================================================
// Every tab loads its own copy of quests.js, and every copy reads and writes
// the same localStorage key for the day. The module kept the day's state in
// memory after its first read and built every write from that copy, so a
// second tab never saw what the first one did: a quest claimed there still
// showed its claim button here and paid its XP again, the day bonus paid
// twice, and this tab's next write put its old progress and claimed flags
// back over the other tab's.
// ============================================================

import test, { mock } from 'node:test';
import assert from 'node:assert/strict';

// One storage for every tab, as the browser has one per origin.
const store = new Map();
globalThis.window = {
  localStorage: {
    get length() { return store.size; },
    key: (i) => Array.from(store.keys())[i] ?? null,
    getItem: (k) => store.get(k) ?? null,
    setItem: (k, v) => { store.set(k, String(v)); },
    removeItem: (k) => { store.delete(k); },
    clear: () => store.clear(),
  },
  dispatchEvent: () => true,
  addEventListener() {},
  removeEventListener() {},
};

// Mid-morning, so no case here crosses a day.
mock.timers.enable({ apis: ['Date'], now: new Date(2026, 10, 10, 10, 0, 0) });
test.after(() => mock.timers.reset());

const { getXpState } = await import('../../src/lib/xp.js');

// Each import is a separate module instance with its own memory, as each tab is.
let instance = 0;
const openTab = () => import(new URL(`../../src/lib/quests.js?tab=${++instance}`, import.meta.url).href);

const YEAR = 4;
const quest = (id, target, xp, progress = 0, claimed = false) => ({ id, label: id, icon: '', target, xp, progress, claimed });
// The day's three as the panel stores them. Writing the set here keeps these
// cases about the tabs, not about which three the date happens to draw.
function seedDay(tab, quests) {
  const date = tab.todayKey();
  store.set(`vmx-quests-${date}`, JSON.stringify({ date, quests, bonusClaimed: false }));
}
const stored = (tab) => JSON.parse(store.get(`vmx-quests-${tab.todayKey()}`));
const xp = () => getXpState().totalXp;

test('a quest claimed in one tab is not paid again in another', async () => {
  store.clear();
  const a = await openTab();
  const b = await openTab();
  seedDay(a, [quest('answer-10-any', 10, 20), quest('review-5-sr', 5, 15), quest('read-1-topic', 1, 10)]);
  // Both tabs show the day's panel before anything is answered.
  a.getTodaysQuests(YEAR);
  b.getTodaysQuests(YEAR);

  for (let i = 0; i < 10; i += 1) a.recordQuestEvent('answered', { subject: 'com4', correct: true });
  assert.equal(a.claimQuestReward('answer-10-any'), true);
  assert.equal(xp(), 20);

  // Switching to the other tab renders its panel again (the focus refresh).
  const there = b.getTodaysQuests(YEAR).find((q) => q.id === 'answer-10-any');
  assert.equal(there.claimed, true, 'the other tab still offers a claim that was already paid');
  assert.equal(there.progress, 10);
  assert.equal(b.claimQuestReward('answer-10-any'), false, 'the same quest paid out twice');
  assert.equal(xp(), 20);
});

test('progress made in one tab is kept when another tab records its own', async () => {
  store.clear();
  const a = await openTab();
  const b = await openTab();
  seedDay(a, [quest('answer-10-any', 10, 20), quest('review-5-sr', 5, 15), quest('read-1-topic', 1, 10)]);
  a.getTodaysQuests(YEAR);
  b.getTodaysQuests(YEAR);

  for (let i = 0; i < 3; i += 1) a.recordQuestEvent('sr-graded', { quality: 2 });
  a.recordQuestEvent('notes-read', { subject: 'com4', topic: 't1' });
  assert.equal(a.claimQuestReward('read-1-topic'), true);

  // The other tab finishes a set without having been looked at since.
  b.recordQuestEvent('answered', { subject: 'com4', correct: true });

  const byId = Object.fromEntries(stored(a).quests.map((q) => [q.id, q]));
  assert.equal(byId['review-5-sr'].progress, 3, 'the other tab wrote its old progress over this one');
  assert.equal(byId['read-1-topic'].claimed, true, 'the other tab wrote an old claimed flag over this one');
  assert.equal(byId['answer-10-any'].progress, 1);
  // And this tab shows both on its next render.
  assert.deepEqual(a.getTodaysQuests(YEAR).map((q) => q.progress), [1, 3, 1]);
});

test('the day bonus is paid once whichever tab claims it', async () => {
  store.clear();
  const a = await openTab();
  const b = await openTab();
  seedDay(a, [quest('answer-10-any', 10, 20, 10, true), quest('review-5-sr', 5, 15, 5, true), quest('read-1-topic', 1, 10, 1, true)]);
  assert.equal(a.getBonusState(YEAR).available, true);
  assert.equal(b.getBonusState(YEAR).available, true);

  const bonus = a.getBonusState(YEAR).xp;
  assert.equal(a.claimBonusReward(), true);
  assert.equal(xp(), bonus);

  const there = b.getBonusState(YEAR);
  assert.equal(there.claimed, true, 'the other tab still offers the bonus');
  assert.equal(there.available, false);
  assert.equal(b.claimBonusReward(), false, 'the bonus paid out twice');
  assert.equal(xp(), bonus);
});
