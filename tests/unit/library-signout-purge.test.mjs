// ============================================================
// library-signout-purge.test.mjs — a signed-out device keeps no login-only deck
// ============================================================
// DA-07. The service worker keeps opened library documents in
// 'vmx-lib-docs-v1', keyed only by content hash, and answers any request for
// that hash from the cache, whoever asks. The reader's offline fallback in
// library.js handed out that cached URL without looking at the document's
// status or the session, and PdfAnnotateView, keyed by user, remounted as a
// guest still holding the deck the previous student had open. On a shared
// computer, a login-only lecture deck could be reopened offline after its
// reader signed out in another tab.
//
// The worker is not changed (its update contract is frozen). Instead:
//   1. library.js hands out the offline URL for a restricted document only
//      while this device still holds a session;
//   2. on sign-out, library.js deletes the cached bytes of every restricted
//      catalogue document this session listed, and nothing else: public
//      decks, the offline shell, a student's own PDFs, their ink, bookmarks
//      and notes all stay;
//   3. App drops the reader's shelf document when a signed-in owner changes,
//      but not on guest to signed-in (that deck is what they signed in for).
// ============================================================

import test from 'node:test';
import assert from 'node:assert/strict';
import { readFileSync } from 'node:fs';
import { dirname, join, resolve } from 'node:path';
import { pathToFileURL } from 'node:url';
import { memoryIndexedDb } from '../helpers/memory-indexed-db.mjs';

const ROOT = resolve(process.cwd());
const src = (p) => readFileSync(join(ROOT, p), 'utf8');

const R_HASH = 'aaaaaaaaaaaaaaaa'; // a restricted lecture deck
const P_HASH = 'bbbbbbbbbbbbbbbb'; // a public handout
const OLD_HASH = 'cccccccccccccccc'; // opened on an earlier day, not in this session's catalogue
const MINE_HASH = 'dddddddddddddddd'; // the student's own PDF, opened from the file picker
const TOKEN_KEY = 'sb-project-auth-token';

// ── Browser stand-ins ─────────────────────────────────────────────────────
function webStorage(seed = {}) {
  const map = new Map(Object.entries(seed));
  return {
    get length() { return map.size; },
    key: (i) => [...map.keys()][i] ?? null,
    getItem: (k) => (map.has(k) ? map.get(k) : null),
    setItem: (k, v) => { map.set(k, String(v)); },
    removeItem: (k) => { map.delete(k); },
    _map: map,
  };
}

/** CacheStorage over plain maps. Keys are stored by path, so the worker's
 *  absolute `new Request('/__lib-doc/…')` and the page's relative string
 *  name the same entry, as they do in a browser on one origin. */
function cacheStorage() {
  const named = new Map();
  const path = (req) => String(req?.url ?? req).replace(/^[a-z]+:\/\/[^/]+/i, '');
  const cacheFor = (name) => {
    if (!named.has(name)) named.set(name, new Map());
    const store = named.get(name);
    return {
      match: async (req) => (store.has(path(req)) ? new Response(store.get(path(req))) : undefined),
      put: async (req, res) => { store.set(path(req), await res.text()); },
      delete: async (req) => store.delete(path(req)),
      keys: async () => [...store.keys()].map((url) => ({ url })),
    };
  };
  return {
    open: async (name) => cacheFor(name),
    has: async (name) => named.has(name),
    delete: async (name) => named.delete(name),
    keys: async () => [...named.keys()],
    _named: named,
    _entries: (name) => [...(named.get(name)?.keys() || [])].sort(),
  };
}

function install({ signedIn = true } = {}) {
  const local = webStorage({
    'vmx-bookmarks': '["q1","q2"]',
    'vmx-notes': '{"q1":"remember the dose"}',
    'vmx-library-recent-v1': JSON.stringify([{ slug: 'deck', title: 'Deck', sha256_16: R_HASH, at: 1 }]),
    ...(signedIn ? { [TOKEN_KEY]: '{"access_token":"t"}' } : {}),
  });
  const session = webStorage();
  const caches = cacheStorage();
  const win = new EventTarget();
  win.localStorage = local;
  win.sessionStorage = session;
  globalThis.window = win;
  globalThis.localStorage = local;
  globalThis.sessionStorage = session;
  globalThis.caches = caches;
  globalThis.indexedDB = memoryIndexedDb();
  return { local, session, caches, win };
}

// ── library.js, with supabase.js stubbed ──────────────────────────────────
// supabase.js reads import.meta.env at load and cannot run under node; it is
// swapped for a stub whose client each test sets. Every other import and
// every function body is the real one.
const LIB_PATH = join(ROOT, 'src/lib/library.js');
const supabaseStub = 'data:text/javascript,' + encodeURIComponent(
  'export const hasSupabase = true;\n'
  + 'export function getSupabase() { return Promise.resolve(globalThis.__vmxTestSupabase); }\n',
);
let loads = 0;
async function freshLibrary() {
  const abs = (spec) => pathToFileURL(resolve(dirname(LIB_PATH), spec)).href;
  const code = src('src/lib/library.js')
    .replace(/from '(\.[^']+)'/g, (_m, spec) => `from '${abs(spec)}'`)
    .replace(/import\('(\.[^']+)'\)/g, (_m, spec) => (spec === './supabase.js' ? `import('${supabaseStub}')` : `import('${abs(spec)}')`));
  return import('data:text/javascript;base64,'
    + Buffer.from(`${code}\n//# sourceURL=library-under-test-${++loads}.mjs`).toString('base64'));
}

const doc = (slug, status, sha, extra = {}) => ({
  id: `id-${slug}`, slug, title: slug, kind: 'slide', subject: 'com5', year: 5, semester: 1,
  sequence: 1, storage_provider: 'r2', storage_bucket: 'b', storage_key: `docs/${sha}/${slug}.pdf`,
  mime: 'application/pdf', sha256_16: sha, status, ...extra,
});

/** A library_docs table behind PostgREST's paging and counting. */
function catalogue(rows) {
  const log = [];
  const client = {
    from() {
      const req = { cols: null, count: null, range: null, limit: null };
      const q = {
        select(cols, opts = {}) { req.cols = cols; req.count = opts.count || null; return q; },
        order() { return q; },
        range(a, b) { req.range = [a, b]; return q; },
        limit(n) { req.limit = n; return q; },
        then(res, rej) {
          log.push({ ...req });
          const all = rows();
          let data = all;
          if (req.range) data = all.slice(req.range[0], req.range[1] + 1);
          else if (req.limit != null) {
            data = [...all].sort((a, b) => String(b.updated_at || '').localeCompare(String(a.updated_at || '')))
              .slice(0, req.limit).map((r) => ({ updated_at: r.updated_at ?? null }));
          }
          return Promise.resolve({ data, error: null, count: req.count ? all.length : null }).then(res, rej);
        },
      };
      return q;
    },
    auth: { getSession: async () => ({ data: { session: null } }) },
  };
  return { client, log };
}

const settle = async () => { for (let i = 0; i < 20; i++) await new Promise((r) => setImmediate(r)); };
const signOut = (env) => { env.local.removeItem(TOKEN_KEY); env.win.dispatchEvent(new Event('vmx-library-auth-changed')); };

test('DA-07: sign-out deletes only the restricted decks\' bytes; public decks, the shell and the student\'s own work stay', async () => {
  const env = install({ signedIn: true });
  const lib = await freshLibrary();
  const ink = await import(`../../src/lib/pdf-annotations.js?before=${loads}`);
  const { client } = catalogue(() => [doc('deck', 'restricted', R_HASH), doc('handout', 'public', P_HASH), doc('no-hash', 'restricted', null)]);
  globalThis.__vmxTestSupabase = client;

  // What a signed-in afternoon leaves on the device.
  await lib.getLibraryCatalog();
  const bytes = await env.caches.open('vmx-lib-docs-v1');
  for (const h of [R_HASH, P_HASH, OLD_HASH]) await bytes.put(new Request(`https://vetmock.test/__lib-doc/${h}`), new Response(`pdf ${h}`));
  const shell = await env.caches.open('vmx-runtime-v194-2026-09-19');
  await shell.put('/', new Response('<html>'));
  await shell.put('/assets/index.js', new Response('js'));
  const assets = await env.caches.open('vmx-assets-v1');
  await assets.put('/assets/app.css', new Response('css'));
  await ink.saveAnnotations(MINE_HASH, { fileName: 'my-own-notes.pdf', pageCount: 3, strokesByPage: { 1: [{ id: 's1', mode: 'pen', points: [[0.1, 0.1]] }] } }, 'A');
  await ink.saveAnnotations(R_HASH, { fileName: 'deck.pdf', pageCount: 20, slug: 'deck', strokesByPage: { 4: [{ id: 's2', mode: 'pen', points: [[0.2, 0.2]] }] } }, 'A');
  const snapshotBefore = env.caches._entries('vmx-library-catalog-v1');
  const localBefore = new Map(env.local._map);
  localBefore.delete(TOKEN_KEY);

  // An account switch or a guest signing in: a session is still there, so
  // nothing is removed. Restricted means any signed-in account.
  env.win.dispatchEvent(new Event('vmx-library-auth-changed'));
  await settle();
  assert.deepEqual(env.caches._entries('vmx-lib-docs-v1'), [OLD_HASH, P_HASH, R_HASH].map((h) => `/__lib-doc/${h}`).sort());

  // Signed out.
  signOut(env);
  await settle();
  assert.deepEqual(env.caches._entries('vmx-lib-docs-v1'), [OLD_HASH, P_HASH].map((h) => `/__lib-doc/${h}`).sort(),
    'the restricted deck\'s bytes are gone, the public handout\'s are kept');
  assert.deepEqual(env.caches._entries('vmx-runtime-v194-2026-09-19'), ['/', '/assets/index.js'], 'the offline shell is untouched');
  assert.deepEqual(env.caches._entries('vmx-assets-v1'), ['/assets/app.css']);
  assert.deepEqual(env.caches._entries('vmx-library-catalog-v1'), snapshotBefore, 'the public shelf snapshot is untouched');
  const localAfter = new Map(env.local._map);
  assert.deepEqual(localAfter, localBefore, 'bookmarks, notes and recents are untouched');

  // Read the student's work back through a fresh module, from storage itself.
  const inkAfter = await import(`../../src/lib/pdf-annotations.js?after=${loads}`);
  const mine = await inkAfter.loadAnnotations(MINE_HASH, 'A');
  assert.equal(mine?.fileName, 'my-own-notes.pdf', 'the student\'s own PDF is still in their reader');
  assert.equal(mine.strokesByPage['1'].length, 1, 'with its ink');
  const onDeck = await inkAfter.loadAnnotations(R_HASH, 'A');
  assert.equal(onDeck?.strokesByPage['4'].length, 1, 'ink written on the restricted deck is the student\'s work and stays');
  const recent = await inkAfter.listRecentPdfs('A');
  assert.deepEqual(recent.map((r) => r.fileName).sort(), ['deck.pdf', 'my-own-notes.pdf']);
});

test('DA-07: a device with no worker cache is left alone at sign-out', async () => {
  const env = install({ signedIn: true });
  const lib = await freshLibrary();
  globalThis.__vmxTestSupabase = catalogue(() => [doc('deck', 'restricted', R_HASH)]).client;
  await lib.getLibraryCatalog();
  signOut(env);
  await settle();
  assert.equal(env.caches._named.has('vmx-lib-docs-v1'), false, 'the page must not create the worker\'s cache');
});

test('DA-07: offline, a signed-out reader gets "sign in" for a restricted deck, and the cached copy for a public one', async () => {
  const env = install({ signedIn: false });
  const lib = await freshLibrary();
  globalThis.__vmxTestSupabase = catalogue(() => []).client;
  const restricted = doc('deck', 'restricted', R_HASH);
  const open = doc('handout', 'public', P_HASH);
  const realFetch = globalThis.fetch;
  try {
    // The network is gone: fetch rejects.
    globalThis.fetch = async () => { throw new TypeError('Failed to fetch'); };
    await assert.rejects(lib.resolveDocUrl(restricted), /ต้องเข้าสู่ระบบ/);
    assert.equal(await lib.resolveDocUrl(open), `/api/library-blob?offline=1&h=${P_HASH}`);
    // Or our worker answers /api/* offline with a synthetic 503.
    globalThis.fetch = async () => new Response(JSON.stringify({ error: 'Offline' }), { status: 503 });
    await assert.rejects(lib.resolveDocUrl(restricted), /ต้องเข้าสู่ระบบ/);
    assert.equal(await lib.resolveDocUrl(open), `/api/library-blob?offline=1&h=${P_HASH}`);
    // Signed in, the restricted deck opens offline as before.
    env.local.setItem(TOKEN_KEY, '{"access_token":"t"}');
    assert.equal(await lib.resolveDocUrl(restricted), `/api/library-blob?offline=1&h=${R_HASH}`);
    globalThis.fetch = async () => { throw new TypeError('Failed to fetch'); };
    assert.equal(await lib.resolveDocUrl(restricted), `/api/library-blob?offline=1&h=${R_HASH}`);
  } finally {
    globalThis.fetch = realFetch;
  }
});

test('DA-07: the page purges the worker\'s own cache, by the worker\'s own key', () => {
  const sw = src('public/sw.js');
  const lib = src('src/lib/library.js');
  const swName = sw.match(/const LIB_DOCS = '([^']+)'/)[1];
  assert.ok(lib.includes(`'${swName}'`), `library.js must name the worker's cache '${swName}'`);
  assert.match(sw, /new Request\(`\/__lib-doc\/\$\{hash\}`\)/, 'the worker still keys bytes as /__lib-doc/<hash>');
  assert.match(lib, /`\/__lib-doc\/\$\{/, 'and the purge deletes that same key');
});

test('DA-07: App closes the reader\'s shelf document when a signed-in owner changes, not on guest to signed-in', () => {
  const app = src('src/App.jsx');
  const at = app.indexOf('libraryOwnerRef');
  assert.notEqual(at, -1, 'App remembers who opened the reader\'s document');
  const effect = app.slice(app.lastIndexOf('useEffect(', app.indexOf('libraryOwnerRef.current', at + 1)), app.indexOf('[user?.id]', at) + 12);
  assert.match(effect, /prev !== null && prev !== next/, 'only a previously signed-in owner changing closes it');
  assert.match(effect, /setLibraryDoc\(null\)/);
  assert.match(effect, /setPdfLibraryReturnPath\(null\)/);
  assert.match(effect, /\}, \[user\?\.id\]\);/, 'it follows the account id');
});
