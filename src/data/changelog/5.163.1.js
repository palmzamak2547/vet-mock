// Release 5.163.1. Fill in what a student notices (AGENTS.md Rule 2); kinds and scopes are listed in
// src/data/changelog.js. One file per release, so releases in flight never edit the same lines.
export default {
  version: '5.163.1',
  date: '2026-10-22',
  headline: 'การ์ดลิงก์ในคลังเอกสารไม่มีขีดเกินแล้ว',
  changes: [
    { kind: 'fix', scope: 'system', title: 'การ์ดลิงก์ไปเว็บต้นทางอ่านง่ายขึ้น', desc: 'เอกสารจากนอกจุฬาที่เปิดที่เว็บต้นทางไม่แสดงขีดแทนขนาดไฟล์แล้ว เพราะไม่มีไฟล์อยู่ในคลัง' },
  ],
};
