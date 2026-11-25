// ============================================================
// Seven Zoonoses and Aquatic answers corrected on 25 Nov 2026
// ============================================================
// Each was checked against this year's deck or the law it asks about, and one
// key changed. Every test here fails on the wording or key the row had before,
// so an edit or a re-ingest that brings it back is caught.
// ============================================================

import assert from 'node:assert/strict';
import test from 'node:test';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
import { readBank } from '../../scripts/lib/bank-file.mjs';

const DATA = path.join(path.dirname(fileURLToPath(import.meta.url)), '..', '..', 'src', 'data');

async function row(file, subject, id) {
  const { questions } = await readBank(path.join(DATA, file));
  const q = questions.find((x) => x.subject === subject && x.id === id);
  assert.ok(q, `${subject}:${id} not found in ${file}`);
  return q;
}

// The 2015 notification listed 34 aquatic diseases in category ฉ. The fourth
// notification (Royal Gazette, 5 Aug 2020) lists 42, and the question now names it.
test('aquatic 105122 counts the 42 diseases of the fourth notification', async () => {
  const q = await row('questions-y5-aquatic-2026.js', 'aquatic-clinic', 105122);
  assert.match(q.q, /ฉบับที่ 4/);
  assert.equal(q.options[q.answer], '42 โรค');
  assert.match(q.explain, /รวม 42 โรค/);
  assert.doesNotMatch(q.explain, /รวม 34 โรค/);
});

// The feed act belongs to the Department of Livestock Development, but the
// Department of Fisheries licenses and inspects aquatic feed under that same act.
test('aquatic 105888 says who licenses aquatic feed under the feed act', async () => {
  const q = await row('questions-y5-aquatic-2026-b.js', 'aquatic-clinic', 105888);
  assert.match(q.explain, /พ\.ศ\. 2558/);
  assert.match(q.explain, /อาหารสัตว์น้ำ/);
  assert.match(q.explain, /ใบอนุญาต/);
});

// ACFS sets the standard and owns the Q mark; a certification body inspects and
// certifies (the Department of Fisheries, or a private body registered with ACFS).
test('aquatic 211032 separates the standard setter from the certification body', async () => {
  const q = await row('questions-y5-aquatic-final-recall.js', 'aquatic-clinic', 211032);
  assert.match(q.explain, /หน่วยรับรอง/);
});

// WOAH grants official status only for a few terrestrial diseases; aquatic
// freedom is a member's self-declaration, which WOAH publishes without endorsing.
test('aquatic 211059 explains aquatic freedom as self-declaration', async () => {
  const q = await row('questions-y5-aquatic-final-recall.js', 'aquatic-clinic', 211059);
  assert.match(q.explain, /self-declaration/);
});

// Prion diagnosis: neuronal vacuolation with IHC or western blot, and RT-QuIC on
// CSF or olfactory mucosa. "Neural vacuolation or CSF" alone was the old line.
test('zoonoses 106039 names RT-QuIC and neuronal vacuolation', async () => {
  const q = await row('questions-y5-zoonoses-2026-b.js', 'zoonoses', 106039);
  assert.match(q.explain, /RT-QuIC/);
  assert.match(q.explain, /neuronal vacuolation/);
  assert.doesNotMatch(q.explain, /neural vacuolation/);
});

// The vCJD incubation period is not known; it is estimated at about ten years,
// not two. Patients are young: median age at death 28, against 68 in classic CJD.
test('zoonoses 106040 no longer gives vCJD a two-year incubation', async () => {
  const q = await row('questions-y5-zoonoses-2026-b.js', 'zoonoses', 106040);
  assert.doesNotMatch(q.explain, /incubation 2 ปี/);
  assert.match(q.explain, /ยังไม่ทราบแน่ชัด/);
  assert.match(q.explain, /28 ปี/);
});

// The endemic valley was left unnamed ("a valley"); it is San Joaquin Valley in
// California, the place the synonym San Joaquin Valley fever comes from.
test('zoonoses 210587 places the endemic valley in California', async () => {
  const q = await row('questions-y5-zoonoses-final-recall.js', 'zoonoses', 210587);
  assert.match(q.explain, /คือ San Joaquin Valley/);
  assert.match(q.explain, /แคลิฟอร์เนีย/);
});
