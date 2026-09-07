import { createHash } from 'node:crypto';
import { isCorrect } from '../../src/hooks/utils.js';
import { questionRevision, validSessionId } from '../../src/lib/study-events.js';

export function scoreSubmission(body, catalog) {
  if (!validSessionId(body?.id) || !Array.isArray(body.question_ids) || !body.question_ids.length
    || body.question_ids.length > 5000 || !body.answers || typeof body.answers !== 'object' || Array.isArray(body.answers)) {
    throw new Error('invalid-submission');
  }
  const ids = body.question_ids.map(String);
  if (new Set(ids).size !== ids.length) throw new Error('duplicate-questions');
  const questions = ids.map(id => catalog.get(id));
  const verified = questions.every((q, index) => q && body.question_versions?.[ids[index]] === questionRevision(q));
  const total = ids.length;
  const claimedCorrect = Number(body.correct);
  if (!verified && (!Number.isInteger(claimedCorrect) || claimedCorrect < 0 || claimedCorrect > total)) throw new Error('invalid-score');
  const correct = verified ? questions.filter(q => isCorrect(q, body.answers[q.id])).length : claimedCorrect;
  const years = new Set(questions.filter(Boolean).map(q => q.year).filter(Number.isFinite));
  const subjects = new Set(questions.filter(Boolean).map(q => q.subject));
  const year = verified ? (years.size === 1 ? [...years][0] : null)
    : Number.isInteger(body.year) && body.year >= 1 && body.year <= 6 ? body.year : null;
  return {
    id: body.id, submission_fingerprint: createHash('sha256').update(JSON.stringify(ids.map(id => [id, body.question_versions?.[id] ?? null, body.answers[id] ?? null]))).digest('hex'), mode: body.mode === 'exam' ? 'exam' : 'quick',
    subject: verified ? (subjects.size === 1 ? [...subjects][0] : 'all') : String(body.subject || 'all').slice(0, 100),
    total, correct, pct: Math.round(correct / total * 100), year,
    phase: ['1-mid', '1-final', '2-mid', '2-final'].includes(body.phase) ? body.phase : null,
    duration_sec: Math.max(0, Math.min(31536000, Math.round(Number(body.duration_sec) || 0))),
    score_source: verified ? 'server' : 'client',
  };
}
