import { questionRevision } from './study-events.js';
import { getShuffledOptions } from './option-shuffle.js';
// The room's questions are not the ones this copy of the app holds: a release
// landed after the page was loaded, so the bank here is older (or newer) than
// the host's. Only a fresh page can fix it, so it is never a connection problem.
export class RaceBuildMismatch extends Error {
  constructor(message) { super(message); this.name = 'RaceBuildMismatch'; this.stale = true; }
}

export async function resolveRaceQuestions(snapshot, bank, loadYear) {
  if (!snapshot.started_at) return [];
  const qIds = snapshot.question_ids;
  if (!Array.isArray(qIds) || qIds.length < 5 || qIds.length > 50 || new Set(qIds).size !== qIds.length) throw new Error('ชุดแข่งไม่ถูกต้อง');
  await loadYear(snapshot.year);
  const qs = qIds.map(id => bank.find(q => q.id === id && q.subject === snapshot.subject && q.type === 'mcq'));
  // The year's bank is whole by now (loadYear resolves after every chunk of
  // the year is merged, and a chunk that fails rejects above), so a question
  // that is still missing is one this copy of the app does not hold: another
  // build, like a revision that differs. The view asks for a fresh page.
  if (qs.filter(Boolean).length !== qIds.length) throw Object.assign(new Error('โหลดข้อสอบไม่ครบ กรุณาลองเชื่อมต่อใหม่'), { missing: true });
  if (qs.some(q => snapshot.question_versions?.[q.id] !== questionRevision(q))) throw new RaceBuildMismatch('ข้อสอบในเครื่องนี้เป็นคนละรุ่นกับห้องนี้');
  return qs;
}

// The room's questions only change with the room, its start, the set or the
// revisions, so the 2 s poll reuses the resolved list (the same array, so the
// questions state is left unchanged) instead of scanning the bank for every
// question again.
// A failed resolve is dropped, so the next poll retries it.
export function createRaceQuestionCache() {
  let key = null, bankRef = null, pending = null;
  return (snapshot, bank, loadYear) => {
    const next = JSON.stringify([snapshot.code, snapshot.started_at, snapshot.subject, snapshot.year,
      snapshot.question_ids, snapshot.question_versions ?? null]);
    if (!pending || next !== key || bank !== bankRef) {
      const attempt = resolveRaceQuestions(snapshot, bank, loadYear);
      key = next; bankRef = bank; pending = attempt;
      attempt.catch(() => { if (pending === attempt) pending = null; });
    }
    return pending;
  };
}

// Options in the same per-session shuffled order as the exam screen. Each
// row keeps its SOURCE index: the room's key is stored by source index, so
// that is what answer_race must receive, never the row position.
export function raceOptionRows(q) {
  const { displayOptions, displayToOriginal } = getShuffledOptions(q);
  return displayOptions.map((text, row) => ({ text, original: displayToOriginal[row] }));
}

export function mergeRaceProgress(previous, incoming) {
  return Object.fromEntries(Object.entries(incoming || {}).map(([id, value]) => [
    id, (previous[id]?.idx || 0) > value.idx ? previous[id] : value,
  ]));
}
export function rankRacePlayers(participants) {
  return Object.entries(participants).map(([user_id, value]) => ({ ...value, user_id }))
    .sort((a, b) => Number(b.finished) - Number(a.finished) || b.correct - a.correct
      || (a.duration_ms ?? Infinity) - (b.duration_ms ?? Infinity) || b.idx - a.idx || a.user_id.localeCompare(b.user_id));
}
