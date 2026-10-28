// Release 5.169.0. Fill in what a student notices (AGENTS.md Rule 2); kinds and scopes are listed in
// src/data/changelog.js. One file per release, so releases in flight never edit the same lines.
export default {
  version: '5.169.0',
  date: '2026-10-28',
  headline: 'ช่วงสอบเปลี่ยนเป็นปลายภาคให้เองเมื่อกลางภาคสอบจบ',
  changes: [
    { kind: 'fix', scope: 'system', title: 'ช่วงสอบตามตารางสอบเสมอ', desc: 'ถ้าช่วงสอบที่เลือกไว้สอบจบไปแล้ว แอปจะเปลี่ยนเป็นช่วงที่กำลังจะสอบให้เอง และบอกไว้หนึ่งบรรทัดบนหน้าแรก ส่วนช่วงที่ยังไม่ถึงซึ่งเลือกไว้เองยังคงอยู่เหมือนเดิม' },
  ],
};
