// Release 5.192.2. Fill in what a student notices (AGENTS.md Rule 2); kinds and scopes are listed in
// src/data/changelog.js. One file per release, so releases in flight never edit the same lines.
export default {
  version: '5.192.2',
  date: '2026-11-08',
  headline: 'ผลสอบบันทึกขึ้นบัญชีได้ทุกคะแนน และชุดสอบจริงได้เวลาครบตามจำนวนข้อ',
  changes: [
    { kind: 'fix', scope: 'system', title: 'ผลสอบทุกคะแนนขึ้นบัญชีได้', desc: 'ผลสอบที่ได้คะแนนอย่าง 23 จาก 40 ข้อ บันทึกขึ้นบัญชีและกระดานอันดับได้ตามปกติ ผลที่ค้างรอส่งอยู่ในเครื่องจะส่งต่อได้เองเมื่อเปิดแอป' },
    { kind: 'fix', scope: 'system', title: 'ชุดสอบจริงได้เวลาครบ', desc: 'ชุดสอบจริงที่เริ่มจากหน้าผลลัพธ์ได้เวลาครบตามจำนวนข้อ แม้เคยตั้งเวลาต่อข้อไว้ต่างจากนี้ และทำต่อจากที่ค้างไว้ก็ได้เวลาเท่าเดิม' },
  ],
};
