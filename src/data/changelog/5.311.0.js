// Release 5.311.0. Fill in what a student notices (AGENTS.md Rule 2); kinds and scopes are listed in
// src/data/changelog.js. One file per release, so releases in flight never edit the same lines.
export default {
  version: '5.311.0',
  date: '2026-11-25',
  headline: 'แก้คำอธิบาย Zoonoses และ Aquatic 7 ข้อ',
  changes: [
    { kind: 'fix', scope: 'system', title: 'ข้อ prion และ Coccidioides', desc: 'ข้อ vCJD บอกว่าระยะฟักตัวยังไม่ทราบแน่ชัด ประมาณไว้ราว 10 ปี median age at death 28 ปี และระยะเวลาป่วยราว 14 เดือน ข้อการวินิจฉัยโรค prion เพิ่ม IHC, western blot และ RT-QuIC ข้อ Coccidioides บอกว่า San Joaquin Valley อยู่ในรัฐแคลิฟอร์เนีย สหรัฐอเมริกา' },
    { kind: 'fix', scope: 'system', title: 'Aquatic ข้อกฎหมายและหน่วยงาน', desc: 'ข้อจำนวนโรคระบาดในสัตว์น้ำถามตามประกาศฉบับที่ 4 ปี 2563 ซึ่งหมวด ฉ. มี 42 โรค คำตอบจึงเป็น 42 โรค ส่วนข้อ WOAH การรับรองมาตรฐานของ มกอช. และหน่วยงานที่ควบคุมคุณภาพอาหารสัตว์ คำตอบคงเดิม คำอธิบายบอกเหตุผลครบขึ้น' },
  ],
};
