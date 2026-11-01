// Release 5.176.0. Fill in what a student notices (AGENTS.md Rule 2); kinds and scopes are listed in
// src/data/changelog.js. One file per release, so releases in flight never edit the same lines.
export default {
  version: '5.176.0',
  date: '2026-11-01',
  headline: 'Aquatic, Milk & Meat และ Avian มีข้อสอบเก่าปลายภาคแล้ว',
  changes: [
    { kind: 'content', scope: 'system', title: 'ข้อสอบเก่าปลายภาค Aquatic 106 ข้อ', desc: 'คลังข้อสอบพาร์ทหน่วยงานและองค์กรของ Vet 84 และ Vet 85 ภาพหน้าจอข้อสอบปลายภาคออนไลน์ และควิซของ Vet 83 ตามรูปแบบเดิม ข้อที่มีภาพแนบภาพจริงจากควิซ' },
    { kind: 'content', scope: 'system', title: 'ข้อสอบเก่าปลายภาค Milk & Meat 149 ข้อ', desc: 'ข้อเรื่องเนื้อและการทำความสะอาดในโรงรับนม จากควิซออนไลน์ ข้อที่รุ่นพี่จำได้ และสรุปปลายภาคของ Vet 85 ข้อที่รุ่นก่อนสอบตอนกลางภาคแต่ปีนี้อยู่ปลายภาคบอกไว้ในที่มา' },
    { kind: 'content', scope: 'system', title: 'ข้อสอบเก่าปลายภาค Avian 62 ข้อ', desc: 'จากบันทึกข้อสอบของ Vet 81 และปลายภาคของ Vet 84, Vet 85 ในหัวข้อเป็ด ห่าน ORT Campylobacter เชื้อรา วัคซีนและ serology ข้อที่ไม่มีตัวเลือกบันทึกไว้บอกในที่มาว่าตัวเลือกเรียบเรียงจากสไลด์' },
    { kind: 'fix', scope: 'system', title: 'Equine Repro บอกรุ่นที่สอบตรงตามบันทึก', desc: 'ข้อจากบันทึกปลายภาค 60 ข้อบอกรุ่นที่สอบตามบันทึกจริง ข้อเรื่องการตั้งท้อง 3 ข้อย้ายไปอยู่ปลายภาคตามที่สอนปีนี้ และเพิ่มข้อสอบเก่าอีก 5 ข้อ' },
    { kind: 'fix', scope: 'system', title: 'Aquatic ข้อเดิมบอกรุ่นที่เคยออกครบขึ้น', desc: 'ข้อในคลังเดิม 14 ข้อบอกรุ่นที่เคยสอบตามบันทึก ส่วนข้อที่รุ่นพี่บันทึกแค่ว่าออกคล้ายกันย้ายไปเป็นข้ออิงแนวข้อสอบ' },
  ],
};
