// Release 5.186.0. Fill in what a student notices (AGENTS.md Rule 2); kinds and scopes are listed in
// src/data/changelog.js. One file per release, so releases in flight never edit the same lines.
export default {
  version: '5.186.0',
  date: '2026-11-02',
  headline: 'การ์ด Panic Mode ของ Epidemiology และหัวข้อ Avian กับ Equine Repro ตามตารางเรียนปีนี้',
  changes: [
    { kind: 'feature', scope: 'system', title: 'การ์ด Panic Mode ของ Epidemiology', desc: 'หน้าวิชา Epidemiology ปี 5 มีการ์ด Panic Mode ของปลายภาคแล้ว เหมือนอีก 9 วิชา กดแล้วได้ชุดข้อสอบเก่าและข้ออิงแนวข้อสอบของวิชานี้' },
    { kind: 'fix', scope: 'system', title: 'Avian: ข้อที่เคยกองอยู่ในหัวข้อ Intro ไปอยู่หัวข้อของโรคแล้ว', desc: '78 ข้อย้ายไปหัวข้อตามเนื้อหา ข้อเรื่องโรคเป็ด ORT Campylobacter เชื้อรา และ serology อยู่ในชุดปลายภาค ส่วนหัวข้อ Intro ที่สอนก่อนกลางภาคไม่อยู่ในชุดปลายภาคแล้ว สรุปของรุ่นพี่ก็แยกไปตามหัวข้อโรคเช่นกัน' },
    { kind: 'fix', scope: 'system', title: 'Equine Repro: โรคติดเชื้อในแม่ม้าแยกจากโรคติดเชื้อในพ่อม้า', desc: 'โรคติดเชื้อในแม่ม้าสอนก่อนกลางภาค มีหัวข้อของตัวเองแล้ว ส่วนโรคติดเชื้อในพ่อม้าที่สอนหลังกลางภาคอยู่ในชุดปลายภาค' },
    { kind: 'fix', scope: 'system', title: 'POA มีชื่ออาจารย์ครบทุกหัวข้อ', desc: 'ตามประมวลรายวิชา 3107522 ปีการศึกษา 2569' },
  ],
};
