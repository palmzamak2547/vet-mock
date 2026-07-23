// ============================================================
// VetWiki — validation (the trust gate)
// ============================================================
// Deterministic checks that enforce the citation/provenance contract BEFORE
// any knowledge or answer is shown. This is the layer that makes "verified"
// mean something. It returns structured problems; it never throws on content.
//
// Invariants enforced (from the VetWiki brief):
//   • every SourceRef points at a source that actually exists
//   • a 'verified' claim MUST carry ≥1 real source + a review record
//   • an evidence status above derived-note MUST carry ≥1 source
//   • review scope must permit the intended use scope
//   • deprecated knowledge is flagged (never silently shown as current)
//   • a claim cannot be 'verified' by a machine cross-check yet assert a
//     human-domain-owner method (no laundering machine review into human)
// ============================================================

import { SOURCES } from './sources.js';
import { ALL_EVIDENCE, ALL_REVIEW } from './schema.js';

/** @returns {{ ok: boolean, problems: Array<{level:'error'|'warn', code:string, id:string, msg:string}> }} */
export function validateTopic(topic, { useScope = 'learning' } = {}) {
  const problems = [];
  const err = (code, id, msg) => problems.push({ level: 'error', code, id, msg });
  const warn = (code, id, msg) => problems.push({ level: 'warn', code, id, msg });

  if (!topic || !topic.id) { err('no-topic', '-', 'missing topic'); return { ok: false, problems }; }

  const checkSourceRefs = (refs, id) => {
    for (const r of refs || []) {
      const isLectureNote = String(r.sourceId || '').startsWith('lecture:');
      if (isLectureNote) continue; // note locators are self-describing, not in SOURCES
      if (!SOURCES[r.sourceId]) {
        // A referenced external source that doesn't exist == a fabricated/dangling citation.
        err('dangling-source', id, `source "${r.sourceId}" is not in the source registry`);
      }
    }
  };

  for (const s of topic.sections || []) {
    if (!s.id) err('no-section-id', topic.id, 'section without stable id');
    if (!ALL_EVIDENCE.includes(s.evidenceStatus)) err('bad-evidence', s.id, `unknown evidenceStatus ${s.evidenceStatus}`);
    if (!ALL_REVIEW.includes(s.reviewStatus)) err('bad-review', s.id, `unknown reviewStatus ${s.reviewStatus}`);
    checkSourceRefs(s.sourceRefs, s.id);

    // A section-level evidenceStatus above derived-note is an assertion about
    // the whole section and must carry its OWN source — claims are separate
    // sub-units and cannot launder a section-level status.
    if (s.evidenceStatus !== 'derived-note' && (!s.sourceRefs || s.sourceRefs.length === 0)) {
      err('unsupported-as-supported', s.id, `evidenceStatus ${s.evidenceStatus} but no section source`);
    }
    if (s.reviewStatus === 'deprecated') warn('deprecated', s.id, 'section is deprecated — must not read as current');

    for (const c of s.claims || []) {
      if (!c.id) err('no-claim-id', s.id, 'claim without id');
      checkSourceRefs(c.sourceRefs, c.id || s.id);
      if (c.reviewStatus === 'verified') {
        if (!c.sourceRefs || c.sourceRefs.length === 0) err('verified-no-source', c.id, 'verified claim with no source (fabricated verification)');
        if (!c.review || !c.review.reviewedBy) err('verified-no-review', c.id, 'verified claim with no review record');
        // Machine cross-check must not claim to be human sign-off.
        if (c.review && c.review.reviewedBy === 'reference-verified' && c.review.method === 'human-domain-owner') {
          err('machine-as-human', c.id, 'reference cross-check cannot claim human-domain-owner method');
        }
      }
      if (c.evidenceStatus && c.evidenceStatus !== 'derived-note' && (!c.sourceRefs || c.sourceRefs.length === 0)) {
        err('claim-unsupported', c.id, `claim evidenceStatus ${c.evidenceStatus} but no source`);
      }
      // Scope enforcement: a claim used outside its approved scope is a misuse.
      const approved = c.review && c.review.approvedScopes;
      if (c.reviewStatus === 'verified' && Array.isArray(approved) && !approved.includes(useScope)) {
        warn('scope-mismatch', c.id, `verified for [${approved.join(',')}], requested "${useScope}"`);
      }
    }
  }

  return { ok: !problems.some((p) => p.level === 'error'), problems };
}
