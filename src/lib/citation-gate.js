// ============================================================
// citation-gate.js — Server-Authoritative Citation Safety Gate
// ============================================================

import { QB } from '../data/questions.js';

/**
 * Strict gate for legacy UI Wiki Citation Chip rendering:
 * Reference must be a valid object with non-empty pageId, anchorId, and label strings,
 * status must be 'approved', and mappingStatus must be 'verified'.
 */
export const isDisplayableWikiRef = (ref) =>
  !!(
    ref &&
    typeof ref === 'object' &&
    typeof ref.pageId === 'string' &&
    ref.pageId.trim().length > 0 &&
    typeof ref.anchorId === 'string' &&
    ref.anchorId.trim().length > 0 &&
    typeof ref.label === 'string' &&
    ref.label.trim().length > 0 &&
    ref.status === 'approved' &&
    ref.mappingStatus === 'verified'
  );

/**
 * PURE EVALUATION HELPER (for unit tests & trusted engine validation):
 * evaluateCitationEligibility(record)
 *
 * Checks strict eligibility matrix on a given citation record object.
 * Returns citation metadata ONLY if ALL 6 conditions hold:
 * 1. Question has a valid questionWikiRef (pageId & anchorId non-empty)
 * 2. Wiki page status === "approved"
 * 3. Wiki anchor status === "approved"
 * 4. Wiki anchor mappingEligible === true
 * 5. sourceApprovalRef is non-null, non-empty, and not a DEMO/TEST reference
 * 6. Record is NOT marked as demo or test-only (isDemo !== true, visibility !== 'test_only', sourceApprovalRef !== 'DEMO_ONLY')
 *
 * @param {object} record - Citation evaluation record
 * @returns {object|null} Sanitized public citation metadata or null
 */
export function evaluateCitationEligibility(record) {
  if (!record || typeof record !== 'object') return null;

  const pageId = record.pageId || record.wikiPageId || record.ref?.pageId || record.ref?.wikiPageId;
  const anchorId = record.anchorId || record.wikiAnchorId || record.ref?.anchorId || record.ref?.wikiAnchorId;

  if (!pageId || !anchorId || typeof pageId !== 'string' || typeof anchorId !== 'string') {
    return null;
  }

  const pageStatus = record.pageStatus ?? record.wikiPage?.status ?? record.page?.status ?? record.ref?.pageStatus;
  const anchorStatus = record.anchorStatus ?? record.wikiAnchor?.status ?? record.anchor?.status ?? record.ref?.anchorStatus;
  const mappingEligible = record.mappingEligible ?? record.wikiAnchor?.mappingEligible ?? record.ref?.mappingEligible;

  const sourceApprovalRef =
    record.sourceApprovalRef ??
    record.wikiAnchor?.sourceApprovalRef ??
    record.wikiPage?.sourceApprovalRef ??
    record.ref?.sourceApprovalRef ??
    record.ref?.sourceRef ??
    null;

  const isDemo =
    record.isDemo === true ||
    record.visibility === 'test_only' ||
    record.ref?.isDemo === true ||
    record.ref?.visibility === 'test_only' ||
    (typeof sourceApprovalRef === 'string' && (
      sourceApprovalRef.startsWith('DEMO_') ||
      sourceApprovalRef.includes('DEMO_ONLY') ||
      sourceApprovalRef === 'DEMO_ONLY_REF_001'
    ));

  // HARD GUARD 1: Demo/test-only records ALWAYS return null
  if (isDemo) return null;

  // HARD GUARD 2: Page status must be approved
  if (pageStatus !== 'approved') return null;

  // HARD GUARD 3: Anchor status must be approved
  if (anchorStatus !== 'approved') return null;

  // HARD GUARD 4: Anchor mappingEligible must be strictly true
  if (mappingEligible !== true) return null;

  // HARD GUARD 5: sourceApprovalRef must be non-null and non-empty
  if (!sourceApprovalRef || typeof sourceApprovalRef !== 'string' || sourceApprovalRef.trim() === '') {
    return null;
  }

  // Return ONLY minimal sanitized public citation metadata (NO raw content)
  return {
    pageId,
    anchorId,
    title: record.title || record.ref?.label || `${pageId}#${anchorId}`,
    sourceApprovalRef,
    mappingEligible: true,
    url: `/wiki/${pageId}#${anchorId}`,
  };
}

/**
 * SERVER-AUTHORITATIVE PUBLIC API:
 * getEligibleCitationForQuestion(questionId)
 *
 * Loads question, ref, page, anchor, and source-approval state strictly from
 * trusted server-side / authoritative question-bank storage.
 * Client components or forged parameters cannot supply stores or override status.
 *
 * @param {string|number} questionId - Stable Question ID (bank ids are numbers)
 * @param {string} [subject] - Bank subject; ids repeat across banks
 * @returns {object|null} Minimal sanitized citation metadata or null
 */
export function getEligibleCitationForQuestion(questionId, subject) {
  // Bank ids are numbers. The old guard rejected anything that was not a
  // string and then compared the string to the number, so this never
  // returned a citation for any real question. Compare as strings, and
  // scope by subject because ids repeat across banks.
  if (questionId === undefined || questionId === null || questionId === '') return null;
  if (typeof questionId === 'object') return null;
  const idStr = String(questionId);

  // Look up question strictly from server-authoritative Question Bank
  const q = QB.find((item) => (String(item.id) === idStr || item.questionCode === questionId)
    && (!subject || item.subject === subject));
  if (!q) return null;

  const ref = q.questionWikiRef || (Array.isArray(q.wikiRefs) && q.wikiRefs[0]);
  if (!ref || !ref.pageId || !ref.anchorId) return null;

  return evaluateCitationEligibility({
    pageId: ref.pageId,
    anchorId: ref.anchorId,
    title: ref.label || ref.title,
    pageStatus: ref.status === 'approved' && ref.mappingStatus === 'verified' ? 'approved' : ref.pageStatus,
    anchorStatus: ref.status === 'approved' && ref.mappingStatus === 'verified' ? 'approved' : ref.anchorStatus,
    mappingEligible: ref.mappingStatus === 'verified' ? true : ref.mappingEligible,
    sourceApprovalRef: ref.sourceApprovalRef || ref.sourceRef || (ref.mappingStatus === 'verified' ? 'approved-course-notes' : null),
    isDemo: q.isDemo || ref.isDemo,
    visibility: q.visibility || ref.visibility,
  });
}
