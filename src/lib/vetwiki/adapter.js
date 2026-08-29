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

import { topicId, sectionId, wikiTitle, wikiSummary } from './schema.js';
import { verificationFor } from './verification.js';
import { correctionsFor } from './corrections.js';
import { NON_VERIFIABLE } from './non-verifiable.js';

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
      // Section status DERIVES from what actually happened to its content:
      // the verification arcs recorded claim-level verdicts but nothing ever
      // promoted the section, so 1,615 sections whose claims were all
      // reference-checked still introduced themselves as ฉบับร่าง. A section
      // with verified claims IS verified; a declared course-metadata section
      // is metadata; only genuinely unreviewed content is a draft.
      reviewStatus: v.reviewStatus
        || (claims.some((c) => c.reviewStatus === 'verified') ? 'verified'
          : NON_VERIFIABLE.has(sId) ? 'metadata' : 'draft'),
      useScopes: v.useScopes || ['learning'],
      sourceRefs: noteRef ? [noteRef] : [],
      review: v.review || null,
      claims,
      // Places where a resolved source disagrees with what the lecture taught.
      // Carried alongside the corrected text so a reader can see both — the
      // exam is marked by the lecturer, so the taught answer still matters.
      corrections: correctionsFor(sId),
    };
  });

  return {
    id: tId,
    subject,
    topic,
    title: wikiTitle(noteTopic.title || topic),
    summary: wikiSummary(noteTopic.summary || ''),
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
