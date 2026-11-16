// Release 5.279.0. Fill in what a student notices (AGENTS.md Rule 2); kinds and scopes are listed in
// src/data/changelog.js. One file per release, so releases in flight never edit the same lines.
export default {
  version: '5.279.0',
  date: '2026-11-16',
  headline: 'โน้ต Epidemiology บอกหกจุดที่ตำราเขียนต่างจากสไลด์ และเฉลยที่ค้างอยู่ได้ข้อสรุป',
  changes: [
    { kind: 'content', scope: 'multi', title: 'Epidemiology: หกจุดที่ตำราเขียนต่างจากสไลด์', desc: 'โน้ตเรื่อง kappa, proportional mortality, accept H0, least squares, elimination กับ eradication และตัวเลขไข้หวัดนกปี 2547 มีกล่องบอกว่าแหล่งอ้างอิงเขียนไว้อย่างไร พร้อมชื่อแหล่ง และวิธีตอบในข้อสอบ' },
    { kind: 'fix', scope: 'multi', title: 'ค่า kappa ในโจทย์ตรงกับตาราง', desc: 'โจทย์ atrophic rhinitis ของ Epidemiology ให้ kappa = 0.456 ตามที่คำนวณจากสี่ช่องในตาราง (เดิมเขียน 0.460) และหน้าสรุปก่อนสอบแก้ตาม' },
    { kind: 'fix', scope: 'multi', title: 'คำอธิบายเฉลยสองข้อแม่นขึ้น', desc: 'phenol coefficient (Milk and Meat Hygiene) อธิบายว่าหารเลขการเจือจาง ไม่ใช่ความเข้มข้น และการเคลื่อนของอัณฑะลูกม้า (Equine Reproduction) ใช้ช่วง 30 วันก่อนคลอดถึง 10 วันหลังคลอด' },
    { kind: 'content', scope: 'multi', title: 'Food Industry: ข้อสัตว์น้ำ 12 ข้อย้ายเป็นเนื้อหาในคาบ', desc: 'ข้อสัตว์น้ำ 12 ข้อที่เขียนจากจุดไฮไลต์บนเอกสารที่รุ่นพี่บันทึกว่าปีนั้นไม่ได้สอบ ไม่ติดป้ายอิงแนวข้อสอบแล้ว ยังฝึกได้ในหัวข้อเดิม แต่ไม่อยู่ใน Panic Mode' },
    { kind: 'fix', scope: 'multi', title: 'สองข้อที่ปิดไว้ถูกถอดออก', desc: 'ข้อพยาธิสภาพของไต (Livestock Pathology) ที่ไม่มีตัวเลือกใดถูกจริง และข้อน้ำนมพาสเจอร์ไรส์ที่ซ้ำกับอีกข้อแต่เฉลยตรงข้าม ถูกถอดออกจากคลังข้อสอบ' },
  ],
};
