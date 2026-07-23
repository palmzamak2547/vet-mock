// ============================================================
// public-wiki-filter.js — Pure Server/Public Wiki Filter Logic
// ============================================================

/**
 * Filter wiki pages for public student accessibility.
 * Excludes draft, archived, unapproved, demo, and test-only content.
 */
export function filterPublicPages(pages = []) {
  return pages
    .filter((p) => {
      if (!p || typeof p !== 'object') return false;
      const isApproved = p.status === 'approved';
      const hasSourceRef = Boolean(p.sourceApprovalRef && String(p.sourceApprovalRef).trim());
      const isDemo = p.isDemo === true || p.visibility === 'test_only' || String(p.sourceApprovalRef).includes('DEMO');
      return isApproved && hasSourceRef && !isDemo;
    })
    .map((page) => ({
      ...page,
      anchors: (page.anchors || []).filter((a) => {
        const isAnchorApproved = a.status === 'approved';
        const isEligible = a.mappingEligible === true;
        const hasAnchorSourceRef = Boolean(a.sourceApprovalRef && String(a.sourceApprovalRef).trim());
        const isAnchorDemo = a.isDemo === true || a.visibility === 'test_only' || String(a.sourceApprovalRef).includes('DEMO');
        return isAnchorApproved && isEligible && hasAnchorSourceRef && !isAnchorDemo;
      }),
    }));
}
