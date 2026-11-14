// ============================================================
// Wrap-up revision deck: recall, reveal, mark, and the ต้องทวน round
// ============================================================
import test from 'node:test';
import assert from 'node:assert/strict';
import {
  AGAIN, KNOWN, cardId, deckKey, freshDeck, goTo, marked, OPEN_ALL, rate, readDeck, restart, resume, segments, startRedo, tally,
} from '../../src/lib/wrap-deck.js';
import { readFileSync } from 'node:fs';

const ids = ['t1|A', 't2|B', 't3|C', 't4|D'];

test('the key is per subject, term and paper, under vmx-wrap-', () => {
  assert.equal(deckKey('swine-clinic', '2569-1', '1-final'), 'vmx-wrap-deck-swine-clinic-2569-1-1-final');
  assert.match(deckKey('a b', null, undefined), /^vmx-wrap-deck-a_b-none-none$/);
  assert.equal(cardId({ topic: 'x', name: 'Y' }), 'x|Y');
});

test('a missing, corrupt, old or foreign value starts a clean deck', () => {
  for (const raw of [null, undefined, '', '{', 'null', '42', '"x"', JSON.stringify({ v: 0, pos: 2 }), JSON.stringify([1, 2])]) {
    assert.deepEqual(readDeck(raw, ids), freshDeck(), String(raw));
  }
});

test('a saved deck keeps what still exists and nothing else', () => {
  const saved = JSON.stringify({ v: 1, pos: 9, marks: { 't1|A': 'k', 'gone|Z': 'a', 't2|B': 'maybe', 't3|C': 'a' }, queue: ['gone|Z', 't3|C', 't3|C', 't1|A'], done: 'yes', pace: 'turbo' });
  const s = readDeck(saved, ids);
  assert.deepEqual(s.marks, { 't1|A': KNOWN, 't3|C': AGAIN });
  assert.deepEqual(s.queue, ['t3|C'], 'only cards still marked ต้องทวน, each once');
  assert.equal(s.pos, 2, 'a redo round resumes at its first card');
  assert.equal(s.done, false);
  assert.equal(s.pace, 'full');
  assert.equal(readDeck(JSON.stringify({ v: 1, pos: 9, marks: {} }), ids).pos, 0, 'a position past the end starts over');
  assert.equal(readDeck(JSON.stringify({ v: 1, pos: 1, marks: {}, pace: 'quick' }), ids).pace, 'quick');
});

test('marking moves to the next card, and past the last the deck is done', () => {
  let s = freshDeck();
  s = rate(s, ids, KNOWN);
  assert.equal(s.pos, 1);
  s = rate(s, ids, AGAIN);
  s = rate(s, ids, null);
  assert.equal(s.marks['t3|C'], undefined, '"ถัดไป" in the quick round moves on without a mark');
  s = rate(s, ids, AGAIN);
  assert.equal(s.done, true);
  assert.equal(s.pos, 3);
  assert.deepEqual(tally(s, ids), { total: 4, known: 1, again: 2, seen: 3 });
  assert.deepEqual(marked(s, ids, AGAIN), ['t2|B', 't4|D']);
});

test('the ต้องทวน cards come back in a round of their own, and leave it once known', () => {
  let s = { ...freshDeck(), marks: { 't1|A': KNOWN, 't2|B': AGAIN, 't4|D': AGAIN }, pos: 3, done: true };
  s = startRedo(s, ids);
  assert.deepEqual(s.queue, ['t2|B', 't4|D']);
  assert.equal(s.pos, 1);
  assert.equal(s.done, false);
  s = rate(s, ids, KNOWN);
  assert.equal(s.pos, 3, 'the next card of the round, not the next in the deck');
  s = rate(s, ids, AGAIN);
  assert.equal(s.done, true);
  assert.equal(s.queue, null);
  assert.deepEqual(marked(s, ids, AGAIN), ['t4|D'], 'still unsure: it stays on the pile');
  assert.equal(startRedo({ ...freshDeck() }, ids).queue, null, 'no round with nothing to revise');
});

test('moving, resuming and restarting', () => {
  const s = { ...freshDeck(), marks: { 't1|A': AGAIN }, queue: ['t1|A'], done: true, pace: 'quick' };
  assert.equal(goTo(s, ids, 99).pos, 3);
  assert.equal(goTo(s, ids, -4).pos, 0);
  assert.equal(goTo(s, [], 2), s);
  assert.deepEqual(resume(s).queue, null);
  assert.equal(resume(s).done, false);
  assert.deepEqual(restart(s), { ...freshDeck(), pace: 'quick' });
});

test('the strip marks the card on screen, then each card by its mark', () => {
  const s = { ...freshDeck(), pos: 2, marks: { 't1|A': KNOWN, 't2|B': AGAIN, 't3|C': KNOWN } };
  assert.deepEqual(segments(s, ids), ['known', 'again', 'now', '']);
  assert.deepEqual(segments({ ...s, done: true }, ids), ['known', 'again', 'known', '']);
});

test('the open-all button opens the answer, and the keys shown are the ones that work now', () => {
  assert.equal(OPEN_ALL, 'เปิดคำตอบ');
  const view = readFileSync(new URL('../../src/components/WrapDeck.jsx', import.meta.url), 'utf8').replace(/\r\n/g, '\n');
  assert.match(view, />\{OPEN_ALL\}<\/button>/);
  // Space is offered only while something is covered; 1 and 2 only once it is open.
  assert.match(view, /\{!back && <><kbd>Space<\/kbd> \{OPEN_ALL\} <\/>\}/);
  assert.match(view, /\{back && <><kbd>1<\/kbd> ต้องทวน/);
  assert.doesNotMatch(view, /เปิดทั้งใบ/);
});
