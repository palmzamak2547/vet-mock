// Inputs of the topic-level backtest that need the bank or the curriculum,
// kept apart from topic-backtest.mjs so its scorers stay pure and testable.

import { sittingOf } from '../regen-exam-recurrence.mjs';
import { panicRank, questionTopicId } from '../../src/lib/question-metadata.js';
import { questionDeliveryKey } from '../../src/data/question-delivery.generated.js';

/** (subject) => the subject's visible topic ids. */
export function universeFrom(subjects) {
  const map = new Map(subjects.map((s) => [s.id, (s.topics || []).filter((t) => !t.hidden).map((t) => t.id)]));
  return (subject) => map.get(subject) || [];
}

/** (subject) => topic ids named by a session of the given term's syllabus, or null without data. */
export function taughtFrom(syllabi, term = '2569-1', year = 5) {
  const courses = syllabi?.[term]?.[year] || {};
  return (subject) => {
    const c = courses[subject];
    if (!c?.sessions?.length) return null;
    const named = new Set(c.sessions.flatMap((s) => s.topics || []));
    return named.size ? named : null;
  };
}

/**
 * B1, the current order at topic level. Panic Mode serves band 0 shuffled,
 * then band 1, so a topic's share of the first N is its band-0 count; band 1
 * breaks ties. Counted as a student of the hidden cohort could have had it:
 * not the hidden paper's items, not an item only later cohorts sat (an item
 * with no cohort stays: it cannot be dated).
 */
export function currentOrderFrom(questions, recurrence, { keepUndated = true } = {}) {
  const byTopic = new Map();
  for (const q of questions) {
    const band = panicRank(q);
    if (band > 1) continue;
    const t = `${q.subject}|${questionTopicId(q)}`;
    if (!byTopic.has(t)) byTopic.set(t, []);
    byTopic.get(t).push({ key: questionDeliveryKey(q), band, cohorts: band === 0 ? sittingOf(q).cohorts : [] });
  }
  const hiddenKeys = new Map();
  const keysOf = (paperId) => {
    if (hiddenKeys.has(paperId)) return hiddenKeys.get(paperId);
    const [subject, cohort, paper] = paperId.split('|');
    const keys = new Set();
    for (const t of Object.values(recurrence[subject]?.topics || {})) for (const k of t.sat?.[cohort]?.[paper] || []) keys.add(k);
    hiddenKeys.set(paperId, keys);
    return keys;
  };
  return (subject, cohort, paperId, universe) => {
    const hidden = keysOf(paperId);
    const score = new Map();
    for (const topic of universe) {
      let b0 = 0; let b1 = 0;
      for (const q of byTopic.get(`${subject}|${topic}`) || []) {
        if (hidden.has(q.key)) continue;
        if (q.band === 1) { b1++; continue; }
        if (q.cohorts.length && q.cohorts.every((c) => c >= cohort)) continue;
        if (!keepUndated && !q.cohorts.length) continue;
        b0++;
      }
      score.set(topic, b0 * 1e6 + b1);
    }
    return score;
  };
}
