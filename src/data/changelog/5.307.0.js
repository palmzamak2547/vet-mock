// Release 5.307.0. Fill in what a student notices (AGENTS.md Rule 2); kinds and scopes are listed in
// src/data/changelog.js. One file per release, so releases in flight never edit the same lines.
export default {
  version: '5.307.0',
  date: '2026-11-25',
  headline: 'ชุดคาดการณ์ข้อสอบ Zoonoses ปลายภาค และสไลด์ใต้เฉลย Aquatic 144 ข้อ',
  changes: [
    { kind: 'feature', scope: 'system', title: 'ชุดคาดการณ์ข้อสอบ Zoonoses ปลายภาค', desc: 'หน้าหัวข้อ Zoonoses ปลายภาคมีการ์ดแบ่งข้อสอบเป็น 7 ส่วนตามคาบ แต่ละส่วนบอกรูปแบบ จำนวนข้อ หลักฐานที่ใช้คาด และที่มาของข้อ ทำทั้งฉบับ 68 ข้อจับเวลา 180 นาที เรียงตามส่วน เฉลยหลังส่ง หรือฝึกทีละส่วนพร้อมข้อเสริม การ์ดหายไปเองเมื่อสอบจบ 26 พ.ย. 16:00' },
    { kind: 'content', scope: 'system', title: 'Zoonoses ข้อจากแบบทดสอบในคาบ 13 พ.ย. 14 ข้อ', desc: 'แบบทดสอบก่อนและหลังเรียนของคาบ Epidemiological approach to zoonoses เฉลยตามที่ยืนยันในคาบ ตรวจกับสไลด์ปีนี้ทุกข้อ' },
    { kind: 'fix', scope: 'system', title: 'เฉลยข้อเขียน Bacterial zoonoses 14 ข้อตอบตรงคำถาม', desc: 'คำตอบตัวอย่างของข้อตอบสั้นเขียนใหม่ให้ตอบสิ่งที่โจทย์ถาม เช่น anthrax ชนิดที่พบบ่อยที่สุดและชนิดที่อันตรายที่สุด ทุกประโยคตรวจกับสไลด์หรือคลิปบันทึกคาบ' },
    { kind: 'fix', scope: 'system', title: 'เฉลยข้อเขียน pre-spillover prevention', desc: 'คำตอบตัวอย่างเขียนใหม่จากสไลด์ Wildlife and Emergence of Zoonotic Diseases ปีนี้ หน้า 65, 67, 72 และ 74' },
    { kind: 'fix', scope: 'system', title: 'คำอธิบาย Zoonoses 2 ข้อ', desc: 'ข้อ superficial หรือ cutaneous mycosis ไม่จัด sporotrichosis ไว้กลุ่มเดียวกับ candidiasis ซึ่งสไลด์ไม่ได้จัดไว้อย่างนั้น ข้อ Henipavirus บอกช่องทางติดต่อเป็นน้ำหวานดิบจากต้น date palm ที่ปนเปื้อน ไม่ใช่น้ำผลไม้ทั่วไป' },
    { kind: 'content', scope: 'system', title: 'สไลด์ใต้เฉลยวิชา Aquatic จาก 60 เป็น 144 ข้อ', desc: 'Aquatic disease control 59 ข้อ (จาก 11) Disease in fish culture 25 ข้อ Shrimp diseases 23 ข้อ Aquarium veterinarian 16 ข้อ (เดิมยังไม่มี) Conservation aquatic animals 13 ข้อ และ Aquatic toxicology 8 ข้อ (เดิมยังไม่มี) แต่ละข้อแสดงหน้าสไลด์พร้อมไฮไลต์บรรทัดที่บอกคำตอบ' },
    { kind: 'content', scope: 'system', title: 'หน้าสรุป Aquatic ปลายภาคมีภาพสไลด์ 62 หน้า', desc: 'จากเดิม 23 หน้า บรรทัดที่อ้างหน้าสไลด์แสดงภาพหน้านั้นใต้บรรทัด' },
    { kind: 'content', scope: 'system', title: 'หน้าสรุป Zoonoses ปลายภาค ส่วน epidemiology', desc: 'หมายเหตุรูปแบบข้อสอบของส่วนนี้ใช้สิ่งที่บอกในคาบ 13 พ.ย. ทั้งต้นคาบและท้ายคาบ พร้อมเวลาในคลิป' },
  ],
};
