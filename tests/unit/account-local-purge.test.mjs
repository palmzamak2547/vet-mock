// ============================================================
// account-local-purge — a deleted account leaves nothing on the device
// ============================================================
// B17 (bug hunt 2026-09-26). After the delete-account function confirmed the
// server cascade, the client only signed out. Everything the app keeps on the
// device under that account id stayed: every answer with its timing
// (IndexedDB vmx-study-events-v1), the account's history/notes/bookmarks/SR
// cards (vmx-user-data-v1:<uid>), its sync meta and pending operations, the
// in-flight exam, and its PDF ink. clearStudyEvents was written for exactly
// this call and nothing called it. On a shared or lab machine the next person
// inherited all of it.
//
// B72: the delete copy promised flashcards were deleted, but flashcards,
// image-occlusion decks and the pinboard are device tools, not account data
// (src/lib/local-extras.js). They are not keyed to any account, so erasing
// them could erase someone else's work on the same browser; the copy now says
// where they live instead.
// ============================================================

import test from 'node:test';
import assert from 'node:assert/strict';
import { readFileSync } from 'node:fs';
import { purgeLocalAccountData } from '../../src/lib/account-local-purge.js';

function memoryStorage(entries) {
  const map = new Map(Object.entries(entries));
  return {
    get length() { return map.size; },
    key: (i) => [...map.keys()][i] ?? null,
    getItem: (k) => (map.has(k) ? map.get(k) : null),
    setItem: (k, v) => { map.set(k, String(v)); },
    removeItem: (k) => { map.delete(k); },
    keys: () => [...map.keys()].sort(),
  };
}

const UID = '4a7f3c1e-9b2d-4e8a-b6c5-0d1e2f3a4b5c';
const OTHER = '9f9f9f9f-0000-4000-8000-000000000000';

test('every device store keyed to the deleted account is purged, and nothing else', async () => {
  const storage = memoryStorage({
    [`vmx-user-data-v1:${UID}`]: '{"history":[1]}',
    [`vmx-user-sync-v1:${UID}`]: '{}',
    [`vmx-user-op-v1:${UID}:tab-1`]: '{}',
    [`vmx-user-op-v1:${UID}:tab-2`]: '{}',
    [`vmx-inflight-exam:user:${UID}`]: '{}',
    'vmx-inflight-exam': JSON.stringify({ ownerId: UID, questions: [1] }),
    // Not this account's: another account, the signed-out workspace, device tools.
    [`vmx-user-data-v1:${OTHER}`]: '{}',
    [`vmx-user-op-v1:${OTHER}:tab-1`]: '{}',
    'vmx-user-data-v1:anonymous': '{}',
    [`vmx-inflight-exam:user:${OTHER}`]: '{}',
    'vmx-user-flashcards': '[]',
    'vmx-pinboard': '[]',
  });
  const cleared = [];
  const deletedPdfs = [];
  const result = await purgeLocalAccountData(UID, {
    storage,
    clearStudyEvents: async (owner) => { cleared.push(owner); return { ok: true }; },
    listRecentPdfs: async (owner) => (owner === UID ? [{ hash: 'deck-a' }, { hash: 'deck-b' }] : []),
    deleteAnnotations: async (hash, owner) => { deletedPdfs.push([hash, owner]); return { ok: true }; },
  });
  assert.equal(result.ok, true);
  assert.deepEqual(cleared, [UID]);
  assert.deepEqual(deletedPdfs, [['deck-a', UID], ['deck-b', UID]]);
  assert.deepEqual(storage.keys(), [
    `vmx-inflight-exam:user:${OTHER}`,
    `vmx-user-data-v1:${OTHER}`,
    'vmx-user-data-v1:anonymous',
    `vmx-user-op-v1:${OTHER}:tab-1`,
    'vmx-pinboard',
    'vmx-user-flashcards',
  ].sort());
});

test('a legacy in-flight exam that belongs to someone else is left alone', async () => {
  const legacy = JSON.stringify({ ownerId: OTHER, questions: [1] });
  const storage = memoryStorage({ 'vmx-inflight-exam': legacy });
  await purgeLocalAccountData(UID, { storage, clearStudyEvents: async () => ({ ok: true }), listRecentPdfs: async () => [], deleteAnnotations: async () => ({ ok: true }) });
  assert.equal(storage.getItem('vmx-inflight-exam'), legacy);
});

test('a failing store does not stop the others, and the result says so', async () => {
  const storage = memoryStorage({ [`vmx-user-data-v1:${UID}`]: '{}' });
  const result = await purgeLocalAccountData(UID, {
    storage,
    clearStudyEvents: async () => ({ ok: false }),
    listRecentPdfs: async () => { throw new Error('idb'); },
    deleteAnnotations: async () => ({ ok: true }),
  });
  assert.equal(result.ok, false);
  assert.equal(storage.getItem(`vmx-user-data-v1:${UID}`), null, 'localStorage was still purged');
  assert.equal((await purgeLocalAccountData(null, { storage })).ok, false, 'no account id, nothing touched');
});

test('the key prefixes match the ones the sync store writes', () => {
  const sync = readFileSync(new URL('../../src/lib/user-data-sync.js', import.meta.url), 'utf8');
  for (const prefix of ['vmx-user-sync-v1:', 'vmx-user-data-v1:', 'vmx-user-op-v1:']) {
    assert.ok(sync.includes(`'${prefix}'`), `user-data-sync.js no longer writes ${prefix}`);
  }
  assert.match(sync, /encodeURIComponent\(principalKey\(userId\)\)/);
});

test('account deletion purges the device after the server confirms, and the copy is honest', () => {
  const supa = readFileSync(new URL('../../src/lib/supabase.js', import.meta.url), 'utf8').replace(/\r\n/g, '\n');
  const fn = supa.slice(supa.indexOf('export async function deleteAccountData'), supa.indexOf('// ─── Username availability'));
  const okBranch = fn.slice(fn.indexOf('if (ok) {'));
  assert.match(okBranch, /purgeLocalAccountData\(userId\)/, 'the confirmed-deletion branch purges this account\'s device data');
  assert.ok(fn.indexOf('purgeLocalAccountData') > fn.indexOf('if (ok) {'), 'only after the server confirmed');
  const view = readFileSync(new URL('../../src/views/AccountSettingsView.jsx', import.meta.url), 'utf8');
  assert.doesNotMatch(view, /<li>ลบ progress, scores, bookmarks, flashcards ทั้งหมด<\/li>/, 'the list no longer promises device tools are deleted');
  assert.match(view, /Flashcard/);
});
