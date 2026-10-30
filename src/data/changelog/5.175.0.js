// Release 5.175.0. Fill in what a student notices (AGENTS.md Rule 2); kinds and scopes are listed in
// src/data/changelog.js. One file per release, so releases in flight never edit the same lines.
export default {
  version: '5.175.0',
  date: '2026-10-31',
  headline: 'One Health และ Zoonoses มีข้อสอบเก่าปลายภาคแล้ว',
  changes: [
    { kind: 'content', scope: 'system', title: 'ข้อสอบเก่าปลายภาค One Health 49 ข้อ', desc: 'ข้อที่รุ่นพี่บันทึกไว้หลังสอบปลายภาค ทั้ง AMR, environmental health, GMO, livestock waste และ risk analysis เฉลยตรวจกับสไลด์ปีนี้ ข้อที่สไลด์ปี 2569 ไม่มีเนื้อหานั้นบอกไว้ในที่มา' },
    { kind: 'content', scope: 'system', title: 'ข้อสอบเก่า Zoonoses 103 ข้อ', desc: 'ข้อจากหัวข้อที่ปีนี้สอบปลายภาค ทั้ง epidemiological approach, bacterial, mycoses, prion และ emerging zoonoses ตามรูปแบบเดิมของข้อสอบ รวมควิซออนไลน์และข้อจับคู่' },
    { kind: 'fix', scope: 'system', title: 'แก้เฉลยข้อเดิมใน One Health และ Zoonoses', desc: 'ระบบก๊าซชีวภาพที่บำบัดน้ำเสียได้ราว 70 ถึง 80 เปอร์เซ็นต์คือบ่อคลุม (covered lagoon) และรายงานสอบสวนโรคฉบับเบื้องต้นส่งภายใน 48 ชั่วโมง ส่วนควิซวิชา Food Safety ที่รุ่นพี่แปะไว้ย้ายเป็นข้ออิงแนวข้อสอบ' },
    { kind: 'fix', scope: 'system', title: 'Swine Medicine บอกรุ่นที่เคยออกครบขึ้น', desc: 'ข้อเขียนเรื่อง APP และรอยโรคของ Swine บอกครบทุกรุ่นที่เคยสอบ ทั้ง Vet 78, Vet 80 และ Vet 85' },
  ],
};
