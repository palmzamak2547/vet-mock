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
import { readFileSync } from 'node:fs';

import {
  hasPickedYear,
  frontDoorFor,
  yearGateFor,
  viewForAppPath,
  isAppPath,
  YEAR_SCOPED_VIEW_IDS,
  APP_VIEW_ROUTES,
} from '../../src/lib/view-route.js';

const APP = readFileSync(new URL('../../src/App.jsx', import.meta.url), 'utf8').replace(/\r\n/g, '\n');

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

test('the phase picker and the reading list ask for the year too: both list that year\'s subjects', () => {
  // A cold /app/phase printed "ปี 5, Vet 86" with year 5's subject counts, and
  // /app/reading listed year 5's subjects to tick, to someone who never chose 5.
  for (const [path, view] of [['/app/phase', 'phase-select'], ['/app/reading', 'reading-checklist']]) {
    assert.equal(viewForAppPath(path), view);
    assert.ok(YEAR_SCOPED_VIEW_IDS.has(view), `${path} must be year-scoped`);
    assert.equal(frontDoorFor(view, { storedYearRaw: null, seenLanding: null }), 'landing', `${path}, first visit`);
    assert.equal(frontDoorFor(view, { storedYearRaw: 'null', seenLanding: '1' }), 'year-select', `${path}, landing seen`);
    assert.equal(frontDoorFor(view, { storedYearRaw: '4', seenLanding: '1' }), null, `${path} opens for a student with a year`);
  }
});

// Measured 2026-11-08 in Chromium: a fresh browser on the shared /app/library
// tapped ฝึกข้อสอบ in the bottom bar and got "เลือก วิชา, ปี 5" with all 18
// cards on "กำลังโหลด" a minute later (no year, so no bank was ever asked
// for). ทบทวน and ความคืบหน้า showed year 5's scope the same way. The door
// above runs on a page load only; a tap inside the app never reached it.
test('inside the app, a tap to any year-scoped page asks for the year first, as a cold link does', () => {
  for (const view of YEAR_SCOPED_VIEW_IDS) {
    assert.equal(yearGateFor(view, null), 'year-select', `${view} must not be drawn before a year is picked`);
    assert.equal(yearGateFor(view, undefined), 'year-select', view);
    for (const year of [1, 4, 5, 6]) assert.equal(yearGateFor(view, year), null, `${view} opens for year ${year}`);
  }
  // The open surfaces stay open, and the pickers themselves are never gated:
  // gating the year picker would send the visitor to itself forever.
  for (const view of ['library', 'videos', 'knowledge', 'faculty', 'about', 'feedback', 'schedule', 'landing', 'year-select', 'auth', 'topic-select']) {
    assert.equal(yearGateFor(view, null), null, `${view} must stay open without a year`);
  }
});

// Rendering App is not something node can do, so the wiring is pinned as a construct.
test('App asks that rule on every view change, for every year-scoped page and not Home alone', () => {
  assert.doesNotMatch(APP, /if \(view !== 'home'\) return;\s*if \(selectedYearStored != null\) return;/,
    'the in-app guard still covers Home alone');
  const guard = APP.match(/useEffect\(\(\) => \{\s*const door = yearGateFor\(view, selectedYearStored\);[\s\S]*?\}, \[view, selectedYearStored, setView\]\);/);
  assert.ok(guard, 'App no longer asks yearGateFor when the view changes');
  assert.match(guard[0], /rememberFrontDoorReturn\(view\);/, 'the page the visitor asked for must open after the picks, not Home');
  assert.match(guard[0], /setView\(door, \{ replace: true \}\);/,
    'the picker must take the asked page\'s place in history, or Back lands on that page and bounces to the picker again');
  assert.match(APP, /\|\| navigationState\?\.replace\) \{\s*window\.history\.replaceState\(/, 'setView ignores a replace');
  // Until the picker is up, a year-scoped page is not drawn with the default year.
  assert.match(APP, /\{authLoading \|\| yearGateFor\(view, selectedYearStored\) \? <ViewFallback \/> : \(/,
    'a year-scoped page is drawn for a moment as year 5 before the picker opens');
});

test('the bar\'s and the rail\'s โหมดสอบ ask for the year first, as the landing\'s own button does', () => {
  const fn = APP.match(/const navMockExam = \(\) => \{[\s\S]*?\n {2}\};/);
  assert.ok(fn, 'navMockExam is gone');
  assert.match(fn[0], /if \(selectedYearStored != null\) \{ startMockExam\(\); return; \}/, 'a student with a year starts at once');
  assert.match(fn[0], /landingIntentRef\.current = \{ kind: 'mock-exam' \};/, 'the set must open once the picks reach Home');
  assert.match(fn[0], /setView\('year-select'\);/);
  assert.doesNotMatch(fn[0], /vmx-seen-landing/, 'a tap inside the app has not seen the landing');
  assert.match(APP, /const navHandlers = \{[^}]*onMockExam: navMockExam[^}]*\};/, 'the bottom bar still opens a set scoped to year 5');
  assert.match(APP, /<Sidebar[\s\S]*?onMockExam=\{navMockExam\}[\s\S]*?\/>/, 'the rail still opens a set scoped to year 5');
  // Back out of the picker to the library, and later Home: no set opens unasked.
  assert.match(APP, /settleFrontDoorReturn\(view\);\s*if \(view !== 'home' && !atFrontDoor\(view\)\) landingIntentRef\.current = null;/,
    'a parked set outlives the picker it waited for and opens at a later visit to Home');
});
