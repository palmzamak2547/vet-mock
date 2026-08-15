export const meta = {
  name: 'y2-questions',
  description: 'Write MCQ practice questions from Year-2 governed notes, then have an independent solver try to answer them without the material',
  whenToUse: 'After a Year-2 subject has notes in the repo',
  phases: [
    { title: 'Write', detail: 'one agent per topic drafts questions from its note sections' },
    { title: 'Attack', detail: 'a solver who has NOT read the notes tries to guess each answer from wording alone' },
  ],
};

const { subjectId, subjectName, notesFile, outDir, topics, perTopic } = args;

const Q_SCHEMA = {
  type: 'object',
  required: ['topicId', 'questions'],
  additionalProperties: false,
  properties: {
    topicId: { type: 'string' },
    questions: {
      type: 'array',
      items: {
        type: 'object',
        required: ['topic', 'q', 'options', 'answer', 'explain', 'verified'],
        additionalProperties: false,
        properties: {
          topic: { type: 'string' },
          q: { type: 'string' },
          options: { type: 'array', minItems: 4, maxItems: 4, items: { type: 'string' } },
          answer: { type: 'number', minimum: 0, maximum: 3 },
          explain: { type: 'string' },
          verified: { type: 'string', description: 'deck name and slide page the answer comes from' },
        },
      },
    },
  },
};

const ATTACK_SCHEMA = {
  type: 'object',
  required: ['topicId', 'guessable'],
  additionalProperties: false,
  properties: {
    topicId: { type: 'string' },
    guessable: {
      type: 'array',
      items: {
        type: 'object',
        required: ['q', 'tell'],
        additionalProperties: false,
        properties: {
          q: { type: 'string', description: 'the question stem, enough to identify it' },
          tell: { type: 'string', enum: ['longest-option', 'only-specific-option', 'grammar-agreement', 'absolute-wording', 'catch-all-option', 'duplicate-options', 'answer-in-stem'] },
          detail: { type: 'string' },
        },
      },
    },
  },
};

const writePrompt = (t) => `Write multiple-choice practice questions for Thai veterinary students from ONE governed article.

Subject: ${subjectName} (${subjectId})
Topic id: ${t.topicId}
Article: ${t.title}
Notes file: ${notesFile}

Read the article's sections in that file (grep for "${t.topicId}"). Write about
${perTopic} questions covering its examinable content — fewer if the article is
thin, and none at all if it is purely administrative.

Every question:
- tests something the ARTICLE states. Never test outside it, and never test
  course logistics (dates, room numbers, marking schemes) — those are not
  veterinary knowledge.
- Thai stem and options, anatomical and physiological terms in English exactly
  as the article spells them.
- exactly 4 options, one correct.
- "verified" cites the deck and slide the answer sits on, copied from the
  section's own source line.
- "explain" says why the answer is right AND why the tempting wrong one is
  wrong.

What makes a question worthless, and what this pass is judged on:

1. The correct option must not be the longest. Keep all four within roughly a
   fifth of each other in length. When the right answer needs detail, give the
   wrong ones equally specific detail — a wrong drug, a wrong number, a wrong
   mechanism — so length carries no signal.
2. No emphasis markers, no ellipses, no middle dots inside options.
3. No "ถูกทุกข้อ", "ไม่มีข้อใดถูก", or any catch-all.
4. Distractors must be plausible and real. A named structure in the wrong
   place beats an invented structure. Numbers must be the same order of
   magnitude as the right one.
5. Vary which index is correct across your set — spread them over 0, 1, 2 and 3
   rather than settling on one.
6. The stem must not contain the answer, and grammar must fit all four options.

BEFORE returning, write your JSON to ${outDir}/${t.topicId}.q.json.`;

const attackPrompt = (t) => `You are a student who has NOT studied this material and is trying to pass by test-taking skill alone.

Questions: ${outDir}/${t.topicId}.q.json

Read ONLY the questions and options — do not read the notes, and do not use
veterinary knowledge to decide which answer is correct. Your job is to find the
questions whose correct answer can be picked from the wording:

  longest-option        one option is visibly longer or more detailed
  only-specific-option  three are vague, one carries real specifics
  grammar-agreement     only one option fits the stem grammatically
  absolute-wording      the wrong ones say "เสมอ"/"ทุก"/"ไม่เคย" and stand out
  catch-all-option      "ถูกทุกข้อ" or similar
  duplicate-options     two options say the same thing, so neither can be right
  answer-in-stem        the stem gives it away

For each one you could crack, name the tell. Being able to guess right by
knowing the subject does NOT count — only report a question where the FORM
gives it away.

Return only the guessable ones. An empty list means you read every question and
none leaked.`;

phase('Write');

const results = await pipeline(
  topics,
  (t) => agent(writePrompt(t), {
    label: `write:${t.topicId.split('--')[1] || t.topicId}`,
    phase: 'Write',
    schema: Q_SCHEMA,
  }),
  (drafted, t) => drafted && drafted.questions?.length
    ? agent(attackPrompt(t), {
        label: `attack:${t.topicId.split('--')[1] || t.topicId}`,
        phase: 'Attack',
        schema: ATTACK_SCHEMA,
        effort: 'high',
      }).then((a) => ({ topicId: t.topicId, n: drafted.questions.length, attack: a }))
    : null,
);

const ok = results.filter(Boolean);
const total = ok.reduce((n, r) => n + r.n, 0);
const guessable = ok.flatMap((r) => (r.attack?.guessable || []).map((g) => ({ topicId: r.topicId, ...g })));

log(`${total} questions written across ${ok.length} topics, ${guessable.length} flagged as guessable`);

return { subjectId, total, guessable };
