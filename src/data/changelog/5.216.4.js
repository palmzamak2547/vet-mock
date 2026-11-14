// Release 5.216.4. Fill in what a student notices (AGENTS.md Rule 2); kinds and scopes are listed in
// src/data/changelog.js. One file per release, so releases in flight never edit the same lines.
export default {
  version: '5.216.4',
  date: '2026-11-14',
  headline: 'บทความ แม่แบบวาดภาพ และชื่อหัวข้อใน VCA เขียนคั่นด้วยจุลภาค ไม่ใช้จุดกลาง',
  changes: [
    { kind: 'fix', scope: 'system', title: 'บทความและแม่แบบวาดภาพคั่นข้อความด้วยจุลภาค', desc: 'บทความทั้งสี่เรื่อง และป้ายบนแม่แบบฟัน หัวใจ และคลื่นไฟฟ้าหัวใจ คั่นข้อความด้วยจุลภาคหรือเว้นวรรคแทนจุดกลาง ชื่อหน้าและคำอธิบายของบทความเปลี่ยนตามกัน' },
    { kind: 'fix', scope: 'system', title: 'ชื่อหัวข้อใน VCA ไม่มีขีดแทนจุดกลาง', desc: 'ชื่อหัวข้อที่เดิมมีจุดกลางคั่นสองส่วน จะคั่นด้วยจุลภาคแทน' },
  ],
};
