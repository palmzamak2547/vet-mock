// The server accepts two revisions for a question that carries `unordered` or `keywords`: the current
// one and the one from before those fields joined the hash (acceptedQuestionRevisions, study-events.js).
// That is only safe while the grading fields are unchanged: a set finished under the old revision is
// graded with the question's current fields. Poultry 4002 and 4012 are pinned to a hash of their
// current `unordered` and `keywords`, so an edit to either fails here while the window is open, and
// the window itself must close by 1 Jan 2027.
import { test } from 'node:test';
import assert from 'node:assert/strict';
import { createHash } from 'node:crypto';
import { acceptedQuestionRevisions } from '../../src/lib/study-events.js';
import { BANK_REGISTRY } from '../../src/data/bank-registry.generated.js';

const PINNED = { 4002: '770b3994477867c9', 4012: '9cd9e4378f1af9aa' };
const WINDOW_CLOSES = Date.UTC(2027, 0, 1);

const gradingHash = (q) => createHash('sha256')
  .update(JSON.stringify({ unordered: q.unordered, keywords: q.keywords }))
  .digest('hex').slice(0, 16);

test('the two-revision window holds only while the grading fields of 4002 and 4012 are unchanged', async () => {
  const bank = await BANK_REGISTRY.find((e) => e.file === 'questions-poultry.js').load();
  for (const [id, pinned] of Object.entries(PINNED)) {
    const q = bank.find((x) => x.id === Number(id));
    assert.ok(q, `poultry ${id} is in the bank`);
    if (acceptedQuestionRevisions(q).length < 2) continue;
    assert.equal(gradingHash(q), pinned,
      `poultry ${id}: unordered or keywords changed while its old revision is still accepted, so a result `
      + 'finished under the old revision would be graded by the new grouping. Remove this question from '
      + 'the two-revision window (acceptedQuestionRevisions in src/lib/study-events.js), then update this pin.');
  }
});

test('the two-revision window is closed after 1 Jan 2027', async () => {
  if (Date.now() < WINDOW_CLOSES) return;
  const open = [];
  for (const entry of BANK_REGISTRY) {
    for (const q of await entry.load()) if (acceptedQuestionRevisions(q).length > 1) open.push(q.id);
  }
  assert.deepEqual(open, [],
    `the two-revision window is still open for ${open.join(', ')}: close the window (make acceptedQuestionRevisions `
    + 'in src/lib/study-events.js return only the current revision) and drop this guard.');
});
