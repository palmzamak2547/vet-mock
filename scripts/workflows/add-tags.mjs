export const meta = {
  name: 'add-tags',
  description: 'Give the untagged Year 1-2 questions the 2-3 concept tags the rest of the corpus carries',
  whenToUse: 'After lint:question-standard shows a year at 0% for "2+ concept tags"',
  phases: [{ title: 'Tag', detail: 'one agent per batch reads each question and names what it is about' }],
};

const batches = args.batches;

const SCHEMA = {
  type: 'object',
  required: ['results'],
  additionalProperties: false,
  properties: {
    results: {
      type: 'array',
      items: {
        type: 'object',
        required: ['id', 'tags'],
        additionalProperties: false,
        properties: {
          id: { type: 'number' },
          tags: { type: 'array', minItems: 2, maxItems: 3, items: { type: 'string' } },
        },
      },
    },
  },
};

const prompt = (b) => `Give ${b.n} Thai veterinary exam questions their concept tags.

Input : C:\Users\palmz\Desktop\vet-mock\.tags-fix\${b.key}.in.json
Output: C:\Users\palmz\Desktop\vet-mock\.tags-fix\${b.key}.out.json   (WRITE this file — it is the deliverable)

Tags are how a student finds every question about one idea, so they name the
IDEA, not the paperwork. The rest of this corpus already carries them and the
convention is visible in these real examples:

    ["transition-period","NEB"]
    ["BHBA","subclinical-ketosis"]
    ["particle-size","penn-state-shaker"]
    ["nutritional-values","CP","NDF","ADF","NE"]
    ["locomotion-score","lameness"]

RULES

1. TWO or THREE tags. The corpus averages 2.4. Three only when the question
   genuinely sits at the meeting of three ideas.

2. Descriptive terms in lowercase kebab-case ("bone-marrow", "glycolysis",
   "counter-current"). Established abbreviations keep their own casing — NEB,
   BHBA, CP, NDF, ATP, SDS-PAGE, DNA. Do not lowercase an abbreviation into
   nonsense.

3. NAME THE CONCEPT, NOT THE CONTAINER. Never tag with the subject, the year,
   the exam, the word "question", or the topic id you were given. "biochem" and
   "histology" are useless — every question in the file would carry them. Tag
   what a student would search for: "michaelis-menten", "plasma-cell",
   "urea-cycle".

4. The tag must be about what the question ASKS. A question whose answer is
   competitive inhibition is tagged "competitive-inhibition" even if the stem
   says only "InhH". Read the options and the recorded answer, not just the
   stem.

5. English for technical terms, matching the spelling the question uses. Thai
   only where there is no established English term.

6. Two questions about the same idea must get the SAME tag, spelled the same
   way. Scan your own output before returning it: "bone-marrow" in one and
   "bonemarrow" in another splits a student's search in half.

Subject: ${b.subject}. Read the input, tag every id, write the output file
before you return.`;

phase('Tag');
const results = await pipeline(
  batches,
  (b) => agent(prompt(b), { label: `tag:${b.key}`, phase: 'Tag', schema: SCHEMA }).then((r) => ({ key: b.key, n: (r?.results || []).length })),
);

const done = results.filter(Boolean);
log(`${done.length}/${batches.length} batches · ${done.reduce((a, r) => a + r.n, 0)} tagged`);
return { batches: done, failed: batches.filter((b) => !done.some((d) => d.key === b.key)).map((b) => b.key) };
