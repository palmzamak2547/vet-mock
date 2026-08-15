export const meta = {
  name: 'y2-notes',
  description: 'Draft Year-2 study notes from lecture text, then adversarially verify every claim against the source',
  whenToUse: 'Year-2 lecture decks, one or several subjects per run, after their text has been extracted and mapped to topic ids',
  phases: [
    { title: 'Draft', detail: 'one agent per lecture deck, writes a topic JSON' },
    { title: 'Verify', detail: 'an independent reader tries to find claims the deck does not support' },
    { title: 'Repair', detail: 'the flagged wording is cut from the note, not argued with' },
  ],
};

// Decks may span several subjects in one run; each carries its own subject and
// output directory so a batch is just a longer deck list.
// Paths are passed as roots plus short names: a batch of 50 decks would
// otherwise spend most of its argument payload repeating the same prefix.
const { root, decks, names } = args;
const outOf = (d) => `${root}/y2notes/${d.s}`;
const txtOf = (d) => `${root}/y2text/${d.dir}/${d.f}`;
const subjectName = (d) => names[d.s] || d.s;

const SECTION_SCHEMA = {
  type: 'object',
  required: ['topicId', 'title', 'summary', 'sections'],
  additionalProperties: false,
  properties: {
    topicId: { type: 'string' },
    title: { type: 'string' },
    summary: { type: 'string' },
    lecturer: { type: 'string' },
    sections: {
      type: 'array',
      minItems: 1,
      items: {
        type: 'object',
        required: ['heading', 'source', 'body'],
        additionalProperties: false,
        properties: {
          heading: { type: 'string' },
          source: { type: 'string', description: 'deck name + page, e.g. "Midbrain p.7"' },
          body: {
            type: 'array',
            minItems: 1,
            items: {
              type: 'object',
              additionalProperties: false,
              properties: {
                text: { type: 'string' },
                bullets: { type: 'array', items: { type: 'string' } },
                sub: { type: 'string' },
                callout: { type: 'string' },
                kind: { type: 'string', enum: ['tip', 'warn', 'flag'] },
                body: { type: 'array', items: { type: 'object' } },
              },
            },
          },
        },
      },
    },
  },
};

const VERDICT_SCHEMA = {
  type: 'object',
  required: ['topicId', 'violations', 'checkedSections'],
  additionalProperties: false,
  properties: {
    topicId: { type: 'string' },
    checkedSections: { type: 'number' },
    violations: {
      type: 'array',
      items: {
        type: 'object',
        required: ['heading', 'problem', 'quote'],
        additionalProperties: false,
        properties: {
          heading: { type: 'string' },
          problem: { type: 'string', enum: ['not-in-source', 'contradicts-source', 'wrong-page', 'invented-detail'] },
          quote: { type: 'string', description: 'the exact drafted wording at fault' },
          why: { type: 'string' },
        },
      },
    },
  },
};

const draftPrompt = (d) => `You are writing study notes for Thai veterinary students from ONE lecture deck.

Subject: ${subjectName(d)} (${d.s})
Topic id: ${d.t}
Deck title: ${d.label}
Course block: ${d.section || 'unspecified'}
Source text: ${txtOf(d)}

Read that file with the Read tool. It is the text layer of the lecturer's own
slides. Line "PAGES=n" and "SECTION=..." at the top are metadata I added; the
rest is the deck. Pages are separated by form-feed characters, so the Nth block
is slide N.

Write the notes as JSON matching the schema.

RULES, in order of importance:

1. NEVER write anything the deck does not say. This is the whole point. If the
   slides are sparse, produce fewer sections — a short honest note beats a long
   padded one. Do not add mechanism, numbers, drug names, or clinical advice
   from your own knowledge, however confident you are.
2. Where the deck raises something and does not answer it, say so in the note:
   write "สไลด์ไม่ได้บอก" rather than filling the gap.
3. Every section carries "source" as the deck title plus the slide number you
   read it from, e.g. "${d.label} p.7". Count pages by the form feeds. If you
   genuinely cannot tell the page, write just the deck title — never guess a
   number.
4. Write in Thai, keeping anatomical, physiological and microbiological terms
   in English exactly as the slide spells them. This mirrors how Thai vet
   students speak and how the exam is written.
5. Use **bold** for the fact a student must retain. No middle-dot separators.
   No emoji inside body text.
6. Never reproduce a person's name, student id, handle or signature that appears
   in the text. Lecturer names printed on a title slide are fine.
7. The "summary" says what this deck actually covers, including honestly when
   much of it is administrative or is a slide of images with no text.

Body item shapes: {text}, {bullets:[...]}, {sub, body:[...]}, {callout, kind}.

BEFORE returning, write your JSON to ${outOf(d)}/${d.t}.json with the Write
tool. Return the same object.`;

const verifyPrompt = (d) => `You are checking drafted study notes against the lecture deck they claim to come from. Your job is to FIND FABRICATION, not to be agreeable.

Drafted notes: ${outOf(d)}/${d.t}.json
Source text:   ${txtOf(d)}

Read both. For every section, decide whether the deck actually supports what the
note says.

Report a violation when:
  not-in-source     the claim is nowhere in the deck, however true it may be
  contradicts-source the deck says something different
  wrong-page        the cited slide number does not hold that content
  invented-detail   a number, name, dose or mechanism the deck never states

Do NOT report: Thai phrasing you would have worded differently, a fact that is
correct and present, or a section that honestly says the slide does not tell us.

Quote the drafted wording exactly so it can be found and removed. If you are
unsure whether the deck supports a claim, report it — a note that survives this
pass is one a student will trust without checking.

Return every violation you find. An empty list is a real answer only if you
checked every section.`;

const REPAIR_SCHEMA = {
  type: 'object',
  required: ['topicId', 'removed', 'sectionsAfter'],
  additionalProperties: false,
  properties: {
    topicId: { type: 'string' },
    removed: { type: 'number' },
    sectionsAfter: { type: 'number' },
    note: { type: 'string' },
  },
};

const repairPrompt = (d, violations) => `Cut unsupported wording out of a drafted note. Do not defend it, do not rewrite it into something else — remove it.

File to edit: ${outOf(d)}/${d.t}.json
Source text:  ${txtOf(d)}

A reader checked this note against the deck and raised ${violations.length} problem(s):

${violations.map((v, i) => `${i + 1}. [${v.problem}] section "${v.heading}"
   wording: ${v.quote}
   ${v.why || ''}`).join('\n\n')}

For each one:
- not-in-source / invented-detail → delete that bullet, sentence or callout. If
  removing it empties the section, delete the section.
- contradicts-source → replace it with what the deck actually says, quoting the
  deck. If the deck is unclear, write "สไลด์ไม่ได้บอก" instead.
- wrong-page → check the source text and correct the page in "source". Do not
  delete the content for this one.

You may open the source text to confirm, but the burden is on the note: if you
cannot find the claim in the deck, it goes. A shorter honest note is the
correct outcome, and a section removed here is one nobody will have to
un-learn later.

Keep every other section byte-identical. Write the corrected JSON back to the
same path with the Write tool, then report how many items you removed.`;

phase('Draft');

const results = await pipeline(
  decks,
  (d) => agent(draftPrompt(d), {
    label: `draft:${d.t}`,
    phase: 'Draft',
    schema: SECTION_SCHEMA,
  }),
  (draft, d) => draft
    ? agent(verifyPrompt(d), {
        label: `verify:${d.t}`,
        phase: 'Verify',
        schema: VERDICT_SCHEMA,
        effort: 'high',
      }).then((v) => ({ topicId: d.t, label: d.label, draft, verdict: v }))
    : null,
  (r, d) => {
    const vs = r?.verdict?.violations || [];
    if (!r) return null;
    if (!vs.length) return { ...r, repair: { removed: 0, sectionsAfter: r.draft.sections.length } };
    return agent(repairPrompt(d, vs), {
      label: `repair:${d.t}`,
      phase: 'Repair',
      schema: REPAIR_SCHEMA,
    }).then((rep) => ({ ...r, repair: rep }));
  },
);

const ok = results.filter(Boolean);
const violations = ok.flatMap((r) => (r.verdict?.violations || []).map((v) => ({ topicId: r.topicId, ...v })));

const removed = ok.reduce((n, r) => n + (r.repair?.removed || 0), 0);
log(`${ok.length}/${decks.length} decks drafted, ${violations.length} violation(s) raised, ${removed} item(s) cut`);

return {
  drafted: ok.map((r) => ({
    topicId: r.topicId,
    label: r.label,
    sections: r.repair?.sectionsAfter ?? r.draft.sections.length,
    removed: r.repair?.removed || 0,
  })),
  violations,
};
