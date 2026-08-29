// Browser runtime for VetWiki. Discovery stays metadata-only; note bodies and
// the correction/verification adapter load only after an article is opened.
import { listTopics } from './registry.js';
import { EVIDENCE_LABEL, REVIEW_LABEL } from './schema.js';
import { loadRuntimeData } from './runtime-data.generated.js';
import { loadNotesSubject } from '../../data/note-corpus.js';

// Grow this cache as subjects are opened/searched. It avoids a global source
// corpus while remaining safe when several subject chunks load concurrently.
const loadedSources = new Map();

export async function loadTopic(subject, topic) {
  const notes = await loadNotesSubject(subject);
  const note = notes[topic] || null;
  if (!note) return null;
  const [{ noteToKnowledge }, runtimeData] = await Promise.all([
    import('./runtime-adapter.js'),
    loadRuntimeData(subject),
  ]);
  for (const [id, source] of Object.entries(runtimeData.SOURCES || {})) {
    loadedSources.set(id, source);
  }
  return noteToKnowledge(
    subject,
    topic,
    note,
    runtimeData.OVERLAYS?.[`${subject}--${topic}`] || {},
    runtimeData.CORRECTIONS || {},
  );
}

export function resolveSource(ref) {
  return ref ? loadedSources.get(ref.sourceId) || null : null;
}

function verifiedClaimCount(knowledgeTopic) {
  return (knowledgeTopic?.sections || []).reduce(
    (total, section) => total + (section.claims || []).length,
    0,
  );
}

export function provenanceSummary(knowledgeTopic) {
  if (!knowledgeTopic) return null;
  const sections = knowledgeTopic.sections || [];
  const verified = verifiedClaimCount(knowledgeTopic);
  const draftSections = sections.filter((section) => section.reviewStatus === 'draft').length;
  const metadataSections = sections.filter((section) => section.reviewStatus === 'metadata').length;
  const citedIds = new Set();
  for (const section of sections) {
    for (const claim of section.claims || []) {
      for (const ref of claim.sourceRefs || []) {
        if (resolveSource(ref)) citedIds.add(ref.sourceId);
      }
    }
  }
  const sources = [...citedIds].map((id) => resolveSource({ sourceId: id })).filter(Boolean);
  return {
    sectionCount: sections.length,
    verifiedClaimCount: verified,
    draftSectionCount: draftSections,
    metadataSectionCount: metadataSections,
    sources,
    headline: verified > 0 && draftSections === 0
      ? `ทุกจุดความรู้ในหัวข้อนี้ตรวจทานกับแหล่งอ้างอิงภายนอกแล้ว (${verified} จุด)`
      : verified > 0
        ? `เนื้อหามาจากโน้ตเลกเชอร์, ${verified} จุดตรวจทานกับแหล่งอ้างอิงภายนอกแล้ว, อีก ${draftSections} หัวข้อรอตรวจ`
        : 'เนื้อหามาจากโน้ตเลกเชอร์, ยังไม่ได้ตรวจทานกับแหล่งอ้างอิงภายนอก',
  };
}

export { listTopics, EVIDENCE_LABEL, REVIEW_LABEL };
