// ============================================================
// Panic Mode must be able to fill the session it offers
// ============================================================
// The weak-question pool was capped at 25 while Panic Mode offered 50 ("I
// have an hour") and 120 ("tonight"). A student picking the longest option
// got at most 25 questions — fewer once year-scoping ran — and the session
// simply ended early. The same 25 also truncated the weak count on the
// dashboard, so a student with 80 weak questions was told they had 25.
//
// These two numbers live in one file (src/lib/exam-pool.js) and must be read
// together, so the test holds them together rather than restating either.
// App.jsx is still read as text for the handlers that use them.

import test from 'node:test';
import assert from 'node:assert/strict';
import { readFileSync } from 'node:fs';
import { PANIC_SIZE, PANIC_SUBJECT_MAX, WEAK_POOL_CAP } from '../../src/lib/exam-pool.js';

const APP = readFileSync(new URL('../../src/App.jsx', import.meta.url), 'utf8');

function readPanicSizes() {
  assert.ok(PANIC_SIZE && typeof PANIC_SIZE === 'object', 'PANIC_SIZE is gone');
  return Object.values(PANIC_SIZE).map(Number);
}

function readWeakCap() {
  assert.ok(Number.isInteger(WEAK_POOL_CAP), 'WEAK_POOL_CAP is gone — Panic Mode can silently under-deliver again');
  return WEAK_POOL_CAP;
}

test('the weak pool can cover the longest Panic session offered', () => {
  const sizes = readPanicSizes();
  assert.ok(sizes.length >= 3, `expected several Panic sizes, parsed ${sizes.length}`);
  const biggest = Math.max(...sizes);
  const cap = readWeakCap();
  assert.ok(
    cap >= biggest,
    `Panic offers ${biggest} questions but the weak pool holds at most ${cap} — the session ends early`,
  );
});

test('the pool is still capped, so "weak" stays narrower than "wrong"', () => {
  // Removing the cap entirely would make weak == wrong, collapsing two modes
  // the user picks between.
  const cap = readWeakCap();
  assert.ok(cap > 0 && cap <= 1000, `WEAK_POOL_CAP ${cap} is not a meaningful "most missed" list`);
  assert.ok(
    APP.includes('slice(0, WEAK_POOL_CAP)'),
    'the weak list no longer slices to the cap',
  );
});

test('the weak pool is ordered by how often the question was missed', () => {
  // The cap only means "most missed" if the sort survives.
  assert.ok(
    APP.includes('b[1].wrong - a[1].wrong'),
    'weak questions are no longer ranked by wrong-count — the cap would truncate arbitrarily',
  );
});

// ── What Panic Mode draws from ──────────────────────────────────────
// Panic is opened the night before a paper, so what it serves has to be the
// closest thing to one that the bank holds. Three promises the card now makes,
// all three broken in the first build: the tap said only "เริ่มทบทวน" while
// opening a fixed 25-question set, the 25 came from a 30-minute default the
// card never passed, and the set itself was a plain shuffle of the subject.

test('both Panic entries draw from the Panic pool', () => {
  const panics = [...APP.matchAll(/const startPanicSession|const startSubjectPanic/g)];
  assert.equal(panics.length, 2, 'expected the cross-subject and per-subject Panic entries');
  assert.equal([...APP.matchAll(/panicPool: true/g)].length, 2, 'a Panic entry stopped asking for the Panic pool');
  assert.ok(
    APP.includes('if (overrides.panicPool) {'),
    'startExam no longer honours panicPool, so asking for it does nothing',
  );
  assert.match(APP, /ranked = panicPool\(ranked, \(q\) =>/,
    'the Panic pool is no longer told what this student keeps missing');
});

test('a per-subject Panic is not cut to a fixed size', () => {
  const fn = APP.slice(APP.indexOf('const startSubjectPanic'), APP.indexOf('const landingPickSubject'));
  // The default the config screen opens on is still the whole pool. A student
  // may now choose a smaller set on purpose, which is what that screen is for,
  // but nothing hands them a fixed slice without asking.
  assert.match(fn, /setNumQuestions\(PANIC_SUBJECT_MAX\)/, 'the per-subject cram is back on a fixed size');
  assert.doesNotMatch(fn, /PANIC_SIZE/, 'the per-subject cram reads a time preset again');
  const cap = PANIC_SUBJECT_MAX;
  assert.ok(Number.isInteger(cap) && cap >= 500, `PANIC_SUBJECT_MAX ${cap} would truncate the largest subject pool`);
});

test('the card prints the number the session will serve', async () => {
  const { Q_PANIC_COUNTS_BY_SUBJECT } = await import('../../src/data/q-counts.js');
  const view = readFileSync(new URL('../../src/views/TopicSelectView.jsx', import.meta.url), 'utf8');
  assert.match(view, /Q_PANIC_COUNTS_BY_SUBJECT_BY_SCOPE\[panicPaper\]\?\.\[subject\]/,
    'the card must read the count for the paper the student picked');
  assert.match(view, /panicScoped \?\? Q_PANIC_COUNTS_BY_SUBJECT\[subject\] \?\? countFor\('all'\)/,
    'and fall back to the whole subject only when no paper is picked');
  assert.match(view, /questionCount=\{panicCount\}/);
  // The generated counts are what both sides read, so they have to be real.
  assert.ok(Q_PANIC_COUNTS_BY_SUBJECT['milk-meat-hygiene'] > 0, 'the counts index lost its subjects');
});

test('the printed number equals the set, for every subject and both papers', async () => {
  // Palm, 2026-09-16: "จำนวนข้อ Panic mode ตรงแสดงกับกดเข้าไปจริงก็ไม่ตรง". The card
  // printed the whole-subject figure while the session had started narrowing to
  // the paper — One Health promised 10 and opened 3. A string match cannot catch
  // that again, so this recomputes both sides from the live bank.
  const { Q_PANIC_COUNTS_BY_SUBJECT_BY_SCOPE } = await import('../../src/data/q-counts.js');
  const { BANK_REGISTRY } = await import('../../src/data/bank-registry.generated.js');
  const { panicPool } = await import('../../src/lib/question-metadata.js');
  const { questionInScope } = await import('../../src/lib/exam-scope.js');
  const { isQuestionDeliverable } = await import('../../src/data/question-delivery.generated.js');
  const { hiddenTopicIdsFor } = await import('../../src/data/curriculum.js');

  const all = [];
  for (const entry of BANK_REGISTRY) for (const q of await entry.load()) all.push(q);

  for (const paper of ['midterm', 'final']) {
    const table = Q_PANIC_COUNTS_BY_SUBJECT_BY_SCOPE[paper];
    assert.ok(table && Object.keys(table).length, `${paper} panic counts are missing`);
    for (const [subject, printed] of Object.entries(table)) {
      const hidden = hiddenTopicIdsFor(subject);
      const served = panicPool(
        all.filter((q) => q.subject === subject
          && isQuestionDeliverable(q)
          && !hidden.has(q.topic)
          && questionInScope(q, paper)),
        () => 0,
      ).length;
      assert.equal(printed, served,
        `${subject} ${paper}: the card would print ${printed} and the session serve ${served}`);
    }
  }
});

test('the Panic pool is a filter with one honest fallback', async () => {
  const { panicPool } = await import('../../src/lib/question-metadata.js');
  const paper = { id: 1, subject: 's', sourceType: 'past-paper' };
  const aligned = { id: 2, subject: 's', tags: ['topic', 'อิงแนวข้อสอบ'] };
  const ordinary = { id: 3, subject: 's', sourceType: 'student-compilation' };
  assert.deepEqual(panicPool([ordinary, aligned, paper]).map((q) => q.id), [1, 2],
    'an ordinary question reached a cram that is supposed to exclude it');
  // A subject holding neither would otherwise open an empty session.
  assert.deepEqual(panicPool([ordinary]).map((q) => q.id), [3]);
  assert.deepEqual(panicPool([]), []);
});

test('inside a band, what the student keeps missing comes first', async () => {
  const { panicPool } = await import('../../src/lib/question-metadata.js');
  const paper = (id) => ({ id, subject: 's', sourceType: 'past-paper' });
  const missed = { 11: 3, 12: 0, 13: 1 };
  const out = panicPool([paper(12), paper(13), paper(11)], (q) => missed[q.id]);
  assert.deepEqual(out.map((q) => q.id), [11, 13, 12]);
  // Provenance still outranks it: a missed ordinary-band question cannot jump
  // ahead of a past paper.
  const alignedMissed = { id: 20, subject: 's', tags: ['อิงแนวข้อสอบ'] };
  const paperUnseen = paper(21);
  assert.deepEqual(
    panicPool([alignedMissed, paperUnseen], (q) => (q.id === 20 ? 9 : 0)).map((q) => q.id),
    [21, 20],
  );
});

test('ties keep the order they arrived in, so two crams are not identical', async () => {
  const { panicPool } = await import('../../src/lib/question-metadata.js');
  const paper = (id) => ({ id, subject: 's', sourceType: 'past-paper' });
  const given = [paper(5), paper(6), paper(7)];
  assert.deepEqual(panicPool(given).map((q) => q.id), [5, 6, 7]);
  assert.deepEqual(panicPool([...given].reverse()).map((q) => q.id), [7, 6, 5]);
});

test('the mock re-sort cannot undo the Panic order', () => {
  // Panic's whole value is the sequence. The examOrigin re-sort runs right
  // after the pick and orders by id, and most past-paper questions carry
  // examOrigin — so without this guard the cram came back in id order and the
  // priority work was invisible. Caught on the real screen: สุขศาสตร์น้ำนม
  // opened on an อิงแนวข้อสอบ question while 80 past-paper ones waited.
  assert.match(APP, /if \(!overrides\.panicPool && picked\.some\(\(q\) => q\.examOrigin\)\)/,
    'the id re-sort is unguarded again and will flatten the Panic order');
});

// ── Rows written from a senior's compilation have to reach band 1 ────
// Panic serves bands 0 and 1 and nothing else, so a row that answers "no" to
// both predicates is invisible to it. The ingest has to get the band right as
// well as the scope and the provenance, and twice it did not: the aquatic
// midterm opened on 95 questions while 56 recalled from the seniors' own
// midterm notes and TJ sheet sat in band 2, and the zoonoses rows written from
// the Vet 85 midterm summary never appeared at all. The fix is the tag, which
// under-claims: it never makes a row a sat paper.

async function loadYear5Bank() {
  const { BANK_REGISTRY } = await import('../../src/data/bank-registry.generated.js');
  const rows = [];
  for (const entry of BANK_REGISTRY) {
    if (entry.year !== 5) continue;
    for (const q of await entry.load()) rows.push(q);
  }
  return rows;
}

test('a year-5 compilation row that names no paper is in Panic band 1, not band 2', async () => {
  // Year 5 only: those are the papers this cohort sits now. The year-4 legacy
  // banks still hold rows of this shape, and that is a separate decision.
  const { panicRank } = await import('../../src/lib/question-metadata.js');
  const rows = await loadYear5Bank();
  const compiled = rows.filter((q) => q.sourceType === 'student-compilation' && !q.examOrigin);
  assert.ok(compiled.length > 0, 'the year-5 bank lost its compilation rows, so this guard checks nothing');
  const hidden = compiled.filter((q) => panicRank(q) === 2).map((q) => `${q.subject} #${q.id}`);
  assert.deepEqual(hidden, [],
    `${hidden.length} compilation rows would never appear in Panic Mode; tag them อิงแนวข้อสอบ`);
});

// The same fault, found by origin instead of by sourceType: rows whose
// examOrigin says a cohort sat the paper or marked the point, while the
// past-paper regex does not read that wording. The swine rows recalled after
// the seniors' final ("ไฟนอล Vet 85 บันทึกหลังสอบ"), the zoonoses recalled
// sections and the avian points "บันทึกไว้ในสรุปสรุป" were all band 2. Until
// isPastPaperQuestion reads src/data/exam-origins.js, the tag is what brings
// them in, and it never makes one a sat paper.
test('a row whose examOrigin is filed as a paper or as exam guidance is never band 2', async () => {
  const { panicRank, isPastPaperQuestion } = await import('../../src/lib/question-metadata.js');
  const { originEntry } = await import('../../src/data/exam-origins.js');
  const { BANK_REGISTRY } = await import('../../src/data/bank-registry.generated.js');
  const rows = [];
  for (const entry of BANK_REGISTRY) for (const q of await entry.load()) rows.push(q);
  const named = rows.filter((q) => ['paper', 'aligned'].includes(originEntry(q.examOrigin)?.kind));
  assert.ok(named.length > 1000, 'the origin map stopped matching the bank, so this guard checks nothing');
  const hidden = named.filter((q) => panicRank(q) === 2).map((q) => `${q.subject} #${q.id} ${q.examOrigin}`);
  assert.deepEqual(hidden, [],
    `${hidden.length} rows name a paper or exam guidance and never appear in Panic Mode; tag them อิงแนวข้อสอบ`);
  // The tag lifts them to band 1, not to a paper.
  const lifted = named.filter((q) => !isPastPaperQuestion(q));
  assert.ok(lifted.length > 0 && lifted.every((q) => panicRank(q) === 1));
});

test('zoonoses rows written from the Vet 85 midterm summary are band 1 and never a sat paper', async () => {
  const { panicRank, isPastPaperQuestion } = await import('../../src/lib/question-metadata.js');
  const rows = await loadYear5Bank();
  const written = rows.filter((q) => q.subject === 'zoonoses' && /แต่งจากสรุป/.test(String(q.examOrigin || '')));
  assert.ok(written.length > 0, 'no zoonoses row says it was written from the summary any more');
  // The origin reads "mid", which is why sourceType stays lecture-derived: as
  // student-compilation these would all count as papers someone sat.
  assert.deepEqual(written.filter(isPastPaperQuestion).map((q) => q.id), [],
    'a row written from a summary is being counted as a past paper');
  assert.deepEqual(written.filter((q) => panicRank(q) !== 1).map((q) => q.id), [],
    'a zoonoses row written from the midterm summary is outside Panic band 1');
});
