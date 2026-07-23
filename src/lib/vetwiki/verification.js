// ============================================================
// VetWiki — reference-verification overlay
// ============================================================
// The "verify against authoritative external references instead of waiting
// for a professor" layer (per product direction 2026-07-24).
//
// The legacy adapter imports every note section honestly as
// evidenceStatus:'derived-note' / reviewStatus:'draft'. This overlay is the
// ONLY place a section/claim is promoted above that — and only when it has
// been cross-checked against a REAL external source in ./sources.js.
//
// ⛔ IRON RULE 0: a promotion here asserts a real check happened against a
// real, cited source. `reviewedBy: 'reference-verified'` is a MACHINE
// cross-check, never presented to users as qualified human sign-off — the UI
// labels it "ตรวจทานกับแหล่งอ้างอิง", distinct from human domain-owner review.
// Anything not listed here stays draft/derived-note. No fabrication.
//
// Keyed by topicId → sectionId → { section-level overrides + verified claims }.
// ============================================================

const TODAY = '2026-07-24';

/** @type {Record<string, Record<string, {evidenceStatus?: string, reviewStatus?: string, review?: object, claims?: object[]}>>} */
export const VERIFICATIONS = {
  'com5--rabies': {
    'com5--rabies--overview': {
      claims: [
        {
          id: 'com5--rabies--overview--taxonomy',
          statement: 'ไวรัสโรคพิษสุนัขบ้าเป็น Lyssavirus ในวงศ์ Rhabdoviridae (bullet-shaped, ssRNA, enveloped)',
          evidenceStatus: 'established',
          reviewStatus: 'verified',
          sourceRefs: [{ sourceId: 'woah-tahm-rabies', locator: 'Ch 3.1.18 §1', kind: 'guideline' }],
          review: { reviewedBy: 'reference-verified', reviewedAt: TODAY, method: 'reference-cross-check', approvedScopes: ['learning', 'assessment'], rationale: 'Taxonomy confirmed against WOAH Terrestrial Manual ch 3.1.18.' },
        },
      ],
    },
    'com5--rabies--diagnosis': {
      claims: [
        {
          id: 'com5--rabies--diagnosis--fat-standard',
          statement: 'Fluorescent antibody test (FAT/DFA) บนเนื้อสมองเป็นวิธีตรวจ post-mortem มาตรฐานที่ WHO และ WOAH แนะนำ (แม่นยำ ~98–100% เมื่อใช้ conjugate ที่ดี)',
          evidenceStatus: 'established',
          reviewStatus: 'verified',
          sourceRefs: [{ sourceId: 'woah-tahm-rabies', locator: 'Ch 3.1.18 §B.1', kind: 'guideline' }],
          review: { reviewedBy: 'reference-verified', reviewedAt: TODAY, method: 'reference-cross-check', approvedScopes: ['learning', 'assessment'], rationale: 'FAT as the standard, WOAH/WHO-recommended method confirmed against WOAH Terrestrial Manual ch 3.1.18.' },
        },
        {
          id: 'com5--rabies--diagnosis--six-criteria',
          statement: 'เกณฑ์ทางคลินิก 6 ข้อวินิจฉัยโรคพิษสุนัขบ้าในสุนัขที่ยังมีชีวิตได้ ด้วยความไว ~90.2% และความจำเพาะ ~96.2% (Tepsumethanon et al., 2005)',
          evidenceStatus: 'supported',
          reviewStatus: 'verified',
          sourceRefs: [{ sourceId: 'tepsumethanon-2005', locator: 'pp.419-22', kind: 'primary-literature' }],
          review: { reviewedBy: 'reference-verified', reviewedAt: TODAY, method: 'reference-cross-check', approvedScopes: ['learning'], rationale: 'Citation, sensitivity 90.2% and specificity 96.2% confirmed against J Med Assoc Thai 2005;88(3):419-22.', },
          limitations: ['เป็นเกณฑ์ช่วยวินิจฉัยเชิงคลินิก ไม่ใช่การยืนยันทางห้องปฏิบัติการ — ยืนยันขั้นสุดท้ายด้วย FAT'],
        },
      ],
    },
  },
};

/** Look up the verification overlay for a topic (or empty object). */
export function verificationFor(topicId) {
  return VERIFICATIONS[topicId] || {};
}
