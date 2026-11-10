// home.mode — the practice mode Home shows first (src/lib/decide.js)
// Principle: fewer choices + timely; one mode first, the nearer the paper the
// more exam-like. Near a paper the exam-prep card; else wrong answers to redo
// where a screen offers that card; else the weakest topic; else this term's
// checked slides; else free practice. The rest stay one tap away.
// Time is said as Home's clock says it (NextActionCard): วันนี้, พรุ่งนี้ or
// ใกล้สอบ, never a count of calendar days the hero's hours could contradict.
// A reason that only restates its card is left out (why '').
import { defineDecision } from '../decide.js';

export const HOME_MODE = defineDecision({
  id: 'home.mode',
  valid: (v) => typeof v === 'string' && v.length > 0,
  auto(s = {}) {
    const has = (id) => Array.isArray(s.cards) && s.cards.includes(id);
    if (has('near-exam') && Number.isInteger(s.daysToPaper) && s.daysToPaper >= 0 && s.daysToPaper <= 14) {
      const name = s.paperSubject || 'วิชาถัดไป';
      const when = s.daysToPaper === 0 ? 'วันนี้สอบ' : s.daysToPaper === 1 ? 'พรุ่งนี้สอบ' : 'ใกล้สอบ';
      return { value: 'near-exam', why: `${when} ${name}` };
    }
    if (has('wrong') && s.wrongCount > 0) return { value: 'wrong', why: `มีข้อที่ยังตอบผิด ${s.wrongCount} ข้อ` };
    // HomeView finds the weak topic over the last 90 days of answers.
    if (has('weak')) return { value: 'weak', why: Number.isFinite(s.weakPct) ? `หัวข้อที่คุณตอบถูก ${s.weakPct}% ใน 90 วันล่าสุด` : '' };
    if (has('current-scope')) return { value: 'current-scope', why: '' };
    const first = has('pick-count') ? 'pick-count' : (s.cards || [])[0] || 'pick-count';
    return { value: first, why: '' };
  },
});
