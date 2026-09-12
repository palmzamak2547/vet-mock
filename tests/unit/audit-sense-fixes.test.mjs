// Guards for the 2026-09-12 audit fixes.
//
// Two kinds of check here, and the difference matters: the semester lookup and
// the phase scope are exercised for real, because they decide which questions a
// student is served. The rest are source pins on the specific construct that
// was wrong, so a later refactor that reintroduces the defect fails loudly
// rather than passing because the file still "looks right".

import { test } from 'node:test';
import assert from 'node:assert/strict';
import { readFileSync } from 'node:fs';
import { semesterForSubject, SUBJECTS_BY_YEAR } from '../../src/data/curriculum.js';
import { stillWrong } from '../../src/lib/wrong-pool.js';

const src = (p) => readFileSync(new URL('../../' + p, import.meta.url), 'utf8');
const APP = src('src/App.jsx');

test('semesterForSubject answers from the curriculum, and stays quiet about what it cannot know', () => {
  // Real data, not a fixture: pick a subject that the curriculum actually
  // places in a term, and assert the lookup agrees with the table.
  const withSemester = Object.values(SUBJECTS_BY_YEAR)
    .flat()
    .find((s) => s?.id && s.semester === 1);
  assert.ok(withSemester, 'the curriculum must contain at least one term-1 subject');
  assert.equal(semesterForSubject(withSemester.id), 1);

  assert.equal(semesterForSubject('all'), null, "'all' spans years, so it has no term");
  assert.equal(semesterForSubject('no-such-subject-id'), null);
  assert.equal(semesterForSubject(''), null);
  assert.equal(semesterForSubject(undefined), null);
});

test('a year-long subject qualifies in every phase', () => {
  // semester 0 is the curriculum's way of saying "runs across both terms".
  // Excluding those would drop whole courses (VCA) out of every phase.
  const yearLong = Object.values(SUBJECTS_BY_YEAR).flat().filter((s) => s?.semester === 0);
  for (const s of yearLong) assert.equal(semesterForSubject(s.id), 0);
});

test('ordinary practice honours the chosen term, and only the term', () => {
  // Before this, the phase control was read by the curated modes alone, so a
  // "เทอม 1 กลางภาค" set was filtered by YEAR only: a year-4 term-1 midterm
  // probe returned 1,981 questions, 1,633 of them from term 2, with an id list
  // identical to the term-2 final set.
  assert.ok(APP.includes("const PHASE_SEMESTER = { '1-mid': 1, '1-final': 1, '2-mid': 2, '2-final': 2 }"),
    'the phase-to-semester map must exist');
  const pool = APP.slice(APP.indexOf('function buildExamPool'), APP.indexOf('const startMockExam'));
  assert.ok(pool.includes('PHASE_SEMESTER[selectedPhase]'), 'the ordinary pool must read the phase');
  assert.ok(pool.includes('semesterForSubject(q.subject)'), 'scoping is by the subject\'s term');
  assert.ok(pool.includes('sem === 0'), 'a year-long subject must not be filtered out');
  assert.ok(pool.includes("subject === 'all'"),
    'a named subject is the student\'s explicit choice and must not be narrowed away');
  // The curated current-scope/predicted filter lives in this same branch and
  // uses isCurrentScopeQuestion legitimately. What matters is that the phase
  // filter is NOT gated behind it — that gating is exactly what left ordinary
  // practice unscoped — so it must appear before that conditional.
  const phaseAt = pool.indexOf('PHASE_SEMESTER[selectedPhase]');
  const curatedAt = pool.indexOf("practiceMode === 'current-scope'");
  assert.ok(phaseAt > 0 && curatedAt > 0, 'both the phase filter and the curated filter must exist');
  assert.ok(phaseAt < curatedAt,
    'the phase filter must apply to ordinary practice, not only inside the curated modes');
  // And it must not borrow the curated predicate, which demands verified
  // prediction metadata and would empty ordinary practice.
  const phaseBlock = pool.slice(phaseAt, curatedAt);
  assert.ok(!phaseBlock.includes('isCurrentScopeQuestion'));
});

test('the phase screen stops promising midterm-only content', () => {
  const s = src('src/views/PhaseSelectView.jsx');
  // Assert on the rendered field, not the file: the comment above PHASES
  // quotes the old wording on purpose so the reason survives.
  const subs = [...s.matchAll(/sub: '([^']+)'/g)].map((m) => m[1]);
  assert.equal(subs.length, 4, 'all four phases must declare what they scope');
  for (const sub of subs) {
    assert.ok(!sub.includes('ก่อนสอบ'),
      `"${sub}" promises a mid/final scope the question data cannot support`);
  }
  assert.deepEqual(new Set(subs), new Set(['วิชาของเทอม 1', 'วิชาของเทอม 2']));
});

test('the config count and the exam pool are computed by the same builder', () => {
  // If the displayed number came from a separate filter, the phase change
  // would make the count and the delivered set disagree — the exact class of
  // bug this app has been bitten by before.
  const count = APP.slice(APP.indexOf('const configAvailableCount'), APP.indexOf('// startExam accepts'));
  assert.ok(count.includes('buildExamPool({'), 'the count must come from buildExamPool');
  assert.ok(count.includes('selectedPhase'), 'and must be given the phase');
});

test('a question answered wrong then right is no longer wrong', () => {
  // Chronological, oldest first — the shape App stores.
  const { keys, counts } = stillWrong([
    { subject: 'com4', questionId: 1, correct: false },
    { subject: 'com4', questionId: 1, correct: true },   // learnt it
    { subject: 'com4', questionId: 2, correct: true },
    { subject: 'com4', questionId: 2, correct: false },   // lost it again
    { subject: 'com3', questionId: 3, correct: false },
    { subject: 'com3', questionId: 3, correct: false },
  ]);
  assert.ok(!keys.has('com4:1'), 'answered correctly since, so not still wrong');
  assert.ok(keys.has('com4:2'), 'the latest attempt was wrong');
  assert.ok(keys.has('com3:3'));
  assert.equal(keys.size, 2);
  // Ordering still ranks by how often it was ever missed.
  assert.equal(counts.get('com3:3'), 2);
  assert.equal(counts.get('com4:2'), 1);
});

test('the same id in two subjects is tracked separately', () => {
  // Q ids collide across subjects (com4/engprof, com3/exotic), which is why
  // the key is compound; a bare id would leak one subject's verdict into
  // another's pool.
  const { keys } = stillWrong([
    { subject: 'com4', questionId: 7, correct: false },
    { subject: 'exotic', questionId: 7, correct: true },
  ]);
  assert.ok(keys.has('com4:7'));
  assert.ok(!keys.has('exotic:7'));
});

test('every surface that shows "wrong" uses the one definition', () => {
  assert.ok(APP.includes("from './lib/wrong-pool.js'"), 'the pool must import the shared rule');
  assert.ok(APP.includes('stillWrong(history).keys'), 'the weak list must use it too');
  const home = src('src/views/HomeView.jsx');
  assert.ok(home.includes('latestVerdict'), 'the home chip must follow the latest verdict');
  assert.ok(home.includes('.filter(([k]) => latestVerdict.get(k) === true)'),
    'a question since answered correctly must leave the chip as well as the pool');
});

test('the weak-topic list only contains topics that are actually weak', () => {
  assert.ok(APP.includes('const WEAK_TAG_MAX_PCT = 70'), 'the threshold must be named');
  assert.ok(APP.includes('.filter((t) => t.pct < WEAK_TAG_MAX_PCT)'),
    'every tag with two attempts used to qualify, so a 100%-correct topic appeared as weak');
});

test('the shelf says a group is capped instead of rendering nothing', () => {
  const s = src('src/views/LibraryView.jsx');
  assert.ok(!s.includes('if (budget <= 0) return null;'),
    'returning null made an expanded year silently empty when another year used the budget');
  assert.ok(s.includes('Math.max(0, MAX_BROWSE_CARDS - rendered)'));
  assert.ok(s.includes('เพราะเปิดหลายชั้นปีพร้อมกัน'),
    'the starved group must explain itself');
  assert.ok(s.includes('{shown.length > 0 && ('),
    'only the card grid is skipped, so nothing extra is mounted');
});

test('every shelf filter survives a trip through the reader', () => {
  const s = src('src/views/LibraryView.jsx');
  assert.ok(s.includes('function paramOr('), 'filters must be readable back out of the URL');
  for (const key of ["'kind'", "'semester'", "'ay'", "'subject'"]) {
    assert.ok(s.includes(`set(${key},`), `${key} must be mirrored into the URL`);
    assert.ok(s.includes(`paramOr(${key}`), `${key} must be seeded from the URL`);
  }
  assert.ok(s.includes('[debouncedQuery, kind, semester, academicYear, subjectFilter]'),
    'the mirror effect must run when any filter changes');
});

test('account deletion hands getUser the token it was given', () => {
  const fn = src('supabase/functions/delete-account/index.ts');
  assert.ok(fn.includes('auth.getUser(bearer)'),
    'getUser() with no argument looks for a stored session that persistSession:false guarantees is absent');
  assert.ok(fn.includes("authHeader.replace(/^Bearer\\s+/i, '').trim()"));
  assert.ok(!fn.includes('global: { headers: { Authorization: authHeader } },\n    auth:'),
    'the header alone never reached the wire for getUser');
});

test('a refusal from the server is not reported as a lost connection', () => {
  const s = src('src/lib/supabase.js');
  assert.ok(s.includes("table: '__server__'"),
    'a status line is an answer; only a transport failure may claim the connection dropped');
  const acct = src('src/views/AccountSettingsView.jsx');
  assert.ok(acct.includes("e.table === '__network__'"),
    'the network-uncertainty copy must stay reserved for the network case');
});

test('group members are read without a relationship that does not exist', () => {
  const api = src('src/lib/api.js');
  const fn = api.slice(api.indexOf('export async function getGroupMembers'), api.indexOf('// ====', api.indexOf('getGroupMembers')));
  assert.ok(!fn.includes('profiles(id, username, avatar_emoji)'),
    'group_members has no foreign key to profiles, so PostgREST answers 400 PGRST200');
  assert.ok(fn.includes(".from('profiles')") && fn.includes('.in(\'id\', ids)'),
    'the profiles are fetched separately and joined here');
  assert.ok(fn.includes('id: r.user_id'),
    'a member with no profile row is still a member and must not be dropped');
});

test('one failed group section does not blank the other two', () => {
  const s = src('src/views/GroupDetailView.jsx');
  assert.ok(s.includes('Promise.allSettled'), 'Promise.all turned one failure into a whole-tab error');
  assert.ok(s.includes('rejected.length === 3'),
    'the full-tab panel is only honest when nothing loaded');
  assert.ok(s.includes('loadWarning'), 'a partial failure says so while leaving what loaded on screen');
});

test('a shelf document keeps its origin through a merge', async () => {
  const { mergeRecords } = await import('../../src/lib/pdf-annotations.js');
  // The reader merges a local record with whatever the account holds. Dropping
  // the slug here would send the student back to the file picker for a
  // document they only ever opened from the web.
  const local = { hash: 'h1', fileName: 'deck.pdf', slug: 'avian-2-1', strokesByPage: {}, deleted: [], lastOpened: 2 };
  const remote = { hash: 'h1', fileName: 'deck.pdf', strokesByPage: {}, deleted: [], lastOpened: 1 };
  assert.equal(mergeRecords(local, remote).slug, 'avian-2-1');
  assert.equal(mergeRecords(remote, local).slug, 'avian-2-1', 'either side may carry it');
  // A personal file has none, and must not gain one.
  const personal = { hash: 'h2', fileName: 'mine.pdf', strokesByPage: {}, deleted: [], lastOpened: 1 };
  assert.equal(mergeRecords(personal, { ...personal, lastOpened: 2 }).slug, undefined);
});

test('the reader offers the shelf for a shelf document and the picker for a file', () => {
  const s = src('src/views/PdfAnnotateView.jsx');
  const fn = s.slice(s.indexOf('function pickRecent'), s.indexOf('async function removeRecent'));
  assert.ok(fn.includes('entry.slug && onOpenLibrary'), 'a shelf document must route back to the shelf');
  assert.ok(fn.includes('fileInputRef.current?.click()'), 'a personal file still needs its bytes');
  assert.ok(s.includes('slug: doc.slug || null'), 'the origin must be recorded when the document is opened');
});

test('custom clips and watch history are in the restorable bundle', async () => {
  const { LOCAL_EXTRA_FIELDS, parseLocalExtras } = await import('../../src/lib/local-extras.js');
  assert.ok(LOCAL_EXTRA_FIELDS['vmx-custom-videos'], 'clips a student added are their own work');
  assert.ok(LOCAL_EXTRA_FIELDS['vmx-watched-videos'], 'watch history is the only record of what they got through');

  const wrap = (data) => ({ format: 'vetmock-local-extras-v1', data });
  const ok = parseLocalExtras(wrap({
    'vmx-custom-videos': [{ url: 'https://youtu.be/abc', topic: 'Avian 2.1', subject: 'poultry' }],
    'vmx-watched-videos': { abc: { watchedAt: 1_700_000_000_000 } },
  }));
  assert.equal(ok.success, true, ok.reason);

  // A clip with no playable url would restore as a dead card.
  assert.equal(parseLocalExtras(wrap({ 'vmx-custom-videos': [{ topic: 'no url' }] })).success, false);
  // A malformed watch entry would make the "watched" badge lie.
  assert.equal(parseLocalExtras(wrap({ 'vmx-watched-videos': { abc: { watchedAt: 'yesterday' } } })).success, false);
});

test('the video list reads through the bundle a restore actually writes', () => {
  const s = src('src/views/VideoView.jsx');
  assert.ok(s.includes("useLocalExtra('vmx-custom-videos'") && s.includes("useLocalExtra('vmx-watched-videos'"),
    'reading the raw key would ignore a restored bundle entirely');
  assert.ok(s.includes("from '../lib/local-extras.js'"));
});

test('"more questions" excludes the ones just answered', () => {
  const pool = APP.slice(APP.indexOf('function buildExamPool'), APP.indexOf('// The question bank loads lazily'));
  assert.ok(pool.includes('excludeIds = null'), 'the pool builder must accept an exclusion');
  assert.ok(pool.includes('!excludeIds.has(`${q.subject}:${q.id}`)'), 'compound keys: ids collide across subjects');
  const results = src('src/views/ResultsView.jsx');
  assert.ok(results.includes('excludeIds: new Set((questions || []).map('),
    'the continue button must pass the set it just showed');
  assert.ok(APP.includes('ทำครบทุกข้อของส่วนนี้แล้ว'),
    'an exhausted topic must say so rather than silently repeating');
});

test('an incomplete wiki search is reported as incomplete', () => {
  const search = src('src/lib/vetwiki/runtime-search.js');
  assert.ok(search.includes('.catch(() => { failed += 1; return null; })'),
    'one failed chunk must not reject the whole search');
  assert.ok(search.includes("Object.defineProperty(results, 'incompleteSubjects'"),
    'non-enumerable so the array still deep-equals a plain array');
  const view = src('src/views/KnowledgeView.jsx');
  assert.ok(view.includes('searchState.incomplete'), 'the view must surface it');
  assert.ok(view.includes('setRetryNonce'), 'and the retry must actually re-run the search');
  assert.ok(view.includes("sessionStorage.getItem('vmx-wiki-q')"),
    'the stale-deploy reload must not take the query with it');
});

test('the signed-in header cannot overflow onto its own controls', () => {
  const css = src('src/styles.css');
  const mobile = css.slice(css.indexOf('@media (max-width: 600px)'), css.indexOf('@media (max-width: 340px)'));
  assert.ok(mobile.includes('.vmx-header-context { flex: 1 1 auto; gap: 6px; flex-wrap: nowrap; min-width: 0; }'),
    'without min-width:0 a flex item keeps its min-content width and overflows');
  assert.ok(mobile.includes('.vmx-usermenu-name { display: none; }'),
    'the account name was the widest thing in the row');
  assert.ok(mobile.includes('text-overflow: ellipsis'), 'the context pills must truncate');
  const menu = src('src/components/UserMenu.jsx');
  assert.ok(menu.includes('className="vmx-usermenu-name"'));
  assert.ok(menu.includes('aria-label={`บัญชี ${profile.username}`}'),
    'hiding the name visually must not hide it from assistive tech');
});

test('a pin that pushes the board over its cap says what it dropped', () => {
  const lib = src('src/lib/pinboard.js');
  assert.ok(lib.includes('evicted = list.slice(MAX_PINS)') && lib.includes('evicted.length ? { ...pin, evicted } : pin'),
    'the eviction must be reported, not swallowed');
  const btn = src('src/components/PinButton.jsx');
  assert.ok(btn.includes('saved.evicted?.length'), 'and surfaced to the student');
  assert.ok(btn.includes('PINBOARD_MAX'), 'the message must use the real cap');
});
