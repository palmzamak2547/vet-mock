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
