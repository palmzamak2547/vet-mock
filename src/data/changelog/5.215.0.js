// Release 5.215.0. Fill in what a student notices (AGENTS.md Rule 2); kinds and scopes are listed in
// src/data/changelog.js. One file per release, so releases in flight never edit the same lines.
export default {
  version: '5.215.0',
  date: '2026-11-14',
  headline: 'Wrap-up ปลายภาค Equine Med มาแล้ว และเฉลยที่ไม่ตรงกับเดคปีนี้แก้แล้ว',
  changes: [
    { kind: 'feature', scope: 'system', title: 'Wrap-up ปลายภาค Equine Medicine & Surgery', desc: '65 หัวข้อจากสามอาจารย์ ตั้งแต่ ophthalmology, dermatology และ wound, surgery กับ anesthesia จนถึง infectious disease, lameness, foot, tendon และ POA แต่ละส่วนตรวจซ้ำโดยผู้อ่านคนที่สอง ส่วน lameness กับ foot จะเติมเมื่อคลิปปีนี้เข้า' },
    { kind: 'feature', scope: 'system', title: 'One Health: 5 ข้อเรื่อง import risk assessment', desc: 'หัวข้อนี้เคยไม่มีข้อเลย ตอนนี้มีข้อเรื่องขั้นตอนการประเมิน การรวม likelihood กับ consequence ด้วย matrix และกรณีนำเข้ากุ้งกับ WSSV เฉลยตรวจซ้ำแบบไม่เห็นคำตอบตรงกันครบ และข้อเดิม 5 ข้อเรื่องกรณีกุ้งย้ายมาอยู่หัวข้อนี้' },
    { kind: 'fix', scope: 'system', title: 'Equine Med: เฉลยและคำอธิบาย 7 ข้อตรงกับเดคปีนี้แล้ว', desc: 'เช่นเหตุผลของการดึงขาหน้าไปข้างหน้าขณะวางยา สัดส่วน neutrophil ใน RAO การเพิ่มน้ำมันทีละ 15 ml ทุก 3 ถึง 4 วัน อัตราการหายใจปกติ และการใช้ sling ระหว่างนำสลบ ตัวเลือกที่เป็นเฉลยไม่เปลี่ยน' },
    { kind: 'fix', scope: 'system', title: 'One Health: ข้อ GMO ที่ตอบตามเนื้อหาปีก่อนมีคำเตือนกำกับ', desc: 'ข้อสอบเก่า 2 ข้อที่ตอบตามรายการทดสอบความปลอดภัยแบบเดิม มีคำเตือนบอกการประเมิน 4 ขั้นตามที่สอนปีนี้ และอีก 1 ข้อปรับคำอธิบายให้ตรงกับปีนี้' },
  ],
};
