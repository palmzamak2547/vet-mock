// ============================================================
// Provenance vocabulary: what `sourceType` and `examOrigin` may say
// ============================================================
// Two fields answer two different questions (AGENTS.md, 2026-09-22):
//   sourceType  HOW a question reached us
//   examOrigin  WHOSE paper it sat on, when it sat on one
//
// Both were free text. Whether a row counts as a sat paper, which decides the
// "ฝึกเฉพาะข้อสอบเก่า" counts and Panic Mode's order, came from a regex reading
// the origin's wording, and it misread in both directions: "Swine Medicine
// midterm study notes" counts as a paper because it says "midterm", while
// "Swine Medicine ไฟนอล Vet 85 บันทึกหลังสอบ" did not, so rows recalled after
// a real paper sat in band 2 where Panic Mode never shows them.
//
// EXAM_ORIGINS files every exact examOrigin string in the bank once, by a
// person, as one of four kinds:
//   paper       a paper a cohort sat, or a recall of one. `cohort` and `paper`
//               say which, where the string itself says so, else null.
//   aligned     written from exam guidance a cohort marked in a compilation
//               ("อิงแนวข้อสอบ", "แนวข้อสอบที่รุ่นพี่บันทึกไว้", a margin note
//               calling a point a recurring exam item). Not a paper.
//   source-doc  names the document the question was written from: study
//               notes, a summary, slides, a station prep sheet. Not a paper.
//   mock        a practice mock.
// The strings themselves are stored evidence and are never rewritten to fit
// this map; a new string gets a new entry. scripts/lint-provenance.mjs fails
// on an origin missing from here.
//
// isPastPaperQuestion does NOT read this map yet. Switching typed rows from
// the regex to `kind === 'paper'` changes band 0 for real students, so it
// waits until the 2569 midterms are over, and lint-provenance prints the
// exact rows that switch would move. Until then, a row whose origin is filed
// here as `paper` or `aligned` but that the predicate leaves in band 2 carries
// the "อิงแนวข้อสอบ" tag: it under-claims into band 1 rather than over-claim
// a paper. When the switch lands, remove that tag from the rows it lifts to
// band 0, or they become both a paper and aligned, which the lint refuses.
//
// Entries on legacy rows with no sourceType mirror what the regex already
// reads for them; their documents were not re-read in this pass, and the
// switch above does not touch those rows.
// ============================================================

/** Every value `sourceType` may take, and what it claims. */
export const SOURCE_TYPES = Object.freeze({
  'past-paper': 'transcribed from a paper a cohort sat',
  'student-compilation': 'reached us through a senior compilation; examOrigin says whether it sat a paper',
  'exam-aligned': 'written from what a compilation marked as exam material; never a paper, always carries อิงแนวข้อสอบ',
  'lecture-derived': 'written from a recording, a lecture or study notes; never a paper',
  lecture: 'written from the lecture slides (older banks)',
  'lecture-verified-draft': 'drafted from this year\'s lecture material and checked against it',
  practice: 'practice items written from the course material',
});

export const ORIGIN_KINDS = Object.freeze(['paper', 'aligned', 'source-doc', 'mock']);
export const PAPER_KINDS = Object.freeze(['midterm', 'final', 'quiz', 'osce', 'station']);

export const EXAM_ORIGINS = Object.freeze({
  // ── paper: A paper a cohort sat, or a recall of one ──
  // rows that carry a sourceType
  "ข้อเขียนที่รุ่นพี่ Vet 85 บันทึกว่าเคยออกในข้อสอบกลางภาค Avian Medicine": { kind: 'paper', cohort: 85, paper: 'midterm' },
  "ข้อสอบวิชา One Health in Veterinary Public Health ที่รุ่นก่อนหน้าบันทึกภาพไว้": { kind: 'paper', cohort: null, paper: null },
  "บันทึกหลังสอบสถานี POA วิชาอายุรศาสตร์และศัลยศาสตร์ม้า (Vet 85)": { kind: 'paper', cohort: 85, paper: 'station' },
  "Aj. Ekasingh Vet 84-86 Final": { kind: 'paper', cohort: [84, 85, 86], paper: 'final' },
  "Aj. Ekasingh Vet 84 Final": { kind: 'paper', cohort: 84, paper: 'final' },
  "Aj. Kamonpan Avian Zoonosis L10-11": { kind: 'paper', cohort: null, paper: null },
  "Aj. Mintra FIQC Vet 83 Midterm": { kind: 'paper', cohort: 83, paper: 'midterm' },
  "Aj. Mintra FIQC Vet 84 Midterm": { kind: 'paper', cohort: 84, paper: 'midterm' },
  "Aj. Mintra FIQC Vet 85 Midterm": { kind: 'paper', cohort: 85, paper: 'midterm' },
  "Aj. Nakcha (ณทยา) Vet 83 Final": { kind: 'paper', cohort: 83, paper: 'final' },
  "Aj. Niwat Avian Drug L14": { kind: 'paper', cohort: null, paper: null },
  "Aj. Niwat Avian Drug L14 (essay style)": { kind: 'paper', cohort: null, paper: null },
  "Aj. Sirawit FIQC Vet 85 Midterm": { kind: 'paper', cohort: 85, paper: 'midterm' },
  "Aj. Sirawit One Health Vet 85 Midterm": { kind: 'paper', cohort: 85, paper: 'midterm' },
  "Aj. Somsak Vet 83 Final": { kind: 'paper', cohort: 83, paper: 'final' },
  "Aj. zoonosis Vet 83 Final": { kind: 'paper', cohort: 83, paper: 'final' },
  "Aquatic Med 3107520 คลังข้อสอบพาร์ทหน่วยงานและองค์กร (Vet 84)": { kind: 'paper', cohort: 84, paper: null },
  "Aquatic Med 3107520 คลังข้อสอบพาร์ทหน่วยงานและองค์กร (Vet 84 และ Vet 85)": { kind: 'paper', cohort: [84, 85], paper: null },
  "Aquatic Med 3107520 คลังข้อสอบพาร์ทหน่วยงานและองค์กร (Vet 85)": { kind: 'paper', cohort: 85, paper: null },
  "Avian Medicine final recall (Vet 85 compilation)": { kind: 'paper', cohort: 85, paper: 'final' },
  "Avian Medicine matching set, senior compilation marked Final (อ.ณทยา)": { kind: 'paper', cohort: null, paper: 'final' },
  "Avian Medicine Y5 midterm matching recall (Vet 85)": { kind: 'paper', cohort: 85, paper: 'midterm' },
  "Clinical Problem Solving (Companion Animal) Y5 midterm paper (Vet 85)": { kind: 'paper', cohort: 85, paper: 'midterm' },
  "Equine dentistry online test (Vet 81)": { kind: 'paper', cohort: 81, paper: 'quiz' },
  "Equine Med final recall (Vet 85)": { kind: 'paper', cohort: 85, paper: 'final' },
  "Equine Med midterm recall (Vet 85)": { kind: 'paper', cohort: 85, paper: 'midterm' },
  "Equine Med Parasitology quiz recall (Vet 81)": { kind: 'paper', cohort: 81, paper: 'quiz' },
  "Equine Reproduction กลางภาค Vet 85": { kind: 'paper', cohort: 85, paper: 'midterm' },
  "Equine reproduction final exam recall (Vet 85)": { kind: 'paper', cohort: 85, paper: 'final' },
  "Equine Reproduction midterm recall (Vet 85)": { kind: 'paper', cohort: 85, paper: 'midterm' },
  "Equine Reproduction midterm (Vet 85)": { kind: 'paper', cohort: 85, paper: 'midterm' },
  "Equine Repro mid-term recall (Vet 85)": { kind: 'paper', cohort: 85, paper: 'midterm' },
  "Equine Repro (Vet 85) recalled exam point": { kind: 'paper', cohort: 85, paper: null },
  "Equine Repro (Vet 85) reconstructed case set": { kind: 'paper', cohort: 85, paper: null },
  "FIQC final recall (Vet 85)": { kind: 'paper', cohort: 85, paper: 'final' },
  "Milk Hygiene mid-term recall (Vet 85)": { kind: 'paper', cohort: 85, paper: 'midterm' },
  "Milk Hygiene mid-term recall (Vet 85, recurring topic)": { kind: 'paper', cohort: 85, paper: 'midterm' },
  "Milk Hygiene mid-term recall (Vet 86 compilation)": { kind: 'paper', cohort: null, paper: 'midterm' },
  "Rum Hygiene midterm (ข้อสอบจริงมีคะแนนกำกับรายข้อ)": { kind: 'paper', cohort: null, paper: 'midterm' },
  "Swine Medicine ไฟนอล Vet 85 บันทึกหลังสอบ ชุดข้อเขียนที่ 1": { kind: 'paper', cohort: 85, paper: 'final' },
  "Swine Medicine ไฟนอล Vet 85 บันทึกหลังสอบ ชุดข้อเขียนที่ 2 ไม่มีเฉลย": { kind: 'paper', cohort: 85, paper: 'final' },
  "Swine Medicine midterm essay recall (Vet 85)": { kind: 'paper', cohort: 85, paper: 'midterm' },
  "Swine Medicine midterm, typed paper reproduced (Vet 85)": { kind: 'paper', cohort: 85, paper: 'midterm' },
  "Vet Prac Rum 2023 (Vet 83)": { kind: 'paper', cohort: 83, paper: null },
  "Vet Prac Rum Final 2025 (Vet 85)": { kind: 'paper', cohort: 85, paper: 'final' },
  "Zoonoses midterm recall (Vet 85)": { kind: 'paper', cohort: 85, paper: 'midterm' },
  "Zoonoses (Vet 85) recalled choice section": { kind: 'paper', cohort: 85, paper: null },
  "Zoonoses (Vet 85) recalled item noted on the coronaviruses slide": { kind: 'paper', cohort: 85, paper: null },
  "Zoonoses (Vet 85) recalled matching section": { kind: 'paper', cohort: 85, paper: null },
  "Zoonoses (Vet 85) recalled short-answer section": { kind: 'paper', cohort: 85, paper: null },
  // legacy rows with no sourceType
  "Biochemistry I 3102113 · Final Examination (Lab) 2022": { kind: 'paper', cohort: null, paper: 'final' },
  "Biochemistry I 3102113 · Lab Midterm 2022": { kind: 'paper', cohort: null, paper: 'midterm' },
  "Biochemistry I 3102113 · Lecture exam recall": { kind: 'paper', cohort: null, paper: null },
  "Biochemistry I 3102113 · Lecture Final 2022": { kind: 'paper', cohort: null, paper: 'final' },
  "COM I Final 86": { kind: 'paper', cohort: 86, paper: 'final' },
  "COM II Final 86": { kind: 'paper', cohort: 86, paper: 'final' },
  "COM III Final 2019 (Special Prep)": { kind: 'paper', cohort: null, paper: 'final' },
  "COM III Final 86": { kind: 'paper', cohort: 86, paper: 'final' },
  "COM II Midterm": { kind: 'paper', cohort: null, paper: 'midterm' },
  "Food Safety Final 86": { kind: 'paper', cohort: 86, paper: 'final' },
  "Food Safety Mid 86": { kind: 'paper', cohort: 86, paper: 'midterm' },
  "HHM Ruminant Final TJ86": { kind: 'paper', cohort: 86, paper: 'final' },
  "HHM Ruminant Final TJ86 (Clinical Fluid Therapy in Cattle)": { kind: 'paper', cohort: 86, paper: 'final' },
  "HHM Ruminant Final TJ86 (Piyanat Prasomsri)": { kind: 'paper', cohort: 86, paper: 'final' },
  "HHM Ruminant Final TJ86 (Responsible Antimicrobial Selection)": { kind: 'paper', cohort: 86, paper: 'final' },
  "HHM Ruminant Final TJ86 (Saranporn Poothong)": { kind: 'paper', cohort: 86, paper: 'final' },
  "HHM Ruminant Final TJ86 (Sirirat Wataradee)": { kind: 'paper', cohort: 86, paper: 'final' },
  "HHM Ruminant Final TJ86 (Sirirat Wataradee Part III)": { kind: 'paper', cohort: 86, paper: 'final' },
  "HHM Ruminant Final TJ86 (Thanasak Boonserm)": { kind: 'paper', cohort: 86, paper: 'final' },
  "HHM Ruminant Mid (อาจารย์ชัยเดช)": { kind: 'paper', cohort: null, paper: 'midterm' },
  "HHM Ruminant Mid (อาจารย์ธีรวัฒน์)": { kind: 'paper', cohort: null, paper: 'midterm' },
  "OSCE 26 May 2023 · course 3108517 ฐานสูติกรรม I": { kind: 'paper', cohort: null, paper: 'osce' },
  "OSCE MED past paper · author ปิงปิง · vision-OCR extracted (Phase 3 PoC 2026-05-12)": { kind: 'paper', cohort: null, paper: 'osce' },
  "Past Exam 2021, Part III": { kind: 'paper', cohort: null, paper: null },
  "Poultry Final 2019": { kind: 'paper', cohort: null, paper: 'final' },
  "Poultry Final 86 study compilation": { kind: 'paper', cohort: null, paper: 'final' },
  "Surg Lab Final 85": { kind: 'paper', cohort: 85, paper: 'final' },
  "Swine clinical practice past paper · year unknown · SAQ #1": { kind: 'paper', cohort: null, paper: null },
  "Swine clinical practice past paper · year unknown · SAQ #10": { kind: 'paper', cohort: null, paper: null },
  "Swine clinical practice past paper · year unknown · SAQ #2": { kind: 'paper', cohort: null, paper: null },
  "Swine clinical practice past paper · year unknown · SAQ #3": { kind: 'paper', cohort: null, paper: null },
  "Swine clinical practice past paper · year unknown · SAQ #4": { kind: 'paper', cohort: null, paper: null },
  "Swine clinical practice past paper · year unknown · SAQ #5": { kind: 'paper', cohort: null, paper: null },
  "Swine clinical practice past paper · year unknown · SAQ #6": { kind: 'paper', cohort: null, paper: null },
  "Swine clinical practice past paper · year unknown · SAQ #7": { kind: 'paper', cohort: null, paper: null },
  "Swine clinical practice past paper · year unknown · SAQ #8": { kind: 'paper', cohort: null, paper: null },
  "Swine clinical practice past paper · year unknown · SAQ #9": { kind: 'paper', cohort: null, paper: null },
  "Swine Health Final TJ86": { kind: 'paper', cohort: 86, paper: 'final' },
  "Swine Health Final TJ86 อ.พรชลิต": { kind: 'paper', cohort: 86, paper: 'final' },
  "Swine Health Final TJ86 อ.สุพจน์": { kind: 'paper', cohort: 86, paper: 'final' },
  "Swine Health Final TJ86 อ.อธิภู": { kind: 'paper', cohort: 86, paper: 'final' },
  "Swine Herd Mid TJ86": { kind: 'paper', cohort: 86, paper: 'midterm' },
  "Swine Herd Mid TJ86 อ.บุญฤทธิ์": { kind: 'paper', cohort: 86, paper: 'midterm' },
  "Swine Herd Mid TJ86 อ.เพราพิลาส": { kind: 'paper', cohort: 86, paper: 'midterm' },
  "Swine Herd Mid TJ86 อ.รุ่งธรรม": { kind: 'paper', cohort: 86, paper: 'midterm' },
  "Swine Herd Mid TJ86 อ.อจิมา": { kind: 'paper', cohort: 86, paper: 'midterm' },
  "Swine Herd Mid TJ86 อ.อนุศกุล": { kind: 'paper', cohort: 86, paper: 'midterm' },
  "Swine Repro Final 86": { kind: 'paper', cohort: 86, paper: 'final' },
  "Swine Repro Mid 86": { kind: 'paper', cohort: 86, paper: 'midterm' },
  "TJ86": { kind: 'paper', cohort: 86, paper: null },
  "Vet 5 Pathology past paper · pdfplumber extraction": { kind: 'paper', cohort: null, paper: null },
  "Vet 5 Pathology past paper (SK section) · pdfplumber extraction (Phase 3 batch 2026-05-12)": { kind: 'paper', cohort: null, paper: null },
  "Vet 5 Small Animal Repro practicum past paper · pdfplumber extraction": { kind: 'paper', cohort: null, paper: null },
  "Vet 80 past paper · Vet 83 update commentary": { kind: 'paper', cohort: 80, paper: null },
  "Vet 81 Animal Repro Clinic (canine content)": { kind: 'paper', cohort: 81, paper: null },
  "Vet 81 Animal Repro Clinic (canine/feline content)": { kind: 'paper', cohort: 81, paper: null },
  "Vet 81 Animal Repro Clinic (canine/feline content) · Vet 83 update tags 30% direct match": { kind: 'paper', cohort: 81, paper: null },
  "Vet 81 Animal Repro Clinic (canine/feline content) · Vet 83 update tags 30% direct match · examiner = พี่นุ่น": { kind: 'paper', cohort: 81, paper: null },
  "Vet 81 Animal Repro Clinic (feline content)": { kind: 'paper', cohort: 81, paper: null },
  "Vet 81 Patho prac final · cross-validated by พี่ใหม่ Vet 81 update": { kind: 'paper', cohort: 81, paper: 'final' },
  "VET84 ER Q13": { kind: 'paper', cohort: 84, paper: null },
  "VET84 ER Q14": { kind: 'paper', cohort: 84, paper: null },
  "VET84 ER Q15": { kind: 'paper', cohort: 84, paper: null },
  "VET84 ER Q2": { kind: 'paper', cohort: 84, paper: null },
  "VET84 ER Q3": { kind: 'paper', cohort: 84, paper: null },
  "VET84 ER Q7-9": { kind: 'paper', cohort: 84, paper: null },
  "Veterinary Developmental Anatomy Final (3101102), 25/5/65": { kind: 'paper', cohort: null, paper: 'final' },
  "Vet Imaging Final 86": { kind: 'paper', cohort: 86, paper: 'final' },
  "Vet Imaging Final 86 — Lab": { kind: 'paper', cohort: 86, paper: 'final' },

  // ── aligned: Written from exam guidance a cohort marked, not from a paper ──
  // rows that carry a sourceType
  "จุดที่รุ่นพี่ Vet 85 ทำเครื่องหมายว่าข้อสอบใช้ชื่อโรคในสรุปสรุป": { kind: 'aligned' },
  "แนวข้อเขียนที่รุ่นพี่ Vet 85 คัดมาจากสรุปรุ่นก่อนหน้าและบันทึกว่าอาจารย์สอนเน้น": { kind: 'aligned' },
  "แนวข้อเขียนที่รุ่นพี่ Vet 85 บันทึกไว้ในสรุปสรุป Avian Medicine": { kind: 'aligned' },
  "แนวข้อสอบที่รุ่นก่อนหน้าบันทึกไว้จากวิชา One Health in Veterinary Public Health": { kind: 'aligned' },
  "แนวข้อสอบที่รุ่นพี่ Vet 85 บันทึกไว้ในสรุปสรุป หมวดการตรวจ Mycoplasma": { kind: 'aligned' },
  "แนวข้อสอบที่รุ่นพี่ Vet 85 บันทึกไว้ในสรุปสรุป หมวดยาสำหรับ Mycoplasma": { kind: 'aligned' },
  "แนวข้อสอบที่รุ่นพี่ Vet 85 บันทึกไว้ในสรุปสรุป หมวดวัคซีน infectious coryza": { kind: 'aligned' },
  "แนวข้อสอบที่รุ่นพี่ Vet 85 บันทึกไว้ในสรุปสรุป หมวดวัคซีน Mycoplasma": { kind: 'aligned' },
  "แนวข้อสอบที่รุ่นพี่ Vet 85 บันทึกไว้ในสรุปสรุป หมวดอาการของ MS": { kind: 'aligned' },
  "แนวข้อสอบที่รุ่นพี่ Vet 85 บันทึกไว้ในสรุปสรุป หมวด Mycoplasma": { kind: 'aligned' },
  "แนวข้อสอบที่รุ่นพี่ Vet 85 บันทึกไว้ในสรุปสรุป Avian Medicine": { kind: 'aligned' },
  "อิงแนวข้อสอบ": { kind: 'aligned' },
  "อิงแนวข้อสอบกลางภาครุ่นพี่": { kind: 'aligned' },
  "Equine Sx concept (Vet 85) margin marks bandage extents as a recurring exam item": { kind: 'aligned' },
  "Equine Sx concept (Vet 85) margin marks bandaging as a recurring VCA item": { kind: 'aligned' },
  "Equine Sx concept (Vet 85) margin marks this bandage as a recurring exam item": { kind: 'aligned' },
  "Equine Sx concept (Vet 85) margin notes Robert Jones as the usual VCA item": { kind: 'aligned' },

  // ── source-doc: Names the document the question was written from ──
  // rows that carry a sourceType
  "เขียนขึ้นจากสรุปเคส SFTS ที่เพชรบูรณ์ในเอกสาร Vet 85": { kind: 'source-doc' },
  "เขียนขึ้นจากสรุประบบเฝ้าระวังในเอกสาร Vet 85": { kind: 'source-doc' },
  "เขียนขึ้นจากสรุประบาดวิทยาในเอกสาร Vet 85": { kind: 'source-doc' },
  "เขียนขึ้นจากสรุปโรคติดต่ออันตรายในเอกสาร Vet 85": { kind: 'source-doc' },
  "เขียนขึ้นจากสรุปสถานการณ์ rabies ในเอกสาร Vet 85": { kind: 'source-doc' },
  "เขียนขึ้นจากสรุป bacterial zoonosis ในเอกสาร Vet 85": { kind: 'source-doc' },
  "เขียนขึ้นจากสรุป prion ในเอกสาร Vet 85": { kind: 'source-doc' },
  "เขียนขึ้นจากสรุป SRRT ในเอกสาร Vet 85": { kind: 'source-doc' },
  "เขียนขึ้นจากสไลด์ angiostrongylosis (Vet 85)": { kind: 'source-doc' },
  "เขียนขึ้นจากสไลด์ animal rabies in Thailand (Vet 85)": { kind: 'source-doc' },
  "เขียนขึ้นจากสไลด์ coronaviruses (Vet 85)": { kind: 'source-doc' },
  "เขียนขึ้นจากสไลด์ Ebola virus (Vet 85)": { kind: 'source-doc' },
  "เขียนขึ้นจากสไลด์ emerging zoonotic diseases and wildlife (Vet 85)": { kind: 'source-doc' },
  "เขียนขึ้นจากสไลด์ hantaviruses (Vet 85)": { kind: 'source-doc' },
  "เขียนขึ้นจากสไลด์ henipaviruses (Vet 85)": { kind: 'source-doc' },
  "เขียนขึ้นจากสไลด์ towards a rabies-free Thailand (Vet 85)": { kind: 'source-doc' },
  "เขียนขึ้นจากสไลด์ wildlife rabies in Thailand (Vet 85)": { kind: 'source-doc' },
  "เขียนจากกล่องค่าเฝ้าระวังวิสัญญีในเอกสารของรุ่นพี่ Vet 85": { kind: 'source-doc' },
  "เขียนจากคาบเรียนเคสจริงที่รุ่นพี่ Vet 85 จดไว้": { kind: 'source-doc' },
  "เขียนจากตารางแยกสาเหตุ head shaking ในเอกสารของรุ่นพี่ Vet 85": { kind: 'source-doc' },
  "เขียนจากโน้ตสรุป Avian Medicine ของรุ่นพี่ Vet 85": { kind: 'source-doc' },
  "เขียนจากสรุปจักษุวิทยาม้าของรุ่นพี่ Vet 85": { kind: 'source-doc' },
  "เขียนจากสไลด์ Equine respiratory diseases ที่รุ่นพี่ Vet 85 จดกำกับ": { kind: 'source-doc' },
  "แต่งจากสรุป Milk Hygiene (Vet 85)": { kind: 'source-doc' },
  "แต่งจากสรุป Zoonoses mid ของรุ่น Vet 85": { kind: 'source-doc' },
  "เรียบเรียงจากตัวอย่างการคำนวณในโน้ต Aquatic Med 3107520 (สรุป Vet 85)": { kind: 'source-doc' },
  "เรียบเรียงจากโน้ตเลกเชอร์ Aquatic Med 3107520 (สรุป Vet 85)": { kind: 'source-doc' },
  "เรียบเรียงจากสไลด์บรรยาย Aquatic Med 3107520 (สรุป Vet 85)": { kind: 'source-doc' },
  "เรียบเรียงจากเอกสารสรุป One Health final ของรุ่นก่อนหน้า": { kind: 'source-doc' },
  "Avian Medicine final study notes (Vet 85 compilation)": { kind: 'source-doc' },
  "Equine Repro (Vet 85) study summary": { kind: 'source-doc' },
  "Equine Sx concept deck (Vet 85 annotated slides)": { kind: 'source-doc' },
  "FIQC final study notes (Vet 85)": { kind: 'source-doc' },
  "Swine Medicine bacterial respiratory lecture slides (Vet 85 notes)": { kind: 'source-doc' },
  "Swine Medicine midterm study notes, author-added lesion list (Vet 85)": { kind: 'source-doc' },
  // legacy rows with no sourceType
  "Kim TJ86": { kind: 'source-doc' },
  "OSCE 14 May 2025 · course 3107525/3108517 ภาคปลาย 2567 · station prep doc": { kind: 'source-doc' },
  "Record Analysis อ.รุ่งธรรม": { kind: 'source-doc' },
  "Udder Health อ.ศิริรัตน์": { kind: 'source-doc' },

  // ── mock: A practice mock ──
  // legacy rows with no sourceType
  "Mock 1 Part I": { kind: 'mock' },
  "Mock 1 Part II": { kind: 'mock' },
  "Mock 2 Part I": { kind: 'mock' },
  "Mock 2 Part II": { kind: 'mock' },
  "Mock 3 Part I": { kind: 'mock' },
  "Mock 3 Part II": { kind: 'mock' },
  "Mock 4 Part II (Original)": { kind: 'mock' },
  "Mock 4 Part I (Original)": { kind: 'mock' },
});

/** The filed entry for an examOrigin string, or null when it has none. */
export function originEntry(origin) {
  if (typeof origin !== 'string' || !origin) return null;
  return Object.hasOwn(EXAM_ORIGINS, origin) ? EXAM_ORIGINS[origin] : null;
}
