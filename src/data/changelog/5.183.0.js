// Release 5.183.0. Fill in what a student notices (AGENTS.md Rule 2); kinds and scopes are listed in
// src/data/changelog.js. One file per release, so releases in flight never edit the same lines.
export default {
  version: '5.183.0',
  date: '2026-11-02',
  headline: 'ประมวลรายวิชาฉบับอ่านง่ายและตารางสอนของปี 5 ดาวน์โหลดได้แล้ว',
  changes: [
    { kind: 'feature', scope: 'system', title: 'ประมวลรายวิชาฉบับอ่านง่ายทุกวิชาปี 5', desc: 'หน้าตารางเรียนและสอบมีประมวลรายวิชา 11 วิชาของภาคต้น 2569 บอกว่าอาจารย์คนไหนสอนอะไร เนื้อหาช่วงไหนออกสอบกลางภาคหรือปลายภาค และสัดส่วนคะแนนเมื่อประมวลรายวิชาระบุไว้ ดาวน์โหลดเป็น PDF หรือรูปได้' },
    { kind: 'feature', scope: 'system', title: 'ตารางสอนรายวิชาตามวันที่สอนจริง', desc: 'ทุกคาบเรียงตามวันที่สอนจริงจากคลิปบันทึกการสอนของรุ่นและประกาศในกลุ่มไลน์ชั้นปี คาบที่ย้ายบอกวันเดิมไว้ มีผู้สอนและวันสอบ แถบสีบอกว่าคาบนั้นออกสอบกลางภาคหรือปลายภาค' },
  ],
};
