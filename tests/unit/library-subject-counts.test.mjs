// ============================================================
// library-subject-counts.test.mjs — a failed fetch is not an empty shelf
// ============================================================
// librarySubjectCounts() feeds the subject cards on Home, SubjectSelectView
// and TopicSelectView: a subject with no questions and no notes opens its
// document shelf when the count is > 0, and renders disabled and titled
// "ยังไม่มีเนื้อหาของวิชานี้ในแอป" when it is 0.
//
// It used to answer a catalog-fetch failure (campus wifi dropping, Supabase
// unreachable) with `new Map()` — byte-identical to a successful fetch of a
// catalog with zero documents. Every card then asserted the subject was
// empty and disabled itself, with no retry, while LibraryView on the same
// device painted that subject's whole shelf from its localStorage snapshot.
//
// Under plain node the catalog fetch genuinely fails (supabase.js reads
// import.meta.env without a guard), so the failure branch is exercised here
// with no mocking. The first test pins that precondition, so the rest can
// never pass by accident on a resolved-but-empty catalog.
// ============================================================

import test from 'node:test';
import assert from 'node:assert/strict';

import {
  getLibraryCatalog,
  librarySubjectCounts,
} from '../../src/lib/library.js';

const SNAPSHOT_KEY = 'vmx-library-catalog-v1';

function fakeWindow(seed = []) {
  const store = new Map(seed);
  return {
    localStorage: {
      getItem: (k) => store.get(k) ?? null,
      setItem: (k, v) => store.set(k, v),
      removeItem: (k) => store.delete(k),
    },
    addEventListener: () => {},
    _store: store,
  };
}

const snapshotOf = (docs) => JSON.stringify({ at: Date.now(), docs });

test('precondition: under node the catalog fetch really fails', async () => {
  await assert.rejects(getLibraryCatalog(), 'the tests below need the failure branch, not an empty success');
});

test('a failed fetch counts from the snapshot LibraryView paints from', async () => {
  globalThis.window = fakeWindow([[SNAPSHOT_KEY, snapshotOf([
    { slug: 'a', title: 'A', subject: 'com5' },
    { slug: 'b', title: 'B', subject: 'com5' },
    { slug: 'c', title: 'C', subject: 'vet-path-1' },
    { slug: 'd', title: 'D', subject: null },
  ])]]);
  try {
    const counts = await librarySubjectCounts();
    assert.ok(counts instanceof Map, 'with a snapshot on the device the answer is still a Map');
    assert.equal(counts.get('com5'), 2, 'com5 has two documents in the snapshot');
    assert.equal(counts.get('vet-path-1'), 1);
    assert.equal(counts.size, 2, 'unclassified rows are not counted under any subject');
  } finally {
    delete globalThis.window;
  }
});

test('a failed fetch with no snapshot answers null, never an empty shelf', async () => {
  globalThis.window = fakeWindow();
  try {
    const counts = await librarySubjectCounts();
    assert.equal(
      counts,
      null,
      'an empty Map here is indistinguishable from "this subject has no documents" — '
      + 'the cards would disable themselves and assert emptiness',
    );
  } finally {
    delete globalThis.window;
  }
});

test('the snapshot fallback is not remembered as the session answer', async () => {
  // A later mount must read the device again (and retry the network via
  // getLibraryCatalog, which drops its failed promise), not replay a count
  // taken while offline.
  globalThis.window = fakeWindow([[SNAPSHOT_KEY, snapshotOf([{ slug: 'a', title: 'A', subject: 'com5' }])]]);
  try {
    assert.equal((await librarySubjectCounts())?.get('com5'), 1);
    window._store.set(SNAPSHOT_KEY, snapshotOf([
      { slug: 'a', title: 'A', subject: 'com5' },
      { slug: 'b', title: 'B', subject: 'com5' },
      { slug: 'c', title: 'C', subject: 'com5' },
    ]));
    assert.equal((await librarySubjectCounts())?.get('com5'), 3, 'the second call reflects the newer snapshot');
  } finally {
    delete globalThis.window;
  }
});
