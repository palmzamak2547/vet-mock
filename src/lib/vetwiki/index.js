// ============================================================
// VetWiki — public entry (topic registry + loader + provenance)
// ============================================================
// The one import surface the app uses. First slice registers ONE topic
// (COM5 · Rabies) proven end-to-end; adding a topic later is one registry
// row, no new plumbing.
//
// Knowledge is derived live from the existing note corpus, so there is no
// second source of truth to keep in sync and no migration.
// ============================================================

import { NOTES_COM5 } from '../../data/notes-com5.js';
import { noteToKnowledge, verifiedClaimCount } from './adapter.js';
import { validateTopic } from './validate.js';
import { resolveSource } from './sources.js';
import { EVIDENCE_LABEL, REVIEW_LABEL } from './schema.js';

// ---- Topic registry ------------------------------------------------------
// Each row maps a governed VetWiki topic to its backing note source. The
// note object is passed by reference (read-only) — no copy.
const REGISTRY = [
  { subject: 'com5', topic: 'rabies', source: () => NOTES_COM5.rabies, flagship: true },
  { subject: 'com5', topic: 'vaccine', source: () => NOTES_COM5.vaccine },
  { subject: 'com5', topic: 'cve', source: () => NOTES_COM5.cve },
  { subject: 'com5', topic: 'sporo-crypto', source: () => NOTES_COM5['sporo-crypto'] },
  { subject: 'com5', topic: 'gi-protozoa', source: () => NOTES_COM5['gi-protozoa'] },
  { subject: 'com5', topic: 'feline-uri', source: () => NOTES_COM5['feline-uri'] },
];

export function listTopics() {
  return REGISTRY.map((r) => {
    const note = r.source();
    return {
      id: `${r.subject}--${r.topic}`,
      subject: r.subject,
      topic: r.topic,
      title: note?.title || r.topic,
      icon: note?.icon || '📄',
      summary: note?.summary || '',
      flagship: !!r.flagship,
    };
  });
}

export function hasTopic(subject, topic) {
  return REGISTRY.some((r) => r.subject === subject && r.topic === topic);
}

/** Load a governed KnowledgeTopic (adapter + verification overlay). Returns
 *  null for an unknown/empty topic rather than throwing (UI shows empty state). */
export function loadTopic(subject, topic) {
  const row = REGISTRY.find((r) => r.subject === subject && r.topic === topic);
  if (!row) return null;
  const note = row.source();
  if (!note) return null;
  return noteToKnowledge(subject, topic, note);
}

/** Provenance summary for the read page + "VetMock รู้เรื่องนี้ได้อย่างไร?"
 *  panel. Pure data → the view renders it with vmx-* + Thai labels. */
export function provenanceSummary(knowledgeTopic) {
  if (!knowledgeTopic) return null;
  const sections = knowledgeTopic.sections || [];
  const verified = verifiedClaimCount(knowledgeTopic);
  const draftSections = sections.filter((s) => s.reviewStatus === 'draft').length;

  // Distinct external sources actually cited by verified claims.
  const citedIds = new Set();
  for (const s of sections) {
    for (const c of s.claims || []) {
      for (const ref of c.sourceRefs || []) {
        if (resolveSource(ref)) citedIds.add(ref.sourceId);
      }
    }
  }
  const sources = [...citedIds].map((id) => resolveSource({ sourceId: id })).filter(Boolean);

  return {
    sectionCount: sections.length,
    verifiedClaimCount: verified,
    draftSectionCount: draftSections,
    sources,
    // Honest one-liner for the UI (no jargon).
    headline: verified > 0
      ? `เนื้อหาส่วนใหญ่มาจากโน้ตเลกเชอร์ · ${verified} จุดตรวจทานกับแหล่งอ้างอิงภายนอกแล้ว`
      : 'เนื้อหามาจากโน้ตเลกเชอร์ · ยังไม่ได้ตรวจทานกับแหล่งอ้างอิงภายนอก',
  };
}

export { validateTopic, resolveSource, EVIDENCE_LABEL, REVIEW_LABEL };
export { verificationFor } from './verification.js';
