// ============================================================
// polish-feedback-and-delete.test.mjs
// ============================================================
// Four properties from the 5.83-5.85.1 review. Each one is a case where the
// code did something plausible that produced a false statement to the student:
// a save that was not a save, a bounce that confirmed nothing, a stage showing
// the wrong rig, and a delete that deleted only half of the ink.
//
// The React ones cannot be driven headlessly without mounting the whole app,
// so they are pinned at the source; the delete is a real merge.
// ============================================================

import test from 'node:test';
import assert from 'node:assert/strict';
import { readFileSync } from 'node:fs';
import { mergeRecords } from '../../src/lib/pdf-annotations.js';
import { EFFECTS } from '../../src/lib/motion-kit/catalog.js';

const read = (path) => readFileSync(new URL(`../../${path}`, import.meta.url), 'utf8');

test('the tour starts a set with the CURRENT startExam, not the first render\'s', () => {
  // startExam closes over session.startNewSession, which is memoized on the
  // signed-in account id. Auth resolves asynchronously, so the first render
  // always carries ownerId=null; pinning finishTourStart with useCallback([])
  // stamped that null onto the set and finishExam then refused to submit it
  // for every signed-in student.
  const src = read('src/App.jsx');
  const start = src.indexOf('const finishTourStart');
  assert.ok(start > 0, 'finishTourStart must still exist');
  const body = src.slice(start, src.indexOf('const startExam'));
  assert.doesNotMatch(body, /const finishTourStart = useCallback\(/);
  assert.match(body, /const finishTourStart = \(\) => \{/);
  // startExam itself is rebuilt per render; if that ever changes, the reason
  // this must not be memoized changes with it.
  assert.match(src, /const startExam = async \(overrides = \{\}\) => \{/);
});

test('the Mochi lab and the Mochi cursor effect never share a remount key', () => {
  // Both live in the catalog: the cursor follower IS called 'mochi', and every
  // lab pose is 'mochi-<action>'. Folding the poses onto 'mochi' made the two
  // rigs indistinguishable to the mount effect, so switching between them left
  // the previous rig on stage while the heading described the new one.
  const ids = new Set(EFFECTS.map((effect) => effect.id));
  assert.ok(ids.has('mochi'), 'the cursor follower id is the collision');
  assert.ok(ids.has('mochi-hello'), 'lab poses are the other side of it');
  assert.ok(!ids.has('mochi-lab'), 'the family name must not be a catalog id');

  const src = read('src/components/MotionSurface.jsx');
  assert.match(src, /effect\.startsWith\('mochi-'\) \? 'mochi-lab' : effect/);
  assert.match(src, /family === 'mochi-lab'/);
  assert.doesNotMatch(src, /\? 'mochi' : effect/);
});

test('the bookmark bounce is keyed to a press, not to the value', () => {
  // The question card is not remounted between questions, so keying the
  // "saved" animation to isBookmarked replayed it on plain ถัดไป navigation —
  // including while the star was emptying.
  const question = read('src/components/Question.jsx');
  assert.match(question, /useMotionFeedback\('bookmark', bookmarkPresses\)/);
  assert.match(question, /setBookmarkPresses\(\(n\) => n \+ 1\); toggleBookmark\(/);
  assert.doesNotMatch(question, /useMotionFeedback\('bookmark', isBookmarked\)/);

  const pin = read('src/components/PinButton.jsx');
  assert.match(pin, /useMotionFeedback\('bookmark', presses\)/);
  assert.doesNotMatch(pin, /useMotionFeedback\('bookmark', pinned\)/);
});

test('the reading checklist celebrates a tick made here, not one pulled from the cloud', () => {
  const src = read('src/views/ReadingChecklistView.jsx');
  assert.match(src, /tickedHere\.current && previous\.current\.year === selectedYear/);
  // Both writers must raise it, or a whole-subject tick stops celebrating.
  assert.equal((src.match(/tickedHere\.current = true;/g) || []).length, 2);
});

test('deleting a document tombstones its strokes so the account copy cannot restore them', () => {
  // What removeRecent now writes before dropping the local record.
  const strokes = [{ id: 'a1' }, { id: 'a2' }];
  const remote = {
    hash: 'h', ownerId: 'u1', fileName: 'deck.pdf', pageCount: 2,
    strokesByPage: { 1: [strokes[0]], 2: [strokes[1]] }, deleted: [], lastOpened: 10,
  };
  const tombstoned = { ...remote, strokesByPage: {}, deleted: ['a1', 'a2'], lastOpened: 11 };

  // The next open merges the local record with whatever the account holds.
  const merged = mergeRecords(tombstoned, remote);
  assert.deepEqual(merged.strokesByPage, {}, 'deleted ink must not come back');
  assert.deepEqual([...merged.deleted].sort(), ['a1', 'a2']);
  // Order must not matter — the remote may be merged in either direction.
  assert.deepEqual(mergeRecords(remote, tombstoned).strokesByPage, {});

  // Without the tombstones the old code lost the delete entirely, which is the
  // bug: an emptied record alone merges straight back to the full set.
  const emptiedOnly = { ...remote, strokesByPage: {}, lastOpened: 11 };
  assert.equal(Object.keys(mergeRecords(emptiedOnly, remote).strokesByPage).length, 2);
});

test('the reader tombstones and pushes before it drops the local record', () => {
  const src = read('src/views/PdfAnnotateView.jsx');
  const start = src.indexOf('async function removeRecent');
  assert.ok(start > 0, 'removeRecent must still exist');
  const body = src.slice(start, src.indexOf('async function recoverLegacy'));
  // The tombstone write and its push both have to happen before the drop, or
  // the deletion never leaves this device.
  const tombstoneAt = body.indexOf('deleted: [...(record?.deleted || []), ...ids]');
  const pushAt = body.indexOf('await pushNow(');
  const dropAt = body.indexOf('await deleteAnnotations(hash)');
  assert.ok(tombstoneAt > 0 && pushAt > tombstoneAt && dropAt > pushAt);
  // A failed push must keep the record so the tombstones can still travel.
  assert.match(body, /if \(!pushed\?\.ok\) \{[\s\S]*?return;/);
});

test('opening a personal PDF where storage is blocked stops promising the ink will return', () => {
  const src = read('src/views/PdfAnnotateView.jsx');
  const promise = 'รอบหน้าเลือกไฟล์เดิมอีกครั้ง แล้วรอยเขียนจะกลับมาเอง';
  const at = src.indexOf(promise);
  assert.ok(at > 0);
  // The honest branch has to be reached first, on the same chain.
  const before = src.slice(src.lastIndexOf('refreshRecent();', at), at);
  assert.match(before, /if \(!storageHealth\(\)\.persistent\) \{/);
  assert.match(before, /\} else if \(existing &&/);
});
