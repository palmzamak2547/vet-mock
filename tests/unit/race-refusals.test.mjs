// ============================================================
// race-refusals — a refused race says why, not "check your connection"
// ============================================================
// B19 (bug hunt 2026-09-26). ownedRpc threw one generic message for any
// non-2xx and dropped PostgREST's body, so a mistyped or expired room code,
// a started race, a full room and the hourly room limit all told the student
// to check the connection and retry, which could never succeed. An expired
// room's poll said "การเชื่อมต่อสะดุด ระบบกำลังลองใหม่…" forever.
//
// supabase.js reads import.meta.env, so Node's module hooks swap that import,
// for owned-rpc.js only, for a stub session. fetch is stubbed per case with
// the body PostgREST returns for a RAISE EXCEPTION.
// ============================================================

import test from 'node:test';
import assert from 'node:assert/strict';
import { registerHooks } from 'node:module';
import { readFileSync } from 'node:fs';

registerHooks({
  resolve(specifier, context, nextResolve) {
    const parent = String(context.parentURL || '').split('?')[0];
    if (parent.endsWith('/src/lib/owned-rpc.js') && specifier === './supabase.js') {
      return { url: 'vetmock-test:owned-rpc-supabase', shortCircuit: true };
    }
    return nextResolve(specifier, context);
  },
  load(url, context, nextLoad) {
    if (url === 'vetmock-test:owned-rpc-supabase') {
      return { format: 'module', shortCircuit: true, source: `export const getSupabase = async () => ({
        supabaseUrl: 'https://db.test', supabaseKey: 'anon',
        auth: { getSession: async () => ({ data: { session: { user: { id: 'me' }, access_token: 't' } } }) },
      });` };
    }
    return nextLoad(url, context);
  },
});

const { ownedRpc } = await import('../../src/lib/owned-rpc.js');
const { RACE_REFUSALS } = await import('../../src/lib/race-refusals.js');

async function refusedWith(status, body, options) {
  const real = globalThis.fetch;
  globalThis.fetch = async () => new Response(JSON.stringify(body), { status, headers: { 'content-type': 'application/json' } });
  try {
    await ownedRpc('me', 'enter_race', { p_code: 'ABC123' }, options);
    assert.fail('the refusal resolved');
  } catch (error) { return error; } finally { globalThis.fetch = real; }
}

test('each refusal the race RPCs raise gets its own Thai message', async () => {
  const cases = [
    [403, 'Room unavailable'],
    [400, 'Race already started'],
    [400, 'Room full'],
    [400, 'Too many rooms'],
  ];
  const seen = new Set();
  for (const [status, message] of cases) {
    const error = await refusedWith(status, { code: '22023', message, details: null, hint: null }, { refusals: RACE_REFUSALS });
    assert.doesNotMatch(error.message, /ตรวจการเชื่อมต่อ/, `${message} still reads as a connection problem`);
    assert.match(error.message, /[฀-๿]/, `${message} is said in Thai`);
    assert.doesNotMatch(error.message, /·/, 'no middle dot in student copy');
    assert.equal(error.status, status);
    assert.equal(error.serverMessage, message);
    seen.add(error.message);
  }
  assert.equal(seen.size, cases.length, 'the four refusals read differently');
});

test('an unknown refusal and a caller without a refusal map keep the generic message', async () => {
  const unknown = await refusedWith(500, { message: 'something else' }, { refusals: RACE_REFUSALS });
  assert.match(unknown.message, /ยังทำรายการไม่สำเร็จ/);
  const plain = await refusedWith(400, { message: 'Room full' });
  assert.match(plain.message, /ยังทำรายการไม่สำเร็จ/, 'callers that pass no map (study-event sync) behave as before');
  assert.equal(plain.serverMessage, 'Room full');
  const notJson = await (async () => {
    const real = globalThis.fetch;
    globalThis.fetch = async () => new Response('<html>502</html>', { status: 502 });
    try { await ownedRpc('me', 'enter_race', {}, { refusals: RACE_REFUSALS }); } catch (e) { return e; } finally { globalThis.fetch = real; }
  })();
  assert.match(notJson.message, /ยังทำรายการไม่สำเร็จ/);
});

test('RaceView uses the refusal map for joining and for the room poll', () => {
  const src = readFileSync(new URL('../../src/views/RaceView.jsx', import.meta.url), 'utf8');
  assert.match(src, /ownedRpc\(owner, 'enter_race', \{ p_code: value \}, \{ refusals: RACE_REFUSALS \}\)/);
  assert.match(src, /ownedRpc\(owner, 'enter_race', \{ p_code: null \}, \{ refusals: RACE_REFUSALS \}\)/);
  assert.match(src, /ownedRpc\(owner, 'race_snapshot', \{ p_code: code \}, \{ refusals: RACE_REFUSALS \}\)/);
});
