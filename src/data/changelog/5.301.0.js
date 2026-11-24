// Release 5.301.0. Fill in what a student notices (AGENTS.md Rule 2); kinds and scopes are listed in
// src/data/changelog.js. One file per release, so releases in flight never edit the same lines.
export default {
  version: '5.301.0',
  date: '2026-11-24',
  headline: 'ชุดคาดการณ์ข้อสอบ One Health ปลายภาค',
  changes: [
    { kind: 'feature', scope: 'system', title: 'ชุดคาดการณ์ข้อสอบ One Health ปลายภาค', desc: 'หน้าหัวข้อ One Health ปลายภาคมีการ์ดแบ่งข้อสอบเป็น 8 ส่วนตามคาบ แต่ละส่วนบอกรูปแบบ จำนวนข้อ หลักฐานที่ใช้คาด และที่มาของข้อ ทำทั้งฉบับ 72 ข้อจับเวลา 90 นาที เรียงตามส่วน เฉลยหลังส่ง หรือฝึกทีละส่วนพร้อมข้อเสริม การ์ดหายไปเมื่อสอบจบ' },
    { kind: 'content', scope: 'system', title: 'One Health ข้อใหม่จากคาบปีนี้ 40 ข้อ', desc: 'ข้อถูกผิดภาษาอังกฤษของ environmental health risks I และ II, GMO และ AMR กับช้อยส์ของ import risk assessment และการจัดการของเสียจากฟาร์ม ทุกข้อตรวจกับคลิปบันทึกคาบและสไลด์ปีนี้' },
    { kind: 'fix', scope: 'system', title: 'กลไกการดื้อยา fluoroquinolones', desc: 'ตัวเลือกที่ถูกบอกว่าการกลายพันธุ์บนโครโมโซมเปลี่ยน DNA gyrase ซึ่งเป็นเป้าหมายของยา ไม่ใช่ว่ายาจับ DNA ไม่ได้' },
  ],
};
