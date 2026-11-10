// home.mode — the practice mode Home shows first (src/lib/decide.js)
// Principle: fewer choices + timely; one mode first, the nearer the paper the
// more exam-like. Near a paper the exam-prep card; else wrong answers to redo
// where a screen offers that card; else the weakest topic; else this term's
// checked slides; else free practice. The rest stay one tap away.
import { defineDecision } from '../decide.js';

export const HOME_MODE = defineDecision({
  id: 'home.mode',
  valid: (v) => typeof v === 'string' && v.length > 0,
  auto(s = {}) {
    const has = (id) => Array.isArray(s.cards) && s.cards.includes(id);
    if (has('near-exam') && Number.isInteger(s.daysToPaper) && s.daysToPaper >= 0 && s.daysToPaper <= 14) {
      const name = s.paperSubject || 'วิชาถัดไป';
      return { value: 'near-exam', why: s.daysToPaper === 0 ? `สอบ${name}วันนี้` : `อีก ${s.daysToPaper} วันสอบ${name}` };
    }
    if (has('wrong') && s.wrongCount > 0) return { value: 'wrong', why: `มีข้อที่ยังตอบผิด ${s.wrongCount} ข้อ` };
    if (has('weak')) return { value: 'weak', why: Number.isFinite(s.weakPct) ? `หัวข้อที่คุณตอบถูก ${s.weakPct}% ฝึกตรงนี้คุ้มที่สุด` : 'หัวข้อที่คุณพลาดบ่อยที่สุด' };
    if (has('current-scope')) return { value: 'current-scope', why: 'ข้อของเทอมนี้ที่ตรวจเฉลยแล้ว ตรงกับสไลด์' };
    const first = has('pick-count') ? 'pick-count' : (s.cards || [])[0] || 'pick-count';
    return { value: first, why: 'สุ่มข้อจากทุกวิชาของปีนี้' };
  },
});
