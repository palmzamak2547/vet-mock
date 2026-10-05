import test from 'node:test';
import assert from 'node:assert/strict';
import { loadModule } from '../helpers/fake-react.mjs';

const api = await loadModule('src/lib/api.js', { stubs: [{ match: '/supabase\\.js$',
  contents: 'export const getSupabase = async () => globalThis.__userDataAuthClient;' }] });

function fixture() {
  let userId = 'A', resolve, markStarted;
  const started = new Promise(done => { markStarted = done; });
  const request = () => { markStarted(); return new Promise(done => { resolve = done; }); };
  const query = { select() { return this; }, eq() { return this; }, abortSignal() { return this; }, maybeSingle: request };
  globalThis.__userDataAuthClient = {
    auth: { getSession: async () => ({ data: { session: userId ? { user: { id: userId } } : null } }) },
    from: () => query,
    rpc: () => ({ abortSignal: request }),
  };
  return { started, setPrincipal: id => { userId = id; }, reply: data => resolve({ data }), replyError: error => resolve({ error }) };
}

for (const method of ['pullUserData', 'applyUserDataOperations']) {
  for (const nextId of [null, 'B']) {
    test(`${method} refuses A's delayed response after SDK session changes to ${nextId || 'signed out'}`, async () => {
      const f = fixture();
      const pending = api[method]('A', []);
      await f.started;
      f.setPrincipal(nextId);
      const row = { user_id: 'A', history: [], notes: { private: 'account A' } };
      f.reply(method === 'pullUserData' ? row : { row, acknowledged: [] });
      await assert.rejects(pending, error => error.code === 'STALE_PRINCIPAL');
    });
  }

  test(`${method} still returns a valid response for the unchanged account`, async () => {
    const f = fixture();
    const pending = api[method]('A', []);
    await f.started;
    const row = { user_id: 'A', history: [], notes: { keep: 'mine' } };
    const expected = method === 'pullUserData' ? row : { row, acknowledged: [] };
    f.reply(expected);
    assert.deepEqual(await pending, expected);
  });

  test(`${method} does not forward an old-account error into recovery after sign-out`, async () => {
    const f = fixture();
    const pending = api[method]('A', []);
    await f.started;
    f.setPrincipal(null);
    f.replyError({ code: '22023', message: 'VMX_CUSTOM_ID_CONFLICT' });
    await assert.rejects(pending, error => error.code === 'STALE_PRINCIPAL');
  });
}
