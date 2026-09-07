import { questionRevision } from './study-events.js';
export async function resolveRaceQuestions(snapshot, bank, loadYear) {
  if (!snapshot.started_at) return [];
  const qIds = snapshot.question_ids;
  if (!Array.isArray(qIds) || qIds.length < 5 || qIds.length > 50 || new Set(qIds).size !== qIds.length) throw new Error('ชุดแข่งไม่ถูกต้อง');
  await loadYear(snapshot.year);
  const qs = qIds.map(id => bank.find(q => q.id === id && q.subject === snapshot.subject && q.type === 'mcq'));
  if (qs.filter(Boolean).length !== qIds.length) throw new Error('โหลดข้อสอบไม่ครบ กรุณาลองเชื่อมต่อใหม่');
  if (qs.some(q => snapshot.question_versions?.[q.id] !== questionRevision(q))) throw new Error('ข้อสอบในเครื่องเป็นคนละรุ่นกับห้องนี้ กรุณารีเฟรชก่อนเข้าห้อง');
  return qs;
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
