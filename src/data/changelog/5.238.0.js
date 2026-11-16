// Release 5.238.0. Fill in what a student notices (AGENTS.md Rule 2); kinds and scopes are listed in
// src/data/changelog.js. One file per release, so releases in flight never edit the same lines.
export default {
  version: '5.238.0',
  date: '2026-11-15',
  headline: 'เปิดเอกสารจากคลังแล้วเห็นหน้าแรกได้เร็วขึ้นมาก ไม่ต้องรอโหลดทั้งไฟล์',
  changes: [
    { kind: 'feature', scope: 'system', title: 'หน้าแรกขึ้นก่อน ส่วนที่เหลือโหลดตามมา', desc: 'เอกสาร PDF จากคลังไม่ต้องรอโหลดครบทั้งไฟล์ก่อนแล้ว ไฟล์ 24 MB บนเน็ตทดสอบ 10 Mbit/s หน้าแรกขึ้นใน 3.2 วินาที จากเดิม 21.3 วินาที' },
    { kind: 'feature', scope: 'system', title: 'ค้นในเอกสารตอนไฟล์ยังมาไม่ครบ', desc: 'ถ้ากดค้นก่อนไฟล์โหลดครบ จะขึ้นว่าไฟล์ยังโหลดไม่ครบ แล้วค้นให้เองเมื่อโหลดครบ' },
  ],
};
