// ============================================================
// Home announces every release a device has not seen (src/lib/changelog-seen.js)
// ============================================================
// Until 9 Nov 2026 Home kept one value, the last version closed, and could only
// announce the highest-numbered release. A release that merged after a higher
// number was never announced, so numbers were taken at merge time, one pull
// request at a time, each merging main and running CI again first. The note now
// lists what is not in the set a device keeps; these tests pin the four cases
// that rule rests on: an out-of-order merge, the migration from the old key, the
// first visit, and the cap.

import test from 'node:test';
import assert from 'node:assert/strict';
import { readFileSync } from 'node:fs';
import {
  LEGACY_KEY, SEEN_CAP, SEEN_KEY, capSeen, compareVersions, initialSeen, loadSeen, markSeen, markUnseen,
  saveSeen, unseenReleases,
} from '../../src/lib/changelog-seen.js';
import { RECENT_RELEASES } from '../../scripts/regen-latest-changelog.mjs';

const { RECENT_CHANGELOG } = await import('../../src/data/latest-changelog.generated.js');

// localStorage as the browser keeps it; the old key was written by useLocalStorage, so as JSON.
function memoryStore(init = {}) {
  const data = new Map(Object.entries(init));
  return {
    getItem: (key) => (data.has(key) ? data.get(key) : null),
    setItem: (key, value) => { data.set(key, String(value)); },
    removeItem: (key) => { data.delete(key); },
  };
}

const release = (version) => ({ version, date: '2026-11-09', headline: `headline ${version}`, changes: [{ kind: 'fix', title: `change ${version}` }] });
// What a build carries (RECENT_CHANGELOG): newest first by version, as the generator writes it.
const build = (...versions) => versions.map(release).sort((a, b) => compareVersions(b.version, a.version));
const versionsOf = (releases) => releases.map((r) => r.version);

// One visit to Home: what the note announces, then the ✕ (every listed release seen) and the save.
function visit(store, releases, { close = true } = {}) {
  let seen = loadSeen(releases, store);
  const announced = versionsOf(unseenReleases(releases, seen));
  if (close && announced.length) seen = markSeen(seen, announced);
  saveSeen(seen, store);
  return announced;
}

// The rule this replaces: announce the top release while it differs from the last one closed.
const oldRuleAnnounces = (lastSeen, releases) => releases[0].version !== lastSeen;

test('a release that merges after a higher number is still announced, and only once', () => {
  const store = memoryStore();
  assert.deepEqual(visit(store, build('5.192.5', '5.192.4')), [], 'first visit');
  // 5.193.2 merges first and is announced and closed.
  assert.deepEqual(visit(store, build('5.193.2', '5.192.5', '5.192.4')), ['5.193.2']);
  // 5.193.1, opened earlier, merges after it. The old rule kept "5.193.2" and stayed silent.
  const later = build('5.193.2', '5.193.1', '5.192.5', '5.192.4');
  assert.equal(oldRuleAnnounces('5.193.2', later), false);
  assert.deepEqual(visit(store, later), ['5.193.1']);
  assert.deepEqual(visit(store, later), [], 'announced once');
});

test('a device back after several merges gets every unseen release, newest first by version', () => {
  const store = memoryStore();
  visit(store, build('5.192.5', '5.192.4'));
  // Merged in the order 5.193.2, 5.193.0, 5.193.1 while the device was away.
  assert.deepEqual(visit(store, build('5.193.0', '5.193.2', '5.193.1', '5.192.5', '5.192.4')), ['5.193.2', '5.193.1', '5.193.0']);
  // Not closed: the same releases wait for the next visit.
  const more = build('5.193.3', '5.193.2', '5.193.1', '5.193.0', '5.192.5', '5.192.4');
  assert.deepEqual(visit(store, more, { close: false }), ['5.193.3']);
  assert.deepEqual(visit(store, more), ['5.193.3']);
  assert.deepEqual(visit(store, more), []);
});

test('migration: with the old key, every release at or below it counts as seen, and nothing above it', () => {
  const releases = build('5.192.5', '5.192.4', '5.192.3', '5.192.2', '5.192.1');
  const store = memoryStore({ [LEGACY_KEY]: JSON.stringify('5.192.3') });
  assert.deepEqual(loadSeen(releases, store), ['5.192.3', '5.192.2', '5.192.1']);
  assert.deepEqual(visit(store, releases), ['5.192.5', '5.192.4']);
  assert.deepEqual(JSON.parse(store.getItem(SEEN_KEY)), versionsOf(releases));
  // Once the set exists, the old key (left in place) is not read again.
  assert.equal(store.getItem(LEGACY_KEY), JSON.stringify('5.192.3'));
  assert.deepEqual(visit(store, releases), []);
  assert.deepEqual(visit(store, build('5.193.0', ...versionsOf(releases))), ['5.193.0']);
});

test('migration compares versions by number, and an old key above every release means all are seen', () => {
  const releases = build('5.10.0', '5.9.1', '5.9.0');
  assert.deepEqual(versionsOf(unseenReleases(releases, initialSeen(undefined, '5.9.1', releases))), ['5.10.0']);
  assert.deepEqual(unseenReleases(releases, initialSeen(undefined, '6.0.0', releases)), []);
});

test('migration: an old key left null (Home opened, the note never closed) keeps the newest unread, as it was', () => {
  // The old Home wrote null on its first mount and when the bottom link reopened the note, and
  // then announced the newest release only. Students in that state see the same chip after this.
  const releases = build('5.192.5', '5.192.4', '5.192.3');
  const store = memoryStore({ [LEGACY_KEY]: 'null' });
  assert.deepEqual(visit(store, releases), ['5.192.5']);
  assert.deepEqual(visit(store, releases), []);
});

test('first visit: every release the build carries is seen, so the next release is the first announced', () => {
  const store = memoryStore();
  assert.ok(RECENT_CHANGELOG.length > 1, 'the build carries several releases');
  assert.deepEqual(visit(store, RECENT_CHANGELOG), []);
  assert.deepEqual(JSON.parse(store.getItem(SEEN_KEY)), versionsOf(RECENT_CHANGELOG));
  const next = { ...RECENT_CHANGELOG[0], version: '99.0.0' };
  assert.deepEqual(visit(store, [next, ...RECENT_CHANGELOG]), ['99.0.0']);
});

test('an unreadable old key, a junk or empty set, or blocked storage reads as a first visit', () => {
  const releases = build('5.192.5', '5.192.4');
  for (const init of [{ [LEGACY_KEY]: '{oops' }, { [LEGACY_KEY]: '"v5"' }, { [SEEN_KEY]: '"5.192.4"' }, { [SEEN_KEY]: '[]' }, { [SEEN_KEY]: '[null, 7]' }]) {
    assert.deepEqual(visit(memoryStore(init), releases), [], JSON.stringify(init));
  }
  const blocked = { getItem() { throw new Error('SecurityError'); }, setItem() { throw new Error('QuotaExceededError'); } };
  assert.deepEqual(loadSeen(releases, blocked), versionsOf(releases));
  assert.doesNotThrow(() => saveSeen(['5.192.5'], blocked));
  assert.doesNotThrow(() => saveSeen(['5.192.5'], null));
});

test('the cap keeps the newest versions and never drops one Home can still announce', () => {
  const many = Array.from({ length: SEEN_CAP + 25 }, (_, i) => `5.${100 + i}.0`);
  const capped = markSeen([], many);
  assert.equal(capped.length, SEEN_CAP);
  assert.equal(capped[0], many.at(-1));
  assert.ok(!capped.includes(many[0]), 'the oldest go first');
  // Home announces only the newest RECENT_RELEASES, well inside the cap: all still seen.
  assert.ok(SEEN_CAP >= 2 * RECENT_RELEASES, `cap ${SEEN_CAP} vs ${RECENT_RELEASES} announceable releases`);
  const newest = build(...many.slice(-RECENT_RELEASES));
  assert.deepEqual(unseenReleases(newest, capped), []);
  // A stored set past the cap is cut on load and on save.
  const store = memoryStore({ [SEEN_KEY]: JSON.stringify(many) });
  assert.equal(loadSeen(newest, store).length, SEEN_CAP);
  saveSeen(many, store);
  assert.equal(JSON.parse(store.getItem(SEEN_KEY)).length, SEEN_CAP);
  // Each version once, malformed ones dropped, newest first.
  assert.deepEqual(capSeen(['5.9.0', '5.10.0', '5.9.0', 'v5', null, '5.10']), ['5.10.0', '5.9.0']);
});

test('the bottom link reopens the newest release as unread, and the ✕ marks it seen again', () => {
  const releases = build('5.192.5', '5.192.4');
  let seen = loadSeen(releases, memoryStore());
  seen = markUnseen(seen, '5.192.5');
  assert.deepEqual(versionsOf(unseenReleases(releases, seen)), ['5.192.5']);
  seen = markSeen(seen, ['5.192.5']);
  assert.deepEqual(unseenReleases(releases, seen), []);
});

test('Home keeps the set through changelog-seen.js and no longer reads the old key itself', () => {
  const src = readFileSync(new URL('../../src/views/HomeView.jsx', import.meta.url), 'utf8');
  assert.match(src, /useState\(\(\) => loadSeen\(RECENT_CHANGELOG\)\)/);
  assert.match(src, /saveSeen\(seenChangelog\)/);
  assert.doesNotMatch(src, /vmx-last-seen-changelog/);
});

// ── The chip (5.214): news only, no count, one Home visit a day ──────────────
const { chipDue, isNews, localDay, loadChipDay, saveChipDay, CHIP_DAY_KEY } = await import('../../src/lib/changelog-seen.js');
const rel = (version, ...kinds) => ({ version, changes: kinds.map((kind) => ({ kind, scope: 'system', title: 't' })) });

test('only a feature or content change raises the chip; fixes never do', () => {
  assert.equal(isNews(rel('5.1.0', 'fix', 'fix')), false);
  assert.equal(isNews(rel('5.1.1', 'fix', 'content')), true);
  assert.equal(isNews(rel('5.1.2', 'feature')), true);
  assert.equal(chipDue([rel('5.1.0', 'fix')], null, '2026-11-11'), false, 'twelve fixes raise nothing');
  assert.equal(chipDue([rel('5.1.0', 'fix'), rel('5.1.2', 'feature')], null, '2026-11-11'), true);
  assert.equal(chipDue([], null, '2026-11-11'), false);
});

test('the chip appears on one visit a calendar day, and again the next day while news is unread', () => {
  const unseen = [rel('5.2.0', 'feature')];
  assert.equal(chipDue(unseen, '2026-11-11', '2026-11-11'), false, 'a second visit the same day');
  assert.equal(chipDue(unseen, '2026-11-11', '2026-11-12'), true, 'the next day');
  assert.equal(localDay(new Date(2026, 10, 11, 23, 59)), '2026-11-11');
  const m = new Map();
  const store = { getItem: (k) => m.get(k) ?? null, setItem: (k, v) => m.set(k, String(v)) };
  assert.equal(loadChipDay(store), null);
  saveChipDay('2026-11-11', store);
  assert.equal(loadChipDay(store), '2026-11-11');
  assert.equal(m.get(CHIP_DAY_KEY), '"2026-11-11"');
  assert.doesNotThrow(() => saveChipDay('x', { setItem() { throw new Error('blocked'); } }));
});

test('Home shows no count on the chip and no version on the foot link', () => {
  const home = readFileSync(new URL('../../src/views/HomeView.jsx', import.meta.url), 'utf8');
  assert.ok(!/\$\{noteChangeCount\} รายการ`\s*:\s*'ใหม่'/.test(home), 'the chip counts again');
  assert.ok(!/มีอะไรใหม่ \(|อัปเดตล่าสุด \(/.test(home), 'the foot link names a version again');
  assert.match(home, /const showChangelogChip = chipToday && Boolean\(newestNews\) && !forceChangelogOpen;/);
});

test('opening the note marks what it shows as seen, so leaving without the ✕ ends the chip too', () => {
  const home = readFileSync(new URL('../../src/views/HomeView.jsx', import.meta.url), 'utf8').replace(/\r\n/g, '\n');
  const reveal = home.slice(home.indexOf('const revealChangelogNote = () => {'), home.indexOf('const openChangelogNote'));
  assert.match(reveal, /setSeenChangelog\(\(seen\) => markSeen\(seen, shown\.map\(\(r\) => r\.version\)\)\)/, 'opening no longer marks the releases seen');
  assert.match(reveal, /setOpenedReleases\(shown\)/, 'the note must keep the list it opened with');
  assert.ok(!/markUnseen/.test(home), 'reopening an old note makes it news again');
  // What a later visit then decides: nothing unseen, so no chip on any day.
  const seen = markSeen([], ['5.3.0']);
  const unseen = unseenReleases([{ version: '5.3.0', changes: [{ kind: 'feature' }] }], seen);
  assert.equal(chipDue(unseen, '2026-11-11', '2026-11-12'), false, 'a day later');
  assert.equal(chipDue(unseen, '2026-11-11', '2026-11-18'), false, 'a week later');
  // A release that ships later raises it once.
  const later = unseenReleases([{ version: '5.4.0', changes: [{ kind: 'content' }] }, { version: '5.3.0', changes: [{ kind: 'feature' }] }], seen);
  assert.equal(chipDue(later, '2026-11-11', '2026-11-18'), true);
});
