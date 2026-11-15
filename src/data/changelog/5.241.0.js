// Release 5.241.0. Fill in what a student notices (AGENTS.md Rule 2); kinds and scopes are listed in
// src/data/changelog.js. One file per release, so releases in flight never edit the same lines.
export default {
  version: '5.241.0',
  date: '2026-11-16',
  headline: 'ระบาดวิทยามีทางไปบทเรียน FMD Module 1 ถึง 4 และตารางสอนบนมือถือขึ้นเร็วขึ้น',
  changes: [
    { kind: 'content', scope: 'system', title: 'บทเรียน FMD Module 1 ถึง 4 ในหน้าวิชาระบาดวิทยา', desc: 'แท็บสื่อเรียนของวิชาระบาดวิทยามีการ์ดรวมลิงก์หน้าเว็บบทเรียน FMD ทั้งสี่ module ของอาจารย์ผู้สอน แตะแล้วเปิดในแท็บใหม่' },
    { kind: 'fix', scope: 'system', title: 'ตารางสอนหลายหน้าขึ้นเร็วขึ้น', desc: 'ตารางสอนที่ยาวเกินหนึ่งหน้า A4 จัดหน้าเร็วขึ้นราวหนึ่งในสาม หน้าที่ได้ยังเหมือนเดิมทุกวิชา' },
    { kind: 'fix', scope: 'system', title: 'รายงานข้อผิดพลาดเก็บแค่ไฟล์ของ VetMock', desc: 'ถ้าข้อผิดพลาดมาจากส่วนขยายของเบราว์เซอร์หรือสคริปต์ของเว็บอื่น รายงานจะไม่เก็บชื่อไฟล์นั้น ตรงกับที่หน้าความเป็นส่วนตัวเขียนไว้' },
  ],
};
