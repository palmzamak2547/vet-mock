import assert from 'node:assert/strict';
import crypto from 'node:crypto';
import fs from 'node:fs';
import os from 'node:os';
import path from 'node:path';
import test, { after, before } from 'node:test';

import { isDisplayableWikiRef } from '../../src/lib/citation-gate.js';
import {
  parseFrontmatter,
  parseSectionMetaBlock,
  runValidation,
  scanWikiPages,
  validateInternalLinks,
  validateQuestionRefs,
} from '../../scripts/validate-wiki.mjs';

// ============================================================
// 1. Unit Tests for isDisplayableWikiRef Helper
// ============================================================

test('isDisplayableWikiRef: returns true for approved + verified + non-empty fields', () => {
  const validRef = {
    pageId: 'question-bank-engine',
    anchorId: 'question-schema',
    label: 'Question Bank Engine: Question Schema',
    status: 'approved',
    mappingStatus: 'verified',
    wikiVersion: '1.0.0',
  };
  assert.equal(isDisplayableWikiRef(validRef), true);
});

test('isDisplayableWikiRef: returns false when status is not approved', () => {
  const ref = {
    pageId: 'page-1',
    anchorId: 'anchor-1',
    label: 'Label',
    status: 'draft',
    mappingStatus: 'verified',
  };
  assert.equal(isDisplayableWikiRef(ref), false);
});

test('isDisplayableWikiRef: returns false when mappingStatus is candidate', () => {
  const ref = {
    pageId: 'page-1',
    anchorId: 'anchor-1',
    label: 'Label',
    status: 'approved',
    mappingStatus: 'candidate',
  };
  assert.equal(isDisplayableWikiRef(ref), false);
});

test('isDisplayableWikiRef: returns false when mappingStatus is unmapped', () => {
  const ref = {
    pageId: 'page-1',
    anchorId: 'anchor-1',
    label: 'Label',
    status: 'approved',
    mappingStatus: 'unmapped',
  };
  assert.equal(isDisplayableWikiRef(ref), false);
});

test('isDisplayableWikiRef: returns false when label is empty or missing', () => {
  const ref = {
    pageId: 'page-1',
    anchorId: 'anchor-1',
    label: '   ',
    status: 'approved',
    mappingStatus: 'verified',
  };
  assert.equal(isDisplayableWikiRef(ref), false);
});

test('isDisplayableWikiRef: returns false when pageId or anchorId is empty', () => {
  const emptyPage = {
    pageId: '',
    anchorId: 'anchor-1',
    label: 'Label',
    status: 'approved',
    mappingStatus: 'verified',
  };
  const emptyAnchor = {
    pageId: 'page-1',
    anchorId: '   ',
    label: 'Label',
    status: 'approved',
    mappingStatus: 'verified',
  };
  assert.equal(isDisplayableWikiRef(emptyPage), false);
  assert.equal(isDisplayableWikiRef(emptyAnchor), false);
});

test('isDisplayableWikiRef: returns false for null, undefined, or non-object', () => {
  assert.equal(isDisplayableWikiRef(null), false);
  assert.equal(isDisplayableWikiRef(undefined), false);
  assert.equal(isDisplayableWikiRef('string'), false);
  assert.equal(isDisplayableWikiRef(123), false);
});

// ============================================================
// 2. Pure Validator Function Tests using Temp Runtime Fixture
// ============================================================

let tempDir;

before(() => {
  tempDir = fs.mkdtempSync(path.join(os.tmpdir(), 'vetmock-wiki-test-'));
});

after(() => {
  if (tempDir && fs.existsSync(tempDir)) {
    fs.rmSync(tempDir, { recursive: true, force: true });
  }
});

function createTempWikiFile(relPath, content) {
  const fullPath = path.join(tempDir, 'wiki', relPath);
  fs.mkdirSync(path.dirname(fullPath), { recursive: true });
  fs.writeFileSync(fullPath, content, 'utf8');
  return fullPath;
}

function getDirectoryTreeHash(dir) {
  if (!fs.existsSync(dir)) return '';
  const entries = [];
  function walk(current) {
    const list = fs.readdirSync(current);
    for (const item of list.sort()) {
      const p = path.join(current, item);
      const stat = fs.statSync(p);
      if (stat.isDirectory()) {
        walk(p);
      } else {
        const content = fs.readFileSync(p);
        const hash = crypto.createHash('sha256').update(content).digest('hex');
        entries.push(`${path.relative(dir, p)}:${hash}`);
      }
    }
  }
  walk(dir);
  return entries.join('\n');
}

test('Validator: valid pageId and anchorId produces 0 errors', () => {
  const wikiDir = path.join(tempDir, 'wiki-valid');
  fs.mkdirSync(wikiDir, { recursive: true });
  fs.writeFileSync(
    path.join(wikiDir, 'test-page.md'),
    `---
id: test-page
title: Test Page
type: domain
version: 1.0.0
status: approved
lastReviewed: 2026-07-23
---

# Test Page
## <a id="test-anchor"></a>Test Section
`,
    'utf8',
  );

  const errors = [];
  const warnings = [];
  const pages = scanWikiPages(wikiDir, errors, warnings, tempDir);

  assert.equal(pages.size, 1);
  assert.equal(errors.length, 0);

  const sampleQ = [
    {
      id: 1,
      subject: 'test',
      wikiRefs: [
        {
          pageId: 'test-page',
          anchorId: 'test-anchor',
          label: 'Test Page: Test Section',
          status: 'approved',
          mappingStatus: 'verified',
        },
      ],
    },
  ];

  const refStats = validateQuestionRefs(sampleQ, pages, errors, warnings);
  assert.equal(errors.length, 0);
  assert.equal(refStats.verifiedCount, 1);
});

test('Validator: detects duplicate pageId as error', () => {
  const wikiDir = path.join(tempDir, 'wiki-dupe-page');
  fs.mkdirSync(wikiDir, { recursive: true });
  fs.writeFileSync(
    path.join(wikiDir, 'page1.md'),
    `---\nid: dupe-page\ntitle: P1\ntype: domain\nversion: 1.0.0\nstatus: approved\nlastReviewed: 2026-07-23\n---\n# P1`,
    'utf8',
  );
  fs.writeFileSync(
    path.join(wikiDir, 'page2.md'),
    `---\nid: dupe-page\ntitle: P2\ntype: domain\nversion: 1.0.0\nstatus: approved\nlastReviewed: 2026-07-23\n---\n# P2`,
    'utf8',
  );

  const errors = [];
  const warnings = [];
  scanWikiPages(wikiDir, errors, warnings, tempDir);

  assert.equal(
    errors.some((e) => e.includes("Duplicate pageId 'dupe-page'")),
    true,
  );
});

test('Validator: detects duplicate anchorId within same page as error', () => {
  const wikiDir = path.join(tempDir, 'wiki-dupe-anchor');
  fs.mkdirSync(wikiDir, { recursive: true });
  fs.writeFileSync(
    path.join(wikiDir, 'page.md'),
    `---\nid: page-dupe-anchor\ntitle: P\ntype: domain\nversion: 1.0.0\nstatus: approved\nlastReviewed: 2026-07-23\n---\n## <a id="same-anchor"></a>S1\n## <a id="same-anchor"></a>S2`,
    'utf8',
  );

  const errors = [];
  const warnings = [];
  scanWikiPages(wikiDir, errors, warnings, tempDir);

  assert.equal(
    errors.some((e) => e.includes("Duplicate anchorId 'same-anchor'")),
    true,
  );
});

test('Validator: detects missing pageId reference in question as error', () => {
  const pages = new Map();
  const sampleQ = [
    {
      id: 10,
      subject: 'surg',
      wikiRefs: [{ pageId: 'non-existent-page', anchorId: 'some-anchor' }],
    },
  ];

  const errors = [];
  const warnings = [];
  validateQuestionRefs(sampleQ, pages, errors, warnings);

  assert.equal(
    errors.some((e) =>
      e.includes("references missing pageId 'non-existent-page'"),
    ),
    true,
  );
});

test('Validator: detects missing anchorId reference in question as error', () => {
  const pages = new Map();
  pages.set('existing-page', { anchors: new Set(['valid-anchor']) });

  const sampleQ = [
    {
      id: 20,
      subject: 'surg',
      wikiRefs: [{ pageId: 'existing-page', anchorId: 'missing-anchor' }],
    },
  ];

  const errors = [];
  const warnings = [];
  validateQuestionRefs(sampleQ, pages, errors, warnings);

  assert.equal(
    errors.some((e) =>
      e.includes(
        "references missing anchorId 'missing-anchor' in page 'existing-page'",
      ),
    ),
    true,
  );
});

test('Validator: detects broken markdown internal links as error', () => {
  const wikiDir = path.join(tempDir, 'wiki-broken-link');
  fs.mkdirSync(wikiDir, { recursive: true });
  const pPath = path.join(wikiDir, 'source.md');
  fs.writeFileSync(
    pPath,
    `---\nid: source\ntitle: Source\ntype: domain\nversion: 1.0.0\nstatus: approved\nlastReviewed: 2026-07-23\n---\n[Broken Link](./non-existent.md)`,
    'utf8',
  );

  const errors = [];
  const warnings = [];
  const pages = scanWikiPages(wikiDir, errors, warnings, tempDir);
  validateInternalLinks(pages, errors, warnings);

  assert.equal(
    errors.some((e) => e.includes('Broken internal link')),
    true,
  );
});

test('Validator: detects malformed wikiRefs object as error', () => {
  const pages = new Map();
  const sampleQ = [
    {
      id: 30,
      subject: 'com',
      wikiRefs: [{ pageId: '', anchorId: null }],
    },
  ];

  const errors = [];
  const warnings = [];
  validateQuestionRefs(sampleQ, pages, errors, warnings);

  assert.equal(
    errors.some((e) => e.includes('has invalid wikiRef object')),
    true,
  );
});

test('Validator: missing wikiRefs produces summary warning and 0 errors', () => {
  const pages = new Map();
  const sampleQ = [
    { id: 101, subject: 'com' },
    { id: 102, subject: 'com', wikiRefs: [] },
  ];

  const errors = [];
  const warnings = [];
  const refStats = validateQuestionRefs(sampleQ, pages, errors, warnings);

  assert.equal(errors.length, 0);
  assert.equal(refStats.unmappedCount, 2);
  assert.equal(
    warnings.some((w) => w.includes('WARNING: 2 questions have no wikiRefs')),
    true,
  );
});

test('Validator: 100% read-only behavior guarantees fixture integrity', async () => {
  const fixtureDir = path.join(tempDir, 'read-only-fixture');
  const wikiDir = path.join(fixtureDir, 'wiki');
  fs.mkdirSync(wikiDir, { recursive: true });
  fs.writeFileSync(
    path.join(wikiDir, 'readonly.md'),
    `---\nid: readonly\ntitle: Read Only\ntype: domain\nversion: 1.0.0\nstatus: approved\nlastReviewed: 2026-07-23\n---\n# Read Only Page\n## <a id="anchor-1"></a>Section`,
    'utf8',
  );

  const hashBefore = getDirectoryTreeHash(fixtureDir);

  const sampleQ = [
    {
      id: 1,
      subject: 'test',
      wikiRefs: [
        {
          pageId: 'readonly',
          anchorId: 'anchor-1',
          label: 'Label',
          status: 'approved',
          mappingStatus: 'verified',
        },
      ],
    },
  ];

  const result = await runValidation({
    rootDir: fixtureDir,
    wikiDir: wikiDir,
    questions: sampleQ,
  });

  const hashAfter = getDirectoryTreeHash(fixtureDir);

  assert.equal(result.errors.length, 0);
  assert.equal(
    hashBefore,
    hashAfter,
    'Directory tree and file content hash must be 100% identical before and after validation',
  );
});

test('parseSectionMetaBlock: correctly parses YAML comment block content', () => {
  const block = `
anchorId: test-anchor
sectionStatus: draft
clinicalSafety: restricted
requiresDomainApproval: true
mappingEligible: false
sectionSourceRefs:
  - sourceId: src-1
    title: Source One
    locator: "P.1"
    derivedFrom: "notes.js"
    evidenceStatus: derived-note
    sourceAvailability: note-only
`;
  const meta = parseSectionMetaBlock(block);
  assert.equal(meta.anchorId, 'test-anchor');
  assert.equal(meta.sectionStatus, 'draft');
  assert.equal(meta.clinicalSafety, 'restricted');
  assert.equal(meta.requiresDomainApproval, true);
  assert.equal(meta.mappingEligible, false);
  assert.equal(meta.sectionSourceRefs.length, 1);
  assert.equal(meta.sectionSourceRefs[0].sourceId, 'src-1');
  assert.equal(meta.sectionSourceRefs[0].sourceAvailability, 'note-only');
});

test('Validator: detects missing wiki-section-meta block in domain page as error', () => {
  const wikiDir = path.join(tempDir, 'wiki-missing-meta');
  fs.mkdirSync(wikiDir, { recursive: true });
  fs.writeFileSync(
    path.join(wikiDir, 'domain-page.md'),
    `---\nid: domain-missing-meta\ntitle: Domain Page\ntype: domain\ndomainId: com5\nversion: 1.0.0\nstatus: draft\nlastReviewed: 2026-07-23\n---\n## <a id="anchor-no-meta"></a>Header Without Meta`,
    'utf8',
  );

  const errors = [];
  const warnings = [];
  scanWikiPages(wikiDir, errors, warnings, tempDir);

  assert.equal(
    errors.some((e) => e.includes("missing required <!-- wiki-section-meta -->")),
    true,
  );
});

test('Validator: detects anchorId mismatch in wiki-section-meta as error', () => {
  const wikiDir = path.join(tempDir, 'wiki-mismatch-meta');
  fs.mkdirSync(wikiDir, { recursive: true });
  fs.writeFileSync(
    path.join(wikiDir, 'domain-mismatch.md'),
    `---\nid: domain-mismatch\ntitle: Domain Page\ntype: domain\ndomainId: com5\nversion: 1.0.0\nstatus: draft\nlastReviewed: 2026-07-23\n---\n## <a id="real-anchor"></a>Header\n<!-- wiki-section-meta\nanchorId: wrong-anchor\nsectionStatus: draft\nclinicalSafety: standard\nrequiresDomainApproval: false\nmappingEligible: false\nsectionSourceRefs:\n  - sourceId: s1\n    title: S1\n    locator: L1\n    derivedFrom: D1\n    evidenceStatus: derived-note\n    sourceAvailability: note-only\n-->`,
    'utf8',
  );

  const errors = [];
  const warnings = [];
  scanWikiPages(wikiDir, errors, warnings, tempDir);

  assert.equal(
    errors.some((e) => e.includes("Section meta anchorId 'wrong-anchor' does not match anchor 'real-anchor'")),
    true,
  );
});

// ============================================================
// 3. Wiki Lifecycle State Matrix Tests (Phase 2A.2)
// ============================================================

test('Lifecycle Matrix 1: Draft page + draft section + mapping false + note-only -> PASS', () => {
  const wikiDir = path.join(tempDir, 'wiki-lifecycle-1');
  fs.mkdirSync(wikiDir, { recursive: true });
  fs.writeFileSync(
    path.join(wikiDir, 'page.md'),
    `---\nid: page-lc-1\ntitle: LC 1\ntype: domain\ndomainId: com5\nversion: 1.0.0\nstatus: draft\nlastReviewed: 2026-07-23\n---\n## <a id="a1"></a>Title\n<!-- wiki-section-meta\nanchorId: a1\nsectionStatus: draft\nclinicalSafety: standard\nrequiresDomainApproval: false\nmappingEligible: false\nsectionSourceRefs:\n  - sourceId: s1\n    title: S1\n    locator: L1\n    derivedFrom: D1\n    evidenceStatus: derived-note\n    sourceAvailability: note-only\n-->`,
    'utf8'
  );
  const errors = [];
  scanWikiPages(wikiDir, errors, [], tempDir);
  assert.equal(errors.length, 0);
});

test('Lifecycle Matrix 2: Draft page + approved section -> ERROR', () => {
  const wikiDir = path.join(tempDir, 'wiki-lifecycle-2');
  fs.mkdirSync(wikiDir, { recursive: true });
  fs.writeFileSync(
    path.join(wikiDir, 'page.md'),
    `---\nid: page-lc-2\ntitle: LC 2\ntype: domain\ndomainId: com5\nversion: 1.0.0\nstatus: draft\nlastReviewed: 2026-07-23\n---\n## <a id="a2"></a>Title\n<!-- wiki-section-meta\nanchorId: a2\nsectionStatus: approved\nclinicalSafety: standard\nrequiresDomainApproval: false\nmappingEligible: false\nsectionSourceRefs:\n  - sourceId: s1\n    title: S1\n    locator: L1\n    derivedFrom: D1\n    evidenceStatus: original-verified\n    sourceAvailability: original-verified\n-->`,
    'utf8'
  );
  const errors = [];
  scanWikiPages(wikiDir, errors, [], tempDir);
  assert.equal(errors.some(e => e.includes("must have sectionStatus 'draft'")), true);
});

test('Lifecycle Matrix 3: Reviewed page + reviewed section + original-verified + complete review -> PASS', () => {
  const wikiDir = path.join(tempDir, 'wiki-lifecycle-3');
  fs.mkdirSync(wikiDir, { recursive: true });
  fs.writeFileSync(
    path.join(wikiDir, 'page.md'),
    `---\nid: page-lc-3\ntitle: LC 3\ntype: domain\ndomainId: com5\nversion: 1.0.0\nstatus: reviewed\nlastReviewed: 2026-07-23\n---\n## <a id="a3"></a>Title\n<!-- wiki-section-meta\nanchorId: a3\nsectionStatus: reviewed\nclinicalSafety: standard\nrequiresDomainApproval: false\nmappingEligible: false\nsectionSourceRefs:\n  - sourceId: s1\n    title: S1\n    locator: L1\n    derivedFrom: D1\n    evidenceStatus: original-verified\n    sourceAvailability: original-verified\nreview:\n  decision: REVIEWED\n  reviewedBy: Dr. Jane\n  reviewedAt: 2026-07-23\n  approvalScope: General review\n-->`,
    'utf8'
  );
  const errors = [];
  scanWikiPages(wikiDir, errors, [], tempDir);
  assert.equal(errors.length, 0);
});

test('Lifecycle Matrix 4: Reviewed page + reviewed section + note-only -> ERROR', () => {
  const wikiDir = path.join(tempDir, 'wiki-lifecycle-4');
  fs.mkdirSync(wikiDir, { recursive: true });
  fs.writeFileSync(
    path.join(wikiDir, 'page.md'),
    `---\nid: page-lc-4\ntitle: LC 4\ntype: domain\ndomainId: com5\nversion: 1.0.0\nstatus: reviewed\nlastReviewed: 2026-07-23\n---\n## <a id="a4"></a>Title\n<!-- wiki-section-meta\nanchorId: a4\nsectionStatus: reviewed\nclinicalSafety: standard\nrequiresDomainApproval: false\nmappingEligible: false\nsectionSourceRefs:\n  - sourceId: s1\n    title: S1\n    locator: L1\n    derivedFrom: D1\n    evidenceStatus: derived-note\n    sourceAvailability: note-only\nreview:\n  decision: REVIEWED\n  reviewedBy: Dr. Jane\n  reviewedAt: 2026-07-23\n  approvalScope: General review\n-->`,
    'utf8'
  );
  const errors = [];
  scanWikiPages(wikiDir, errors, [], tempDir);
  assert.equal(errors.some(e => e.includes("requires sourceAvailability 'original-verified'")), true);
});

test('Lifecycle Matrix 5: Approved page + approved section + mapping false + original-verified + complete approval -> PASS', () => {
  const wikiDir = path.join(tempDir, 'wiki-lifecycle-5');
  fs.mkdirSync(wikiDir, { recursive: true });
  fs.writeFileSync(
    path.join(wikiDir, 'page.md'),
    `---\nid: page-lc-5\ntitle: LC 5\ntype: domain\ndomainId: com5\nversion: 1.0.0\nstatus: approved\nlastReviewed: 2026-07-23\n---\n## <a id="a5"></a>Title\n<!-- wiki-section-meta\nanchorId: a5\nsectionStatus: approved\nclinicalSafety: standard\nrequiresDomainApproval: false\nmappingEligible: false\nsectionSourceRefs:\n  - sourceId: s1\n    title: S1\n    locator: L1\n    derivedFrom: D1\n    evidenceStatus: original-verified\n    sourceAvailability: original-verified\nreview:\n  decision: APPROVED\n  reviewedBy: Dr. Jane\n  reviewedAt: 2026-07-23\n  approvalScope: General approval\n-->`,
    'utf8'
  );
  const errors = [];
  scanWikiPages(wikiDir, errors, [], tempDir);
  assert.equal(errors.length, 0);
});

test('Lifecycle Matrix 6: Approved page + approved section + mapping true + original-verified + complete approval -> PASS', () => {
  const wikiDir = path.join(tempDir, 'wiki-lifecycle-6');
  fs.mkdirSync(wikiDir, { recursive: true });
  fs.writeFileSync(
    path.join(wikiDir, 'page.md'),
    `---\nid: page-lc-6\ntitle: LC 6\ntype: domain\ndomainId: com5\nversion: 1.0.0\nstatus: approved\nlastReviewed: 2026-07-23\n---\n## <a id="a6"></a>Title\n<!-- wiki-section-meta\nanchorId: a6\nsectionStatus: approved\nclinicalSafety: standard\nrequiresDomainApproval: false\nmappingEligible: true\nsectionSourceRefs:\n  - sourceId: s1\n    title: S1\n    locator: L1\n    derivedFrom: D1\n    evidenceStatus: original-verified\n    sourceAvailability: original-verified\nreview:\n  decision: APPROVED\n  reviewedBy: Dr. Jane\n  reviewedAt: 2026-07-23\n  approvalScope: Full approval\n-->`,
    'utf8'
  );
  const errors = [];
  scanWikiPages(wikiDir, errors, [], tempDir);
  assert.equal(errors.length, 0);
});

test('Lifecycle Matrix 7: Approved page + approved section + mapping true + note-only -> ERROR', () => {
  const wikiDir = path.join(tempDir, 'wiki-lifecycle-7');
  fs.mkdirSync(wikiDir, { recursive: true });
  fs.writeFileSync(
    path.join(wikiDir, 'page.md'),
    `---\nid: page-lc-7\ntitle: LC 7\ntype: domain\ndomainId: com5\nversion: 1.0.0\nstatus: approved\nlastReviewed: 2026-07-23\n---\n## <a id="a7"></a>Title\n<!-- wiki-section-meta\nanchorId: a7\nsectionStatus: approved\nclinicalSafety: standard\nrequiresDomainApproval: false\nmappingEligible: true\nsectionSourceRefs:\n  - sourceId: s1\n    title: S1\n    locator: L1\n    derivedFrom: D1\n    evidenceStatus: derived-note\n    sourceAvailability: note-only\nreview:\n  decision: APPROVED\n  reviewedBy: Dr. Jane\n  reviewedAt: 2026-07-23\n  approvalScope: Full approval\n-->`,
    'utf8'
  );
  const errors = [];
  scanWikiPages(wikiDir, errors, [], tempDir);
  assert.equal(errors.some(e => e.includes("requires sourceAvailability 'original-verified'")), true);
});

test('Lifecycle Matrix 8: Draft page + approved section + mapping true + original-verified -> ERROR', () => {
  const wikiDir = path.join(tempDir, 'wiki-lifecycle-8');
  fs.mkdirSync(wikiDir, { recursive: true });
  fs.writeFileSync(
    path.join(wikiDir, 'page.md'),
    `---\nid: page-lc-8\ntitle: LC 8\ntype: domain\ndomainId: com5\nversion: 1.0.0\nstatus: draft\nlastReviewed: 2026-07-23\n---\n## <a id="a8"></a>Title\n<!-- wiki-section-meta\nanchorId: a8\nsectionStatus: approved\nclinicalSafety: standard\nrequiresDomainApproval: false\nmappingEligible: true\nsectionSourceRefs:\n  - sourceId: s1\n    title: S1\n    locator: L1\n    derivedFrom: D1\n    evidenceStatus: original-verified\n    sourceAvailability: original-verified\nreview:\n  decision: APPROVED\n  reviewedBy: Dr. Jane\n  reviewedAt: 2026-07-23\n  approvalScope: Full approval\n-->`,
    'utf8'
  );
  const errors = [];
  scanWikiPages(wikiDir, errors, [], tempDir);
  assert.equal(errors.some(e => e.includes("must have mappingEligible: false")), true);
});

test('Lifecycle Matrix 9: Approved page + draft section + mapping true + original-verified -> ERROR', () => {
  const wikiDir = path.join(tempDir, 'wiki-lifecycle-9');
  fs.mkdirSync(wikiDir, { recursive: true });
  fs.writeFileSync(
    path.join(wikiDir, 'page.md'),
    `---\nid: page-lc-9\ntitle: LC 9\ntype: domain\ndomainId: com5\nversion: 1.0.0\nstatus: approved\nlastReviewed: 2026-07-23\n---\n## <a id="a9"></a>Title\n<!-- wiki-section-meta\nanchorId: a9\nsectionStatus: draft\nclinicalSafety: standard\nrequiresDomainApproval: false\nmappingEligible: true\nsectionSourceRefs:\n  - sourceId: s1\n    title: S1\n    locator: L1\n    derivedFrom: D1\n    evidenceStatus: original-verified\n    sourceAvailability: original-verified\n-->`,
    'utf8'
  );
  const errors = [];
  scanWikiPages(wikiDir, errors, [], tempDir);
  assert.equal(errors.some(e => e.includes("mappingEligible: true requires sectionStatus 'approved'")), true);
});

test('Lifecycle Matrix 10: Approved section missing reviewedBy, reviewedAt, decision, or approvalScope -> ERROR', () => {
  const wikiDir = path.join(tempDir, 'wiki-lifecycle-10');
  fs.mkdirSync(wikiDir, { recursive: true });
  fs.writeFileSync(
    path.join(wikiDir, 'page.md'),
    `---\nid: page-lc-10\ntitle: LC 10\ntype: domain\ndomainId: com5\nversion: 1.0.0\nstatus: approved\nlastReviewed: 2026-07-23\n---\n## <a id="a10"></a>Title\n<!-- wiki-section-meta\nanchorId: a10\nsectionStatus: approved\nclinicalSafety: standard\nrequiresDomainApproval: false\nmappingEligible: false\nsectionSourceRefs:\n  - sourceId: s1\n    title: S1\n    locator: L1\n    derivedFrom: D1\n    evidenceStatus: original-verified\n    sourceAvailability: original-verified\nreview:\n  decision: APPROVED\n  reviewedBy: \n  reviewedAt: 2026-07-23\n  approvalScope: Full\n-->`,
    'utf8'
  );
  const errors = [];
  scanWikiPages(wikiDir, errors, [], tempDir);
  assert.equal(errors.some(e => e.includes("requires non-empty review.reviewedBy")), true);
});

test('Lifecycle Matrix 11: Restricted section + mapping true without explicit educational question generation scope -> ERROR', () => {
  const wikiDir = path.join(tempDir, 'wiki-lifecycle-11');
  fs.mkdirSync(wikiDir, { recursive: true });
  fs.writeFileSync(
    path.join(wikiDir, 'page.md'),
    `---\nid: page-lc-11\ntitle: LC 11\ntype: domain\ndomainId: com5\nversion: 1.0.0\nstatus: approved\nlastReviewed: 2026-07-23\n---\n## <a id="a11"></a>Title\n<!-- wiki-section-meta\nanchorId: a11\nsectionStatus: approved\nclinicalSafety: restricted\nrequiresDomainApproval: true\nmappingEligible: true\nsectionSourceRefs:\n  - sourceId: s1\n    title: S1\n    locator: L1\n    derivedFrom: D1\n    evidenceStatus: original-verified\n    sourceAvailability: original-verified\nreview:\n  decision: APPROVED\n  reviewedBy: Dr. Jane\n  reviewedAt: 2026-07-23\n  approvalScope: General approval without target string\n-->`,
    'utf8'
  );
  const errors = [];
  scanWikiPages(wikiDir, errors, [], tempDir);
  assert.equal(errors.some(e => e.includes("approvalScope containing 'educational question generation'")), true);
});

test('Lifecycle Matrix 12: Restricted section + mapping true with explicit educational question generation scope -> PASS', () => {
  const wikiDir = path.join(tempDir, 'wiki-lifecycle-12');
  fs.mkdirSync(wikiDir, { recursive: true });
  fs.writeFileSync(
    path.join(wikiDir, 'page.md'),
    `---\nid: page-lc-12\ntitle: LC 12\ntype: domain\ndomainId: com5\nversion: 1.0.0\nstatus: approved\nlastReviewed: 2026-07-23\n---\n## <a id="a12"></a>Title\n<!-- wiki-section-meta\nanchorId: a12\nsectionStatus: approved\nclinicalSafety: restricted\nrequiresDomainApproval: true\nmappingEligible: true\nsectionSourceRefs:\n  - sourceId: s1\n    title: S1\n    locator: L1\n    derivedFrom: D1\n    evidenceStatus: original-verified\n    sourceAvailability: original-verified\nreview:\n  decision: APPROVED\n  reviewedBy: Dr. Jane\n  reviewedAt: 2026-07-23\n  approvalScope: Approved for educational question generation and clinical review\n-->`,
    'utf8'
  );
  const errors = [];
  scanWikiPages(wikiDir, errors, [], tempDir);
  assert.equal(errors.length, 0);
});

test('Lifecycle Matrix 13: Invalid date format for reviewedAt (e.g. 2026-02-30) -> ERROR', () => {
  const wikiDir = path.join(tempDir, 'wiki-lifecycle-13');
  fs.mkdirSync(wikiDir, { recursive: true });
  fs.writeFileSync(
    path.join(wikiDir, 'page.md'),
    `---\nid: page-lc-13\ntitle: LC 13\ntype: domain\ndomainId: com5\nversion: 1.0.0\nstatus: approved\nlastReviewed: 2026-07-23\n---\n## <a id="a13"></a>Title\n<!-- wiki-section-meta\nanchorId: a13\nsectionStatus: approved\nclinicalSafety: standard\nrequiresDomainApproval: false\nmappingEligible: true\nsectionSourceRefs:\n  - sourceId: s1\n    title: S1\n    locator: L1\n    derivedFrom: D1\n    evidenceStatus: original-verified\n    sourceAvailability: original-verified\nreview:\n  decision: APPROVED\n  reviewedBy: Dr. Jane\n  reviewedAt: 2026-02-30\n  approvalScope: Full approval\n-->`,
    'utf8'
  );
  const errors = [];
  scanWikiPages(wikiDir, errors, [], tempDir);
  assert.equal(errors.some(e => e.includes("requires valid ISO-8601 review.reviewedAt")), true);
});

test('Lifecycle Matrix 14: Existing draft COM5/repro/exotic behavior remains valid', () => {
  const rootWikiDir = path.join(process.cwd(), 'wiki');
  const errors = [];
  scanWikiPages(rootWikiDir, errors, []);
  assert.equal(errors.length, 0);
});

test('Lifecycle Matrix 15: Validator remains read-only: fixture path tree and SHA-256 hashes identical before/after', () => {
  const fixtureDir = path.join(tempDir, 'wiki-readonly-lc');
  fs.mkdirSync(fixtureDir, { recursive: true });
  fs.writeFileSync(
    path.join(fixtureDir, 'test.md'),
    `---\nid: readonly-lc-test\ntitle: Test\ntype: domain\ndomainId: com5\nversion: 1.0.0\nstatus: draft\nlastReviewed: 2026-07-23\n---\n## <a id="t1"></a>Title\n<!-- wiki-section-meta\nanchorId: t1\nsectionStatus: draft\nclinicalSafety: standard\nrequiresDomainApproval: false\nmappingEligible: false\nsectionSourceRefs:\n  - sourceId: s1\n    title: S1\n    locator: L1\n    derivedFrom: D1\n    evidenceStatus: derived-note\n    sourceAvailability: note-only\n-->`,
    'utf8'
  );

  const hashBefore = getDirectoryTreeHash(fixtureDir);
  scanWikiPages(fixtureDir, [], [], tempDir);
  const hashAfter = getDirectoryTreeHash(fixtureDir);

  assert.equal(hashBefore, hashAfter);
});

test('Lifecycle Matrix 16: mappingEligible as string "true" -> ERROR', () => {
  const wikiDir = path.join(tempDir, 'wiki-lifecycle-16');
  fs.mkdirSync(wikiDir, { recursive: true });
  fs.writeFileSync(
    path.join(wikiDir, 'page.md'),
    `---\nid: page-lc-16\ntitle: LC 16\ntype: domain\ndomainId: com5\nversion: 1.0.0\nstatus: approved\nlastReviewed: 2026-07-23\n---\n## <a id="a16"></a>Title\n<!-- wiki-section-meta\nanchorId: a16\nsectionStatus: approved\nclinicalSafety: standard\nrequiresDomainApproval: false\nmappingEligible: "true"\nsectionSourceRefs:\n  - sourceId: s1\n    title: S1\n    locator: L1\n    derivedFrom: D1\n    evidenceStatus: original-verified\n    sourceAvailability: original-verified\nreview:\n  decision: APPROVED\n  reviewedBy: Dr. Jane\n  reviewedAt: 2026-07-23\n  approvalScope: Full\n-->`,
    'utf8'
  );
  const errors = [];
  scanWikiPages(wikiDir, errors, [], tempDir);
  assert.equal(errors.some(e => e.includes("mappingEligible must be a strict boolean")), true);
});

test('Lifecycle Matrix 17: approved section with review.decision = REVIEWED -> ERROR', () => {
  const wikiDir = path.join(tempDir, 'wiki-lifecycle-17');
  fs.mkdirSync(wikiDir, { recursive: true });
  fs.writeFileSync(
    path.join(wikiDir, 'page.md'),
    `---\nid: page-lc-17\ntitle: LC 17\ntype: domain\ndomainId: com5\nversion: 1.0.0\nstatus: approved\nlastReviewed: 2026-07-23\n---\n## <a id="a17"></a>Title\n<!-- wiki-section-meta\nanchorId: a17\nsectionStatus: approved\nclinicalSafety: standard\nrequiresDomainApproval: false\nmappingEligible: true\nsectionSourceRefs:\n  - sourceId: s1\n    title: S1\n    locator: L1\n    derivedFrom: D1\n    evidenceStatus: original-verified\n    sourceAvailability: original-verified\nreview:\n  decision: REVIEWED\n  reviewedBy: Dr. Jane\n  reviewedAt: 2026-07-23\n  approvalScope: Full\n-->`,
    'utf8'
  );
  const errors = [];
  scanWikiPages(wikiDir, errors, [], tempDir);
  assert.equal(errors.some(e => e.includes("requires review.decision 'APPROVED'")), true);
});

test('Lifecycle Matrix 18: approved section missing review object entirely -> ERROR', () => {
  const wikiDir = path.join(tempDir, 'wiki-lifecycle-18');
  fs.mkdirSync(wikiDir, { recursive: true });
  fs.writeFileSync(
    path.join(wikiDir, 'page.md'),
    `---\nid: page-lc-18\ntitle: LC 18\ntype: domain\ndomainId: com5\nversion: 1.0.0\nstatus: approved\nlastReviewed: 2026-07-23\n---\n## <a id="a18"></a>Title\n<!-- wiki-section-meta\nanchorId: a18\nsectionStatus: approved\nclinicalSafety: standard\nrequiresDomainApproval: false\nmappingEligible: true\nsectionSourceRefs:\n  - sourceId: s1\n    title: S1\n    locator: L1\n    derivedFrom: D1\n    evidenceStatus: original-verified\n    sourceAvailability: original-verified\n-->`,
    'utf8'
  );
  const errors = [];
  scanWikiPages(wikiDir, errors, [], tempDir);
  assert.equal(errors.some(e => e.includes("missing review metadata")), true);
});

test('Lifecycle Matrix 19: review metadata present in Review Pack but missing in section meta for reviewed/approved states -> ERROR', () => {
  const wikiDir = path.join(tempDir, 'wiki-lifecycle-19');
  fs.mkdirSync(wikiDir, { recursive: true });
  fs.writeFileSync(
    path.join(wikiDir, 'page.md'),
    `---\nid: page-lc-19\ntitle: LC 19\ntype: domain\ndomainId: com5\nversion: 1.0.0\nstatus: approved\nlastReviewed: 2026-07-23\n---\n## <a id="a19"></a>Title\n<!-- wiki-section-meta\nanchorId: a19\nsectionStatus: approved\nclinicalSafety: standard\nrequiresDomainApproval: false\nmappingEligible: true\nsectionSourceRefs:\n  - sourceId: s1\n    title: S1\n    locator: L1\n    derivedFrom: D1\n    evidenceStatus: original-verified\n    sourceAvailability: original-verified\n-->`,
    'utf8'
  );
  fs.writeFileSync(
    path.join(wikiDir, 'com5-review.md'),
    `---\nid: com5-review\ntitle: Review Pack\ntype: reference\nversion: 1.0.0\nstatus: draft\nlastReviewed: 2026-07-23\n---\n| Page ID | Anchor ID | Reviewer Decision |\n| page-lc-19 | a19 | APPROVED |`,
    'utf8'
  );
  const errors = [];
  scanWikiPages(wikiDir, errors, [], tempDir);
  assert.equal(errors.some(e => e.includes("missing review metadata")), true);
});

test('Approved Source Baseline 1: Valid inherited approval from notes-com5.js -> PASS', () => {
  const wikiDir = path.join(tempDir, 'wiki-asb-1');
  fs.mkdirSync(wikiDir, { recursive: true });
  fs.writeFileSync(
    path.join(wikiDir, 'page.md'),
    `---\nid: page-asb-1\ntitle: ASB 1\ntype: domain\ndomainId: com5\nversion: 1.0.0\nstatus: approved\nlastReviewed: 2026-07-23\n---\n## <a id="a1"></a>Title\n<!-- wiki-section-meta\nanchorId: a1\nsectionStatus: approved\nclinicalSafety: standard\nrequiresDomainApproval: false\nmappingEligible: true\nsourceApprovalBasis: approved-course-notes\nsourceApprovalRef: src/data/notes-com5.js\nsourceApprovalStatus: approved\nsectionSourceRefs:\n  - sourceId: s1\n    title: S1\n    locator: L1\n    derivedFrom: src/data/notes-com5.js\n    evidenceStatus: derived-note\n    sourceAvailability: note-only\nreview:\n  decision: APPROVED\n  approvalBasis: approved-course-notes\n  sourceApprovalRef: src/data/notes-com5.js\n  approvedAt: 2026-07-23\n  approvalScope: educational question generation only\n-->`,
    'utf8'
  );
  const errors = [];
  scanWikiPages(wikiDir, errors, [], tempDir);
  assert.equal(errors.length, 0);
});

test('Approved Source Baseline 2: Missing sourceApprovalRef when sourceApprovalBasis is approved-course-notes -> ERROR', () => {
  const wikiDir = path.join(tempDir, 'wiki-asb-2');
  fs.mkdirSync(wikiDir, { recursive: true });
  fs.writeFileSync(
    path.join(wikiDir, 'page.md'),
    `---\nid: page-asb-2\ntitle: ASB 2\ntype: domain\ndomainId: com5\nversion: 1.0.0\nstatus: approved\nlastReviewed: 2026-07-23\n---\n## <a id="a2"></a>Title\n<!-- wiki-section-meta\nanchorId: a2\nsectionStatus: approved\nclinicalSafety: standard\nrequiresDomainApproval: false\nmappingEligible: true\nsourceApprovalBasis: approved-course-notes\nsourceApprovalStatus: approved\nsectionSourceRefs:\n  - sourceId: s1\n    title: S1\n    locator: L1\n    derivedFrom: src/data/notes-com5.js\n    evidenceStatus: derived-note\n    sourceAvailability: note-only\nreview:\n  decision: APPROVED\n  approvedAt: 2026-07-23\n  approvalScope: educational question generation only\n-->`,
    'utf8'
  );
  const errors = [];
  scanWikiPages(wikiDir, errors, [], tempDir);
  assert.equal(errors.some(e => e.includes("requires valid sourceApprovalRef starting with 'src/data/notes-'")), true);
});

test('Approved Source Baseline 3: Invalid sourceApprovalRef reference -> ERROR', () => {
  const wikiDir = path.join(tempDir, 'wiki-asb-3');
  fs.mkdirSync(wikiDir, { recursive: true });
  fs.writeFileSync(
    path.join(wikiDir, 'page.md'),
    `---\nid: page-asb-3\ntitle: ASB 3\ntype: domain\ndomainId: com5\nversion: 1.0.0\nstatus: approved\nlastReviewed: 2026-07-23\n---\n## <a id="a3"></a>Title\n<!-- wiki-section-meta\nanchorId: a3\nsectionStatus: approved\nclinicalSafety: standard\nrequiresDomainApproval: false\nmappingEligible: true\nsourceApprovalBasis: approved-course-notes\nsourceApprovalRef: invalid/file.js\nsourceApprovalStatus: approved\nsectionSourceRefs:\n  - sourceId: s1\n    title: S1\n    locator: L1\n    derivedFrom: D1\n    evidenceStatus: derived-note\n    sourceAvailability: note-only\nreview:\n  decision: APPROVED\n  approvedAt: 2026-07-23\n  approvalScope: educational question generation only\n-->`,
    'utf8'
  );
  const errors = [];
  scanWikiPages(wikiDir, errors, [], tempDir);
  assert.equal(errors.some(e => e.includes("requires valid sourceApprovalRef starting with 'src/data/notes-'")), true);
});

test('Approved Source Baseline 4: AI identity in reviewedBy (e.g. AI) -> ERROR', () => {
  const wikiDir = path.join(tempDir, 'wiki-asb-4');
  fs.mkdirSync(wikiDir, { recursive: true });
  fs.writeFileSync(
    path.join(wikiDir, 'page.md'),
    `---\nid: page-asb-4\ntitle: ASB 4\ntype: domain\ndomainId: com5\nversion: 1.0.0\nstatus: approved\nlastReviewed: 2026-07-23\n---\n## <a id="a4"></a>Title\n<!-- wiki-section-meta\nanchorId: a4\nsectionStatus: approved\nclinicalSafety: standard\nrequiresDomainApproval: false\nmappingEligible: true\nsourceApprovalBasis: approved-course-notes\nsourceApprovalRef: src/data/notes-com5.js\nsourceApprovalStatus: approved\nsectionSourceRefs:\n  - sourceId: s1\n    title: S1\n    locator: L1\n    derivedFrom: src/data/notes-com5.js\n    evidenceStatus: derived-note\n    sourceAvailability: note-only\nreview:\n  decision: APPROVED\n  reviewedBy: AI\n  approvedAt: 2026-07-23\n  approvalScope: educational question generation only\n-->`,
    'utf8'
  );
  const errors = [];
  scanWikiPages(wikiDir, errors, [], tempDir);
  assert.equal(errors.some(e => e.includes("cannot specify an AI/LLM identity")), true);
});

test('Approved Source Baseline 5: Restricted section with mappingEligible: true lacking educational question generation scope -> ERROR', () => {
  const wikiDir = path.join(tempDir, 'wiki-asb-5');
  fs.mkdirSync(wikiDir, { recursive: true });
  fs.writeFileSync(
    path.join(wikiDir, 'page.md'),
    `---\nid: page-asb-5\ntitle: ASB 5\ntype: domain\ndomainId: com5\nversion: 1.0.0\nstatus: approved\nlastReviewed: 2026-07-23\n---\n## <a id="a5"></a>Title\n<!-- wiki-section-meta\nanchorId: a5\nsectionStatus: approved\nclinicalSafety: restricted\nrequiresDomainApproval: true\nmappingEligible: true\nsourceApprovalBasis: approved-course-notes\nsourceApprovalRef: src/data/notes-com5.js\nsourceApprovalStatus: approved\nsectionSourceRefs:\n  - sourceId: s1\n    title: S1\n    locator: L1\n    derivedFrom: src/data/notes-com5.js\n    evidenceStatus: derived-note\n    sourceAvailability: note-only\nreview:\n  decision: APPROVED\n  approvedAt: 2026-07-23\n  approvalScope: Clinical guidance only\n-->`,
    'utf8'
  );
  const errors = [];
  scanWikiPages(wikiDir, errors, [], tempDir);
  assert.equal(errors.some(e => e.includes("requires approvalScope containing 'educational question generation'")), true);
});

test('Approved Source Baseline 6: Non-COM5 note-only content without sourceApprovalBasis -> ERROR', () => {
  const wikiDir = path.join(tempDir, 'wiki-asb-6');
  fs.mkdirSync(wikiDir, { recursive: true });
  fs.writeFileSync(
    path.join(wikiDir, 'page.md'),
    `---\nid: page-asb-6\ntitle: ASB 6\ntype: domain\ndomainId: noncom5\nversion: 1.0.0\nstatus: approved\nlastReviewed: 2026-07-23\n---\n## <a id="a6"></a>Title\n<!-- wiki-section-meta\nanchorId: a6\nsectionStatus: approved\nclinicalSafety: standard\nrequiresDomainApproval: false\nmappingEligible: true\nsectionSourceRefs:\n  - sourceId: s1\n    title: S1\n    locator: L1\n    derivedFrom: notes.js\n    evidenceStatus: derived-note\n    sourceAvailability: note-only\nreview:\n  decision: APPROVED\n  reviewedBy: Dr. Smith\n  reviewedAt: 2026-07-23\n  approvalScope: Full\n-->`,
    'utf8'
  );
  const errors = [];
  scanWikiPages(wikiDir, errors, [], tempDir);
  assert.equal(errors.some(e => e.includes("requires sourceAvailability 'original-verified'")), true);
});

test('Approved Source Baseline 7: Mixed approved and draft sections on same approved page -> PASS', () => {
  const wikiDir = path.join(tempDir, 'wiki-asb-7');
  fs.mkdirSync(wikiDir, { recursive: true });
  fs.writeFileSync(
    path.join(wikiDir, 'page.md'),
    `---\nid: page-asb-7\ntitle: ASB 7\ntype: domain\ndomainId: exotic\nversion: 1.0.0\nstatus: approved\nlastReviewed: 2026-07-23\n---\n## <a id="a7-approved"></a>Approved Section\n<!-- wiki-section-meta\nanchorId: a7-approved\nsectionStatus: approved\nclinicalSafety: standard\nrequiresDomainApproval: false\nmappingEligible: true\nsourceApprovalBasis: approved-course-notes\nsourceApprovalRef: src/data/notes-exotic.js\nsourceApprovalStatus: approved\nsectionSourceRefs:\n  - sourceId: s1\n    title: S1\n    locator: L1\n    derivedFrom: src/data/notes-exotic.js\n    evidenceStatus: derived-note\n    sourceAvailability: note-only\nreview:\n  decision: APPROVED\n  approvedAt: 2026-07-23\n  approvalScope: educational question generation\n-->\n\n## <a id="a7-draft"></a>Draft Section\n<!-- wiki-section-meta\nanchorId: a7-draft\nsectionStatus: draft\nclinicalSafety: restricted\nrequiresDomainApproval: true\nmappingEligible: false\nsourceApprovalStatus: pending\nsectionSourceRefs:\n  - sourceId: s2\n    title: S2\n    locator: L2\n    derivedFrom: src/data/notes-exotic.js\n    evidenceStatus: derived-note\n    sourceAvailability: note-only\n-->`,
    'utf8'
  );
  const errors = [];
  scanWikiPages(wikiDir, errors, [], tempDir);
  assert.equal(errors.length, 0);
});

