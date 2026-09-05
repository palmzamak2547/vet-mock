// ============================================================
// offline-reads-as-offline.test.mjs — the worker's 503 is "offline"
// ============================================================
// public/sw.js answers an offline request to /api/* with a synthetic
// 503 whose body is {"error":"Offline"}, so fetch() RESOLVES instead of
// rejecting. Two views only recognised offline in their catch block:
//
//  • the video shelf fell through to "เชื่อมต่อ YouTube ไม่ได้ชั่วคราว" — the
//    wrong thing to go and check;
//  • the reader turned the worker's offline_not_cached 503 into "HTTP 503"
//    and told the student to press retry, which cannot succeed offline.
//
// library.js already does this detection for the document shelf; these pin
// that the other two surfaces do it the same way.
// ============================================================

import test from 'node:test';
import assert from 'node:assert/strict';
import { readFileSync } from 'node:fs';
import { join, resolve } from 'node:path';

const ROOT = resolve(process.cwd());
const read = (p) => readFileSync(join(ROOT, p), 'utf8');

test('the video shelf recognises the worker\'s offline 503 before blaming YouTube', () => {
  const src = read('src/views/VideoView.jsx');
  // Anchor on the fetch itself — the path string also appears far earlier in
  // the file, and a window cut from there never reached the branch.
  const at = src.indexOf('await fetch(`/api/playlist?id=');
  assert.notEqual(at, -1);
  const block = src.slice(at, at + 3000);
  const offline = block.indexOf("data?.error === 'Offline'");
  const blame = block.indexOf('เชื่อมต่อ YouTube ไม่ได้ชั่วคราว');
  assert.ok(offline !== -1, 'the !ok branch must test for the worker\'s synthetic offline body');
  assert.ok(blame !== -1, 'the YouTube message still exists for a real upstream failure');
  assert.ok(offline < blame, 'offline must be decided before the YouTube message is chosen');
  assert.match(block, /navigator\.onLine === false/, 'the browser\'s own offline flag counts too');
});

test('the reader names offline instead of "HTTP 503" for a document never cached', () => {
  const src = read('src/views/PdfAnnotateView.jsx');
  const at = src.indexOf('const res = await fetch(url);');
  assert.notEqual(at, -1);
  const block = src.slice(at, at + 900);
  assert.match(block, /offline_not_cached/, 'the worker\'s code for "never cached here" must be recognised');
  assert.match(block, /ออฟไลน์อยู่/, 'the message must say offline, in Thai');
  assert.ok(
    block.indexOf('offline_not_cached') < block.indexOf('throw new Error(`HTTP ${res.status}`)'),
    'offline must be decided before the generic HTTP error',
  );
});

test('the worker really does answer offline /api requests with that body', () => {
  const sw = read('public/sw.js');
  assert.match(sw, /JSON\.stringify\(\{ error: 'Offline' \}\)/, 'sw.js must still emit the body the views test for');
  assert.match(sw, /offline_not_cached/, 'sw.js must still emit offline_not_cached for an uncached document');
});
