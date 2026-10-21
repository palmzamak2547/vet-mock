// Release 5.152.0. Fill in what a student notices (AGENTS.md Rule 2); kinds and scopes are listed in
// src/data/changelog.js. One file per release, so releases in flight never edit the same lines.
export default {
  version: '5.152.0',
  date: '2026-10-21',
  headline: 'หัวข้อที่เรียนพาไปหน้าเอกสารที่พูดถึงหัวข้อนั้น',
  changes: [
    { kind: 'feature', scope: 'system', title: 'เอกสารของแต่ละหัวข้อ', desc: 'การ์ดหัวข้อในหน้าเลือกหัวข้อมีปุ่มเอกสาร แตะแล้วเห็นไฟล์ในคลังที่มีชื่อหัวข้อนั้นอยู่ในหน้า พร้อมข้อความในหน้านั้น กดแล้วเปิดตรงหน้านั้นทันที' },
    { kind: 'feature', scope: 'system', title: 'เอกสารที่เกี่ยวข้องท้ายบทความ VetWiki', desc: 'ท้ายบทความมีรายการหน้าเอกสารที่พูดถึงเรื่องเดียวกัน กดเปิดตรงหน้านั้น และปุ่มย้อนกลับพากลับมาที่บทความ' },
  ],
};
