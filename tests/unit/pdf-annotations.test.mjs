// The annotation record has two writers on different debounce clocks: the
// stroke autosave (500 ms, passes strokes, no lastPage) and the reading-
// position tracker (800 ms, passes lastPage, no strokes). saveAnnotations
// merges field-by-field so neither can erase the other's work.
//
// The store moved from one shared localStorage key to one IndexedDB record
// per document (2026-08-31), because the shared key deleted OTHER documents'
// strokes when it ran out of room — and did so from the read path, so simply
// opening a document could destroy work elsewhere. That property is pinned
// here too: it is the failure this rewrite exists to prevent.
import test from 'node:test';
import assert from 'node:assert/strict';

// A minimal IndexedDB good enough for one keyPath store. Written by hand
// rather than pulled in as a dependency: the module uses four operations and
// a fake for them is smaller than the install.
function fakeIndexedDb() {
  const data = new Map();
  const done = (result) => {
    const req = { result, onsuccess: null, onerror: null };
    queueMicrotask(() => req.onsuccess?.());
    return req;
  };
  return {
    open() {
      const db = {
        objectStoreNames: { contains: () => true },
        createObjectStore: () => {},
        transaction() {
          const t = { oncomplete: null, onerror: null, onabort: null };
          let pending = 0, finished = false;
          const finish = () => {
            if (!pending && !finished) { finished = true; t.oncomplete?.(); }
          };
          const done = result => {
            pending += 1;
            const req = { result: structuredClone(result), onsuccess: null, onerror: null };
            queueMicrotask(() => {
              req.onsuccess?.();
              pending -= 1;
              queueMicrotask(finish);
            });
            return req;
          };
          const store = {
            get: (k) => done(data.get(k)),
            getAll: () => done([...data.values()]),
            put: (v) => { data.set(v.hash, structuredClone(v)); return done(undefined); },
            delete: (k) => { data.delete(k); return done(undefined); },
          };
          t.objectStore = () => store;
          // Two microtask hops: the operation's own onsuccess lands on the
          // first, the transaction completes on the second — the same order a
          // real IndexedDB gives, and the order tx() relies on.
          queueMicrotask(finish);
          return t;
        },
      };
      const req = { result: db, onsuccess: null, onerror: null, onupgradeneeded: null };
      queueMicrotask(() => req.onsuccess?.());
      return req;
    },
    _data: data,
  };
}

function install() {
  const store = new Map();
  globalThis.window = {
    localStorage: {
      getItem: (k) => store.get(k) ?? null,
      setItem: (k, v) => store.set(k, v),
      removeItem: (k) => store.delete(k),
    },
  };
  globalThis.indexedDB = fakeIndexedDb();
  return store;
}
function uninstall() { delete globalThis.window; delete globalThis.indexedDB; }

let n = 0;
const fresh = () => import(`../../src/lib/pdf-annotations.js?t=${++n}`);

test('stroke autosave and page tracker cannot clobber each other in one clock tick', async (t) => {
  install();
  t.mock.method(Date, 'now', () => 1_700_000_000_000);
  try {
    const { saveAnnotations, loadAnnotations } = await fresh();
    await saveAnnotations('h1', { fileName: 'a.pdf', pageCount: 10, strokesByPage: { 2: [{ mode: 'pen' }] } });
    // page tracker fires: lastPage only
    await saveAnnotations('h1', { fileName: 'a.pdf', pageCount: 10, lastPage: 7 });
    // stroke autosave fires after it: strokes only
    await saveAnnotations('h1', { fileName: 'a.pdf', pageCount: 10, strokesByPage: { 2: [{ mode: 'pen' }, { mode: 'pen' }] } });
    const rec = await loadAnnotations('h1');
    assert.equal(rec.lastPage, 7, 'a stroke save must not erase the reading position');
    assert.equal(rec.strokesByPage['2'].length, 2, 'a page save must not erase strokes');
  } finally { uninstall(); }
});

test('lastPage defaults to 1 for records that predate the field', async () => {
  install();
  try {
    const { saveAnnotations, loadAnnotations } = await fresh();
    await saveAnnotations('old', { fileName: 'b.pdf', pageCount: 3 });
    assert.equal((await loadAnnotations('old')).lastPage, 1);
  } finally { uninstall(); }
});

test('a corrected system clock cannot restore an older reading position', async (t) => {
  install();
  let now = 1_700_000_000_000;
  t.mock.method(Date, 'now', () => now);
  try {
    const { saveAnnotations, loadAnnotations } = await fresh();
    await saveAnnotations('clock', { pageCount: 10, lastPage: 3 });
    now -= 10_000;
    await saveAnnotations('clock', { lastPage: 8 });
    await saveAnnotations('clock', { strokesByPage: { 8: [{ id: 'ink', mode: 'pen' }] } });
    const record = await loadAnnotations('clock');
    assert.equal(record.lastPage, 8);
    assert.equal(record.strokesByPage[8][0].id, 'ink');
  } finally { uninstall(); }
});

// ── The bug this rewrite exists to prevent ────────────────────────────────
test('opening one document never touches another document\'s strokes', async () => {
  install();
  try {
    const { saveAnnotations, loadAnnotations, listRecentPdfs } = await fresh();
    await saveAnnotations('deckA', { fileName: 'a.pdf', pageCount: 5, strokesByPage: { 1: [{ mode: 'pen', points: [[0.1, 0.1]] }] } });
    await saveAnnotations('deckB', { fileName: 'b.pdf', pageCount: 5, strokesByPage: { 1: [{ mode: 'pen', points: [[0.2, 0.2]] }] } });

    // Reading deckB used to WRITE (to refresh lastOpened), and that write
    // could evict deckA to make room. Reading must now be a read.
    await loadAnnotations('deckB');
    await loadAnnotations('deckB');

    const a = await loadAnnotations('deckA');
    assert.ok(a, 'opening another document deleted this one\'s record');
    assert.equal(a.strokesByPage['1'].length, 1, 'another document\'s strokes went missing');
    assert.equal((await listRecentPdfs()).length, 2);
  } finally { uninstall(); }
});

test('a failing store reports failure instead of claiming the marks are safe', async () => {
  install();
  // A browser that refuses persistent storage (private windows, blocked site
  // data). The reader must be told, not reassured.
  globalThis.indexedDB = { open() { const r = { onerror: null }; queueMicrotask(() => r.onerror?.()); return r; } };
  try {
    const { saveAnnotations, storageHealth } = await fresh();
    const res = await saveAnnotations('x', { fileName: 'x.pdf', pageCount: 1, strokesByPage: { 1: [{ mode: 'pen' }] } });
    assert.equal(res.ok, false, 'a save that did not persist reported success');
    assert.equal(storageHealth().persistent, false);
  } finally { uninstall(); }
});

// ── Points are stored small, but not wrong ────────────────────────────────
test('stored coordinates stay sub-pixel accurate while getting much smaller', async () => {
  install();
  try {
    const { packStroke, saveAnnotations, loadAnnotations } = await fresh();
    // A realistic stroke, because the saving is in the points: mode/color/size
    // are a fixed ~40 bytes per stroke and measuring them alongside a single
    // point says nothing about a page of handwriting.
    const pts = Array.from({ length: 400 }, (_, i) => [0.123456789012345 + i * 1e-6, 0.987654321098765 - i * 1e-6]);
    const raw = { mode: 'pen', color: '#c0392b', size: 3, points: pts };
    const packed = packStroke(raw);
    // The widest canvas this reader paints is about 2600 device pixels.
    for (let i = 0; i < pts.length; i++) {
      assert.ok(Math.abs(packed.points[i][0] - pts[i][0]) * 2600 < 0.5, 'x moved by half a pixel or more');
      assert.ok(Math.abs(packed.points[i][1] - pts[i][1]) * 2600 < 0.5, 'y moved by half a pixel or more');
    }
    const ratio = JSON.stringify(packed.points).length / JSON.stringify(pts).length;
    assert.ok(ratio < 0.6, `packing only got points to ${(ratio * 100).toFixed(0)}% of their old size`);

    // …and packing happens on the way in, not only when asked directly.
    await saveAnnotations('p', { fileName: 'p.pdf', pageCount: 1, strokesByPage: { 1: [raw] } });
    const back = await loadAnnotations('p');
    assert.ok(String(back.strokesByPage['1'][0].points[0][0]).length <= 6,
      'a full-precision float reached storage');
  } finally { uninstall(); }
});

test('pressure is kept when the pen reports it', async () => {
  install();
  try {
    const { packStroke } = await fresh();
    const packed = packStroke({ mode: 'pen', points: [[0.5, 0.5, 0.734]] });
    assert.equal(packed.points[0].length, 3, 'pressure was dropped');
    assert.equal(packed.points[0][2], 0.73);
  } finally { uninstall(); }
});

// ── Nobody loses work by upgrading ────────────────────────────────────────
test('legacy strokes require an explicit owner claim and the original stays recoverable', async () => {
  const ls = install();
  ls.set('vmx-pdf-annotations', JSON.stringify({
    older: { fileName: 'old.pdf', pageCount: 4, lastPage: 3, lastOpened: 111,
             strokesByPage: { 2: [{ mode: 'pen', points: [[0.4, 0.4]] }] } },
  }));
  try {
    const { loadAnnotations, loadLegacyAnnotations, claimLegacyAnnotations } = await fresh();
    assert.equal(await loadAnnotations('older', 'account-a'), null, 'unattributed legacy work must not be silently adopted');
    assert.ok(await loadLegacyAnnotations('older', 'account-a'));
    assert.equal((await claimLegacyAnnotations('older', 'account-a')).ok, true);
    const rec = await loadAnnotations('older', 'account-a');
    assert.ok(rec, 'explicit recovery must preserve the old work');
    assert.equal(rec.lastPage, 3);
    assert.equal(rec.strokesByPage['2'].length, 1);
    assert.ok(ls.get('vmx-pdf-annotations'),
      'the old key was deleted — an older build would show the student nothing');
    assert.equal(await loadLegacyAnnotations('older', 'account-b'), null);
    assert.equal((await claimLegacyAnnotations('older', 'account-b')).ok, false);
    assert.equal(await loadAnnotations('older', 'account-b'), null);
  } finally { uninstall(); }
});

test('two accounts and a guest keep separate ink and recent lists for identical PDF bytes', async () => {
  install();
  try {
    const { saveAnnotations, loadAnnotations, listRecentPdfs, deleteAnnotations, peekAnnotations } = await fresh();
    for (const owner of ['account-a', 'account-b', null]) {
      await saveAnnotations('same-file', { strokesByPage: { 1: [{ id: owner || 'guest', points: [[0.1, 0.2]] }] } }, owner);
    }
    for (const owner of ['account-a', 'account-b', null]) {
      assert.equal((await loadAnnotations('same-file', owner)).strokesByPage[1][0].id, owner || 'guest');
      assert.equal(peekAnnotations('same-file', owner).ownerId, owner);
      assert.equal((await listRecentPdfs(owner)).length, 1);
    }
    await deleteAnnotations('same-file', 'account-a');
    assert.equal(await loadAnnotations('same-file', 'account-a'), null);
    assert.equal((await loadAnnotations('same-file', 'account-b')).strokesByPage[1][0].id, 'account-b');
  } finally { uninstall(); }
});

test('a stale record cannot be written under another account', async () => {
  install();
  try {
    const { saveAnnotations, putRecord, loadAnnotations, mergeRecords } = await fresh();
    const stale = { hash: 'same-file', ownerId: 'account-a', strokesByPage: { 1: [{ id: 'private-a' }] } };
    assert.equal((await putRecord(stale, 'account-b')).ok, false);
    assert.equal((await saveAnnotations('same-file', stale, 'account-b')).ok, false);
    assert.equal(await loadAnnotations('same-file', 'account-b'), null);
    assert.throws(() => mergeRecords(stale, { ...stale, ownerId: 'account-b' }), /different accounts/);
  } finally { uninstall(); }
});

test('a remote pull keeps work saved by another tab while the request was in flight', async () => {
  install();
  try {
    const a = await fresh(), b = await fresh();
    const rec = ids => ({ hash: 'shared', ownerId: 'account-a', strokesByPage: { 1: ids.map(id => ({ id, points: [[0.1, 0.2]] })) } });
    await a.saveAnnotations('shared', rec(['old']), 'account-a');
    const snapshot = await a.loadAnnotations('shared', 'account-a');
    await b.saveAnnotations('shared', rec(['old', 'saved-during-pull']), 'account-a');
    const incoming = a.mergeRecords(snapshot, rec(['remote']));
    const committed = await a.putRecord(incoming, 'account-a');
    const expected = ['old', 'remote', 'saved-during-pull'];
    assert.deepEqual(committed.record.strokesByPage[1].map(s => s.id).sort(), expected);
    assert.deepEqual((await b.loadAnnotations('shared', 'account-a')).strokesByPage[1].map(s => s.id).sort(), expected);
    await b.saveAnnotations('shared', { ...rec(['old', 'remote']), deleted: ['saved-during-pull'] }, 'account-a');
    const replay = await a.putRecord(incoming, 'account-a');
    assert.equal(replay.record.strokesByPage[1].some(s => s.id === 'saved-during-pull'), false);
  } finally { uninstall(); }
});
