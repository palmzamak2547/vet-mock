import { validSessionId } from './study-events.js';

export function parseStudyEventArchive(value) {
  if (value?.format !== 'vetmock-study-events-v1' || !Array.isArray(value.events) || value.events.length > 100_000) {
    return { success: false, reason: 'รูปแบบประวัติรายละเอียดไม่ถูกต้อง' };
  }
  const seen = new Set();
  for (const event of value.events) {
    if (!event || typeof event.id !== 'string' || event.id.length > 200 || seen.has(event.id)
      || !validSessionId(event.sessionId) || !['attempt', 'review'].includes(event.kind)
      || !Number.isFinite(event.date) || event.date < 0
      || !['string', 'number'].includes(typeof event.questionId)
      || typeof event.questionVersion !== 'string'
      || (event.elapsedMs != null && (!Number.isFinite(event.elapsedMs) || event.elapsedMs < 0))
      || (event.kind === 'attempt' && typeof event.correct !== 'boolean')
      || (event.kind === 'review' && (!Number.isInteger(event.quality) || event.quality < 0 || event.quality > 3))) {
      return { success: false, reason: 'มีรายการประวัติที่ข้อมูลไม่ครบหรือรหัสซ้ำ' };
    }
    seen.add(event.id);
  }
  return { success: true, events: value.events };
}

export function studyEventArchive(events) {
  return { format: 'vetmock-study-events-v1', exportedAt: new Date().toISOString(), events };
}
