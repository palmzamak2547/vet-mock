// ============================================================
// pdf-reader-contracts.test.mjs — reader rules the e2e cannot reach
// ============================================================
// Two of the audit's PDF findings sit on paths a browser test cannot drive
// deterministically, so the properties are pinned at the source instead:
//
//  • Thumbnails: each ThumbItem renders its page once and then holds the
//    raster (`rendered` never resets). Opening a second document into an
//    already-mounted reader — the library hand-off does this — left the rail
//    showing the FIRST document's pages. Keying the rail by document remounts
//    every thumbnail when the document changes.
//
//  • The pinch bookkeeping must never count the stylus in pen-only mode, and
//    must never discard a stroke that belongs to neither pinch finger. The
//    e2e covers the palm case; this pins the two guards so a refactor cannot
//    quietly drop one while the other still makes the e2e pass.
// ============================================================

import test from 'node:test';
import assert from 'node:assert/strict';
import { readFileSync } from 'node:fs';
import { join, resolve } from 'node:path';

const SRC = readFileSync(join(resolve(process.cwd()), 'src/views/PdfAnnotateView.jsx'), 'utf8');

test('the thumbnail rail is keyed by document, so a new file gets new thumbnails', () => {
  const at = SRC.indexOf('<PdfThumbnailSidebar');
  assert.notEqual(at, -1, 'the reader must still render the thumbnail rail');
  const tag = SRC.slice(at, SRC.indexOf('/>', at));
  assert.match(tag, /key=\{fileHash/, 'the rail must be keyed by the document hash');
});

test('in pen-only mode the stylus is never booked as a pinch finger', () => {
  const at = SRC.indexOf('function gestureDown(e)');
  assert.notEqual(at, -1);
  const body = SRC.slice(at, SRC.indexOf('function gestureMove', at));
  assert.match(body, /if \(penOnly && e\.pointerType === 'pen'\) return false;/);
  assert.match(
    body,
    /if \(penOnly && e\.pointerType !== 'pen' && drawingRef\.current\?\.on\) return true;/,
    'a touch that lands while the pen is drawing is the hand, and must be ignored',
  );
});

test('a pinch only discards a stroke that one of its two fingers is drawing', () => {
  const at = SRC.indexOf('function gestureDown(e)');
  const body = SRC.slice(at, SRC.indexOf('function gestureMove', at));
  assert.match(
    body,
    /if \(d\?\.on && activePointers\.current\.has\(d\.pointerId\)\)/,
    'the discard must be conditional on the drawing pointer being part of the pinch',
  );
});

test('the whole-stroke eraser skips pixel-eraser strokes', () => {
  const at = SRC.indexOf('function eraseAt(e)');
  assert.notEqual(at, -1);
  const body = SRC.slice(at, SRC.indexOf('function scheduleShapeSnap', at));
  assert.match(
    body,
    /st\.mode !== 'eraser' && strokeHit\(/,
    'deleting a pixel-eraser stroke un-erases the ink beneath it',
  );
});

test('the strokes-of-this-page ref is refreshed when the pen lands on another page', () => {
  const at = SRC.indexOf('if (drawPageRef.current !== onPage)');
  assert.notEqual(at, -1, 'onPointerDown must refresh currentStrokesRef on a page change');
  const after = SRC.slice(at, at + 200);
  assert.match(after, /currentStrokesRef\.current = \(latestRef\.current\.strokesByPage \|\| \{\}\)\[onPage\] \|\| \[\];/);
});
