// ============================================================
// VetWiki — shareable URLs
// ============================================================
// A reference nobody can link to isn't a reference. VetMock has no router
// (one `view` string in App.jsx), so rather than migrate the whole app to a
// framework for this one need, VetWiki claims a real path namespace:
//
//   /wiki                        → the index
//   /wiki/com5/rabies            → an article
//   /wiki/com5/rabies#com5--rabies--diagnosis   → an exact section
//
// Vercel rewrites /wiki/* to the SPA (see vercel.json), App.initialView reads
// the path on boot, and KnowledgeView pushes history as you navigate — so the
// links are shareable, citable, bookmarkable, and Back/Forward work. No
// framework change, no risk to the exam flow.
//
// Pure functions only — unit-testable without a DOM.
// ============================================================

export const WIKI_BASE = '/wiki';

/** Build a shareable path for a topic (and optionally an exact section). */
export function wikiPath(subject, topic, sectionId) {
  if (!subject || !topic) return WIKI_BASE;
  const base = `${WIKI_BASE}/${encodeURIComponent(subject)}/${encodeURIComponent(topic)}`;
  return sectionId ? `${base}#${sectionId}` : base;
}

/** Absolute URL for copy-to-clipboard / sharing. */
export function wikiUrl(origin, subject, topic, sectionId) {
  return `${String(origin || '').replace(/\/$/, '')}${wikiPath(subject, topic, sectionId)}`;
}

/**
 * Parse a pathname into a wiki target.
 * @returns {{ isWiki: boolean, subject: string|null, topic: string|null }}
 */
export function parseWikiPath(pathname) {
  const p = String(pathname || '');
  if (p !== WIKI_BASE && !p.startsWith(`${WIKI_BASE}/`)) {
    return { isWiki: false, subject: null, topic: null };
  }
  const rest = p.slice(WIKI_BASE.length).replace(/^\/+|\/+$/g, '');
  if (!rest) return { isWiki: true, subject: null, topic: null };
  const [subject, topic] = rest.split('/').map((s) => {
    try { return decodeURIComponent(s); } catch { return s; }
  });
  return { isWiki: true, subject: subject || null, topic: topic || null };
}
