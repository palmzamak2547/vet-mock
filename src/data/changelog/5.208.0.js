// Release 5.208.0. Fill in what a student notices (AGENTS.md Rule 2); kinds and scopes are listed in
// src/data/changelog.js. One file per release, so releases in flight never edit the same lines.
export default {
  version: '5.208.0',
  date: '2026-11-11',
  headline: 'การ์ด Anki มีภาพประกอบ และข้อสอบที่ตกหล่นอยู่ในหัวข้อของมันแล้ว',
  changes: [
    { kind: 'fix', scope: 'system', title: 'การ์ด Anki มีภาพประกอบครบ', desc: 'ข้อที่โจทย์ให้ดูภาพประกอบ ส่งออกไป Anki พร้อมภาพบนด้านหน้าการ์ดแล้ว ถ้ามีข้อที่ภาพเปิดนอกแอปไม่ได้ หน้าส่งออกจะบอกว่าไม่ได้ส่งกี่ข้อ' },
    { kind: 'fix', scope: 'multi', title: 'ข้อสอบ 17 ข้อเข้าหัวข้อของมันแล้ว', desc: 'ข้อสอบ Repro Lab, Surg Lab II และ Surg Lab III ที่เคยไม่อยู่ในหัวข้อใด ตอนนี้ขึ้นเมื่อเลือกฝึกตามหัวข้อนั้น' },
    { kind: 'fix', scope: 'system', title: 'สรุปคลิปบอกความยาวและมีชื่อครบ', desc: 'สรุปคลิป COM I 18 คลิปบอกความยาวเป็นนาทีแล้ว และสรุปปฐมนิเทศ 4 คลิปที่หัวข้อว่างมีชื่อขึ้น บันทึกเป็นไฟล์ได้' },  ],
};
