// ============================================================
// image-occlusion-deck-id.test.mjs — a new deck never inherits a deleted
// deck's review schedule (B21, B62)
// ============================================================
// Card ids are deck.id + mask.slot, and srCards (cloud-synced) is keyed by
// that id. nextDeckId used to be max(remaining ids) + 100, so deleting the
// newest deck (or your only deck) and making a new one handed the new deck
// the same id: its first cards opened with the deleted cards' intervals,
// hidden from review for days and counted as reviewed. Driven against the
// real store, the real SM-2 and a stubbed localStorage.
// ============================================================

import test from 'node:test';
import assert from 'node:assert/strict';

const SR_KEY = 'vmx-sr-cards';
const IMG = 'data:image/png;base64,AAAA';

function installStorage() {
  const rows = new Map();
  globalThis.window = {
    localStorage: {
      getItem: (k) => (rows.has(k) ? rows.get(k) : null),
      setItem: (k, v) => { rows.set(k, v); },
      removeItem: (k) => rows.delete(k),
    },
    dispatchEvent: () => true,
    addEventListener() {},
    removeEventListener() {},
  };
  return rows;
}

const io = await import('../../src/lib/image-occlusion.js');
const sm2 = await import('../../src/hooks/sm2.js');

const mask = (id, answer) => ({ id, x: 0.1, y: 0.1, w: 0.2, h: 0.2, label: '', answer });

/** Grade every card of a deck Easy three times and persist, as a session does. */
function review(rows, deckId) {
  const sr = JSON.parse(rows.get(SR_KEY) || '{}');
  for (const card of io.loadOcclusionCards().filter((c) => c.deckId === deckId)) {
    let s = sr[card.id] || sm2.initCard(card.id);
    for (let i = 0; i < 3; i++) s = sm2.updateCard(s, 5);
    sr[card.id] = s;
  }
  rows.set(SR_KEY, JSON.stringify(sr));
  return sr;
}

/** The pool SRSessionView builds: srCards[q.id] || a new card. */
function poolFor(rows, deckId) {
  const sr = JSON.parse(rows.get(SR_KEY) || '{}');
  return io.loadOcclusionCards().filter((c) => c.deckId === deckId)
    .map((c) => ({ answer: c.answer, id: c.id, inherited: Boolean(sr[c.id]) }));
}

test('deleting the newest reviewed deck and making a new one starts every new card fresh', () => {
  const rows = installStorage();
  const a = io.saveDeck({ name: 'A', imageDataUrl: IMG, masks: [mask('a1', 'femur'), mask('a2', 'tibia')] });
  const b = io.saveDeck({ name: 'B', imageDataUrl: IMG, masks: [mask('b1', 'femur head'), mask('b2', 'trochanter')] });
  review(rows, b.id);
  assert.equal(io.deleteDeck(b.id), true);
  const c = io.saveDeck({ name: 'C', imageDataUrl: IMG, masks: [mask('c1', 'left atrium'), mask('c2', 'aorta'), mask('c3', 'vena cava')] });
  assert.notEqual(c.id, b.id, 'the new deck took the deleted deck\'s id');
  assert.deepEqual(poolFor(rows, c.id).filter((x) => x.inherited), [], 'a new card opened with a deleted card\'s schedule');
  const due = sm2.getDueCards(Object.fromEntries(poolFor(rows, c.id).map((x) => [x.id, sm2.initCard(x.id)])));
  assert.equal(due.length, 3);
  assert.ok(a.id !== c.id);
});

test('deleting your only reviewed deck and making another does not reuse it either', () => {
  const rows = installStorage();
  const first = io.saveDeck({ name: 'Only', imageDataUrl: IMG, masks: [mask('x', 'radius')] });
  review(rows, first.id);
  io.deleteDeck(first.id);
  const again = io.saveDeck({ name: 'Redo', imageDataUrl: IMG, masks: [mask('y', 'ulna')] });
  assert.notEqual(again.id, first.id);
  assert.deepEqual(poolFor(rows, again.id).filter((x) => x.inherited), []);
});

test('a schedule synced from another device keeps its window out of reach too', () => {
  const rows = installStorage();
  // Device 1 reviewed its first deck (80099) and srCards synced here; this
  // device has no decks yet.
  const sr = {};
  for (const id of [80099, 80100]) sr[id] = sm2.updateCard(sm2.initCard(id), 5);
  rows.set(SR_KEY, JSON.stringify(sr));
  const deck = io.saveDeck({ name: 'Here', imageDataUrl: IMG, masks: [mask('z', 'humerus')] });
  assert.deepEqual(poolFor(rows, deck.id).filter((x) => x.inherited), []);
});

test('ids of decks that exist never move, and a never-reviewed deleted id may be reused', () => {
  const rows = installStorage();
  const a = io.saveDeck({ name: 'A', imageDataUrl: IMG, masks: [mask('a', 'atlas')] });
  const b = io.saveDeck({ name: 'B', imageDataUrl: IMG, masks: [mask('b', 'axis')] });
  assert.equal(b.id, a.id + 100);
  io.deleteDeck(b.id); // never reviewed: nothing to inherit
  const c = io.saveDeck({ name: 'C', imageDataUrl: IMG, masks: [mask('c', 'sacrum')] });
  assert.equal(c.id, b.id);
  assert.equal(io.findDeck(a.id).id, a.id);
  assert.equal(rows.has(SR_KEY), false, 'allocation only reads the schedule store');
});

test('every allocated window stays below the 90000 bank block', () => {
  const rows = installStorage();
  // A long history of reviewed, deleted decks has burned the high windows.
  const sr = {};
  for (let id = 80099; id < 90000; id += 100) sr[id] = sm2.initCard(id);
  delete sr[80499]; // one window was never reviewed
  rows.set(SR_KEY, JSON.stringify(sr));
  const deck = io.saveDeck({ name: 'Late', imageDataUrl: IMG, masks: [mask('l', 'patella')] });
  assert.ok(deck, 'a free window still exists');
  assert.ok(deck.id + 99 < 90000, `window ${deck.id} runs into bank ids`);
  assert.deepEqual(poolFor(rows, deck.id).filter((x) => x.inherited), []);
});
