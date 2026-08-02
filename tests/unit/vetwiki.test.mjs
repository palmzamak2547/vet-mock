// VetWiki foundation — unit tests (stable ids, adapter, verification, validation, provenance)
import assert from 'node:assert/strict';
import test from 'node:test';

import { slug, sectionId, topicId, wikiTitle } from '../../src/lib/vetwiki/schema.js';
import { noteToKnowledge, verifiedClaimCount } from '../../src/lib/vetwiki/adapter.js';
import { validateTopic } from '../../src/lib/vetwiki/validate.js';
import { loadTopic, provenanceSummary, listTopics, verificationFor } from '../../src/lib/vetwiki/index.js';

test('stable ids are deterministic and independent of order/index', () => {
  assert.equal(sectionId('com5', 'rabies', 'Diagnosis'), 'com5--rabies--diagnosis');
  assert.equal(sectionId('com5', 'rabies', 'Transmission + pathogenesis'), 'com5--rabies--transmission-pathogenesis');
  // Same heading → same id regardless of when/where it appears.
  assert.equal(sectionId('com5', 'rabies', 'Overview'), sectionId('com5', 'rabies', 'Overview'));
  assert.equal(topicId('com5', 'rabies'), 'com5--rabies');
  assert.equal(slug(''), 'section'); // never empty
});

test('adapter imports note sections honestly (derived-note / draft) and carries source locators', () => {
  const note = {
    title: 'T', summary: 's', icon: '🦇', lecturer: 'L',
    sections: [
      { heading: 'Overview', source: 'Rabies.pdf p.1-6', body: [{ bullets: ['a'] }] },
      { heading: 'Diagnosis', source: 'Rabies.pdf p.12-18', body: [{ bullets: ['b'] }] },
    ],
  };
  const k = noteToKnowledge('com5', 'rabies', note);
  assert.equal(k.id, 'com5--rabies');
  assert.equal(k.sections.length, 2);
  const overview = k.sections.find((s) => s.id === 'com5--rabies--overview');
  assert.equal(overview.evidenceStatus, 'derived-note');
  assert.equal(overview.reviewStatus, 'draft');
  assert.equal(overview.sourceRefs[0].kind, 'lecture-note');
  assert.equal(overview.sourceRefs[0].locator, 'Rabies.pdf p.1-6');
  // original body preserved for the app renderer
  assert.deepEqual(overview.body, [{ bullets: ['a'] }]);
});

test('verification overlay promotes real rabies claims against real sources', () => {
  const k = loadTopic('com5', 'rabies');
  assert.ok(k, 'rabies topic loads from the real note corpus');
  const dx = k.sections.find((s) => s.id === 'com5--rabies--diagnosis');
  assert.ok(dx, 'diagnosis section exists');
  const fat = (dx.claims || []).find((c) => c.id === 'com5--rabies--diagnosis--fat-standard');
  assert.ok(fat, 'FAT-standard claim present');
  assert.equal(fat.reviewStatus, 'verified');
  assert.equal(fat.evidenceStatus, 'established');
  assert.equal(fat.sourceRefs[0].sourceId, 'woah-tahm-rabies');
  assert.equal(fat.review.method, 'reference-cross-check');
  assert.ok(verifiedClaimCount(k) >= 3, 'at least the 3 seeded verified claims');
});

test('the real rabies topic passes validation with zero errors', () => {
  const k = loadTopic('com5', 'rabies');
  const { ok, problems } = validateTopic(k, { useScope: 'learning' });
  const errors = problems.filter((p) => p.level === 'error');
  assert.equal(errors.length, 0, `unexpected validation errors: ${JSON.stringify(errors)}`);
  assert.equal(ok, true);
});

test('validation REJECTS fabricated / unsupported / laundered claims', () => {
  const bad = {
    id: 'x--y', subject: 'x', topic: 'y', title: 't', version: 1, sourceRefs: [],
    sections: [{
      id: 'x--y--s', heading: 's', body: [], useScopes: ['learning'],
      evidenceStatus: 'established', reviewStatus: 'draft', sourceRefs: [], // above derived-note, no source
      claims: [
        { id: 'c1', statement: 'fabricated', evidenceStatus: 'established', reviewStatus: 'verified', sourceRefs: [{ sourceId: 'does-not-exist' }], review: { reviewedBy: 'reference-verified', method: 'reference-cross-check' } },
        { id: 'c2', statement: 'no source', evidenceStatus: 'established', reviewStatus: 'verified', sourceRefs: [], review: { reviewedBy: 'reference-verified', method: 'reference-cross-check' } },
        { id: 'c3', statement: 'laundered', evidenceStatus: 'established', reviewStatus: 'verified', sourceRefs: [{ sourceId: 'woah-tahm-rabies' }], review: { reviewedBy: 'reference-verified', method: 'human-domain-owner' } },
      ],
    }],
  };
  const { ok, problems } = validateTopic(bad);
  const codes = new Set(problems.filter((p) => p.level === 'error').map((p) => p.code));
  assert.equal(ok, false);
  assert.ok(codes.has('unsupported-as-supported'), 'section evidence without source flagged');
  assert.ok(codes.has('dangling-source'), 'nonexistent source flagged');
  assert.ok(codes.has('verified-no-source'), 'verified claim without source flagged');
  assert.ok(codes.has('machine-as-human'), 'machine review claiming human method flagged');
});

test('provenance summary reports verified count + real cited sources, no fabrication', () => {
  const k = loadTopic('com5', 'rabies');
  const p = provenanceSummary(k);
  assert.ok(p.verifiedClaimCount >= 3);
  assert.ok(p.sources.length >= 1);
  // Every cited source is a real registry entry with a full citation string.
  for (const s of p.sources) assert.ok(s.citation && s.organization, 'cited source is real + attributable');
  assert.match(p.headline, /โน้ตเลกเชอร์/);
});

test('registry lists the flagship rabies topic', () => {
  const topics = listTopics();
  const rabies = topics.find((t) => t.id === 'com5--rabies');
  assert.ok(rabies && rabies.flagship);
});

// Growing guard: every topic added to the registry must load and validate.
// This is what stops a new topic (or a renamed heading that orphans a
// verification key) from silently shipping broken provenance.
test('EVERY registered topic loads and validates with zero errors', () => {
  const topics = listTopics();
  assert.ok(topics.length >= 5, 'registry has grown past the first slice');
  for (const t of topics) {
    const k = loadTopic(t.subject, t.topic);
    assert.ok(k, `${t.id} loads`);
    assert.ok(k.sections.length > 0, `${t.id} has sections`);
    const { problems } = validateTopic(k, { useScope: 'learning' });
    const errors = problems.filter((p) => p.level === 'error');
    assert.equal(errors.length, 0, `${t.id} validation errors: ${JSON.stringify(errors)}`);
    // Stable ids must be unique within a topic.
    const ids = k.sections.map((s) => s.id);
    assert.equal(new Set(ids).size, ids.length, `${t.id} has duplicate section ids`);
  }
});

test('every verification overlay key resolves to a real section (no orphans)', () => {
  // A renamed heading would orphan its verification → silently losing a
  // verified claim. Fail loudly instead.
  for (const t of listTopics()) {
    const k = loadTopic(t.subject, t.topic);
    const sectionIds = new Set(k.sections.map((s) => s.id));
    const overlay = verificationFor(t.id);
    for (const key of Object.keys(overlay)) {
      assert.ok(sectionIds.has(key), `orphaned verification key "${key}" in ${t.id} — heading renamed?`);
    }
  }
});

// ---- search ----
test('search matches Thai body text on English-titled topics', async () => {
  const { searchTopics } = await import('../../src/lib/vetwiki/search.js');
  // "วัคซีน" appears in the BODY of rabies + vaccine, not in their titles.
  const vac = searchTopics('วัคซีน');
  assert.ok(vac.length >= 2, 'Thai query finds English-titled topics via body text');
  assert.ok(vac.every((r) => r.matchedSections.length > 0 || r.inTitle));
  // Section-level reporting is what makes a hit useful.
  const rabies = vac.find((r) => r.topic.id === 'com5--rabies');
  assert.ok(rabies && rabies.matchedSections.length > 0, 'reports which sections matched');
  assert.ok(rabies.matchedSections.every((s) => s.id && s.heading), 'matches carry stable ids');

  assert.equal(searchTopics('xyzzy-no-such-term').length, 0, 'no false positives');
  assert.equal(searchTopics('').length, searchTopics('   ').length, 'empty query is stable');
});

// ---- grounded answers ----
test('answer validator: a model cannot invent a citation', async () => {
  const { validateAnswer, allowedFromSections, isGrounded } = await import('../../src/lib/vetwiki/answer.js');
  const k = loadTopic('com5', 'rabies');
  const allowed = allowedFromSections(k.id, k.sections);

  const dxId = 'com5--rabies--diagnosis';       // has reference-verified claims
  const overviewId = 'com5--rabies--overview';  // also verified (taxonomy)

  // A draft-only section, injected rather than found. This test is about the
  // VALIDATOR refusing to call a draft "verified", not about the corpus
  // happening to contain an unverified section — and it no longer does, since
  // every rabies section now carries a sourced claim. Depending on corpus state
  // meant this test broke the moment the corpus got better, which is exactly
  // backwards.
  const draftOnlyId = 'com5--rabies--synthetic-draft-only';
  allowed.set(draftOnlyId, { sectionId: draftOnlyId, topicId: k.id, verified: false });

  const { claims, dropped, downgraded } = validateAnswer([
    // 1. legitimately grounded in a verified section
    { id: 'a', text: 'FAT เป็นวิธีมาตรฐาน', supportType: 'vetwiki-verified', support: [{ sectionId: dxId }] },
    // 2. cites a section that was never supplied → must lose the citation
    { id: 'b', text: 'อ้างมั่ว', supportType: 'vetwiki-verified', support: [{ sectionId: 'com5--rabies--NOT-REAL' }] },
    // 3. claims "verified" but cites a draft-only section → downgraded
    { id: 'c', text: 'เกินจริง', supportType: 'vetwiki-verified', support: [{ sectionId: draftOnlyId }] },
    // 4. empty text → dropped
    { id: 'd', text: '   ', supportType: 'vetmock-analysis', support: [] },
    // 5. unknown supportType → treated as analysis
    { id: 'e', text: 'ประเภทมั่ว', supportType: 'totally-made-up', support: [{ sectionId: overviewId }] },
  ], allowed);

  const by = Object.fromEntries(claims.map((c) => [c.id, c]));
  assert.equal(dropped, 1, 'empty claim dropped');
  assert.equal(by.a.supportType, 'vetwiki-verified');
  assert.equal(by.a.support[0].sectionId, dxId);
  // The fabricated citation is gone AND the claim is no longer presented as sourced.
  assert.equal(by.b.support.length, 0, 'unsupplied sectionId stripped');
  assert.equal(by.b.supportType, 'vetmock-analysis', 'fabricated citation downgraded to analysis');
  assert.equal(by.c.supportType, 'vetwiki-draft', 'cannot claim verified from a draft-only section');
  assert.ok(downgraded >= 2);
  assert.ok(TYPES_OK(by.e.supportType), 'unknown type normalised');
  assert.ok(isGrounded(claims));

  function TYPES_OK(t) { return ['vetwiki-verified', 'vetwiki-draft', 'vetmock-analysis', 'insufficient-evidence'].includes(t); }
});

test('wikiTitle strips note-metadata but keeps real clarifying parentheticals', () => {
  // STRIP: study annotations that belong in a personal note, not a reference.
  assert.equal(wikiTitle('GI Surgery (Sawita 3 lectures, 45 ข้อ ⭐ MAIN SCOPE)'), 'GI Surgery');
  assert.equal(wikiTitle('Bovine Local + Regional Anesthesia ⭐ (14 Q, highest yield)'), 'Bovine Local + Regional Anesthesia');
  assert.equal(wikiTitle('Rumenotomy, Aj.เอกพล (EA, 11 Q, high yield)'), 'Rumenotomy');
  assert.equal(wikiTitle('L8, Animal Nutrition (Final scope!)'), 'Animal Nutrition');
  assert.equal(wikiTitle('L10-11, Avian Drugs, AMR'), 'Avian Drugs, AMR');
  assert.equal(wikiTitle('L14, First Week Mortality + Immunology (AHRA)'), 'First Week Mortality + Immunology');
  assert.equal(wikiTitle('GI Medicine (VDTT), Ruminant GI Disorder'), 'GI Medicine, Ruminant GI Disorder');
  assert.equal(wikiTitle('Colic best-fit (KU lecture)'), 'Colic best-fit');
  assert.equal(wikiTitle('Research Designs ที่ต้องรู้จัก'), 'Research Designs');

  // KEEP: abbreviations, synonyms, standards, scope qualifiers, editions, course codes.
  for (const keep of [
    'CPCR (Cardiopulmonary Cerebral Resuscitation)',
    'Feline Upper Respiratory Infection (FURI / FRDC)',
    'Pet Vaccination Guidelines (WSAVA 2024 / VPAT 2024)',
    'Sporotrichosis & Cryptococcosis (in cats)',
    'Reproductive Biotechnology (ART)',
    'Course intro — Equine Medicine & Surgery (3106510)',
    'Equine anesthesia (2024)',
    'Quality Assurance, Betagro framework',
  ]) {
    assert.equal(wikiTitle(keep), keep, `should keep: ${keep}`);
  }
});

test('no VetWiki topic title carries an emoji (scales past ~100 topics)', () => {
  const emoji = /[\u{1F000}-\u{1FAFF}\u{2600}-\u{27BF}\u{2190}-\u{21FF}\u{2B00}-\u{2BFF}\u{FE0F}]/u;
  const dirty = listTopics().filter((t) => emoji.test(t.title));
  assert.deepEqual(dirty.map((t) => t.title), [], 'wiki titles must be emoji-free');
});
