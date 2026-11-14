// Release 5.217.0. Fill in what a student notices (AGENTS.md Rule 2); kinds and scopes are listed in
// src/data/changelog.js. One file per release, so releases in flight never edit the same lines.
export default {
  version: '5.217.0',
  date: '2026-11-14',
  headline: 'Wrap-up อ่านง่ายขึ้น แตะนาทีเพื่อเปิดคลิป และรู้ว่าอ่านถึงหัวข้อไหนแล้ว',
  changes: [
    { kind: 'feature', scope: 'system', title: 'แตะนาทีใน wrap-up เพื่อเปิดคลิปตรงนั้น', desc: 'นาทีที่อ้างไว้ใต้แต่ละบรรทัดเป็นปุ่ม แตะแล้วคลิปเปิดในแท็บใหม่และเล่นจากนาทีนั้น' },
    { kind: 'feature', scope: 'system', title: 'ป้ายเคยออกกี่รุ่น', desc: 'หัวข้อที่ข้อสอบเก่าระบุรุ่นได้ จะบอกว่าเคยออกกี่รุ่นและรุ่นไหน' },
    { kind: 'feature', scope: 'system', title: 'ไอคอนบอกชนิดของบรรทัด', desc: 'อาจารย์เน้น มีในข้อสอบเก่า และระวังสับสน มีไอคอนของตัวเอง หาเจอได้ด้วยตา ส่วนคีย์เวิร์ดแบบ "คำ: คำอธิบาย" ตัวคำเป็นตัวหนา' },
    { kind: 'feature', scope: 'system', title: 'รู้ว่าอ่านถึงหัวข้อไหนแล้ว', desc: 'แถบสารบัญด้านบนบอกว่ากำลังอ่านหัวข้อที่เท่าไรจากทั้งหมด และเลื่อนตามไปเอง' },
  ],
};
