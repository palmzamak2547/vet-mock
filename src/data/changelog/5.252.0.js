// Release 5.252.0. Fill in what a student notices (AGENTS.md Rule 2); kinds and scopes are listed in
// src/data/changelog.js. One file per release, so releases in flight never edit the same lines.
export default {
  version: '5.252.0',
  date: '2026-11-16',
  headline: 'ฟังเสียงอ่านได้ทุกที่ที่อ่านข้อสอบ',
  changes: [
    { kind: 'feature', scope: 'system', title: 'เสียงอ่านในหน้าเฉลยและทบทวน', desc: 'หน้าเฉลยหลังทำชุด ทบทวนแบบเว้นระยะ และข้อวันนี้ มีปุ่มอ่านออกเสียงข้างคำถาม และข้างเหตุผลเมื่อเหตุผลขึ้นแล้ว ใช้แถบเสียงอ่านและการตั้งค่าเสียงเดียวกับหน้าฝึก' },
    { kind: 'feature', scope: 'system', title: 'ฟังหน้าสรุปก่อนสอบทีละหัวข้อ', desc: 'แต่ละหัวข้อในหน้าสรุปก่อนสอบมีปุ่มอ่านออกเสียง อ่านตามที่เห็นบนหน้า ไม่อ่านปุ่มและแหล่งอ้างอิง' },
  ],
};
