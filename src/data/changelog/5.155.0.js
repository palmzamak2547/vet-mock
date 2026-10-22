// Release 5.155.0. Fill in what a student notices (AGENTS.md Rule 2); kinds and scopes are listed in
// src/data/changelog.js. One file per release, so releases in flight never edit the same lines.
export default {
  version: '5.155.0',
  date: '2026-10-21',
  headline: 'เสียงอ่านโจทย์ชัดขึ้นและเริ่มทันที',
  changes: [
    { kind: 'feature', scope: 'system', title: 'เสียงอ่านโจทย์ชัดขึ้นและเริ่มทันที', desc: 'วิชาอายุรศาสตร์สัตว์ปีกอ่านโจทย์และตัวเลือกด้วยเสียงใหม่ที่ออกเสียงไทยและศัพท์อังกฤษได้เป็นธรรมชาติ กดแล้วเริ่มพูดทันที และข้อที่ฟังแล้วฟังซ้ำได้แม้ไม่มีเน็ต วิชาอื่นจะตามมา' },
    { kind: 'fix', scope: 'system', title: 'อ่านตัวเลือกตรงกับที่เห็นบนจอ', desc: 'เสียงอ่านเรียงตัวเลือกตามลำดับเดียวกับบนจอทุกวิชา เดิมอ่านตามลำดับก่อนสลับ ตัวเลือกที่หนึ่งที่ได้ยินจึงอาจไม่ใช่ข้อ A บนจอ' },
  ],
};
