import assert from 'node:assert/strict';
import test from 'node:test';

import { VERIFICATIONS } from '../../src/lib/vetwiki/verification.js';
import { GENERATED_VERIFICATIONS } from '../../src/lib/vetwiki/verification-generated.js';
import { SOURCES } from '../../src/lib/vetwiki/sources.js';

// The curated overlay and the machine-generated one are merged in code. The
// first version of the ingest script appended a second `'com5--rabies': {...}`
// key onto the same object literal instead, which is last-one-wins, and three
// hand-verified rabies claims vanished without a word. These tests exist so
// that failure mode cannot come back quietly.

test('generated overlay does not shadow curated claims for the same section', () => {
  for (const [topicId, sections] of Object.entries(GENERATED_VERIFICATIONS)) {
    for (const sectionId of Object.keys(sections)) {
      const mergedClaims = VERIFICATIONS[topicId]?.[sectionId]?.claims || [];
      const generatedClaims = sections[sectionId].claims || [];
      assert.ok(
        mergedClaims.length >= generatedClaims.length,
        `${topicId}/${sectionId}: merge lost claims (${mergedClaims.length} < ${generatedClaims.length})`,
      );
    }
  }
});

test('the flagship rabies section keeps BOTH its curated and generated claims', () => {
  const dx = VERIFICATIONS['com5--rabies']?.['com5--rabies--diagnosis'];
  assert.ok(dx, 'rabies diagnosis overlay survives the merge');
  const ids = (dx.claims || []).map((c) => c.id);
  assert.ok(
    ids.includes('com5--rabies--diagnosis--fat-standard'),
    'the hand-curated FAT-standard claim must not be replaced by generated ones',
  );
});

test('every claim cites a source that exists in the registry', () => {
  const missing = [];
  for (const [topicId, sections] of Object.entries(VERIFICATIONS)) {
    for (const [sectionId, entry] of Object.entries(sections)) {
      for (const claim of entry.claims || []) {
        for (const ref of claim.sourceRefs || []) {
          if (!SOURCES[ref.sourceId]) missing.push(`${topicId}/${sectionId} -> ${ref.sourceId}`);
        }
      }
    }
  }
  assert.deepEqual(missing, [], 'claims citing an unregistered sourceId are not verified at all');
});

test('claim ids are unique within their section', () => {
  for (const [topicId, sections] of Object.entries(VERIFICATIONS)) {
    for (const [sectionId, entry] of Object.entries(sections)) {
      const ids = (entry.claims || []).map((c) => c.id);
      assert.equal(
        new Set(ids).size, ids.length,
        `${topicId}/${sectionId} has duplicate claim ids`,
      );
    }
  }
});

test('a source claiming verified-online carries something a reader can follow', () => {
  const unfollowable = Object.values(SOURCES)
    .filter((s) => s.availability === 'verified-online')
    .filter((s) => !s.pmid && !s.doi && !s.url)
    .map((s) => s.id);
  assert.deepEqual(
    unfollowable, [],
    'verified-online without a pmid, doi or url is an unprovable claim',
  );
});
