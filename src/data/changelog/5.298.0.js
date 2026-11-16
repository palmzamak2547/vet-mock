// Release 5.298.0. Fill in what a student notices (AGENTS.md Rule 2); kinds and scopes are listed in
// src/data/changelog.js. One file per release, so releases in flight never edit the same lines.
export default {
  version: '5.298.0',
  date: '2026-11-17',
  headline: 'กดเมนูบนหน้าแนะนำ แล้วหน้าเลื่อนไปถึงหัวข้อที่กด',
  changes: [
    { kind: 'fix', scope: 'system', title: 'เมนูบนหน้าแนะนำเลื่อนไปถึงหัวข้อ', desc: 'กดหัวข้อในเมนูด้านบนของหน้าแนะนำ หน้าจะเลื่อนไปจนถึงหัวข้อนั้น เดิมมีจังหวะที่หน้าหยุดกลางทางหรือไม่ขยับเลย ต้องกดซ้ำ พบในการทดสอบอัตโนมัติบน WebKit ซึ่งเป็นตัวที่ Safari ใช้แสดงหน้าเว็บ' },
  ],
};
