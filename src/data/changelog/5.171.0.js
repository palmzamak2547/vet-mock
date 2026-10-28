// Release 5.171.0. Fill in what a student notices (AGENTS.md Rule 2); kinds and scopes are listed in
// src/data/changelog.js. One file per release, so releases in flight never edit the same lines.
export default {
  version: '5.171.0',
  date: '2026-10-29',
  headline: 'ช่วงสอบเปลี่ยนเป็นปลายภาคให้เองเมื่อกลางภาคสอบจบ',
  changes: [
    { kind: 'fix', scope: 'system', title: 'ช่วงสอบตามตารางสอบเสมอ', desc: 'ถ้าช่วงสอบที่เลือกไว้สอบจบไปแล้ว แอปจะเปลี่ยนเป็นช่วงที่กำลังจะสอบให้เอง และบอกไว้หนึ่งบรรทัดบนหน้าแรก ส่วนช่วงที่ยังไม่ถึงซึ่งเลือกไว้เองยังคงอยู่เหมือนเดิม' },
    { kind: 'feature', scope: 'system', title: 'บอกชัดเมื่อยังไม่มีตารางสอบ', desc: 'ชั้นปีหรือช่วงที่ยังไม่มีตารางสอบในระบบจะแสดงข้อสอบโดยไม่แยกช่วงสอบ พร้อมบอกไว้บนหน้าแรกและแถบด้านบน ส่วนหัวข้อที่ยังไม่ระบุว่าออกช่วงไหนจะมีป้ายบอก' },
  ],
};
