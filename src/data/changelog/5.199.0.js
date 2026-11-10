// Release 5.199.0. Fill in what a student notices (AGENTS.md Rule 2); kinds and scopes are listed in
// src/data/changelog.js. One file per release, so releases in flight never edit the same lines.
export default {
  version: '5.199.0',
  date: '2026-11-11',
  headline: 'ใต้เฉลยมีสไลด์จริงที่คำตอบมาจากนั้น',
  changes: [
    { kind: 'feature', scope: 'system', title: 'เฉลยมีภาพสไลด์ที่เรียนประกอบ ไฮไลต์บรรทัดที่เป็นคำตอบ', desc: 'หลังตอบ ใต้เหตุผลจะมีหน้าสไลด์ของวิชานั้นจากคลังเอกสาร พร้อมไฮไลต์ข้อความที่ใช้เฉลย แตะเพื่อดูเต็มหน้า หน้าทบทวนหลังทำชุดก็มีเช่นกัน' },
    { kind: 'content', scope: 'multi', title: 'เริ่มที่ 379 ข้อของ 5 วิชาปลายภาคปี 5 ที่สอบก่อน', desc: 'Equine Medicine 242 ข้อ, Aquatic 53 ข้อ, Zoonoses 50 ข้อ, One Health 20 ข้อ และ Swine 14 ข้อ ทุกข้อผ่านการเทียบกับหน้าสไลด์จริงก่อนขึ้น วิชาที่เหลือจะตามมา' },
  ],
};
