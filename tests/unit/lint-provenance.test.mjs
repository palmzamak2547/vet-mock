// ============================================================
// Provenance is a reviewed vocabulary, not free text
// ============================================================
// Whether a question counts as a sat paper, and so where Panic Mode puts it,
// was decided by a regex reading human phrasing in `examOrigin`, and it
// guessed wrong both ways: "Swine Medicine midterm study notes" counted as a paper
// because it says "midterm", while 95 rows naming a recalled paper or a
// senior's exam guidance sat in band 2 because their wording ("บันทึกหลังสอบ",
// "recalled matching section") was not in the pattern, so Panic Mode never
// showed them.
//
// src/data/exam-origins.js files every exact examOrigin string once, by a
// person, as one of four kinds, and since 2026-10-28 that entry, not the
// wording, decides every row that carries a sourceType. This file holds that
// map, and scripts/lint-provenance.mjs which enforces it, to the live bank.
// ============================================================

import assert from 'node:assert/strict';
import test from 'node:test';
import { readFileSync } from 'node:fs';

import { BANK_REGISTRY } from '../../src/data/bank-registry.generated.js';
import {
  EXAM_ORIGINS,
  ORIGIN_KINDS,
  PAPER_KINDS,
  SOURCE_TYPES,
  originEntry,
} from '../../src/data/exam-origins.js';
import {
  BUDGETS,
  KNOWN_ORIGIN_OVERCLAIMS,
  KNOWN_SHORT_SPELLING,
  REVIEWED_MAP_ONLY_PAPERS,
  checkProvenance,
} from '../../scripts/lint-provenance.mjs';
import { isPastPaperQuestion } from '../../src/lib/question-metadata.js';

const rows = [];
for (const entry of BANK_REGISTRY) for (const q of await entry.load()) rows.push(q);

test('every examOrigin in the bank has been read and filed', () => {
  const live = [...new Set(rows.map((q) => q.examOrigin).filter(Boolean).map(String))];
  assert.ok(live.length > 100, `only ${live.length} origins found, so the bank did not load`);
  const unfiled = live.filter((origin) => !originEntry(origin));
  assert.deepEqual(unfiled, [], 'file each new examOrigin in src/data/exam-origins.js');
});

test('every filed origin names one kind, and only a paper carries a cohort and a paper', () => {
  for (const [origin, entry] of Object.entries(EXAM_ORIGINS)) {
    assert.ok(ORIGIN_KINDS.includes(entry.kind), `${origin}: kind ${entry.kind}`);
    if (entry.kind !== 'paper') {
      assert.equal(entry.cohort, undefined, `${origin}: only a paper has a cohort`);
      assert.equal(entry.paper, undefined, `${origin}: only a paper has a paper kind`);
      continue;
    }
    const cohorts = entry.cohort === null ? [] : [].concat(entry.cohort);
    for (const c of cohorts) assert.ok(Number.isInteger(c) && c >= 70 && c <= 99, `${origin}: cohort ${c}`);
    assert.ok(entry.paper === null || PAPER_KINDS.includes(entry.paper), `${origin}: paper ${entry.paper}`);
  }
});

test('an origin that is not filed is not guessed at', () => {
  assert.equal(originEntry('Swine Medicine midterm study notes, author-added lesion list (Vet 85)').kind, 'source-doc');
  assert.equal(originEntry('Swine Medicine ไฟนอล Vet 85 บันทึกหลังสอบ ชุดข้อเขียนที่ 1').kind, 'paper');
  assert.equal(originEntry('อิงแนวข้อสอบ').kind, 'aligned');
  assert.equal(originEntry('Mock 1 Part I').kind, 'mock');
  assert.equal(originEntry('Vet 99 Final, never filed'), null);
  assert.equal(originEntry(undefined), null);
  assert.equal(originEntry(''), null);
});

test('every sourceType in the bank is one of the documented values', () => {
  const live = [...new Set(rows.map((q) => q.sourceType).filter((v) => v !== undefined))];
  assert.deepEqual(live.filter((v) => !Object.hasOwn(SOURCE_TYPES, v)), []);
});

// ── lint:provenance ───────────────────────────────────────────────
// The map above is only worth something if a row cannot drift away from it.

const MARKER = 'อิงแนวข้อสอบ';
let nextId = 993000;
const row = (extra) => ({ id: nextId++, subject: 'fixture', topic: 't', type: 'mcq', tags: [], ...extra });
// Checks fixture rows alone, with budgets that fixtures cannot reach.
const lintOnly = (list, options = {}) => checkProvenance(list, {
  budgets: { noSourceType: 1e6, pastPaperWithoutOrigin: 1e6 },
  ...options,
});

test('the live bank passes lint:provenance', () => {
  const { errors, counts } = checkProvenance(rows);
  assert.deepEqual(errors, []);
  assert.equal(counts.rows, rows.length);
});

test('an examOrigin nobody filed fails', () => {
  const { errors } = lintOnly([row({ sourceType: 'student-compilation', examOrigin: 'Swine Medicine final recall (Vet 86)' })]);
  assert.equal(errors.length, 1);
  assert.match(errors[0], /not filed in src\/data\/exam-origins\.js/);
});

test('a new sourceType value fails', () => {
  const { errors } = lintOnly([row({ sourceType: 'senior-notes' })]);
  assert.match(errors.join('\n'), /sourceType "senior-notes" is not one of/);
});

test('a malformed origin map entry fails the lint, not only this file', () => {
  const origins = {
    'Swine Medicine final recall (Vet 86)': { kind: 'recall' },
    'Swine Medicine study notes (Vet 86)': { kind: 'source-doc', cohort: 86 },
    'Swine Medicine midterm recall (Vet 86)': { kind: 'paper', cohort: 'Vet 86', paper: 'mid' },
  };
  const text = lintOnly([], { origins }).errors.join('\n');
  assert.match(text, /kind recall is not one of/);
  assert.match(text, /only a paper carries cohort and paper/);
  assert.match(text, /cohort "Vet 86" is not a cohort number/);
  assert.match(text, /paper "mid" is not one of/);
});

test('a row that is both a sat paper and marked fails unless it was reviewed', () => {
  const both = row({ sourceType: 'past-paper', tags: [MARKER] });
  assert.match(lintOnly([both]).errors.join('\n'), /counted as a sat paper AND marked/);
  assert.deepEqual(lintOnly([both], { reviewedPastAndAligned: [both.id] }).errors, []);
});

test('a paper or exam guidance left in band 2 fails: guidance needs the tag, an untyped paper a sourceType', () => {
  const origin = 'Swine Medicine ไฟนอล Vet 85 บันทึกหลังสอบ ชุดข้อเขียนที่ 1';
  // Typed, the filed entry decides: a sat paper, band 0, no tag needed.
  const recalled = row({ sourceType: 'student-compilation', examOrigin: origin });
  assert.equal(isPastPaperQuestion(recalled), true);
  assert.deepEqual(lintOnly([recalled]).errors, []);
  // With no sourceType the regex still decides, and it cannot read "ไฟนอล".
  const untyped = row({ examOrigin: origin });
  assert.match(lintOnly([untyped]).errors.join('\n'), /filed as paper but the row is in band 2.*give it a sourceType/);
  const guidance = row({ sourceType: 'student-compilation', examOrigin: 'แนวข้อสอบที่รุ่นพี่ Vet 85 บันทึกไว้ในสรุปสรุป Avian Medicine' });
  assert.match(lintOnly([guidance]).errors.join('\n'), /filed as aligned but the row is in band 2.*tag it/);
  assert.deepEqual(lintOnly([{ ...guidance, tags: [MARKER] }]).errors, []);
});

test('the short spelling alone fails, because band 1 cannot read it', () => {
  const short = row({ sourceType: 'student-compilation', verified: 'อิงแนวสอบ Vet 86, TJ p1' });
  assert.match(lintOnly([short]).errors.join('\n'), /carries "อิงแนวสอบ" but not "อิงแนวข้อสอบ"/);
  assert.deepEqual(lintOnly([short], { knownShortSpelling: [short.id] }).errors, []);
  // Next to the full marker the short spelling is harmless.
  assert.deepEqual(lintOnly([{ ...short, tags: [MARKER] }]).errors, []);
});

test('an exam-aligned row without the marker fails', () => {
  assert.match(lintOnly([row({ sourceType: 'exam-aligned' })]).errors.join('\n'), /exam-aligned without/);
  assert.deepEqual(lintOnly([row({ sourceType: 'exam-aligned', tags: [MARKER] })]).errors, []);
});

test('a row counted as a paper through an origin filed as something else fails', () => {
  // "summary", not "study notes": the predicate no longer reads study notes as
  // a paper (next test), so this fixture has to be a wording the regex still
  // misreads, or it would prove nothing about rule 8. Untyped, because a typed
  // row is decided by its filed origin and rule 11 holds it there.
  const origins = { 'Poultry midterm summary (Vet 85)': { kind: 'source-doc' } };
  const notes = row({ examOrigin: 'Poultry midterm summary (Vet 85)' });
  assert.match(lintOnly([notes], { origins }).errors.join('\n'), /counted as a sat paper through examOrigin/);
  assert.deepEqual(lintOnly([notes], { origins, knownOverclaims: [notes.id] }).errors, []);
});

test('study notes and lecture slides are documents, never a sat paper, whatever paper they name', () => {
  // Row 105636: "Swine Medicine midterm study notes, author-added lesion list
  // (Vet 85)" counted as a paper because it says "midterm", and the swine
  // wrap-up listed it among ข้อสอบเก่า. The word that names the DOCUMENT wins
  // over the word that names the paper the document was written for.
  for (const examOrigin of [
    'Swine Medicine midterm study notes, author-added lesion list (Vet 85)',
    'Poultry final study notes (Vet 85)',
    'Avian Medicine midterm lecture slides (Vet 85 notes)',
  ]) {
    assert.equal(isPastPaperQuestion(row({ sourceType: 'student-compilation', examOrigin })), false, examOrigin);
    assert.equal(isPastPaperQuestion(row({ examOrigin })), false, `${examOrigin} (untyped row)`);
  }
  // ...and a recall of a paper still is one.
  assert.equal(isPastPaperQuestion(row({ sourceType: 'student-compilation', examOrigin: 'Swine Medicine Vet 85 midterm recall' })), true);
});

test('no row needs an exception any more: the known-overclaim and short-spelling lists are empty and stay empty', () => {
  // Both lists existed to let the lint pass while the data was wrong. The data
  // is now right; a new exception is a new wrong row, and the fix is the row.
  assert.deepEqual([...KNOWN_ORIGIN_OVERCLAIMS], []);
  assert.deepEqual([...KNOWN_SHORT_SPELLING], []);
});

test('the academic-safety rewrite table writes the spelling band 1 can read', () => {
  // scripts/lint-academic-safety.mjs --apply rewrote "ออกตามนี้" to "อิงแนวสอบ …",
  // the short spelling isExamAlignedQuestion does not read, so every row it
  // touched left Panic Mode. Rows 4046, 5000 and 5066 carried only that.
  const script = readFileSync(new URL('../../scripts/lint-academic-safety.mjs', import.meta.url), 'utf8');
  assert.doesNotMatch(script, /อิงแนวสอบ/, 'a replacement or advice string still writes the short spelling');
  assert.match(script, /อิงแนวข้อสอบ/);
});

test('the budgets may only fall', () => {
  const untyped = [row({}), row({})];
  const over = checkProvenance(untyped, { budgets: { noSourceType: 1, pastPaperWithoutOrigin: 0 } });
  assert.match(over.errors.join('\n'), /noSourceType: 2 rows, over the budget of 1/);
  const under = checkProvenance(untyped, { budgets: { noSourceType: 5, pastPaperWithoutOrigin: 0 } });
  assert.deepEqual(under.errors, []);
  assert.match(under.warnings.join('\n'), /lower BUDGETS\.noSourceType to 2/);
  assert.ok(BUDGETS.noSourceType > 0 && BUDGETS.pastPaperWithoutOrigin > 0);
});

test('a compilation row sat a paper exactly when its origin is filed as one, and the lint fails if that stops', () => {
  const typed = rows.filter((q) => q.sourceType === 'student-compilation' && originEntry(q.examOrigin));
  assert.ok(typed.length > 500, `only ${typed.length} compilation rows with a filed origin, so the bank did not load`);
  assert.deepEqual(typed.filter((q) => isPastPaperQuestion(q) !== (originEntry(q.examOrigin).kind === 'paper')).map((q) => q.id), []);
  // The rows the switch lifted on 2026-10-28: the Vet 85 swine final recall
  // reads "ไฟนอล", which no pattern matched. Band 0 now, and the interim tag
  // that held them in band 1 is gone, or each would be paper AND aligned.
  const swineFinal = rows.filter((q) => String(q.examOrigin || '').startsWith('Swine Medicine ไฟนอล Vet 85 บันทึกหลังสอบ'));
  assert.equal(swineFinal.length, 22);
  assert.deepEqual(swineFinal.filter((q) => !isPastPaperQuestion(q) || q.tags?.includes(MARKER)).map((q) => q.id), []);
  // Rule 11 is what notices a predicate that went back to the wording: here
  // the lint's map files an origin as a paper that isPastPaperQuestion has
  // never seen, so the two disagree.
  const origin = 'Swine Medicine ไฟนอล Vet 99 บันทึกหลังสอบ';
  const stale = row({ sourceType: 'student-compilation', examOrigin: origin, tags: [MARKER] });
  const origins = { [origin]: { kind: 'paper', cohort: 99, paper: 'final' } };
  assert.match(lintOnly([stale], { origins }).errors.join('\n'), /stopped reading src\/data\/exam-origins\.js/);
});

test('lint:all runs lint:provenance (through lint:data)', () => {
  const { scripts } = JSON.parse(readFileSync(new URL('../../package.json', import.meta.url), 'utf8'));
  assert.equal(scripts['lint:provenance'], 'node scripts/lint-provenance.mjs');
  assert.ok(scripts['lint:all'].split(' && ').includes('npm run lint:data'));
  assert.ok(scripts['lint:data'].split(' && ').includes('npm run lint:provenance'));
});

test('a row written FROM material is never a sat paper, whatever paper its origin names', () => {
  // The map may file an origin as a paper because the item it was written from
  // was sat. A row re-typed exam-aligned (the avian rewrites of sat items the
  // bank already holds as past papers) or written from slides stays off band 0.
  const origin = 'Swine Medicine ไฟนอล Vet 85 บันทึกหลังสอบ ชุดข้อเขียนที่ 1';
  for (const sourceType of ['exam-aligned', 'lecture', 'practice', 'lecture-verified-draft', 'lecture-derived']) {
    assert.equal(isPastPaperQuestion(row({ sourceType, examOrigin: origin })), false, sourceType);
  }
  assert.equal(isPastPaperQuestion(row({ sourceType: 'student-compilation', examOrigin: origin })), true);
  for (const id of [105856, 105858, 105860]) {
    const q = rows.find((r) => r.id === id);
    assert.equal(q.sourceType, 'exam-aligned', `#${id}`);
    assert.equal(isPastPaperQuestion(q), false, `#${id} is a rewrite of a sat item the bank already holds`);
  }
});

test('rule 12: a paper origin its wording does not show needs a review, and a reviewed one passes', () => {
  const origin = 'Avian Medicine ข้อสอบที่จำมาได้ Vet 99';
  const origins = { [origin]: { kind: 'paper', cohort: 99, paper: null } };
  const recalled = row({ sourceType: 'student-compilation', examOrigin: origin });
  // isPastPaperQuestion reads the real map, which has never heard of this
  // origin, so rule 11 fires too; rule 12 is the one that names the review.
  assert.match(lintOnly([recalled], { origins }).errors.join('\n'), /REVIEWED_MAP_ONLY_PAPERS/);
  assert.doesNotMatch(lintOnly([recalled], { origins, reviewedMapOnly: [origin] }).errors.join('\n'), /REVIEWED_MAP_ONLY_PAPERS/);
  // A wording that already says "final" is no map-only decision.
  const said = 'Avian Medicine final recall Vet 99';
  assert.doesNotMatch(lintOnly([row({ sourceType: 'student-compilation', examOrigin: said })], { origins: { [said]: { kind: 'paper', cohort: 99, paper: 'final' } } }).errors.join('\n'), /REVIEWED_MAP_ONLY_PAPERS/);
  // Every reviewed origin is still filed as a paper and still unreadable by the wording.
  for (const o of REVIEWED_MAP_ONLY_PAPERS) assert.equal(originEntry(o)?.kind, 'paper', o);
});
