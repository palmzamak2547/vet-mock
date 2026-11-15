// Values someone could send as public.shared_questions.data, and whether the
// database keeps each (supabase/migrations/20261115120000_shared_questions_data_shape.sql).
//
// One table, read twice so the two sides cannot drift:
//   - scripts/test-shared-questions-db.mjs inserts every value into a real
//     database with the migration applied and expects `kept`;
//   - tests/unit/shared-questions-shape.test.mjs holds the app to the same
//     table: what the app writes is kept, and what is kept the page can show.

const thai = (n) => 'ก'.repeat(n);

/** Questions as the app writes them: one of each kind the student's own list holds. */
export const APP_WRITTEN = [
  { name: 'a multiple-choice question', data: { id: 'c-1', type: 'mcq', subject: 'com5', topic: 'com5-cardio', year: 5, q: 'Which drug lowers preload?', options: ['Furosemide', 'Atenolol', 'Digoxin', 'Pimobendan'], answer: 0, explain: 'A loop diuretic lowers preload.', tags: ['pharm', 'cardio'] } },
  { name: 'a true or false question', data: { type: 'tf', subject: 'avian', q: 'Birds have a diaphragm.', answer: false } },
  { name: 'a fill-in question', data: { type: 'fill', subject: 'swine', q: 'The agent of swine erysipelas is ___.', blanks: ['Erysipelothrix rhusiopathiae'], tags: [] } },
  { name: 'a matching question', data: { type: 'match', subject: 'zoonoses', q: 'Match each disease with its reservoir.', pairs: [{ left: 'Rabies', right: 'Dog' }, { left: 'Leptospirosis', right: 'Rat' }], distractors: ['Horse'], shuffle: true } },
  { name: 'a short-answer question', data: { type: 'short', subject: 'epi', q: 'Define incidence.', keywords: ['new cases', 'population at risk'], model_answer: 'New cases over the population at risk in a period.' } },
  { name: 'an essay question', data: { type: 'essay', subject: 'one-health', q: thai(400), model_answer: thai(2000), tags: [thai(20)] } },
  { name: 'a question with a picture on this site', data: { type: 'mcq', subject: 'imaging', q: 'What does the radiograph show?', options: ['Cardiomegaly', 'Normal'], answer: 0, image: '/figures/q123.webp' } },
  // The longest the app's own validator lets these fields be.
  { name: 'a question at the app\'s own limits', data: { type: 'mcq', subject: 's'.repeat(100), q: thai(20_000), options: ['a', 'b'], answer: 1, tags: Array.from({ length: 50 }, (_, i) => `tag-${i}`), explain: thai(100_000) } },
];

/** Everything else: what a member could send through the API directly. */
export const SENT_DIRECTLY = [
  // Not a question at all.
  { name: 'a number', data: 42, kept: false },
  { name: 'a string', data: 'Which drug?', kept: false },
  { name: 'a list', data: [{ q: 'Which drug?' }], kept: false },
  { name: 'true', data: true, kept: false },
  { name: 'null', data: null, kept: false },
  { name: 'an empty object', data: {}, kept: false },
  { name: 'an object with no question text', data: { subject: 'com5', tags: ['pharm'] }, kept: false },
  // The question text.
  { name: 'only the question text', data: { q: 'Which drug?' }, kept: true },
  { name: 'a one-character question', data: { q: '?' }, kept: true },
  { name: 'question text as a number', data: { q: 5 }, kept: false },
  { name: 'question text as an object', data: { q: { text: 'nested' } }, kept: false },
  { name: 'question text as a list', data: { q: ['Which', 'drug?'] }, kept: false },
  { name: 'question text null', data: { q: null }, kept: false },
  { name: 'empty question text', data: { q: '' }, kept: false },
  { name: 'question text of spaces and line breaks', data: { q: '  \n\t\r ' }, kept: false },
  { name: 'question text with spaces around it', data: { q: '  Which drug?  ' }, kept: true },
  { name: 'question text one character over the limit', data: { q: 'a'.repeat(20_001) }, kept: false },
  // The subject.
  { name: 'no subject', data: { q: 'No subject given' }, kept: true },
  { name: 'subject null', data: { q: 'x', subject: null }, kept: true },
  { name: 'an empty subject', data: { q: 'x', subject: '' }, kept: true },
  { name: 'subject as a number', data: { q: 'x', subject: 5 }, kept: false },
  { name: 'subject as an object', data: { q: 'x', subject: { id: 'com5' } }, kept: false },
  { name: 'a subject one character over the limit', data: { q: 'x', subject: 's'.repeat(101) }, kept: false },
  // The tags. The row that once blanked the Shared tab is the first.
  { name: 'tags as a string', data: { subject: 'com5', q: 'Still a question', tags: 'oops' }, kept: false },
  { name: 'tags as an object', data: { q: 'x', tags: { a: 1 } }, kept: false },
  { name: 'tags as a number', data: { q: 'x', tags: 3 }, kept: false },
  { name: 'tags null', data: { q: 'x', tags: null }, kept: true },
  { name: 'no tags in the list', data: { q: 'x', tags: [] }, kept: true },
  { name: 'a tag that is a number', data: { q: 'x', tags: ['ok', 3] }, kept: false },
  { name: 'a tag that is null', data: { q: 'x', tags: ['ok', null] }, kept: false },
  { name: 'a tag that is an object', data: { q: 'x', tags: [{ x: 1 }] }, kept: false },
  { name: 'a tag that is a list of text', data: { q: 'x', tags: [['a', 'b']] }, kept: false },
  { name: 'fifty-one tags', data: { q: 'x', tags: Array.from({ length: 51 }, (_, i) => `t${i}`) }, kept: false },
  // Other keys are the app's business, whatever their type.
  { name: 'unknown keys of every type', data: { q: 'x', extra: { deep: [1, 2, { z: null }] }, flag: true, n: 1.5, nothing: null }, kept: true },
  { name: 'keys every object has', data: { q: 'x', constructor: 'c', toString: 't', hasOwnProperty: 1 }, kept: true },
  // Size.
  { name: 'a megabyte of filler beside a question', data: { q: 'x', explain: 'a'.repeat(1_048_576) }, kept: false },
  { name: 'a megabyte in a key the app does not know', data: { q: 'x', junk: Array.from({ length: 1100 }, () => 'j'.repeat(1000)) }, kept: false },
];

/**
 * Kept by the database and still not shown by the page: a question made only
 * of spaces the database does not strip. The page lists it as one line saying
 * it cannot be shown, and its author can delete it.
 */
export const KEPT_BUT_BLANK = [
  { name: 'question text of no-break spaces', data: { q: '  ' }, kept: true },
  { name: 'question text of ideographic spaces', data: { q: '　' }, kept: true },
];

export const ALL_SHAPES = [
  ...APP_WRITTEN.map((shape) => ({ ...shape, kept: true })),
  ...SENT_DIRECTLY,
  ...KEPT_BUT_BLANK,
];
