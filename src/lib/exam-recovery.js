import { newStudySessionId, validSessionId } from './study-events.js';
const LEGACY = 'vmx-inflight-exam';
export const inflightExamKey = owner => owner ? `vmx-inflight-exam:user:${owner}` : 'vmx-inflight-exam:guest';
export function isOwnedExam(saved, owner) {
  return !!saved && Object.prototype.hasOwnProperty.call(saved, 'ownerId') && saved.ownerId === (owner ?? null);
}
export function readOwnedExam(storage, owner) {
  try {
    for (const key of [inflightExamKey(owner), LEGACY]) {
      const saved = JSON.parse(storage.getItem(key) || 'null');
      if (isOwnedExam(saved, owner) && saved?.questions?.length) return saved;
    }
    return null;
  } catch { return null; }
}
export function readUnclaimedExam(storage) {
  try {
    const saved = JSON.parse(storage.getItem(LEGACY));
    return saved?.questions?.length && !Object.prototype.hasOwnProperty.call(saved, 'ownerId') ? saved : null;
  } catch { return null; }
}
export function claimLegacyExam(storage, owner) {
  const saved = readUnclaimedExam(storage);
  if (!saved) return null;
  const claimed = { ...saved, ownerId: owner ?? null, sessionId: validSessionId(saved.sessionId) ? saved.sessionId : newStudySessionId() };
  // One atomic write claims the original. Recovery can read it here until
  // the next autosave writes the owner's new key; another owner cannot claim.
  storage.setItem(LEGACY, JSON.stringify(claimed));
  return claimed;
}
// A parked set keeps the question objects it began with, so a set resumed after a release used to
// finish on the old passage, explanation and figure path (a renamed figure showed as missing). On
// resume each question is taken from the current bank by id, and the student's answers, order and
// time, which live beside the questions in the parked record, are left as they are.
//
// What a student's answer means depends on these fields: an MCQ answer is an index into `options`, a
// match answer a right side per pair, a fill answer a string per blank. When any of them differs
// between the parked copy and the bank's, that question stays exactly as it was parked, so an index
// can never point at another option than the one picked. A question the bank no longer has (or one
// whose id now names a question of another subject: a student's own question) also stays as parked.
export const PARKED_ANSWER_SPACE = Object.freeze(['type', 'options', 'pairs', 'distractors', 'blanks']);
// Kept from the parked copy even when the rest is refreshed: the order the options were shown in.
export const PARKED_KEPT = Object.freeze(['noShuffle']);

const sameValue = (a, b) => JSON.stringify(a) === JSON.stringify(b);

/**
 * @param {Array<object>} parked  the parked record's questions
 * @param {Iterable<object>} bank the questions loaded now (QB)
 * @returns {{ questions: Array<object>, refreshed: Array, kept: Array, missing: Array }}
 */
export function refreshParkedQuestions(parked, bank) {
  const byId = new Map();
  // Keyed by subject and id: two subjects may use one id, and the one loaded last must not hide the other.
  for (const q of bank || []) if (q && q.id != null) byId.set(`${q.subject}:${q.id}`, q);
  const refreshed = [], kept = [], missing = [];
  const questions = (parked || []).map((old) => {
    const now = old && old.id != null ? byId.get(`${old.subject}:${old.id}`) : null;
    if (!now) { missing.push(old?.id ?? null); return old; }
    if (PARKED_ANSWER_SPACE.some((k) => !sameValue(old[k], now[k]))) { kept.push(old.id); return old; }
    refreshed.push(old.id);
    if (PARKED_KEPT.every((k) => sameValue(old[k], now[k]))) return now;
    const next = { ...now };
    for (const k of PARKED_KEPT) { if (old[k] === undefined) delete next[k]; else next[k] = old[k]; }
    return next;
  });
  return { questions, refreshed, kept, missing };
}

export function markExamDetailsSaved(storage, owner, sessionId) {
  try {
    const saved = readOwnedExam(storage, owner);
    if (!saved || saved.sessionId !== sessionId) return false;
    storage.setItem(inflightExamKey(owner), JSON.stringify({ ...saved, detailsSaved: true }));
    return true;
  } catch { return false; }
}
export function clearCompletedExam(storage, owner, sessionId) {
  const saved = readOwnedExam(storage, owner);
  if (!saved || saved.sessionId !== sessionId || !saved.submitted || !saved.localSaved || !saved.detailsSaved) return false;
  for (const key of [inflightExamKey(owner), LEGACY]) {
    const row = JSON.parse(storage.getItem(key) || 'null');
    if (isOwnedExam(row, owner) && row.sessionId === sessionId) storage.removeItem(key);
  }
  return true;
}
