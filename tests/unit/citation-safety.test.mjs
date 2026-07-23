// ============================================================
// citation-safety.test.mjs — Unit tests for citation eligibility matrix
// ============================================================

import test from 'node:test';
import assert from 'node:assert/strict';
import { evaluateCitationEligibility } from '../../src/lib/citation-gate.js';

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
