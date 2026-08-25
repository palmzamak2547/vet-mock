export const meta = {
  name: 'figure-reword',
  description: 'Reword the questions that point at a figure nobody can see, so each stands on its own or is dropped',
  whenToUse: 'After resolve-question-figures leaves questions whose answer is knowledge, not a reading off a picture',
  phases: [
    { title: 'Reword', detail: 'delete the reference to the picture, keep the question identical' },
    { title: 'Refute', detail: 'an independent reader checks the recorded answer is still the only correct one' },
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
        required: ['id', 'action'],
        additionalProperties: false,
        properties: {
          id: { type: 'number' },
          action: { type: 'string', enum: ['reword', 'drop'] },
          q: { type: 'string', description: 'required when action is reword' },
          reason: { type: 'string', description: 'required when action is drop' },
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

const DIR = 'C:\Users\palmz\Desktop\vet-mock\.fig-fix\reword';

const reword = `Twenty-two Thai veterinary questions point at a picture the student never sees
— "ตามแผนภาพ…", "จากภาพ…", "ตามผัง…". No figure is attached, so as written they
cannot be answered.

Input : ${DIR}\in.json
Output: ${DIR}\out.json   (WRITE this file — it is the deliverable)

For each one, decide between two actions.

**reword** — the answer is real veterinary knowledge and the picture was only
illustrating it. Delete the reference to the picture and change NOTHING else.

    "ตามแผนภาพทางเดินเลือดในหัวใจปลา เลือดไหลผ่านส่วนต่าง ๆ ตามลำดับใด…"
    →  "เลือดในหัวใจปลาไหลผ่านส่วนต่าง ๆ ตามลำดับใด…"

    sinus venosus → atrium → ventricle → bulbus arteriosus is fish cardiac
    anatomy; it is true with or without that slide.

**drop** — the answer can only be read off the picture: a proportion, a value
on an axis, which label an arrow points at, a count of items in a figure. Also
drop anything asking what a document recorded rather than what is true.

RULES

1. A reworded stem must introduce NO new word carrying information — no number,
   organism, structure or English term that was not already in the stem. You are
   deleting a reference and repairing the grammar around it, nothing more.

2. Natural Thai. Do not leave a dangling connective ("ตาม … คือ", "ได้ถูกต้องตาม").
   Read your sentence back before returning it. A previous pass produced
   "โครงสร้างคู่ Plasma cell และ Golgi apparatus เดคสั่งให้หา ใดบ้าง", which is
   the failure to avoid.

3. THE RECORDED ANSWER MUST STAY THE ONLY CORRECT ONE. This is where judgement
   matters most. If deleting the reference lets a second option become
   defensible, choose **drop** and say so. Three questions were dropped for
   exactly this in an earlier pass — an SCC cut-off where 200,000 and 400,000
   are both real thresholds, a CCP item where three options were all genuine
   CCPs, and a pasteurisation question where 72-75°C/15-20 s is as defensible
   as the 83-85°C the slide gave.

4. Numbers in a stem are a warning sign. "ผลผลิตรวม 541,239 ตัน กลุ่มใดมีสัดส่วน
   มากที่สุด และคิดเป็นเท่าใด" is reading a chart — drop. But "ระยะฟักตัว…คือช่วงใด"
   is a fact — reword.

5. Never mention สไลด์ เดค เอกสาร แผนผัง แผนภาพ หน้า in the result.

Read the file, decide all 22, write the output before returning.`;

const refute = `Twenty-two Thai veterinary questions had a reference to an unseen picture removed.
You did not do the rewording. Check it.

Originals : ${DIR}\in.json
Rewordings: ${DIR}\out.json
Verdicts  : ${DIR}\verdict.json   (WRITE this file — it is the deliverable)

For every id, mark "refuted" if ANY of these hold:

  • the reworded stem changes what is being asked
  • it introduces a word carrying information that was not in the original
  • the recorded answer is no longer the ONLY defensible option once the
    picture is gone — check every distractor against the reworded stem, not
    against the original
  • the Thai is broken, or a connective dangles where the deleted phrase was
  • it still refers to a picture or document
  • something marked "drop" would in fact have survived a simple rewording, or
    something marked "reword" actually needed the picture

Mark "ok" only after checking the distractors yourself. Default to "refuted"
when unsure: a dropped question costs the bank one item, a question with two
defensible answers teaches a student that their correct reasoning was wrong.

Quote the specific problem. Do not rewrite anything.`;

phase('Reword');
const done = await agent(reword, { label: 'reword:22', phase: 'Reword', schema: SCHEMA });

phase('Refute');
const verdicts = done
  ? await agent(refute, { label: 'refute:22', phase: 'Refute', schema: VERDICT, effort: 'high' })
  : null;

const list = done?.results || [];
const ok = (verdicts?.verdicts || []).filter((v) => v.verdict === 'ok').length;
const no = (verdicts?.verdicts || []).filter((v) => v.verdict === 'refuted');
log(`${list.filter((r) => r.action === 'reword').length} reworded · ${list.filter((r) => r.action === 'drop').length} dropped · ${ok} cleared · ${no.length} rejected`);

return {
  reworded: list.filter((r) => r.action === 'reword').length,
  dropped: list.filter((r) => r.action === 'drop').map((r) => ({ id: r.id, reason: r.reason })),
  ok,
  refuted: no.map((v) => ({ id: v.id, problem: v.problem })),
};
