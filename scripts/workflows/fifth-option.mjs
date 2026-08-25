export const meta = {
  name: 'fifth-option',
  description: 'Write a fifth distractor for 45 Year-2 questions, then have an independent reader try to prove it is actually correct',
  whenToUse: 'When a year is uniformly four-option and the benchmark sits near 31% five',
  phases: [
    { title: 'Write', detail: 'one plausible, definitely-wrong fifth option per question' },
    { title: 'Refute', detail: 'a second reader argues that the new option is defensible — if it is, it is rejected' },
  ],
};

const DIR = 'C:\Users\palmz\Desktop\vet-mock\.opt-fix';

const SCHEMA = {
  type: 'object',
  required: ['results'],
  additionalProperties: false,
  properties: {
    results: {
      type: 'array',
      items: {
        type: 'object',
        required: ['id', 'action'],
        additionalProperties: false,
        properties: {
          id: { type: 'number' },
          action: { type: 'string', enum: ['add', 'skip'] },
          option: { type: 'string', description: 'required when action is add: the new wrong option' },
          why_wrong: { type: 'string', description: 'required when action is add: why it is definitively wrong' },
          reason: { type: 'string', description: 'required when action is skip' },
        },
      },
    },
  },
};

const VERDICT = {
  type: 'object',
  required: ['verdicts'],
  additionalProperties: false,
  properties: {
    verdicts: {
      type: 'array',
      items: {
        type: 'object',
        required: ['id', 'verdict'],
        additionalProperties: false,
        properties: {
          id: { type: 'number' },
          verdict: { type: 'string', enum: ['ok', 'refuted'] },
          problem: { type: 'string' },
        },
      },
    },
  },
};

const write = `Forty-five Year-2 Thai veterinary questions have exactly four options. Give
each one a fifth.

Input : ${DIR}\in.json      — stem, the four options, the recorded answer index, the explanation
Output: ${DIR}\out.json     (WRITE this file — it is the deliverable)

Why: this year is 145 out of 145 four-option. A bank where every question has
the same shape reads as machine-made, and the Year-4 semester-2 banks that set
the standard here sit at 31% five-option.

A fifth option is only worth adding if it makes the question HARDER for someone
who does not know, and no harder for someone who does. That means:

1. IT MUST BE DEFINITIVELY WRONG. Not "less right", not "arguable", not "true
   in some species". If a knowledgeable student could build a case for it, the
   question now has two answers and you have broken it. This is checked by a
   second reader whose whole job is to argue your option IS defensible, so
   assume it will be attacked.

2. IT MUST BE PLAUSIBLE. A real structure, organism, enzyme, or value placed
   in the wrong role — the same trick the existing distractors use. Something
   invented, or absurd, is struck out on sight and adds nothing.

3. SAME CATEGORY AND SAME SHAPE as the other four. If they are enzyme names,
   yours is an enzyme name. If they are "A และ B" pairs, yours is a pair. If
   they are numeric ranges, yours is a range of the same magnitude — never an
   order of magnitude away, which reads as filler.

4. LENGTH INSIDE THE BAND. Within roughly a fifth of the mean of the existing
   four. A fifth option visibly longer or shorter than the rest is a tell, and
   the correct answer must not become the longest or the shortest of the five.

5. NOT A RESTATEMENT of any existing option, including the answer. Two options
   meaning the same thing let a student strike both.

6. No "ถูกทุกข้อ", no "ไม่มีข้อใดถูก", no emphasis markers, no ellipsis, no
   middle dots. Thai to match the question, technical terms in English as the
   question spells them.

7. Say **skip** when you cannot meet all of this. A question whose four options
   already exhaust the sensible possibilities — the four chambers, the four
   classes, a true/false pair — should stay at four. Skipping is a fine answer
   and costs nothing; a fifth option that is secretly correct costs a student
   the mark they earned.

In "why_wrong", state the specific fact that makes your option wrong. Not "it is
not the answer" — say what the thing actually is or does.

Read the file, decide all 45, write the output before returning.`;

const refute = `Forty-five Year-2 questions were each given a fifth option by someone else.
Your job is to prove those new options are ACCEPTABLE ANSWERS — that is, to
break them.

Questions + the four originals : ${DIR}\in.json
The proposed fifth options     : ${DIR}\out.json
Your verdicts                  : ${DIR}\verdict.json   (WRITE this file — it is the deliverable)

For each id where an option was added, attack it:

  • Is there any reading, any species, any context taught at veterinary level
    under which the new option answers the stem? If yes — refuted.
  • Does it say the same thing as the recorded answer in different words, or
    the same thing as another distractor? Refuted.
  • Is it obviously filler — absurd, invented, an order of magnitude off, or a
    different category from the other four? Refuted: it makes the question
    easier, not harder.
  • Is it the longest or shortest of the five by a wide margin, or does it make
    the correct answer the longest? Refuted — that is a visible tell.
  • Does it contain a catch-all, emphasis marker or ellipsis? Refuted.

Mark "ok" only after you have actually tried to argue the new option and
failed. Default to "refuted" when unsure. A rejected option leaves the question
at four, which is exactly where it is today and harms nobody. An accepted one
that turns out to be defensible marks a student wrong for knowing more than the
bank does.

Quote the specific problem. Do not rewrite anything.`;

phase('Write');
const done = await agent(write, { label: 'write:45', phase: 'Write', schema: SCHEMA });

phase('Refute');
const verdicts = done
  ? await agent(refute, { label: 'refute:45', phase: 'Refute', schema: VERDICT, effort: 'high' })
  : null;

const list = done?.results || [];
const ok = (verdicts?.verdicts || []).filter((v) => v.verdict === 'ok').length;
const no = (verdicts?.verdicts || []).filter((v) => v.verdict === 'refuted');
log(`${list.filter((r) => r.action === 'add').length} written · ${list.filter((r) => r.action === 'skip').length} skipped · ${ok} cleared · ${no.length} rejected`);

return {
  added: list.filter((r) => r.action === 'add').length,
  skipped: list.filter((r) => r.action === 'skip').map((r) => ({ id: r.id, reason: r.reason })),
  ok,
  refuted: no.map((v) => ({ id: v.id, problem: v.problem })),
};
