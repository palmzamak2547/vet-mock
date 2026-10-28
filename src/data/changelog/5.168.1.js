// Release 5.168.1. Fill in what a student notices (AGENTS.md Rule 2); kinds and scopes are listed in
// src/data/changelog.js. One file per release, so releases in flight never edit the same lines.
export default {
  version: '5.168.1',
  date: '2026-10-28',
  headline: 'หัวข้อปลายภาคตรงกับตารางสอนปีนี้',
  changes: [
    { kind: 'fix', scope: 'system', title: 'Equine Med ปลายภาคฝึกได้ทุกหัวข้อ', desc: 'ชุดฝึกปลายภาคของอายุรศาสตร์และศัลยศาสตร์ม้ารวมหัวข้อที่สอบกลางภาคไปแล้ว ตามที่ส่วน POA ของปลายภาคดึงได้ทุกหัวข้อ และมีหัวข้อใหม่ Dermatology, Concept of surgery and wound management และ Exercise related disease' },
    { kind: 'fix', scope: 'system', title: 'Swine Medicine จัดหัวข้อตามตารางสอนปีนี้', desc: 'หัวข้อปลายภาคแสดงอาจารย์ผู้สอนตรงตามตาราง และมีหัวข้อใหม่ Reproductive diseases, การควบคุมโรคระบาดและแนวทางวินิจฉัย และ Pseudorabies, Nipah, JE ส่วนโรคทางเดินอาหารจากไวรัสกับระบบประสาทอยู่ในกลางภาค' },
    { kind: 'fix', scope: 'system', title: 'สองหัวข้อที่เคยซ่อนกลับมาให้ฝึก', desc: 'หัวข้อสัตว์น้ำและผลิตภัณฑ์ของ FIQC และหัวข้อ Trypanosomiasis, trichinosis และหนอนพยาธิของ Swine Medicine อยู่ในชุดฝึกปลายภาคแล้ว' },
    { kind: 'fix', scope: 'system', title: 'Zoonoses กลางภาคกับปลายภาคแยกชัดขึ้น', desc: 'หัวข้อ Protozoal zoonoses และ Emerging virus อยู่ในชุดกลางภาคอย่างเดียวตามประมวลรายวิชาปีนี้' },
  ],
};
