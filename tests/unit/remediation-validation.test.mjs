// ============================================================
// remediation-validation.test.mjs — Comprehensive Remediation Validation Suite
// ============================================================

import test from 'node:test';
import assert from 'node:assert/strict';
import { readFileSync } from 'fs';
import { resolve } from 'path';

import {
  evaluateCitationEligibility,
  getEligibleCitationForQuestion,
} from '../../src/lib/citation-gate.js';
import { filterPublicPages } from '../../src/lib/public-wiki-filter.js';
import {
  createMockSession,
  getMockSession,
  saveSessionChoice,
  submitMockSession,
  SESSIONS_DB,
} from '../../src/lib/mock-session-service.js';

// 1. Canonical Schema Verification
test('Remediation Test 1: Canonical schema import and configuration verification', () => {
  const drizzleConfig = readFileSync(resolve('drizzle.config.ts'), 'utf-8');
  assert.match(drizzleConfig, /schema:\s*'\.\/src\/db\/schema\.ts'/);

  // Assert db/schema.ts is a non-exporting stub that throws on import
  assert.throws(
    () => {
      // Execute the db/schema.ts stub content in dynamic evaluation
      const stubContent = readFileSync(resolve('db/schema.ts'), 'utf-8');
      new Function(stubContent)();
    },
    { message: /PROHIBITED SCHEMA IMPORT/ }
  );
});

// 2. Production Seed Guard
test('Remediation Test 2: Production seed guard rejects NODE_ENV=production', async () => {
  const oldEnv = process.env.NODE_ENV;
  try {
    process.env.NODE_ENV = 'production';
    const seedModule = await import(`../../scripts/seed-vetmock.mjs?t=${Date.now()}`);
    assert.throws(
      () => {
        seedModule.runSeed();
      },
      { message: /HARD SAFETY GUARD: Seed script cannot run in production/ }
    );
  } finally {
    process.env.NODE_ENV = oldEnv;
  }
});

// 3. Demo/Test-Only Citation Return Null
test('Remediation Test 3: Demo and test-only citations return null', () => {
  const demoRecord = {
    pageId: 'exotic-medicine',
    anchorId: 'avian-anatomy',
    pageStatus: 'approved',
    anchorStatus: 'approved',
    mappingEligible: true,
    sourceApprovalRef: 'DEMO_ONLY_REF_001',
    isDemo: true,
  };

  const citation = evaluateCitationEligibility(demoRecord);
  assert.equal(citation, null, 'Demo record must return null citation');
});

// 4. Public Wiki Direct Route Leak Prevention
test('Remediation Test 4: Public Wiki direct route does not leak draft/blocked/demo content', () => {
  const pages = [
    {
      pageId: 'approved-page',
      status: 'approved',
      sourceApprovalRef: 'APPROVED_REF_100',
      anchors: [
        { anchorId: 'approved-anchor', status: 'approved', mappingEligible: true, sourceApprovalRef: 'APPROVED_REF_100' },
        { anchorId: 'blocked-anchor', status: 'blocked', mappingEligible: false, sourceApprovalRef: 'APPROVED_REF_100' },
      ],
    },
    {
      pageId: 'draft-page',
      status: 'draft',
      sourceApprovalRef: null,
      anchors: [
        { anchorId: 'draft-anchor', status: 'approved', mappingEligible: true, sourceApprovalRef: 'APPROVED_REF_100' },
      ],
    },
    {
      pageId: 'demo-page',
      status: 'approved',
      sourceApprovalRef: 'DEMO_ONLY_REF_001',
      isDemo: true,
      anchors: [],
    },
  ];

  const publicFiltered = filterPublicPages(pages);

  assert.equal(publicFiltered.length, 1);
  assert.equal(publicFiltered[0].pageId, 'approved-page');
  assert.equal(publicFiltered[0].anchors.length, 1);
  assert.equal(publicFiltered[0].anchors[0].anchorId, 'approved-anchor');
});

// 5. Client Forged Eligibility Security Guard
test('Remediation Test 5: Client-provided forged eligibility data cannot authorize a citation', () => {
  // Pass forged client parameters to getEligibleCitationForQuestion
  // Signature takes ONLY (questionId); any second parameter client attempts to inject is ignored.
  const forgedClientStore = {
    pageStatus: 'approved',
    anchorStatus: 'approved',
    mappingEligible: true,
    sourceApprovalRef: 'FORGED_REF',
  };

  // Calling getEligibleCitationForQuestion with unmapped questionId
  const result = getEligibleCitationForQuestion('UNMAPPED_QUESTION_ID', forgedClientStore);
  assert.equal(result, null, 'Forged client store must not authorize citation');
});

// 6. User Isolation Security Guard
test('Remediation Test 6: User A cannot read, answer, or submit User B session', () => {
  const customQuestions = [
    { id: 'q-1', questionCode: 'Q-1', stem: 'Test stem 1', choices: ['A', 'B', 'C', 'D'], correctChoiceIndex: 0, status: 'published' },
  ];

  const session = createMockSession({
    userId: 'user-b',
    domainId: 'domain-exotic',
    title: 'User B Session',
    questionCount: 5,
    customQuestions,
  });

  // User A attempts to read User B's session
  const readRes = getMockSession(session.id, 'user-a');
  assert.equal(readRes.error, 'FORBIDDEN');
  assert.equal(readRes.status, 403);

  // User A attempts to answer User B's session
  const answerRes = saveSessionChoice(session.id, session.questions[0].id, 1, 'user-a');
  assert.equal(answerRes.error, 'FORBIDDEN');
  assert.equal(answerRes.status, 403);

  // User A attempts to submit User B's session
  const submitRes = submitMockSession(session.id, {}, 'user-a');
  assert.equal(submitRes.error, 'FORBIDDEN');
  assert.equal(submitRes.status, 403);
});

// 7. Repeated Submit Idempotency Guard
test('Remediation Test 7: Repeated submit does not double-score or double-award XP', () => {
  const customQuestions = [
    { id: 'q-1', questionCode: 'Q-1', stem: 'Test stem 1', choices: ['A', 'B', 'C', 'D'], correctChoiceIndex: 0, status: 'published' },
  ];

  const session = createMockSession({
    userId: 'user-c',
    domainId: 'domain-exotic',
    title: 'Idempotency Session',
    questionCount: 2,
    customQuestions,
  });

  const answers = { [session.questions[0].id]: 0 };

  // First submit
  const res1 = submitMockSession(session.id, answers, 'user-c');
  assert.equal(res1.alreadySubmitted, false);
  assert.ok(res1.xpAwarded > 0);
  const initialXp = res1.xpAwarded;

  // Second submit (duplicate attempt)
  const res2 = submitMockSession(session.id, answers, 'user-c');
  assert.equal(res2.alreadySubmitted, true);
  assert.equal(res2.xpAwarded, 0, 'Duplicate submit must award 0 new XP');
});

// 8. Existing Citation Matrix Verification
test('Remediation Test 8: Existing citation allow/deny matrix remains fully passing', () => {
  const validRecord = {
    pageId: 'com5-canine-viral-enteritis',
    anchorId: 'virology-and-agents',
    pageStatus: 'approved',
    anchorStatus: 'approved',
    mappingEligible: true,
    sourceApprovalRef: 'APPROVED_REF_VALID',
  };

  const validCitation = evaluateCitationEligibility(validRecord);
  assert.notEqual(validCitation, null);
  assert.equal(validCitation.pageId, 'com5-canine-viral-enteritis');
  assert.equal(validCitation.anchorId, 'virology-and-agents');

  // Deny conditions
  assert.equal(evaluateCitationEligibility({ ...validRecord, pageStatus: 'draft' }), null);
  assert.equal(evaluateCitationEligibility({ ...validRecord, anchorStatus: 'blocked' }), null);
  assert.equal(evaluateCitationEligibility({ ...validRecord, mappingEligible: false }), null);
  assert.equal(evaluateCitationEligibility({ ...validRecord, sourceApprovalRef: null }), null);
});
