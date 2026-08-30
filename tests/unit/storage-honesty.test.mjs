// ============================================================
// Storage layers must tell the truth about what they stored
// ============================================================
// Three separate modules reported success they had not earned, and two
// derived identity from array positions. Each is exercised here against a
// real (stubbed) localStorage rather than by reading the source, because the
// bugs were in behaviour, not in wording.

import test from 'node:test';
import assert from 'node:assert/strict';

function installStorage({ limitBytes = Infinity } = {}) {
  const map = new Map();
  globalThis.window = {
    localStorage: {
      getItem: (k) => (map.has(k) ? map.get(k) : null),
      setItem: (k, v) => {
        const size = [...map.entries()].reduce((n, [kk, vv]) => (kk === k ? n : n + vv.length), 0) + v.length;
        if (size > limitBytes) { const e = new Error('QuotaExceededError'); e.name = 'QuotaExceededError'; throw e; }
        map.set(k, v);
      },
      removeItem: (k) => map.delete(k),
    },
    dispatchEvent: () => true,
  };
  globalThis.Event = class { constructor(t) { this.type = t; } };
  globalThis.CustomEvent = class { constructor(t, o) { this.type = t; Object.assign(this, o); } };
  return map;
}
function clearStorage() { delete globalThis.window; }

// ── XP: "today" must mean today ──────────────────────────────
test('XP earned yesterday is not announced as today', async () => {
  const map = installStorage();
  const { getXpState } = await import('../../src/lib/xp.js?xp1');
  map.set('vmx-xp', JSON.stringify({
    totalXp: 500, lifetimeQs: 40, todayDate: '2020-01-01', todayXp: 120,
  }));
  assert.equal(getXpState().todayXp, 0, 'yesterday\'s XP was still being shown as today\'s');
  assert.equal(getXpState().totalXp, 500, 'the running total must survive the rollover');
  clearStorage();
});

test('XP earned today still counts as today', async () => {
  const map = installStorage();
  const { getXpState } = await import('../../src/lib/xp.js?xp2');
  const d = new Date();
  const key = `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, '0')}-${String(d.getDate()).padStart(2, '0')}`;
  map.set('vmx-xp', JSON.stringify({ totalXp: 90, lifetimeQs: 3, todayDate: key, todayXp: 45 }));
  assert.equal(getXpState().todayXp, 45);
  clearStorage();
});

// ── Image occlusion: card ids must survive a reshuffle ────────
test('SR card ids do not move when another deck is created', async () => {
  installStorage();
  const io = await import('../../src/lib/image-occlusion.js?io1');
  const img = 'data:image/png;base64,AAAA';
  const first = io.saveDeck({ name: 'Carpus', imageDataUrl: img, masks: [
    { x: 0.1, y: 0.1, w: 0.2, h: 0.2, label: 'a', answer: 'radius' },
    { x: 0.4, y: 0.4, w: 0.2, h: 0.2, label: 'b', answer: 'ulna' },
  ] });
  const before = io.loadOcclusionCards()
    .filter((c) => c.deckId === first.id)
    .map((c) => [c.maskId, c.id]).sort();

  // Adding a deck was already safe (cards are numbered createdAt-asc, so a
  // new deck lands at the end). Pinned anyway so a future change to that
  // sort cannot quietly reintroduce the deletion bug from the other side.
  io.saveDeck({ name: 'Stifle', imageDataUrl: img, masks: [
    { x: 0.2, y: 0.2, w: 0.1, h: 0.1, label: 'c', answer: 'patella' },
  ] });
  const after = io.loadOcclusionCards()
    .filter((c) => c.deckId === first.id)
    .map((c) => [c.maskId, c.id]).sort();

  assert.deepEqual(after, before, 'adding a deck re-pointed an existing deck\'s review schedule');
  clearStorage();
});

test('deleting a mask does not renumber the masks after it', async () => {
  installStorage();
  const io = await import('../../src/lib/image-occlusion.js?io2');
  const img = 'data:image/png;base64,AAAA';
  const deck = io.saveDeck({ name: 'Skull', imageDataUrl: img, masks: [
    { x: 0.1, y: 0.1, w: 0.1, h: 0.1, label: 'a', answer: 'frontal' },
    { x: 0.3, y: 0.3, w: 0.1, h: 0.1, label: 'b', answer: 'maxilla' },
    { x: 0.5, y: 0.5, w: 0.1, h: 0.1, label: 'c', answer: 'mandible' },
  ] });
  const idOf = (cards, answer) => cards.find((c) => c.answer === answer)?.id;
  const before = io.loadOcclusionCards();
  const mandibleBefore = idOf(before, 'mandible');

  const kept = deck.masks.filter((m) => m.answer !== 'maxilla');
  io.saveDeck({ ...deck, masks: kept });
  const after = io.loadOcclusionCards();

  assert.equal(idOf(after, 'mandible'), mandibleBefore,
    'removing an earlier mask moved a later mask\'s card id onto a different mask');
  assert.equal(idOf(after, 'maxilla'), undefined, 'the deleted mask still produces a card');
  clearStorage();
});

// ── Quota: a save that costs you decks must say so ───────────
test('a save that had to evict reports what it evicted', async () => {
  installStorage({ limitBytes: 2200 });
  const io = await import('../../src/lib/image-occlusion.js?io3');
  const big = 'data:image/png;base64,' + 'A'.repeat(600);
  io.saveDeck({ name: 'Old one', imageDataUrl: big, masks: [{ x: 0.1, y: 0.1, w: 0.1, h: 0.1, answer: 'x' }] });
  io.saveDeck({ name: 'Newer', imageDataUrl: big, masks: [{ x: 0.1, y: 0.1, w: 0.1, h: 0.1, answer: 'y' }] });
  const third = io.saveDeck({ name: 'Third', imageDataUrl: big, masks: [{ x: 0.1, y: 0.1, w: 0.1, h: 0.1, answer: 'z' }] });

  if (third) {
    // If storage had to make room, the caller must be able to see it.
    const remaining = io.loadDecks().length;
    if (remaining < 3) {
      assert.ok(Array.isArray(third._evicted) && third._evicted.length > 0,
        'decks were deleted to make room and the save still reported a clean success');
    }
  }
  clearStorage();
});
