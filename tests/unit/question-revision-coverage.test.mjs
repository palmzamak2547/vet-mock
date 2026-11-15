// questionRevision (src/lib/study-events.js) names one version of a question. Three places compare
// it across a release: a race room (race-start.js and race-session.js refuse a racer whose copy has
// another revision), the server's re-score of a finished set (exam-scoring.js marks the score
// 'server' only when every question still has the revision the set was answered against, else it
// keeps the device's own count as 'client'), and each attempt in history (questionVersion).
// This test is the decision for every field a question in the bank carries: hashed, or not hashed
// with what a student sees when it is edited. It checks the hash by what it does, not by its text:
// it fails when the bank grows a field nobody decided, when editing a field changes the revision
// against the decision below (either way), and when the grader reads any field the hash leaves out,
// however it reads it (each bank question is graded through a Proxy that records every field read).
//
// What "not hashed" means, read from the code:
//   - a parked set: resumed while still being answered, it takes each question from the current
//     bank (exam-recovery.js refreshParkedQuestions), so an edit below reaches it; a submitted set
//     keeps the copy it was graded on;
//   - a race: each racer draws its own loaded copy, and two copies with one revision may still
//     differ in every field below, so racers on an old and a new build see different text until
//     the older one reloads;
//   - the exam-result outbox and the server's re-score: the server grades with isCorrect on its own
//     current copy, so only a field isCorrect reads can move a score, and every such field is hashed.
import { test } from 'node:test';
import assert from 'node:assert/strict';
import { BANK_REGISTRY } from '../../src/data/bank-registry.generated.js';
import { questionRevision } from '../../src/lib/study-events.js';
import { isCorrect } from '../../src/hooks/utils.js';

// Always in the hashed text.
const HASHED = ['type', 'q', 'front', 'back', 'options', 'answer', 'blanks', 'pairs', 'distractors'];
// In the hashed text only when a question carries them (5.214), so adding them changed the revision
// of the questions that carry them and of no other question.
const HASHED_WHEN_PRESENT = {
  unordered: 'which blanks of a fill question may be answered in any order; the grader reads it',
  keywords: 'the words a short answer must mention (75% of them); the grader reads it',
};
const GRADED_FIELDS = [...HASHED, ...Object.keys(HASHED_WHEN_PRESENT)];

const SHOWN = 'shown on the card or the reveal. Parked set: refreshed on resume. Race: racers on two builds see different copies. Score: unchanged.';
const FILING = 'decides which pool, paper or year a question is filed under; never shown as question text. Parked set: refreshed on resume, the set already drawn. '
  + 'Race: unaffected once the room exists. Score: unchanged, though the server labels a result with the subject and year of its current copy.';
const PROVENANCE = 'provenance and quality metadata (the ที่มา chip, the review list, the back office). Parked set: refreshed on resume. Race: not shown. Score: unchanged.';
const WRITTEN = 'the model answer and marking guide of a written question (essay or short), shown after submit for self-assessment and to the written grader. '
  + 'Parked set: refreshed on resume. Race: written questions are never raced (mcq only). Score: unchanged (written answers are not auto-scored).';

const NOT_HASHED = {
  // Identity: the revision is per id already.
  id: 'the key the revision is stored under.',
  // Shown with the question.
  passage: `the shared passage (and its tables) above a stem; ${SHOWN} A passage edit that changes the data the key rests on must also change the key or the stem.`,
  passage_title: `the passage's heading; ${SHOWN}`,
  say: `the stem as one sentence, read aloud and drawn by the text-only screens (daily question, race, share card) through wholeStem; ${SHOWN} In a race it IS the stem the racers read.`,
  explainSay: `the explanation as one paragraph, read aloud and given to the coach; ${SHOWN}`,
  explain: `the explanation under a revealed answer; ${SHOWN}`,
  image: `the figure beside the stem; ${SHOWN}`,
  imagePath: `the figure beside the stem (older field name); ${SHOWN}`,
  imageAlt: `the figure's description for screen readers; ${SHOWN}`,
  imageCaption: `the figure's caption; ${SHOWN}`,
  imageCredit: `the figure's credit line; ${SHOWN}`,
  imageSourceUrl: `where the figure came from; ${SHOWN}`,
  explainImage: `the figure under the explanation; ${SHOWN}`,
  explainImageAlt: `that figure's description; ${SHOWN}`,
  noShuffle: 'keeps the options in their written order. Display only: the answer is an index into the canonical options, which are hashed. A parked set keeps its own.',
  // Written questions.
  model_answer: WRITTEN, rubric: WRITTEN, target_words: WRITTEN, soft_max_words: WRITTEN, hard_max_words: WRITTEN,
  // Filing.
  subject: FILING, year: FILING, topic: FILING, topics: FILING, tags: FILING, examScope: FILING, bank: FILING, curriculumVersion: FILING,
  // Provenance and metadata.
  source: PROVENANCE, verified: PROVENANCE, sourceType: PROVENANCE, examOrigin: PROVENANCE, sourcePages: PROVENANCE,
  verificationSources: PROVENANCE, sourceDocument: PROVENANCE, wikiRefs: PROVENANCE, flag: PROVENANCE, confidence: PROVENANCE,
  answerStatus: PROVENANCE, predictionTier: PROVENANCE, predictionSignals: PROVENANCE, predictionEvidence: PROVENANCE,
  _pdfRef: PROVENANCE, _confidence: PROVENANCE,
};

// The hash as it stood before 5.214: nine fields. Every question that carries neither unordered nor
// keywords must still hash to it, or a release would void open races and unsent results for nothing.
function nineFieldRevision(q) {
  const text = JSON.stringify([q.type, q.q, q.front, q.back, q.options, q.answer, q.blanks, q.pairs, q.distractors]);
  let hash = 2166136261;
  for (let i = 0; i < text.length; i++) hash = Math.imul(hash ^ text.charCodeAt(i), 16777619);
  return `q1-${(hash >>> 0).toString(16).padStart(8, '0')}`;
}

const BANK = [];
for (const entry of BANK_REGISTRY) for (const q of await entry.load()) BANK.push([entry.file, q]);

test('every field a question in the bank carries is hashed or decided', () => {
  const seen = new Map();
  for (const [file, q] of BANK) for (const k of Object.keys(q)) if (!seen.has(k)) seen.set(k, `${file} #${q.id}`);
  assert.ok(seen.size > 30, `fields seen: ${seen.size}`);
  for (const [field, where] of seen) {
    assert.ok(GRADED_FIELDS.includes(field) || NOT_HASHED[field],
      `questions now carry "${field}" (first in ${where}), and nobody decided whether editing it should change questionRevision: add it to NOT_HASHED with what a student sees`);
  }
  for (const field of Object.keys(NOT_HASHED)) assert.ok(!GRADED_FIELDS.includes(field), `${field} is both hashed and not`);
});

test('editing a hashed field changes the revision, editing any other field does not', () => {
  const base = { id: 1, subject: 's', type: 'mcq', q: 'stem', options: ['a', 'b'], answer: 0, blanks: [['x']], pairs: [{ left: 'l', right: 'r' }],
    distractors: ['d'], front: 'f', back: 'b', unordered: true, keywords: ['k'] };
  const rev = questionRevision(base);
  for (const field of GRADED_FIELDS) {
    assert.notEqual(questionRevision({ ...base, [field]: 'edited' }), rev, `editing ${field} must change the revision`);
  }
  for (const field of Object.keys(NOT_HASHED)) {
    assert.equal(questionRevision({ ...base, [field]: 'edited' }), rev, `editing ${field} must keep the revision (or move it to the hashed list, with the release that says so)`);
  }
  const plain = { ...base }; delete plain.unordered; delete plain.keywords;
  assert.equal(questionRevision(plain), nineFieldRevision(plain), 'a question without them hashes as before');
  assert.notEqual(questionRevision({ ...plain, keywords: [] }), questionRevision(plain), 'adding keywords where there were none changes it');
});

test('only the questions that carry unordered or keywords changed revision in 5.214', () => {
  const changed = BANK.filter(([, q]) => questionRevision(q) !== nineFieldRevision(q)).map(([, q]) => q.id);
  const carriers = BANK.filter(([, q]) => q.unordered !== undefined || q.keywords !== undefined).map(([, q]) => q.id);
  assert.deepEqual(changed, carriers);
});

test('the grader reads only hashed fields, however it reads them', () => {
  const read = new Set();
  const traced = (q) => new Proxy(q, { get(target, key, receiver) { if (typeof key === 'string') read.add(key); return Reflect.get(target, key, receiver); } });
  const answersFor = (q) => {
    const out = [0, 1, 2, 3, 4, true, false, 'text', '', [], ['x'], {}, { 0: 'r' }];
    if (q.answer !== undefined) out.push(q.answer);
    if (Array.isArray(q.blanks)) out.push(q.blanks.map((b) => (Array.isArray(b) ? b[0] : b)), q.blanks.map(() => 'wrong'));
    if (Array.isArray(q.pairs)) out.push(q.pairs.map((p) => p.right), Object.fromEntries(q.pairs.map((p, i) => [i, p.right])));
    if (Array.isArray(q.keywords)) out.push(q.keywords.join(' '), String(q.keywords[0] ?? ''));
    return out;
  };
  for (const [, q] of BANK) for (const ua of answersFor(q)) isCorrect(traced(q), ua);
  assert.ok(read.has('type') && read.has('answer') && read.has('blanks'), `fields the grader read: ${[...read]}`);
  for (const field of read) {
    assert.ok(GRADED_FIELDS.includes(field), `isCorrect reads q.${field}, which questionRevision does not hash: a release that edits it moves scores under the same revision`);
  }
  for (const field of Object.keys(HASHED_WHEN_PRESENT)) assert.ok(read.has(field), `the grader no longer reads ${field}; it may leave the hash only with a release that says so`);
});
