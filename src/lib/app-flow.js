// ============================================================
// app-flow.js — small decisions App.jsx makes about a student's set
// ============================================================
// Pure, so each can be tested by calling it. App.jsx wires them to React
// state; the rules themselves live here, one place each.
// ============================================================
import { isAnswered } from '../hooks/utils.js';

/**
 * Whether a keyboard answer must be refused because this question's answer is
 * already revealed and locked. The click path refuses it (Question.jsx: an
 * MCQ with a numeric answer, or a true/false with a boolean one, under
 * practice with instant feedback). The digit and T/F keys have to refuse it
 * too, or pressing the right row after seeing the key flips a wrong answer to
 * a correct one and the set records it that way.
 */
export function keyAnswerLocked(q, answer, { mode, instantFeedback } = {}) {
  if (!q || mode === 'exam' || !instantFeedback) return false;
  if (q.type === 'mcq') return typeof answer === 'number';
  if (q.type === 'tf') return answer === true || answer === false;
  return false;
}

/** How many answers in a set actually say something. A cleared blank is not one. */
export function answeredCount(answers) {
  return Object.values(answers || {}).filter(isAnswered).length;
}

/**
 * The deadline a parked set resumes with. The clock stops while the set is
 * parked: the exit dialog promises the student comes back to the same
 * question, and a wall-clock deadline ended an exam paper the moment it was
 * reopened. What was left when the record was last written is what they get
 * back. A record without `savedAt` predates this and keeps its old deadline.
 */
export function resumedDeadline(saved, now = Date.now()) {
  const deadline = saved?.questionDeadline;
  if (!Number.isFinite(deadline) || deadline <= 0) return null;
  const savedAt = saved?.savedAt;
  if (!Number.isFinite(savedAt) || savedAt <= 0) return deadline;
  const remaining = deadline - savedAt;
  // Time had already run out before the set was parked: it stays out.
  if (remaining <= 0) return deadline;
  return now + remaining;
}

/**
 * The state a cross-subject practice preset (the Home feature menu and the
 * command palette) sets before the config screen. Topic is cleared: a topic
 * left over from browsing one subject kept filtering the 'all subjects' pool
 * down to that one topic while the config screen said รวมทุกวิชา.
 */
export function practicePreset(inv = {}) {
  const preset = {
    mode: inv.mode || 'quick',
    subject: inv.subject || 'all',
    topic: null,
    practiceMode: inv.practiceMode || 'all',
  };
  if (inv.numQuestions != null) preset.numQuestions = inv.numQuestions;
  if (inv.useTimer != null) preset.useTimer = inv.useTimer;
  if (inv.timePerQ != null) preset.timePerQ = inv.timePerQ;
  return preset;
}

/** True when the view is leaving the PDF reader, by whatever route. */
export function leavesReader(prevView, nextView) {
  return prevView === 'pdf-annotate' && nextView !== 'pdf-annotate';
}

/**
 * The pool the spaced-repetition session serves: the bank, the student's own
 * questions, and their own flashcard, cloze and image-occlusion cards. Home's
 * due badge counts this same pool, or it says nothing is due while the session
 * has cards waiting.
 */
export function srPoolQuestions(bank = [], custom = [], userCards = [], isCompatible = () => true) {
  return [...bank, ...custom, ...userCards].filter((q) => q && isCompatible(q));
}

/** The pinboard payload for a question, the same shape Question.jsx's pin writes. */
export function questionPinPayload(q) {
  return {
    type: 'question',
    payload: { subject: q?.subject, id: q?.id, stem: (q?.q || '').slice(0, 80) },
    label: (q?.q || '').slice(0, 60),
  };
}

/** How long a parked set stays resumable: the exit dialog promises six hours. */
export const PARKED_MAX_AGE_MS = 6 * 60 * 60 * 1000;

/**
 * Whether a stored set has work that starting another set would throw away.
 * A parked record older than the resume window is not offered back by the
 * Home card, so it is nothing to ask about either. The live set carries no
 * savedAt and is always current.
 */
export function unfinishedWork(record, now = Date.now()) {
  if (!record || record.submitted || !Array.isArray(record.questions) || !record.questions.length) return null;
  if (Number.isFinite(record.savedAt) && now - record.savedAt > PARKED_MAX_AGE_MS) return null;
  const answered = answeredCount(record.answers);
  return answered > 0 ? { answered, total: record.questions.length } : null;
}

