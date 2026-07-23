// ============================================================
// VetWiki — search index
// ============================================================
// Full-text search across governed knowledge, built lazily from the topics
// themselves (no separate index to keep in sync, no vector DB — the corpus is
// ~40 topics / a few hundred sections, where substring matching is both
// sufficient and exact).
//
// Why full-text and not title-only: the corpus is bilingual in a lopsided way.
// Titles are mostly English ("Pet Vaccination Guidelines") while the body is
// Thai — so a student searching "วัคซีน" or "พิษสุนัขบ้า" finds nothing if we
// only match titles. Searching the flattened body fixes that, and reporting
// WHICH sections matched is what makes the result useful rather than a bare hit.
//
// This is also the retrieval primitive the AI layer will use: it returns
// stable sectionIds, never prose.
// ============================================================

import { listTopics, loadTopic } from './index.js';

/** Recursively flatten a note body (string | bullets | sub | table | callout)
 *  into plain searchable text. */
function flattenBody(body, out = []) {
  for (const item of body || []) {
    if (typeof item === 'string') { out.push(item); continue; }
    if (!item || typeof item !== 'object') continue;
    if (item.bullets) {
      for (const b of item.bullets) out.push(typeof b === 'string' ? b : `${b.label} ${b.value}`);
    }
    if (item.sub) { out.push(item.sub); flattenBody(item.body, out); }
    if (item.callout) out.push(item.callout);
    if (item.table) {
      for (const h of item.table.headers || []) out.push(h);
      for (const row of item.table.rows || []) for (const c of row) out.push(c);
    }
  }
  return out;
}

/** Strip the light rich-text markup so "**Eimeria**" matches "eimeria". */
const strip = (s) => String(s || '').replace(/\*\*/g, '').replace(/\*/g, '');

const norm = (s) => strip(s).toLowerCase();

// Lazily built per topic id, then cached for the session.
const _cache = new Map();

/** @returns {{ topicId: string, title: string, summary: string, sections: Array<{id,heading,text}> }} */
export function indexTopic(subject, topic) {
  const id = `${subject}--${topic}`;
  if (_cache.has(id)) return _cache.get(id);
  const k = loadTopic(subject, topic);
  if (!k) return null;
  const entry = {
    topicId: id,
    title: k.title,
    summary: k.summary || '',
    sections: k.sections.map((s) => ({
      id: s.id,
      heading: s.heading,
      text: norm([s.heading, ...flattenBody(s.body), ...(s.claims || []).map((c) => c.statement)].join(' \n ')),
    })),
  };
  _cache.set(id, entry);
  return entry;
}

/**
 * Search every governed topic.
 * @param {string} query
 * @returns {Array<{ topic: object, matchedSections: Array<{id, heading}>, inTitle: boolean }>}
 */
export function searchTopics(query) {
  const q = norm(query).trim();
  if (!q) return listTopics().map((topic) => ({ topic, matchedSections: [], inTitle: false }));

  const results = [];
  for (const topic of listTopics()) {
    const idx = indexTopic(topic.subject, topic.topic);
    if (!idx) continue;
    const inTitle = norm(topic.title).includes(q) || norm(topic.summary).includes(q);
    const matchedSections = idx.sections
      .filter((s) => s.text.includes(q))
      .map((s) => ({ id: s.id, heading: s.heading }));
    if (inTitle || matchedSections.length > 0) {
      results.push({ topic, matchedSections, inTitle });
    }
  }
  // Title/summary hits first, then by how much of the topic matched.
  results.sort((a, b) => (Number(b.inTitle) - Number(a.inTitle)) || (b.matchedSections.length - a.matchedSections.length));
  return results;
}
