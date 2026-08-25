export const meta = {
  name: 'y1-explain',
  description: 'Expand 298 thin Year-1 explanations into the corpus shape without inventing what the source never said',
  whenToUse: 'When a year sits at 0% for "explains every distractor"',
  phases: [
    { title: 'Expand', detail: 'one agent per batch adds why-each-wrong to explanations averaging 145 characters' },
    { title: 'Refute', detail: 'an independent reader attacks every claim the expansion added' },
  ],
};

const batches = args.batches;

const WRITE_SCHEMA = {
  type: 'object',
  required: ['results'],
  additionalProperties: false,
  properties: {
    results: {
      type: 'array',
      items: {
        type: 'object', required: ['id', 'explain'], additionalProperties: false,
        properties: {
          id: { type: 'number' },
          explain: { type: 'string' },
          unsure: { type: 'array', items: { type: 'string' }, description: 'distractors you could not honestly account for' },
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
        type: 'object', required: ['id', 'verdict'], additionalProperties: false,
        properties: {
          id: { type: 'number' },
          verdict: { type: 'string', enum: ['ok', 'refuted'] },
          problem: { type: 'string' },
        },
      },
    },
  },
};

const write = (b) => `Expand the explanations of ${b.n} Year-1 Thai veterinary questions.

Input : C:\Users\palmz\Desktop\vet-mock\.y1exp\${b.key}.in.json
Output: C:\Users\palmz\Desktop\vet-mock\.y1exp\${b.key}.out.json   (WRITE this file — it is the deliverable)

These explanations average 145 characters. The rest of the corpus averages 321
and carries this shape:

    <ทำไมข้อที่ถูกถึงถูก — กลไกหรือตัวเลข พูดตรงๆ>

    ❌ ทำไมข้ออื่นผิด
    — "<ตัวลวง>" = <จริงๆ มันคืออะไร หรือมันอยู่ตรงไหน>
    — "<ตัวลวง>" = <…>

    💡 <ตัวช่วยจำสั้น ๆ>

⚠️ READ THIS BEFORE YOU START. Because the existing text is so short, you will
be tempted to supply the missing content from memory. That is exactly how the
last pass of this kind produced explanations that had to be thrown away:

    nucleus ambiguus placed dorsomedially — it is ventrolateral
    ILT inclusions called cytoplasmic — herpesviruses build in the nucleus
    the external capsule declared not a border of the putamen, when by
      definition it is the white matter between putamen and claustrum
    AD/BC declared not an odds ratio, when that is the cross-product form
    "peripheral vestibular disease gives nystagmus in every direction" —
      which deletes the sign that localises a lesion as central

Every one of those was written confidently and read as authoritative. A second
reader will attack yours the same way.

RULES

1. THE FIRST LINE COMES FROM THE OLD TEXT. Whatever fact the old explanation
   carries, keep it. You are adding to it, not replacing it.

2. A "—" LINE MAY ONLY SAY WHAT YOU ARE SURE OF. State what the distractor
   actually is, or where it actually belongs. Where you would have to reach for
   something you could not defend, write the narrow true thing ("— X = คนละ
   ระบบ ไม่เกี่ยวกับ Y") and name that option in "unsure". An incomplete ❌
   block is fine. A confident wrong one is not.

3. DO NOT HARDEN A HEDGE. If the old text attributes something ("ที่บรรยายไว้
   ระบุว่า…"), your version attributes it too. Never promote an attributed
   statement into a fact of your own.

4. NO NUMBER that is not already in the stem, the options or the old text.
   Checked mechanically.

5. 💡 IS OPTIONAL and must be TRUE and USEFUL. A hook that does not actually
   discriminate is worse than none — one was rejected for claiming every
   distractor used a lower concentration when one used the identical value.
   Cut it rather than force it.

6. Never write สไลด์ เดค เอกสาร ตาราง แผนภาพ หน้า. Attribute to the subject
   matter, not to a document.

7. The recorded answer index is correct and is not up for debate.

8. Thai prose, technical terms in English exactly as the question spells them.
   No middle-dot separators.

Subject: ${b.subject}. Read the input, expand every id, write the output file
before you return.`;

const refute = (b) => `Explanations for ${b.n} Year-1 questions were just expanded by someone else. Attack them.

Originals : C:\Users\palmz\Desktop\vet-mock\.y1exp\${b.key}.in.json
Expansions: C:\Users\palmz\Desktop\vet-mock\.y1exp\${b.key}.out.json
Verdicts  : C:\Users\palmz\Desktop\vet-mock\.y1exp\${b.key}.verdict.json   (WRITE this file — it is the deliverable)

The originals are very short, so almost everything in the expansion is NEW and
unvouched-for. That is what you are checking.

Mark **refuted** when:

  • any factual claim is wrong — a structure with the wrong function, a
    molecule in the wrong pathway, an enzyme acting on the wrong substrate,
    a value that is not right
  • it asserts something specific you cannot independently vouch for
  • it takes something the original ATTRIBUTED and states it as fact
  • it introduces a number, organism or mechanism absent from the question
  • the ❌ line for an option contradicts that option's own text, or the
    explanation contradicts itself
  • a 💡 hook is false, or does not actually separate the answer from the
    distractors
  • it explains an option other than the recorded answer as correct
  • it names a slide, deck, document or table

Mark "ok" only after checking the claims. Default to "refuted" when unsure — a
rejected expansion keeps the short original, which is where it is today and
harms nobody, while a wrong one teaches error under our citation.

Quote the specific claim in "problem". Do not rewrite anything. Return a
verdict for EVERY id.`;

phase('Expand');
const results = await pipeline(
  batches,
  (b) => agent(write(b), { label: `expand:${b.key}`, phase: 'Expand', schema: WRITE_SCHEMA }),
  (written, b) => {
    if (!written) return null;
    return agent(refute(b), { label: `refute:${b.key}`, phase: 'Refute', schema: VERDICT, effort: 'high' })
      .then((v) => ({ batch: b.key, written: (written.results || []).length, verdicts: v }));
  },
);

const done = results.filter(Boolean);
const ok = done.reduce((a, r) => a + (r.verdicts?.verdicts || []).filter((v) => v.verdict === 'ok').length, 0);
const no = done.flatMap((r) => (r.verdicts?.verdicts || []).filter((v) => v.verdict === 'refuted').map((v) => ({ id: v.id, problem: v.problem })));
log(`${done.length}/${batches.length} batches · ${ok} cleared · ${no.length} refuted`);
return { batches: done.map((r) => ({ key: r.batch, written: r.written })), ok, refuted: no, failed: batches.filter((b) => !done.some((d) => d.batch === b.key)).map((b) => b.key) };
