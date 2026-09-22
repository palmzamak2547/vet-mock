// ============================================================
// practice-target.js — what VetWiki's practice button opens
// ============================================================
// An article's topic may have no questions of its own (32 articles did,
// equine-hoof and the meat-cutting decks among them). "ฝึกจากหัวข้อนี้" there
// could only reach an empty pool, and startExam then asked in a dialog whether
// to practise the whole subject instead. The button says "ฝึกทั้งวิชา" up front
// and asks for the subject set directly.
//
// The count is the generated per-topic count of deliverable questions, which
// is the pool a topic session filters (q.topic === topic). No number is shown:
// a session serves min(pool, numQuestions), so a topic total would misstate
// the length of what opens.
// ============================================================
import { Q_COUNTS_BY_TOPIC } from '../../data/q-counts.js';

export function wikiPracticeTarget(subject, topic, counts = Q_COUNTS_BY_TOPIC) {
  const own = counts?.[subject]?.[topic] || 0;
  return own > 0
    ? { label: 'ฝึกจากหัวข้อนี้', topic }
    : { label: 'ฝึกทั้งวิชา', topic: null };
}
