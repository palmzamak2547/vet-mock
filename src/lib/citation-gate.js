// ============================================================
// citation-gate.js — Strict Validation Gate for UI Citation Display
// ============================================================

/**
 * Strict gate for Phase 1 Wiki Citation Chip rendering:
 * Reference must be a valid object with non-empty pageId, anchorId, and label strings,
 * status must be 'approved', and mappingStatus must be 'verified'.
 */
export const isDisplayableWikiRef = (ref) =>
  !!(ref &&
  typeof ref === 'object' &&
  typeof ref.pageId === 'string' &&
  ref.pageId.trim().length > 0 &&
  typeof ref.anchorId === 'string' &&
  ref.anchorId.trim().length > 0 &&
  typeof ref.label === 'string' &&
  ref.label.trim().length > 0 &&
  ref.status === 'approved' &&
  ref.mappingStatus === 'verified');
