// Release 5.213.1. Fill in what a student notices (AGENTS.md Rule 2); kinds and scopes are listed in
// src/data/changelog.js. One file per release, so releases in flight never edit the same lines.
export default {
  version: '5.213.1',
  date: '2026-11-11',
  headline: 'ป้าย "ข้อมูลขัดแย้ง" ไม่ค้างไปข้ออื่นแล้ว',
  changes: [
    { kind: 'fix', scope: 'system', title: 'ป้าย "ข้อมูลขัดแย้ง" ขึ้นเฉพาะข้อที่มีจริง', desc: 'หลังเจอข้อที่มีป้ายนี้ ทุกข้อหลังจากนั้นในชุดเดียวกันเคยมีป้ายติดมาด้วยทั้งที่ไม่มีปัญหา และแตะแล้วไม่เปิดอะไร ตอนนี้ป้ายขึ้นเฉพาะข้อที่มีข้อมูลขัดแย้งจริง' },
  ],
};
