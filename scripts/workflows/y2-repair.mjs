export const meta = {
  name: 'y2-repair',
  description: 'Cut the wording an adversarial reader flagged as unsupported out of drafted Year-2 notes',
  whenToUse: 'After a y2-notes run that raised violations but had no repair stage',
  phases: [{ title: 'Repair', detail: 'one agent per flagged topic' }],
};

const { root, subject, dir, violationsFile, topics } = args;

const SCHEMA = {
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

const prompt = (t) => `Cut unsupported wording out of a drafted note. Do not defend it, do not rewrite it into something else — remove it.

File to edit:  ${root}/y2notes/${subject}/${t.t}.json
Source deck:   ${root}/y2text/${dir}/${t.f}
Violations:    ${violationsFile}  (a JSON object keyed by topic id — read it and take ONLY the entry for "${t.t}")

For each violation on your topic:
- not-in-source / invented-detail → delete that bullet, sentence or callout. If
  removing it empties the section, delete the section.
- contradicts-source → replace it with what the deck actually says. If the deck
  is unclear, write "สไลด์ไม่ได้บอก" instead.
- wrong-page → open the deck, find the slide that really carries the content,
  and correct the page in "source". Do not delete the content for this one.

Open the deck to confirm, but the burden is on the note: if you cannot find the
claim in the slides, it goes. A shorter honest note is the correct outcome, and
a claim removed here is one no student has to un-learn later.

Keep every other section unchanged. Write the corrected JSON back to the same
path with the Write tool, then report how many items you removed.`;

phase('Repair');

const out = await parallel(topics.map((t) => () =>
  agent(prompt(t), { label: `repair:${t.t}`, phase: 'Repair', schema: SCHEMA })));

const ok = out.filter(Boolean);
log(`${ok.length}/${topics.length} topics repaired, ${ok.reduce((n, r) => n + (r.removed || 0), 0)} item(s) cut`);
return { subject, repaired: ok };
