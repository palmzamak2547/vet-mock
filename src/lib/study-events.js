import { isCorrect } from '../hooks/utils.js';

export const validSessionId = value => typeof value === 'string'
  && /^[0-9a-f]{8}-[0-9a-f]{4}-[1-5][0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/i.test(value);

export function newStudySessionId() {
  if (globalThis.crypto?.randomUUID) return globalThis.crypto.randomUUID();
  const bytes = new Uint8Array(16);
  if (globalThis.crypto?.getRandomValues) globalThis.crypto.getRandomValues(bytes);
  else bytes.forEach((_, i) => { bytes[i] = Math.floor(Math.random() * 256); });
  bytes[6] = (bytes[6] & 15) | 64;
  bytes[8] = (bytes[8] & 63) | 128;
  const hex = [...bytes].map(n => n.toString(16).padStart(2, '0')).join('');
  return `${hex.slice(0, 8)}-${hex.slice(8, 12)}-${hex.slice(12, 16)}-${hex.slice(16, 20)}-${hex.slice(20)}`;
}

// A content revision for one question ID, not an authentication signature.
// Display-only option shuffling does not change the canonical question object.
export function questionRevision(q) {
  const text = JSON.stringify([q.type, q.q, q.front, q.back, q.options, q.answer, q.blanks, q.pairs, q.distractors]);
  let hash = 2166136261;
  for (let i = 0; i < text.length; i++) hash = Math.imul(hash ^ text.charCodeAt(i), 16777619);
  return `q1-${(hash >>> 0).toString(16).padStart(8, '0')}`;
}

export function createAttemptEntries({ questions, answers, sessionId, questionTimes = {}, year, phase, mode, now = Date.now() }) {
  return questions.map(q => ({
    id: `attempt:${sessionId}:${q.id}`,
    schemaVersion: 2,
    kind: 'attempt',
    sessionId,
    questionVersion: questionRevision(q),
    date: now,
    questionId: q.id,
    correct: isCorrect(q, answers[q.id]),
    answer: JSON.parse(JSON.stringify(answers[q.id] ?? null)),
    elapsedMs: Math.max(0, Math.round(Number(questionTimes[q.id]) || 0)),
    timing: 'visible-time',
    confidence: null, // not collected; never infer confidence from correctness
    subject: q.subject,
    year: q.year ?? year ?? null,
    phase: phase ?? null,
    mode,
  }));
}

export function createReviewEvent({ question, quality, before, after, sessionId, elapsedMs = null, now = Date.now() }) {
  if (!Number.isInteger(quality) || quality < 0 || quality > 3) throw new Error('Invalid review rating');
  const state = card => ({
    easeFactor: card.easeFactor, interval: card.interval, repetitions: card.repetitions,
    nextReview: card.nextReview, lastReview: card.lastReview ?? null,
  });
  return {
    id: `review:${newStudySessionId()}`, schemaVersion: 1, kind: 'review', sessionId,
    questionId: question.id, questionVersion: questionRevision(question), date: now,
    quality, ratingScale: 'again-hard-good-easy-0-3', algorithm: 'vetmock-sm2-v1',
    elapsedMs, before: state(before), after: state(after),
  };
}

export function createQuestionTiming(saved = {}, now = Date.now) {
  let totals, active = null, started = null;
  const reset = (values = {}) => {
    totals = Object.fromEntries(Object.entries(values || {}).filter(([key, value]) =>
      !['__proto__', 'constructor', 'prototype'].includes(key) && Number.isFinite(value) && value >= 0));
    active = null;
    started = null;
  };
  const flush = () => {
    if (active !== null && started !== null) totals[active] = (totals[active] || 0) + Math.max(0, now() - started);
    started = null;
  };
  reset(saved);
  return {
    reset,
    enter(id, visible = true) { flush(); active = id == null ? null : String(id); started = visible && active !== null ? now() : null; },
    visibility(visible) { flush(); started = visible && active !== null ? now() : null; },
    stop() { flush(); active = null; },
    snapshot() {
      const result = { ...totals };
      if (active !== null && started !== null) result[active] = (result[active] || 0) + Math.max(0, now() - started);
      return result;
    },
  };
}
