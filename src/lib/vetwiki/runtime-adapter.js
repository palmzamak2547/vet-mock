// Browser adapter for one already-loaded VetWiki subject. Heavy evidence data
// is injected from a generated per-subject chunk rather than imported here.
import { topicId, sectionId, wikiTitle, wikiSummary } from './schema.js';

export function noteToKnowledge(subject, topic, noteTopic, overlay = {}, corrections = {}) {
  if (!noteTopic || !Array.isArray(noteTopic.sections)) {
    throw new Error(`noteToKnowledge: bad note topic ${subject}/${topic}`);
  }
  const id = topicId(subject, topic);
  const pageSourceRefs = [];
  const seenLocators = new Set();
  const sections = noteTopic.sections.map((section) => {
    const idForSection = sectionId(subject, topic, section.heading);
    const noteRef = section.source
      ? { sourceId: `lecture:${subject}`, locator: String(section.source), kind: 'lecture-note' }
      : null;
    if (noteRef && !seenLocators.has(noteRef.locator)) {
      seenLocators.add(noteRef.locator);
      pageSourceRefs.push(noteRef);
    }
    const verification = overlay[idForSection] || {};
    return {
      id: idForSection,
      heading: section.heading,
      body: section.body,
      evidenceStatus: verification.evidenceStatus || 'derived-note',
      reviewStatus: verification.reviewStatus || 'draft',
      useScopes: verification.useScopes || ['learning'],
      sourceRefs: noteRef ? [noteRef] : [],
      review: verification.review || null,
      claims: Array.isArray(verification.claims) ? verification.claims : [],
      corrections: corrections[idForSection] || [],
    };
  });
  return {
    id,
    subject,
    topic,
    title: wikiTitle(noteTopic.title || topic),
    summary: wikiSummary(noteTopic.summary || ''),
    lecturer: noteTopic.lecturer || '',
    icon: noteTopic.icon || '',
    version: 1,
    sourceRefs: pageSourceRefs,
    sections,
  };
}
