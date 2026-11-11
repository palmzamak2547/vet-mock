// Release 5.209.0. Fill in what a student notices (AGENTS.md Rule 2); kinds and scopes are listed in
// src/data/changelog.js. One file per release, so releases in flight never edit the same lines.
export default {
  version: '5.209.0',
  date: '2026-11-11',
  headline: 'ปุ่มอธิบายข้อที่เลือกผิดบอกเมื่อใช้ไม่ได้',
  changes: [
    { kind: 'fix', scope: 'system', title: 'ปุ่ม "ทำไมข้อที่เลือกถึงไม่ใช่" ไม่หายไปเงียบ ๆ อีก', desc: 'ถ้าระบบอธิบายเพิ่มใช้ไม่ได้ชั่วคราว จะมีข้อความว่า "ตอนนี้ยังอธิบายเพิ่มไม่ได้ ลองใหม่ภายหลัง" แทนปุ่ม คำอธิบายของข้อยังอยู่ครบเหมือนเดิม' },
  ],
};
