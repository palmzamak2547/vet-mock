// Release 5.195.0. Fill in what a student notices (AGENTS.md Rule 2); kinds and scopes are listed in
// src/data/changelog.js. One file per release, so releases in flight never edit the same lines.
export default {
  version: '5.195.0',
  date: '2026-11-09',
  headline: 'Epidemiology ปลายภาค: 206 ข้อจากจุดที่รุ่นพี่มาร์คไว้ ขึ้นใน Panic Mode แล้ว',
  changes: [
    { kind: 'feature', scope: 'system', title: 'Epidemiology ปลายภาค เพิ่ม 189 ข้อจากจุดที่รุ่นพี่มาร์คไว้', desc: 'หนึ่งข้อต่อหนึ่งจุดที่รุ่นพี่ Vet 84 และ Vet 85 ขีดเส้นแดง ติดดาว หรือไฮไลต์ไว้ และคลังยังไม่มีข้อถาม ครบทุกหัวข้อของปลายภาค ทุกข้อตรวจกับสไลด์ปี 2569 ติดป้ายอิงแนวข้อสอบ และคำตอบตรวจซ้ำแบบไม่เห็นเฉลยตรงกันครบ 182 ข้อ ข้อคำนวณทุกข้อคิดซ้ำแล้ว' },
    { kind: 'feature', scope: 'system', title: 'Epidemiology: 17 ข้อของหัวข้อนโยบาย FMD, แผนลัมปีสกิน และ PPP', desc: 'จากจุดที่รุ่นพี่มาร์คในสไลด์ของหัวข้อเหล่านี้ ซึ่งเป็นเนื้อหาที่ไม่มีสอบแยก อยู่ในหัวข้อของตัวเอง' },
    { kind: 'fix', scope: 'system', title: 'Epidemiology: ข้อเดิมอีก 18 ข้อที่ถามจุดที่รุ่นพี่มาร์คไว้ขึ้นใน Panic Mode แล้ว', desc: 'เช่นการคำนวณ sensitivity, specificity, PPV และ case fatality rate รวมกับข้อใหม่ Panic Mode ปลายภาคของ Epidemiology จาก 73 เป็น 280 ข้อ' },
  ],
};
