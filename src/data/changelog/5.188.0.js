// Release 5.188.0. Fill in what a student notices (AGENTS.md Rule 2); kinds and scopes are listed in
// src/data/changelog.js. One file per release, so releases in flight never edit the same lines.
export default {
  version: '5.188.0',
  date: '2026-11-02',
  headline: 'ประมวลรายวิชาฉบับอ่านง่ายและตารางสอนของปี 5 ดาวน์โหลดได้แล้ว',
  changes: [
    { kind: 'feature', scope: 'system', title: 'ประมวลรายวิชาฉบับอ่านง่ายทุกวิชาปี 5', desc: 'ประมวลรายวิชา 11 วิชาของภาคต้น 2569 ที่หน้าตารางเรียนและสอบ บอกว่าใครสอนอะไร เนื้อหาไหนของกลางภาคหรือปลายภาค และสัดส่วนคะแนนถ้าประมวลรายวิชาระบุ ดาวน์โหลดเป็น PDF หรือรูปได้' },
    { kind: 'feature', scope: 'system', title: 'ตารางสอนรายวิชาพร้อมพิมพ์', desc: 'ทุกคาบเรียงตามวันที่สอนจริงเท่าที่มีหลักฐานจากคลิปและไลน์ชั้นปี คาบที่ย้ายบอกวันเดิมไว้ แถบสีบอกเนื้อหากลางภาคหรือปลายภาค' },
  ],
};
