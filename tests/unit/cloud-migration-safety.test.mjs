// ============================================================
// cloud-migration-safety.test.mjs — migrating in must not delete
// ============================================================
// migrateLocalToCloud's own docstring described "a conservative merge: keep
// the higher count for arrays, take the non-null for objects". No such code
// existed. It read localStorage and upserted the whole snapshot over the
// account's user_data row.
//
// It is reached only from the sign-UP branch, which sounds safe — but
// Supabase returns an obfuscated success for an email that already exists,
// and AuthView then falls through to signInWithEmail(). So a returning
// student on a fresh device who taps "สมัคร" instead of "เข้าสู่ระบบ", types
// their real credentials, and has answered even one question locally would
// have had their whole cloud history, bookmarks, notes and SR cards replaced
// by that one answer.
//
// supabase.js pulls in the SDK, so this pins the rule at the source level
// rather than importing it: the write must be preceded by a read, and it must
// not send a field the account already has.
// ============================================================

import test from 'node:test';
import assert from 'node:assert/strict';
import { readFileSync } from 'node:fs';
import { join, resolve } from 'node:path';

const SRC = readFileSync(join(resolve(process.cwd()), 'src/lib/supabase.js'), 'utf8');

function migrateBody() {
  const start = SRC.indexOf('export async function migrateLocalToCloud()');
  assert.notEqual(start, -1, 'migrateLocalToCloud must still exist');
  const end = SRC.indexOf('\nexport ', start + 10);
  return SRC.slice(start, end === -1 ? undefined : end);
}

test('the account is read before anything is written to it', () => {
  const body = migrateBody();
  const read = body.indexOf(".from('user_data')\n    .select(");
  const write = body.indexOf('.upsert(');
  assert.ok(read !== -1, 'the existing row must be read first');
  assert.ok(write !== -1, 'it still writes');
  assert.ok(read < write, 'the read must come before the write');
});

test('a read failure refuses to write rather than guessing', () => {
  assert.match(
    migrateBody(),
    /if \(readErr\) return \{ ok: false/,
    'a failed read must not be treated as "the account is empty"',
  );
});

test('the whole local snapshot is no longer sent as one blind upsert', () => {
  const body = migrateBody();
  assert.doesNotMatch(
    body,
    /upsert\(\{ user_id: userId, \.\.\.local/,
    'the blind whole-snapshot upsert is back',
  );
  assert.match(body, /if \(remote && hasRemote\(remote\[field\]\)\)/, 'fields the account has must be skipped');
});

test('nothing is written at all when the account already has everything', () => {
  assert.match(
    migrateBody(),
    /reason: 'account-already-has-data'/,
    'a fully populated account must short-circuit before the upsert',
  );
});

test('the docstring no longer promises a merge the code does not do', () => {
  const start = SRC.indexOf('Anonymous → Registered migration');
  const doc = SRC.slice(start, SRC.indexOf('export async function migrateLocalToCloud()'));
  assert.doesNotMatch(
    doc,
    /keep the higher count for arrays/,
    'the comment described a merge that was never implemented',
  );
});
