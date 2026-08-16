export const meta = {
  name: 'y2-resource',
  description: 'Re-source the specific sections a first sourcing pass could not settle',
  whenToUse: 'After lint:wiki-coverage names the sections still resting on the lecture slide',
  phases: [{ title: 'Source', detail: 'one agent per named section' }],
};

const { root, subjectId, subjectName, notesFile, sections } = args;
const outDir = `${root}/y2claims/${subjectId}`;

const SCHEMA = {
  type: 'object',
  required: ['topicId', 'sectionHeading', 'found', 'claims'],
  additionalProperties: false,
  properties: {
    topicId: { type: 'string' },
    sectionHeading: { type: 'string' },
    found: { type: 'boolean' },
    whyNot: { type: 'string', description: 'if found is false, why this section cannot be sourced' },
    claims: {
      type: 'array',
      items: {
        type: 'object',
        required: ['topicId', 'sectionHeading', 'statement', 'supported', 'sourceKind', 'sourceTitle', 'journalOrOrg', 'year', 'locator', 'supportQuote'],
        additionalProperties: false,
        properties: {
          topicId: { type: 'string' },
          sectionHeading: { type: 'string' },
          statement: { type: 'string' },
          supported: { type: 'boolean' },
          sourceKind: { type: 'string', enum: ['journal', 'textbook', 'guideline'] },
          pmid: { type: 'string' },
          doi: { type: 'string' },
          sourceTitle: { type: 'string' },
          journalOrOrg: { type: 'string' },
          year: { type: 'string' },
          locator: { type: 'string' },
          url: { type: 'string' },
          supportQuote: { type: 'string' },
        },
      },
    },
  },
};

const prompt = (s) => `Source ONE section of a VetMock article that an earlier pass could not settle.

Subject: ${subjectName} (${subjectId})
Topic id: ${s.t}
Section:  ${s.heading}
Notes:    ${notesFile}  (grep for the topic id, then find this section)

Why it is still open: ${s.reason}
${s.hint ? `\nA reviewer left this lead, which you should check rather than trust:\n${s.hint}\n` : ''}
Read the section, state its central claim in one sentence, and find a source
that supports it.

THE HARD RULE, and the reason the earlier attempt failed: the claim is only
accepted if it carries a **pmid**, a **doi**, or is a **named textbook or
guideline**. A reference work with no identifier — a manual website, a
practice magazine, an unattributed page — is rejected by the ingester however
authoritative it reads. Prefer a PubMed-indexed paper; a named veterinary
textbook with its chapter is fine.

Look the identifier up. Every one is resolved against NCBI and Crossref and
compared to the title you claim, so an identifier written from memory will be
caught and the claim dropped.

supportQuote must be wording that genuinely appears in the source.

If the source you find contradicts the slide, return it with supported:false
and quote the disagreement — that is a real finding, not a failure.

If after searching you cannot source it, set found:false and say precisely why.
An honest miss is fine; an invented citation is the one unacceptable outcome.

BEFORE returning, write your JSON to ${outDir}/${s.t}__${s.slug}.resource.json.`;

phase('Source');

const out = await parallel(sections.map((s) => () =>
  agent(prompt(s), { label: `resource:${s.slug}`, phase: 'Source', schema: SCHEMA, effort: 'high' })));

const ok = out.filter(Boolean);
const claims = ok.flatMap((r) => r.claims || []);
const missed = ok.filter((r) => !r.found).map((r) => ({ topicId: r.topicId, sectionHeading: r.sectionHeading, whyNot: r.whyNot }));
log(`${claims.length} claim(s) proposed for ${sections.length} section(s), ${missed.length} still unsourced`);
return { subjectId, claims: claims.length, missed };
