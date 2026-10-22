// Release 5.160.0. Fill in what a student notices (AGENTS.md Rule 2); kinds and scopes are listed in
// src/data/changelog.js. One file per release, so releases in flight never edit the same lines.
export default {
  version: '5.160.0',
  date: '2026-10-22',
  headline: 'Mochi ขยับตามคำตอบในโหมดฝึก',
  changes: [
    { kind: 'feature', scope: 'system', title: 'Mochi ขยับตามคำตอบ', desc: 'เมื่อเปิดเฉลยทันทีในโหมดฝึก Mochi ในตราถูกหรือผิดจะขยับหนึ่งครั้งตามคำตอบที่เพิ่งตอบ ตอบถูกติดกันมากขึ้นท่าก็ยิ่งดีใจขึ้น ถ้าตั้งค่าลดการเคลื่อนไหวไว้ จะเป็นภาพนิ่งเหมือนเดิม' },
    { kind: 'feature', scope: 'system', title: 'นับข้อที่ถูกติดกัน', desc: 'ตอบถูกติดกันตั้งแต่ 3 ข้อขึ้นไป ใต้คำว่าคุณตอบถูกจะบอกว่าถูกติดกันกี่ข้อ ตอบผิดหรือข้ามข้อแล้วนับใหม่' },
    { kind: 'feature', scope: 'system', title: 'สั่นเบา ๆ เมื่อรู้ผลบนมือถือ', desc: 'มือถือ Android สั่นสั้น ๆ เมื่อรู้ผลคำตอบในโหมดฝึก ปิดได้ในตั้งค่า Mochi และการเคลื่อนไหว ส่วน iPhone ไม่มีการสั่นสำหรับเว็บ' },
  ],
};
