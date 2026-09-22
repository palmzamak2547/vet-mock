// ============================================================
// source-conflicts.js — where a senior compilation and the recording disagree
// ============================================================
// A compilation is read page by page during an ingest, and the recording of
// the cohort's own lecture settles what was taught. When the two disagree the
// finding used to live only as prose in AGENTS.md, so nothing stopped a later
// question from teaching the side that was already found to be wrong.
//
// Each entry records one disagreement:
//   id        stable slug
//   subject   the subject id the claim belongs to (curriculum.js)
//   claim     what is in dispute
//   sourceA   { ref, says } — the compilation, by page
//   sourceB   { ref, says } — the recording, by "<videoId> [mm:ss]"
//   verdict   which side a question may teach, and why
//   evidence  how the reading was checked
//   rejected  groups of patterns; a question whose key, explanation or model
//             answer matches every pattern of any one group states the
//             rejected side. scripts/report-source-conflicts.mjs reads them.
//
// This is not src/lib/vetwiki/corrections.js, which is keyed by wiki section
// and records lecture against published literature.
// ============================================================

const EQUINE_REPRO_COMPILATION = 'Equine Repro Mid 86 (ฉบับอัปเกรด)';

export const SOURCE_CONFLICTS = [
  {
    id: 'eqrepro-breeding-season-months',
    subject: 'equine-repro',
    claim: 'ช่วงเดือนของฤดูผสมพันธุ์ (breeding season) ของม้า',
    sourceA: {
      ref: `${EQUINE_REPRO_COMPILATION} หน้า 8 และ 10`,
      says: 'ป้ายในแผนภูมิวงกลมหน้า 8 เขียน breeding season ก.พ. - เม.ย. แต่ลายมือผู้เขียนคนเดียวกันในหน้าเดียวกันเขียน กุมภา-ตุลา และหน้า 10 เขียน breeding season Feb-Oct',
    },
    sourceB: {
      ref: '5MGooHx0w7w [50:06], [55:28]',
      says: 'สอนเป็นหลักการของความยาวแสงในม้าที่เป็น long day breeder และบอกว่าในไทยฤดูยาวกว่าเขตหนาว โดยไม่ให้ช่วงเดือนตายตัว',
    },
    verdict: 'แฟ้มขัดกันเองและคลิปไม่ได้ให้ช่วงเดือน จึงไม่มีช่วงเดือนที่ยืนยันได้ ข้อสอบถามได้เฉพาะหลักการของแสงและ melatonin ห้ามตั้งช่วงเดือนเป็นคีย์หรือเขียนในคำอธิบาย',
    evidence: 'ครอป 12 เท่าของป้ายในวงกลมหน้า 8 อ่านได้ ก.พ. - เม.ย.; ครอปวงเล็บสีม่วงหน้า 10 อ่านได้ Feb-Oct; ตรวจระหว่าง ingest ของ equine-repro วันที่ 22-23 ก.ย. 2026',
    rejected: [
      [/breeding season|ฤดู(?:กาล)?ผสม/i, /ก\.?\s?พ\.?\s*(?:-|–|ถึง)\s*(?:เม\.?\s?ย|ต\.?\s?ค)|กุมภา\S*\s*(?:-|–|ถึง)\s*(?:เมษา|ตุลา)|feb\S*\s*(?:-|–|to)\s*(?:apr|oct)/i],
    ],
  },
  {
    id: 'eqrepro-foley-flush-way',
    subject: 'equine-repro',
    claim: 'ชนิดของสาย Foley ที่ใช้ flush มดลูกเก็บตัวอ่อน',
    sourceA: {
      ref: `${EQUINE_REPRO_COMPILATION} หน้า 17`,
      says: 'Foley catheter ต่อกับ 3-way พองบอลลูน เติมน้ำ แล้วหมุน 3-way ให้น้ำไหลลงถ้วยกรองตัวอ่อน',
    },
    sourceB: {
      ref: 'FBNU52oH1z8 [71:29]',
      says: 'ใส่ Foley catheter แบบ two-way ปล่อยน้ำเข้ามดลูก ปิด clamp ด้านบน แล้วเปิดทางออกให้น้ำไหลลงถ้วยที่มี filter',
    },
    verdict: 'ใช้ตามคลิป: Foley แบบ two-way ร่วมกับการปิด clamp ไม่ใช่ 3-way',
    evidence: 'ขั้นตอนในคลิปตรงกับ Part 16 ของสรุปคลิป FBNU52oH1z8; ตรวจระหว่าง ingest ของ equine-repro วันที่ 22-23 ก.ย. 2026',
    rejected: [
      [/foley/i, /3\s*-?\s*way|three[\s-]?way|3\s*ทาง|สามทาง/i],
    ],
  },
  {
    id: 'eqrepro-opu-needle-gauge',
    subject: 'equine-repro',
    claim: 'เข็มที่ใช้ทำ ovum pick-up (OPU) ในม้า',
    sourceA: {
      ref: `${EQUINE_REPRO_COMPILATION} หน้า 17`,
      says: 'ใช้เข็มเล็กมาก (12G)',
    },
    sourceB: {
      ref: 'FBNU52oH1z8 [74:24]',
      says: 'โอโอไซต์ม้ายึดผนัง follicle แน่น ต้องดูดสลับกับ flush ราว 10 รอบต่อ follicle โดยไม่ได้ระบุเบอร์เข็ม',
    },
    verdict: 'ข้อความในแฟ้มขัดกันเอง: 12G เป็นเข็มรูใหญ่ ไม่ใช่เข็มเล็ก และคลิปไม่ได้ระบุเบอร์เข็ม ห้ามเรียก 12G ว่าเข็มเล็ก และไม่ควรตั้งเบอร์เข็มเป็นคีย์',
    evidence: 'ครอป 4 เท่าของบรรทัดนั้นยืนยันข้อความ; ข้อ 207492 สอนกลไกการดูดสลับ flush ไว้แล้วโดยไม่มีเบอร์เข็ม',
    rejected: [
      [/12\s*-?\s*(?:G\b|gauge|เกจ)|เบอร์\s*12(?!\d)/i, /เล็ก|small|fine|narrow/i],
    ],
  },
  {
    id: 'eqrepro-misoprostol-dose-unit',
    subject: 'equine-repro',
    claim: 'ขนาดยา PGE (misoprostol, Cytotec) ที่ infuse เข้ามดลูกเพื่อแก้ท่อนำไข่อุดตัน',
    sourceA: {
      ref: `${EQUINE_REPRO_COMPILATION} หน้า 18`,
      says: 'PGE (Cytotec) 1 เม็ด 300 mg ละลายน้ำเกลือ',
    },
    sourceB: {
      ref: 'zFsNom4JMC8 [41:45]',
      says: 'อธิบายกลไกว่า infuse เข้ามดลูกแล้วยาซึมไปถึง UTJ ทำให้ขยายจนของเหลวที่ค้างไหลออกได้ โดยไม่ได้ระบุขนาดยา',
    },
    verdict: 'misoprostol เป็นยาขนาดไมโครกรัม เม็ดขนาด 300 mg จึงไม่สมเหตุสมผล ห้ามใช้ตัวเลขนี้หรือระบุขนาดเป็นมิลลิกรัม กลไกการ infuse ตรงกับคลิปและสอนได้',
    evidence: 'ครอป 3 เท่าของบรรทัดนั้นอ่านได้ 1 เม็ด 300 mg จริง; ข้อ 105532 และ 207491 สอนเรื่องนี้ไว้แล้วโดยไม่มีตัวเลข',
    rejected: [
      [/misoprostol|cytotec|ไซโตเทค/i, /\d\s*mg\b|มิลลิกรัม/i],
    ],
  },
];
