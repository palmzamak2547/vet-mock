// Release 5.182.0. Fill in what a student notices (AGENTS.md Rule 2); kinds and scopes are listed in
// src/data/changelog.js. One file per release, so releases in flight never edit the same lines.
export default {
  version: '5.182.0',
  date: '2026-11-01',
  headline: 'ประมวลรายวิชาฉบับอ่านง่ายและตารางสอนของปี 5 ดาวน์โหลดได้แล้ว',
  changes: [
    { kind: 'feature', scope: 'system', title: 'ประมวลรายวิชาฉบับอ่านง่ายทุกวิชาปี 5', desc: 'หน้าตารางเรียนและสอบมีประมวลรายวิชา 11 วิชาของภาคต้น 2569 บอกว่าอาจารย์คนไหนสอนอะไร ช่วงไหนออกสอบกลางภาคหรือปลายภาค และสัดส่วนคะแนน ดาวน์โหลดเป็น PDF หรือรูปได้' },
    { kind: 'feature', scope: 'system', title: 'ตารางสอนรายวิชาพร้อมพิมพ์', desc: 'ทุกคาบเรียงตามวัน มีผู้สอน วันสอบ และคาบที่เลื่อนหรืองดตามที่แจ้งในกลุ่มชั้นปี แถบสีบอกว่าคาบนั้นออกสอบช่วงไหน' },
  ],
};
