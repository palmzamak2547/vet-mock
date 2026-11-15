// Release 5.227.12. Fill in what a student notices (AGENTS.md Rule 2); kinds and scopes are listed in
// src/data/changelog.js. One file per release, so releases in flight never edit the same lines.
export default {
  version: '5.227.12',
  date: '2026-11-15',
  headline: 'ข้อความแรกถึงผู้ช่วยส่งได้ทุกครั้ง ไม่ขึ้นว่าระบบขัดข้อง',
  changes: [
    { kind: 'fix', scope: 'system', title: 'ข้อความแรกถึงผู้ช่วยไม่ถูกปฏิเสธ', desc: 'การแก้เมื่อช่วงค่ำทำให้ข้อความแรกหลังเว็บอัปเดตขึ้นว่า "ระบบจำกัดการใช้งานขัดข้องชั่วคราว" อีกครั้ง ตอนนี้ส่งได้ตั้งแต่ครั้งแรก' },
  ],
};
