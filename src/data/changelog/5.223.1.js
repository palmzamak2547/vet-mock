// Release 5.223.1. Fill in what a student notices (AGENTS.md Rule 2); kinds and scopes are listed in
// src/data/changelog.js. One file per release, so releases in flight never edit the same lines.
export default {
  version: '5.223.1',
  date: '2026-11-15',
  headline: 'Wrap-up Zoonoses มีรายการโรค bacterial zoonoses พร้อมหน้าในเดค และคำอธิบายข้อ Swine, Zoonoses, Aquatic ตรงกับเนื้อหาปีนี้มากขึ้น',
  changes: [
    { kind: 'feature', scope: 'system', title: 'Wrap-up Zoonoses: รายการโรค bacterial zoonoses', desc: '14 โรคของคาบ 30 ต.ค. และ 6 พ.ย. ตั้งแต่ anthrax ถึง psittacosis พร้อมหน้าที่อยู่ในเดคปีนี้ ส่วนนี้ยังไม่มีสรุปเป็นข้อ อ่านจากเดคตามหน้าและฝึกจากข้อสอบเก่าของหัวข้อนี้' },
    { kind: 'fix', scope: 'system', title: 'Swine: MMA และ PRRS', desc: 'คำตอบตัวอย่างเรื่องเวลาเกิด MMA ใช้ช่วงที่เดคปีนี้ระบุ (1-2 วันจนถึงสัปดาห์แรกหลังคลอด) และคำอธิบายสองข้อของ PRRS บอกว่าการแท้งเกิดได้ทุกระยะตามที่สอนในคาบ 9 ต.ค.' },
    { kind: 'fix', scope: 'system', title: 'Zoonoses: ลำดับขั้นการสอบสวนการระบาด', desc: 'ข้อที่ถามขั้นตอนการสอบสวนการระบาดมีหมายเหตุว่าเดคอีกชุดของปีนี้เรียงขั้นต่างออกไป เฉลยยังเป็นตามรายการ 10 ขั้นที่โจทย์อ้าง' },
    { kind: 'fix', scope: 'system', title: 'Aquatic: มาตรฐานฟาร์มกุ้งและ rinderpest', desc: 'คำอธิบายเรื่องมาตรฐานฟาร์มผลิตลูกกุ้งระบุว่าครอบคลุมถึงระยะ nauplius เท่านั้น และข้อ rinderpest ไม่อ้างว่าสัตวแพทย์เป็นผู้ริเริ่มแล้ว เพราะเนื้อหาปีนี้ไม่ได้ระบุ' },
  ],
};
