// Release 5.295.0. Fill in what a student notices (AGENTS.md Rule 2); kinds and scopes are listed in
// src/data/changelog.js. One file per release, so releases in flight never edit the same lines.
export default {
  version: '5.295.0',
  date: '2026-11-16',
  headline: 'Swine Medicine ปลายภาค: เฉลยข้อความบกพร่องของการควบคุม pseudorabies แก้เป็นถูกทั้งข้อ 1 และ 2',
  changes: [
    { kind: 'fix', scope: 'system', title: 'เฉลยข้อการควบคุม pseudorabies แก้แล้ว', desc: 'ข้อสอบเก่า Vet 80 ที่ถามว่าข้อใดเป็นความบกพร่องของการควบคุม pseudorabies เคยเฉลยเฉพาะการไม่คัดทิ้งสุกรที่ติดเชื้อ ตอนนี้เฉลยว่าถูกทั้งข้อ 1 และ 2 เพราะการตรวจติดตามฝูงเป็นประจำและการคัดทิ้งตัวติดเชื้อต้องทำคู่กันจึงกำจัดโรคได้ คำอธิบายเขียนใหม่ตามกัน' },
  ],
};
