// ============================================================
// VetWiki registry, lite — "does an article exist for this question?"
// ============================================================
// The results, review and spaced-repetition views link a question to its
// article; they never list topics or render titles. The full registry
// carries the whole topic catalog (titles, section lists — ~125 KB of
// source), and Home prefetches those views at idle, so every boot used to
// download the catalog for a yes/no answer. This module answers it from
// the generated id list and the question→topic links alone. registry.js
// re-exports these so existing callers keep one import path.

import { QUESTION_LINKS } from './question-links.generated.js';
import { VETWIKI_TOPIC_KEYS } from './topic-keys.generated.js';

const TOPIC_KEYS = new Set(VETWIKI_TOPIC_KEYS);

export function hasTopic(subject, topic) {
  return TOPIC_KEYS.has(`${subject}--${topic}`);
}

export function articleForQuestion(q) {
  if (!q) return null;
  if (hasTopic(q.subject, q.topic)) {
    return { subject: q.subject, topic: q.topic, derived: false };
  }
  const link = QUESTION_LINKS[String(q.id)];
  if (!link || !hasTopic(link.subject, link.topic)) return null;
  return { ...link, derived: true };
}
