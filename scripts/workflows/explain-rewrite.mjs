export const meta = {
  name: 'explain-rewrite',
  description: 'Rewrite the 514 explanations that narrate their source deck into the Year-4 semester-2 shape, then have an independent skeptic try to refute every claim',
  whenToUse: 'After lint:question-standard reports "explain narrates the doc" above zero',
  phases: [
    { title: 'Rewrite', detail: 'one agent per batch rewrites explanations into why-right / why-each-wrong / hook' },
    { title: 'Refute', detail: 'an independent reader who did not write them tries to break every claim' },
  ],
};

const batches = args.batches;   // [{ key, subject, n }]

const WRITE_SCHEMA = {
  type: 'object',
  required: ['batch', 'results'],
  additionalProperties: false,
  properties: {
    batch: { type: 'string' },
    results: {
      type: 'array',
      items: {
        type: 'object',
        required: ['id', 'explain'],
        additionalProperties: false,
        properties: {
          id: { type: 'number' },
          explain: { type: 'string', description: 'the full replacement explanation, three parts' },
          unsure: { type: 'array', items: { type: 'string' }, description: 'distractors you could not honestly account for, if any' },
        },
      },
    },
  },
};

const REFUTE_SCHEMA = {
  type: 'object',
  required: ['batch', 'verdicts'],
  additionalProperties: false,
  properties: {
    batch: { type: 'string' },
    verdicts: {
      type: 'array',
      items: {
        type: 'object',
        required: ['id', 'verdict'],
        additionalProperties: false,
        properties: {
          id: { type: 'number' },
          verdict: { type: 'string', enum: ['ok', 'refuted'] },
          problem: { type: 'string', description: 'required when refuted: the specific claim and why it is wrong or unsupported' },
        },
      },
    },
  },
};

const writePrompt = (b) => `You are rewriting the EXPLANATIONS of ${b.n} Thai veterinary exam questions.

Input : C:\\Users\\palmz\\Desktop\\vet-mock\\.explain-fix\\${b.key}.in.json
Output: C:\\Users\\palmz\\Desktop\\vet-mock\\.explain-fix\\${b.key}.out.json   (write this file — it is the deliverable)

Every explanation in that file narrates the slide it came from:

    "สไลด์ให้ไทม์ไลน์ไว้เป็นชุดว่า obvious at 1-2-month-old chicken, regress at
     8-12 months และ remnant at 20 months ตัวเลือกที่ล่อให้พลาดคือชุด 1-2 สัปดาห์…"

The slide is where the answer CAME FROM. It is a citation, which already lives
in "verified". It is not the subject of the explanation. All 1,746 questions in
this repo's Year-4 semester-2 banks state the fact and move on; 94% of these do
not. Rewrite each one into the shape those banks use:

    <ทำไมข้อที่ถูกถึงถูก — กลไกหรือตัวเลข พูดตรงๆ ไม่อ้างเอกสาร>

    ❌ ทำไมข้ออื่นผิด
    — "<ตัวลวง>" = <จริงๆ มันคืออะไร หรือมันอยู่ตรงไหน>
    — "<ตัวลวง>" = <…>

    💡 <ตัวช่วยจำสั้น ๆ>

RULES, in the order they matter:

1. NEVER INVENT. This repo's first rule is that refusing beats fabricating.
   The fact you need for the first line is already inside the old explanation —
   it is just wrapped in narration. Unwrap it, do not replace it.

2. DO NOT INTRODUCE A NUMBER that is not already in the stem, the options, or
   the old explanation. A rewrite that adds "ประมาณ 10^5 CFU/ml" out of nowhere
   is worse than no rewrite. This is checked mechanically afterwards.

3. Account for EVERY wrong option, one "—" line each. Where you cannot say what
   a distractor actually is without guessing, write the honest shorter line you
   ARE sure of ("— X = คนละระบบ ไม่เกี่ยวกับ Y") and list that option in
   "unsure". An incomplete ❌ block is fine; a confident wrong one is not.

4. The 💡 line is OPTIONAL. Include it only when a genuine hook exists — a real
   mnemonic, a shape, a contrast worth holding. Never manufacture one to fill
   the slot. Roughly a third of the benchmark has one; most do not.

5. No "สไลด์", "เดค", "เอกสารนี้", "ตารางเขียน", "หน้า…". Not once. This is the
   defect being removed and it is checked mechanically.

6. Thai prose. Keep anatomical, microbiological and drug terms in English
   exactly as the question spells them. No middle-dot separators.

7. The recorded "answer" index is correct and is not up for debate. If you
   believe it is wrong, still explain the recorded answer, and say so in
   "unsure" — do not quietly explain a different option.

Subject: ${b.subject}. Read the input file first. Write the output file before
you return.`;

const refutePrompt = (b) => `You are checking veterinary explanations someone else just wrote. Your job is to REFUTE them, not to appreciate them.

Original questions : C:\\Users\\palmz\\Desktop\\vet-mock\\.explain-fix\\${b.key}.in.json
Rewritten explains : C:\\Users\\palmz\\Desktop\\vet-mock\\.explain-fix\\${b.key}.out.json

For each id, read the question, its options, the recorded answer, and the NEW
explanation. Mark it "refuted" if ANY of these hold:

  • a factual claim in it is wrong — a structure with the wrong function, an
    organism in the wrong group, a temperature or interval that is not right
  • it asserts something specific that cannot be supported from the question,
    its options, or general veterinary knowledge you are confident in
  • it introduces a number, organism or mechanism that appears nowhere in the
    question and that you cannot independently vouch for
  • it explains an option other than the recorded answer as correct
  • it contradicts itself, or the ❌ line for an option contradicts that
    option's own text
  • it still refers to a slide, deck or document

Mark "ok" only when you have actually checked the claims and they hold.

Default to "refuted" when you are unsure. A rewritten explanation that gets
dropped costs one question its polish; a wrong one teaches a student something
false and carries our citation while doing it.

When refuted, quote the specific claim in "problem". Do not rewrite anything —
you are the check, not the author.

Return a verdict for EVERY id in the output file.`;

phase('Rewrite');
const results = await pipeline(
  batches,
  (b) => agent(writePrompt(b), { label: `write:${b.key}`, phase: 'Rewrite', schema: WRITE_SCHEMA }),
  (written, b) => {
    if (!written) return null;
    return agent(refutePrompt(b), { label: `refute:${b.key}`, phase: 'Refute', schema: REFUTE_SCHEMA, effort: 'high' })
      .then((v) => ({ batch: b.key, written, verdicts: v }));
  },
);

const done = results.filter(Boolean);
const ok = done.reduce((a, r) => a + (r.verdicts?.verdicts || []).filter((v) => v.verdict === 'ok').length, 0);
const refuted = done.reduce((a, r) => a + (r.verdicts?.verdicts || []).filter((v) => v.verdict === 'refuted').length, 0);
log(`${done.length}/${batches.length} batches · ${ok} survived · ${refuted} refuted`);

return {
  batches: done.map((r) => ({
    key: r.batch,
    written: (r.written?.results || []).length,
    ok: (r.verdicts?.verdicts || []).filter((v) => v.verdict === 'ok').length,
    refuted: (r.verdicts?.verdicts || []).filter((v) => v.verdict === 'refuted').map((v) => ({ id: v.id, problem: v.problem })),
  })),
  failedBatches: batches.filter((b) => !done.some((d) => d.batch === b.key)).map((b) => b.key),
};
