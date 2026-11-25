// ============================================================
// Rows whose own text contradicts the paper they came from
// ============================================================
// swine-clinic 8026 sits in the swine midterm pool. The paper asks about
// haemorrhage in the LYMPH NODES ("รอยโรคเลือดออกที่ต่อมน้ำเหลือง", with
// "strawberry ln." written above it); the transcription turned "ln." into
// "strawberry tongue" and moved the lesion to the skin, and the explanation
// followed it. The livestock-pathology copy of the same item (8225, taken
// from a different compilation) already reads lymph node.
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

test('swine 8026 asks about the lymph node lesion the paper asks about', async () => {
  const q = await row('questions-y5-final-mixed.js', 'swine-clinic', 8026);
  assert.doesNotMatch(q.q, /strawberry tongue/i);
  assert.match(q.q, /ต่อมน้ำเหลือง/);
  assert.doesNotMatch(q.explain, /skin lesion|ผิวหนังเลือดออก/i, 'the explanation still describes a skin lesion');
  assert.match(q.explain, /ต่อมน้ำเหลือง/);
  // "ASF/CSF" in the classical-swine-fever option named two diseases as one
  assert.doesNotMatch(q.options[0], /ASF/);
  assert.match(q.options[0], /classical swine fever/i);
  assert.equal(q.options[q.answer], 'ถูกทุกข้อ');
});

// Two rows were held back for good. livestock-pathology 8200 asked which pair
// does NOT cause renal lesions while its own explanation said every pair does,
// and the page that could settle it is not in the library. milk-meat-hygiene
// 207364 was the same sentence as 104766 with the opposite key. Both are
// retired: neither is in a bank, so neither waits in the held-back list.
test('the held-back pair 8200 and 207364 is retired from the bank and the hold list', async () => {
  const patho = await readBank(path.join(DATA, 'questions-y5-patho.js'));
  assert.equal(patho.questions.some((x) => x.subject === 'livestock-pathology' && x.id === 8200), false);
  const milk = await readBank(path.join(DATA, 'questions-mid86-milk-meat-hygiene.js'));
  assert.equal(milk.questions.some((x) => x.subject === 'milk-meat-hygiene' && x.id === 207364), false);
  const { BLOCKED_QUESTIONS } = await import('../../src/data/question-delivery.generated.js');
  const held = new Set(BLOCKED_QUESTIONS.map((b) => b.key));
  assert.equal(held.has('livestock-pathology:8200'), false);
  assert.equal(held.has('milk-meat-hygiene:207364'), false);
});

// Twelve Food Industry aquatic items were written from one Vet 84 student's
// highlights on a handout that student named "ไม่สอบ" (not examined that
// year), and no senior records an aquatic item. They are class material: they
// stay in the topic pool and Panic Mode does not offer them as examined points.
test('the twelve aquatic items from the not-examined handout are class-derived, not exam-aligned', async () => {
  const { panicRank } = await import('../../src/lib/question-metadata.js');
  const { questions } = await readBank(path.join(DATA, 'questions-y5-fiqc-2026-b.js'));
  for (let id = 218336; id <= 218347; id++) {
    const q = questions.find((x) => x.subject === 'food-industry' && x.id === id);
    assert.ok(q, `food-industry:${id} left the bank`);
    assert.equal(q.topic, 'fiqc-aquatic');
    assert.equal(panicRank(q), 2, `${id} is still offered in Panic Mode`);
  }
});

// 214565 printed kappa = 0.460 while its own four cells give 0.456.
test('epidemiology 214565 states the kappa its four cells give', async () => {
  const q = await row('questions-y5-epid-final-marked.js', 'epidemiology', 214565);
  const [a, b, c, d] = [8, 1, 16, 223];
  const n = a + b + c + d;
  const po = (a + d) / n;
  const pe = ((a + b) * (a + c) + (c + d) * (b + d)) / (n * n);
  const kappa = ((po - pe) / (1 - pe)).toFixed(3);
  const shown = new RegExp(`= ${kappa.replace('.', '\\.')}(?!\\d)`);
  for (const text of [q.q, q.say, q.explain]) {
    assert.match(text, shown);
    assert.doesNotMatch(text, /0\.460/);
  }
  assert.match(q.q, new RegExp(`kappa = ${kappa.replace('.', '\\.')}`));
  assert.match(q.options[2], new RegExp(po.toFixed(3).replace('.', '\\.')));
});

// zoonoses 219945 keyed "no evidence at all" of person-to-person spread and
// offered contact with a cutaneous lesion as a wrong answer. Lesions can pass
// the infection on before treatment starts (Emerg Infect Dis 2020;26(12),
// doi:10.3201/eid2612.200470), so that option was true as well. The key now
// says such spread is very rare; the lesion option that stays is false
// (contagious for weeks after treatment), since lesions turn sterile within a day.
test('anthrax 219945 has one true option about person-to-person spread', async () => {
  const q = await row('questions-y5-zoonoses-final-pack.js', 'zoonoses', 219945);
  assert.match(q.options[q.answer], /พบได้น้อยมาก/);
  assert.equal(q.options.some((o) => /สัมผัสแผลของผู้ป่วย/.test(o)), false, 'lesion contact is a real, rare route, not a wrong answer');
  assert.doesNotMatch(q.explain, /ยังไม่มีหลักฐานว่าติดต่อจากคนสู่คน/);
});
