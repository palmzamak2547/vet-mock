// Release 5.271.0. Fill in what a student notices (AGENTS.md Rule 2); kinds and scopes are listed in
// src/data/changelog.js. One file per release, so releases in flight never edit the same lines.
export default {
  version: '5.271.0',
  date: '2026-11-16',
  headline: 'ตารางสอนบอกคาบที่สอนจริงถึงคลิปล่าสุดของแต่ละวิชา',
  changes: [
    { kind: 'fix', scope: 'system', title: 'ตารางสอนแต่ละวิชาบอกคาบที่สอนจริงถึงคลิปล่าสุดของวิชานั้น', desc: 'เดิมทุกวิชาบอกวันที่สอนจริงได้ถึง 28 ต.ค. เท่านั้น ตอนนี้แต่ละวิชาใช้วันของคลิปบันทึกการสอนล่าสุดของตัวเอง เช่น Zoonoses ถึง 13 พ.ย. และ Swine ถึง 6 พ.ย. คาบที่ย้ายวันบอกวันเดิมไว้ เช่น Prion zoonoses สอนวันที่ 4 พ.ย. และโรคปากและเท้าเปื่อยของ Swine สอนวันที่ 30 ต.ค.' },
    { kind: 'fix', scope: 'system', title: 'ชื่ออาจารย์ในตารางสอนและหัวข้อครบขึ้น', desc: 'คาบ 31 ส.ค. ของ Epidemiology มีชื่ออาจารย์ทั้งสองท่าน หัวข้อ Aquatic disease control, Pythium และ Neonatal & foal management แสดงอาจารย์ผู้สอนปีนี้ และตำแหน่งอาจารย์ตรงกับทำเนียบคณะ' },
  ],
};
