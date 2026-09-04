// ============================================================
// front-door-year-gate.test.mjs — never assert a year nobody picked
// ============================================================
// Measured on production 2026-09-04: a browser with no VetMock state
// opened https://vetmock.vercel.app/app and landed on Home reading
// "พร้อมฝึกสำหรับ ปี 5" with `vmx-selected-year` still literally 'null'.
// The picker never ran, because App.jsx's front door returned the routed
// /app/* view (or 'home' for bare /app) BEFORE it reached the
// never-picked-a-year gate that "/" has always had. Every count, subject
// card and practice pool on that page is filtered by the defaulted year,
// so a second-year student following a link posted in a group chat was
// shown year 5 as if it were their own.
//
// These pin the pure decision. The e2e in smoke.spec.js walks the real
// browser path; this file is the one that fails fast and says why.
// ============================================================

import test from 'node:test';
import assert from 'node:assert/strict';

import {
  hasPickedYear,
  frontDoorFor,
  viewForAppPath,
  isAppPath,
  YEAR_SCOPED_VIEW_IDS,
  APP_VIEW_ROUTES,
} from '../../src/lib/view-route.js';

test('hasPickedYear: absent and the string "null" both mean not chosen', () => {
  // useLocalStorage writes its initial value back on first mount, so a
  // brand-new browser holds the STRING 'null', not a missing key. Reading
  // that as a choice is exactly how the bug survived.
  assert.equal(hasPickedYear(null), false, 'key absent = never picked');
  assert.equal(hasPickedYear(undefined), false);
  assert.equal(hasPickedYear('null'), false, 'serialized null = never picked');
  assert.equal(hasPickedYear('5'), true);
  assert.equal(hasPickedYear('2'), true);
  assert.equal(hasPickedYear('not json'), false, 'unparseable is not a choice');
});

test('a never-picked visitor is sent to the front door for every year-scoped view', () => {
  for (const view of YEAR_SCOPED_VIEW_IDS) {
    assert.equal(
      frontDoorFor(view, { storedYearRaw: 'null', seenLanding: null }),
      'landing',
      `${view} must not render before a year is picked`,
    );
    assert.equal(
      frontDoorFor(view, { storedYearRaw: null, seenLanding: '1' }),
      'year-select',
      `${view} must ask again once the landing page has been seen`,
    );
  }
});

test('home is year-scoped — the exact page that announced ปี 5 to a stranger', () => {
  assert.ok(YEAR_SCOPED_VIEW_IDS.has('home'));
  assert.equal(frontDoorFor('home', { storedYearRaw: 'null', seenLanding: null }), 'landing');
});

test('a visitor who HAS picked a year is never bounced, on any view', () => {
  for (const view of [...YEAR_SCOPED_VIEW_IDS, 'library', 'videos', 'knowledge']) {
    assert.equal(
      frontDoorFor(view, { storedYearRaw: '3', seenLanding: '1' }),
      null,
      `${view} must load directly for a returning student`,
    );
  }
});

test('year-agnostic shared surfaces stay open to a stranger', () => {
  // The library is deliberately login-free and link-shareable; putting a
  // year picker in front of a document someone was sent is worse than the
  // bug. These show every year at once, or none at all.
  for (const view of ['library', 'videos', 'knowledge', 'faculty', 'about', 'feedback', 'schedule']) {
    assert.equal(
      frontDoorFor(view, { storedYearRaw: 'null', seenLanding: null }),
      null,
      `${view} must stay openable without picking a year`,
    );
  }
});

test('every year-scoped view id is a real route the app can actually reach', () => {
  // A typo here would silently disable the gate for that view.
  for (const view of YEAR_SCOPED_VIEW_IDS) {
    assert.ok(
      view === 'home' || APP_VIEW_ROUTES[view],
      `${view} is not in the route table — the gate would never fire for it`,
    );
  }
});

test('the /app paths that used to skip the gate now resolve through it', () => {
  // Bare /app has no entry in the route table; App.jsx treats it as home.
  assert.equal(viewForAppPath('/app'), null);
  assert.ok(isAppPath('/app'));
  assert.equal(frontDoorFor('home', { storedYearRaw: 'null' }), 'landing');

  // /app/study is the canonical subject grid, filtered by year.
  assert.equal(viewForAppPath('/app/study'), 'subject-select');
  assert.equal(frontDoorFor('subject-select', { storedYearRaw: 'null' }), 'landing');

  // /app/library is the shared shelf and must NOT be gated.
  assert.equal(viewForAppPath('/app/library'), 'library');
  assert.equal(frontDoorFor('library', { storedYearRaw: 'null' }), null);
});
