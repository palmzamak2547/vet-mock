// ============================================================
// VetWiki — knowledge schema + human-language labels
// ============================================================
// The traceable veterinary-knowledge foundation for VetMock.
//
// Design notes (grounded in the repo baseline audit 2026-07-23):
//   • Runtime knowledge is STRUCTURED data derived from the existing
//     src/data/notes-*.js corpus via a legacy adapter — NOT parsed at
//     runtime from the hand-authored wiki/*.md pages. The markdown wiki
//     (wiki/domain/**, wiki/reviews/**, authored by เกษม) is the human
//     editorial + review-record layer; this module is the app-runtime
//     layer. They intentionally share the same field vocabulary
//     (evidenceStatus / reviewStatus / sourceRefs) so a section can move
//     between them without a translation table.
//   • Plain JS (the repo has no TS). Types live in JSDoc so editors +
//     humans get the shape without a build step. The conceptual model
//     mirrors the VetWiki brief's VetWikiClaim / SupportedAnswerClaim.
//   • Smallest schema that satisfies the first slice — section-level
//     knowledge units, with an optional lightweight `claims[]` only on
//     sections that carry a verified external-reference statement. No
//     speculative over-abstraction.
//
// IRON RULE: statuses describe how well a statement is supported. The UI
// must never show `derived-note` / `draft` as if it were verified fact,
// and nothing here fabricates a reference, reviewer, or date.
// ============================================================

/**
 * @typedef {'established'|'supported'|'limited'|'conflicting'|'expert-consensus'|'insufficient'|'derived-note'} EvidenceStatus
 * `derived-note` = paraphrased from a VetMock lecture note, not yet checked
 * against a primary/authoritative source. It is the honest default for
 * adapter-imported content.
 */

/**
 * @typedef {'draft'|'reviewed'|'verified'|'deprecated'} ReviewStatus
 */

/**
 * @typedef {'learning'|'assessment'|'research'|'clinical-decision-support'} KnowledgeUseScope
 */

/**
 * @typedef {Object} SourceRef
 * @property {string} sourceId         stable id into SOURCES (external) or a note locator id
 * @property {string} [locator]        e.g. "p.7-9", "§Prevention"
 * @property {'lecture-note'|'external-reference'|'guideline'|'textbook'|'primary-literature'} kind
 */

/**
 * @typedef {Object} ReviewRecord
 * @property {string} reviewedBy       a real reviewer id, or the sentinel 'reference-verified'
 *                                     (machine cross-check against an external source — NEVER
 *                                     presented as qualified human verification)
 * @property {string} reviewedAt       ISO date (YYYY-MM-DD)
 * @property {'reference-cross-check'|'human-domain-owner'} method
 * @property {string} [rationale]
 * @property {KnowledgeUseScope[]} [approvedScopes]
 */

/**
 * @typedef {Object} KnowledgeClaim
 * A single traceable statement inside a section (only created when it has
 * been checked against an external reference — the verification overlay).
 * @property {string} id
 * @property {string} statement
 * @property {EvidenceStatus} evidenceStatus
 * @property {ReviewStatus} reviewStatus
 * @property {SourceRef[]} sourceRefs
 * @property {ReviewRecord} [review]
 * @property {string[]} [applicableContext]
 * @property {string[]} [limitations]
 */

/**
 * @typedef {Object} KnowledgeSection
 * @property {string} id               stable: `${subject}--${topic}--${slug(heading)}`
 * @property {string} heading
 * @property {any[]} body              original note body (bullets|sub|table|string) for RichText
 * @property {EvidenceStatus} evidenceStatus
 * @property {ReviewStatus} reviewStatus
 * @property {KnowledgeUseScope[]} useScopes
 * @property {SourceRef[]} sourceRefs
 * @property {ReviewRecord} [review]
 * @property {KnowledgeClaim[]} [claims]   verified statements within the section
 */

/**
 * @typedef {Object} KnowledgeTopic
 * @property {string} id               stable: `${subject}--${topic}`
 * @property {string} subject
 * @property {string} topic
 * @property {string} title
 * @property {string} [summary]
 * @property {string} [lecturer]
 * @property {string} [icon]
 * @property {number} version
 * @property {SourceRef[]} sourceRefs
 * @property {KnowledgeSection[]} sections
 */

// ---- Stable-id helpers ---------------------------------------------------
// Stable identity must NOT depend on array index / line number / route /
// component name. It is derived only from (subject, topic, heading-text).

/** Deterministic, ASCII-safe slug that preserves Thai by transliterating to
 *  a stable code point sequence only when needed. For headings we keep the
 *  ASCII/number run + collapse the rest, which is stable across reorders. */
export function slug(text) {
  return String(text || '')
    .toLowerCase()
    .replace(/[^\da-z฀-๿]+/g, '-') // keep latin+digits+thai, else dash
    .replace(/^-+|-+$/g, '')
    .slice(0, 64) || 'section';
}

export const topicId = (subject, topic) => `${subject}--${topic}`;
export const sectionId = (subject, topic, heading) => `${subject}--${topic}--${slug(heading)}`;

// ---- Human-language labels (NEVER show raw enum values to users) ---------
// The internal enums are technical; users see calm Thai.

/** @type {Record<EvidenceStatus, {th: string, tone: 'strong'|'ok'|'weak'|'warn'|'muted'}>} */
export const EVIDENCE_LABEL = {
  established: { th: 'หลักฐานชัดเจน', tone: 'strong' },
  supported: { th: 'มีหลักฐานรองรับ', tone: 'ok' },
  limited: { th: 'หลักฐานยังจำกัด', tone: 'weak' },
  conflicting: { th: 'มีข้อถกเถียง', tone: 'warn' },
  'expert-consensus': { th: 'ความเห็นพ้องผู้เชี่ยวชาญ', tone: 'ok' },
  insufficient: { th: 'ข้อมูลยังไม่พอ', tone: 'muted' },
  'derived-note': { th: 'จากโน้ตเลกเชอร์', tone: 'muted' },
};

/** @type {Record<ReviewStatus, {th: string, tone: 'strong'|'ok'|'weak'|'muted'}>} */
export const REVIEW_LABEL = {
  verified: { th: 'ตรวจทานแล้ว', tone: 'strong' },
  reviewed: { th: 'อ่านทานเบื้องต้น', tone: 'ok' },
  draft: { th: 'ฉบับร่าง', tone: 'weak' },
  deprecated: { th: 'มีเนื้อหาใหม่กว่า', tone: 'muted' },
};

/** How a supported statement in a VetMock answer got its support. */
export const SUPPORT_LABEL = {
  'vetwiki-verified': { th: 'ยืนยันจาก VetWiki', tone: 'strong' },
  'external-evidence': { th: 'อ้างอิงภายนอก', tone: 'ok' },
  'tool-result': { th: 'ผลจากเครื่องมือ', tone: 'ok' },
  'vetmock-analysis': { th: 'การวิเคราะห์ของ VetMock', tone: 'weak' },
  'conflicting-evidence': { th: 'มีข้อถกเถียง', tone: 'warn' },
  'insufficient-evidence': { th: 'ข้อมูลยังไม่พอ', tone: 'muted' },
};

export const USE_SCOPE_LABEL = {
  learning: 'สำหรับการเรียน',
  assessment: 'สำหรับการสอบ',
  research: 'สำหรับงานวิจัย',
  'clinical-decision-support': 'ใช้เป็นข้อมูลประกอบทางคลินิก',
};

export const ALL_EVIDENCE = Object.keys(EVIDENCE_LABEL);
export const ALL_REVIEW = Object.keys(REVIEW_LABEL);
