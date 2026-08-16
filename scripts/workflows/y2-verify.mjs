export const meta = {
  name: 'y2-verify',
  description: 'Verify drafted Year-2 notes against their deck and cut what the deck does not carry',
  whenToUse: 'For topics whose draft exists but whose verify or repair did not finish',
  phases: [
    { title: 'Verify', detail: 'one reader per topic, looking for claims the deck does not support' },
    { title: 'Repair', detail: 'cut the flagged wording, working from the findings alone' },
  ],
};

// Costed deliberately. The earlier pipeline read every deck three times at high
// effort and ate half a weekly limit in a day: draft read the slides, verify
// read the slides AND the draft again, repair read both a third time. Here
// verify runs at inherited effort, and repair is given the findings only — it
// does not reopen the deck, because the finding already quotes what to cut and
// says why.
const { root, topics } = args;
const src = (t) => `${root}/y2text/${t.dir}/${t.f}`;
const draft = (t) => `${root}/y2notes/${t.s}/${t.t}.json`;

const VERDICT = {
  type: 'object',
  required: ['topicId', 'violations'],
  additionalProperties: false,
  properties: {
    topicId: { type: 'string' },
    violations: {
      type: 'array',
      items: {
        type: 'object',
        required: ['heading', 'problem', 'quote'],
        additionalProperties: false,
        properties: {
          heading: { type: 'string' },
          problem: { type: 'string', enum: ['not-in-source', 'contradicts-source', 'wrong-page', 'invented-detail'] },
          quote: { type: 'string' },
          why: { type: 'string' },
          replacement: { type: 'string', description: 'for contradicts-source and wrong-page: what the deck actually says, or the right page' },
        },
      },
    },
  },
};

const REPAIR = {
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

const verifyPrompt = (t) => `Check drafted study notes against the lecture deck they claim to come from. Your job is to FIND FABRICATION, not to be agreeable.

Drafted notes: ${draft(t)}
Source text:   ${src(t)}

Read both. For every section, decide whether the deck actually supports what the
note says.

Report a violation when:
  not-in-source      the claim is nowhere in the deck, however true it may be
  contradicts-source the deck says something different
  wrong-page         the cited slide number does not hold that content
  invented-detail    a number, name, dose or mechanism the deck never states

Do NOT report: Thai phrasing you would have worded differently, a fact that is
correct and present, or a section that honestly says the slide does not tell us.

Quote the drafted wording EXACTLY, so it can be found and cut without reopening
the deck. For contradicts-source and wrong-page also fill "replacement" with
what the deck actually says, or the correct page — whoever fixes this will work
from your finding alone, so a finding without a replacement can only be deleted.

If you are unsure whether the deck supports a claim, report it. A note that
survives this pass is one a student will trust without checking.`;

const repairPrompt = (t, vs) => `Cut unsupported wording out of a drafted note. Do not defend it, do not research it — a reader has already checked it against the deck, and you are applying their findings.

File to edit: ${draft(t)}

${vs.length} finding(s):

${vs.map((v, i) => `${i + 1}. [${v.problem}] section "${v.heading}"
   wording: ${v.quote}
   ${v.why || ''}${v.replacement ? `\n   deck actually says: ${v.replacement}` : ''}`).join('\n\n')}

For each:
- not-in-source / invented-detail → delete that bullet, sentence or callout. If
  removing it empties the section, delete the section.
- contradicts-source → replace it with the wording given above. If no
  replacement was given, delete it rather than guessing.
- wrong-page → correct the page in "source" from the finding. Keep the content.

Keep every other section unchanged. A shorter honest note is the correct
outcome. Write the corrected JSON back to the same path, then report how many
items you removed.`;

phase('Verify');

const results = await pipeline(
  topics,
  (t) => agent(verifyPrompt(t), { label: `verify:${t.t}`, phase: 'Verify', schema: VERDICT }),
  (v, t) => {
    const vs = v?.violations || [];
    if (!v) return null;
    if (!vs.length) return { topicId: t.t, removed: 0, violations: 0 };
    return agent(repairPrompt(t, vs), { label: `repair:${t.t}`, phase: 'Repair', schema: REPAIR })
      .then((r) => ({ topicId: t.t, removed: r?.removed || 0, violations: vs.length }));
  },
);

const ok = results.filter(Boolean);
log(`${ok.length}/${topics.length} topics checked, ${ok.reduce((n, r) => n + r.violations, 0)} finding(s), ${ok.reduce((n, r) => n + r.removed, 0)} item(s) cut`);
return { checked: ok.length, results: ok };
