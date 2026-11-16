// Release 5.296.0. Fill in what a student notices (AGENTS.md Rule 2); kinds and scopes are listed in
// src/data/changelog.js. One file per release, so releases in flight never edit the same lines.
export default {
  version: '5.296.0',
  date: '2026-11-17',
  headline: 'หมดเวลาตอนอ่านเคสเต็มจอ แล้วเห็นข้อถัดไปจากด้านบน',
  changes: [
    { kind: 'fix', scope: 'system', title: 'หมดเวลาตอนอ่านเคสเต็มจอ', desc: 'ในข้อสอบที่จับเวลารายข้อ ถ้าหมดเวลาขณะเปิดเคสอ่านเต็มจอ แผ่นเคสจะปิดและหน้าจะอยู่ที่ด้านบนของข้อถัดไป เห็นข้อความที่บอกว่าข้อก่อนหมดเวลาแล้ว เดิมบางครั้งหน้าค้างอยู่กลางเคสจนไม่เห็นข้อความนั้น' },
  ],
};
