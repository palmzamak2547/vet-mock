export const meta = {
  name: 'explain-round2',
  description: 'Rewrite the 19 explanations a refuter rejected, this time keeping every hedge the source had',
  whenToUse: 'After explain-rewrite leaves refuted items still narrating their deck',
  phases: [
    { title: 'Repair', detail: 'rewrite each rejected explanation with the refuter objection in hand' },
    { title: 'Refute', detail: 'a second independent reader tries to break the repair' },
  ],
};

const SCHEMA = {
  type: 'object',
  required: ['results'],
  additionalProperties: false,
  properties: {
    results: {
      type: 'array',
      items: {
        type: 'object',
        required: ['id', 'explain'],
        additionalProperties: false,
        properties: {
          id: { type: 'number' },
          explain: { type: 'string' },
          note: { type: 'string', description: 'what you changed to answer the objection' },
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

const DIR = 'C:\Users\palmz\Desktop\vet-mock\.explain-fix\round2';

const repair = `Nineteen Thai veterinary explanations were rewritten and then REJECTED by an
independent reader. Repair them.

Input : ${DIR}\refuted.json   — each entry carries the question, its options, the
        recorded answer, the ORIGINAL explanation, and "problem": the exact
        objection that killed the last attempt.
Output: ${DIR}\repaired.json   (WRITE this file — it is the deliverable)

Read every "problem" first. They share one shape: the rewrite took a statement
the original had ATTRIBUTED and turned it into a fact of its own.

    original : "สไลด์ระบุว่า X"                     ← attributed, safe
    rejected : "X"                                  ← now a claim we own, and wrong

That is what you must not do again. Concretely:

1. THE HEDGE IS THE POINT. If the original limited a denial to the source
   ("ไม่ใช่ตัวที่แหล่งอ้างอิงระบุ"), your version limits it the same way. Never
   promote it to "ไม่ใช่พาหะของโรคนี้" — that is how #105347 was killed, because
   Dermacentor genuinely is a piroplasmosis vector.

2. SAY LESS RATHER THAN SAY WRONG. A "—" line may state only what the option's
   own text and the original explanation support. If you cannot account for a
   distractor without reaching for outside knowledge you would have to defend,
   write the narrow true thing ("ไม่ใช่คำตอบที่โจทย์ถามถึง") or leave that line
   out. An incomplete ❌ block is fine.

3. DELETE A BAD 💡 RATHER THAN REPAIR IT. Several were killed by the hook alone
   — a false comparison, a heuristic that does not eliminate, arithmetic that
   does not hold. The hook is optional. If it is not both true and useful, cut
   it.

4. THE REJECTED CLAIM MUST BE GONE, not softened. #105035 said ILT inclusions
   are cytoplasmic; they are intranuclear. Do not write "อาจอยู่ใน cytoplasm".
   Either state the correct fact if you are certain of it, or say nothing about
   location.

5. Still no "สไลด์", "เดค", "เอกสารนี้", "ตารางเขียน", "หน้า…" — that is the
   defect being removed. Attribute to the subject matter, not to the document:
   "ที่บันทึกไว้ในเคสชุดนี้" is fine, "สไลด์บอกว่า" is not.

6. Do not introduce a number absent from the stem, the options or the original.

7. The recorded answer index is correct and is not up for debate.

Same three-part shape as the rest of the corpus: why the answer is right, then
❌ ทำไมข้ออื่นผิด with one "—" line per wrong option you can honestly account
for, then 💡 only if a true hook exists.

Read the file, repair all 19, write the output file before returning.`;

const refute = `Nineteen Thai veterinary explanations were rejected once, repaired, and now
need checking again. You did not write either version.

Questions + objections : ${DIR}\refuted.json
The repairs            : ${DIR}\repaired.json
Your verdicts          : ${DIR}\verdict.json   (WRITE this file — it is the deliverable)

For each id: read the original objection in "problem", then the repair. Mark
"refuted" if the repair still carries the rejected claim, softens it instead of
removing it, makes a NEW claim you cannot vouch for, keeps a hook that is false
or that does not actually discriminate, contradicts the recorded answer, or
still refers to a slide or document.

Mark "ok" only when the objection is genuinely answered AND nothing new is
wrong. Default to "refuted" when unsure — these have already failed once, and
a second wrong version is worse than an old honest one, which is what they
keep if you reject them.

Quote the specific sentence in "problem". Do not rewrite anything.`;

phase('Repair');
const repaired = await agent(repair, { label: 'repair:19', phase: 'Repair', schema: SCHEMA });

phase('Refute');
const verdicts = repaired
  ? await agent(refute, { label: 'refute:19', phase: 'Refute', schema: VERDICT, effort: 'high' })
  : null;

const ok = (verdicts?.verdicts || []).filter((v) => v.verdict === 'ok').length;
const no = (verdicts?.verdicts || []).filter((v) => v.verdict === 'refuted');
log(`repaired ${(repaired?.results || []).length} · ${ok} survived · ${no.length} rejected again`);

return { repaired: (repaired?.results || []).length, ok, refuted: no.map((v) => ({ id: v.id, problem: v.problem })) };
