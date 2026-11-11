// The one dialog for leaving a set. The X button and the browser's Back do
// the same thing (the set is parked and waits on Home), and they asked it in
// two ways: the X offered เก็บไว้แล้วออก / ทำต่อ with the six-hour note, Back
// offered ออกจากชุด / ยกเลิก without it. Both read their words here.
import { isAnswered } from '../hooks/utils.js';

export function exitSetDialog({ questions = [], answers = {}, timed = false } = {}) {
  const total = Array.isArray(questions) ? questions.length : 0;
  const answered = Array.isArray(questions) ? questions.filter((q) => isAnswered(answers?.[q?.id])).length : 0;
  return {
    title: 'ออกจากชุดนี้?',
    body: `ความคืบหน้า${answered > 0 ? ` ${answered} จาก ${total} ข้อ` : ''} จะถูกเก็บไว้ที่หน้าแรก กดทำต่อเพื่อกลับมาข้อเดิมได้ภายใน 6 ชั่วโมง${timed ? ' เวลาที่เหลือจะหยุดนับจนกว่าจะกลับมาทำต่อ' : ''}`,
    confirmLabel: 'เก็บไว้แล้วออก',
    cancelLabel: 'ทำต่อ',
  };
}
