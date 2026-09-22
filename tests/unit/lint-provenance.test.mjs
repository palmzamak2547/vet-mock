// ============================================================
// Provenance is a reviewed vocabulary, not free text
// ============================================================
// Whether a question counts as a sat paper, and so where Panic Mode puts it,
// was decided by a regex reading human phrasing in `examOrigin`. It guessed
// wrong both ways: "Swine Medicine midterm study notes" counted as a paper
// because it says "midterm", while 82 rows recalled after a real paper sat in
// band 2 because their wording ("บันทึกหลังสอบ", "recalled matching section")
// was not in the pattern, so Panic Mode never showed them.
//
// src/data/exam-origins.js files every exact examOrigin string once, by a
// person, as one of four kinds. This file holds that map to the live bank.
// ============================================================

import assert from 'node:assert/strict';
import test from 'node:test';

import { BANK_REGISTRY } from '../../src/data/bank-registry.generated.js';
import {
  EXAM_ORIGINS,
  ORIGIN_KINDS,
  PAPER_KINDS,
  SOURCE_TYPES,
  originEntry,
} from '../../src/data/exam-origins.js';

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
