// Release 5.162.0. Fill in what a student notices (AGENTS.md Rule 2); kinds and scopes are listed in
// src/data/changelog.js. One file per release, so releases in flight never edit the same lines.
export default {
  version: '5.162.0',
  date: '2026-10-22',
  headline: 'ลิงก์ที่เพื่อนแชร์มาพาไปถึงหน้านั้นจริง และหน้าแรกไม่มีแถบคุกกี้บังโจทย์',
  changes: [
    { kind: 'fix', scope: 'system', title: 'ลิงก์ที่แชร์มาไปถึงหน้าที่ตั้งใจ', desc: 'เปิดลิงก์หน้าฝึก หน้าทบทวน หรือหน้าความคืบหน้าครั้งแรก หลังเลือกชั้นปีและช่วงสอบแล้วจะไปที่หน้านั้นเลย ไม่เด้งกลับหน้าแรก' },
    { kind: 'fix', scope: 'system', title: 'แถบคุกกี้ไม่บังโจทย์ตัวอย่าง', desc: 'บนมือถือ แถบถามเรื่องคุกกี้จะขึ้นหลังเลื่อนหน้าแล้ว จึงลองตอบโจทย์ตัวอย่างบนหน้าแรกได้ทันที' },
  ],
};
