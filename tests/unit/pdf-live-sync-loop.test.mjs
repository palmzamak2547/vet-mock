// ============================================================
// PDF live sync — a spent autosave timer must not read as "pending"
// ============================================================
// pullLatest re-arms the autosave with the merged record when a remote
// merge lands inside the debounce window. That is only correct while a
// save is genuinely pending. The timer callback used to leave its spent
// id in saveTimerRef, so every later Realtime ping saw a truthy ref,
// re-armed a save + push, heard its own row change echoed back, and
// looped every few seconds (Codex review on PR #4, P1).

import test from 'node:test';
import assert from 'node:assert/strict';
import { readFileSync } from 'node:fs';

const view = readFileSync(new URL('../../src/views/PdfAnnotateView.jsx', import.meta.url), 'utf8');

test('the autosave callback clears the pending marker before it saves', () => {
  const start = view.indexOf('function scheduleSave(');
  const end = view.indexOf('async function saveNow(');
  assert.ok(start >= 0 && end > start, 'scheduleSave / saveNow not found');
  const body = view.slice(start, end);
  const cb = body.indexOf('saveTimerRef.current = setTimeout(async () => {');
  const clear = body.indexOf('saveTimerRef.current = null;', cb);
  const save = body.indexOf('await saveAnnotations(', cb);
  assert.ok(cb >= 0 && clear > cb && clear < save, 'the timeout callback must null saveTimerRef before awaiting the save');
});

test('an explicit save also drops the pending marker', () => {
  const start = view.indexOf('async function saveNow(');
  const end = view.indexOf('function undoLast(');
  const body = view.slice(start, end);
  assert.match(body, /clearTimeout\(saveTimerRef\.current\);\n\s*saveTimerRef\.current = null;/);
});

test('the live-sync re-arm is gated on a pending save, never unconditional', () => {
  const start = view.indexOf('async function pullLatest(');
  const end = view.indexOf('// Live cross-device sync', start);
  const body = view.slice(start, end);
  assert.match(body, /if \(saveTimerRef\.current\) scheduleSave\(/);
  assert.doesNotMatch(body, /\n\s*scheduleSave\(live/, 'an unconditional re-arm would push on every ping');
});
