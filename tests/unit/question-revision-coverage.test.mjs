// questionRevision (src/lib/study-events.js) names one version of a question. Three places compare
// it across a release: a race room (race-start.js and race-session.js refuse a racer whose copy has
// another revision), the server's re-score of a finished set (exam-scoring.js marks the score
// 'server' only when every question still has the revision the set was answered against, else it
// keeps the device's own count as 'client'), and each attempt in history (questionVersion). The hash
// covers nine fields. Everything else on a question can change in a release and keep the revision.
// This test is the decision for every field a question in the bank carries: hashed, or not hashed
// with what a student sees when it is edited. It fails when the bank grows a field nobody decided,
// when the grading code starts reading a field outside the hash, or when the hash changes.
//
// What "not hashed" means, read from the code:
//   - an open or parked set: the parked record (App.jsx writeInflight) keeps the question objects
//     as they were when the set began, and a resume (useExamSession) draws those, so the student
//     finishes on the old text, picture and explanation whatever the field;
//   - a race: each racer draws its own loaded copy, and two copies with one revision may still
//     differ in every field below, so racers on an old and a new build see different text;
//   - the exam-result outbox and the server's re-score: the server grades with isCorrect on its own
//     current copy, so only a field isCorrect reads can move a score, and every such field must be
//     hashed (or listed in SCORING_OUTSIDE_HASH below).
import { test } from 'node:test';
import assert from 'node:assert/strict';
import { readFileSync } from 'node:fs';
import { BANK_REGISTRY } from '../../src/data/bank-registry.generated.js';

const read = (p) => readFileSync(new URL(`../../${p}`, import.meta.url), 'utf8').replace(/\r\n/g, '\n');

const HASHED = ['type', 'q', 'front', 'back', 'options', 'answer', 'blanks', 'pairs', 'distractors'];

// Fields the grader reads that the hash leaves out. Each is a way a score can move without the
// revision moving. Not changed here (the hash stays until after the finals); written down so the
// next one is not added silently.
const SCORING_OUTSIDE_HASH = {
  unordered: 'which blanks of a fill question may be answered in any order. Edited in a release, a set finished before it and sent after '
    + '(the outbox) is re-scored by the server under the new grouping and still counts as verified, so its stored score can differ from the one the student was shown.',
  keywords: 'the words a short answer must mention (75% of them). Short answers are left out of the server\'s score (autoQs), so only the device\'s own '
    + 'verdict moves: a resumed set grades with the old list, a new set with the new one, under one revision in history.',
};

const SHOWN = 'shown on the card or the reveal. Open or parked set: the old value until the set ends. Race: racers on two builds see different copies. Score: unchanged.';
const FILING = 'decides which pool, paper or year a question is filed under; never shown as question text. Open or parked set: unaffected (the set is already drawn). '
  + 'Race: unaffected once the room exists. Score: unchanged, though the server labels a result with the subject and year of its current copy.';
const PROVENANCE = 'provenance and quality metadata (the ที่มา chip, the review list, the back office). Open or parked set: the old value until the set ends. Race: not shown. Score: unchanged.';
const WRITTEN = 'the model answer and marking guide of a written question (essay or short), shown after submit for self-assessment and to the written grader. '
  + 'Open or parked set: the old guide. Race: written questions are never raced (mcq only). Score: unchanged (written answers are not auto-scored).';

const NOT_HASHED = {
  // Identity: the revision is per id already.
  id: 'the key the revision is stored under.',
  // Shown with the question.
  passage: `the shared passage (and its tables) above a stem; ${SHOWN} A passage edit that changes the data the key rests on must also change the key or the stem, or a resumed set answers the old data.`,
  passage_title: `the passage's heading; ${SHOWN}`,
  say: `the stem as one sentence, read aloud and drawn by the text-only screens (daily question, race, share card) through wholeStem; ${SHOWN} In a race it IS the stem the racers read.`,
  explainSay: `the explanation as one paragraph, read aloud and given to the coach; ${SHOWN}`,
  explain: `the explanation under a revealed answer; ${SHOWN}`,
  image: `the figure beside the stem; ${SHOWN} A parked set keeps the old path, so a figure renamed in the release shows as missing in it.`,
  imagePath: `the figure beside the stem (older field name); ${SHOWN} A parked set keeps the old path, so a renamed figure shows as missing in it.`,
  imageAlt: `the figure's description for screen readers; ${SHOWN}`,
  imageCaption: `the figure's caption; ${SHOWN}`,
  imageCredit: `the figure's credit line; ${SHOWN}`,
  imageSourceUrl: `where the figure came from; ${SHOWN}`,
  explainImage: `the figure under the explanation; ${SHOWN}`,
  explainImageAlt: `that figure's description; ${SHOWN}`,
  noShuffle: 'keeps the options in their written order. Display only: the answer is an index into the canonical options, which are hashed.',
  // Written questions.
  model_answer: WRITTEN, rubric: WRITTEN, target_words: WRITTEN, soft_max_words: WRITTEN, hard_max_words: WRITTEN,
  // Filing.
  subject: FILING, year: FILING, topic: FILING, topics: FILING, tags: FILING, examScope: FILING, bank: FILING, curriculumVersion: FILING,
  // Provenance and metadata.
  source: PROVENANCE, verified: PROVENANCE, sourceType: PROVENANCE, examOrigin: PROVENANCE, sourcePages: PROVENANCE,
  verificationSources: PROVENANCE, sourceDocument: PROVENANCE, wikiRefs: PROVENANCE, flag: PROVENANCE, confidence: PROVENANCE,
  answerStatus: PROVENANCE, predictionTier: PROVENANCE, predictionSignals: PROVENANCE, predictionEvidence: PROVENANCE,
  _pdfRef: PROVENANCE, _confidence: PROVENANCE,
  ...SCORING_OUTSIDE_HASH,
};

test('the revision hashes exactly the nine fields written here', () => {
  const src = read('src/lib/study-events.js');
  const body = src.match(/export function questionRevision\(q\) \{\n\s*const text = JSON\.stringify\(\[([^\]]*)\]\);/);
  assert.ok(body, 'questionRevision still builds its text from one JSON array of fields');
  const fields = [...body[1].matchAll(/q\.(\w+)/g)].map((m) => m[1]);
  assert.deepEqual(fields, HASHED, 'the revision changed: every open race room and every unsent result from before the release now fails its check; update this test with the release that does it');
});

test('every field a question in the bank carries is hashed or decided', async () => {
  const seen = new Map();
  for (const entry of BANK_REGISTRY) {
    for (const q of await entry.load()) {
      for (const k of Object.keys(q)) if (!seen.has(k)) seen.set(k, `${entry.file} #${q.id}`);
    }
  }
  assert.ok(seen.size > 30, `fields seen: ${seen.size}`);
  for (const [field, where] of seen) {
    assert.ok(HASHED.includes(field) || NOT_HASHED[field],
      `questions now carry "${field}" (first in ${where}), and nobody decided whether editing it should change questionRevision: add it to NOT_HASHED with what a student sees`);
  }
  for (const field of Object.keys(NOT_HASHED)) assert.ok(!HASHED.includes(field), `${field} is both hashed and not`);
});

test('the grader reads only hashed fields, apart from the gaps written down', () => {
  const src = read('src/hooks/utils.js');
  const start = src.indexOf('function textBeforeBlank(');
  const end = src.indexOf('export function matchScore(');
  assert.ok(start !== -1 && end > start && src.slice(start, end).includes('export const isCorrect = '), 'the grading helpers and isCorrect still sit between textBeforeBlank and matchScore');
  const read_ = new Set([...src.slice(start, end).matchAll(/\bq\.(\w+)/g)].map((m) => m[1]));
  for (const field of read_) {
    assert.ok(HASHED.includes(field) || SCORING_OUTSIDE_HASH[field], `isCorrect now reads q.${field}, which questionRevision does not hash: a release that edits it moves scores under the same revision`);
  }
  for (const field of Object.keys(SCORING_OUTSIDE_HASH)) assert.ok(read_.has(field), `the grader no longer reads ${field}: drop it from SCORING_OUTSIDE_HASH`);
});
