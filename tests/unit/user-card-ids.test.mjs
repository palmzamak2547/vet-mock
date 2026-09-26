// ============================================================
// user-card-ids.test.mjs — a card a student writes never shares an id with a
// bank question (B61)
// ============================================================
// srCards is keyed by bare id, and the SR session builds its pool keyed by id.
// Personal flashcards took 70000+ and cloze cards 75000+, the comment said
// "disjoint", but the year-1 banks were later numbered 70001-76039. A new
// flashcard inherited a bank question's schedule, grading one moved both, and
// one of the two dropped out of the session.
//
// New cards now take ids in a namespace no bank uses. A stored card whose id
// a bank question holds moves once, deterministically, to old id + 9,000,000
// and keeps `legacyId` so the schedule it shared can still be found.
// ============================================================

import test from 'node:test';
import assert from 'node:assert/strict';
import { BANK_REGISTRY } from '../../src/data/bank-registry.generated.js';

const KEY = 'vmx-user-flashcards';

function installStorage({ failWrites = false } = {}) {
  const map = new Map();
  const state = { failWrites };
  const storage = {
    getItem: (k) => (map.has(k) ? map.get(k) : null),
    setItem: (k, v) => {
      if (state.failWrites) { const e = new Error('QuotaExceededError'); e.name = 'QuotaExceededError'; throw e; }
      map.set(k, String(v));
    },
    removeItem: (k) => map.delete(k),
  };
  globalThis.window = { localStorage: storage, dispatchEvent: () => true, addEventListener() {}, removeEventListener() {} };
  return { map, state };
}

const uf = await import('../../src/lib/user-flashcards.js');

let bankIds;
async function allBankIds() {
  if (bankIds) return bankIds;
  bankIds = new Set();
  for (const bank of BANK_REGISTRY) for (const q of await bank.load()) bankIds.add(q.id);
  return bankIds;
}

test('no bank question id falls in a namespace students write into', async () => {
  const ids = await allBankIds();
  for (const [name, [lo, hi]] of Object.entries(uf.USER_CARD_ID_RANGES)) {
    const hit = [...ids].filter((id) => id >= lo && id <= hi);
    assert.deepEqual(hit, [], `${name} (${lo}-${hi}) overlaps bank ids`);
  }
  // Image-occlusion decks allocate below 90000 (image-occlusion.js).
  assert.deepEqual([...ids].filter((id) => id >= 80000 && id <= 89999), [], 'occlusion window overlaps bank ids');
});

test('the legacy collision list is exactly the bank ids between 70000 and 79999', async () => {
  const ids = [...(await allBankIds())].filter((id) => id >= 70000 && id <= 79999).sort((a, b) => a - b);
  const listed = uf.LEGACY_BANK_ID_RANGES.flatMap(([lo, hi]) => Array.from({ length: hi - lo + 1 }, (_, i) => lo + i));
  assert.deepEqual(listed, ids, 'a bank added or removed ids in the old personal-card range; update LEGACY_BANK_ID_RANGES');
});

test('new flashcards and cloze cards never take a bank id', async () => {
  installStorage();
  const ids = await allBankIds();
  const saved = [];
  for (let i = 0; i < 5; i++) saved.push(uf.saveUserFlashcard({ front: `front ${i}`, back: `back ${i}` }).id);
  saved.push(...uf.saveClozeText({ fullText: '{{c1::insulin}} lowers {{c2::glucose}} via {{c3::GLUT4}}' }).map((c) => c.id));
  assert.equal(new Set(saved).size, saved.length, 'ids are unique');
  assert.deepEqual(saved.filter((id) => ids.has(id)), [], 'a new card took a bank question id');
  assert.ok(saved.every(Number.isSafeInteger));
});

test('a stored card on a bank id moves once, keeps its legacy id, and the rest stay put', () => {
  const { map } = installStorage();
  map.set(KEY, JSON.stringify([
    { id: 70000, type: 'flashcard', subject: null, front: 'a', back: 'A', q: 'a', createdAt: 1 },
    { id: 70001, type: 'flashcard', subject: null, front: 'b', back: 'B', q: 'b', createdAt: 2 },
    { id: 75000, type: 'cloze', subject: null, fullText: 't', clozeIdx: 1, front: 'c', back: 'C', q: 'c', deckGroupId: 'clz-1', createdAt: 3 },
    { id: 75001, type: 'cloze', subject: null, fullText: 't', clozeIdx: 2, front: 'd', back: 'D', q: 'd', deckGroupId: 'clz-1', createdAt: 3 },
  ]));
  const cards = uf.loadUserFlashcards();
  assert.deepEqual(cards.map((c) => [c.front, c.id, c.legacyId ?? null]), [
    ['a', 70000, null], ['b', 9070001, 70001], ['c', 75000, null], ['d', 9075001, 75001],
  ]);
  // The move is written back once, and a second read changes nothing.
  assert.deepEqual(JSON.parse(map.get(KEY)).map((c) => c.id), [70000, 9070001, 75000, 9075001]);
  assert.deepEqual(uf.loadUserFlashcards().map((c) => c.id), [70000, 9070001, 75000, 9075001]);
  // A later card never lands on a moved id.
  const next = uf.saveUserFlashcard({ front: 'e', back: 'E' });
  assert.ok(![70000, 9070001, 75000, 9075001].includes(next.id));
});

test('the move is the same when storage refuses the write-back', () => {
  const { map, state } = installStorage();
  map.set(KEY, JSON.stringify([{ id: 72001, type: 'flashcard', subject: null, front: 'x', back: 'X', q: 'x', createdAt: 1 }]));
  state.failWrites = true;
  assert.deepEqual(uf.loadUserFlashcards().map((c) => [c.id, c.legacyId]), [[9072001, 72001]]);
  assert.deepEqual(uf.loadUserFlashcards().map((c) => [c.id, c.legacyId]), [[9072001, 72001]]);
  assert.equal(JSON.parse(map.get(KEY))[0].id, 72001, 'nothing half-written');
});

test('the SR pool keeps both the bank question and the student card', async () => {
  installStorage();
  const ids = await allBankIds();
  const bank = [...ids].filter((id) => id >= 70000 && id <= 79999).slice(0, 5).map((id) => ({ id, subject: 'biochem-1' }));
  const mine = [];
  for (let i = 0; i < 5; i++) mine.push(uf.saveUserFlashcard({ front: `f${i}`, back: 'b' }));
  mine.push(...uf.saveClozeText({ fullText: '{{c1::a}} {{c2::b}}' }));
  const pool = {};
  for (const q of [...bank, ...mine]) pool[q.id] = q; // SRSessionView keys by bare id
  assert.equal(Object.keys(pool).length, bank.length + mine.length, 'a card was dropped from the pool');
});

test('a moved card keeps the review schedule it had before the move', async () => {
  installStorage();
  const moved = { id: 9070001, legacyId: 70001, type: 'flashcard' };
  const shared = { questionId: 70001, interval: 16, repetitions: 3, totalReviews: 4, nextReview: 123 };
  // Before the move the card read srCards[70001]; after it the SR screens must
  // still find that schedule, stamped with the card's new id.
  assert.deepEqual(uf.srCardFor({ 70001: shared }, moved), { ...shared, questionId: 9070001 });
  // Once the card has its own record, that record wins.
  const own = { questionId: 9070001, interval: 1, repetitions: 1, totalReviews: 5, nextReview: 456 };
  assert.equal(uf.srCardFor({ 70001: shared, 9070001: own }, moved), own);
  // Bank questions and never-moved cards read only their own id.
  assert.equal(uf.srCardFor({ 70001: shared }, { id: 70001 }), shared);
  assert.equal(uf.srCardFor({ 70001: shared }, { id: 9100000 }), undefined);
  assert.equal(uf.srCardFor(null, moved), undefined);
});

test('the SR session reads schedules through srCardFor, so moved cards keep theirs', async () => {
  const { readFileSync } = await import('node:fs');
  const src = readFileSync(new URL('../../src/views/SRSessionView.jsx', import.meta.url), 'utf8');
  assert.match(src, /import \{[^}]*srCardFor[^}]*\} from '\.\.\/lib\/user-flashcards\.js'/);
  assert.doesNotMatch(src, /srCards\[q\.id\]/, 'the pool build must not read the bare id');
  assert.doesNotMatch(src, /srCards\[id\]/, 'the stats must not read the bare id');
  assert.doesNotMatch(src, /current\[currentCard\.questionId\] \|\| initCard/, 'grading must start from the carried schedule');
});
