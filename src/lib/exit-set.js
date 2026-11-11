// The one dialog for leaving a set. The X button and the browser's Back do
// the same thing (the set is parked and waits on Home), and they asked it in
// two ways: the X offered เก็บไว้แล้วออก / ทำต่อ with the six-hour note, Back
// offered ออกจากชุด / ยกเลิก without it. Both read their words here.
import { isAnswered } from '../hooks/utils.js';

export function exitSetDialog({ questions = [], answers = {}, timed = false } = {}) {
  const total = Array.isArray(questions) ? questions.length : 0;
  const answered = Array.isArray(questions) ? questions.filter((q) => isAnswered(answers?.[q?.id])).length : 0;
  // "ทำต่อ" is the button that stays, so the body does not use the word for
  // coming back. The paper's clock does stop while parked: a resumed set gets
  // what it had left when it was saved (app-flow.js resumedDeadline).
  const kept = answered > 0 ? `ตอบไปแล้ว ${answered} จาก ${total} ข้อ เก็บไว้ที่หน้าแรก` : 'ชุดนี้เก็บไว้ที่หน้าแรก';
  return {
    title: 'ออกจากชุดนี้?',
    body: `${kept} 6 ชั่วโมง กลับมาทำต่อจากข้อเดิมได้${timed ? ' เวลาสอบหยุดนับระหว่างนี้' : ''}`,
    confirmLabel: 'เก็บไว้แล้วออก',
    cancelLabel: 'ทำต่อ',
    // In a timed paper staying is the safer answer, so it takes focus.
    focusCancel: Boolean(timed),
  };
}
