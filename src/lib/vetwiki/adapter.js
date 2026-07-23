// ============================================================
// VetWiki — legacy adapter (notes-*.js → governed knowledge)
// ============================================================
// Turns the EXISTING structured lecture-note corpus (src/data/notes-*.js)
// into governed KnowledgeTopics WITHOUT copying or migrating the content —
// the note file stays the single source of truth; this reads it live.
//
// Why an adapter (not a rewrite): the audit found notes-*.js has 654
// source-cited sections but ZERO stable ids (keyed by array index + heading
// string). The adapter synthesises deterministic stable ids from
// (subject, topic, heading) so identity survives reordering/editing, and
// carries each section's existing `source` string as a lecture-note locator.
//
// Everything imports honestly as derived-note / draft. The ONLY promotions
// come from ./verification.js (checked against real external sources).
// ============================================================

import { topicId, sectionId } from './schema.js';
import { verificationFor } from './verification.js';

/**
 * @param {string} subject   e.g. 'com5'
 * @param {string} topic     e.g. 'rabies'
 * @param {object} noteTopic the NOTES_COM5.rabies object { topic,title,lecturer,icon,summary,sections:[{heading,source,body}] }
 * @returns {import('./schema.js').KnowledgeTopic}
 */
export function noteToKnowledge(subject, topic, noteTopic) {
  if (!noteTopic || !Array.isArray(noteTopic.sections)) {
    throw new Error(`noteToKnowledge: bad note topic ${subject}/${topic}`);
  }
  const tId = topicId(subject, topic);
  const overlay = verificationFor(tId);
  const pageSourceRefs = [];
  const seenLocators = new Set();

  const sections = noteTopic.sections.map((s) => {
    const sId = sectionId(subject, topic, s.heading);
    const noteRef = s.source
      ? { sourceId: `lecture:${subject}`, locator: String(s.source), kind: 'lecture-note' }
      : null;
    if (noteRef && !seenLocators.has(noteRef.locator)) {
      seenLocators.add(noteRef.locator);
      pageSourceRefs.push(noteRef);
    }

    const v = overlay[sId] || {};
    const claims = Array.isArray(v.claims) ? v.claims : [];

    return {
      id: sId,
      heading: s.heading,
      body: s.body, // original note body — rendered by the app's RichText
      // Honest defaults: paraphrased-from-lecture, unreviewed.
      evidenceStatus: v.evidenceStatus || 'derived-note',
      reviewStatus: v.reviewStatus || 'draft',
      useScopes: v.useScopes || ['learning'],
      sourceRefs: noteRef ? [noteRef] : [],
      review: v.review || null,
      claims,
    };
  });

  return {
    id: tId,
    subject,
    topic,
    title: noteTopic.title || topic,
    summary: noteTopic.summary || '',
    lecturer: noteTopic.lecturer || '',
    icon: noteTopic.icon || '📄',
    version: 1,
    sourceRefs: pageSourceRefs,
    sections,
  };
}

/** Count of verified claims across a topic — used by the read page to show
 *  "ตรวจทานกับแหล่งอ้างอิงแล้ว N จุด" without leaking the internal model. */
export function verifiedClaimCount(knowledgeTopic) {
  return (knowledgeTopic.sections || []).reduce(
    (n, s) => n + (s.claims || []).filter((c) => c.reviewStatus === 'verified').length,
    0,
  );
}
