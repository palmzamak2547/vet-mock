// Release 5.236.0. Fill in what a student notices (AGENTS.md Rule 2); kinds and scopes are listed in
// src/data/changelog.js. One file per release, so releases in flight never edit the same lines.
export default {
  version: '5.236.0',
  date: '2026-11-15',
  headline: 'โจทย์ยาวอ่านง่ายขึ้น เห็นชัดว่าตรงไหนคือเคส ตรงไหนคือคำถาม',
  changes: [
    { kind: 'feature', scope: 'system', title: 'โจทย์ยาวอ่านง่ายขึ้น', desc: 'โจทย์เคสยาวแยกส่วนเรื่องเล่า ผลตรวจ และคำถามออกจากกัน คำถามอยู่บรรทัดสุดท้ายเป็นหัวข้อตัวใหญ่ ส่วนเคสด้านบนเป็นตัวอักษรปกติ อ่านจบแล้วรู้ทันทีว่าต้องตอบอะไร' },
    { kind: 'feature', scope: 'system', title: 'ค่าแล็บเรียงเป็นคอลัมน์', desc: 'ค่าแล็บในโจทย์เรียงเป็นคอลัมน์ ชื่อค่า ผล และช่วงปกติตรงกันทุกแถว บน iPad แนวนอนแบ่งเป็นสองฝั่ง ผลตรวจแบบ Negative หรือ Positive ก็เรียงตรงกันเป็นคอลัมน์' },
    { kind: 'fix', scope: 'system', title: 'เหตุผลและรายการเรียงสวยขึ้น', desc: 'ข้อย่อยแบบ 1. 2. หรือขีดนำหน้าในเหตุผล ตัดบรรทัดแล้วข้อความยังตรงแนวเดิม ย่อหน้าเว้นระยะพอดีแทนบรรทัดว่าง และบรรทัดที่มีคำศัพท์ขีดเส้นประไม่สูงกว่าบรรทัดอื่นแล้ว' },
  ],
};
