import assert from 'node:assert/strict';
import test from 'node:test';
import fs from 'node:fs';
import os from 'node:os';
import path from 'node:path';
import { execFileSync } from 'node:child_process';

import { GENERATED_VERIFICATIONS } from '../../src/lib/vetwiki/verification-generated.js';

// The sourcing pass returns two kinds of finding. `supported: true` means a
// source backs the slide up. `supported: false` means a source was found and it
// DISAGREES with the slide — the most valuable thing the pass can return,
// because that is where a student learns something wrong and cannot tell.
//
// The ingest script used to drop every one of them under the label "agent
// reported no source found", which was both wrong and self-concealing: the
// count looked like a sourcing failure, so nobody went looking for the
// findings. Forty-eight of them were lost that way before this was noticed.
//
// These tests pin both halves of the fix: a contradiction never enters the
// overlay that asserts a section is backed up, and it is not thrown away either.

const script = path.join(process.cwd(), 'scripts', 'ingest-verifications.mjs');

// A pair of claims on a section that really exists, so anchoring succeeds and
// the only thing under test is the supported/contradiction split. Neither
// carries a pmid or doi, so neither touches the network: both take the
// named-guideline path.
const SECTION = 'ตัวพระราชบัญญัติและการยกเลิกกฎหมายเดิม';
const base = {
  topicId: 'aqua-disease-control',
  sectionHeading: SECTION,
  sourceKind: 'guideline',
  sourceTitle: 'พระราชบัญญัติโรคระบาดสัตว์ พ.ศ. 2558',
  journalOrOrg: 'ราชกิจจานุเบกษา',
  year: 2558,
  supportQuote: 'quote',
};

function runIngest(claims) {
  const dir = fs.mkdtempSync(path.join(os.tmpdir(), 'vmx-ingest-'));
  const claimsFile = path.join(dir, 'claims.json');
  const conflictFile = path.join(dir, 'conflicts.json');
  fs.writeFileSync(claimsFile, JSON.stringify(claims));
  // no --write: the overlay on disk is never touched by this test
  const out = execFileSync('node', [script, claimsFile, '--subject', 'aquatic-clinic', '--conflicts', conflictFile], { encoding: 'utf8' });
  const conflicts = fs.existsSync(conflictFile) ? JSON.parse(fs.readFileSync(conflictFile, 'utf8')) : null;
  fs.rmSync(dir, { recursive: true, force: true });
  return { out, conflicts };
}

test('a contradiction is kept, not counted as a missing source', () => {
  const { out, conflicts } = runIngest([
    { ...base, supported: true, statement: 'agrees with the slide' },
    { ...base, supported: false, statement: 'disagrees with the slide' },
  ]);

  assert.match(out, /accepted : 1/, 'only the supporting claim is accepted');
  assert.match(out, /conflicts: 1/, 'the contradiction is reported as a conflict');
  assert.match(out, /dropped {2}: 0/, 'a contradiction is not a drop');
  assert.doesNotMatch(out, /no source found/, 'the old mislabel is gone');

  assert.equal(conflicts.length, 1);
  assert.equal(conflicts[0].statement, 'disagrees with the slide');
  assert.equal(conflicts[0]._sectionId, `aquatic-clinic--aqua-disease-control--${'ตัวพระราชบัญญัติและการยกเลิกกฎหมายเดิม'}`);
});

test('a contradiction never reaches the verification overlay', () => {
  // The overlay says "this section is backed up". A disagreement does not
  // belong in it whatever else happens to it.
  for (const [topicId, sections] of Object.entries(GENERATED_VERIFICATIONS)) {
    for (const [sectionId, entry] of Object.entries(sections)) {
      for (const claim of entry.claims || []) {
        assert.notEqual(
          claim.supported, false,
          `${topicId}/${sectionId}: a contradicting claim is being presented as verification`,
        );
      }
    }
  }
});
