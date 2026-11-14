// Release 5.217.3. Fill in what a student notices (AGENTS.md Rule 2); kinds and scopes are listed in
// src/data/changelog.js. One file per release, so releases in flight never edit the same lines.
export default {
  version: '5.217.3',
  date: '2026-11-14',
  headline: 'สีของข้อที่ถูก ผิด และถูกบางส่วน เหมือนเดิมทุกจานสี และอ่านชัดขึ้น',
  changes: [
    { kind: 'fix', scope: 'system', title: 'ข้อที่ตอบถูกเป็นสีเขียวทุกจานสี', desc: 'ในจานสีเชอร์รีและจานสีอื่น ข้อที่ตอบถูกเคยเปลี่ยนสีตามจานสีจนดูคล้ายข้อที่ผิด ตอนนี้ถูก ผิด และถูกบางส่วนใช้สีเดิมเสมอ และป้ายผิดอ่านชัดขึ้น' },
    { kind: 'fix', scope: 'system', title: 'แผนที่ข้อบอกข้อที่กำลังทำชัดขึ้น', desc: 'ในโหมดสอบ ข้อที่กำลังทำอยู่ในแผนที่ข้อเป็นสีเข้มตัดกับพื้น ไม่ใช้สีแดงที่หมายถึงตอบผิดแล้ว และป้าย "ผิด" อ่านชัดขึ้นทั้งโหมดสว่างและโหมดมืด' },
  ],
};
