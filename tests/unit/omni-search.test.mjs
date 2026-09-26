// ============================================================
// omni-search — intent detection + async-source entry mappers
// ============================================================
// The intent layer is the part of the AI search that ANSWERS instead of
// listing, so every claim it can make is pinned here against the real
// drug database and the real curriculum: a wrong parse would put a wrong
// number in front of a student holding a syringe.

import test from 'node:test';
import assert from 'node:assert/strict';

import { detectDoseIntent, detectCourseIntent, detectIntents } from '../../src/lib/omni-intents.js';
import { libraryDocEntry, drugEntry } from '../../src/lib/omni-sources.js';
import { VET_DRUGS } from '../../src/data/vet-drug-database.js';

test('drug + weight + species parses into a computed dose', () => {
  const it = detectDoseIntent('ketamine 12 kg แมว');
  assert.equal(it?.kind, 'dose');
  assert.equal(it.drug.generic.toLowerCase(), 'ketamine');
  assert.equal(it.weightKg, 12);
  assert.equal(it.species, 'cat');
  // total = per-kg range × weight, computed by the same drugDose() the
  // calculator uses — the card can never disagree with the calculator.
  assert.equal(it.dose.lo, it.drug.doseLo * 12);
  assert.equal(it.dose.hi, it.drug.doseHi * 12);
});

test('Thai weight units and Thai species words parse', () => {
  const it = detectDoseIntent('dexmedetomidine หมา 3.5 กก');
  assert.equal(it?.kind, 'dose');
  assert.equal(it.weightKg, 3.5);
  assert.equal(it.species, 'dog');
});

test('a drug name alone still answers with the per-kg range', () => {
  const it = detectDoseIntent('enrofloxacin');
  assert.equal(it?.kind, 'dose');
  assert.equal(it.weightKg, null);
  assert.equal(it.dose.lo, null); // no weight → no total, no guess
});

test('the longest drug-name match wins over an embedded shorter one', () => {
  // Every generic that contains another generic as a substring must
  // resolve to itself — scan the whole DB rather than trusting one pair.
  const names = VET_DRUGS.map((d) => d.generic.toLowerCase());
  for (const n of names) {
    const hit = detectDoseIntent(n);
    assert.equal(hit?.drug.generic.toLowerCase(), n, `query "${n}" resolved to ${hit?.drug.generic}`);
  }
});

test('no drug in the query → no dose card, not a wrong one', () => {
  assert.equal(detectDoseIntent('anatomy ปี 1'), null);
  assert.equal(detectDoseIntent('12 kg'), null);
});

test('a 7-digit course number answers with the curriculum subject', () => {
  const it = detectCourseIntent('3104306');
  assert.equal(it?.kind, 'course');
  assert.equal(it.meta.id, 'vet-pharm-1');
  // and embedded in a sentence
  assert.equal(detectCourseIntent('เอกสาร 3104306 อยู่ไหน')?.meta.id, 'vet-pharm-1');
});

test('gen-ed course numbers resolve through library-courses', () => {
  const it = detectCourseIntent('5100101');
  assert.equal(it?.meta.name, 'Population and Development');
});

test('an unknown 7-digit number is not a course card', () => {
  assert.equal(detectCourseIntent('9999999'), null);
});

test('detectIntents can answer with both a dose and a course', () => {
  const kinds = detectIntents('ketamine 3104306').map((i) => i.kind).sort();
  assert.deepEqual(kinds, ['course', 'dose']);
});

test('library doc entries carry the subject name for search and display', () => {
  const e = libraryDocEntry({
    title: 'Handout of Cardiogenesis', subject: 'vet-dev-anat', year: 1,
    description: 'การเกิดหัวใจ', byte_size: 1048576, slug: 'x', sha256_16: 'y',
  });
  assert.equal(e.type, 'library-doc');
  assert.ok(e.hint.includes('ปี 1'));
  assert.ok(e._hayLc.includes('cardiogenesis'));
  assert.ok(e._hayLc.length > e._labelLc.length, 'haystack must include subject keywords');
});

test('drug entries are searchable by brand and category', () => {
  const d = VET_DRUGS.find((x) => x.brand);
  const e = drugEntry(d);
  const firstBrand = String(d.brand).split(',')[0].trim().toLowerCase();
  assert.ok(e._hayLc.includes(firstBrand));
});

// B74: a species the drug database does not list the drug for must never get
// a per-animal total. "carprofen แมว 4 kg" used to answer with a green
// "8–17.6 mg รวม" for a cat, under a note that says DO NOT USE IN CATS. The
// calculator's Drug DB tab hides these drugs when the other species is picked;
// the palette card now agrees with it.
test('a single-species drug queried with the other species answers with no dose', () => {
  const single = VET_DRUGS.filter((d) => d.species !== 'both');
  assert.ok(single.length > 0);
  for (const d of single) {
    const other = d.species === 'dog' ? 'แมว' : 'สุนัข';
    const it = detectDoseIntent(`${d.generic.toLowerCase()} ${other} 4 kg`);
    assert.equal(it?.kind, 'dose', d.generic);
    assert.equal(it.drug, d);
    assert.equal(it.speciesMismatch, true, `${d.generic} [${d.species}] queried for ${other}`);
    assert.equal(it.dose, null, `${d.generic} still computed a total for ${other}`);
    assert.equal(it.perKg, null, `${d.generic} still offered a range for ${other}`);
  }
});

test('a single-species drug queried with its own species (or none) still computes', () => {
  const carprofen = detectDoseIntent('carprofen สุนัข 4 kg');
  assert.equal(carprofen.speciesMismatch, false);
  assert.equal(carprofen.dose.lo, carprofen.drug.doseLo * 4);
  const bare = detectDoseIntent('carprofen 4 kg');
  assert.equal(bare.species, 'dog');
  assert.equal(bare.speciesMismatch, false);
  assert.ok(bare.dose.lo != null);
  // a both-species drug is never a mismatch
  assert.equal(detectDoseIntent('ketamine 12 kg แมว').speciesMismatch, false);
});

test('the palette dose card renders no range, total or frequency on a species mismatch', async () => {
  const { readFileSync } = await import('node:fs');
  const src = readFileSync(new URL('../../src/components/CommandPalette.jsx', import.meta.url), 'utf8').replace(/\r\n/g, '\n');
  const card = src.slice(src.indexOf('function DoseCard('), src.indexOf('function CourseCard('));
  assert.match(card, /speciesMismatch \}? = intent|speciesMismatch } = intent/);
  assert.match(card, /const perKgText = speciesMismatch\s*\?\s*null/);
  assert.match(card, /\{perKgText && <div>/);
  assert.match(card, /\{!speciesMismatch && dose && dose\.perKg/);
  assert.match(card, /\{!speciesMismatch && drug\.freq &&/);
  assert.match(card, /ไม่มีขนาดยาสำหรับ\{speciesTh\}ในฐานข้อมูล/);
});
