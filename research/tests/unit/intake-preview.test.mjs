// The import preview's question contract [M1-DESIGN.md 8.1; G26]: every question without an answer
// blocks the confirm button AND is carried by a conversion with needsAnswer, so a screen that walks
// the conversion list alone asks every question; answering through the conversion's questionId clears
// it. The main thread may import preview.js without pulling the xlsx reader. OWNER: intake role.
import { test } from 'node:test';
import assert from 'node:assert/strict';
import { readFileSync } from 'node:fs';
import { buildPreview, answerPreview } from '../../src/lib/intake/preview.js';

const NOW = '2026-09-27T00:00:00.000Z';
const csv = (text) => new TextEncoder().encode(text.replace(/\n/g, '\r\n'));

/** Every unanswered question has a needsAnswer conversion with its options; nothing else needs an answer. */
function assertCarried(p) {
  const open = p.questions.filter((q) => q.answer == null);
  assert.deepEqual(p.blocking.map((b) => b.questionId).sort(), open.map((q) => q.id).sort());
  for (const q of open) {
    const c = p.conversions.find((x) => x.questionId === q.id && x.needsAnswer);
    assert.ok(c, `question ${q.id} is carried by a conversion`);
    assert.deepEqual(c.options, q.options, `${q.id} options travel with the conversion`);
  }
  for (const c of p.conversions.filter((x) => x.needsAnswer)) {
    assert.ok(open.some((q) => q.id === c.questionId), `${c.kind} needs an answer only while its question is open`);
  }
}

test('a date column whose order the file cannot settle: the order question rides on a question conversion', async () => {
  // 13/02 reads only as day-first, 02/13 only as month-first: the file contradicts itself
  const p = await buildPreview(csv('id,วันเกิด\na1,13/02/2567\na2,02/13/2567\na3,05/06/2567\n'), { fileName: 'o.csv', now: NOW });
  const col = p.codebook.columns.find((c) => c.name === 'วันเกิด').key;
  const qid = `q:${col}:order`;
  assert.equal(p.questions.find((q) => q.id === qid).answer, null);
  assert.ok(p.blocking.some((b) => b.questionId === qid && b.key === 'intake.blocking.order'));
  const carrier = p.conversions.find((c) => c.questionId === qid);
  assert.equal(carrier.kind, 'question');
  assert.equal(carrier.key, 'intake.question.order');
  assertCarried(p);
  const q = answerPreview(p, { [qid]: 'dmy' });
  assert.equal(q.importStep.params.perColumn[col].dates.order, 'dmy');
  assert.ok(!q.conversions.some((c) => c.questionId === qid && c.needsAnswer));
  assertCarried(q);
});

test('answered questions release their conversions (excel-date-id and id-padding once needed an answer forever)', async () => {
  const p = await buildPreview(csv('ฟาร์ม,รหัสสัตว์,น้ำหนัก\nF1,007,10\nF1,012,11\nF1,13,12\nF1,014,13\nF1,015,14\nF1,016,15\n'), { fileName: 'p.csv', now: NOW });
  const col = p.codebook.columns.find((c) => c.name === 'รหัสสัตว์').key;
  const qid = `q:${col}:id-padding`;
  const conv = p.conversions.find((c) => c.questionId === qid);
  assert.equal(conv.needsAnswer, true);
  assert.deepEqual(conv.examples, [{ rowId: 'r3', from: '13', to: '013' }]);
  assertCarried(p);
  const q = answerPreview(p, { [qid]: 'pad' });
  const after = q.conversions.find((c) => c.questionId === qid);
  assert.equal(after.needsAnswer, false);
  assert.equal(after.applied, true);
  assert.equal(after.answer, 'pad');
  assert.deepEqual(q.importStep.params.perColumn[col].cellFixes, [{ rowId: 'r3', from: '13', to: '013', why: 'id-padding' }]);
  assertCarried(q);
});

test('the serosurvey preview keeps the contract before and after its two answers', async () => {
  const bytes = new Uint8Array(readFileSync(new URL('../fixtures/serosurvey/serosurvey-2569.csv', import.meta.url)));
  const p = await buildPreview(bytes, { fileName: 'serosurvey-2569.csv', now: NOW });
  assertCarried(p);
  const answers = Object.fromEntries(p.blocking.map((b) => [b.questionId, p.questions.find((q) => q.id === b.questionId).options[0].value]));
  const q = answerPreview(p, answers);
  assertCarried(q);
  assert.deepEqual(q.blocking, []);
});

test('preview.js loads the xlsx reader (and SheetJS) only inside buildPreview', () => {
  const src = readFileSync(new URL('../../src/lib/intake/preview.js', import.meta.url), 'utf8');
  assert.ok(!/^import[^\n]*xlsx/m.test(src), 'no static import of the xlsx reader');
  assert.match(src, /await import\('\.\/xlsx\.js'\)/);
  for (const f of ['codebook', 'recipe', 'infer', 'dates', 'missing', 'pii', 'thai', 'csv', 'decode']) {
    const m = readFileSync(new URL(`../../src/lib/intake/${f}.js`, import.meta.url), 'utf8');
    assert.ok(!/from ['"](xlsx|\.\/xlsx\.js)['"]/.test(m), `${f}.js does not import SheetJS`);
  }
});

test('a CSV wider than the column cap is refused at once with its own message (review round 4)', async () => {
  const { MAX_COLUMNS } = await import('../../src/lib/intake/preview.js');
  const { toEngineError } = await import('../../src/lib/runtime/engine-core.js');
  const head = Array.from({ length: MAX_COLUMNS + 1 }, (_, i) => `c${i}`).join(',');
  const bytes = new TextEncoder().encode(`${head}\n${head.replace(/c/g, '')}\n`);
  const t0 = Date.now();
  let err = null;
  try { await buildPreview(bytes, { fileName: 'wide.csv', now: '2026-09-28T00:00:00Z' }); } catch (e) { err = e; }
  assert.ok(Date.now() - t0 < 5000, `refused in ${Date.now() - t0} ms`);
  assert.equal(err?.key, 'intake.tooManyColumns');
  // the number in the message crosses the engine boundary with the key
  assert.deepEqual(toEngineError(err).params, { max: MAX_COLUMNS.toLocaleString('en-US') });
});

test('20,000 columns x 45 rows (first filled, the rest blank) give a preview in under 10 s (review round 5)', async () => {
  // The "not applicable" evidence search cost columns x columns x rows: this file took minutes. Now linear.
  const n = 20_000;
  const head = Array.from({ length: n }, (_, i) => `c${i + 1}`).join(',');
  const blanks = ','.repeat(n - 1);
  const body = Array.from({ length: 45 }, (_, r) => `a${r + 1}${blanks}`).join('\n');
  const t0 = Date.now();
  const p = await buildPreview(csv(`${head}\n${body}\n`), { fileName: 'wide.csv', now: NOW });
  const ms = Date.now() - t0;
  assert.equal(p.file.columns, n);
  assert.ok(ms < 10_000, `preview took ${ms} ms`);
});

test('the not-applicable evidence still finds the column that marks the rows (parity "-" on the males)', async () => {
  const p = await buildPreview(csv('id,sex,parity,colour\na1,M,-,red\na2,F,2,red\na3,M,-,blue\na4,F,1,blue\na5,F,3,red\n'), { fileName: 'na.csv', now: NOW });
  const q = p.questions.find((x) => x.kind === 'missing-reason' && x.params.code === '-');
  assert.equal(q.default, 'not-applicable');
  assert.equal(q.params.evidenceColumn, 'sex');
  assert.equal(q.params.evidenceValue, 'M');
});
