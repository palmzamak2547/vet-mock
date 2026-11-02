// ============================================================
// course-syllabi.js: each course's teaching term as it actually ran, per term
// ============================================================
// Keyed term, then year, then subject id, as the wrap-ups and lecturer sets
// are, so next term is one more key and this term stays readable. The
// downloadable syllabus and teaching timetable (lib/course-docs.js,
// share-card/course-doc-card.js) print from here, and the per-term teaching
// map planned for after the 2569-1 finals reads the same rows: when a session
// ran, who taught it, the topics it taught.
//
// A syllabus is the plan. Palm, 1 Nov 2026: "ข้อมูล syllabus บางทีก็เปลี่ยนได้ด้วย
// อย่าเชื่อทั้งหมด". Each row is a class as it ran, from the strongest evidence:
// the cohort's own lecture recordings (titles carry the day taught), then the
// class LINE group's announcements, then the course's document. A planned
// session not yet seen to run keeps its planned date and no `held`.
//
// - `date`: the day it ran (or will run); `time` only where it differs from
//   the course's weekly `slot`. `planned`: the course document's date(s) when
//   the class ran on another day. `held`: a recording or an announcement shows
//   it ran on `date`. `dayUnknown`: the class did not run on its planned
//   day and no evidence yet says when it did.
// - `topics`: curriculum topic ids it taught. The unit test checks each
//   against its topic's examScope.
// - `paper`: only where the evidence puts the content off the side of the
//   midterm its date gives (null: examined on neither paper).
// - `kind`: 'holiday', 'activity' and 'makeup' rows are printed but examine
//   nothing. `change`: an announcement in the class LINE group, with the day
//   it was posted. `note`: what else the evidence says (a recording's own
//   title, quoted without its lecture numbers and date).
// - `papers`: the written papers the faculty timetable holds for the course;
//   `to`/`from` only where the course's document states the window itself.
// Lecturer names are as the sources print them, without academic titles.
// ============================================================

/** The term's own calendar, so its documents read the same after SEMESTER moves on. */
export const TERMS = {
  '2569-1': {
    labelTh: 'ภาคการศึกษาต้น 2569',
    midterm: { start: '2026-09-21', end: '2026-09-25' },
    final: { start: '2026-11-23', end: '2026-12-04' },
    // The last day the evidence reaches: the recordings are listed to 27 Oct,
    // the class LINE export to 28 Oct. A later class keeps the plan's date.
    evidenceUntil: '2026-10-28',
  },
};

const CHECKED = '2026-11-01';
const MCV_PRINT = (code, year) => ({ title: `ประมวลรายวิชา ${code} ปีการศึกษา ${year}`, where: 'myCourseVille', checked: CHECKED });
// Where a course's own document gives no room: the faculty's weekly timetable (CLASS_TIMETABLE.y5).
const FACULTY_ROOM = { title: 'ห้องเรียนตามตารางเรียนของคณะ', where: 'คณะ', checked: CHECKED };
const RECORDINGS = { title: 'คลิปบันทึกการสอนของรุ่น', where: 'คณะ', checked: CHECKED };
const CLASS_LINE = { title: 'ประกาศในกลุ่มไลน์ชั้นปี', where: 'คณะ', checked: CHECKED };

const AN = 'อธิภู นันทประเสริฐ';
const PA = 'พรชลิต อัศวชีพ';
const SW = 'สุพจน์ วัฒนะพันธ์ศักดิ์';
const RK = 'รุ่งธรรม เกษโกวิท';
const JIROJ = 'จิโรจ ศศิปรียจันทร์';
const SOMSAK = 'สมศักดิ์ ภัคภิญโญ';
const NIWAT = 'นิวัตร จันทร์ศิริพรชัย';
const NATAYA = 'ณทยา เจริญวิศาล';
const KRIENG = 'เกรียงวิชญ์ ลิมปวิทยากุล';
const SIRAWIT = 'สิรวิทย์ ภักดีพาณิชย์กิจ';
const SAHA = 'สหฤทัย เจียมศรีพงษ์';
const RUNGTIP = 'รุ่งทิพย์ ชวนชื่น';
const TARADOL = 'ธราดล เหลืองทองคำ';
const SUPHACHAI = 'ศุภชัย เนื้อนวลสุวรรณ';
const WORAYANEE = 'วรญาณี ธรรมธร';
const KAMONPAN = 'กมลพรรณ เจริญกุล';
const TEERAPOL = 'ธีรพล ชินกังสดาร';
const SAWITA = 'ศวิตา สันติวิภารัตน์';
const THARASANIT = 'ธีรวัฒน์ ธาราศานิต';
const SWANGCHAN = 'ธีรวัฒน์ สว่างจันทร์อุทัย';
const ARANYA = 'อรัญญา พลพรพิสิฐ';
const THANIDA = 'ฐนิดา เหตระกูล';
const PATHARAPOL = 'ภัทรพล เปี่ยมสมบูรณ์';
const VACHIRA = 'วชิรา หุ่นประสิทธิ์';
const THANICHA = 'ฐนิชา ชาญชัยเดชาชัย';
const CHAIDATE = 'ชัยเดช อินทร์ชัยศรี';
const EPID_STAFF = [SAHA, NIWAT, VACHIRA, CHAIDATE, THANICHA];

const classLine = (posted, text) => ({ text, posted });
const clip = (title) => `ชื่อในคลิปบันทึกการสอน: ${title}`;

export const SYLLABI = {
  '2569-1': {
    5: {
      'epidemiology': {
        code: '3107508', nameTh: 'ระบาดวิทยาและเวชศาสตร์ป้องกันทางการสัตวแพทย์', nameEn: 'Veterinary Epidemiology and Preventive Medicine', credits: 3,
        slot: { day: 'จันทร์', time: '10:00–12:00 บรรยาย, 13:00–15:00 ปฏิบัติการ', room: 'VET6 807' },
        sources: [MCV_PRINT('3107508', 2569), RECORDINGS, CLASS_LINE, FACULTY_ROOM],
        papers: { final: {} },
        sessions: [
          { date: '2026-08-03', held: true, title: 'Introduction to Epidemiology, Concept of disease transmission, Concept of Causal Association', lecturers: [NIWAT, THANICHA], topics: ['epidem-intro', 'epidem-disease-transmission', 'epidem-causation'], change: classLine('2026-07-27', 'คาบ อ.นิวัตร เหลือ 10:00–11:00 และเรียนชดเชย 10 ส.ค.') },
          { date: '2026-08-10', time: '09:00–12:00', planned: ['2026-08-03', '2026-08-10'], held: true, title: 'Basic concept in Epidemiology, Measurement of Disease Frequency, Diagnostic and screening test, Agreement of Test', lecturers: [NIWAT, VACHIRA], topics: ['epidem-basic-concepts', 'epidem-disease-frequency', 'epidem-dx-screening', 'epidem-test-agreement'], note: clip('Basic concept in Epidemiology + Measurement') },
          { date: '2026-08-17', held: true, title: 'Study designs, Sample size determination', lecturers: [CHAIDATE, THANICHA], topics: ['epidem-observational-study', 'epidem-sample-size'] },
          { date: '2026-08-24', held: true, title: 'Animal Disease Surveillance and Monitoring, Outbreak investigation', lecturers: [SAHA], topics: ['epidem-surveillance', 'epidem-outbreak-investigation'] },
          { date: '2026-08-31', held: true, title: 'Principle of Disease prevention, control and eradication, Government Policy and Practice on Disease prevention, control and eradication', lecturers: [NIWAT], topics: ['epidem-control-prevention', 'epidem-govt-policy'] },
          { date: '2026-09-07', held: true, title: 'Applied statistic for Epidemiology, Epidemiology data analysis', lecturers: [THANICHA], topics: ['epidem-applied-stats', 'epidem-data-analysis'] },
          { date: '2026-09-14', held: true, title: 'Intro. to Module and Software, Epidemiology Application in Current Research', lecturers: [CHAIDATE], topics: ['epidem-software', 'epidem-current-research'], note: clip('Module 5 The Future Vet + Module 1 Diagnostic Tools in Veterinary Epidem'), change: classLine('2026-09-14', 'ช่วงบ่ายไม่มีเรียน ให้ศึกษาเองผ่าน dashboard ใน myCourseVille') },
          { date: '2026-09-28', held: true, title: 'Emerging Infectious Diseases & Pandemic Preparedness, Introduction to Economics and Decision Tools for Veterinary Epidemiology', lecturers: [THANICHA], topics: ['epidem-eid-pandemic', 'epidem-economics'], paper: null, change: classLine('2026-09-27', 'เรียนออนไลน์ เนื้อหาที่เรียนวันที่ 28 ก.ย. ไม่ออกสอบ') },
          { date: '2026-10-05', held: true, title: 'Module 1: Consideration of Diagnostic tool for Epi. Approach', lecturers: EPID_STAFF, topics: [], change: classLine('2026-10-04', 'เริ่มที่ห้อง 807 แล้วบางกลุ่มแยกไปห้อง Smart Classroom') },
          { date: '2026-10-12', held: true, title: 'Module 2: Observational study', lecturers: EPID_STAFF, topics: [] },
          { date: '2026-10-19', held: true, title: 'Module 2: Observational study', lecturers: EPID_STAFF, topics: [] },
          { date: '2026-10-26', title: 'Module 3: Outbreak Investigation, surveillance', lecturers: EPID_STAFF, topics: [] },
          { date: '2026-11-02', title: 'Module 4: Prevention, control and Eradication', lecturers: EPID_STAFF, topics: [] },
          { date: '2026-11-09', title: 'Module 4: Prevention, control and Eradication', lecturers: EPID_STAFF, topics: [] },
          { date: '2026-11-16', title: 'Knowledge review, Questions and Discussion', lecturers: EPID_STAFF, topics: [] },
        ],
      },

      'aquatic-clinic': {
        code: '3107520', nameTh: 'อายุรศาสตร์สัตว์น้ำ', nameEn: 'Aquatic Animal Medicine', credits: 3,
        coordinator: ARANYA,
        slot: { day: 'อังคาร', time: '09:00–12:00', room: 'VET6 807' },
        sources: [MCV_PRINT('3107520', 2569), { title: 'หน้า Schedule (ผู้สอนรายคาบ)', where: 'myCourseVille', checked: CHECKED }, RECORDINGS, CLASS_LINE, FACULTY_ROOM],
        papers: { midterm: {}, final: {} },
        assessment: {
          items: [
            { label: 'สอบกลางภาค', pct: 49, parts: [[ARANYA, 18], ['ผู้แทน CPF', 3], [THANIDA, 14], [PATHARAPOL, 14]] },
            { label: 'สอบปลายภาค', pct: 46, parts: [[`${ARANYA} (ส่วน มกอช.)`, 6], [THANIDA, 14], [PATHARAPOL, 21], [WORAYANEE, 5]] },
            { label: 'รายงาน พ.ร.บ.โรคระบาดสัตว์', pct: 5 },
          ],
        },
        notes: [
          { text: 'การเช็กชื่อและควิซในคาบ อ.ภัทรพล คิดเป็น 20% ของคะแนนสอบส่วนของอาจารย์', source: classLine('2026-08-20') },
          { text: 'ส่วนของ อ.นันทริกา ในปลายภาคเป็นปรนัย 14 ข้อ', source: classLine('2026-10-20') },
        ],
        sessions: [
          { date: '2026-08-04', held: true, title: 'Aquaculture in Thailand, Aquaculture Industry & Technology', lecturers: [ARANYA, THANIDA, PATHARAPOL, 'ผู้แทน CPF'], topics: ['aqua-intro-thailand'] },
          { date: '2026-08-11', held: true, title: 'Fish Biology & Aquatic Management Practice', lecturers: [ARANYA], topics: ['aqua-fish-biology'] },
          { date: '2026-08-18', held: true, title: 'Water and Soil Quality Management in Aquaculture', lecturers: [THANIDA, PATHARAPOL], topics: ['aqua-water-quality', 'aqua-life-support'] },
          { date: '2026-08-25', held: true, title: 'Shrimp Biology & Culture, Fish & Shrimp Immunology', lecturers: [PATHARAPOL], topics: ['aqua-shrimp-immunology'] },
          { date: '2026-09-01', held: true, title: 'Ornamental Fish Medicine', lecturers: [ARANYA], topics: ['aqua-ornamental'] },
          { date: '2026-09-08', held: true, title: 'Aquatic Amphibian Medicine', lecturers: [THANIDA, PATHARAPOL], topics: ['aqua-amphibian', 'aqua-frog-diseases'] },
          { date: '2026-09-15', held: true, title: 'Aquatic Reptile Medicine', lecturers: [THANIDA], topics: ['aqua-turtle'] },
          { date: '2026-09-29', held: true, title: 'Diseases in Fish and Shrimp Culture 1', lecturers: [PATHARAPOL], topics: ['aqua-fish-diseases', 'aqua-shrimp-diseases'], change: classLine('2026-09-27', 'เรียนออนไลน์') },
          { date: '2026-10-06', held: true, title: 'Diseases in Fish and Shrimp Culture 2', lecturers: [PATHARAPOL], topics: ['aqua-fish-diseases', 'aqua-shrimp-diseases'], change: classLine('2026-10-05', 'เรียนออนไลน์') },
          // The schedule names ฐนิดา for this class; the class's own deck names นันทริกา, who also set out her part of the final.
          { date: '2026-10-20', held: true, title: 'Aquarium Management & Medicine', lecturers: ['นันทริกา ชันซื่อ'], topics: ['aqua-aquarium-vet'], note: 'ผู้บรรยายตามสไลด์ของคาบ ตารางของรายวิชาระบุ ฐนิดา เหตระกูล' },
          { date: '2026-10-27', held: true, title: 'Conservation Aquatic Animal Management & Medicine', lecturers: [THANIDA], topics: ['aqua-conservation'], note: clip('Marine mammal medicine') },
          { date: '2026-11-03', title: 'Aquatic toxicology and aquatic animal impact', lecturers: [WORAYANEE], topics: ['aqua-toxicology'] },
          { date: '2026-11-10', title: 'Aquatic Animal Diseases Regulation & Involving Organizations', lecturers: [ARANYA, THANIDA, PATHARAPOL, 'ผู้แทน มกอช.'], topics: ['aqua-disease-control'] },
          { date: '2026-11-17', planned: '2026-10-13', title: 'Biosecurity & Disease Control in Aquaculture, The Role of Aquatic Veterinarians in the International Community', lecturers: [PATHARAPOL], topics: ['aqua-shrimp-diseases', 'aqua-disease-control'], change: classLine('2026-08-20', '13 ต.ค. เป็นวันหยุด ย้ายมาสอนวันนี้ราว 1 ชั่วโมงก่อนการนำเสนอ') },
          { date: '2026-11-17', title: 'Aquatic animal disease in Animal Epidemics Act 2558 (นิสิตนำเสนอผลงาน)', lecturers: ['นิสิตนำเสนอหน้าชั้นเรียน'], topics: ['aqua-disease-control'] },
        ],
      },

      'avian-medicine': {
        code: '3107510', nameTh: 'อายุรศาสตร์สัตว์ปีก', nameEn: 'Avian Medicine', credits: 2,
        coordinator: NATAYA,
        slot: { day: 'อังคาร', time: '13:00–16:00', room: 'ห้อง 807' },
        sources: [{ title: 'ตารางเรียนวิชา Avian Medicine ปีการศึกษา 2569', where: 'myCourseVille', checked: CHECKED }, RECORDINGS, CLASS_LINE],
        papers: { midterm: { to: '2026-09-15' }, final: { from: '2026-10-06' } },
        notes: [{ text: 'ผู้เข้าร่วมกิจกรรม HIPRA วันที่ 17 พ.ย. ได้คะแนนพิเศษ 0.5% บวกกับคะแนนสอบปลายภาคส่วนที่ อ.เกรียงวิชญ์ สอน', source: classLine('2026-10-28') }],
        assessment: {
          items: [
            { label: 'สอบกลางภาค', pct: 54, parts: [[JIROJ, 8], [SOMSAK, 15], [NATAYA, 23], [KRIENG, 8]] },
            { label: 'สอบปลายภาค', pct: 46, parts: [[JIROJ, 15], [NIWAT, 15], [KRIENG, 16]] },
          ],
        },
        sessions: [
          { date: '2026-08-04', held: true, title: 'Newcastle Disease, Infectious Bronchitis, Infectious Laryngotracheitis, Avian Metapneumovirus Infection, Avian Pox', lecturers: [NATAYA], topics: ['avian-nd', 'avian-ib', 'avian-lt', 'avian-mpv', 'avian-pox'] },
          { date: '2026-08-11', held: true, title: 'Mycoplasmosis', lecturers: [SOMSAK], topics: ['avian-myco'] },
          { date: '2026-08-18', held: true, title: 'Infectious Coryza, Fowl Cholera, E. coli Infections', lecturers: [SOMSAK], topics: ['avian-coryza', 'avian-fowl-cholera', 'avian-coli'] },
          { date: '2026-08-25', held: true, title: 'Introduction to Avian Medicine, Avian Influenza, Egg breakout analysis', lecturers: [JIROJ], topics: ['avian-intro', 'avian-ai', 'avian-egg-breakout'] },
          { date: '2026-09-01', planned: ['2026-09-01', '2026-09-08'], held: true, title: 'Infectious Bursal Disease, Neoplastic Diseases, Chicken Infectious Anemia, Reovirus Infections, Runting and Stunting Syndrome', lecturers: [NATAYA], topics: ['avian-ibd', 'avian-marek', 'avian-cia', 'avian-reo', 'avian-rss'] },
          { date: '2026-09-08', held: true, title: 'Coccidiosis, Necrotic Enteritis, Leukocytozoonosis, Avian Malaria', lecturers: [NATAYA], topics: ['avian-cocci', 'avian-ne', 'avian-leuko', 'avian-malaria'] },
          { date: '2026-09-15', held: true, title: 'Avian Salmonellosis, Adenovirus Infections, Avian Encephalomyelitis, Omphalitis, Ascites, Staphylococcosis', lecturers: [KRIENG], topics: ['avian-salmonella', 'avian-adeno', 'avian-ae', 'avian-ahra-set'] },
          { date: '2026-10-06', planned: ['2026-11-10', '2026-11-17'], held: true, title: 'Vaccines, vaccination and vaccination programs, Serology Interpretation', lecturers: [JIROJ], topics: ['avian-vaccine-prog', 'avian-serology'] },
          { date: '2026-10-19', time: '09:00–10:00', planned: '2026-10-27', held: true, title: 'Mycotic Infections', lecturers: [NIWAT], topics: ['avian-mycosis'], change: classLine('2026-08-29', 'คาบบ่าย 27 ต.ค. ย้ายมาเรียนวันจันทร์ 19 และ 26 ต.ค. 09:00–10:00') },
          { date: '2026-10-20', planned: ['2026-10-06', '2026-10-20'], held: true, title: 'Duck Virus Enteritis, Duck Virus Hepatitis, New Duck Syndrome, Goose Parvovirus Infection, Duck Flavivirus Infection', lecturers: [KRIENG], topics: ['avian-duck-plague', 'avian-dvh', 'avian-nds', 'avian-goose-parvo', 'avian-duck-flavi'], note: clip('AHRA Avian med: RA DVE DVH DTMUV GP AI') },
          { date: '2026-10-26', time: '09:00–10:00', planned: '2026-10-27', held: true, title: 'Mycotic Infections (ต่อ), Mycotoxicosis', lecturers: [NIWAT], topics: ['avian-mycosis'] },
          { date: '2026-11-03', title: 'Ornithobacteriosis, Campylobacteriosis, Listeriosis, Histomoniasis', lecturers: [NIWAT], topics: ['avian-ort', 'avian-campy', 'avian-listeria', 'avian-histomoniasis'] },
          { date: '2026-11-17', planned: '2026-09-29', kind: 'activity', title: 'Activities with Hipra', lecturers: [KRIENG], topics: [], change: classLine('2026-09-28', 'เลื่อนมาจาก 29 ก.ย.') },
        ],
      },

      'poa-clinical': {
        code: '3107522', nameTh: 'การแก้ไขปัญหาทางคลินิกอายุรศาสตร์สัตว์เลี้ยง', nameEn: 'Clinical Problem Solving in Companion Animal Medicine', credits: 1,
        coordinator: VACHIRA,
        slot: { day: 'พุธ', time: '08:00–09:00', room: 'VET6 807' },
        sources: [MCV_PRINT('3107522', 2569), CLASS_LINE, FACULTY_ROOM],
        papers: {},
        sessions: [
          { date: '2026-08-05', held: true, title: 'Introduction to Problem Oriented Approach', lecturers: [VACHIRA], topics: ['poa-intro'] },
          { date: '2026-08-20', planned: '2026-08-19', held: true, title: 'Approach to vomiting and regurgitating patient', lecturers: ['ปุญญมณี แหยมเกตุ'], topics: ['poa-vomiting'], change: classLine('2026-08-19', 'งดเรียน 19 ส.ค. เรียนชดเชยวันพฤหัสบดี 20 ส.ค. เริ่ม 15:00') },
          { date: '2026-08-26', held: true, title: 'Approach to diarrhea patient', lecturers: ['ชูติรัตน์ ต่อสหะกุล'], topics: ['poa-diarrhea'] },
          { date: '2026-09-02', held: true, title: 'Approach to patient with Effusion, edema, abdominal enlargement', lecturers: ['สิริลักษณ์ สุรเชษฐพงษ์'], topics: ['poa-edema'] },
          { date: '2026-09-09', held: true, title: 'Approach to patient with cough, sneeze, nasal discharge', lecturers: ['ณัฐวรรณ ตั้งมหากุล'], topics: ['poa-respiratory'] },
          { date: '2026-09-16', held: true, title: 'Approach to Anorexia, weight loss patient', lecturers: ['ปุญญมณี แหยมเกตุ'], topics: ['poa-anorexia'] },
          { date: '2026-09-30', held: true, title: 'Approach to patient with pale mucous membrane, anemia', lecturers: [VACHIRA], topics: ['poa-pale-mm'] },
          { date: '2026-10-07', held: true, title: 'Approach to jaundice patient', lecturers: ['กฤษฎา บุญอร่ามเรือง'], topics: ['poa-jaundice'] },
          { date: '2026-10-14', held: true, title: 'Approach to patient with red urine, bleeding disorder', lecturers: [VACHIRA], topics: ['poa-red-urine'] },
          { date: '2026-10-21', title: 'Approach to clinical problems in exotic pets 1', lecturers: ['ธวัช เล็กดำรงศักดิ์'], topics: ['poa-exotic'] },
          { date: '2026-10-28', title: 'Approach to clinical problems in exotic pets 2', lecturers: ['ธวัช เล็กดำรงศักดิ์'], topics: ['poa-exotic'] },
          { date: '2026-11-04', title: 'Approach to patient with collapse, seizure, syncope problem', lecturers: ['กฤษฎา บุญอร่ามเรือง'], topics: ['poa-collapse'] },
          { date: '2026-11-11', title: 'Approach to patient with alopecia and pruritus', lecturers: ['ชัยยศ ธารรัตนะ'], topics: ['poa-derm'] },
          { date: '2026-11-18', title: 'Approach to polyuria, polydipsia patient', lecturers: ['ชัยยศ ธารรัตนะ'], topics: ['poa-pupd'] },
        ],
      },

      'milk-meat-hygiene': {
        code: '3109503', nameTh: 'สุขศาสตร์น้ำนมและการตรวจคุณภาพเนื้อสัตว์', nameEn: 'Milk Hygiene and Meat Inspection', credits: 3,
        coordinator: RUNGTIP,
        slot: { day: 'พุธ', time: '09:00–12:00', room: 'ห้อง 807 ตึก 60 ปี' },
        sources: [{ title: 'ตารางสอนวิชาสุขศาสตร์น้ำนมและเนื้อสัตว์ ปีการศึกษา 2569', where: 'myCourseVille', checked: CHECKED }, RECORDINGS, CLASS_LINE],
        papers: { midterm: {}, final: {} },
        sessions: [
          { date: '2026-08-05', title: 'ความปลอดภัยทางชีวภาพเพื่อการผลิตน้ำนมคุณภาพดี', en: 'Farm biosecurity for good milk quality production', lecturers: ['จักรกริศน์ เนื่องจำนงค์'], topics: ['milk-biosec-dairy'] },
          { date: '2026-08-12', kind: 'holiday', title: 'วันหยุด', lecturers: [], topics: [] },
          { date: '2026-08-19', held: true, title: 'บทนำสุขศาสตร์น้ำนม, ผลกระทบของโรคเต้านมอักเสบต่อคุณภาพน้ำนม', en: 'Introduction to Milk Hygiene, Cow mastitis and milk quality', lecturers: [RUNGTIP], topics: ['milk-overview', 'milk-mastitis'] },
          { date: '2026-08-26', held: true, title: 'การรักษาคุณภาพและการขนส่งน้ำนมดิบ, การตรวจคุณภาพน้ำนมดิบและผลิตภัณฑ์', en: 'Milk storage and transportation, Determination of milk quality', lecturers: [RUNGTIP], topics: ['milk-raw-storage', 'milk-products-storage', 'milk-quality-determination'], change: classLine('2026-08-27', 'เนื้อหาการตรวจคุณภาพน้ำนมที่ยังไม่จบ สอนต่อในคาบ 2 ก.ย.') },
          { date: '2026-09-02', held: true, title: 'ส่วนประกอบและคุณภาพน้ำนมดิบ, มาตรฐานน้ำนมดิบและผลิตภัณฑ์นม', en: 'Composition and quality of raw milk, Standard of raw milk and dairy products', lecturers: [SAHA], topics: ['milk-quality-composition', 'milk-raw-std'] },
          { date: '2026-09-09', held: true, title: 'จุลชีววิทยาน้ำนม, จุลินทรีย์ก่อโรคและโรคที่ติดต่อทางน้ำนม', en: 'Milk microbiology, Milk borne pathogens and diseases', lecturers: [SAHA], topics: ['milk-microbiology', 'milk-borne-pathogens'] },
          { date: '2026-09-16', held: true, title: 'มาตรฐานศูนย์รวบรวมน้ำนมและมาตรฐานโรงงานแปรรูปน้ำนมและผลิตภัณฑ์นม (GMP/HACCP), เทคโนโลยีการแปรรูปน้ำนมและการผลิตน้ำนม', en: 'GMP and HACCP standards for milk collecting center and milk processing plants, Processing and manufacturing technologies for milk and milk products', lecturers: [SAHA], topics: ['milk-industry-std', 'milk-processing'] },
          { date: '2026-09-30', held: true, title: 'การทำความสะอาดและการฆ่าเชื้อโรคในศูนย์รวบรวมน้ำนมและโรงงานแปรรูป', en: 'Cleaning and sanitizing in milk collecting facilities and milk processing plants', lecturers: [SAHA], topics: ['milk-cleaning'], change: classLine('2026-09-29', 'เรียนออนไลน์') },
          { date: '2026-10-07', planned: '2026-10-14', held: true, title: 'จุลินทรีย์ที่ก่อให้เกิดการเน่าเสียและเกิดโรคที่ติดต่อผ่านเนื้อสัตว์ และมาตรฐานทางจุลชีววิทยาของเนื้อสัตว์, การเก็บตัวอย่าง การตรวจเนื้อสัตว์ทางจุลชีววิทยา และการควบคุมจุลินทรีย์ที่ปนเปื้อนในเนื้อสัตว์', en: 'Spoilage- and disease-causing microorganisms in meat and meat microbiological standards, Sampling, microbiological examination and contamination control in meat', lecturers: [TARADOL], topics: ['meat-microbiology'] },
          { date: '2026-10-14', planned: '2026-10-07', held: true, title: 'บทนำสุขศาสตร์เนื้อสัตว์, การเสื่อมคุณภาพของอาหารที่มาจากสัตว์น้ำและสารพิษในสัตว์น้ำ', en: 'Introduction to meat hygiene, Deterioration of aquatic-derived food and aquatic toxins', lecturers: [SIRAWIT], topics: ['meat-hygiene-intro', 'meat-seafood'] },
          { date: '2026-10-21', held: true, title: 'การเก็บรักษาเนื้อสัตว์และผลิตภัณฑ์, อนามัยเนื้อสัตว์, การใช้เทคนิคด้านอณูชีววิทยาในการตรวจคุณภาพและการรับรองเนื้อสัตว์', en: 'Storage of meat and meat products, Meat wholesomeness, Use of molecular techniques for meat quality and authentication', lecturers: [RUNGTIP], topics: ['meat-storage', 'meat-quality', 'meat-molecular'] },
          { date: '2026-10-28', title: 'การควบคุมสัตว์รังควานและตัวนำโรคในโรงฆ่าสัตว์, สุขศาสตร์ไข่', en: 'Pest and vector control in slaughterhouses, Egg hygiene', lecturers: [SUPHACHAI], topics: ['meat-pest-control', 'meat-egg-micro'] },
          { date: '2026-11-04', title: 'สุขศาสตร์โรงฆ่าสัตว์, การออกแบบและระบบการฆ่าในโรงฆ่าสัตว์', en: 'Slaughterhouse hygiene, Slaughterhouse design and slaughtering process', lecturers: [SIRAWIT], topics: ['meat-slaughter'] },
          { date: '2026-11-11', title: 'การตรวจสัตว์ก่อนฆ่าและการตรวจซากสัตว์หลังฆ่า', en: 'Antemortem and postmortem meat inspection', lecturers: [SIRAWIT], topics: ['meat-ante-post-mortem'] },
          { date: '2026-11-18', title: 'การเปลี่ยนแปลงหลังสัตว์ตายที่ส่งผลกับซากสัตว์, การตัดแต่ง ประเมินและตัดสินคุณภาพซาก', en: 'Postmortem changes, Meat cutting and grading', lecturers: [SIRAWIT], topics: ['meat-cutting-grading'] },
        ],
      },

      'one-health': {
        code: '3109502', nameTh: 'สุขภาพหนึ่งเดียวทางสัตวแพทยสาธารณสุข', nameEn: 'One Health in Veterinary Public Health', credits: 1,
        coordinator: SAHA,
        slot: { day: 'พุธ', time: '13:00–14:00', room: 'ห้อง 807 ตึก 60 ปี' },
        sources: [{ title: 'ตารางเรียนวิชาสุขภาพหนึ่งเดียว (One Health) ปีการศึกษา 2569', where: 'myCourseVille', checked: CHECKED }, RECORDINGS, CLASS_LINE],
        papers: { midterm: {}, final: {} },
        notes: [{ text: 'ตัดเกรดอิงเกณฑ์ สัดส่วนกลางภาคและปลายภาคตามจำนวนชั่วโมงเรียน (กลางภาค 6 คาบ ปลายภาค 8 คาบ)', source: classLine('2026-10-28') }],
        sessions: [
          { date: '2026-08-05', held: true, title: 'Role of veterinarians in One Health', lecturers: [SAHA], topics: ['oh-vet-role'] },
          { date: '2026-08-12', kind: 'holiday', title: 'วันหยุด (The Queen Mother’s birthday)', lecturers: [], topics: [] },
          { date: '2026-08-19', held: true, title: 'One World - One Health concept', lecturers: [SIRAWIT], topics: ['oh-concept'] },
          { date: '2026-09-02', held: true, title: 'Global One Health activity network', lecturers: [SAHA], topics: ['oh-global-network'] },
          { date: '2026-09-09', planned: ['2026-09-09', '2026-09-16'], held: true, title: 'One Health communication skills, Transdisciplinary collaboration and partnership in One Health issues', lecturers: [SIRAWIT], topics: ['oh-communication', 'oh-collaboration'], change: classLine('2026-09-09', 'วันที่ 16 ก.ย. ไม่มีเรียน') },
          { date: '2026-09-10', time: '13:00–16:00', planned: '2026-08-26', held: true, title: 'One Health approach to combat emerging and re-emerging diseases', lecturers: [KAMONPAN, 'อลงกร อมรศิลป์'], topics: ['oh-disease-prevention'], change: classLine('2026-09-02', 'เนื้อหาที่อาจารย์สอนไม่ทันและยังไม่ได้สอน ย้ายมาสอนวันนี้ 13:00–16:00') },
          { date: '2026-09-30', planned: '2026-10-14', held: true, title: 'One Health approach to combat antimicrobial resistance', lecturers: [RUNGTIP], topics: ['oh-amr'], change: classLine('2026-09-29', 'เรียนออนไลน์') },
          { date: '2026-10-07', planned: ['2026-10-07', '2026-11-18'], held: true, title: 'Animal and human health risk analysis, Import risk assessment', lecturers: [SUPHACHAI], topics: ['oh-risk-analysis', 'oh-import-risk'] },
          { date: '2026-10-14', planned: '2026-09-30', held: true, title: 'One Health approach to combat foodborne diseases', lecturers: [TARADOL], topics: ['oh-foodborne'] },
          { date: '2026-10-21', held: true, title: 'One Health approach to address environmental health risks I', lecturers: [WORAYANEE], topics: ['oh-env-carcinogen'] },
          { date: '2026-10-28', title: 'One Health approach to address environmental health risks II', lecturers: [WORAYANEE], topics: ['oh-env-mutagen'] },
          { date: '2026-11-04', title: 'One Health perspective of food and feed GMOs', lecturers: [WORAYANEE], topics: ['oh-gmo'] },
          { date: '2026-11-11', title: 'Application of One Health approach for livestock waste management', lecturers: [SIRAWIT], topics: ['oh-livestock-waste'] },
        ],
      },

      'food-industry': {
        code: '3109501', nameTh: 'อุตสาหกรรมอาหารและการควบคุมคุณภาพ', nameEn: 'Food Industry and Quality Control', credits: 1,
        coordinator: SIRAWIT,
        slot: { day: 'พุธ', time: '14:00–16:00', room: 'VET6 807' },
        sources: [
          { title: 'ตารางเรียน Course Agenda (Updated Sep29) ปีการศึกษา 2569', where: 'myCourseVille', checked: CHECKED },
          MCV_PRINT('3109501', 2569), RECORDINGS, CLASS_LINE, FACULTY_ROOM,
        ],
        papers: { midterm: {}, final: {} },
        assessment: {
          items: [
            { label: 'สอบกลางภาค', pct: 40 },
            { label: 'สอบปลายภาค', pct: 40 },
            { label: 'Workshop and discussion', pct: 15 },
            { label: 'การเข้าเรียน', pct: 5 },
          ],
        },
        notes: [{ text: 'คะแนนดิบกลางภาค 35 คะแนน คิดเป็น 40 จาก 100 ตามสัดส่วนชั่วโมงเรียน', source: classLine('2026-10-28') }],
        sessions: [
          { date: '2026-08-19', time: '14:00–16:00', held: true, title: 'บทนำ จุดมุ่งหมายและการประเมินผลรายวิชา การคุ้มครองด้านสุขภาพและการสาธารณสุข', lecturers: [SIRAWIT], topics: ['fiqc-intro'] },
          { date: '2026-08-26', time: '14:00–16:00', held: true, title: 'การควบคุมคุณภาพอาหารสัตว์', lecturers: [SIRAWIT], topics: ['fiqc-feed-qc'] },
          { date: '2026-09-02', time: '14:00–16:00', held: true, title: 'การควบคุมกระบวนการฆ่าและการจำหน่ายเนื้อสัตว์', lecturers: [SIRAWIT], topics: ['fiqc-slaughter-qc'] },
          { date: '2026-09-09', time: '14:00–16:00', held: true, title: 'การควบคุมคุณภาพในกระบวนการผลิตปศุสัตว์', lecturers: ['มินตรา ลักขณา'], topics: ['fiqc-livestock-qc'] },
          { date: '2026-10-14', time: '14:00–16:00', planned: '2026-09-30', held: true, title: 'ระบบการวิเคราะห์อันตรายและจุดวิกฤตที่ต้องควบคุม (HACCP)', lecturers: ['สมพิศ จุลลาบุตรดี'], topics: ['fiqc-haccp'], change: classLine('2026-09-29', 'งดเรียน 30 ก.ย. เรียนกับ อ.สมพิศ วันนี้ครั้งเดียว 14:00–18:00') },
          { date: '2026-10-14', time: '16:00–18:00', held: true, title: 'มาตรฐานสินค้าปศุสัตว์เพื่อการส่งออก', lecturers: ['สมพิศ จุลลาบุตรดี'], topics: ['fiqc-poultry-export'] },
          { date: '2026-10-28', time: '14:00–16:00', title: 'การควบคุมคุณภาพสัตว์น้ำและผลิตภัณฑ์สัตว์น้ำ', lecturers: [SAHA], topics: ['fiqc-aquatic'] },
          { date: '2026-11-11', time: '14:00–16:00', title: 'การตรวจสอบและควบคุมคุณภาพเนื้อสัตว์และผลิตภัณฑ์ในอุตสาหกรรมอาหาร (การบรรยายเชิงปฏิบัติการ)', lecturers: ['VPH staff'], topics: [] },
        ],
      },

      'equine-medicine': {
        code: '3106510', nameTh: 'อายุรศาสตร์และศัลยศาสตร์ม้า', nameEn: 'Equine Medicine and Surgery', credits: 3,
        slot: { day: 'พฤหัสบดี', time: '09:00–12:00', room: 'VET6 807' },
        sources: [MCV_PRINT('3106510', 2569), RECORDINGS, CLASS_LINE, FACULTY_ROOM],
        papers: { midterm: {}, final: {} },
        assessment: {
          items: [
            { label: 'สอบกลางภาค', pct: 40 },
            { label: 'สอบปลายภาค', pct: 50 },
            { label: 'การเข้าเรียน', pct: 10 },
          ],
        },
        notes: [
          { text: 'หัวข้อในการสอบกลางภาคปรับได้ตามความเหมาะสมกับช่วงเวลาของการเรียน', source: 'ประมวลรายวิชา' },
          { text: 'ส่วน POA ของปลายภาคเป็นข้อสอบรวมที่ดึงได้ทุกหัวข้อ รวมหัวข้อที่สอบกลางภาคแล้ว', source: classLine('2026-09-16') },
        ],
        sessions: [
          { date: '2026-08-06', time: '09:00–09:30', held: true, title: 'Intro to Eq Med/Sur, Vet in Sport Event, Eq ID and Tack', lecturers: [TEERAPOL], topics: ['equine-intro'] },
          { date: '2026-08-06', time: '09:30–12:00', held: true, title: 'Equine feed, nutrition and stable management (วิทยากรรับเชิญ ฐาปนา จารุธรรมศิริ)', lecturers: [TEERAPOL], topics: ['equine-nutrition'] },
          { date: '2026-08-13', time: '09:00–10:30', held: true, title: 'Eq Restraint, Physical examination and BCS evaluation', lecturers: [SAWITA], topics: [] },
          { date: '2026-08-13', time: '10:30–12:00', held: true, title: 'Eq drug administration', lecturers: [SAWITA], topics: [] },
          { date: '2026-08-20', held: true, title: 'Equine Dentistry and Oral surgery', lecturers: [TEERAPOL], topics: ['equine-dentistry'] },
          { date: '2026-08-27', planned: ['2026-08-27', '2026-09-03'], held: true, title: 'GI1: Equine digestive anatomy and G.I. examination (u/s, rectal), GI2: Management of GI disorder + Equine Colic', lecturers: [SAWITA], topics: ['equine-gi', 'equine-colic-bestfit'] },
          { date: '2026-09-10', held: true, title: 'Parasite in horses', lecturers: ['ปิยนันท์ ทวีถาวรสวัสดิ์'], topics: ['equine-parasites'] },
          { date: '2026-09-17', held: true, title: 'Equine respiratory diseases', lecturers: [TEERAPOL], topics: ['equine-respi'] },
          { date: '2026-10-01', held: true, title: 'Equine ophthalmology', lecturers: ['นลินี ตันติวนิช'], topics: ['equine-ophth'], change: classLine('2026-09-30', 'เรียนออนไลน์ทั้งหมด') },
          { date: '2026-10-08', planned: ['2026-10-08', '2026-10-29'], held: true, title: 'Equine Dermatology, wound management', lecturers: [SAWITA], topics: ['equine-derm', 'equine-surgery-wound'] },
          { date: '2026-10-15', held: true, title: 'Equine infectious disease, vaccination, Biosecurity and Biosafety', lecturers: [TEERAPOL], topics: ['equine-infectious'] },
          { date: '2026-10-22', planned: ['2026-10-22', '2026-10-29'], held: true, title: 'Concept of equine surgery, Equine anesthesia, analgesia and euthanasia', lecturers: [SAWITA], topics: ['equine-surgery-wound', 'equine-anesthesia'] },
          { date: '2026-11-05', title: 'Lameness 1: Lameness exam and hoof, diagnostic analgesia', lecturers: [TEERAPOL], topics: ['equine-lameness', 'equine-hoof'] },
          { date: '2026-11-12', title: 'Lameness 2: Pathology and treatment of lame horse', lecturers: [TEERAPOL], topics: ['equine-lameness'] },
          { date: '2026-11-16', time: '10:30–12:00', title: 'POA case discussion', lecturers: [TEERAPOL], topics: ['equine-poa'] },
          { date: '2026-11-19', time: '09:00–10:30', title: 'Exercise related disease', lecturers: [TEERAPOL], topics: ['equine-exercise'] },
        ],
      },

      'equine-repro': {
        code: '3108515', nameTh: 'วิทยาการสืบพันธุ์ม้า', nameEn: 'Equine Reproduction', credits: 1,
        slot: { day: 'พฤหัสบดี', time: '13:00–14:00', room: 'VET6 807' },
        sources: [MCV_PRINT('3108515', 2569), RECORDINGS, CLASS_LINE, FACULTY_ROOM],
        papers: { midterm: {}, final: {} },
        notes: [{ text: 'ก่อนสอบกลางภาคเรียนครั้งละ 2 lectures ตามที่ อ.ธีรวัฒน์ ชี้แจงในคาบแรก และไม่มีเรียนวันที่ 3, 10 และ 17 ก.ย.', source: classLine('2026-08-19') }],
        sessions: [
          { date: '2026-08-06', planned: ['2026-08-06', '2026-08-13'], held: true, title: 'บทนำ กายวิภาคและการทำหน้าที่ของระบบสืบพันธุ์เพศเมีย, วงรอบการเป็นสัดและการควบคุมวงรอบการเป็นสัด', lecturers: [THARASANIT], topics: ['eqrepro-anatomy-cycle'] },
          { date: '2026-08-20', planned: ['2026-08-20', '2026-08-27'], held: true, title: 'การตรวจระบบสืบพันธุ์ม้าเพศเมีย, เทคโนโลยีชีวภาพทางการสืบพันธุ์ในม้าเพศเมีย', lecturers: [THARASANIT], topics: ['eqrepro-exam-mare', 'eqrepro-art-female'] },
          { date: '2026-08-27', planned: ['2026-09-03', '2026-09-10'], held: true, title: 'โรคติดเชื้อที่สำคัญในม้าเพศเมีย, ภาวะความไม่สมบูรณ์พันธุ์และการวินิจฉัย', lecturers: [THARASANIT], topics: ['eqrepro-mare-infect', 'eqrepro-infertility'] },
          { date: '2026-10-01', held: true, title: 'ภาวะเยื่อบุมดลูกอักเสบในม้า', lecturers: [SWANGCHAN], topics: ['eqrepro-endometritis'] },
          { date: '2026-10-08', planned: ['2026-09-17', '2026-10-08'], held: true, title: 'กายวิภาคและการทำหน้าที่ของระบบสืบพันธุ์ กระบวนการสร้างอสุจิ, การตรวจระบบสืบพันธุ์ม้าเพศผู้ทางคลินิก', lecturers: [THARASANIT], topics: ['eqrepro-male'] },
          { date: '2026-10-15', planned: ['2026-10-15', '2026-10-22'], held: true, title: 'เทคโนโลยีการเก็บน้ำเชื้อและการผสมเทียม, โรคติดเชื้อที่สำคัญของม้าเพศผู้', lecturers: [THARASANIT], topics: ['eqrepro-ai', 'eqrepro-stallion-infect'], note: clip('Semen collection and insemination + Infertility problem in stallion') },
          { date: '2026-10-29', title: 'ศัลยกรรมที่สำคัญของม้าเพศผู้และเพศเมีย', lecturers: [SAWITA], topics: ['eqrepro-surgery'], change: classLine('2026-10-23', 'เนื้อหาอายุรศาสตร์ม้าของวันนี้สอนไปแล้ว จึงเรียนส่วนของ อ.ศวิตา ทั้งหมดแทนตั้งแต่เช้า ถ้าสอนเช้าเสร็จทันก็ไม่มีบ่าย') },
          { date: '2026-10-29', planned: '2026-11-05', title: 'การตั้งท้องและการคลอด การดูแลลูกม้าหลังคลอด', lecturers: [SAWITA], topics: ['eqrepro-pregnancy'] },
          { date: '2026-10-29', planned: '2026-11-12', title: 'ความผิดปกติของการคลอด และปัญหาหลังคลอดในม้า', lecturers: [SAWITA], topics: ['eqrepro-postpartum'] },
        ],
      },

      'zoonoses': {
        code: '3109504', nameTh: 'โรคติดต่อระหว่างสัตว์และคน', nameEn: 'Zoonoses', credits: 3,
        coordinator: KAMONPAN,
        slot: { day: 'ศุกร์', time: '09:00–12:00', room: 'ห้อง 807 ตึก 60 ปี' },
        sources: [{ title: 'ตารางเรียนวิชาโรคติดต่อระหว่างสัตว์และคน ปีการศึกษา 2569', where: 'myCourseVille', checked: CHECKED }, RECORDINGS, CLASS_LINE],
        papers: { midterm: {}, final: {} },
        assessment: {
          items: [
            { label: 'การเข้าเรียนและการมีส่วนร่วมในชั้นเรียน', pct: 10 },
            { label: 'รายงาน Zoonotic Disease Report', pct: 10 },
            { label: 'สอบกลางภาคและสอบปลายภาค', pct: 80 },
          ],
        },
        notes: [{ text: 'รายงาน Zoonotic Disease Report ส่งทาง myCourseVille ภายใน 4 ธ.ค. 69 เวลา 23:59 น.', source: classLine('2026-09-29') }],
        sessions: [
          { date: '2026-08-07', held: true, title: 'Introduction to zoonoses and Viral Zoonoses I (Influenza virus)', lecturers: ['อลงกร อมรศิลป์', 'นภวัลย์ บรรพพงศ์', 'สุภณัฐ บุญญาภิสิทธิโสภา', 'สุพัศมา ไชยวงศ์', KAMONPAN], topics: ['zoo-intro', 'zoo-ai-basic', 'zoo-siv-civ'] },
          { date: '2026-08-14', held: true, title: 'Vector-Borne Viral Zoonosis, Ebola, Nipah Virus', lecturers: ['วลีมาศ ใจรักษ์', 'ชนกันต์ นาสำราญ', KAMONPAN], topics: ['zoo-vbz', 'zoo-ebola-nipah'], change: classLine('2026-08-14', 'เริ่ม 10:00 ส่วน coronavirus ย้ายไป 28 ส.ค.') },
          { date: '2026-08-21', held: true, title: 'Comprehensive Rabies Control in Thailand: Outbreak Monitoring, Surveillance, Prevention, and Management', lecturers: ['อรปวีณ์ สการะเศรณี', KAMONPAN], topics: ['zoo-rabies'] },
          { date: '2026-08-28', planned: ['2026-08-14', '2026-08-28'], held: true, title: 'Emerging and Undetected Zoonotic Viruses, Viral zoonoses II: coronavirus', lecturers: ['นวพล เตชะเกรียงไกร', 'วลีมาศ ใจรักษ์', KAMONPAN], topics: ['zoo-eid-cuvet', 'zoo-corona'] },
          { date: '2026-09-04', held: true, title: 'Epidemiological Investigation of Zoonotic Outbreaks in Thailand: Lessons Learned and Future Preparedness', lecturers: ['พีริยะ วตะกูลสิน', KAMONPAN], topics: ['zoo-outbreak'] },
          { date: '2026-09-10', planned: '2026-09-11', held: true, title: 'Parasitic zoonoses (Helminth)', lecturers: ['ปิยนันท์ ทวีถาวรสวัสดิ์'], topics: ['zoo-helminthic'], change: classLine('2026-09-10', 'อาจารย์สอนต่อในคาบเช้าวันนี้ จึงไม่มีเรียนเช้าวันพรุ่งนี้ (11 ก.ย.)'), note: clip('Helminthic zoonoses') },
          { date: '2026-09-10', time: '13:00–16:00', planned: '2026-08-28', held: true, title: 'Rickettsia zoonosis', lecturers: [KAMONPAN], topics: ['zoo-rickettsial'], change: classLine('2026-09-02', 'เนื้อหาที่อาจารย์สอนไม่ทันและยังไม่ได้สอน ย้ายมาสอนวันนี้ 13:00–16:00') },
          { date: '2026-09-18', held: true, title: 'Parasitic zoonoses (Protozoa)', lecturers: ['วรพร สุขุมาวาสี'], topics: ['zoo-protozoal'] },
          { date: '2026-10-02', held: true, title: 'Mycozoonoses', lecturers: [SUPHACHAI], topics: ['zoo-mycoses'], change: classLine('2026-10-01', 'เรียนออนไซต์ เริ่มราว 09:30') },
          { date: '2026-10-16', kind: 'holiday', title: 'วันหยุดราชการ', lecturers: [], topics: [] },
          { date: '2026-10-23', kind: 'holiday', title: 'วันหยุดราชการ', lecturers: [], topics: [] },
          { date: '2026-10-27', kind: 'makeup', held: true, title: 'เรียนชดเชยช่วงบ่าย (ยังไม่ทราบหัวข้อ)', lecturers: [], topics: [], change: classLine('2026-10-27', 'วันนี้ช่วงบ่ายมีเรียนชดเชยของวิชา Zoonoses') },
          { date: '2026-10-30', title: 'Bacterial zoonoses I', lecturers: [TARADOL], topics: ['zoo-bacterial'] },
          { date: '2026-11-06', title: 'Bacterial zoonoses II', lecturers: [TARADOL], topics: ['zoo-bacterial'] },
          { date: '2026-11-13', title: 'Prion zoonoses', lecturers: [TARADOL], topics: ['zoo-prion'] },
          { date: '2026-11-13', planned: '2026-10-09', title: 'Epidemiological approach to zoonoses', lecturers: [SAHA], topics: ['zoo-epi-approach'], change: classLine('2026-09-30', 'วันที่ 9 ต.ค. ไม่มีเรียน ย้ายมาสอนวันนี้') },
          { date: '2026-11-20', title: 'Emerging threat', lecturers: ['ไพศิลป์ เล็กเจริญ', KAMONPAN, 'วิทยากร'], topics: ['zoo-eid-wildlife'] },
        ],
      },

      'swine-clinic': {
        code: '3107507', nameTh: 'อายุรศาสตร์สุกร', nameEn: 'Swine Medicine', credits: 2,
        coordinator: PA,
        slot: { day: 'ศุกร์', time: '13:00–15:00', room: 'ห้อง 807' },
        sources: [{ title: 'ประกาศตารางสอนวิชาอายุรศาสตร์สุกร (2 ก.ค. 69)', where: 'myCourseVille', checked: CHECKED }, RECORDINGS, CLASS_LINE],
        papers: { midterm: {}, final: {} },
        sessions: [
          { date: '2026-08-14', held: true, title: 'โรคระบบทางเดินหายใจจากเชื้อไวรัส: โรคไข้หวัดใหญ่สุกร โรคโคโรนาไวรัส โรคไซโตเมกาโลไวรัส', lecturers: [AN], topics: ['swine-resp-viral'] },
          { date: '2026-08-21', planned: ['2026-08-07', '2026-08-21'], held: true, title: 'โรคระบบทางเดินอาหารจากเชื้อไวรัส: โรคทีจีอี โรคพีอีดี โรคโรตาไวรัส, โรคระบบประสาท: โรคพิษสุนัขบ้า โรคเอ็นเซฟาโลมายโลคาร์ไดติส โรคบาดทะยัก โรคลิสเทอริโอซิส', lecturers: [AN], topics: ['swine-gi-viral', 'swine-cns'] },
          { date: '2026-08-28', held: true, title: 'โรคระบบทางเดินหายใจจากเชื้อแบคทีเรีย 1: โรคปอดและเยื่อหุ้มปอดอักเสบ (เอพีพี) โรคพาสเจอเรลโลซิส โรคโพรงจมูกอักเสบติดต่อ', lecturers: [PA], topics: ['swine-pornchalit-set'] },
          { date: '2026-09-04', held: true, title: 'โรคระบบทางเดินหายใจจากเชื้อแบคทีเรีย 2: โรคเกล๊สเซอร์ โรคสเตร็ปโตค็อคโคซิสในสุกร', lecturers: [PA], topics: ['swine-pornchalit-set'] },
          { date: '2026-09-11', time: '13:00–16:00', held: true, title: 'โรคระบบทางเดินหายใจจากเชื้อแบคทีเรีย 3: โรคมัยโคพลาสมาในสุกร', lecturers: [PA], topics: ['swine-pornchalit-set'] },
          { date: '2026-09-11', time: '13:00–16:00', planned: '2026-09-18', held: true, title: 'โรคระบบกล้ามเนื้อ กระดูกและการเคลื่อนไหว', lecturers: [PA], topics: ['swine-pornchalit-set'], change: classLine('2026-09-10', 'วันนี้ 13:00–16:00 สอน 2 หัวข้อที่ต้องเรียนก่อนสอบกลางภาค และไม่มีเรียนวันที่ 18 ก.ย.') },
          { date: '2026-10-01', time: '14:00–16:00', planned: '2026-10-23', held: true, title: 'โรคระบบทางเดินอาหารจากเชื้อแบคทีเรีย 1: โรคบิดมูกเลือด โรคอิลิไอติส โรคคลอสตริเดียม โรคเยอซิเนีย', lecturers: [SW], topics: ['swine-ileitis-bacti'], note: clip('Swine enteric diseases'), change: classLine('2026-08-25', '16 และ 23 ต.ค. เป็นวันหยุด เรียนชดเชย 1 ต.ค. และ 7 ต.ค. เวลา 14:00') },
          { date: '2026-10-02', time: '12:50–15:40', held: true, title: 'โรคระบบสืบพันธุ์ของแม่พันธุ์และพ่อพันธุ์: โรคพีอาร์อาร์เอส โรคพาร์โวไวรัส โรคบรูเซลโลซิส MMA', lecturers: [PA], topics: ['swine-repro'], note: clip('Reproductive diseases'), change: classLine('2026-10-01', 'เรียนออนไลน์') },
          { date: '2026-10-07', time: '14:00–16:00', planned: '2026-10-23', held: true, title: 'โรคระบบทางเดินอาหารจากเชื้อแบคทีเรีย (ต่อ)', lecturers: [SW], topics: ['swine-ileitis-bacti'], note: clip('Yersinia') },
          { date: '2026-10-09', held: true, title: 'โรคพีอาร์อาร์เอส', lecturers: [PA], topics: ['swine-repro'], note: clip('Porcine reproductive and respiratory syndrome') },
          { date: '2026-10-09', title: 'แนวทางการจัดการควบคุมป้องกันโรคระบาดในสุกร แนวทางการตรวจวินิจฉัยโรคสุกร', lecturers: [PA], topics: ['swine-control-dx'], dayUnknown: true, note: 'ยังไม่มีคลิปหรือประกาศว่าหัวข้อนี้สอนวันไหน' },
          { date: '2026-10-16', title: 'โรคปากและเท้าเปื่อย โรคเซอร์โคไวรัส โรคทริปาโนโซโมซิสของสุกร โรคทริคิโนซิส โรคหนอนพยาธิ', lecturers: [SW], topics: ['swine-fmd', 'swine-pcv2', 'swine-trichinosis'], dayUnknown: true, note: '16 ต.ค. เป็นวันหยุด ยังไม่มีคลิปหรือประกาศว่าหัวข้อนี้สอนวันไหน' },
          { date: '2026-10-30', title: 'โรคระบบทางเดินอาหารจากเชื้อแบคทีเรีย 2: โรคโคไลบาซิลโลซิส โรคแคมพิโลแบคเตอร์', lecturers: [SW], topics: ['swine-ileitis-bacti'] },
          { date: '2026-11-06', title: 'โรคอหิวาต์แอฟริกาในสุกร โรคอหิวาต์สุกร', lecturers: [RK], topics: ['swine-asf', 'swine-csf'] },
          { date: '2026-11-13', title: 'โรคพิษสุนัขบ้าเทียม โรคสมองอักเสบนิปาห์ โรคสมองอักเสบแจแปนิส', lecturers: [RK], topics: ['swine-prv-je'] },
          { date: '2026-11-20', title: 'โรคติดเชื้อจากสไปโรขีตอื่นๆ โรคผิวหนังของสุกร: โรคกรีสซีพิก โรคฝีดาษ โรคระบบการไหลเวียนโลหิตที่เกิดจากพยาธิเม็ดเลือด (บรรยาย 4 ชั่วโมง)', lecturers: [RK], topics: ['swine-greasypig'] },
        ],
      },
    },
  },
};
