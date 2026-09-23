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
import { buildExamPool } from '../../src/lib/exam-pool.js';

const src = (p) => readFileSync(new URL('../../' + p, import.meta.url), 'utf8');
const APP = src('src/App.jsx');

// The pool builder on a small fixture bank. Real subject ids, because the
// pool reads each subject's year and term from the curriculum; an unknown
// topic, so each question's own examScope decides its paper.
let fixtureId = 950_000;
const fixture = (subject, extra = {}) => ({
  id: fixtureId++, subject, topic: 'fixture-topic', type: 'mcq', q: 'fixture', options: ['a', 'b'], answer: 0, ...extra,
});
const served = (args) => buildExamPool({ practiceMode: 'all', subject: 'all', topic: null, questionCategory: 'all', ...args })
  .map((q) => q.id);

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
  const term1 = fixture('equine-medicine');
  const term2 = fixture('ruminant-clinical');
  const yearLong = fixture('vca');
  assert.equal(semesterForSubject(term1.subject), 1);
  assert.equal(semesterForSubject(term2.subject), 2);
  assert.equal(semesterForSubject(yearLong.subject), 0);
  const questions = [term1, term2, yearLong];
  // Ordinary practice, not only the curated modes, reads the phase: the
  // gating behind current-scope/predicted is exactly what left it unscoped.
  // None of these carries prediction metadata, so a filter that borrowed the
  // curated predicate would serve nothing at all.
  for (const phase of ['1-mid', '1-final']) {
    assert.deepEqual(new Set(served({ questions, selectedYear: 5, selectedPhase: phase })), new Set([term1.id, yearLong.id]),
      `${phase}: scoping is by the subject's term, and a year-long subject stays`);
  }
  for (const phase of ['2-mid', '2-final']) {
    assert.deepEqual(new Set(served({ questions, selectedYear: 5, selectedPhase: phase })), new Set([term2.id, yearLong.id]));
  }
  assert.deepEqual(served({ questions, subject: term2.subject, selectedYear: 5, selectedPhase: '1-mid' }), [term2.id],
    'a named subject is the student\'s explicit choice and must not be narrowed away');
});

test('the phase screen promises exactly what the pool now delivers', () => {
  const s = src('src/views/PhaseSelectView.jsx');
  // Assert on the rendered field, not the file: the comment above PHASES
  // quotes the old wording on purpose so the reason survives.
  const subs = [...s.matchAll(/sub: '([^']+)'/g)].map((m) => m[1]);
  assert.equal(subs.length, 4, 'all four phases must declare what they scope');
  for (const sub of subs) {
    // "ก่อนสอบกลางภาค" claimed midterm-ONLY content. The pool removes the other
    // paper's content but keeps anything whose paper is still unmapped, so the
    // subtitle says what is excluded, never that what remains is exhaustive.
    assert.ok(!sub.includes('ก่อนสอบ'), `"${sub}" over-promises: it claims only-this-paper content`);
    assert.ok(/ไม่รวมเนื้อหา(กลางภาค|ปลายภาค)/.test(sub),
      `"${sub}" must name the paper it excludes, which is the guarantee buildExamPool keeps`);
  }
  assert.deepEqual(new Set(subs), new Set([
    'วิชาเทอม 1 ไม่รวมเนื้อหาปลายภาค', 'วิชาเทอม 1 ไม่รวมเนื้อหากลางภาค',
    'วิชาเทอม 2 ไม่รวมเนื้อหาปลายภาค', 'วิชาเทอม 2 ไม่รวมเนื้อหากลางภาค',
  ]));
  // ...and the guarantee is real: the pool builder must apply the paper filter.
  const mid = fixture('equine-medicine', { examScope: 'midterm' });
  const fin = fixture('equine-medicine', { examScope: 'final' });
  const unmapped = fixture('zoonoses');
  const questions = [mid, fin, unmapped];
  assert.deepEqual(new Set(served({ questions, selectedYear: 5, selectedPhase: '1-mid' })), new Set([mid.id, unmapped.id]),
    'buildExamPool must filter by the paper, or the subtitle is a lie again');
  assert.deepEqual(new Set(served({ questions, selectedYear: 5, selectedPhase: '1-final' })), new Set([fin.id, unmapped.id]));
});

test('the config count and the exam pool are computed by the same builder', () => {
  // If the displayed number came from a separate filter, the phase change
  // would make the count and the delivered set disagree — the exact class of
  // bug this app has been bitten by before.
  // The count is the length of the pool the config screen is handed.
  const count = APP.slice(APP.indexOf('const configServedPool'), APP.indexOf('// startExam accepts'));
  assert.ok(count.includes('buildExamPool({'), 'the count must come from buildExamPool');
  assert.ok(count.includes('selectedPhase'), 'and must be given the phase');
  assert.ok(count.includes('const configAvailableCount = configServedPool ? configServedPool.length : null;'),
    'and the number on screen must be that pool\'s size');
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
  // The pool: answered wrong and then right is not in the wrong-answer set,
  // and the latest attempt wins by date, not by row order.
  const relearnt = fixture('equine-medicine');
  const lost = fixture('equine-medicine');
  const history = [
    { subject: relearnt.subject, questionId: relearnt.id, correct: true, date: 20 },
    { subject: relearnt.subject, questionId: relearnt.id, correct: false, date: 10 },
    { subject: lost.subject, questionId: lost.id, correct: true, date: 10 },
    { subject: lost.subject, questionId: lost.id, correct: false, date: 20 },
  ];
  assert.deepEqual(served({ questions: [relearnt, lost], practiceMode: 'wrong', history, selectedYear: 5 }), [lost.id],
    'the pool must use the shared rule');
  assert.ok(APP.includes("from './lib/wrong-pool.js'"), 'the weak list must import the shared rule');
  assert.ok(APP.includes('stillWrong(history).keys'), 'the weak list must use it too');
  // The home chip once kept its own copy of the rule and it drifted: it read
  // array order while the pool read the latest attempt by date, so two synced
  // devices saw a count that did not match the set. One function, everywhere.
  const home = src('src/views/HomeView.jsx');
  assert.ok(home.includes("from '../lib/wrong-pool.js'"), 'the home chip must import the shared rule');
  assert.ok(home.includes('stillWrong(history.filter(inYear))'), 'the home chip must count with it, year-scoped');
  assert.ok(!home.includes('latestVerdict'), 'no private copy of the verdict rule may come back');
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
  assert.ok(s.includes('ใช้ช่องค้นหาเพื่อเปิดดูได้เลย'),
    'the starved group must explain itself, and point at something that works');
  assert.ok(!s.includes('เพราะเปิดหลายชั้นปีพร้อมกัน'),
    'one year is open by default and already exceeds the budget on its own, so '
    + 'blaming open years told a student with none open to go and close them');
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
  // Since PF-20 each section fails on its own; group-account-switch.test.mjs drives it.
  assert.ok(s.includes('failed[tab]'), 'a failure replaces only its own section, never every tab');
  assert.ok(s.includes('hiddenFailure'), 'a failure out of sight says so while leaving what loaded on screen');
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
  const answered = fixture('equine-medicine');
  const namesake = { ...fixture('zoonoses'), id: answered.id };
  const fresh = fixture('equine-medicine');
  const questions = [answered, namesake, fresh];
  assert.equal(served({ questions, selectedYear: 5 }).length, 3, 'with no exclusion nothing is left out');
  const pool = buildExamPool({
    questions, practiceMode: 'all', subject: 'all', topic: null, questionCategory: 'all', selectedYear: 5,
    excludeIds: new Set([`${answered.subject}:${answered.id}`]),
  });
  assert.deepEqual(pool.map((q) => `${q.subject}:${q.id}`), [`zoonoses:${answered.id}`, `equine-medicine:${fresh.id}`],
    'compound keys: ids collide across subjects');
  const results = src('src/views/ResultsView.jsx');
  assert.ok(results.includes('excludeIds: new Set((questions || []).map('),
    'the continue button must pass the set it just showed');
  assert.ok(APP.includes('ทำครบทุกข้อของส่วนนี้แล้ว'),
    'an exhausted topic must say so rather than silently repeating');
});

test('an incomplete wiki search is reported as incomplete', () => {
  const search = src('src/lib/vetwiki/runtime-search.js');
  assert.ok(search.includes('.catch(() => { failedSubjects.add(topic.subject); return null; })'),
    'one failed chunk must not reject the whole search');
  assert.ok(search.includes('failedSubjects.size'),
    'indexTopic loads one chunk per SUBJECT and rejects once per article in it, '
    + 'so counting rejections reported more failed subjects than VetWiki has');
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

// ── Second pass, 2026-09-13 ─────────────────────────────────────────────────
// A pre-push review of the first pass found these. Each one is a defect that
// first pass introduced, so each gets a check that fails if it comes back.

test('the phase scope narrows a year, and never empties one', async () => {
  // The real data, not a fixture. Years 1 and 3 carry questions only in
  // subjects the curriculum places in term 2, so a term-1 phase filters every
  // question in those years away — while the year card still advertises them.
  // The guard is the `if (scoped.length)`; without it a student who tapped
  // ปี 1 in September got a year that promised 298 questions and served none.
  const { Q_VISIBLE_COUNTS_BY_SUBJECT: counts } = await import('../../src/data/q-counts.js');
  const inScope = (subjects, phaseSemester) => subjects.reduce((n, s) => {
    const sem = semesterForSubject(s.id);
    const keep = sem == null || sem === 0 || sem === phaseSemester;
    return n + (keep ? (counts[s.id] || 0) : 0);
  }, 0);

  const { scopeOfQuestion } = await import('../../src/lib/exam-scope.js');
  const empties = [];
  for (const [year, subjects] of Object.entries(SUBJECTS_BY_YEAR)) {
    const total = (subjects || []).reduce((n, s) => n + (counts[s.id] || 0), 0);
    if (!total) continue;
    for (const semester of [1, 2]) {
      const scoped = inScope(subjects || [], semester);
      if (scoped === 0) empties.push({ year: Number(year), semester, subjects: subjects.filter((s) => counts[s.id]) });
      // What the engine actually serves, guard included.
      const served = scoped || total;
      assert.ok(served > 0, `year ${year} term ${semester} must serve something`);
      assert.ok(served <= total, `year ${year} term ${semester} must not invent questions`);
    }
  }
  assert.ok(empties.length,
    'if no year is empty in either term the guard is untested — check the data, not this test');
  // The pool builder, on that same year: one question per subject that holds
  // any, each on a topic with no paper of its own so only the term decides.
  for (const { year, semester, subjects } of empties) {
    const questions = subjects.map((s) => fixture(s.id)).filter((q) => scopeOfQuestion(q) == null);
    assert.ok(questions.length, `year ${year} has no subject left to probe the guard with`);
    assert.deepEqual(new Set(served({ questions, selectedYear: year, selectedPhase: `${semester}-mid` })), new Set(questions.map((q) => q.id)),
      `year ${year} term ${semester}: the phase filter must be applied only when it leaves something behind`);
  }
});

test('the latest attempt wins even when the rows arrive out of order', () => {
  // A sync merge keeps the remote rows and appends this device's local-only
  // rows after them whatever their date, so position is not chronology.
  const later = { subject: 'com3', questionId: 742, correct: true, date: 20000 };
  const earlier = { subject: 'com3', questionId: 742, correct: false, date: 9000 };
  const key = 'com3:742';

  assert.ok(!stillWrong([later, earlier]).keys.has(key),
    'a correct answer from 20:00 must survive a wrong row from 09:00 appended after it');
  assert.ok(!stillWrong([earlier, later]).keys.has(key), 'and in the other order');
  assert.ok(stillWrong([{ ...later, correct: false }, { ...earlier, correct: true }]).keys.has(key),
    'the mirror case must keep a genuinely missed question in the pool');

  // Every past miss still counts, for "most missed first" ordering.
  assert.equal(stillWrong([earlier, later, { ...earlier, date: 1000 }]).counts.get(key), 2);

  // Undated legacy rows fall back to array order rather than disappearing.
  const undated = [{ subject: 'com3', questionId: 9, correct: false },
    { subject: 'com3', questionId: 9, correct: true }];
  assert.ok(!stillWrong(undated).keys.has('com3:9'));
  assert.ok(stillWrong([...undated].reverse()).keys.has('com3:9'));
});

test('the results screen reaches one verdict and every part of it agrees', () => {
  const s = src('src/views/ResultsView.jsx');
  // 28/47 = 59.57%, which rounds to 60. The message used the rounded value and
  // the banner used the exact one, so the same screen said both.
  assert.ok(Math.round((28 / 47) * 100) === 60 && (28 / 47) < 0.6,
    'the boundary this guards must still exist');
  assert.ok(s.includes('const reached = score.total > 0 && score.correct / score.total >= PRACTICE_PASS_PCT / 100;'));
  assert.ok(s.includes(': reached ?'), 'the message reads it');
  assert.ok(s.includes('const passed = autoQs.length > 0 && reached;'), 'the banner reads it');
  assert.ok(s.includes("reached ? 'pass' : 'fail'"), 'the colour of the big number reads it');
  assert.ok(!s.includes('score.pct >= PRACTICE_PASS_PCT') && !s.includes('score.pct >= 60'),
    'nothing about the bar may go back to the rounded percentage');
  // The shared card is a second surface that must not contradict the first.
  assert.ok(s.includes('const reached = total > 0 && correct / total >= PRACTICE_PASS_PCT / 100;'),
    'buildScoreCard has the counts, so it can use the same bar');
  assert.ok(!s.includes('else if (pct >= 60)'),
    'and must not caption the share card off the rounded value');
});

test('a stored question id opens the question it names', () => {
  // Notes and pins are keyed by question id inside a localStorage OBJECT, so
  // they come back as strings while every bank id is a number. A === compare
  // matched nothing, downloaded the whole bank to look again, and then sent
  // the student to the bookmarks pool.
  assert.ok(APP.includes('const wanted = String(id);'));
  // ...and the delivery gate applies to a named question too: a pin from
  // before a key was held back must not open what the pool refuses to serve.
  assert.ok(APP.includes('.find((q) => String(q.id) === wanted && isQuestionDeliverable(q))'));
  assert.ok(!APP.includes('.find((q) => q.id === id)'), 'the strict compare must not come back');
  const palette = src('src/components/CommandPalette.jsx');
  assert.ok(palette.includes("alertDialog('ไม่พบข้อนี้ในคลังแล้ว"),
    'and when it genuinely is gone, say so instead of silently opening a different set');
});

test('a view intent is only stashed for a screen that takes it', () => {
  const s = src('src/views/SubjectSelectView.jsx');
  assert.ok(s.includes("rememberViewIntent(readingIntent && hasTopics ? 'notes' : undefined)"),
    'config never calls takeViewIntent, so stashing on that branch orphaned the '
    + 'intent and the next subject card opened on the reading tab');
  const idx = s.indexOf('const hasTopics =');
  assert.ok(idx > 0 && idx < s.indexOf('rememberViewIntent(readingIntent'),
    'hasTopics must be computed before it is used');
});

test('asking for the same wiki article twice still opens it', () => {
  // The reader leaves an article without writing App state, so App still holds
  // it; setting subject/topic to the values they already have changes nothing
  // and the follow-the-props effect never runs.
  assert.ok(APP.includes('setWikiOpenNonce((n) => n + 1);'), 'openWiki must signal every request');
  assert.ok(APP.includes('openNonce: wikiOpenNonce'), 'and pass it down');
  const view = src('src/views/KnowledgeView.jsx');
  assert.ok(view.includes('}, [subject, topic, openNonce]);'), 'the effect must follow it');
});

test('a shelf document reopened from the reader lands on that document', () => {
  const s = src('src/views/PdfAnnotateView.jsx');
  assert.ok(s.includes("replace(/\\.pdf$/i, '')"),
    'the shelf index is built from title/description/subject/topics and never '
    + 'contains ".pdf", so every term had to match and the last one never could');
  assert.ok(s.includes('alertDialog(`"${title}" เป็นเอกสารจากคลัง'),
    'onOpenLibrary unmounts this view in the same batch, so a local toast never painted');
  assert.ok(s.includes('button[aria-label^="ยางลบ"]'),
    'the eraser has no swatch, so Escape from its panel had nothing to focus');
});

test('the display token reaches every heading that asked for it', () => {
  // Fraunces carries no Thai glyphs, so a literal stack renders Thai in the
  // platform generic serif. The landing sheet kept one.
  const landing = src('src/styles-landing.css');
  assert.ok(!/font-family:\s*Fraunces/.test(landing),
    'no literal Fraunces stack may remain in the landing stylesheet');
  assert.ok(src('src/styles.css').includes("--vmx-display: 'Fraunces', 'Sarabun', 'IBM Plex Sans Thai', serif;"),
    'and the token it defers to must still name the Thai faces');
});

test('a summary can never be hidden by its own entrance animation', () => {
  const s = src('src/components/SummaryModal.jsx');
  // The dangerous shape is CSS that hides blocks by default and JS that is
  // supposed to reveal them: anything that stops the observer running leaves a
  // blank modal. So the hiding class is only ever added from inside the
  // effect, after the reduced-motion and IntersectionObserver guards, and is
  // removed again on cleanup.
  const effect = s.slice(s.indexOf('const io = new IntersectionObserver'), s.indexOf('if (!summary) return null;'));
  assert.ok(effect.includes("block.classList.add('vmx-reveal')"),
    'the class must be applied by the same code that observes the block');
  assert.ok(effect.includes("block.classList.remove('vmx-reveal', 'is-in')"),
    'and taken off on cleanup, so an unmount cannot leave text hidden');
  const guardIdx = s.indexOf("if (reduced || typeof IntersectionObserver !== 'function') return undefined;");
  assert.ok(guardIdx > 0 && guardIdx < s.indexOf("block.classList.add('vmx-reveal')"),
    'reduced motion and a missing observer must both return BEFORE anything is hidden');
  const css = src('src/styles.css');
  assert.ok(css.includes('.vmx-summary-body > .vmx-reveal.is-in { opacity: 1; transform: none; }'));
  assert.ok(/@media \(prefers-reduced-motion: reduce\) \{[\s\S]*?\.vmx-summary-body > \.vmx-reveal \{ opacity: 1;/.test(css),
    'the system-level preference must also un-hide, not just the app setting');
});

test('the exam clock is a budget for the paper', () => {
  const hook = src('src/hooks/useExamSession.js');
  // Navigation must not buy more time — that was the whole defect.
  const refills = hook.match(/setTimeLeft\(timeForQuestion\(/g) || [];
  const guarded = hook.match(/if \(!sessionClockRef\.current\) setTimeLeft\(timeForQuestion\(/g) || [];
  assert.equal(refills.length - guarded.length, 2,
    'only the per-question tick and the legacy resume may set a per-question clock unguarded; '
    + 'every navigation path must be behind the session-clock check');
  assert.ok(hook.includes('if (sessionClockRef.current) { onFinish?.(); return; }'),
    'time up on one clock ends the paper rather than advancing with a fresh budget');
  assert.ok(hook.includes("sessionClockRef.current = saved.clock === 'session';"),
    'a resumed exam keeps the clock it started under');
  const app = src('src/App.jsx');
  assert.ok(app.includes("sessionBudget: mode === 'exam',"), 'exam mode opts in');
  // The record names the clock the session is ACTUALLY on. Deriving it from
  // `mode` state disagreed with the session when a Panic set started from the
  // exam-mode config screen (setMode then startExam in one handler).
  assert.ok(app.includes("clock: session.clockKind(),"),
    'and the in-flight record says which clock, so a deploy cannot change the rules mid-exam');
  assert.ok(hook.includes("clockKind: () => (sessionClockRef.current ? 'session' : 'per-question'),"),
    'the hook reports the clock it runs on');
  assert.ok(app.includes("session.startNewSession(picked, firstTime, { sessionBudget: _mode === 'exam' });"),
    'a new set names its clock instead of trusting the closure');
});

test('the home screen folds its two coaching surfaces into one row', () => {
  const home = src('src/views/HomeView.jsx');
  const details = home.indexOf('<details className="vmx-home-extras">');
  assert.ok(details > 0, 'quests and the daily goal share one disclosure');
  assert.ok(home.indexOf('<QuestsPanel') > details && home.indexOf('<DailyGoalCard') > details,
    'both live inside it');
  assert.ok(home.includes('{(!isScaffoldYear || history.length > 0) && ('),
    'and the whole row disappears when it would be empty rather than opening onto nothing');
  const css = src('src/styles.css');
  assert.ok(/\.vmx-home-extras > summary \{[\s\S]*?min-height: var\(--touch-min\);/.test(css),
    'the summary is a touch target');
});

// ── Panic cards, 2026-09-13 ────────────────────────────────────────────────

test('every panic card names a real subject and agrees with its course code', async () => {
  const { PANIC_CARDS, PANIC_CARD_SCOPE, PANIC_CARDS_NOT_EXAMINED } =
    await import('../../src/data/panic-cards.js');
  const inScope = (SUBJECTS_BY_YEAR[PANIC_CARD_SCOPE.year] || [])
    .filter((s) => s.semester === PANIC_CARD_SCOPE.semester);
  const byId = new Map(inScope.map((s) => [s.id, s]));

  // The code is printed on the artwork AND stored in the curriculum. Two
  // copies of one fact drift; a student reads both.
  for (const [id, card] of Object.entries(PANIC_CARDS)) {
    const subject = byId.get(id);
    assert.ok(subject, `${id} must be a subject taught in the card's own term`);
    assert.equal(String(card.code), String(subject.code),
      `${id}: the card says ${card.code}, the curriculum says ${subject.code}`);
    assert.match(card.paper, /^#[0-9a-f]{6}$/i);
    assert.match(card.ink, /^#[0-9a-f]{6}$/i);
    assert.ok(card.en && card.th, `${id} needs both titles for its accessible name`);
  }

  // A subject is either carded or deliberately not examined. Nothing may be
  // simply absent, which is how a subject quietly loses its card.
  const excused = new Set(PANIC_CARDS_NOT_EXAMINED);
  for (const s of inScope) {
    assert.ok(PANIC_CARDS[s.id] || excused.has(s.id),
      `${s.id} is taught this term with neither a card nor a place on the not-examined list`);
  }
  for (const id of excused) {
    assert.ok(!PANIC_CARDS[id], `${id} cannot be both carded and not examined`);
    assert.ok(byId.has(id), `${id} is marked not-examined but is not taught this term`);
  }
});

test('the panic artwork each card points at is actually in the repo', async () => {
  const { PANIC_CARDS } = await import('../../src/data/panic-cards.js');
  for (const [id, card] of Object.entries(PANIC_CARDS)) {
    const p = new URL('../../public' + card.art, import.meta.url);
    assert.ok(readFileSync(p).length > 1000, `${id}: ${card.art} is missing or empty`);
  }
});

test('a panic session is scoped to its own subject', () => {
  // The cross-subject cram already existed; the card's whole point is that it
  // does NOT hand a student revising one paper questions from another.
  // No time argument: the per-subject cram serves everything the Panic pool
  // holds for that subject rather than a slice sized by a time preset.
  assert.ok(APP.includes('const startSubjectPanic = (subjectId) =>'));
  const fn = APP.slice(APP.indexOf('const startSubjectPanic'), APP.indexOf('// Pick a real subject from the landing'));
  // Panic now opens the config screen so the student can choose the count and
  // the reveal, which Palm asked for, so the subject is set on the app rather
  // than passed inline. The guarantee is unchanged: this subject, never the
  // cross-subject pool, and the panic ranking still armed.
  assert.ok(fn.includes('setSubject(subjectId)'), 'the pool must be built for that subject');
  assert.ok(fn.includes('setPanicPending(true)'), 'the panic pool must still be armed');
  assert.ok(/setView\('config'\)/.test(fn), 'and the student must reach the controls');
  assert.ok(!fn.includes("subject: 'all'"), 'never the cross-subject pool');
  assert.ok(fn.includes('if (!subjectId) return;'), 'no subject means no session, not an all-subject one');
  assert.ok(APP.includes('onStartPanic: startSubjectPanic'), 'and the subject screen is wired to it');
});

test('the card shows only for the exam it was drawn for', () => {
  const view = src('src/views/TopicSelectView.jsx');
  assert.ok(view.includes('Number(selectedYear) === PANIC_CARD_SCOPE.year'));
  assert.ok(view.includes('selectedPhase === PANIC_CARD_SCOPE.phase'));
  assert.ok(view.includes('panicCardFor(subject)'),
    'a subject with no card must not render an empty slot');
  // Placement: before the tabs, or it is not the first thing on the screen.
  assert.ok(view.indexOf('vmx-panic-card-slot') < view.indexOf('className="vmx-section-tabs"'),
    'the card belongs above the tabs');
});

test('the panic card is one control, and its motion cannot run away', () => {
  const c = src('src/components/PanicCard.jsx');
  // ONE button. The design kit is explicit that "เริ่มทบทวน →" is drawn
  // inside the single button rather than being a control of its own —
  // a button inside a button is invalid and unreachable by keyboard.
  assert.equal((c.match(/<button/g) || []).length, 1, 'exactly one button');
  assert.ok(!/<a\s/.test(c), 'and no link nested inside it');
  assert.ok(c.includes('aria-label={`Panic Mode'), 'the button announces the subject');
  // The artwork carries no words now, so it is purely decorative.
  assert.ok((c.match(/aria-hidden="true"/g) || []).length >= 3,
    'art layers, scrim and arrow are decorative');

  // Motion: once, then still, and never against the reader's wishes.
  assert.ok(c.includes('const PLAY_MS = 3400;'), 'a cycle is bounded');
  assert.ok(c.includes("matchMedia('(prefers-reduced-motion: reduce)')"));
  assert.ok(c.includes("document.addEventListener('visibilitychange'"),
    'a hidden tab must not animate');
  assert.ok(c.includes('if (reduced.current || document.hidden) return;'),
    'both guards run before anything starts');
  assert.ok(c.includes('clearTimeout(timer.current)'), 'and the timer is always cleared');

  const css = src('src/styles.css');
  assert.ok(/\.vmx-panic-card:focus-visible \{ outline: 3px solid/.test(css), 'keyboard focus visible');
  // Only the picture moves. If the type or the CTA ever animates, the card
  // stops being a place to read and starts being a distraction.
  const playing = css.match(/\.vmx-panic-card\.is-playing [^{]+\{[^}]*animation[^}]*\}/g) || [];
  assert.ok(playing.length >= 4, 'per-subject motion is wired');
  for (const rule of playing) {
    assert.ok(/vmx-panic-art|vmx-panic-ripple/.test(rule),
      `only the art layers may animate, found: ${rule.slice(0, 60)}`);
  }
  assert.ok(css.includes('animation: none !important'), 'reduced motion stops all of it');
  // Square drawings must never be cropped to fill.
  assert.ok(/\.vmx-panic-art \{[\s\S]*?background-size: contain;/.test(css),
    'contain, not cover — cover cuts the chicken head off');
});

test('the panic card sits in the topic grid, not above it', () => {
  const view = src('src/views/TopicSelectView.jsx');
  const grid = view.indexOf('className="vmx-topic-grid"');
  const card = view.indexOf('<PanicCard');
  // Match the rendered title, not the word wherever it appears — it is also
  // in the comment above the card, which put this assertion the wrong way
  // round the first time.
  const allTopics = view.indexOf('<div className="title">รวมทุกหัวข้อ</div>');
  assert.ok(grid > 0 && card > grid, 'the card is inside the grid');
  assert.ok(card < allTopics, 'and comes before รวมทุกหัวข้อ');
  assert.ok(!view.includes('vmx-panic-card-slot'),
    'the full-width poster wrapper is gone — the kit rules it out explicitly');
});
