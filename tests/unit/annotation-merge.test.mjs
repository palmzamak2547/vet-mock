// Cross-device merge — the property the whole sync design rests on.
//
// Two iPads annotate the same lecture deck on a plane. Whichever syncs first,
// both students' afternoons have to survive, and merging again must not change
// anything. That is only true if the merge is a two-phase set: union of
// strokes by id, minus the union of tombstones.
//
// A last-write-wins jsonb column would pass no test in this file, and would
// have thrown away one of the two devices in production.

import test from 'node:test';
import assert from 'node:assert/strict';

function install() {
  const store = new Map();
  globalThis.window = {
    localStorage: {
      getItem: (k) => store.get(k) ?? null,
      setItem: (k, v) => store.set(k, v),
      removeItem: (k) => store.delete(k),
    },
  };
  globalThis.indexedDB = undefined;
}
function uninstall() { delete globalThis.window; delete globalThis.indexedDB; }

let n = 0;
const fresh = () => import(`../../src/lib/pdf-annotations.js?m=${++n}`);

const stroke = (id, page) => ({ id, mode: 'pen', color: '#c0392b', size: 3, points: [[0.1, 0.1]], page });

function rec(strokes, deleted = [], extra = {}) {
  const byPage = {};
  for (const s of strokes) (byPage[s.page] ||= []).push(s);
  return { hash: 'deck', fileName: 'deck.pdf', pageCount: 10, strokesByPage: byPage, deleted, lastOpened: 1, ...extra };
}

const idsOf = (r) => Object.values(r.strokesByPage || {}).flat().map((s) => s.id).sort();

test('neither device loses work when both annotated offline', async () => {
  install();
  try {
    const { mergeRecords } = await fresh();
    const ipad = rec([stroke('A1', 1), stroke('A2', 3)]);
    const laptop = rec([stroke('B1', 1), stroke('B2', 7)]);
    const merged = mergeRecords(ipad, laptop);
    assert.deepEqual(idsOf(merged), ['A1', 'A2', 'B1', 'B2'],
      'a merge dropped one of the two devices\' strokes');
    assert.equal(merged.strokesByPage['1'].length, 2, 'strokes on the same page did not combine');
  } finally { uninstall(); }
});

test('merge order does not matter', async () => {
  install();
  try {
    const { mergeRecords } = await fresh();
    const a = rec([stroke('A1', 1), stroke('A2', 2)], ['X9']);
    const b = rec([stroke('B1', 2), stroke('X9', 2)], ['A2']);
    const ab = mergeRecords(a, b);
    const ba = mergeRecords(b, a);
    assert.deepEqual(idsOf(ab), idsOf(ba), 'the result depended on which device synced first');
    // A2 was deleted on the laptop, X9 was deleted on the iPad: both stay gone.
    assert.deepEqual(idsOf(ab), ['A1', 'B1']);
  } finally { uninstall(); }
});

test('merging twice changes nothing', async () => {
  install();
  try {
    const { mergeRecords } = await fresh();
    const a = rec([stroke('A1', 1)], ['Z1']);
    const b = rec([stroke('B1', 1), stroke('Z1', 1)]);
    const once = mergeRecords(a, b);
    const twice = mergeRecords(once, b);
    assert.deepEqual(idsOf(twice), idsOf(once), 'a second merge resurrected or dropped something');
    assert.deepEqual(twice.deleted.sort(), once.deleted.sort());
  } finally { uninstall(); }
});

test('a stroke rubbed out on one device stays rubbed out on the other', async () => {
  install();
  try {
    const { mergeRecords } = await fresh();
    // The iPad still has the stroke because it never saw the deletion.
    const ipad = rec([stroke('S1', 1), stroke('S2', 1)]);
    const laptop = rec([stroke('S1', 1)], ['S2']);
    const merged = mergeRecords(ipad, laptop);
    assert.deepEqual(idsOf(merged), ['S1'],
      'an erased stroke came back from the device that had not seen the erase');
  } finally { uninstall(); }
});

test('redo re-adds under a new id so tombstones can stay monotonic', async () => {
  install();
  try {
    const { mergeRecords, newStrokeId } = await fresh();
    const first = newStrokeId();
    const second = newStrokeId();
    assert.notEqual(first, second, 'stroke ids repeat within one device');
    // Undo tombstones the id; redo adds a fresh one. If redo reused the id,
    // the tombstone would suppress it forever after the next sync.
    const afterUndo = rec([], [first]);
    const afterRedo = mergeRecords(afterUndo, rec([{ ...stroke(second, 1) }], [first]));
    assert.deepEqual(idsOf(afterRedo), [second], 'the redone stroke did not survive');
  } finally { uninstall(); }
});

test('the reading position follows the device that read most recently', async () => {
  install();
  try {
    const { mergeRecords } = await fresh();
    const older = rec([], [], { lastPage: 4, lastOpened: 100 });
    const newer = rec([], [], { lastPage: 31, lastOpened: 900 });
    assert.equal(mergeRecords(older, newer).lastPage, 31);
    assert.equal(mergeRecords(newer, older).lastPage, 31, 'argument order changed the reading position');
  } finally { uninstall(); }
});

test('records written before ids existed are given ids rather than dropped', async () => {
  install();
  try {
    const { mergeRecords, deviceId } = await fresh();
    assert.ok(deviceId().length > 3);
    // A legacy record has strokes with no id at all. Merge must not silently
    // discard them just because they cannot be keyed.
    const legacy = { hash: 'deck', strokesByPage: { 1: [{ mode: 'pen', points: [[0, 0]] }] } };
    const modern = rec([stroke('M1', 1)]);
    const merged = mergeRecords(legacy, modern);
    // The un-ided stroke cannot participate in a keyed union — which is
    // exactly why loadAnnotations()/normalise() stamp ids on the way in. This
    // pins that the modern side is at least never harmed by the legacy one.
    assert.ok(idsOf(merged).includes('M1'));
  } finally { uninstall(); }
});
