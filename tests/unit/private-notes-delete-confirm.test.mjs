// ============================================================
// Deleting a private note asks through the app's own dialog
// ============================================================
// The back-office delete was the one destructive action in src still calling
// window.confirm: a browser box with no theme, no focus handling and no
// Escape-to-cancel that the rest of the app's dialogs have. It now goes
// through confirmDialog (src/lib/dialog.js) like every other delete.
//
// The component is not mounted headless, so the handler body is lifted out of
// the source and run with its collaborators injected, the way
// auth-action-failure.test.mjs exercises App.jsx.
// ============================================================

import test from 'node:test';
import assert from 'node:assert/strict';
import { readFileSync } from 'node:fs';

const source = readFileSync(new URL('../../src/components/PrivateNotes.jsx', import.meta.url), 'utf8');
const AsyncFunction = Object.getPrototypeOf(async function () {}).constructor;

function removeHandler() {
  const marker = 'const remove = async (slug) => {';
  const start = source.indexOf(marker);
  assert.ok(start > 0, 'PrivateNotes still has its remove handler');
  const bodyStart = start + marker.length;
  const body = source.slice(bodyStart, source.indexOf('\n  };', bodyStart));
  return new AsyncFunction('slug', 'confirmDialog', 'window', 'adminRpc', 'setBusy', 'setErr', 'setOpen', 'reload', body);
}

function harness(answer) {
  const calls = { dialogs: [], native: 0, rpc: [], reloads: 0 };
  const args = [
    async (opts) => { calls.dialogs.push(opts); return answer; },
    { confirm: () => { calls.native++; return answer; } },
    async (name, params) => { calls.rpc.push([name, params]); },
    () => {}, () => {}, () => {},
    async () => { calls.reloads++; },
  ];
  return { calls, args };
}

test('cancelling the in-app dialog deletes nothing and never opens the browser box', async () => {
  const { calls, args } = harness(false);
  await removeHandler()('mid-86-swine', ...args);
  assert.equal(calls.native, 0, 'window.confirm was called');
  assert.equal(calls.dialogs.length, 1, 'confirmDialog was not asked');
  assert.deepEqual(calls.rpc, []);
});

test('confirming deletes that one note, and the dialog reads as a destructive action', async () => {
  const { calls, args } = harness(true);
  await removeHandler()('mid-86-swine', ...args);
  assert.equal(calls.native, 0);
  assert.deepEqual(calls.rpc, [['admin_private_note_delete', { note_slug: 'mid-86-swine' }]]);
  assert.equal(calls.reloads, 1);
  const [opts] = calls.dialogs;
  assert.equal(opts.tone, 'danger', 'the option is tone, not danger: true (dialog.js)');
  assert.match(opts.title, /mid-86-swine/, 'the title names the note being deleted');
  assert.match(`${opts.title} ${opts.body}`, /เอากลับไม่ได้/, 'it still says the delete cannot be undone');
  assert.ok(opts.confirmLabel, 'the confirm button says what it does');
});

test('no component in src calls window.confirm directly', () => {
  assert.ok(!source.includes('window.confirm('), 'PrivateNotes.jsx still calls window.confirm');
  assert.match(source, /import \{ confirmDialog \} from '\.\.\/lib\/dialog\.js';/);
});
