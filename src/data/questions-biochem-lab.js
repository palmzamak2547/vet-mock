// ============================================================
// questions-biochem-lab.js — Biochemistry I (3102113) Lab past-paper
// ============================================================
// subject: biochem-1 · year 1 · id block 70000+
// Source: Biochemistry I Final Examination (Lab), Blackboard, 12 พ.ค. 2022
//         (CamScanner screenshots of the Blackboard test, answers
//          highlighted by the student who sat the exam).
// Faithful past-paper transcription. A couple of items legitimately have
// an "all-of-the-above"-style key — preserved for fidelity since they are
// the real exam answers (not authored distractors).
// ============================================================

export const QB_BIOCHEM_LAB = [
  // ── Chromatography (Q1-9, Final Lab 2022) ──────────────────
  { id: 70001, subject: 'biochem-1', topic: 'lab-chromatography', year: 1, type: 'mcq',
    q: 'ข้อใดกล่าวถูกต้องเกี่ยวกับ Chromatography',
    options: [
      'ใช้แยกสารด้วยคุณสมบัติของ stationary phase เท่านั้น',
      'ใช้แยกสารด้วยคุณสมบัติของ mobile phase เท่านั้น',
      'ใช้ในการวิเคราะห์เชิงคุณภาพได้เพียงอย่างเดียว',
      'ใช้ในการวิเคราะห์เชิงปริมาณได้เพียงอย่างเดียว',
      'ใช้แยกสารด้วยทั้ง stationary + mobile phase และวิเคราะห์ได้ทั้งเชิงคุณภาพและปริมาณ',
    ],
    answer: 4,
    explain: 'Chromatography แยกสารจากการกระจายตัวระหว่าง stationary phase และ mobile phase (ต้องอาศัยทั้งคู่) และใช้ได้ทั้งเชิงคุณภาพ (ระบุชนิดสาร) และเชิงปริมาณ (วัดปริมาณ) — ตัวเลือก A-D จึงถูกเพียงบางส่วน ข้อที่รวมครบจึงถูกที่สุด',
    source: 'Biochem Lab Final (Blackboard) 12 พ.ค. 2022',
    examOrigin: 'Biochemistry I 3102113 · Final Examination (Lab) 2022',
    verified: 'Blackboard final Q1 (เฉลยในไฟล์)' },

  { id: 70002, subject: 'biochem-1', topic: 'lab-chromatography', year: 1, type: 'mcq',
    q: 'Chromatography โดยทั่วไปใช้หลักการ (principle) ตามข้อใด',
    options: [
      'Adsorption (charge / affinity) เท่านั้น',
      'Partition (hydrophobic / hydrophilic) เท่านั้น',
      'Permeation (size exclusion) เท่านั้น',
      'ใช้ได้ทั้ง Adsorption, Partition และ Permeation',
    ],
    answer: 3,
    explain: 'หลักการของ chromatography มี 3 แบบ — Adsorption: charge/affinity (column, TLC, gas-solid C.) · Partition: hydrophobic/hydrophilic (paper, gas-liquid C.) · Permeation: size exclusion (gel permeation C.) จึงถูกทั้ง 3 หลักการ',
    source: 'Biochem Lab Final (Blackboard) 12 พ.ค. 2022',
    examOrigin: 'Biochemistry I 3102113 · Final Examination (Lab) 2022',
    verified: 'Blackboard final Q2 (เฉลยในไฟล์ · option D คัดมาแทนข้อที่อ่านไม่ชัด)' },

  { id: 70003, subject: 'biochem-1', topic: 'lab-chromatography', year: 1, type: 'mcq',
    q: 'Gel chromatography ใช้หลักการใดในการแยกสาร',
    options: ['Adsorption', 'Partition', 'Permeation (size exclusion)', 'Filtration', 'Affinity'],
    answer: 2,
    explain: 'Gel chromatography (gel filtration / gel permeation) แยกสารด้วย size exclusion — โมเลกุลใหญ่ผ่าน column ได้เร็วกว่า (ไม่เข้ารูเจล) โมเลกุลเล็กเข้ารูเจลจึงช้ากว่า = หลักการ Permeation',
    source: 'Biochem Lab Final (Blackboard) 12 พ.ค. 2022',
    examOrigin: 'Biochemistry I 3102113 · Final Examination (Lab) 2022',
    verified: 'Blackboard final Q3 (เฉลยในไฟล์)' },

  { id: 70004, subject: 'biochem-1', topic: 'lab-chromatography', year: 1, type: 'mcq',
    q: 'ข้อใด ไม่ถูกต้อง เกี่ยวกับ Gel chromatography',
    options: [
      'Gel คือ stationary phase',
      'Buffer คือ mobile phase',
      'โมเลกุลขนาดเล็กเคลื่อนที่ออกจาก column ได้เร็วที่สุด',
      'โมเลกุลขนาดใหญ่เคลื่อนที่ออกจาก column ได้เร็วที่สุด',
      'การแยกสารขึ้นกับขนาดโมเลกุล',
    ],
    answer: 2,
    explain: 'ใน gel filtration โมเลกุล "ใหญ่" ออกก่อน (เร็วกว่า) เพราะไม่เข้ารูเจล ส่วนโมเลกุลเล็กเข้าไปในรูเจลจึงออกช้า — ข้อที่ว่าโมเลกุลเล็กเร็วที่สุดจึงผิด',
    source: 'Biochem Lab Final (Blackboard) 12 พ.ค. 2022',
    examOrigin: 'Biochemistry I 3102113 · Final Examination (Lab) 2022',
    verified: 'Blackboard final Q4 (เฉลยในไฟล์)' },

  { id: 70005, subject: 'biochem-1', topic: 'lab-chromatography', year: 1, type: 'mcq',
    q: 'ข้อใดคือ stationary phase ที่ใช้ในการทดลองเรื่อง gel chromatography',
    options: ['Sephadex', 'Agarose', 'SDS-PAGE', 'Polyacrylamide', 'Starch'],
    answer: 0,
    explain: 'Sephadex (cross-linked dextran) เป็น stationary phase มาตรฐานของ gel filtration ในแล็บ — Agarose/Polyacrylamide ใช้เป็นเจลแยกใน electrophoresis ส่วน SDS-PAGE เป็นเทคนิค ไม่ใช่ stationary phase',
    source: 'Biochem Lab Final (Blackboard) 12 พ.ค. 2022',
    examOrigin: 'Biochemistry I 3102113 · Final Examination (Lab) 2022',
    verified: 'Blackboard final Q5 (เฉลยในไฟล์)' },

  { id: 70006, subject: 'biochem-1', topic: 'lab-chromatography', year: 1, type: 'mcq',
    q: 'ข้อใด ไม่เกี่ยวข้อง กับการแยกสารด้วยวิธี gel chromatography',
    options: [
      'การเลือกชนิดเจลให้เหมาะกับช่วงขนาดโมเลกุล',
      'ขนาดของสารที่ต้องการแยก',
      'ช่องว่าง/รูพรุนที่เกิดขึ้นในเนื้อเจล',
      'ความสามารถในการเคลื่อนที่ของสารด้วยประจุไฟฟ้า',
      'Fraction range ของเจล',
    ],
    answer: 3,
    explain: 'Gel chromatography แยกตาม "ขนาด" โมเลกุล ไม่เกี่ยวกับประจุไฟฟ้า — การเคลื่อนที่ตามประจุเป็นหลักการของ electrophoresis/ion-exchange ไม่ใช่ size exclusion',
    source: 'Biochem Lab Final (Blackboard) 12 พ.ค. 2022',
    examOrigin: 'Biochemistry I 3102113 · Final Examination (Lab) 2022',
    verified: 'Blackboard final Q6 (เฉลยในไฟล์)' },

  { id: 70007, subject: 'biochem-1', topic: 'lab-chromatography', year: 1, type: 'mcq',
    q: 'การทดสอบกรดอะมิโนด้วย Thin layer chromatography (TLC) สีที่เกิดบนแผ่นหลังพ่นน้ำยาและอบเกิดจากน้ำยาชนิดใด',
    options: ['Coomassie blue', 'Ninhydrin', 'Bromophenol blue', 'Crystal violet', 'MacConkey blue'],
    answer: 1,
    explain: 'Ninhydrin ทำปฏิกิริยากับหมู่ amino ของกรดอะมิโน ให้สีม่วง (Ruhemann’s purple) — วิธีในแล็บ: พ่น ninhydrin แล้วอบ 110°C ~10-15 นาที จุดสารจึงปรากฏสี',
    source: 'Biochem Lab Final (Blackboard) 12 พ.ค. 2022',
    examOrigin: 'Biochemistry I 3102113 · Final Examination (Lab) 2022',
    verified: 'Blackboard final Q7 (เฉลยในไฟล์)' },

  { id: 70008, subject: 'biochem-1', topic: 'lab-chromatography', year: 1, type: 'mcq',
    q: 'จากแผ่น TLC ที่รันสาร known A-E เทียบกับ unknown (Unk.) ท่านคิดว่า Unk. ประกอบด้วยสารชนิดใด (ตำแหน่งจุดตรงกับ known คู่ใด)',
    options: ['A และ C', 'B และ C', 'C และ D', 'D และ C', 'E และ C'],
    answer: 3,
    explain: 'อ่านจากแผ่น TLC: จุดของ unknown อยู่ระดับเดียวกับ (มี Rf ตรงกับ) จุดของ known D และ C จึงสรุปว่า Unk. ประกอบด้วยสารทั้งสองชนิดนั้น',
    source: 'Biochem Lab Final (Blackboard) 12 พ.ค. 2022',
    examOrigin: 'Biochemistry I 3102113 · Final Examination (Lab) 2022',
    verified: 'Blackboard final Q8 (เฉลยในไฟล์)' },

  { id: 70009, subject: 'biochem-1', topic: 'lab-chromatography', year: 1, type: 'mcq',
    q: 'เพื่อให้มีความแม่นยำในการระบุชนิดสารบนแผ่น TLC ควรใช้ค่าใดประกอบการพิจารณา',
    options: ['Rf value', 'Fraction range', 'Dilution factor', 'Buffer moving', 'Sample moving'],
    answer: 0,
    explain: 'Rf = ระยะที่สารเคลื่อนที่ ÷ ระยะที่ solvent front เคลื่อนที่ เป็นค่าคงที่เฉพาะสาร (ในระบบเดียวกัน) จึงใช้เทียบ unknown กับ known เพื่อระบุชนิดสารได้แม่นยำ',
    source: 'Biochem Lab Final (Blackboard) 12 พ.ค. 2022',
    examOrigin: 'Biochemistry I 3102113 · Final Examination (Lab) 2022',
    verified: 'Blackboard final Q9 (เฉลยในไฟล์)' },
];
