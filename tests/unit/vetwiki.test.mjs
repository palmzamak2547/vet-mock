// VetWiki foundation — unit tests (stable ids, adapter, verification, validation, provenance)
import assert from 'node:assert/strict';
import test from 'node:test';

import { slug, sectionId, topicId } from '../../src/lib/vetwiki/schema.js';
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
