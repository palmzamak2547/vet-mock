import test from 'node:test';
import assert from 'node:assert/strict';
import { loadModule } from '../helpers/fake-react.mjs';

const client = await loadModule('src/lib/external-doc-client.js', { stubs: [
  { match: '/supabase\\.js$', contents: 'export const getSupabase = () => globalThis.__externalClientSdk();' },
] });
const deferred = () => { let resolve; const promise = new Promise(r => { resolve = r; }); return { promise, resolve }; };
const doc = { provider: 'gdocs', title: 'Private title', markdown: '# Private content', sourceUrl: 'https://docs.google.com/document/d/ACCOUNTAPRIVATEDOC00001/edit' };
function setup(t) {
  const previous = { fetch: globalThis.fetch, sdk: globalThis.__externalClientSdk, storage: globalThis.localStorage };
  let session = { user: { id: 'account-a' }, access_token: 'a-token' };
  const store = new Map(), calls = [];
  globalThis.localStorage = { getItem: key => store.get(key) ?? null, setItem: (key, value) => store.set(key, value) };
  globalThis.__externalClientSdk = async () => ({ auth: { getSession: async () => ({ data: { session } }) } });
  globalThis.fetch = async (url, options) => { calls.push({ url, options }); return { ok: true, json: async () => doc }; };
  t.after(() => { globalThis.fetch = previous.fetch; globalThis.__externalClientSdk = previous.sdk; globalThis.localStorage = previous.storage; });
  return { store, calls, setSession: value => { session = value; } };
}

test('private document recents stay in their initiating account, with guest and legacy rows isolated', t => {
  const { store } = setup(t);
  store.set('vmx-external-docs-v1', JSON.stringify([{ url: doc.sourceUrl, provider: 'gdocs', title: 'Unowned old title' }]));
  client.rememberRecentExternalDoc({ url: doc.sourceUrl, title: doc.title, provider: doc.provider }, 'account-a');
  assert.equal(client.loadRecentExternalDocs('account-a')[0].title, doc.title);
  assert.deepEqual(client.loadRecentExternalDocs('account-b'), []);
  assert.deepEqual(client.loadRecentExternalDocs(), []);
  client.rememberRecentExternalDoc({ url: doc.sourceUrl, title: 'Guest reading', provider: doc.provider });
  assert.equal(client.loadRecentExternalDocs()[0].title, 'Guest reading');
  assert.equal(client.loadRecentExternalDocs('account-a')[0].title, doc.title);
  client.rememberRecentExternalDoc({ url: 'javascript:alert(1)', title: {}, provider: 'gdocs' }, 'account-a');
  assert.equal(client.loadRecentExternalDocs('account-a').length, 1);
  client.rememberRecentExternalDoc({ url: doc.sourceUrl, provider: doc.provider }, 'encoded/owner');
  assert.ok(store.has('vmx-external-docs-v2:encoded%2Fowner'));
});

test('late session resolution cannot authorize an old action as the next account', async t => {
  const { calls } = setup(t);
  const session = deferred();
  globalThis.__externalClientSdk = async () => ({ auth: { getSession: () => session.promise } });
  const pending = client.disconnectExternalConnection('google', { ownerId: 'account-a' });
  session.resolve({ data: { session: { user: { id: 'account-b' }, access_token: 'b-token' } } });
  assert.equal((await pending).ok, false);
  assert.equal(calls.length, 0);
});

test('canceling while SDK is pending settles without sending a late request', async t => {
  const { calls } = setup(t), sdk = deferred(), controller = new AbortController();
  globalThis.__externalClientSdk = () => sdk.promise;
  const pending = client.fetchExternalDoc(doc.sourceUrl, { ownerId: 'account-a', signal: controller.signal });
  controller.abort();
  assert.equal((await pending).aborted, true);
  sdk.resolve({ auth: { getSession: async () => ({ data: { session: { user: { id: 'account-a' }, access_token: 'a-token' } } }) } });
  await new Promise(resolve => setTimeout(resolve, 0));
  assert.equal(calls.length, 0);
});

test('public reading skips SDK and malformed file lists or navigation URLs fail visibly', async t => {
  const { calls } = setup(t);
  globalThis.__externalClientSdk = () => { throw new Error('guest must not load SDK'); };
  assert.equal((await client.fetchExternalDoc(doc.sourceUrl)).ok, true);
  assert.equal(calls[0].options.headers.Authorization, undefined);
  for (const files of [{}, [null], [{ id: 'unsafe', title: 'Bad file', url: 'javascript:alert(1)' }], [{ id: 'bad-title', title: {}, url: doc.sourceUrl }]]) {
    globalThis.fetch = async () => ({ ok: true, json: async () => ({ files }) });
    const result = await client.listExternalFiles('google');
    assert.equal(result.ok, false); assert.equal(typeof result.error, 'string');
  }
  globalThis.fetch = async () => ({ ok: true, json: async () => ({ url: 'javascript:alert(1)' }) });
  assert.equal((await client.startExternalConnection('google')).ok, false);
});

test('request timeout settles as a retryable error and aborts upstream fetch', async t => {
  setup(t);
  t.mock.timers.enable({ apis: ['setTimeout'] });
  let signal;
  globalThis.fetch = async (_url, options) => { signal = options.signal; return new Promise(() => {}); };
  const pending = client.fetchExternalDoc(doc.sourceUrl);
  await Promise.resolve(); await Promise.resolve();
  t.mock.timers.tick(45_000);
  const result = await pending;
  assert.equal(result.ok, false); assert.equal(result.reason, 'timeout');
  assert.equal(result.aborted, false); assert.equal(signal.aborted, true);
});
