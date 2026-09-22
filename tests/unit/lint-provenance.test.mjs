// ============================================================
// Provenance is a reviewed vocabulary, not free text
// ============================================================
// Whether a question counts as a sat paper, and so where Panic Mode puts it,
// is still decided by a regex reading human phrasing in `examOrigin`, and it
// guessed wrong both ways: "Swine Medicine midterm study notes" counted as a paper
// because it says "midterm", while 95 rows naming a recalled paper or a
// senior's exam guidance sat in band 2 because their wording ("บันทึกหลังสอบ",
// "recalled matching section") was not in the pattern, so Panic Mode never
// showed them.
//
// src/data/exam-origins.js files every exact examOrigin string once, by a
// person, as one of four kinds. This file holds that map, and
// scripts/lint-provenance.mjs which enforces it, to the live bank.
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
  checkProvenance,
} from '../../scripts/lint-provenance.mjs';

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

test('a row that is both a sat paper and marked fails unless it was reviewed', () => {
  const both = row({ sourceType: 'past-paper', tags: [MARKER] });
  assert.match(lintOnly([both]).errors.join('\n'), /counted as a sat paper AND marked/);
  assert.deepEqual(lintOnly([both], { reviewedPastAndAligned: [both.id] }).errors, []);
});

test('a paper or exam guidance left in band 2 fails, and the tag clears it', () => {
  const recalled = row({
    sourceType: 'student-compilation',
    examOrigin: 'Swine Medicine ไฟนอล Vet 85 บันทึกหลังสอบ ชุดข้อเขียนที่ 1',
  });
  assert.match(lintOnly([recalled]).errors.join('\n'), /filed as paper but the row is in band 2/);
  assert.deepEqual(lintOnly([{ ...recalled, tags: [MARKER] }]).errors, []);
  const guidance = row({ sourceType: 'student-compilation', examOrigin: 'แนวข้อสอบที่รุ่นพี่ Vet 85 บันทึกไว้ในสรุปสรุป Avian Medicine' });
  assert.match(lintOnly([guidance]).errors.join('\n'), /filed as aligned but the row is in band 2/);
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
  const origins = { 'Poultry midterm study notes (Vet 85)': { kind: 'source-doc' } };
  const notes = row({ sourceType: 'student-compilation', examOrigin: 'Poultry midterm study notes (Vet 85)' });
  assert.match(lintOnly([notes], { origins }).errors.join('\n'), /counted as a sat paper through examOrigin/);
  assert.deepEqual(lintOnly([notes], { origins, knownOverclaims: [notes.id] }).errors, []);
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

test('reading the map for typed rows would lift only band-1 rows, and drop only the known over-claim', () => {
  const { switchPreview } = checkProvenance(rows);
  assert.ok(switchPreview.into.length > 0);
  assert.deepEqual(switchPreview.into.filter((q) => !q.tags?.includes(MARKER)).map((q) => q.id), [],
    'a row the switch would lift does not carry the interim tag');
  assert.deepEqual(switchPreview.outOf.map((q) => q.id), [...KNOWN_ORIGIN_OVERCLAIMS]);
});

test('lint:all runs lint:provenance', () => {
  const { scripts } = JSON.parse(readFileSync(new URL('../../package.json', import.meta.url), 'utf8'));
  assert.equal(scripts['lint:provenance'], 'node scripts/lint-provenance.mjs');
  assert.ok(scripts['lint:all'].split(' && ').includes('npm run lint:provenance'));
});
