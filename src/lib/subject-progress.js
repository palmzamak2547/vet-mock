// ============================================================
// subject-progress.js — "เรียนวิชานี้ไปกี่เปอร์เซ็นต์แล้ว"
// ============================================================
// Coverage, not accuracy: a question counts toward progress the moment
// the student has ANSWERED it at least once, whatever the verdict was
// (wrong answers are still learning). The denominator is the pool the
// app itself offers — deliverable questions in non-hidden topics (the
// same rules visibleQuestionCount applies) plus the student's custom
// questions for that subject — so the number on the card can never
// promise more than "เริ่มฝึก" can actually deliver.
//
// History keeps entries for questions that later got quarantined or
// retired, and those must not inflate progress: covered counts only
// ids the CURRENT pool still offers. Key format is the compound
// `subject:id` used wherever ids meet (questionDeliveryKey, App's
// qByCompound) because ids collide across subjects.
// ============================================================

import { hiddenTopicIdsFor } from '../data/curriculum.js';
import { isQuestionDeliverable } from '../data/question-delivery.generated.js';

// Subject → hidden-topic set. curriculum.js is static data, so the
// cache is safe for the page's lifetime and saves a re-filter of the
// topic array per bank question.
const hiddenCache = new Map();

function isPoolQuestion(q) {
  let hidden = hiddenCache.get(q.subject);
  if (!hidden) {
    hidden = hiddenTopicIdsFor(q.subject);
    hiddenCache.set(q.subject, hidden);
  }
  return !hidden.has(q.topic) && isQuestionDeliverable(q);
}

/** Distinct answered `subject:id` keys per subject, one pass. */
export function answeredKeysBySubject(history) {
  const bySubject = new Map();
  for (const h of history || []) {
    if (!h?.questionId || !h.subject) continue;
    if (!bySubject.has(h.subject)) bySubject.set(h.subject, new Set());
    bySubject.get(h.subject).add(`${h.subject}:${h.questionId}`);
  }
  return bySubject;
}

/**
 * Per-subject coverage: { covered, total, pct } keyed by subject id.
 *
 *   covered  distinct answered keys that the current pool offers
 *   total    the pool itself — deliverable, non-hidden-topic bank
 *            questions plus that subject's custom questions
 *   pct      Math.round(covered / total * 100), 0 when total is 0
 */
export function computeSubjectProgress({ history, allQuestions = [], customQuestions = [] }) {
  const poolKeys = new Set();
  const poolTotals = new Map();
  for (const q of allQuestions || []) {
    if (!q?.subject || !isPoolQuestion(q)) continue;
    const key = `${q.subject}:${q.id}`;
    if (poolKeys.has(key)) continue;
    poolKeys.add(key);
    poolTotals.set(q.subject, (poolTotals.get(q.subject) || 0) + 1);
  }
  for (const q of customQuestions || []) {
    if (!q?.subject) continue;
    const key = `${q.subject}:${q.id}`;
    if (poolKeys.has(key)) continue;
    poolKeys.add(key);
    poolTotals.set(q.subject, (poolTotals.get(q.subject) || 0) + 1);
  }

  const answered = answeredKeysBySubject(history);
  const out = {};
  const subjects = new Set([...poolTotals.keys(), ...answered.keys()]);
  for (const subject of subjects) {
    const answeredKeys = answered.get(subject) || new Set();
    let covered = 0;
    for (const key of answeredKeys) if (poolKeys.has(key)) covered += 1;
    const total = poolTotals.get(subject) || 0;
    out[subject] = { covered, total, pct: total > 0 ? Math.round((covered / total) * 100) : 0 };
  }
  return out;
}
