// ============================================================
// Predicted papers (src/data/predict-sets.js) held to the banks
// ============================================================
// Every number the PredictSet card prints is the length of a list it serves,
// so each list must hold real, deliverable questions of the part's own
// subject, topic and format, in the counts the card states: the part's size,
// how many came from a senior paper (`past`) and how many come from this
// year's session (`fresh`). One number is not a list: `announced`, the count
// a lecturer named for a part the banks cannot fill yet, which the card prints
// on the part's tag, in the legend and in the forecast total while its button
// says what it serves; the evidence must say that number. The set leaves the
// screen when its paper ends. The whole paper runs on its own minutes (exam-clock.test.mjs holds
// the clock to the length a launcher names).
// ============================================================
import test from 'node:test';
import assert from 'node:assert/strict';
import { PREDICT_SETS, predictSetFor } from '../../src/data/predict-sets.js';
import { QB, loadQB } from '../../src/data/questions.js';
import { isPastPaperQuestion } from '../../src/lib/question-metadata.js';
import { isQuestionDeliverable } from '../../src/data/question-delivery.generated.js';

// This year's session: written from its recording or slides, a quiz the lecturer set in class, or written to the
// format the class LINE announced for this paper.
const FRESH = /^(เขียนขึ้นจากเลคเชอร์ .+ ปี 2569 เรื่อง |ควิซในคาบ .+ ของ Vet 86|แนวข้อสอบ .+ 2569 ที่รุ่นแจ้งในกลุ่มไลน์ชั้นปี)/;

test('every predicted question is a real, deliverable question of its part', async () => {
  await loadQB();
  for (const set of PREDICT_SETS) {
    const ofSubject = QB.filter((q) => q.subject === set.subject);
    const byId = new Map(ofSubject.map((q) => [q.id, q]));
    const seen = new Set();
    for (const part of set.parts) {
      assert.equal(part.ids.length, part.count, `${part.id}: serves ${part.ids.length}, says ${part.count}`);
      if (part.announced !== undefined) {
        assert.ok(Number.isInteger(part.announced) && part.announced > part.count,
          `${part.id}: announced ${part.announced} must be a whole number above the ${part.count} it serves`);
        assert.ok(part.evidence.some((line) => line.includes(`${part.announced} ข้อ`)),
          `${part.id}: no evidence line gives the announced ${part.announced} ข้อ`);
      }
      for (const id of [...part.ids, ...part.extra]) {
        const label = `${set.subject} ${part.id} ${id}`;
        assert.ok(!seen.has(id), `${label} is listed twice`);
        seen.add(id);
        assert.equal(ofSubject.filter((q) => q.id === id).length, 1, `${label} is not exactly one question`);
        const q = byId.get(id);
        assert.equal(q.topic, part.topic, `${label} topic`);
        assert.equal(q.type, part.format, `${label} format`);
        assert.ok(isQuestionDeliverable(q), `${label} is blocked from delivery`);
      }
      const main = part.ids.map((id) => byId.get(id));
      assert.equal(main.filter(isPastPaperQuestion).length, part.past, `${part.id} past`);
      assert.equal(main.filter((q) => FRESH.test(q.examOrigin || '')).length, part.fresh, `${part.id} fresh`);
      assert.ok(part.evidence.length > 0 && part.confidence >= 1 && part.confidence <= 3, `${part.id} evidence`);
    }
  }
});

test('a set shows for its own paper until the paper ends', () => {
  for (const set of PREDICT_SETS) {
    const ends = Date.parse(set.ends);
    const before = new Date(ends - 60_000);
    assert.equal(predictSetFor(set.subject, set.year, set.phase, before), set);
    assert.equal(predictSetFor(set.subject, String(set.year), set.phase, before), set);
    assert.equal(predictSetFor(set.subject, set.year, set.phase, new Date(ends)), null);
    assert.equal(predictSetFor(set.subject, set.year + 1, set.phase, before), null);
    assert.equal(predictSetFor(set.subject, set.year, `${set.phase}-other`, before), null);
    assert.equal(predictSetFor('another-subject', set.year, set.phase, before), null);
  }
});

test('the whole paper is a real paper: its minutes, and no question twice', () => {
  for (const set of PREDICT_SETS) {
    assert.ok(Number.isInteger(set.minutes) && set.minutes > 0, `${set.subject}: minutes ${set.minutes}`);
    const all = set.parts.flatMap((p) => p.ids);
    assert.equal(new Set(all).size, all.length, `${set.subject}: a question is listed twice across parts`);
  }
});
