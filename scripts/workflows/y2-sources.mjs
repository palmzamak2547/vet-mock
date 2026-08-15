export const meta = {
  name: 'y2-sources',
  description: 'Find a real, resolvable external source for every Year-2 note section',
  whenToUse: 'After a Year-2 subject has notes in the repo and before its wiki coverage gate can pass',
  phases: [
    { title: 'Source', detail: 'one agent per topic, proposes a citation per section' },
    { title: 'Screen', detail: 'a second reader checks each citation actually says what is claimed' },
  ],
};

const { root, subjectId, subjectName, topics } = args;
const outDir = `${root}/y2claims/${subjectId}`;
const notesFile = `src/data/notes-y2-${subjectId.replace(/^vet-/, '')}.js`;

const CLAIMS_SCHEMA = {
  type: 'object',
  required: ['topicId', 'claims'],
  additionalProperties: false,
  properties: {
    topicId: { type: 'string' },
    unsourceable: {
      type: 'array',
      description: 'sections that cannot be checked against literature, with the reason',
      items: {
        type: 'object',
        required: ['sectionHeading', 'reason'],
        additionalProperties: false,
        properties: { sectionHeading: { type: 'string' }, reason: { type: 'string' } },
      },
    },
    claims: {
      type: 'array',
      items: {
        type: 'object',
        required: ['topicId', 'sectionHeading', 'statement', 'supported', 'sourceKind', 'sourceTitle', 'journalOrOrg', 'year', 'locator', 'supportQuote'],
        additionalProperties: false,
        properties: {
          topicId: { type: 'string' },
          sectionHeading: { type: 'string' },
          statement: { type: 'string', description: 'the note claim, in one sentence' },
          supported: { type: 'boolean', description: 'false means the source was found and DISAGREES with the slide' },
          sourceKind: { type: 'string', enum: ['journal', 'textbook', 'guideline', 'database'] },
          pmid: { type: 'string' },
          doi: { type: 'string' },
          sourceTitle: { type: 'string' },
          journalOrOrg: { type: 'string' },
          year: { type: 'string' },
          locator: { type: 'string', description: 'page, section or figure inside the source' },
          url: { type: 'string' },
          supportQuote: { type: 'string', description: 'wording from the source that carries the claim' },
        },
      },
    },
  },
};

const SCREEN_SCHEMA = {
  type: 'object',
  required: ['topicId', 'rejected'],
  additionalProperties: false,
  properties: {
    topicId: { type: 'string' },
    rejected: {
      type: 'array',
      items: {
        type: 'object',
        required: ['sectionHeading', 'reason'],
        additionalProperties: false,
        properties: {
          sectionHeading: { type: 'string' },
          reason: { type: 'string', enum: ['identifier-not-real', 'source-does-not-say-this', 'quote-not-in-source', 'source-too-weak'] },
          detail: { type: 'string' },
        },
      },
    },
  },
};

const sourcePrompt = (t) => `Find a real external source for each section of one VetMock knowledge article.

Subject: ${subjectName} (${subjectId})
Topic id: ${t.t}
Article: ${t.title}
Sections: ${t.n}

Read the article's sections from ${notesFile} (grep for the topic id).

For each section, state its central claim in one sentence, then find a source
that actually supports it. Preferred order: a PubMed-indexed paper (give the
pmid), a paper with a DOI, a veterinary textbook, or an official guideline from
a named body.

THE HARD RULE: the identifier must be real. Every pmid and doi you return is
resolved against NCBI and Crossref before anything is written, and the returned
title is compared to the one you claim. An identifier written from memory will
be caught and the claim dropped, so look it up rather than recalling it. Use
the PubMed tools or web search — do not guess.

supportQuote must be wording that genuinely appears in the source, not a
paraphrase you find plausible.

If the source you find CONTRADICTS the slide, that is valuable, not a failure:
return the claim with supported:false and quote the disagreement. Those become
conflict notes so a student knows their lecturer's version differs from the
literature.

Some sections cannot be checked against literature at all — a slide listing the
lab schedule, a title slide, a page of images with no stated conclusion. Put
those in "unsourceable" WITH a specific reason. Do not invent a citation to
make a section look covered; an unsourceable section declared honestly is a
correct outcome, a fabricated citation is the worst possible one.

BEFORE returning, write your JSON to ${outDir}/${t.t}.claims.json.`;

const screenPrompt = (t) => `Check proposed citations for one VetMock article. Assume some are wrong.

Claims file: ${outDir}/${t.t}.claims.json
Article: ${t.title} (${t.t})

For each claim, decide whether to REJECT it:
  identifier-not-real      the pmid/doi does not resolve, or resolves to a different paper
  source-does-not-say-this the source is real but does not support the statement
  quote-not-in-source      the supportQuote does not appear in the source
  source-too-weak          a blog, a lecture slide from another university, an
                           unattributed website, or a secondary summary standing
                           in for the primary claim

Look identifiers up rather than trusting them. Reject when you cannot confirm —
an unverified citation that ships is worse than a section left uncovered,
because it looks checked and is not.

Return only rejections. An empty list means you confirmed every one.`;

phase('Source');

const results = await pipeline(
  topics,
  (t) => agent(sourcePrompt(t), {
    label: `source:${t.t}`,
    phase: 'Source',
    schema: CLAIMS_SCHEMA,
    effort: 'high',
  }),
  (claims, t) => claims
    ? agent(screenPrompt(t), {
        label: `screen:${t.t}`,
        phase: 'Screen',
        schema: SCREEN_SCHEMA,
        effort: 'high',
      }).then((s) => ({ topicId: t.t, claims, screen: s }))
    : null,
);

const ok = results.filter(Boolean);
const totalClaims = ok.reduce((n, r) => n + (r.claims.claims?.length || 0), 0);
const rejected = ok.flatMap((r) => (r.screen?.rejected || []).map((x) => ({ topicId: r.topicId, ...x })));
const unsourceable = ok.flatMap((r) => (r.claims.unsourceable || []).map((x) => ({ topicId: r.topicId, ...x })));

log(`${totalClaims} claims proposed, ${rejected.length} rejected on screening, ${unsourceable.length} declared unsourceable`);

return { subjectId, totalClaims, rejected, unsourceable };
