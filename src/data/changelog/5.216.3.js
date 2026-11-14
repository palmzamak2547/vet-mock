// Release 5.216.3. Fill in what a student notices (AGENTS.md Rule 2); kinds and scopes are listed in
// src/data/changelog.js. One file per release, so releases in flight never edit the same lines.
export default {
  version: '5.216.3',
  date: '2026-11-14',
  headline: 'ผู้ช่วย AI หาสไลด์เจอจากหัวข้อของไฟล์ แม้ชื่อไฟล์จะเป็นรหัส',
  changes: [
    { kind: 'fix', scope: 'system', title: 'ถามหาสไลด์ตามหัวข้อ ผู้ช่วย AI ก็หาเจอ', desc: 'สไลด์ที่ชื่อไฟล์เป็นรหัส เช่น OHVPH_SP_E4 ผู้ช่วย AI หาเจอจากหัวข้อของไฟล์แล้ว และการ์ดไฟล์บอกด้วยว่าไฟล์นั้นว่าด้วยเรื่องอะไร' },
  ],
};
