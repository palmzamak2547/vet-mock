// Browser-light VetWiki discovery seam.
//
// Keep this module metadata-only. Views that merely list Wiki topics or check
// whether an article exists must not import ./index.js: that full module also
// owns note bodies, verification overlays, the source registry and validation.

import { QUESTION_LINKS } from './question-links.generated.js';
import { VETWIKI_TOPICS } from './topic-registry.generated.js';

const TOPIC_KEYS = new Set(VETWIKI_TOPICS.map((topic) => topic.id));

export function listTopics() {
  // Match index.js's existing caller contract: callers receive fresh records
  // and cannot mutate the generated registry shared by the rest of the app.
  return VETWIKI_TOPICS.map((topic) => ({ ...topic }));
}

export function hasTopic(subject, topic) {
  return TOPIC_KEYS.has(`${subject}--${topic}`);
}

/** Which governed article a question should open, or null.
 * Own-topic matches remain authoritative; judged links are fallback-only. */
export function articleForQuestion(q) {
  if (!q) return null;
  if (hasTopic(q.subject, q.topic)) {
    return { subject: q.subject, topic: q.topic, derived: false };
  }
  const link = QUESTION_LINKS[String(q.id)];
  if (!link || !hasTopic(link.subject, link.topic)) return null;
  return { ...link, derived: true };
}
