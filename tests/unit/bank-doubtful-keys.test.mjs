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
