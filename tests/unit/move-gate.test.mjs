// main.jsx loads origin-move.js only when lib/move-gate.js finds work for it. A gate that says null
// where the module would have done something would drop a student's move, so every case below is
// run through both: when the gate says null, the module's three jobs are all no-ops.
import test from 'node:test';
import assert from 'node:assert/strict';
import { moveWork, MOVE_INBOX, MOVE_RECEIVED, NOTICE_MS } from '../../src/lib/move-gate.js';
import { applyMoveInbox, importMovedRecords, moveNotice } from '../../src/lib/origin-move.js';

const store = (entries) => {
  const m = new Map(Object.entries(entries));
  return {
    get length() { return m.size; },
    key: (i) => [...m.keys()][i] ?? null,
    getItem: (k) => (m.has(k) ? m.get(k) : null),
    setItem: (k, v) => { m.set(k, String(v)); },
    removeItem: (k) => { m.delete(k); },
  };
};
const NOW = 1_800_000_000_000;
const received = (v) => ({ [MOVE_RECEIVED]: JSON.stringify(v) });

const CASES = [
  ['a fresh browser', {}, null],
  ['an inbox waiting', { [MOVE_INBOX]: JSON.stringify({ fields: {} }) }, 'now'],
  ['an unreadable inbox', { [MOVE_INBOX]: '{oops' }, 'now'],
  ['records still to import', received({ at: NOW - 1000 }), 'later'],
  ['imported, notice due', received({ at: NOW - 1000, idbDone: true }), 'later'],
  ['imported, notice shown', received({ at: NOW - 1000, idbDone: true, shown: true }), null],
  ['imported, notice too old', received({ at: NOW - NOTICE_MS, idbDone: true }), null],
  ['imported, notice from the future', received({ at: NOW + 5000, idbDone: true }), null],
  ['a received record that is not an object', { [MOVE_RECEIVED]: '[1]' }, null],
  ['an unreadable received record', { [MOVE_RECEIVED]: '{oops' }, null],
];

for (const [name, entries, want] of CASES) {
  test(`gate: ${name} -> ${want}`, async () => {
    assert.equal(moveWork({ localStorage: store(entries) }, NOW), want);
    if (want !== null) return;
    // The module has nothing to do either.
    const s = store(entries);
    assert.equal(applyMoveInbox(s).applied, false);
    assert.equal(s.getItem(MOVE_INBOX), null);
    let read = false;
    const r = await importMovedRecords({ storage: s, readInbox: async () => { read = true; return []; } });
    assert.equal(read, false, 'no IndexedDB import was due');
    assert.equal(r.skipped, true);
    assert.equal(moveNotice(s, NOW), null);
  });
}

test('gate: the old address left a note', () => {
  assert.equal(moveWork({ localStorage: store({}), __vmxMoveNote: 'VetMock ย้ายไปแล้ว' }, NOW), 'later');
});

test('gate: storage that throws means no move work, never a crash', () => {
  const win = {};
  Object.defineProperty(win, 'localStorage', { get() { throw new Error('denied'); } });
  assert.equal(moveWork(win, NOW), null);
  assert.equal(moveWork({ localStorage: { getItem() { throw new Error('denied'); } } }, NOW), null);
});
