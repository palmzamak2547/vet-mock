// ============================================================
// course-syllabi.js: each course's own syllabus and teaching plan, per term
// ============================================================
// Keyed term (SEMESTER.id), then year, then subject id, as the wrap-ups and
// lecturer sets are, so next term's syllabi are one more key and last term's
// stay readable. The downloadable syllabus and teaching timetable
// (lib/course-docs.js, share-card/course-doc-card.js) print from here, and
// the per-term teaching map planned for after the 2569-1 finals reads the
// same rows: a session's date, its lecturers, the topics it taught.
//
// Every row traces to a document named in its course's `sources`, read on
// the date given there. Dates are 'YYYY-MM-DD', times 'HH:MM–HH:MM' and only
// where the document prints one (the weekly `slot` covers the rest).
// Lecturer names are as the document prints them, without academic titles.
// Thai is kept as printed; only spelling slips are corrected.
//
// - `topics`: curriculum topic ids the session taught (empty when no topic
//   holds it). The unit test checks each against its topic's examScope.
// - `paper`: set only where the evidence moves a session off the side of the
//   midterm its date puts it on (null: examined on neither paper).
// - `kind`: 'holiday' and 'activity' rows are printed but examine nothing.
// - `change`: a move or cancellation announced in the class LINE group
//   (posted date given), printed beside the session it changes.
// - `papers`: the written papers the faculty timetable holds for the course;
//   `to`/`from` only where the course's document states the window itself.
// ============================================================

const CHECKED = '2026-11-01';
const MCV_PRINT = (code, year) => ({ title: `ประมวลรายวิชา ${code} ปีการศึกษา ${year}`, where: 'myCourseVille', checked: CHECKED });
// Where a course's own document gives no room: the faculty's weekly timetable (CLASS_TIMETABLE.y5).
const FACULTY_ROOM = { title: 'ห้องเรียนตามตารางเรียนของคณะ', where: 'คณะ', checked: CHECKED };

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
export const CLASS_LINE_UNTIL = '2026-10-28';

export const SYLLABI = {
  '2569-1': {
    5: {
      'epidemiology': {
        code: '3107508', nameTh: 'ระบาดวิทยาและเวชศาสตร์ป้องกันทางการสัตวแพทย์', nameEn: 'Veterinary Epidemiology and Preventive Medicine', credits: 3,
        slot: { day: 'จันทร์', time: '10:00–12:00 บรรยาย, 13:00–15:00 ปฏิบัติการ', room: 'VET6 807' },
        sources: [MCV_PRINT('3107508', 2569), FACULTY_ROOM],
        papers: { final: {} },
        sessions: [
          { date: '2026-08-03', title: 'Introduction to Epidemiology, Basic concept in Epidemiology, Concept of disease transmission, Concept of Causal Association', lecturers: [NIWAT, THANICHA], topics: ['epidem-intro', 'epidem-basic-concepts', 'epidem-disease-transmission', 'epidem-causation'], change: classLine('2026-07-27', 'คาบ อ.นิวัตร เหลือ 10:00–11:00 และเรียนชดเชย 10 ส.ค. 09:00–12:00') },
          { date: '2026-08-10', title: 'Measurement of Disease Frequency, Diagnostic and screening test, Agreement of Test', lecturers: [VACHIRA], topics: ['epidem-disease-frequency', 'epidem-dx-screening', 'epidem-test-agreement'] },
          { date: '2026-08-17', title: 'Study designs, Sample size determination', lecturers: [CHAIDATE, THANICHA], topics: ['epidem-observational-study', 'epidem-sample-size'] },
          { date: '2026-08-24', title: 'Animal Disease Surveillance and Monitoring, Outbreak investigation', lecturers: [SAHA], topics: ['epidem-surveillance', 'epidem-outbreak-investigation'] },
          { date: '2026-08-31', title: 'Principle of Disease prevention, control and eradication, Government Policy and Practice on Disease prevention, control and eradication', lecturers: [NIWAT], topics: ['epidem-control-prevention', 'epidem-govt-policy'] },
          { date: '2026-09-07', title: 'Applied statistic for Epidemiology, Epidemiology data analysis', lecturers: [THANICHA], topics: ['epidem-applied-stats', 'epidem-data-analysis'] },
          { date: '2026-09-14', title: 'Intro. to Module and Software, Epidemiology Application in Current Research', lecturers: [CHAIDATE], topics: ['epidem-software', 'epidem-current-research'], change: classLine('2026-09-14', 'ช่วงบ่ายไม่มีเรียน ให้ศึกษาเองผ่าน dashboard ใน myCourseVille') },
          { date: '2026-09-28', title: 'Emerging Infectious Diseases & Pandemic Preparedness, Introduction to Economics and Decision Tools for Veterinary Epidemiology', lecturers: [THANICHA], topics: ['epidem-eid-pandemic', 'epidem-economics'], paper: null, change: classLine('2026-09-27', 'เนื้อหาที่เรียนวันที่ 28 ก.ย. ไม่ออกสอบ') },
          { date: '2026-10-05', title: 'Module 1: Consideration of Diagnostic tool for Epi. Approach', lecturers: EPID_STAFF, topics: [] },
          { date: '2026-10-12', title: 'Module 2: Observational study', lecturers: EPID_STAFF, topics: [] },
          { date: '2026-10-19', title: 'Module 2: Observational study', lecturers: EPID_STAFF, topics: [] },
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
        sources: [MCV_PRINT('3107520', 2569), { title: 'หน้า Schedule (ผู้สอนรายคาบ)', where: 'myCourseVille', checked: CHECKED }, FACULTY_ROOM],
        papers: { midterm: {}, final: {} },
        assessment: {
          items: [
            { label: 'สอบกลางภาค', pct: 49, parts: [[ARANYA, 18], ['ผู้แทน CPF', 3], [THANIDA, 14], [PATHARAPOL, 14]] },
            { label: 'สอบปลายภาค', pct: 46, parts: [[`${ARANYA} (ส่วน มกอช.)`, 6], [THANIDA, 14], [PATHARAPOL, 21], [WORAYANEE, 5]] },
            { label: 'รายงาน พ.ร.บ.โรคระบาดสัตว์', pct: 5 },
          ],
        },
        notes: [{ text: 'การเช็กชื่อและควิซในคาบ อ.ภัทรพล คิดเป็น 20% ของคะแนนสอบส่วนของอาจารย์', source: classLine('2026-08-20') }],
        sessions: [
          { date: '2026-08-04', title: 'Aquaculture in Thailand, Aquaculture Industry & Technology', lecturers: [ARANYA, THANIDA, PATHARAPOL, 'ผู้แทน CPF'], topics: ['aqua-intro-thailand'] },
          { date: '2026-08-11', title: 'Fish Biology & Aquatic Management Practice', lecturers: [ARANYA], topics: ['aqua-fish-biology'] },
          { date: '2026-08-18', title: 'Water and Soil Quality Management in Aquaculture', lecturers: [THANIDA, PATHARAPOL], topics: ['aqua-water-quality', 'aqua-life-support'] },
          { date: '2026-08-25', title: 'Shrimp Biology & Culture, Fish & Shrimp Immunology', lecturers: [PATHARAPOL], topics: ['aqua-shrimp-immunology'] },
          { date: '2026-09-01', title: 'Ornamental Fish Medicine', lecturers: [ARANYA], topics: ['aqua-ornamental'] },
          { date: '2026-09-08', title: 'Aquatic Amphibian Medicine', lecturers: [THANIDA, PATHARAPOL], topics: ['aqua-amphibian', 'aqua-frog-diseases'] },
          { date: '2026-09-15', title: 'Aquatic Reptile Medicine', lecturers: [THANIDA], topics: ['aqua-turtle'] },
          { date: '2026-09-29', title: 'Diseases in Fish and Shrimp Culture 1', lecturers: [PATHARAPOL], topics: ['aqua-fish-diseases', 'aqua-shrimp-diseases'] },
          { date: '2026-10-06', title: 'Diseases in Fish and Shrimp Culture 2', lecturers: [PATHARAPOL], topics: ['aqua-fish-diseases', 'aqua-shrimp-diseases'] },
          { date: '2026-10-13', title: 'Biosecurity & Disease Control in Aquaculture, The Role of Aquatic Veterinarians in the International Community', lecturers: [PATHARAPOL], topics: ['aqua-shrimp-diseases', 'aqua-disease-control'], change: classLine('2026-08-20', '13 ต.ค. เป็นวันหยุด ย้ายไปเรียน 17 พ.ย. ราว 1 ชั่วโมงก่อนการนำเสนอ') },
          { date: '2026-10-20', title: 'Aquarium Management & Medicine', lecturers: [THANIDA], topics: ['aqua-aquarium-vet'] },
          { date: '2026-10-27', title: 'Conservation Aquatic Animal Management & Medicine', lecturers: [THANIDA], topics: ['aqua-conservation'] },
          { date: '2026-11-03', title: 'Aquatic toxicology and aquatic animal impact', lecturers: [WORAYANEE], topics: ['aqua-toxicology'] },
          { date: '2026-11-10', title: 'Aquatic Animal Diseases Regulation & Involving Organizations', lecturers: [ARANYA, THANIDA, PATHARAPOL, 'ผู้แทน มกอช.'], topics: ['aqua-disease-control'] },
          { date: '2026-11-17', title: 'Aquatic animal disease in Animal Epidemics Act 2558 (นิสิตนำเสนอผลงาน)', lecturers: ['นิสิตนำเสนอหน้าชั้นเรียน'], topics: ['aqua-disease-control'] },
        ],
      },

      'avian-medicine': {
        code: '3107510', nameTh: 'อายุรศาสตร์สัตว์ปีก', nameEn: 'Avian Medicine', credits: 2,
        coordinator: NATAYA,
        slot: { day: 'อังคาร', time: '13:00–16:00', room: 'ห้อง 807' },
        sources: [{ title: 'ตารางเรียนวิชา Avian Medicine ปีการศึกษา 2569', where: 'myCourseVille', checked: CHECKED }],
        papers: { midterm: { to: '2026-09-15' }, final: { from: '2026-10-06' } },
        assessment: {
          items: [
            { label: 'สอบกลางภาค', pct: 54, parts: [[JIROJ, 8], [SOMSAK, 15], [NATAYA, 23], [KRIENG, 8]] },
            { label: 'สอบปลายภาค', pct: 46, parts: [[JIROJ, 15], [NIWAT, 15], [KRIENG, 16]] },
          ],
        },
        sessions: [
          { date: '2026-08-04', title: 'Newcastle Disease, Infectious Bronchitis, Infectious Laryngotracheitis, Avian Metapneumovirus Infection, Avian Pox', lecturers: [NATAYA], topics: ['avian-nd', 'avian-ib', 'avian-lt', 'avian-mpv', 'avian-pox'] },
          { date: '2026-08-11', title: 'Mycoplasmosis', lecturers: [SOMSAK], topics: ['avian-myco'] },
          { date: '2026-08-18', title: 'Infectious Coryza, Fowl Cholera, E. coli Infections', lecturers: [SOMSAK], topics: ['avian-coryza', 'avian-fowl-cholera', 'avian-coli'] },
          { date: '2026-08-25', title: 'Introduction to Avian Medicine, Avian Influenza, Egg breakout analysis', lecturers: [JIROJ], topics: ['avian-intro', 'avian-ai', 'avian-egg-breakout'] },
          { date: '2026-09-01', title: 'Infectious Bursal Disease, Neoplastic Diseases, Chicken Infectious Anemia, Reovirus Infections', lecturers: [NATAYA], topics: ['avian-ibd', 'avian-marek', 'avian-cia', 'avian-reo'] },
          { date: '2026-09-08', title: 'Runting and Stunting Syndrome, Coccidiosis, Necrotic Enteritis, Leukocytozoonosis, Avian Malaria', lecturers: [NATAYA], topics: ['avian-rss', 'avian-cocci', 'avian-ne', 'avian-leuko', 'avian-malaria'] },
          { date: '2026-09-15', title: 'Avian Salmonellosis, Adenovirus Infections, Avian Encephalomyelitis, Omphalitis, Ascites, Staphylococcosis', lecturers: [KRIENG], topics: ['avian-salmonella', 'avian-adeno', 'avian-ae', 'avian-ahra-set'] },
          { date: '2026-09-29', kind: 'activity', title: 'Activities with Hipra', lecturers: [KRIENG], topics: [], change: classLine('2026-09-28', 'วันนี้ไม่มีคาบเรียน กิจกรรมจาก HIPRA ย้ายไป 17 พ.ย.') },
          { date: '2026-10-06', title: 'Duck Virus Enteritis, Duck Virus Hepatitis, New Duck Syndrome', lecturers: [KRIENG], topics: ['avian-duck-plague', 'avian-dvh', 'avian-nds'] },
          { date: '2026-10-20', title: 'Goose Parvovirus Infection, Duck Flavivirus Infection', lecturers: [KRIENG], topics: ['avian-goose-parvo', 'avian-duck-flavi'] },
          { date: '2026-10-27', title: 'Mycotic Infections, Mycotoxicosis', lecturers: [NIWAT], topics: ['avian-mycosis'], change: classLine('2026-08-29', 'ย้ายไปเรียนวันจันทร์ 19 และ 26 ต.ค. 09:00–10:00') },
          { date: '2026-11-03', title: 'Ornithobacteriosis, Campylobacteriosis, Listeriosis, Histomoniasis', lecturers: [NIWAT], topics: ['avian-ort', 'avian-campy', 'avian-listeria', 'avian-histomoniasis'] },
          { date: '2026-11-10', title: 'Vaccines, vaccination and vaccination programs', lecturers: [JIROJ], topics: ['avian-vaccine-prog'] },
          { date: '2026-11-17', title: 'Serology Interpretation', lecturers: [JIROJ], topics: ['avian-serology'] },
        ],
      },

      'poa-clinical': {
        code: '3107522', nameTh: 'การแก้ไขปัญหาทางคลินิกอายุรศาสตร์สัตว์เลี้ยง', nameEn: 'Clinical Problem Solving in Companion Animal Medicine', credits: 1,
        coordinator: VACHIRA,
        slot: { day: 'พุธ', time: '08:00–09:00', room: 'VET6 807' },
        sources: [MCV_PRINT('3107522', 2569), FACULTY_ROOM],
        papers: {},
        notes: [{ text: 'ไม่มีสอบกลางภาคและปลายภาคในตารางสอบของคณะ', source: 'ตารางสอบของคณะ' }],
        sessions: [
          { date: '2026-08-05', title: 'Introduction to Problem Oriented Approach', lecturers: [VACHIRA], topics: ['poa-intro'] },
          { date: '2026-08-19', title: 'Approach to vomiting and regurgitating patient', lecturers: ['ปุญญมณี แหยมเกตุ'], topics: ['poa-vomiting'], change: classLine('2026-08-19', 'งดเรียน เรียนชดเชยวันพฤหัสบดี 20 ส.ค. เริ่ม 15:00') },
          { date: '2026-08-26', title: 'Approach to diarrhea patient', lecturers: ['ชูติรัตน์ ต่อสหะกุล'], topics: ['poa-diarrhea'] },
          { date: '2026-09-02', title: 'Approach to patient with Effusion, edema, abdominal enlargement', lecturers: ['สิริลักษณ์ สุรเชษฐพงษ์'], topics: ['poa-edema'] },
          { date: '2026-09-09', title: 'Approach to patient with cough, sneeze, nasal discharge', lecturers: ['ณัฐวรรณ ตั้งมหากุล'], topics: ['poa-respiratory'] },
          { date: '2026-09-16', title: 'Approach to Anorexia, weight loss patient', lecturers: ['ปุญญมณี แหยมเกตุ'], topics: ['poa-anorexia'] },
          { date: '2026-09-30', title: 'Approach to patient with pale mucous membrane, anemia', lecturers: [VACHIRA], topics: ['poa-pale-mm'] },
          { date: '2026-10-07', title: 'Approach to jaundice patient', lecturers: ['กฤษฎา บุญอร่ามเรือง'], topics: ['poa-jaundice'] },
          { date: '2026-10-14', title: 'Approach to patient with red urine, bleeding disorder', lecturers: [VACHIRA], topics: ['poa-red-urine'] },
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
        sources: [{ title: 'ตารางสอนวิชาสุขศาสตร์น้ำนมและเนื้อสัตว์ ปีการศึกษา 2569', where: 'myCourseVille', checked: CHECKED }],
        papers: { midterm: {}, final: {} },
        sessions: [
          { date: '2026-08-05', title: 'ความปลอดภัยทางชีวภาพเพื่อการผลิตน้ำนมคุณภาพดี', en: 'Farm biosecurity for good milk quality production', lecturers: ['จักรกริศน์ เนื่องจำนงค์'], topics: ['milk-biosec-dairy'] },
          { date: '2026-08-12', kind: 'holiday', title: 'วันหยุด', lecturers: [], topics: [] },
          { date: '2026-08-19', title: 'บทนำสุขศาสตร์น้ำนม, ผลกระทบของโรคเต้านมอักเสบต่อคุณภาพน้ำนม', en: 'Introduction to Milk Hygiene, Cow mastitis and milk quality', lecturers: [RUNGTIP], topics: ['milk-overview', 'milk-mastitis'] },
          { date: '2026-08-26', title: 'การรักษาคุณภาพและการขนส่งน้ำนมดิบ, การตรวจคุณภาพน้ำนมดิบและผลิตภัณฑ์', en: 'Milk storage and transportation, Determination of milk quality', lecturers: [RUNGTIP], topics: ['milk-raw-storage', 'milk-products-storage', 'milk-quality-determination'], change: classLine('2026-08-27', 'เนื้อหาการตรวจคุณภาพน้ำนมที่ยังไม่จบ สอนต่อในคาบ 2 ก.ย.') },
          { date: '2026-09-02', title: 'ส่วนประกอบและคุณภาพน้ำนมดิบ, มาตรฐานน้ำนมดิบและผลิตภัณฑ์นม', en: 'Composition and quality of raw milk, Standard of raw milk and dairy products', lecturers: [SAHA], topics: ['milk-quality-composition', 'milk-raw-std'] },
          { date: '2026-09-09', title: 'จุลชีววิทยาน้ำนม, จุลินทรีย์ก่อโรคและโรคที่ติดต่อทางน้ำนม', en: 'Milk microbiology, Milk borne pathogens and diseases', lecturers: [SAHA], topics: ['milk-microbiology', 'milk-borne-pathogens'] },
          { date: '2026-09-16', title: 'มาตรฐานศูนย์รวบรวมน้ำนมและมาตรฐานโรงงานแปรรูปน้ำนมและผลิตภัณฑ์นม (GMP/HACCP), เทคโนโลยีการแปรรูปน้ำนมและการผลิตน้ำนม', en: 'GMP and HACCP standards for milk collecting center and milk processing plants, Processing and manufacturing technologies for milk and milk products', lecturers: [SAHA], topics: ['milk-industry-std', 'milk-processing'] },
          { date: '2026-09-30', title: 'การทำความสะอาดและการฆ่าเชื้อโรคในศูนย์รวบรวมน้ำนมและโรงงานแปรรูป', en: 'Cleaning and sanitizing in milk collecting facilities and milk processing plants', lecturers: [SAHA], topics: ['milk-cleaning'] },
          { date: '2026-10-07', title: 'บทนำสุขศาสตร์เนื้อสัตว์, การเสื่อมคุณภาพของอาหารที่มาจากสัตว์น้ำและสารพิษในสัตว์น้ำ', en: 'Introduction to meat hygiene, Deterioration of aquatic-derived food and aquatic toxins', lecturers: [SIRAWIT], topics: ['meat-hygiene-intro', 'meat-seafood'] },
          { date: '2026-10-14', title: 'จุลินทรีย์ที่ก่อให้เกิดการเน่าเสียและเกิดโรคที่ติดต่อผ่านเนื้อสัตว์ และมาตรฐานทางจุลชีววิทยาของเนื้อสัตว์, การเก็บตัวอย่าง การตรวจเนื้อสัตว์ทางจุลชีววิทยา และการควบคุมจุลินทรีย์ที่ปนเปื้อนในเนื้อสัตว์', en: 'Spoilage- and disease-causing microorganisms in meat and meat microbiological standards, Sampling, microbiological examination and contamination control in meat', lecturers: [TARADOL], topics: ['meat-microbiology'] },
          { date: '2026-10-21', title: 'การเก็บรักษาเนื้อสัตว์และผลิตภัณฑ์, อนามัยเนื้อสัตว์, การใช้เทคนิคด้านอณูชีววิทยาในการตรวจคุณภาพและการรับรองเนื้อสัตว์', en: 'Storage of meat and meat products, Meat wholesomeness, Use of molecular techniques for meat quality and authentication', lecturers: [RUNGTIP], topics: ['meat-storage', 'meat-quality', 'meat-molecular'] },
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
        sources: [{ title: 'ตารางเรียนวิชาสุขภาพหนึ่งเดียว (One Health) ปีการศึกษา 2569', where: 'myCourseVille', checked: CHECKED }],
        papers: { midterm: {}, final: {} },
        notes: [{ text: 'ตัดเกรดอิงเกณฑ์ สัดส่วนกลางภาคและปลายภาคตามจำนวนชั่วโมงเรียน (กลางภาค 6 คาบ ปลายภาค 8 คาบ)', source: classLine('2026-10-28') }],
        sessions: [
          { date: '2026-08-05', title: 'Role of veterinarians in One Health', lecturers: [SAHA], topics: ['oh-vet-role'] },
          { date: '2026-08-12', kind: 'holiday', title: 'วันหยุด (The Queen Mother’s birthday)', lecturers: [], topics: [] },
          { date: '2026-08-19', title: 'One World - One Health concept', lecturers: [SIRAWIT], topics: ['oh-concept'] },
          { date: '2026-08-26', title: 'One Health approach to combat emerging and re-emerging diseases', lecturers: [KAMONPAN, 'อลงกร อมรศิลป์'], topics: ['oh-disease-prevention'] },
          { date: '2026-09-02', title: 'Global One Health activity network', lecturers: [SAHA], topics: ['oh-global-network'] },
          { date: '2026-09-09', title: 'One Health communication skills', lecturers: [SIRAWIT], topics: ['oh-communication'] },
          { date: '2026-09-16', title: 'Transdisciplinary collaboration and partnership in One Health issues', lecturers: [SIRAWIT], topics: ['oh-collaboration'], change: classLine('2026-09-09', 'วันที่ 16 ก.ย. ไม่มีเรียน') },
          { date: '2026-09-30', title: 'One Health approach to combat foodborne diseases', lecturers: [TARADOL], topics: ['oh-foodborne'] },
          { date: '2026-10-07', title: 'Animal and human health risk analysis', lecturers: [SUPHACHAI], topics: ['oh-risk-analysis'] },
          { date: '2026-10-14', title: 'One Health approach to combat antimicrobial resistance (online)', lecturers: [RUNGTIP], topics: ['oh-amr'] },
          { date: '2026-10-21', title: 'One Health approach to address environmental health risks I', lecturers: [WORAYANEE], topics: ['oh-env-carcinogen'] },
          { date: '2026-10-28', title: 'One Health approach to address environmental health risks II', lecturers: [WORAYANEE], topics: ['oh-env-mutagen'] },
          { date: '2026-11-04', title: 'One Health perspective of food and feed GMOs', lecturers: [WORAYANEE], topics: ['oh-gmo'] },
          { date: '2026-11-11', title: 'Application of One Health approach for livestock waste management', lecturers: [SIRAWIT], topics: ['oh-livestock-waste'] },
          { date: '2026-11-18', title: 'Import risk assessment', lecturers: [SUPHACHAI], topics: ['oh-import-risk'] },
        ],
      },

      'food-industry': {
        code: '3109501', nameTh: 'อุตสาหกรรมอาหารและการควบคุมคุณภาพ', nameEn: 'Food Industry and Quality Control', credits: 1,
        coordinator: SIRAWIT,
        slot: { day: 'พุธ', time: '14:00–16:00', room: 'VET6 807' },
        sources: [
          { title: 'ตารางเรียน Course Agenda (Updated Sep29) ปีการศึกษา 2569', where: 'myCourseVille', checked: CHECKED },
          MCV_PRINT('3109501', 2569), FACULTY_ROOM,
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
          { date: '2026-08-19', time: '14:00–16:00', title: 'บทนำ จุดมุ่งหมายและการประเมินผลรายวิชา การคุ้มครองด้านสุขภาพและการสาธารณสุข', lecturers: [SIRAWIT], topics: ['fiqc-intro'] },
          { date: '2026-08-26', time: '14:00–16:00', title: 'การควบคุมคุณภาพอาหารสัตว์', lecturers: [SIRAWIT], topics: ['fiqc-feed-qc'] },
          { date: '2026-09-02', time: '14:00–16:00', title: 'การควบคุมกระบวนการฆ่าและการจำหน่ายเนื้อสัตว์', lecturers: [SIRAWIT], topics: ['fiqc-slaughter-qc'] },
          { date: '2026-09-09', time: '14:00–16:00', title: 'การควบคุมคุณภาพในกระบวนการผลิตปศุสัตว์', lecturers: ['มินตรา ลักขณา'], topics: ['fiqc-livestock-qc'] },
          { date: '2026-10-14', time: '14:00–16:00', title: 'ระบบการวิเคราะห์อันตรายและจุดวิกฤตที่ต้องควบคุม (HACCP)', lecturers: ['สมพิศ จุลลาบุตรดี'], topics: ['fiqc-haccp'] },
          { date: '2026-10-14', time: '16:00–18:00', title: 'มาตรฐานสินค้าปศุสัตว์เพื่อการส่งออก', lecturers: ['สมพิศ จุลลาบุตรดี'], topics: ['fiqc-poultry-export'] },
          { date: '2026-10-28', time: '14:00–16:00', title: 'การควบคุมคุณภาพสัตว์น้ำและผลิตภัณฑ์สัตว์น้ำ', lecturers: [SAHA], topics: ['fiqc-aquatic'] },
          { date: '2026-11-11', time: '14:00–16:00', title: 'การตรวจสอบและควบคุมคุณภาพเนื้อสัตว์และผลิตภัณฑ์ในอุตสาหกรรมอาหาร (การบรรยายเชิงปฏิบัติการ)', lecturers: ['VPH staff'], topics: [] },
        ],
      },

      'equine-medicine': {
        code: '3106510', nameTh: 'อายุรศาสตร์และศัลยศาสตร์ม้า', nameEn: 'Equine Medicine and Surgery', credits: 3,
        slot: { day: 'พฤหัสบดี', time: '09:00–12:00', room: 'VET6 807' },
        sources: [MCV_PRINT('3106510', 2569), FACULTY_ROOM],
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
          { date: '2026-08-06', time: '09:00–09:30', title: 'Intro to Eq Med/Sur, Vet in Sport Event, Eq ID and Tack', lecturers: [TEERAPOL], topics: ['equine-intro'] },
          { date: '2026-08-06', time: '09:30–12:00', title: 'Equine feed, nutrition and stable management (วิทยากรรับเชิญ ฐาปนา จารุธรรมศิริ)', lecturers: [TEERAPOL], topics: ['equine-nutrition'] },
          { date: '2026-08-13', time: '09:00–10:30', title: 'Eq Restraint, Physical examination and BCS evaluation', lecturers: [SAWITA], topics: [] },
          { date: '2026-08-13', time: '10:30–12:00', title: 'Eq drug administration', lecturers: [SAWITA], topics: [] },
          { date: '2026-08-20', title: 'Equine Dentistry and Oral surgery', lecturers: [TEERAPOL], topics: ['equine-dentistry'] },
          { date: '2026-08-27', title: 'GI1: Equine digestive anatomy and G.I. examination (u/s, rectal)', lecturers: [SAWITA], topics: ['equine-gi'] },
          { date: '2026-09-03', title: 'GI2: Management of GI disorder + Equine Colic', lecturers: [SAWITA], topics: ['equine-gi', 'equine-colic-bestfit'] },
          { date: '2026-09-10', title: 'Parasite in horses', lecturers: ['ปิยนันท์ ทวีถาวรสวัสดิ์'], topics: ['equine-parasites'] },
          { date: '2026-09-17', title: 'Equine respiratory diseases', lecturers: [TEERAPOL], topics: ['equine-respi'] },
          { date: '2026-10-01', title: 'Equine ophthalmology', lecturers: ['นลินี ตันติวนิช'], topics: ['equine-ophth'] },
          { date: '2026-10-08', title: 'Equine Dermatology', lecturers: [SAWITA], topics: ['equine-derm'] },
          { date: '2026-10-15', title: 'Equine infectious disease, vaccination, Biosecurity and Biosafety', lecturers: [TEERAPOL], topics: ['equine-infectious'] },
          { date: '2026-10-22', title: 'Equine anesthesia, analgesia and euthanasia', lecturers: [SAWITA], topics: ['equine-anesthesia'] },
          { date: '2026-10-29', title: 'Concept of equine surgery and wound management', lecturers: [SAWITA], topics: ['equine-surgery-wound'] },
          { date: '2026-11-05', title: 'Lameness 1: Lameness exam and hoof, diagnostic analgesia', lecturers: [TEERAPOL], topics: ['equine-lameness', 'equine-hoof'] },
          { date: '2026-11-12', title: 'Lameness 2: Pathology and treatment of lame horse', lecturers: [TEERAPOL], topics: ['equine-lameness'] },
          { date: '2026-11-16', time: '10:30–12:00', title: 'POA case discussion', lecturers: [TEERAPOL], topics: ['equine-poa'] },
          { date: '2026-11-19', time: '09:00–10:30', title: 'Exercise related disease', lecturers: [TEERAPOL], topics: ['equine-exercise'] },
        ],
      },

      'equine-repro': {
        code: '3108515', nameTh: 'วิทยาการสืบพันธุ์ม้า', nameEn: 'Equine Reproduction', credits: 1,
        slot: { day: 'พฤหัสบดี', time: '13:00–14:00', room: 'VET6 807' },
        sources: [MCV_PRINT('3108515', 2569), FACULTY_ROOM],
        papers: { midterm: {}, final: {} },
        notes: [{ text: 'ก่อนสอบกลางภาคเรียนครั้งละ 2 lectures ตามที่ อ.ธีรวัฒน์ ชี้แจงในคาบแรก และไม่มีเรียนวันที่ 3, 10 และ 17 ก.ย.', source: classLine('2026-08-19') }],
        sessions: [
          { date: '2026-08-06', title: 'บทนำ กายวิภาคและการทำหน้าที่ของระบบสืบพันธุ์เพศเมีย', lecturers: [THARASANIT], topics: ['eqrepro-anatomy-cycle'] },
          { date: '2026-08-13', title: 'วงรอบการเป็นสัดและการควบคุมวงรอบการเป็นสัด', lecturers: [THARASANIT], topics: ['eqrepro-anatomy-cycle'] },
          { date: '2026-08-20', title: 'การตรวจระบบสืบพันธุ์ม้าเพศเมีย', lecturers: [THARASANIT], topics: ['eqrepro-exam-mare'] },
          { date: '2026-08-27', title: 'เทคโนโลยีชีวภาพทางการสืบพันธุ์ในม้าเพศเมีย', lecturers: [THARASANIT], topics: ['eqrepro-art-female'] },
          { date: '2026-09-03', title: 'โรคติดเชื้อที่สำคัญในม้าเพศเมีย', lecturers: [THARASANIT], topics: ['eqrepro-infertility'], change: classLine('2026-08-19', 'วันนี้ไม่มีเรียน'), note: 'อยู่ในเอกสาร lecture 5 and 6 ใน myCourseVille' },
          { date: '2026-09-10', title: 'ภาวะความไม่สมบูรณ์พันธุ์และการวินิจฉัย', lecturers: [THARASANIT], topics: ['eqrepro-infertility'], change: classLine('2026-08-19', 'วันนี้ไม่มีเรียน'), note: 'อยู่ในเอกสาร lecture 5 and 6 ใน myCourseVille' },
          // No session on 17 Sep (class LINE), and the clinical exam of the
          // stallion sits in the deck "Lecture 8 9 Anatomy function and clinical
          // exam stallion", taught with the 8 Oct session after the midterm.
          { date: '2026-09-17', title: 'การตรวจระบบสืบพันธุ์ม้าเพศผู้ทางคลินิก', lecturers: [THARASANIT], topics: ['eqrepro-male'], paper: 'final', change: classLine('2026-08-19', 'วันนี้ไม่มีเรียน'), note: 'อยู่ในเอกสาร Lecture 8 9 ใน myCourseVille ซึ่งสอนหลังสอบกลางภาค' },
          { date: '2026-10-01', title: 'ภาวะเยื่อบุมดลูกอักเสบในม้า', lecturers: [SWANGCHAN], topics: ['eqrepro-endometritis'] },
          { date: '2026-10-08', title: 'กายวิภาคและการทำหน้าที่ของระบบสืบพันธุ์ กระบวนการสร้างอสุจิ', lecturers: [THARASANIT], topics: ['eqrepro-male'] },
          { date: '2026-10-15', title: 'เทคโนโลยีการเก็บน้ำเชื้อและการผสมเทียม', lecturers: [THARASANIT], topics: ['eqrepro-ai'] },
          { date: '2026-10-22', title: 'โรคติดเชื้อที่สำคัญของม้าเพศผู้', lecturers: [THARASANIT], topics: ['eqrepro-stallion-infect'] },
          { date: '2026-10-29', title: 'ศัลยกรรมที่สำคัญของม้าเพศผู้และเพศเมีย', lecturers: [SAWITA], topics: ['eqrepro-surgery'] },
          { date: '2026-11-05', title: 'การตั้งท้องและการคลอด การดูแลลูกม้าหลังคลอด', lecturers: [SAWITA], topics: ['eqrepro-pregnancy'] },
          { date: '2026-11-12', title: 'ความผิดปกติของการคลอด และปัญหาหลังคลอดในม้า', lecturers: [SAWITA], topics: ['eqrepro-postpartum'] },
        ],
      },

      'zoonoses': {
        code: '3109504', nameTh: 'โรคติดต่อระหว่างสัตว์และคน', nameEn: 'Zoonoses', credits: 3,
        coordinator: KAMONPAN,
        slot: { day: 'ศุกร์', time: '09:00–12:00', room: 'ห้อง 807 ตึก 60 ปี' },
        sources: [{ title: 'ตารางเรียนวิชาโรคติดต่อระหว่างสัตว์และคน ปีการศึกษา 2569', where: 'myCourseVille', checked: CHECKED }],
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
          { date: '2026-08-07', title: 'Introduction to zoonoses and Viral Zoonoses I (Influenza virus)', lecturers: ['อลงกร อมรศิลป์', 'นภวัลย์ บรรพพงศ์', 'สุภณัฐ บุญญาภิสิทธิโสภา', 'สุพัศมา ไชยวงศ์', KAMONPAN], topics: ['zoo-intro', 'zoo-ai-basic', 'zoo-siv-civ'] },
          { date: '2026-08-14', title: 'Viral zoonoses II: coronavirus, Vector-Borne Viral Zoonosis, Ebola, Nipah Virus', lecturers: ['วลีมาศ ใจรักษ์', 'ชนกันต์ นาสำราญ', KAMONPAN], topics: ['zoo-corona', 'zoo-vbz', 'zoo-ebola-nipah'], change: classLine('2026-08-14', 'เริ่ม 10:00 เรียน Vector-borne และ Ebola, Nipah ส่วน coronavirus ย้ายไป 28 ส.ค.') },
          { date: '2026-08-21', title: 'Comprehensive Rabies Control in Thailand: Outbreak Monitoring, Surveillance, Prevention, and Management', lecturers: ['อรปวีณ์ สการะเศรณี', KAMONPAN], topics: ['zoo-rabies'] },
          { date: '2026-08-28', title: 'Emerging and Undetected Zoonotic Viruses and Rickettsia zoonosis', lecturers: ['นวพล เตชะเกรียงไกร', KAMONPAN], topics: ['zoo-eid-cuvet', 'zoo-rickettsial'] },
          { date: '2026-09-04', title: 'Epidemiological Investigation of Zoonotic Outbreaks in Thailand: Lessons Learned and Future Preparedness', lecturers: ['พีริยะ วตะกูลสิน', KAMONPAN], topics: ['zoo-outbreak'] },
          { date: '2026-09-11', title: 'Parasitic zoonoses (Helminth)', lecturers: ['ปิยนันท์ ทวีถาวรสวัสดิ์'], topics: ['zoo-helminthic'] },
          { date: '2026-09-18', title: 'Parasitic zoonoses (Protozoa)', lecturers: ['วรพร สุขุมาวาสี'], topics: ['zoo-protozoal'] },
          { date: '2026-10-02', title: 'Mycozoonoses', lecturers: [SUPHACHAI], topics: ['zoo-mycoses'] },
          { date: '2026-10-09', title: 'Epidemiological approach to zoonoses', lecturers: [SAHA], topics: ['zoo-epi-approach'], change: classLine('2026-09-30', 'วันที่ 9 ต.ค. ไม่มีเรียน ย้ายไปสอน 13 พ.ย.') },
          { date: '2026-10-16', kind: 'holiday', title: 'วันหยุดราชการ', lecturers: [], topics: [] },
          { date: '2026-10-23', kind: 'holiday', title: 'วันหยุดราชการ', lecturers: [], topics: [] },
          { date: '2026-10-30', title: 'Bacterial zoonoses I', lecturers: [TARADOL], topics: ['zoo-bacterial'] },
          { date: '2026-11-06', title: 'Bacterial zoonoses II', lecturers: [TARADOL], topics: ['zoo-bacterial'] },
          { date: '2026-11-13', title: 'Prion zoonoses', lecturers: [TARADOL], topics: ['zoo-prion'] },
          { date: '2026-11-20', title: 'Emerging threat', lecturers: ['ไพศิลป์ เล็กเจริญ', KAMONPAN, 'วิทยากร'], topics: ['zoo-eid-wildlife'] },
        ],
      },

      'swine-clinic': {
        code: '3107507', nameTh: 'อายุรศาสตร์สุกร', nameEn: 'Swine Medicine', credits: 2,
        coordinator: PA,
        slot: { day: 'ศุกร์', time: '13:00–15:00', room: 'ห้อง 807' },
        sources: [{ title: 'ประกาศตารางสอนวิชาอายุรศาสตร์สุกร (2 ก.ค. 69)', where: 'myCourseVille', checked: CHECKED }],
        papers: { midterm: {}, final: {} },
        sessions: [
          { date: '2026-08-07', title: 'โรคระบบทางเดินอาหารจากเชื้อไวรัส: โรคทีจีอี โรคพีอีดี โรคโรตาไวรัส', lecturers: [AN], topics: ['swine-gi-viral'] },
          { date: '2026-08-14', title: 'โรคระบบทางเดินหายใจจากเชื้อไวรัส: โรคไข้หวัดใหญ่สุกร โรคโคโรนาไวรัส โรคไซโตเมกาโลไวรัส', lecturers: [AN], topics: ['swine-resp-viral'] },
          { date: '2026-08-21', title: 'โรคระบบประสาท: โรคพิษสุนัขบ้า โรคเอ็นเซฟาโลมายโลคาร์ไดติส โรคบาดทะยัก โรคลิสเทอริโอซิส', lecturers: [AN], topics: ['swine-cns'] },
          { date: '2026-08-28', title: 'โรคระบบทางเดินหายใจจากเชื้อแบคทีเรีย 1: โรคปอดและเยื่อหุ้มปอดอักเสบ (เอพีพี) โรคพาสเจอเรลโลซิส โรคโพรงจมูกอักเสบติดต่อ', lecturers: [PA], topics: ['swine-pornchalit-set'] },
          { date: '2026-09-04', title: 'โรคระบบทางเดินหายใจจากเชื้อแบคทีเรีย 2: โรคเกล๊สเซอร์ โรคสเตร็ปโตค็อคโคซิสในสุกร', lecturers: [PA], topics: ['swine-pornchalit-set'] },
          { date: '2026-09-11', title: 'โรคระบบทางเดินหายใจจากเชื้อแบคทีเรีย 3: โรคมัยโคพลาสมาในสุกร', lecturers: [PA], topics: ['swine-pornchalit-set'] },
          { date: '2026-09-18', title: 'โรคระบบกล้ามเนื้อ กระดูกและการเคลื่อนไหว', lecturers: [PA], topics: ['swine-pornchalit-set'] },
          { date: '2026-10-02', title: 'โรคระบบสืบพันธุ์ของแม่พันธุ์และพ่อพันธุ์: โรคพีอาร์อาร์เอส โรคพาร์โวไวรัส โรคบรูเซลโลซิส MMA', lecturers: [PA], topics: ['swine-repro'] },
          { date: '2026-10-09', title: 'แนวทางการจัดการควบคุมป้องกันโรคระบาดในสุกร แนวทางการตรวจวินิจฉัยโรคสุกร', lecturers: [PA], topics: ['swine-control-dx'] },
          { date: '2026-10-16', title: 'โรคปากและเท้าเปื่อย โรคเซอร์โคไวรัส โรคทริปาโนโซโมซิสของสุกร โรคทริคิโนซิส โรคหนอนพยาธิ', lecturers: [SW], topics: ['swine-fmd', 'swine-pcv2', 'swine-trichinosis'], change: classLine('2026-08-25', '16 ต.ค. เป็นวันหยุดกรณีพิเศษในกรุงเทพฯ เรียนชดเชย 1 ต.ค. และ 7 ต.ค. เวลา 14:00') },
          { date: '2026-10-23', title: 'โรคระบบทางเดินอาหารจากเชื้อแบคทีเรีย 1: โรคบิดมูกเลือด โรคอิลิไอติส โรคคลอสตริเดียม โรคเยอซิเนีย', lecturers: [SW], topics: ['swine-ileitis-bacti'], change: classLine('2026-08-25', '23 ต.ค. วันปิยมหาราช เรียนชดเชย 1 ต.ค. และ 7 ต.ค. เวลา 14:00') },
          { date: '2026-10-30', title: 'โรคระบบทางเดินอาหารจากเชื้อแบคทีเรีย 2: โรคโคไลบาซิลโลซิส โรคแคมพิโลแบคเตอร์', lecturers: [SW], topics: ['swine-ileitis-bacti'] },
          { date: '2026-11-06', title: 'โรคอหิวาต์แอฟริกาในสุกร โรคอหิวาต์สุกร', lecturers: [RK], topics: ['swine-asf', 'swine-csf'] },
          { date: '2026-11-13', title: 'โรคพิษสุนัขบ้าเทียม โรคสมองอักเสบนิปาห์ โรคสมองอักเสบแจแปนิส', lecturers: [RK], topics: ['swine-prv-je'] },
          { date: '2026-11-20', title: 'โรคติดเชื้อจากสไปโรขีตอื่นๆ โรคผิวหนังของสุกร: โรคกรีสซีพิก โรคฝีดาษ โรคระบบการไหลเวียนโลหิตที่เกิดจากพยาธิเม็ดเลือด (บรรยาย 4 ชั่วโมง)', lecturers: [RK], topics: ['swine-greasypig'] },
        ],
      },
    },
  },
};
