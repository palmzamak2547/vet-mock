// ============================================================
// ai/corpus.js — every piece of VetMock content the chat may cite
// ============================================================
// Built once per server instance, on the first chat request, from the same
// modules the app renders (no copy, no export step, nothing to drift):
//
//   wiki      governed VetWiki sections (vetwiki/index.js loadTopic), each
//             linkable to its exact section
//   note      lecture notes of subjects VetWiki does not carry yet (the
//             year-2 notes in note-corpus.js); VetWiki already derives every
//             other notes file, so indexing those too would cite one passage
//             twice under two names
//   video     lecture-clip summaries, one document per "## " section, so a
//             citation points at the part of the lecture that says it
//   question  deliverable bank questions (question-catalog.js already drops
//             the blocked ones), whose explanations are evidence too
//
// Cold start measured on the real data: ~1.2 s to load, plus normalizing into
// the TextIndex. A failed load is not cached, so the next request retries.
// ============================================================

import { listTopics, loadTopic } from '../../../src/lib/vetwiki/index.js';
import { NOTE_SOURCES, loadNotesSubject } from '../../../src/data/note-corpus.js';
import { loadAllVideoSummaries } from '../../../src/data/video-summaries.js';
import { SUBJECTS } from '../../../src/data/curriculum.js';
import { questionCatalog } from '../question-catalog.js';
import { TextIndex } from './textindex.js';
import { flattenBody, clip } from './text.js';

const SUBJECT_BY_ID = new Map(SUBJECTS.filter((s) => s.id !== 'all').map((s) => [s.id, s]));
const TOPIC_LABEL = new Map();
for (const s of SUBJECT_BY_ID.values()) {
  for (const t of s.topics || []) TOPIC_LABEL.set(`${s.id}:${t.id}`, t.label);
}

export const subjectName = (id) => SUBJECT_BY_ID.get(id)?.name || id || '';
export const topicLabel = (subject, topic) => TOPIC_LABEL.get(`${subject}:${topic}`) || '';
export const subjectById = (id) => SUBJECT_BY_ID.get(id) || null;

const LETTERS = 'ABCDEFGH';

/** A bank question the way a student reads it, answer included. */
export function questionText(q) {
  const lines = [String(q.q || '').trim()];
  if (q.type === 'mcq' && Array.isArray(q.options)) {
    q.options.forEach((o, i) => lines.push(`${LETTERS[i] || i + 1}. ${o}`));
    if (Number.isInteger(q.answer) && q.options[q.answer] !== undefined) {
      lines.push(`เฉลย: ${LETTERS[q.answer] || q.answer + 1}. ${q.options[q.answer]}`);
    }
  } else if (q.type === 'tf') {
    lines.push(`เฉลย: ${q.answer === true ? 'ถูก (True)' : q.answer === false ? 'ผิด (False)' : '-'}`);
  }
  if (q.explain) lines.push(`คำอธิบาย: ${String(q.explain).trim()}`);
  return lines.join('\n');
}

/** A clip summary cut at its "## " headings. The text before the first one
 *  (title line, intro) is a section of its own. */
export function videoSections(summary) {
  const md = String(summary || '');
  const parts = md.split(/\n(?=## )/);
  return parts.map((part, i) => {
    const m = part.match(/^## +(.+)$/m);
    const heading = i === 0 && !part.startsWith('## ') ? '' : (m ? m[1] : '');
    return {
      heading: heading.replace(/[#*⭐★]+/g, '').trim(),
      text: part.replace(/^# .*$/m, '').trim(),
    };
  }).filter((s) => s.text.length >= 40);
}

function wikiDocs() {
  const docs = [];
  for (const t of listTopics()) {
    const k = loadTopic(t.subject, t.topic);
    if (!k) continue;
    for (const s of k.sections) {
      const verifiedClaims = (s.claims || []).filter((c) => c.reviewStatus === 'verified').map((c) => c.statement);
      docs.push({
        kind: 'wiki',
        group: `w:${t.subject}--${t.topic}`,
        subject: t.subject,
        topic: t.topic,
        sectionId: s.id,
        title: k.title,
        heading: s.heading,
        verified: s.reviewStatus === 'verified',
        text: [...flattenBody(s.body), ...verifiedClaims.map((c) => `- ${c}`)].join('\n'),
      });
    }
  }
  return docs;
}

async function noteDocs(skipSubjects) {
  const subjects = Object.keys(NOTE_SOURCES).filter((s) => !skipSubjects.has(s));
  const loaded = await Promise.all(subjects.map((s) => loadNotesSubject(s).then((notes) => [s, notes])));
  const docs = [];
  for (const [subject, notes] of loaded) {
    for (const [topic, note] of Object.entries(notes || {})) {
      for (const s of note?.sections || []) {
        const text = flattenBody(s.body).join('\n');
        if (text.length < 40) continue;
        docs.push({
          kind: 'note', subject, topic, group: `n:${subject}--${topic}`,
          title: note.title || topicLabel(subject, topic) || topic,
          heading: s.heading || '',
          text,
        });
      }
    }
  }
  return docs;
}

async function videoDocs() {
  const all = await loadAllVideoSummaries();
  const docs = [];
  for (const [videoId, e] of Object.entries(all)) {
    if (!e?.summary) continue;
    for (const s of videoSections(e.summary)) {
      docs.push({
        kind: 'video', videoId, group: `v:${videoId}`, subject: e.subject || '',
        title: e.title || videoId,
        heading: s.heading,
        instructor: e.instructor || '',
        text: s.text,
      });
    }
  }
  return docs;
}

// Only what a card or a citation can show faithfully: a figure, a reading
// passage or a matching grid would arrive without the half that makes sense
// of it.
export function isQuizzable(q) {
  if (q.image || q.imagePath || q.passage || q.explainImage) return false;
  if (q.type === 'mcq') {
    return Array.isArray(q.options) && q.options.length >= 2 && q.options.length <= 8
      && Number.isInteger(q.answer) && q.answer >= 0 && q.answer < q.options.length
      && q.options.every((o) => typeof o === 'string' && o.trim());
  }
  return q.type === 'tf' && typeof q.answer === 'boolean';
}

async function questionDocs() {
  const catalog = await questionCatalog();
  const docs = [];
  for (const q of catalog.values()) {
    if (!isQuizzable(q)) continue;
    docs.push({
      kind: 'question', q, subject: q.subject, topic: q.topic || '',
      title: topicLabel(q.subject, q.topic) || subjectName(q.subject),
      heading: clip(q.q, 90),
      text: questionText(q),
    });
  }
  return docs;
}

let pending = null;

/** The corpus and its index, built once. */
export function loadCorpus() {
  if (!pending) {
    pending = (async () => {
      const t0 = Date.now();
      const wiki = wikiDocs();
      const wikiSubjects = new Set(wiki.map((d) => d.subject));
      const [notes, videos, questions] = await Promise.all([noteDocs(wikiSubjects), videoDocs(), questionDocs()]);
      const docs = [...wiki, ...notes, ...videos, ...questions];
      const index = new TextIndex(docs);
      const counts = { wiki: wiki.length, note: notes.length, video: videos.length, question: questions.length };
      return { docs, index, counts, ms: Date.now() - t0 };
    })().catch((err) => {
      pending = null;
      throw err;
    });
  }
  return pending;
}

/** Start building in the background; errors surface on the next loadCorpus(). */
export function warmCorpus() {
  loadCorpus().catch(() => {});
}
