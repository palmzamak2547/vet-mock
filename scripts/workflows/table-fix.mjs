export const meta = {
  name: 'table-fix',
  description: 'Remove references to a table in the deck from 37 stems and 33 explanations, or drop what cannot survive it',
  whenToUse: 'After the ตาราง patterns were added to the document rule and surfaced pre-existing defects',
  phases: [
    { title: 'Fix', detail: 'stems reworded or dropped; explanations restated as facts' },
    { title: 'Refute', detail: 'an independent reader checks the answer is still uniquely correct and nothing new was asserted' },
  ],
};

const DIR = 'C:\Users\palmz\Desktop\vet-mock\.table-fix';

const FIX_SCHEMA = {
  type: 'object',
  required: ['stems', 'explains'],
  additionalProperties: false,
  properties: {
    stems: {
      type: 'array',
      items: {
        type: 'object', required: ['id', 'action'], additionalProperties: false,
        properties: {
          id: { type: 'number' },
          action: { type: 'string', enum: ['reword', 'drop'] },
          q: { type: 'string' },
          reason: { type: 'string' },
        },
      },
    },
    explains: {
      type: 'array',
      items: {
        type: 'object', required: ['id', 'explain'], additionalProperties: false,
        properties: { id: { type: 'number' }, explain: { type: 'string' } },
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
        type: 'object', required: ['id', 'kind', 'verdict'], additionalProperties: false,
        properties: {
          id: { type: 'number' },
          kind: { type: 'string', enum: ['stem', 'explain'] },
          verdict: { type: 'string', enum: ['ok', 'refuted'] },
          problem: { type: 'string' },
        },
      },
    },
  },
};

const fix = `A table printed in a lecture deck is a document, exactly like a slide. These
questions point at one — "ตามตาราง…", "จากตาราง…", "ตาราง X ระบุว่า…" — so a
student who never saw that table cannot follow them.

Stems       : ${DIR}\stems.json      (37)
Explanations: ${DIR}\explains.json   (33)
Output      : ${DIR}\out.json        (WRITE this file — it is the deliverable)

Return {"stems":[…],"explains":[…]}.

FOR EACH STEM, choose:

**reword** — the answer is real veterinary knowledge and the table was only
where it was written down. Delete the reference, change nothing else.

    "ตามตารางเปรียบเทียบ cytoskeleton microtubule มีเส้นผ่านศูนย์กลางเท่าใด…"
    →  "Microtubule มีเส้นผ่านศูนย์กลางเท่าใด…"

**drop** — the question is about the table itself: which row, which cell, what
was printed, what the course schedule says. "แถว m.m ของ forestomach ทั้งสาม
ให้ผลอย่างไร" is reading a row. "ตามตารางของรายวิชา 3107508 กำหนดสอบ Mid-term
Examination ในช่วงวันที่ใด" is a timetable, not veterinary knowledge.

Also drop if deleting the reference leaves more than one defensible answer.
That test has already caught real cases — an SCC cut-off where 200,000 and
400,000 are both used, a CCP question where three options were genuine CCPs.

FOR EACH EXPLANATION: state the fact directly. The fact is already inside the
old text, wrapped in narration about the table — unwrap it, do not replace it.
Keep the corpus shape: why the answer is right, then ❌ ทำไมข้ออื่นผิด with one
"—" line per wrong option, then 💡 only if a true hook exists.

RULES THAT DECIDE WHETHER THIS IS ACCEPTED

1. Do NOT harden a hedge. Where the original said the source states X, your
   version says that too. Nineteen explanations were rejected in an earlier
   pass for exactly this — dropping the attribution and asserting X as fact,
   which produced "nucleus ambiguus is dorsomedial" and "ILT inclusions are
   cytoplasmic". Attribute to the course, never to the document: "ที่บรรยายไว้
   ในวิชานี้" is fine, "ตารางระบุว่า" is not.

2. Introduce no number, organism or term that was not already in the stem, the
   options, or the old text. This is checked mechanically.

3. Never write สไลด์ เดค เอกสาร ตาราง แผนภาพ หน้า in any output.

4. The recorded answer index is correct and is not up for debate.

5. Natural Thai. Read each sentence back — a dangling connective where the
   deleted phrase used to be is the failure this keeps producing.

Read both files, decide everything, write the output before returning.`;

const refute = `Someone removed references to a lecture-deck table from 37 stems and 33
explanations. You did not do it. Break it.

Originals : ${DIR}\stems.json and ${DIR}\explains.json
The fixes : ${DIR}\out.json
Verdicts  : ${DIR}\verdict.json   (WRITE this file — it is the deliverable)

Return one verdict per id with "kind" set to "stem" or "explain".

Mark **refuted** when:

  • a reworded stem changes what is asked, or introduces a word carrying
    information that was not there
  • the recorded answer is no longer the ONLY defensible option once the table
    is gone — check every distractor against the NEW stem
  • something marked "drop" would plainly have survived a simple rewording, or
    something marked "reword" really was asking about the table
  • an explanation asserts as fact something the original had attributed, or
    states anything you cannot vouch for
  • the Thai is broken or a connective dangles
  • anything still names a slide, deck, document or table

Mark "ok" only after checking the distractors yourself. Default to "refuted"
when unsure — a rejected item keeps its current text, which is where it is
today and harms nobody, while a wrong one teaches error under our citation.

Quote the specific problem. Do not rewrite anything.`;

phase('Fix');
const done = await agent(fix, { label: 'fix:70', phase: 'Fix', schema: FIX_SCHEMA });

phase('Refute');
const verdicts = done
  ? await agent(refute, { label: 'refute:70', phase: 'Refute', schema: VERDICT, effort: 'high' })
  : null;

const vs = verdicts?.verdicts || [];
const ok = vs.filter((v) => v.verdict === 'ok').length;
const no = vs.filter((v) => v.verdict === 'refuted');
log(`${(done?.stems || []).length} stems · ${(done?.explains || []).length} explains · ${ok} cleared · ${no.length} rejected`);

return {
  stems: (done?.stems || []).length,
  dropped: (done?.stems || []).filter((s) => s.action === 'drop').map((s) => ({ id: s.id, reason: s.reason })),
  explains: (done?.explains || []).length,
  ok,
  refuted: no.map((v) => ({ id: v.id, kind: v.kind, problem: v.problem })),
};
