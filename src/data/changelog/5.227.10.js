// Release 5.227.10. Fill in what a student notices (AGENTS.md Rule 2); kinds and scopes are listed in
// src/data/changelog.js. One file per release, so releases in flight never edit the same lines.
export default {
  version: '5.227.10',
  date: '2026-11-15',
  headline: 'ข้อความแรกถึงผู้ช่วยหลังเว็บอัปเดตส่งได้เลย ไม่ขึ้นว่าระบบขัดข้อง',
  changes: [
    { kind: 'fix', scope: 'system', title: 'ข้อความแรกถึงผู้ช่วยไม่ถูกปฏิเสธ', desc: 'หลังเว็บอัปเดต ข้อความแรกที่ส่งถึงผู้ช่วยเคยขึ้นว่า "ระบบจำกัดการใช้งานขัดข้องชั่วคราว" แล้วต้องรอ 30 วินาที ตอนนี้ส่งได้ตั้งแต่ครั้งแรก' },
  ],
};
