// Browser runtime for VetWiki. Discovery stays metadata-only; note bodies and
// the correction/verification adapter load only after an article is opened.
import { listTopics } from './registry.js';
import { EVIDENCE_LABEL, REVIEW_LABEL, summarizeProvenance } from './schema.js';
import { loadRuntimeData } from './runtime-data.generated.js';
import { loadNotesSubject } from '../../data/note-corpus.js';

// Grow this cache as subjects are opened. It avoids a global source corpus
// while remaining safe when several subject chunks load concurrently. (The
// Wiki search no longer comes through here; it reads its own prebuilt index.)
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

export function provenanceSummary(knowledgeTopic) {
  return summarizeProvenance(knowledgeTopic, resolveSource);
}

export { listTopics, EVIDENCE_LABEL, REVIEW_LABEL };
