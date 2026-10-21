// Release 5.151.0. Fill in what a student notices (AGENTS.md Rule 2); kinds and scopes are listed in
// src/data/changelog.js. One file per release, so releases in flight never edit the same lines.
export default {
  version: '5.151.0',
  date: '2026-10-21',
  headline: 'ข้อความในแอปบอกตรงขึ้นว่าเกิดอะไร',
  changes: [
    { kind: 'fix', scope: 'system', title: 'อ่านลายมือบอกเหตุที่ใช้ไม่ได้', desc: 'ถ้าวันนี้ใช้อ่านลายมือครบจำนวนแล้ว แอปจะบอกตรง ๆ ว่าพรุ่งนี้ใช้ได้อีก ระหว่างนั้นพิมพ์หรือพูดตอบได้ตามเดิม' },
    { kind: 'fix', scope: 'system', title: 'Imaging Lab และ Atlas พูดภาษาเดียวกับหน้าอื่น', desc: 'ข้อความตอนเปิดเคสไม่สำเร็จเป็นภาษาไทยที่บอกว่าต้องทำอะไรต่อ และถ้าเครื่องเปิดภาพ 3D ไม่ได้ Atlas จะบอกว่ากำลังแสดงภาพนิ่งแทน' },
  ],
};
