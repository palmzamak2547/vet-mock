// ============================================================
// citation-safety.test.mjs — Unit tests for citation eligibility matrix
// ============================================================

import test from 'node:test';
import assert from 'node:assert/strict';
import { loadQB } from '../../src/data/questions.js';
import { evaluateCitationEligibility, getEligibleCitationForQuestion } from '../../src/lib/citation-gate.js';

await loadQB();

test('Citation Safety: 1. approved page + approved anchor + mappingEligible true + sourceApprovalRef -> citation returned', () => {
  const record = {
    pageId: 'exotic-medicine',
    anchorId: 'avian-anatomy',
    pageStatus: 'approved',
    anchorStatus: 'approved',
    mappingEligible: true,
    sourceApprovalRef: 'REF_PROD_001',
  };

  const citation = evaluateCitationEligibility(record);

  assert.notEqual(citation, null);
  assert.equal(citation.pageId, 'exotic-medicine');
  assert.equal(citation.anchorId, 'avian-anatomy');
  assert.equal(citation.sourceApprovalRef, 'REF_PROD_001');
  assert.equal(citation.mappingEligible, true);
});

test('Citation Safety: 2. draft page -> null', () => {
  const record = {
    pageId: 'exotic-medicine',
    anchorId: 'avian-anatomy',
    pageStatus: 'draft',
    anchorStatus: 'approved',
    mappingEligible: true,
    sourceApprovalRef: 'REF_PROD_001',
  };

  const citation = evaluateCitationEligibility(record);
  assert.equal(citation, null);
});

test('Citation Safety: 3. draft anchor -> null', () => {
  const record = {
    pageId: 'exotic-medicine',
    anchorId: 'avian-anatomy',
    pageStatus: 'approved',
    anchorStatus: 'draft',
    mappingEligible: true,
    sourceApprovalRef: 'REF_PROD_001',
  };

  const citation = evaluateCitationEligibility(record);
  assert.equal(citation, null);
});

test('Citation Safety: 4. blocked anchor -> null', () => {
  const record = {
    pageId: 'exotic-medicine',
    anchorId: 'avian-anatomy',
    pageStatus: 'approved',
    anchorStatus: 'blocked',
    mappingEligible: true,
    sourceApprovalRef: 'REF_PROD_001',
  };

  const citation = evaluateCitationEligibility(record);
  assert.equal(citation, null);
});

test('Citation Safety: 5. mappingEligible false -> null', () => {
  const record = {
    pageId: 'exotic-medicine',
    anchorId: 'avian-anatomy',
    pageStatus: 'approved',
    anchorStatus: 'approved',
    mappingEligible: false,
    sourceApprovalRef: 'REF_PROD_001',
  };

  const citation = evaluateCitationEligibility(record);
  assert.equal(citation, null);
});

test('Citation Safety: 6. null sourceApprovalRef -> null', () => {
  const record = {
    pageId: 'exotic-medicine',
    anchorId: 'avian-anatomy',
    pageStatus: 'approved',
    anchorStatus: 'approved',
    mappingEligible: true,
    sourceApprovalRef: null,
  };

  const citation = evaluateCitationEligibility(record);
  assert.equal(citation, null);
});

test('Citation Safety: 7. no question wiki reference -> null', () => {
  const citation = evaluateCitationEligibility(null);
  assert.equal(citation, null);
});

test('Citation Safety: 8. demo or test-only record -> null, even when every status is approved', () => {
  const record = {
    pageId: 'exotic-medicine',
    anchorId: 'avian-anatomy',
    pageStatus: 'approved',
    anchorStatus: 'approved',
    mappingEligible: true,
    sourceApprovalRef: 'REF_PROD_001',
  };
  assert.notEqual(evaluateCitationEligibility(record), null, 'control: the same record without a demo marker is cited');
  assert.equal(evaluateCitationEligibility({ ...record, isDemo: true }), null);
  assert.equal(evaluateCitationEligibility({ ...record, visibility: 'test_only' }), null);
  assert.equal(evaluateCitationEligibility({ ...record, sourceApprovalRef: 'DEMO_ONLY_REF_001' }), null);
});

test('Citation Safety: 9. eligibility data passed by the caller cannot authorize a citation', () => {
  // The public lookup takes (questionId, subject) and reads page, anchor and
  // approval state from the bank itself. A caller that passes its own
  // "approved" record in place of the subject gets nothing.
  const forged = {
    pageStatus: 'approved',
    anchorStatus: 'approved',
    mappingEligible: true,
    sourceApprovalRef: 'FORGED_REF',
  };
  assert.ok(getEligibleCitationForQuestion(501, 'com5'), 'control: com5:501 is cited through the bank');
  assert.equal(getEligibleCitationForQuestion(501, forged), null);
  assert.equal(getEligibleCitationForQuestion('UNMAPPED_QUESTION_ID', forged), null);
});
