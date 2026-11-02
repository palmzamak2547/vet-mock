// Release 5.179.1. Fill in what a student notices (AGENTS.md Rule 2); kinds and scopes are listed in
// src/data/changelog.js. One file per release, so releases in flight never edit the same lines.
export default {
  version: '5.179.1',
  date: '2026-11-02',
  headline: 'ที่มาและหัวข้อบนโจทย์ไม่บอกเฉลยก่อนตอบแล้ว',
  changes: [
    { kind: 'fix', scope: 'system', title: 'ที่มาใต้โจทย์ไม่บอกเฉลยก่อนตอบ', desc: 'ระหว่างทำโจทย์ บรรทัดที่มาบอกแค่ประเภท เช่น ข้อสอบเก่า Vet 85 ปลายภาค อิงแนวข้อสอบ หรือเขียนจากเนื้อหาที่เรียน ส่วนชื่อไฟล์ เลขหน้า และรายละเอียดเต็มเปิดดูได้หลังเห็นเฉลย' },
    { kind: 'fix', scope: 'system', title: 'ชื่อหัวข้อที่บอกคำตอบรอจนเห็นเฉลย', desc: 'ข้อที่ชื่อหัวข้อบนการ์ดบอกคำตอบได้ จะขึ้นว่าหัวข้อแสดงหลังเฉลยแทน แล้วแสดงชื่อหัวข้อเมื่อเห็นเฉลย' },
    { kind: 'fix', scope: 'system', title: 'ป้ายอิงแนวเดิมตรงกับที่มา', desc: 'ข้อที่เขียนจากเนื้อหาที่เรียนหรือชีทรุ่นพี่ไม่ขึ้นป้ายอิงแนวเดิมแล้ว' },
    { kind: 'fix', scope: 'system', title: 'กล่องเฉลยไม่มีสติกเกอร์ Mochi แล้ว', desc: 'หลังตอบในโหมดฝึก หัวกล่องเฉลยแสดงผลตอบเต็มความกว้าง' },
  ],
};
