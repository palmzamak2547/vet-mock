// ============================================================
// Imaging Practical: a failed save tells the student something true (OV-data-10)
// ============================================================
// saveAttempt used to decide "the table is missing" by looking for the table's
// name in the error message. A row-level-security refusal and a check
// constraint both name imaging_attempts, so both were reported as "Migration
// ยังไม่ apply (อ่าน supabase/README-imaging-lab.md)", and every other error
// went to the screen as its raw English text. The error code says what
// happened; the message is only for the log.
//
//   PGRST205, 42P01  the table is not there      -> 'no-table'
//   42501            the database refused the row -> 'no-permission'
//   23514            a check constraint refused it -> 'invalid'
//   anything else                                 -> 'failed'
//
// The test runs the real module. Its only collaborator, the Supabase client,
// is swapped for a stub through the module's own dynamic import.

import test from 'node:test';
import assert from 'node:assert/strict';
import { readFileSync } from 'node:fs';

const FILE = new URL('../../src/lib/dicom/save-attempt.js', import.meta.url);

const STUB = `
export const hasSupabase = globalThis.__sb.hasSupabase;
export async function getSupabase() {
  const state = globalThis.__sb;
  return {
    auth: { getUser: async () => ({ data: { user: state.user } }) },
    from: () => ({ insert: (row) => { state.inserted = row; return { select: () => ({ single: async () => state.result }) }; } }),
  };
}
`;

async function load(state) {
  globalThis.__sb = { hasSupabase: true, user: { id: 'u1' }, result: { data: { id: 7 }, error: null }, ...state };
  // A fresh URL per call (the trailing comment) so a module is never reused
  // and each scenario reads its own stub state.
  const unique = `
// ${Math.random()}`;
  const stub = `data:text/javascript,${encodeURIComponent(STUB + unique)}`;
  const original = readFileSync(FILE, 'utf8');
  const source = original.replace("'../supabase.js'", JSON.stringify(stub));
  assert.notEqual(source, original, 'the module still imports ../supabase.js the way this test expects');
  return import(`data:text/javascript,${encodeURIComponent(source + unique)}`);
}

const RLS = { code: '42501', message: 'new row violates row-level security policy for table "imaging_attempts"' };
const CHECK = { code: '23514', message: 'new row for relation "imaging_attempts" violates check constraint "imaging_attempts_tool_check"' };
const SCHEMA_CACHE = { code: 'PGRST205', message: "Could not find the table 'public.imaging_attempts' in the schema cache" };
const NO_RELATION = { code: '42P01', message: 'relation "imaging_attempts" does not exist' };
const DUPLICATE = { code: '23505', message: 'duplicate key value violates unique constraint "imaging_attempts_pkey"' };

const attempt = { tool: 'norberg', measurement_json: {}, numeric_result: 100, secondary_result: 98, classification: 'normal' };

async function reasonFor(error) {
  const mod = await load({ result: { data: null, error } });
  const res = await mod.saveAttempt(attempt);
  assert.equal(res.ok, false);
  return { reason: res.reason, mod };
}

test('the error code decides the reason, not the words in the message', async () => {
  assert.equal((await reasonFor(SCHEMA_CACHE)).reason, 'no-table');
  assert.equal((await reasonFor(NO_RELATION)).reason, 'no-table');
  assert.equal((await reasonFor(RLS)).reason, 'no-permission', 'a row-level-security refusal is not a missing migration');
  assert.equal((await reasonFor(CHECK)).reason, 'invalid', 'a check-constraint refusal is not a missing migration');
  assert.equal((await reasonFor(DUPLICATE)).reason, 'failed');
});

test('a message that names the table but carries no known code is just a failure', async () => {
  assert.equal((await reasonFor({ message: 'relation "imaging_attempts" does not exist' })).reason, 'failed');
  assert.equal((await reasonFor({ message: 'TypeError: Failed to fetch' })).reason, 'failed');
  assert.equal((await reasonFor({ code: '', message: 'Failed to fetch' })).reason, 'failed');
});

test('the reasons are a closed set, never a raw message', async () => {
  const allowed = new Set(['no-supabase', 'no-auth', 'no-table', 'no-permission', 'invalid', 'failed']);
  for (const error of [SCHEMA_CACHE, NO_RELATION, RLS, CHECK, DUPLICATE, { message: 'anything at all' }, {}]) {
    const { reason } = await reasonFor(error);
    assert.ok(allowed.has(reason), `reason ${JSON.stringify(reason)} for ${JSON.stringify(error)}`);
  }
});

test('not signed in, and no Supabase, keep their own reasons', async () => {
  const noAuth = await load({ user: null });
  assert.deepEqual(await noAuth.saveAttempt(attempt), { ok: false, reason: 'no-auth' });
  const noSb = await load({ hasSupabase: false });
  assert.deepEqual(await noSb.saveAttempt(attempt), { ok: false, reason: 'no-supabase' });
});

test('a good insert still returns the new id', async () => {
  const mod = await load({});
  assert.deepEqual(await mod.saveAttempt({ ...attempt, caseId: 'c1' }), { ok: true, id: 7 });
  assert.equal(globalThis.__sb.inserted.user_id, 'u1');
  assert.equal(globalThis.__sb.inserted.case_id, 'c1');
});

test('reasonLabel gives the student one plain Thai line for each reason', async () => {
  const { reasonLabel } = await load({});
  assert.equal(reasonLabel('no-supabase'), 'การบันทึกผลยังไม่เปิดใช้');
  assert.equal(reasonLabel('no-auth'), 'เข้าสู่ระบบก่อนจึงจะบันทึกผลได้');
  assert.equal(reasonLabel('no-table'), 'บันทึกผลไม่สำเร็จตอนนี้ ลองใหม่ภายหลัง');
  assert.equal(reasonLabel('failed'), 'บันทึกผลไม่สำเร็จตอนนี้ ลองใหม่ภายหลัง');
  assert.equal(reasonLabel('no-permission'), 'เข้าสู่ระบบใหม่แล้วลองบันทึกอีกครั้ง');
  assert.equal(reasonLabel('invalid'), 'ค่าที่วัดได้ไม่ครบ ลองวัดใหม่แล้วบันทึก');
});

test('reasonLabel never shows a raw message, whatever it is handed', async () => {
  const { reasonLabel } = await load({});
  for (const raw of [RLS.message, CHECK.message, 'TypeError: Failed to fetch', 'x', '', undefined, null]) {
    const label = reasonLabel(raw);
    assert.equal(label, 'บันทึกผลไม่สำเร็จตอนนี้ ลองใหม่ภายหลัง');
    assert.ok(!/[A-Za-z]{4,}/.test(label), `English text reached the student: ${label}`);
  }
  assert.ok(!/Migration|apply|README|Supabase|sign in/i.test(['no-table', 'failed', 'no-auth', 'no-supabase', 'no-permission', 'invalid']
    .map(reasonLabel).join(' ')), 'no setup jargon in any label');
});
