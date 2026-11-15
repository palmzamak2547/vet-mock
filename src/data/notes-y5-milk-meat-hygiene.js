// ============================================================
// Y5 Milk Hygiene & Meat Inspection (3107518) Study Notes
// ============================================================
// ทุก section อ้างอิง lecture slide ตรง (pages 1-3 outline / TOC)
// — ไม่เขียนจากความจำ — เนื้อหา medical detail เพิ่มทีหลังเมื่อ
// อ่าน slide ครบทั้งไฟล์ ตอนนี้เก็บเฉพาะ heading + objectives
// + outline เพื่อให้ทวนเป็น scaffold ก่อน
//
// Lecturers (curriculum + slide cover pages):
//   SJ = Saharuetai Jeamsripong (Vet Public Health) — composition/std/micro/path/processing/cleaning
//   RC = Rungtip Chuanchuen (Vet Public Health, course coord.) — intro/mastitis/storage/quality/meat-wholesomeness/molecular
//   SP = Sirawit Pagdepanichkit (Vet Public Health) — meat intro/seafood/slaughter/AM-PM/cutting-grading
//   TL = Taradon Luangtongkum (Vet Public Health) — meat microbiology
//   CN = จักรกริศน์ เนื่องจำนงค์ (Animal Husbandry) — biosecurity on dairy farm
//   SC = Suphachai (initials only on slide) — egg microbiology
//
// Body item types:
//   string                                — paragraph
//   { bullets: [string] }                 — bulleted list
//   { sub, body }                         — sub-section
//   { callout, kind }                     — kind: 'tip'|'warn'|'flag'
// ============================================================

export const NOTES_Y5_MILK_MEAT_HYGIENE = {
  // ─────────────────────────────────────────────────────────────
  // MILK HALF
  // ─────────────────────────────────────────────────────────────
  'milk-overview': {
    topic: 'milk-overview',
    title: 'Milk Hygiene & Meat Inspection — course overview',
    lecturer: 'Course coordinator: Rungtip Chuanchuen',
    icon: '📖',
    summary: 'ตารางสอน 3109503 ปีการศึกษา 2569 (4 ส.ค. ถึง 9 ธ.ค.) ครึ่งแรกสุขศาสตร์น้ำนม ครึ่งหลังสุขศาสตร์เนื้อสัตว์ สอบกลางภาค 21-25 ก.ย. 2569 ออกเฉพาะครึ่งน้ำนม',
    sections: [
      {
        heading: 'Course identity',
        source: 'ตารางสอนวิชาสุขศาสตร์น้ำนมและเนื้อสัตว์ (3109503) ภาคต้น 2569 หน้า 1',
        body: [
          { bullets: [
            'รหัสวิชา **3109503** สุขศาสตร์น้ำนมและเนื้อสัตว์',
            'ภาควิชาสัตวแพทยสาธารณสุข คณะสัตวแพทยศาสตร์ จุฬาลงกรณ์มหาวิทยาลัย',
            'นิสิตสัตวแพทย์ ชั้นปีที่ 5 ภาคการศึกษาต้น ปีการศึกษา 2569',
            'วันที่สอน 4 ส.ค. ถึง 9 ธ.ค. 2569 เวลา 09.00-12.00 น. ห้อง 807 ตึก 60 ปี',
            'ผู้ประสานรายวิชา **ศ.สพ.ญ.ดร. รุ่งทิพย์ ชวนชื่น** (Rungtip Chuanchuen)',
          ] },
        ],
      },
      {
        heading: 'สุขศาสตร์น้ำนม — ขอบเขตสอบกลางภาค',
        source: 'ตารางสอน 3109503 ภาคต้น 2569 หน้า 1',
        body: [
          { bullets: [
            '5 ส.ค. — Farm biosecurity for good milk quality production (รศ.น.สพ.ดร. จักรกริศน์ เนื่องจำนงค์)',
            '12 ส.ค. — วันหยุด',
            '19 ส.ค. — Introduction to Milk Hygiene + Cow mastitis and milk quality (RC)',
            '26 ส.ค. — Milk storage and transportation + Determination of milk quality (RC)',
            '2 ก.ย. — Composition and quality of raw milk + Standard of raw milk and dairy products (SJ)',
            '9 ก.ย. — Milk microbiology + Milk borne pathogens and diseases (SJ)',
            '16 ก.ย. — GMP and HACCP standards for milk collecting center and milk processing plants + Processing and manufacturing technologies for milk and milk products (SJ)',
            '**21-25 ก.ย. 2569 — สอบกลางภาค (Midterm)**',
          ] },
          { callout: 'ปี 2569 ย้าย Farm biosecurity มาเป็นคาบแรก (5 ส.ค.) และ Introduction กับ Mastitis ไปอยู่ 19 ส.ค. ต่างจากตารางปี 2567 ที่ Introduction มาก่อน', kind: 'tip' },
        ],
      },
      {
        heading: 'สุขศาสตร์เนื้อสัตว์ — ขอบเขตสอบปลายภาค',
        source: 'ตารางสอน 3109503 ภาคต้น 2569 หน้า 1-2',
        body: [
          { bullets: [
            '30 ก.ย. — Cleaning and sanitizing in milk collecting facilities and milk processing plants (SJ)',
            '7 ต.ค. — Introduction to meat hygiene + Deterioration of aquatic-derived food and aquatic toxins (อ.น.สพ.ดร. สิรวิทย์ ภักดีพาณิชย์กิจ)',
            '14 ต.ค. — Spoilage- and disease-causing microorganisms in meat and meat microbiological standards + Sampling, microbiological examination and contamination control in meat (ผศ.น.สพ.ดร. ธราดล เหลืองทองคำ)',
            '21 ต.ค. — Storage of meat and meat products + Meat wholesomeness + Use of molecular techniques for meat quality and authentication (RC)',
            '28 ต.ค. — Pest and vector control in slaughterhouses + Egg hygiene (ศ.น.สพ.ดร. ศุภชัย เนื้อนวลสุวรรณ)',
            '4 พ.ย. — Slaughterhouse hygiene + Slaughterhouse design and slaughtering process (สิรวิทย์)',
            '11 พ.ย. — Antemortem and postmortem meat inspection (สิรวิทย์)',
            '18 พ.ย. — Postmortem changes + Meat cutting and grading (สิรวิทย์)',
            '**23 พ.ย. ถึง 4 ธ.ค. 2569 — สอบปลายภาค (Final)**',
          ] },
          { callout: 'Cleaning and sanitizing (30 ก.ย.) อยู่หลังสอบกลางภาค จึงนับเป็นเนื้อหาปลายภาค ไม่ใช่กลางภาค', kind: 'warn' },
        ],
      },
      {
        heading: 'Department affiliations on syllabus',
        source: 'ตารางสอน 3109503 ภาคต้น 2569 เชิงอรรถหน้า 2',
        body: [
          { bullets: [
            'ภาควิชาสัตวแพทยสาธารณสุข — รุ่งทิพย์ (RC), สหฤทัย (SJ), สิรวิทย์ (SP), ธราดล (TL), ศุภชัย',
            'ภาควิชาสัตวบาล — จักรกริศน์ เนื่องจำนงค์ (คาบ Farm biosecurity)',
          ] },
        ],
      },
    ],
  },

  // ─────────────────────────────────────────────────────────────
  'milk-quality-composition': {
    topic: 'milk-quality-composition',
    title: 'Composition & quality of raw milk',
    lecturer: 'Saharuetai Jeamsripong (SJ)',
    icon: '🥛',
    summary: 'องค์ประกอบน้ำนมขึ้นกับ breed/สุขภาพ/lactation stage/diet/farm practice/processing/distribution, แยก property 3 กลุ่ม chemical/physicochemical/physical.',
    sections: [
      {
        heading: 'Lecturer & lecture identity',
        source: '1 - _Milk_quality_and_composition_SJ_2024.pdf p.1',
        body: [
          { bullets: [
            'หัวข้อ: **Composition and quality of raw milk** (lecture #1 ของ SJ ในรายวิชา)',
            'ผู้สอน: **รศ.สพ.ญ.ดร. สหฤทัย เจียมศรีพงษ์** (Saharuetai Jeamsripong, DVM, MPVM, PhD)',
            'Dept. of Veterinary Public Health, Faculty of Veterinary Science, Chulalongkorn University',
          ] },
        ],
      },
      {
        heading: 'Factors affecting milk composition',
        source: '1 - _Milk_quality_and_composition_SJ_2024.pdf p.2',
        body: [
          { bullets: [
            '**Breed of the cow**',
            '**Animal health**',
            '**Lactation stage**',
            '**Diet**',
            'Farm practice',
            'Milk processing',
            'Milk distribution',
          ] },
          { callout: 'Slide แบ่ง 2 บล็อก: (1) ปัจจัยฝั่งสัตว์ → composition, (2) ปัจจัยฝั่งคน/ระบบ → quality.', kind: 'tip' },
        ],
      },
      {
        heading: 'Milk composition — 3 property categories',
        source: '1 - _Milk_quality_and_composition_SJ_2024.pdf p.3',
        body: [
          { bullets: [
            '**Chemical property** — สัดส่วน fat / protein / lactose / minerals / vitamins',
            '**Physicochemical property** — pH, density, freezing point, acidity, titratable acidity',
            '**Physical property** — สี, กลิ่น, viscosity, sediment',
          ] },
          { bullets: ['🚧 รอเติม — detail composition แต่ละ category อ่านจาก slide หน้าหลังๆ'] },
        ],
      },
    ],
  },

  // ─────────────────────────────────────────────────────────────
  'milk-raw-std': {
    topic: 'milk-raw-std',
    title: 'Standard of raw milk & dairy products',
    lecturer: 'Saharuetai Jeamsripong (SJ)',
    icon: '📜',
    summary: 'มาตรฐานน้ำนมดิบของไทย (มกษ. 6003-2553) + ประกาศ สธ. ฉบับ 350/406/352 — เป้าหมายเพื่อ consumer protection + zoonosis prevention + adulteration control + ราคาเป็นธรรมกับเกษตรกร.',
    sections: [
      {
        heading: 'Lecture identity',
        source: '2 - _Raw_milk_and_milk_products_standard_SJ_2024.pdf p.1',
        body: [
          { bullets: [
            'หัวข้อ: **Standard of raw milk and dairy products** (SJ lecture #2)',
            'ผู้สอน: Saharuetai Jeamsripong — Dept. of Veterinary Public Health, CU',
          ] },
        ],
      },
      {
        heading: 'Objectives of milk quality determination',
        source: '2 - _Raw_milk_and_milk_products_standard_SJ_2024.pdf p.2',
        body: [
          { sub: 'For consumer protection',
            body: [
              { bullets: [
                'Prevent **zoonotic diseases**',
                'Prevent spread of infectious diseases',
                'Control **milk adulteration**',
                'Prevent contaminated milk served to **children** (sensitive consumer group)',
              ] },
            ] },
          { sub: 'For public/governmental agencies',
            body: [
              { bullets: ['Ensure health & nutritional status of people is protected from contaminated milk'] },
            ] },
          { sub: 'For farmers',
            body: [
              { bullets: ['Raw milk quality assurance → **a fair price in accordance with milk quality**'] },
            ] },
        ],
      },
      {
        heading: 'Thai regulatory framework — 2 ministries',
        source: '2 - _Raw_milk_and_milk_products_standard_SJ_2024.pdf p.3',
        body: [
          { sub: 'Ministry of Agriculture and Cooperatives — มาตรฐาน "น้ำนมโคดิบ"',
            body: [
              { bullets: [
                'ประกาศกระทรวงเกษตรและสหกรณ์, **มกษ. 6003-2553** (Thai Agricultural Standard) — เรื่อง น้ำนมโคดิบ',
                'ออกโดยสำนักงานมาตรฐานสินค้าเกษตรและอาหารแห่งชาติ (มกอช.)',
              ] },
            ] },
          { sub: 'Ministry of Public Health — มาตรฐาน "นมโค" และ "ผลิตภัณฑ์ของนม"',
            body: [
              { bullets: [
                'ประกาศกระทรวงสาธารณสุข **ฉบับที่ 350** พ.ศ. 2556 — นมโค',
                'ประกาศกระทรวงสาธารณสุข **ฉบับที่ 406** พ.ศ. 2562 — นมโค (ฉบับที่ 2)',
                'ประกาศกระทรวงสาธารณสุข **ฉบับที่ 352** พ.ศ. 2556 — ผลิตภัณฑ์ของนม',
              ] },
            ] },
        ],
      },
      {
        heading: 'Standard parameters (raw milk)',
        source: '2 - _Raw_milk_and_milk_products_standard_SJ_2024.pdf p.3+',
        body: [
          { bullets: ['🚧 รอเติม — ค่ามาตรฐาน (% fat, SNF, SCC, TBC, freezing point, antibiotic residue) ดึงจาก slide หน้า 4 เป็นต้นไป'] },
        ],
      },
    ],
  },

  // ─────────────────────────────────────────────────────────────
  'milk-biosec-dairy': {
    topic: 'milk-biosec-dairy',
    title: 'Biosecurity on dairy farms',
    lecturer: 'รศ.น.สพ.ดร. จักรกริศน์ เนื่องจำนงค์ (Animal Husbandry)',
    icon: '🐄',
    summary: 'การขอมาตรฐานฟาร์มเลี้ยงสัตว์ → มาตรฐานฟาร์มโคนม + แพะนม, เน้น workflow สมัคร–ฝึกอบรม–ตรวจฟาร์ม.',
    sections: [
      {
        heading: 'Lecture identity',
        source: '3 - 65ความปลอดภัยชีวภาพโคนม9.fin.pdf p.1',
        body: [
          { bullets: [
            'หัวข้อ: **ความปลอดภัยทางชีวภาพเพื่อการผลิตน้ำนมคุณภาพดี** (biosecurity for good milk quality production)',
            'ผู้สอน: **รศ.น.สพ.ดร. จักรกริศน์ เนื่องจำนงค์** — ภาควิชาสัตวบาล (ไม่ใช่ Vet Public Health), คณะสัตวแพทยศาสตร์, จุฬาฯ',
          ] },
        ],
      },
      {
        heading: 'Lecture outline (3 หัวข้อหลัก)',
        source: '3 - 65ความปลอดภัยชีวภาพโคนม9.fin.pdf p.2',
        body: [
          { bullets: [
            '**1. การขอมาตรฐานฟาร์มเลี้ยงสัตว์** (general standard application workflow)',
            '**2. มาตรฐานฟาร์มโคนม** (dairy cattle farm standard)',
            '**3. มาตรฐานฟาร์มแพะนม** (dairy goat farm standard)',
          ] },
        ],
      },
      {
        heading: 'Farm standard application workflow',
        source: '3 - 65ความปลอดภัยชีวภาพโคนม9.fin.pdf p.3',
        body: [
          { sub: 'แผนผังขั้นตอนการขอรับรองมาตรฐานฟาร์ม',
            body: [
              { bullets: [
                '**ผู้ประกอบการ** สมัครเข้ารับการฝึกอบรม "มาตรฐานฟาร์มเลี้ยงสัตว์สำหรับผู้ประกอบการ"',
                '**สำนักงานปศุสัตว์จังหวัด** รวบรวมรายชื่อผู้ประกอบการ',
                '**สำนักสุขศาสตร์สัตว์และสุขอนามัย** ฝึกอบรมผู้ประกอบการ',
                'ผู้ผ่านการฝึกอบรม → ยื่นคำขอรับรองมาตรฐานฟาร์ม (**แบบ ม.ฐ.ฟ.1**)',
                'สำนักงานปศุสัตว์จังหวัดตรวจสอบเอกสาร + คุณสมบัติ → ผ่าน/ไม่ผ่าน → ถ้าไม่ผ่านให้แก้ไขเอกสาร',
              ] },
            ] },
          { bullets: ['🚧 รอเติม — รายละเอียดมาตรฐานฟาร์มโคนม / แพะนม / biosecurity zone / sanitation อยู่ในหน้าถัดไป'] },
        ],
      },
    ],
  },

  // ─────────────────────────────────────────────────────────────
  'milk-mastitis': {
    topic: 'milk-mastitis',
    title: 'Mastitis & milk quality',
    lecturer: 'Rungtip Chuanchuen (RC)',
    icon: '🐄',
    summary: 'Mastitis = inflammation ของ mammary gland จาก microorganisms (ส่วนใหญ่ bacteria), invade ผ่าน teat canal → colonize secretory cells → toxin damage milk-producing cells.',
    sections: [
      {
        heading: 'Lecture identity',
        source: '5 - _RC_Milk_Mastitis_2024.pdf p.1',
        body: [
          { bullets: [
            'หัวข้อ: **Mastitis & milk quality**',
            'ผู้สอน: Rungtip Chuanchuen — Dept. of Veterinary Public Health, CU',
          ] },
        ],
      },
      {
        heading: 'Definition of mastitis',
        source: '5 - _RC_Milk_Mastitis_2024.pdf p.2',
        body: [
          { bullets: [
            '**Mastitis = an inflammation of mammary glands**',
            'Caused by **microorganisms — mainly bacteria**',
            'Pathway: pathogens → invade udder → multiply → produce toxins',
          ] },
        ],
      },
      {
        heading: 'Process of infection (4 steps)',
        source: '5 - _RC_Milk_Mastitis_2024.pdf p.3',
        body: [
          { bullets: [
            '1. Microorganisms invade the udder through **teat canal**',
            '2. Migrate up the teat canal and **colonize the secretory cells**',
            '3. Colonized organisms produce **toxic substances harmful to the milk-producing cells**',
            '4. Tissue damage → drop in milk yield + change in milk composition',
          ] },
        ],
      },
      {
        heading: 'Mastitis classification & pathogen list',
        source: '5 - _RC_Milk_Mastitis_2024.pdf p.4+',
        body: [
          { bullets: ['🚧 รอเติม — clinical vs sub-clinical, contagious vs environmental pathogen, SCC threshold, CMT, treatment'] },
        ],
      },
    ],
  },

  // ─────────────────────────────────────────────────────────────
  'milk-raw-storage': {
    topic: 'milk-raw-storage',
    title: 'Storage of raw milk',
    lecturer: 'Rungtip Chuanchuen (RC)',
    icon: '🧊',
    summary: 'จุดรับน้ำนม (small) → ศูนย์รวบรวมน้ำนม (MCC) → check คุณภาพเบื้องต้น (ชั่ง, ดมกลิ่น, ดูสี, ถ.พ., อุณหภูมิ) แล้วเก็บรักษาเย็น.',
    sections: [
      {
        heading: 'Lecture identity',
        source: '6_RC_Storage_of_raw_milk_2024.pdf p.1',
        body: [
          { bullets: [
            'หัวข้อ: **Storage of raw milk**',
            'ผู้สอน: Rungtip Chuanchuen — Dept. of Veterinary Public Health, CU',
          ] },
        ],
      },
      {
        heading: 'Milk collecting points (จุดรับน้ำนม)',
        source: '6_RC_Storage_of_raw_milk_2024.pdf p.2',
        body: [
          { bullets: [
            'จุดรับน้ำนมขนาดเล็ก → รับน้ำนมจากเกษตรกร เพื่อรอการนำส่ง MCC',
            'โค 1 ตัวจะรีดน้ำนมได้ไม่เกิน **10 ลิตร/วัน** (slide reference number) — ตัวเลขนี้เป็นเกณฑ์เชิงปฏิบัติของจุดรับน้ำนมขนาดเล็ก ไม่ใช่เพดานทางสรีรวิทยาของแม่โครีดนม',
            '⚠️ ในระบบการผลิตจริง โคนม Holstein ให้ผลผลิตสูงกว่านี้มาก (milk yield เฉลี่ย 36 ± 7.8 kg/วัน, PMID 30879826) จึงไม่ควรจำว่า 10 ลิตร/วัน คือความสามารถสูงสุดในการให้นมของโค 1 ตัว',
            'ตรวจคุณภาพเบื้องต้น: **ชั่งน้ำหนัก, ดมกลิ่น, ดูสี, วัดความถ่วงจำเพาะ, อุณหภูมิ**',
          ] },
        ],
      },
      {
        heading: 'Milk collecting centers (ศูนย์รวบรวมน้ำนม — MCC)',
        source: '6_RC_Storage_of_raw_milk_2024.pdf p.3',
        body: [
          { bullets: [
            'จุดศูนย์กลางรวบรวมน้ำนมจากฟาร์มต่างๆ',
            'สถานที่สำหรับตรวจคุณภาพน้ำนม',
            'หน้าที่หลัก: (1) ตัดสินและตรวจคุณภาพน้ำนมที่เกษตรกรนำส่ง (2) เก็บรักษาคุณภาพน้ำนมไว้ในสภาพที่ดี',
          ] },
        ],
      },
      {
        heading: 'Cold-chain principles & transport',
        source: '6_RC_Storage_of_raw_milk_2024.pdf p.4+',
        body: [
          { bullets: ['🚧 รอเติม — bulk tank ≤4°C, transport tanker, time-temperature limit, ageing test, plate cooler workflow'] },
        ],
      },
    ],
  },

  // ─────────────────────────────────────────────────────────────
  'milk-products-storage': {
    topic: 'milk-products-storage',
    title: 'Storage of milk products',
    lecturer: 'Rungtip Chuanchuen (RC)',
    icon: '🧊',
    summary: 'Dairy products = อาหารที่ผลิตจากนมสัตว์เลี้ยงลูกด้วยนม (cow หลัก, แพะ, แกะ, จามรี, อูฐ). 3 abnormalities หลัก: abnormal / undesirable / contaminated milk.',
    sections: [
      {
        heading: 'Lecture identity',
        source: '7_RC_Storage_of_milk_products_2024.pdf p.1',
        body: [
          { bullets: [
            'หัวข้อ: **Storage of milk products**',
            'ผู้สอน: Rungtip Chuanchuen',
          ] },
        ],
      },
      {
        heading: 'Dairy / milk products — definition',
        source: '7_RC_Storage_of_milk_products_2024.pdf p.2',
        body: [
          { bullets: [
            'Definition: food produced from the milk of mammals',
            'Usually **high energy-yielding food products**',
            'Primary sources: milk of **cows** (หลัก), goats, sheep, yaks, camels',
            '⚠️ เพิ่มจากหลักฐาน: โคให้ราว **83%** ของน้ำนมและผลิตภัณฑ์นมที่มนุษย์บริโภคทั่วโลก ที่เหลือมาจาก **buffalo (กระบือ)**, goat, sheep, camel และ **donkey/equine** สไลด์ไม่ได้ระบุ buffalo ซึ่งเป็นแหล่งน้ำนมสำคัญมากในเอเชีย ส่วน yak ไม่มีข้อมูลในแหล่งอ้างอิงนี้',
          ] },
        ],
      },
      {
        heading: 'Abnormalities of milk (3 categories)',
        source: '7_RC_Storage_of_milk_products_2024.pdf p.3',
        body: [
          { bullets: [
            '**Abnormal milk** — visibly changed in color, odor and/or texture',
            '**Undesirable milk** — expected to be unsuitable for sale prior to milking (e.g. **colostrum**)',
            '**Contaminated milk** — un-saleable / unfit for human consumption following treatment of the animal with veterinary products (e.g. **antibiotic residue**)',
          ] },
        ],
      },
      {
        heading: 'Storage methodology per product class',
        source: '7_RC_Storage_of_milk_products_2024.pdf p.4+',
        body: [
          { bullets: ['🚧 รอเติม — pasteurized vs UHT vs sterilized, cheese ripening temp, yogurt cold-chain, butter / cream shelf-life'] },
        ],
      },
    ],
  },

  // ─────────────────────────────────────────────────────────────
  'milk-quality-determination': {
    topic: 'milk-quality-determination',
    title: 'Determination of milk quality',
    lecturer: 'Rungtip Chuanchuen (RC)',
    icon: '🔬',
    summary: '3 เป้าหมาย — consumer protection + milk quality assurance + milk price assurance, ป้องกัน zoonosis / milk-borne disease / milk adulteration / abnormalities ใน infants.',
    sections: [
      {
        heading: 'Lecture identity',
        source: '8_Determination_of_milk_quality_2024.pdf p.1',
        body: [
          { bullets: [
            'หัวข้อ: **Determination of milk quality**',
            'ผู้สอน: Rungtip Chuanchuen — Dept. of Veterinary Public Health, CU',
          ] },
        ],
      },
      {
        heading: 'Objectives of milk quality determination',
        source: '8_Determination_of_milk_quality_2024.pdf p.2',
        body: [
          { bullets: [
            'Prevent **zoonosis**',
            'Prevent **milk adulteration**',
            'Prevent other diseases',
            'Prevent **milk-borne diseases** and abnormalities in **infants**',
          ] },
        ],
      },
      {
        heading: 'Three goals',
        source: '8_Determination_of_milk_quality_2024.pdf p.3',
        body: [
          { bullets: [
            '🛡️ **Consumer protection**',
            '✅ **Milk quality assurance**',
            '💵 **Milk price assurance** (เกษตรกรได้ราคาตามคุณภาพ)',
          ] },
        ],
      },
      {
        heading: 'Methods of milk quality testing',
        source: '8_Determination_of_milk_quality_2024.pdf p.4+',
        body: [
          { bullets: ['🚧 รอเติม — sensory, TBC, SCC, resazurin, methylene blue, API / Petrifilm, antibiotic residue test'] },
        ],
      },
    ],
  },

  // ─────────────────────────────────────────────────────────────
  'milk-microbiology': {
    topic: 'milk-microbiology',
    title: 'Milk microbiology',
    lecturer: 'Saharuetai Jeamsripong (SJ)',
    icon: '🦠',
    summary: 'น้ำนม = good growth medium สำหรับ yeasts/molds/bacteria. 2 กลุ่มหลัก: pathogenic (Brucella, Salmonella, E. coli, S. aureus, Strep. agalactiae, Mycobacterium tuberculosis, Listeria) vs spoilage (Pseudomonas, Enterobacteriaceae, Bacillus cereus, Clostridium).',
    sections: [
      {
        heading: 'Lecture identity',
        source: '9 - _Milk_microbiology_SJ_2024.pdf p.1',
        body: [
          { bullets: [
            'หัวข้อ: **Milk microbiology** (SJ lecture #3)',
            'ผู้สอน: Saharuetai Jeamsripong — Dept. of Veterinary Public Health, CU',
          ] },
        ],
      },
      {
        heading: 'Why milk = good microbial growth medium',
        source: '9 - _Milk_microbiology_SJ_2024.pdf p.2',
        body: [
          { bullets: [
            'Nutritious food (protein, fat, vitamins, minerals)',
            'Good for bone health',
            '**Good medium for pathogen growth** — yeasts, molds, bacteria',
            'Source of bacterial infection ถ้าไม่ผ่าน processing',
          ] },
        ],
      },
      {
        heading: 'Microorganisms in milk — 2 main groups',
        source: '9 - _Milk_microbiology_SJ_2024.pdf p.3',
        body: [
          { sub: '1. Pathogenic bacteria (โรคจากน้ำนม)',
            body: [
              { bullets: [
                '**Brucella**',
                '**Enterobacteriaceae** — Salmonella, Escherichia coli',
                '**Staphylococci** — *Staphylococcus aureus*',
                '*Streptococcus agalactiae*',
                '**Mycobacterium bovis** — mycobacterium ที่เป็น milk-borne zoonosis จากโคคือ M. bovis (สาเหตุของ bovine TB) หรือเขียนกว้างเป็น *Mycobacterium tuberculosis* complex',
                '⚠️ สไลด์เขียนว่า **Mycobacterium tuberculosis** ซึ่งมีคนเป็น reservoir หลัก ไม่ใช่เชื้อที่ติดมากับน้ำนมโค',
                '**Listeria monocytogenes**',
              ] },
            ] },
          { sub: '2. Spoilage organisms',
            body: [
              { bullets: [
                '**Pseudomonas** — psychrotroph, grow at refrigerator temp; produce enzymes degrading protein & fat',
                'Enterobacteriaceae',
                '*Bacillus cereus* (spore-former)',
                '*Clostridium* spp.',
                '**Yeasts and molds**',
              ] },
            ] },
        ],
      },
      {
        heading: 'Sources of contamination + indicator organisms',
        source: '9 - _Milk_microbiology_SJ_2024.pdf p.4+',
        body: [
          { bullets: ['🚧 รอเติม — udder origin vs environmental vs handling, indicator: coliforms / *E. coli* / total plate count / psychrotrophic count'] },
        ],
      },
    ],
  },

  // ─────────────────────────────────────────────────────────────
  'milk-borne-pathogens': {
    topic: 'milk-borne-pathogens',
    title: 'Milk-borne pathogens & diseases',
    lecturer: 'Saharuetai Jeamsripong (SJ)',
    icon: '🦠',
    summary: '3 source ของ contamination: (1) mammary glands inside/outside udder, (2) handling & storage equipment, (3) external environment. 4 microbe categories in milk products: pathogenic / indicator / spoilage / starter cultures.',
    sections: [
      {
        heading: 'Lecture identity',
        source: '10 - _Milk_borne_pathogens_and_diseases_SJ_2024.pdf p.1',
        body: [
          { bullets: [
            'หัวข้อ: **Milk-borne pathogens and diseases** (SJ lecture #4)',
            'ผู้สอน: Saharuetai Jeamsripong — Dept. of Veterinary Public Health, CU',
          ] },
        ],
      },
      {
        heading: 'Sources of contamination (3 categories)',
        source: '10 - _Milk_borne_pathogens_and_diseases_SJ_2024.pdf p.2',
        body: [
          { sub: 'A. Mammary glands',
            body: [
              { bullets: [
                '**Inside udder** — *Streptococcus*, *Corynebacterium*, *Micrococcus*',
                '**Outside udder** — *Micrococcus*, *Staphylococcus*, *Enterococcus*, *Bacillus*',
              ] },
            ] },
          { sub: 'B. Handling and storage equipment',
            body: [
              { bullets: [
                'Udder & teat surface',
                'Handling surface',
                'Storage tanks / pipelines',
                'Packaging (mold)',
              ] },
            ] },
          { sub: 'C. External environment',
            body: [
              { bullets: [
                'Wash water',
                'Personal hygiene (worker)',
                '**Lactobacillus** & **Enterococcus** (significant for cheese & yogurt — starter side)',
                'From **feces** — *E. coli*, *Staphylococcus*, *Listeria*, *Salmonella*, *Mycobacterium*',
                'From **animal feed** — *Salmonella*, *Aspergillus* spp.',
              ] },
            ] },
        ],
      },
      {
        heading: 'Types of microorganisms in milk products (4 functional groups)',
        source: '10 - _Milk_borne_pathogens_and_diseases_SJ_2024.pdf p.3',
        body: [
          { bullets: [
            '**1. Pathogenic bacteria** — โรคต่อผู้บริโภค',
            '**2. Indicator bacteria** — บอกระดับสุขลักษณะ',
            '**3. Spoilage bacteria** — เสื่อมคุณภาพ',
            '**4. Starter cultures** — ใช้หมัก (cheese, yogurt)',
          ] },
          { callout: 'นอกจาก bacteria ยังมี **fungi, virus, parasite** ใน milk products ด้วย (slide diagram p.3).', kind: 'tip' },
        ],
      },
      {
        heading: 'Detail per pathogen (Brucella, Listeria, Salmonella, STEC, Mycobacterium ...)',
        source: '10 - _Milk_borne_pathogens_and_diseases_SJ_2024.pdf p.4+',
        body: [
          { bullets: ['🚧 รอเติม — incubation, dose response, pasteurization kill-step (LTLT 63°C/30min, HTST 72°C/15s, UHT 135°C/2s), outbreak case studies'] },
        ],
      },
    ],
  },

  // ─────────────────────────────────────────────────────────────
  'milk-industry-std': {
    topic: 'milk-industry-std',
    title: 'Standard of milk industry & milk products (GMP/HACCP)',
    lecturer: 'Saharuetai Jeamsripong (SJ)',
    icon: '🏭',
    summary: '4 มาตรฐานสำคัญ — ISO 9000 (quality mgmt) + ISO 22000 (food safety mgmt) + HACCP + GMP, มกษ. 6401(G)-2560 = GMP สำหรับศูนย์รวบรวมน้ำนมดิบ.',
    sections: [
      {
        heading: 'Lecture identity',
        source: '11 - _Standard_of_milk_industry_and_milk_products_SJ_2024.pdf p.1',
        body: [
          { bullets: [
            'หัวข้อ: **GMP and HACCP standards for milk collection center and milk processing plants** (SJ lecture #5)',
            'ผู้สอน: Saharuetai Jeamsripong — Dept. of Veterinary Public Health, CU',
          ] },
        ],
      },
      {
        heading: 'Standards hierarchy (4 layers from top to bottom)',
        source: '11 - _Standard_of_milk_industry_and_milk_products_SJ_2024.pdf p.2',
        body: [
          { bullets: [
            '**ISO 9000** — Quality management system',
            '**ISO 22000** — Food safety management system',
            '**HACCP** — Hazard Analysis Critical Control Point',
            '**GMP (International)** — voluntary, สำหรับ export',
            '**GMP (Law)** — minimum requirement บังคับตามกฎหมาย',
          ] },
          { callout: 'พื้นฐานสุดอย่างหนึ่ง: **5ส** = สะสาง, สะดวก, สะอาด, สุขลักษณะ, สร้างนิสัย.', kind: 'tip' },
        ],
      },
      {
        heading: 'Standard of milk collection center (มาตรฐาน MCC ของไทย)',
        source: '11 - _Standard_of_milk_industry_and_milk_products_SJ_2024.pdf p.3',
        body: [
          { bullets: [
            'หน่วยงาน: **National Bureau of Agricultural Commodity and Food Standards** (มกอช.), กระทรวงเกษตรและสหกรณ์',
            'มาตรฐาน: **มกษ. 6401-2558** — "การปฏิบัติที่ดีสำหรับศูนย์รวบรวมน้ำนมดิบ" (Good manufacturing practices for milk collection center) ออกโดย มกอช. ภายใต้ พ.ร.บ. มาตรฐานสินค้าเกษตร พ.ศ. 2551',
            '⚠️ สไลด์เขียนว่าตัวมาตรฐานคือ **มกษ. 6401(G) – 2560** แต่เอกสารเลขนั้นคือ "แนวปฏิบัติในการใช้มาตรฐานสินค้าเกษตร มกษ. 6401(G)-2560" ซึ่งเป็นคู่มือประกอบการใช้มาตรฐาน ไม่ใช่ตัวมาตรฐาน ส่วนสถานะบังคับ/ไม่บังคับ ยังยืนยันจากตัวบทกฎหมายไม่ได้ (ไฟล์ของกรมปศุสัตว์เป็นภาพสแกน) จึงคงข้อความบรรทัดถัดไปของอาจารย์ไว้ตามเดิม',
            'ลักษณะ: แนวปฏิบัติ (G = guidance) — ไม่บังคับ แต่ใช้ขอตราเครื่องหมาย Q',
          ] },
        ],
      },
      {
        heading: 'GMP / HACCP detail + processing plant standard',
        source: '11 - _Standard_of_milk_industry_and_milk_products_SJ_2024.pdf p.4+',
        body: [
          { bullets: ['🚧 รอเติม — 7 HACCP principles, CCP examples (pasteurization, cooling), prerequisite programs (PRP), 5ส implementation'] },
        ],
      },
    ],
  },

  // ─────────────────────────────────────────────────────────────
  'milk-processing': {
    topic: 'milk-processing',
    title: 'Processing & manufacturing technologies for milk',
    lecturer: 'Saharuetai Jeamsripong (SJ)',
    icon: '⚙️',
    summary: 'Workflow: Receiving → Clarification → Cream separation → Standardization → Homogenization → Heat treatment → Packing → CIP.',
    sections: [
      {
        heading: 'Lecture identity',
        source: '12 - _Processing_and_manufacturing_technologies_for_milk_and_milk_products_SJ_2024.pdf p.1',
        body: [
          { bullets: [
            'หัวข้อ: **Processing and manufacturing technologies for milk and milk products** (SJ lecture #6)',
            'ผู้สอน: Saharuetai Jeamsripong — Dept. of Veterinary Public Health, CU',
          ] },
        ],
      },
      {
        heading: 'Standard processing workflow (8 unit operations)',
        source: '12 - _Processing_and_manufacturing_technologies_for_milk_and_milk_products_SJ_2024.pdf p.2',
        body: [
          { bullets: [
            '1. **การรับและการควบคุมคุณภาพน้ำนมดิบ** (Milk collection and quality control)',
            '2. **การปั่นแยกสิ่งสกปรก** (Clarification)',
            '3. **การแยกครีม** (Cream separation)',
            '4. **การปรับมาตรฐาน** (Standardization — ปรับ % milk fat)',
            '5. **การทำให้เป็นเนื้อเดียวกัน** (Homogenization)',
            '6. **ระบบให้ความร้อน** (Heat treatment)',
            '7. **ระบบการบรรจุ** (Packing)',
            '8. **การล้างและทำความสะอาดเครื่องมือ** (Cleaning In Place — CIP)',
          ] },
        ],
      },
      {
        heading: 'Dairy processing diagram',
        source: '12 - _Processing_and_manufacturing_technologies_for_milk_and_milk_products_SJ_2024.pdf p.3',
        body: [
          { bullets: [
            'Separation (cream separator)',
            'Standardization',
            'Homogenization',
            'Heat treatment',
            'Evaporation (สำหรับ condensed/powdered)',
            'Cleaning in place (CIP)',
            '→ Dairy products variety (drinking milk, cream, butter, cheese, yogurt, ice cream, milk powder)',
          ] },
        ],
      },
      {
        heading: 'Heat treatment time/temp + product-specific lines',
        source: '12 - _Processing_and_manufacturing_technologies_for_milk_and_milk_products_SJ_2024.pdf p.4+',
        body: [
          { bullets: ['🚧 รอเติม — LTLT 63°C/30min, HTST 72°C/15s, UHT 135–150°C/1–5s, ESL, ผลต่อ vitamin/protein, spray drying & roller drying'] },
        ],
      },
    ],
  },

  // ─────────────────────────────────────────────────────────────
  'milk-cleaning': {
    "topic": "milk-cleaning",
    "title": "Cleaning and disinfectants in milk collecting center and milk processing",
    "lecturer": "Saharuetai Jeamsripong",
    "icon": "🧼",
    "summary": "การทำความสะอาดและการฆ่าเชื้อในศูนย์รวบรวมน้ำนมและโรงงานแปรรูปนม: กรอบมาตรฐาน GMP, วัตถุประสงค์การทำความสะอาด, ลำดับ CIP, คุณสมบัติสารฆ่าเชื้อและสารทำความสะอาดที่ดี, disinfectant 8 กลุ่ม, สารด่าง กรด และสารเสริมในโรงงาน, ขั้นตอนทำความสะอาดอุปกรณ์, phenol coefficient และเหตุที่ disinfectant ไม่ได้ผล",
    "sections": [
      {
        "heading": "กรอบมาตรฐานที่เกี่ยวกับการทำความสะอาด",
        "source": "Cleaning and disinfectants in milk processing SJ 2026 p.2-3; บันทึกคาบ 30 ก.ย. 2569 [5:00-6:59]",
        "body": [
          {
            "sub": "ข้อกำหนดขั้นพื้นฐาน 9 ข้อ ของ GMP ศูนย์รวบรวมน้ำนมดิบ (มกษ. 6401(G)-2560)",
            "body": [
              {
                "bullets": [
                  "สถานประกอบการและสิ่งอำนวยความสะดวก",
                  "การควบคุมการปฏิบัติงาน",
                  "การบำรุงรักษาและการสุขาภิบาล",
                  "สุขลักษณะส่วนบุคคล",
                  "การขนส่ง",
                  "การตามสอบ (traceability)",
                  "การฝึกอบรม",
                  "ระบบการส่งเสริมสมาชิก",
                  "ระบบเอกสารและการบันทึกข้อมูล"
                ]
              },
              "เรื่องการทำความสะอาดอยู่ในหลายข้อรวมกัน โดยเฉพาะการบำรุงรักษาและการสุขาภิบาล กับสุขลักษณะส่วนบุคคล"
            ]
          },
          {
            "sub": "GMP 420",
            "body": [
              "ประกาศกระทรวงสาธารณสุข (ฉบับที่ 420) พ.ศ. 2563 ว่าด้วยวิธีการผลิต เครื่องมือเครื่องใช้ในการผลิต และการเก็บรักษาอาหาร เป็นข้อบังคับทางกฎหมาย ใช้กับสถานที่ผลิตอาหารทุกประเภท",
              "ส่วนที่ 1 ข้อกำหนดพื้นฐานสำหรับสถานที่ผลิตอาหารทุกประเภท ครอบคลุม 6 หัวข้อ",
              {
                "bullets": [
                  "อาคารผลิต",
                  "เครื่องมือเครื่องจักร หรืออุปกรณ์การผลิต",
                  "ภาชนะบรรจุ",
                  "ผู้ปฏิบัติงาน",
                  "การจัดการสุขาภิบาล",
                  "สุขลักษณะส่วนบุคคล"
                ]
              }
            ]
          }
        ]
      },
      {
        "heading": "วัตถุประสงค์ของการทำความสะอาด และจุลินทรีย์ที่สำคัญ",
        "source": "Cleaning and disinfectants in milk processing SJ 2026 p.4-5; บันทึกคาบ 30 ก.ย. 2569 [7:00-9:59]",
        "body": [
          {
            "sub": "วัตถุประสงค์",
            "body": [
              {
                "bullets": [
                  "ทำความสะอาดทางกายภาพ: เอาฝุ่น ผง ตะกอน และนมที่ตกค้างในท่อน้ำนมออก",
                  "ทำความสะอาดทางเคมี: ใช้สารเคมี แบ่งเป็นกรดกับเบส",
                  "ฆ่าเชื้อจุลินทรีย์ด้วยสารฆ่าเชื้อ (bacteriological cleaning)",
                  "ฆ่าเชื้อในระดับสเตอริไลซ์ (sterile cleaning)"
                ]
              }
            ]
          },
          {
            "sub": "จุลินทรีย์ที่มีความสำคัญในอุตสาหกรรมนม",
            "body": [
              {
                "bullets": [
                  {
                    "label": "Coliforms",
                    "value": "ใช้บ่งชี้ว่าผลิตภัณฑ์สะอาดหรือสกปรก ใช้ได้กับนม เนื้อ ผัก ผลไม้ และอาหารทะเล"
                  },
                  {
                    "label": "Thermophilic bacteria",
                    "value": "Streptococcus thermophilus พบเมื่อพาสเจอไรส์ติดต่อกันนานโดยไม่หยุดพักทำความสะอาด ชอบอุณหภูมิสูง"
                  },
                  {
                    "label": "Psychrophilic bacteria",
                    "value": "Pseudomonas ชอบอยู่ที่เย็น"
                  }
                ]
              }
            ]
          }
        ]
      },
      {
        "heading": "CIP ระหว่าง pasteurization: ลำดับการล้างท่อน้ำนม",
        "source": "Cleaning and disinfectants in milk processing SJ 2026 p.6; บันทึกคาบ 30 ก.ย. 2569 [9:00-12:59]",
        "body": [
          "**CIP** (cleaning in place) คือเครื่องที่ปั๊มจ่ายน้ำยาทำความสะอาดเข้าไปล้างท่อน้ำนม",
          {
            "sub": "ลำดับ 5 ขั้น",
            "body": [
              {
                "bullets": [
                  {
                    "label": "1. น้ำอุ่น",
                    "value": "ล้างนาน 10 นาที เพื่อเอา milk fat ที่ตกค้างออก"
                  },
                  {
                    "label": "2. เบส",
                    "value": "ความเข้มข้น 1-3% ที่ 70-80 °C นาน 20-30 นาที"
                  },
                  {
                    "label": "3. กรด",
                    "value": "ความเข้มข้น 0.5-1% ที่ 60-65 °C นาน 20-30 นาที"
                  },
                  {
                    "label": "4. น้ำ",
                    "value": "ล้างด้วยน้ำ แล้วทดสอบด้วยกระดาษ litmus ว่าเป็นกลาง"
                  },
                  {
                    "label": "5. น้ำร้อนหรือสารเคมี",
                    "value": "ล้างก่อนใช้งาน"
                  }
                ]
              }
            ]
          },
          "ขั้นแรกใช้น้ำอุ่น ไม่ใช้น้ำร้อน เพราะน้ำร้อนทำให้โปรตีนเกาะแน่นและตกตะกอน",
          {
            "sub": "ข้อควรจำ",
            "body": [
              {
                "bullets": [
                  "ถ้าไม่ได้ pasteurization นานเกิน 4 ชั่วโมง ต้องทำความสะอาดระบบ pasteurization ใหม่",
                  "ถ้าไม่ได้ทำ pasteurization เป็นเวลานาน ต้องทำความสะอาดสม่ำเสมอทุกวัน เพื่อไม่ให้สิ่งสกปรกตกค้างสะสม"
                ]
              }
            ]
          },
          {
            "callout": "ลำดับ 5 ขั้นข้างต้นล้างน้ำและทดสอบ litmus หนเดียว คือหลังกรด แต่ในโรงงานนมมีการล้างด้วยน้ำเปล่าและทดสอบความเป็นกลางหลังเบสด้วย ก่อนล้างกรด",
            "kind": "flag"
          }
        ]
      },
      {
        "heading": "สารฆ่าเชื้อที่ดี: คุณสมบัติ 13 ข้อ",
        "source": "Cleaning and disinfectants in milk processing SJ 2026 p.7-9; บันทึกคาบ 30 ก.ย. 2569 [12:00-16:59]",
        "body": [
          {
            "bullets": [
              {
                "label": "1. Broad spectrum",
                "value": "ฆ่าจุลินทรีย์ได้หลายกลุ่ม"
              },
              {
                "label": "2. Fast acting",
                "value": "ฆ่าจุลินทรีย์ได้เร็ว"
              },
              {
                "label": "3. ไม่ถูกปัจจัยแวดล้อมรบกวน",
                "value": "ออกฤทธิ์ได้แม้มี organic matter (เช่น เลือด เสมหะ อุจจาระ) และเข้ากันได้กับสบู่ ผงซักฟอก และสารเคมีอื่นที่ใช้ร่วมกัน"
              },
              {
                "label": "4. Nontoxic",
                "value": "ไม่เป็นอันตรายต่อผู้ปฏิบัติงาน"
              },
              {
                "label": "5. Surface compatibility",
                "value": "ไม่กัดกร่อนเครื่องมือและโลหะ ไม่ทำให้ผ้า ยาง พลาสติกและวัสดุอื่นเสื่อม"
              },
              {
                "label": "6. Residual effect",
                "value": "ทิ้งฟิล์มต้านจุลินทรีย์ไว้บนพื้นผิว"
              },
              {
                "label": "7. ใช้ง่าย",
                "value": "ฉลากมีคำแนะนำชัดเจน"
              },
              {
                "label": "8. Odorless",
                "value": "ไม่มีกลิ่น หรือกลิ่นที่น่าใช้"
              },
              {
                "label": "9. Economical",
                "value": "ราคาเหมาะสม"
              },
              {
                "label": "10. Solubility",
                "value": "ละลายน้ำได้"
              },
              {
                "label": "11. Stability",
                "value": "คงตัวทั้งแบบเข้มข้นและแบบเจือจางพร้อมใช้"
              },
              {
                "label": "12. Good cleaning properties",
                "value": "มีคุณสมบัติทำความสะอาดที่ดี"
              },
              {
                "label": "13. Environmentally friendly",
                "value": "ไม่ทำลายสิ่งแวดล้อมเมื่อทิ้ง"
              }
            ]
          }
        ]
      },
      {
        "heading": "สารทำความสะอาดที่ดี: คุณสมบัติ 13 ข้อ",
        "source": "Cleaning and disinfectants in milk processing SJ 2026 p.10; บันทึกคาบ 30 ก.ย. 2569 [16:00-17:59]",
        "body": [
          {
            "bullets": [
              "ละลายง่ายและเร็ว",
              "ไม่มีฤทธิ์กัดกร่อนพื้นผิวโลหะ",
              "เปียกง่าย และสัมผัสพื้นผิวที่ต้องการทำความสะอาดได้ง่าย",
              "เป็นอิมัลชัน เพื่อจับกับน้ำมันและกำจัดน้ำมันออกจากพื้นผิว",
              "ละลายโปรตีนได้ดี",
              "สลายคราบสิ่งสกปรกได้ดี",
              "ช่วยฆ่าจุลินทรีย์",
              "กำจัดฟิล์มนมบนพื้นผิวอุปกรณ์และเครื่องมือ",
              "ถนอมมือ ถ้าจำเป็นต้องใช้มือช่วยในการทำความสะอาด",
              "ช่วยลดความกระด้างของน้ำ",
              "มีฤทธิ์ในการชะล้าง",
              "ราคาถูก",
              "คงตัวระหว่างการเก็บรักษา"
            ]
          }
        ]
      },
      {
        "heading": "Sterilization, disinfection, antiseptic, disinfectant และคำที่ใกล้กัน",
        "source": "Cleaning and disinfectants in milk processing SJ 2026 p.11-15; บันทึกคาบ 30 ก.ย. 2569 [17:00-22:59]",
        "body": [
          {
            "sub": "Decontamination process",
            "body": [
              {
                "bullets": [
                  {
                    "label": "Sterilization",
                    "value": "กำจัดเชื้อได้ 100% ไม่มีเชื้อเหลือ ใช้ความร้อน สารเคมี การฉายรังสี ความดันสูง และการกรอง"
                  },
                  {
                    "label": "Disinfection",
                    "value": "ลดเชื้อ ใช้ phenolic disinfectants, heavy metals, halogens, bleach, alcohols, hydrogen peroxide, detergents, ความร้อน และ pasteurization"
                  }
                ]
              },
              "Disinfection แยกต่อเป็น antiseptic กับ disinfectant"
            ]
          },
          {
            "sub": "นิยาม 4 คำ",
            "body": [
              {
                "table": {
                  "headers": [
                    "คำ",
                    "ความหมาย"
                  ],
                  "rows": [
                    [
                      "**Antiseptic**",
                      "ใช้กับเนื้อเยื่อหรือผิวหนังที่มีชีวิต ลดโอกาสติดเชื้อ sepsis หรือการเน่า"
                    ],
                    [
                      "**Disinfectant**",
                      "ใช้กับพื้นผิวของวัตถุไม่มีชีวิต เพื่อทำลายจุลินทรีย์ที่อยู่บนวัตถุ"
                    ],
                    [
                      "**Preservative**",
                      "สารที่เติมในผลิตภัณฑ์ เช่น อาหาร, เครื่องดื่ม, ยา, สี, ตัวอย่างชีวภาพ, เครื่องสำอาง"
                    ],
                    [
                      "**Antibiotic**",
                      "ยาที่ใช้สู้กับการติดเชื้อแบคทีเรีย"
                    ]
                  ]
                }
              }
            ]
          },
          {
            "sub": "Disinfectants 8 กลุ่ม",
            "body": [
              {
                "bullets": [
                  "Alcohol: ethanol และ isopropyl alcohol",
                  "Aldehydes: formaldehyde และ glutaraldehyde",
                  "Chlorhexidine",
                  "Halogen compounds",
                  "Organic acids",
                  "Oxidizing agents",
                  "Phenolic compounds",
                  "Surface active agent"
                ]
              }
            ]
          },
          {
            "sub": "ผลของสารฆ่าเชื้อในงานผลิตนม",
            "body": [
              {
                "bullets": [
                  {
                    "label": "ทำให้โครงสร้างโปรตีนและลิพิดเสีย",
                    "value": "quaternary ammonium compound, chlorhexidine, phenolic compounds, กรดและเบส, alcohol"
                  },
                  {
                    "label": "ทำลายพันธะโควาเลนต์",
                    "value": "aldehydes และเอนไซม์"
                  },
                  {
                    "label": "ออกซิไดซ์ C, S, N",
                    "value": "halogens, hydrogen peroxide และ ozone"
                  }
                ]
              }
            ]
          }
        ]
      },
      {
        "heading": "Alcohol และ aldehydes",
        "source": "Cleaning and disinfectants in milk processing SJ 2026 p.16-20; บันทึกคาบ 30 ก.ย. 2569 [22:00-28:59]",
        "body": [
          {
            "sub": "Alcohol",
            "body": [
              {
                "bullets": [
                  "เป็นทั้ง antiseptic และ disinfectant ฆ่า Gram บวกและลบ, TB, ราและไวรัส",
                  "Ethanol (EtOH) ฆ่าไวรัส; isopropanol ออกฤทธิ์เร็วแต่ระเหยช้า จึงระคายเคืองตาและทางเดินหายใจ",
                  "กลไก: ละลายไขมันที่เยื่อหุ้มเซลล์ ทำให้โปรตีนตกตะกอน",
                  "TB เป็นเชื้อที่ห้ามพบในการผลิตน้ำนม และ alcohol ทำลายได้",
                  "ความเข้มข้น 60-90%; 70% ethanol ออกฤทธิ์เร็วภายใน 1-2 นาที; isopropanol 50%",
                  "ใช้ทำความสะอาดผิวหนัง และเครื่องมือแพทย์ (แช่ 5 นาที)",
                  "ต้องให้มี contact time: ฉีดแล้วเช็ดทันที alcohol ยังไม่ทันออกฤทธิ์",
                  "สปอร์ฆ่ายาก จึงผสมกับ formalin 20% แช่ราว 30 นาที"
                ]
              }
            ]
          },
          {
            "sub": "Aldehydes",
            "body": [
              {
                "bullets": [
                  "ตัวอย่าง: formaldehyde, glutaraldehyde",
                  "กลไก: alkylation ที่หมู่ amine ทำให้โปรตีนเสียสภาพและตกตะกอน",
                  "ฆ่า Gram บวกและลบ, TB, ไวรัส, รา; ออกฤทธิ์ช้ากับสปอร์",
                  "ข้อดี: ราคาถูก; ข้อเสีย: ระคายเคืองตา กลิ่นแรง"
                ]
              }
            ]
          },
          {
            "sub": "Formaldehyde",
            "body": [
              {
                "bullets": [
                  "IARC จัดเป็น Group 1 ก่อมะเร็งในคน จึงไม่เป็นที่นิยมแล้ว",
                  "ในรูป formalin; อาจใช้ aldehyde ร่วมกับ isopropyl alcohol เพื่อให้ออกฤทธิ์เร็ว"
                ]
              }
            ]
          },
          {
            "sub": "Glutaraldehyde",
            "body": [
              {
                "bullets": [
                  "ความเข้มข้น >2%",
                  "ฆ่าสปอร์ได้ดีกว่า formaldehyde 2-8 เท่า",
                  "ระเหยน้อยและระคายเคืองน้อยกว่า formaldehyde",
                  "ใช้กับเครื่องมือที่ไม่ทนความร้อน (แช่ได้ในกรณีที่อบฆ่าเชื้อไม่ได้)",
                  "ขึ้นกับ pH: 7.4-8.5 คือออกฤทธิ์ดีในสภาวะเบส ถ้ามีกรดปนจะไม่ออกฤทธิ์"
                ]
              },
              {
                "callout": "ตัวเลขนี้ไม่ตรงกันในทุกแหล่ง: ที่ระบุว่าฆ่าสปอร์ดีกว่า formaldehyde 2-8 เท่า และระคายเคืองน้อยกว่า formaldehyde นั้นต่างจากอีกแหล่งที่ว่า 6-8 เท่า และ glutaraldehyde ระคายเคืองรุนแรงกว่า formalin",
                "kind": "flag"
              }
            ]
          }
        ]
      },
      {
        "heading": "Chlorhexidine และกลุ่ม iodine",
        "source": "Cleaning and disinfectants in milk processing SJ 2026 p.21-24; บันทึกคาบ 30 ก.ย. 2569 [28:00-32:59]",
        "body": [
          {
            "sub": "Chlorhexidine",
            "body": [
              {
                "bullets": [
                  "เป็น antiseptic; ฆ่า Gram บวกได้ดีกว่าลบ, ไวรัสและราบางชนิด",
                  "ออกฤทธิ์ดีแม้มี organic matter (เช่น เลือด หนอง); ออกฤทธิ์เร็ว ระคายเคืองต่ำ (น้อยกว่ากลุ่ม aldehydes)",
                  "กลไก: ดูดซับที่ผิวเซลล์ ทำลายเยื่อหุ้มเซลล์ และทำให้โปรตีนตกตะกอน",
                  "ขึ้นกับ pH: ออกฤทธิ์ดีในสภาวะเบส",
                  "ใช้จุ่มเต้านม ทำความสะอาด และขัดก่อนผ่าตัด"
                ]
              }
            ]
          },
          {
            "sub": "Iodine (povidone iodine)",
            "body": [
              {
                "bullets": [
                  "เป็น antiseptic",
                  "กลไก: ไอออน iodine ที่ออกฤทธิ์เกาะเยื่อหุ้มแบคทีเรีย สร้างโปรตีนเชิงซ้อน แล้วรบกวน metabolism",
                  "ฆ่าแบคทีเรียราว 99% ภายใน 30 วินาทีถึง 1 นาที",
                  "ฆ่าสปอร์ภายใน 15 นาที"
                ]
              }
            ]
          },
          {
            "sub": "Iodophores",
            "body": [
              {
                "bullets": [
                  "iodophores = iodine + สารอื่น (detergents, wetting agents); ตัวอย่าง povidone",
                  "ขึ้นกับ pH: <5 (ออกฤทธิ์ดีในสภาวะกรด)",
                  "กลไก: ปล่อยไอออน iodine ไปทำลายเชื้อ",
                  "ระคายเคืองต่ำ ใช้จุ่มเต้าก่อนรีดนม ล้างมดลูกที่ติดเชื้อ และทาก่อนผ่าตัด",
                  "ประสิทธิภาพต่ำเมื่อมี organic matter ต้องขัดเลือด หนองออกให้หมดก่อน"
                ]
              }
            ]
          }
        ]
      },
      {
        "heading": "Halogen compounds: chlorine และ sodium hypochlorite",
        "source": "Cleaning and disinfectants in milk processing SJ 2026 p.22, 25-26, 43; บันทึกคาบ 30 ก.ย. 2569 [30:00-35:59]",
        "body": [
          {
            "bullets": [
              "Halogen compounds เป็นทั้ง antiseptic และ disinfectant: chlorine (Cl₂), iodine (I₂) และสารประกอบ เช่น sodium หรือ calcium hypochlorite",
              "ฆ่าแบคทีเรีย รา ไวรัส และสปอร์",
              "กลไก: ออกซิไดซ์หมู่ -SH (thiol) ไปเป็นพันธะ disulfide (S-S) ทำให้โครงสร้างและหน้าที่ของโปรตีนเปลี่ยน และรบกวน metabolism"
            ]
          },
          {
            "sub": "Chlorine",
            "body": [
              {
                "bullets": [
                  "สารออกฤทธิ์คือ hypochlorous acid (HOCl)",
                  "ได้ผลดีเมื่อ pH <7.5; Cl₂ + H₂O → HOCl + H⁺ + Cl⁻ และ HOCl ⇌ H⁺ + OCl⁻",
                  "ใช้กับน้ำประปา สระว่ายน้ำ และทำความสะอาดเต้านม",
                  "ข้อดี: ได้ผลกับแบคทีเรีย โปรโตซัว และไวรัส; ข้อเสีย: ได้ผลน้อยลงเมื่อมี organic matter"
                ]
              }
            ]
          },
          {
            "sub": "Sodium hypochlorite",
            "body": [
              {
                "bullets": [
                  "สารฆ่าเชื้อคือ HOCl; คือน้ำยาฟอกขาว (liquid bleach) ที่ใช้ทำความสะอาดในครัวเรือน",
                  "ใช้กับผ้าที่เปื้อนเลือดหรือซีรั่ม และทำความสะอาดพื้นผิว",
                  "NaOCl + H₂O → Na⁺ + OH⁻ + H⁺ + OCl⁻ และ H⁺ + OCl⁻ ⇌ HOCl"
                ]
              }
            ]
          },
          {
            "sub": "ข้อจำกัดในโรงงานนม",
            "body": [
              {
                "bullets": [
                  "สารประกอบคลอรีนกัดกร่อนพื้นผิวอะลูมิเนียม ทองแดง ดีบุก และสเตนเลส; กัดกร่อนเพิ่มขึ้นถ้าอุณหภูมิและความเข้มข้นสูงขึ้น",
                  "เพราะอุปกรณ์น้ำนมเป็นสเตนเลส จึงไม่นิยมใช้คลอรีนกับอุปกรณ์ ใช้กับน้ำหรือจุ่มเต้าจะเหมาะกว่า"
                ]
              }
            ]
          }
        ]
      },
      {
        "heading": "Organic acid และ oxidizing agents",
        "source": "Cleaning and disinfectants in milk processing SJ 2026 p.27-29; บันทึกคาบ 30 ก.ย. 2569 [34:00-36:59]",
        "body": [
          {
            "sub": "Organic acid",
            "body": [
              {
                "bullets": [
                  "เป็นสารอินทรีย์ กัดกร่อนและทำลายเนื้อเยื่อ",
                  "ตัวอย่าง: lactic, acetic, formic, citric, oxalic, uric acid",
                  "Peracetic acid (CH₃CO₃H) เป็น strong oxidizing agent ระคายเคืองรุนแรงต่อผิวหนัง ตา และทางเดินหายใจ",
                  "ใช้ฆ่าเชื้อในอุตสาหกรรมนม; เป็นสารอินทรีย์จึงเป็นมิตรกับสิ่งแวดล้อม"
                ]
              }
            ]
          },
          {
            "sub": "Oxidizing agents",
            "body": [
              {
                "bullets": [
                  {
                    "label": "ปล่อยออกซิเจน",
                    "value": "hydrogen peroxide (H₂O₂), sodium perborate, peracetic acid (PAA), benzoyl peroxide; ปล่อย free radical (hydroxyl radical, OH) ที่ทำลาย DNA"
                  },
                  {
                    "label": "ไม่ปล่อยออกซิเจน",
                    "value": "halogens, potassium permanganate"
                  }
                ]
              },
              "กลุ่มที่ปล่อย free radical หรือออกซิเจนฆ่าเชื้อได้ดีกว่าแต่กัดกร่อนรุนแรงกว่า กลุ่มที่ไม่ปล่อยออกซิเจนฆ่าแบคทีเรียได้เช่นกันแต่รุนแรงน้อยกว่า"
            ]
          },
          {
            "sub": "Hydrogen peroxide",
            "body": [
              {
                "bullets": [
                  "ความเข้มข้น 1.5-3% ใช้ล้างเศษสิ่งสกปรกและฆ่าเชื้อที่แผลและเนื้อเยื่อ",
                  "ฆ่าแบคทีเรีย ไวรัส ยีสต์ และสปอร์",
                  "ฆ่าสปอร์ (sporicidal) ได้เมื่อเพิ่มความเข้มข้นเป็น 10-30% และใช้เวลาสัมผัสนานขึ้น",
                  "มีฤทธิ์เป็น detergent และปลอดภัยต่อสิ่งแวดล้อม"
                ]
              }
            ]
          }
        ]
      },
      {
        "heading": "Phenolic compounds และ surface active agents",
        "source": "Cleaning and disinfectants in milk processing SJ 2026 p.30-33, 44; บันทึกคาบ 30 ก.ย. 2569 [37:00-44:59]",
        "body": [
          {
            "sub": "Phenolic compounds",
            "body": [
              {
                "bullets": [
                  "เป็น disinfectant ตัวแรกสุดที่ใช้ (classical disinfectant)",
                  "phenol บริสุทธิ์ไม่ใช้แล้วเพราะค่อนข้างเป็นพิษ จึงปรับโครงสร้างให้พิษน้อยลง: o-phenylphenol, o-benzyl-p-chlorophenol, p-tertiary amylphenol และ cresol (methyl-phenols); ที่ขายในตลาดคือ cresol, xylenol, phenylphenol",
                  "กลไก: ทำลายเยื่อหุ้มเซลล์ และทำให้โปรตีนและเอนไซม์ในเซลล์เสียสภาพ",
                  "ข้อดี: ฆ่าจุลินทรีย์ได้หลายกลุ่ม ราคาถูก; ข้อเสีย: กลิ่นแรง ระคายเคืองผิวหนัง ตา และเนื้อเยื่อ"
                ]
              }
            ]
          },
          {
            "sub": "Cresol",
            "body": [
              {
                "bullets": [
                  "สูตรปรับจาก phenol ให้ออกฤทธิ์ดีและระคายเคืองน้อยลง ราคาถูก เป็น strong germicide",
                  "soap และ lysol ทำลายจุลินทรีย์ได้ยกเว้นสปอร์ของแบคทีเรีย",
                  "เป็น disinfectant สำหรับพื้นผิว ไม่ใช้กับตัวคนหรือสัตว์"
                ]
              }
            ]
          },
          {
            "sub": "Surface active agents",
            "body": [
              "กลไก: ลดแรงตึงผิวของเยื่อหุ้มเซลล์ ทำให้เซลล์แตก ตัวอย่างคือ soap กับ quaternary ammonium compounds (QACs)",
              {
                "bullets": [
                  {
                    "label": "Soap (anionic)",
                    "value": "ประสิทธิภาพต่ำ; ออกฤทธิ์ดีในสภาวะกรด; ห้ามใช้ร่วมกับ cationic detergent เพราะเกิด neutralization"
                  },
                  {
                    "label": "QACs (cationic)",
                    "value": "เป็น antiseptic และ disinfectant; ตัวอย่าง benzalkonium, cetylpyridinium, benzethonium; พิษและการระคายเคืองน้อย; ประสิทธิภาพดีกว่า soap"
                  }
                ]
              }
            ]
          },
          {
            "sub": "ข้อควรระวังของ QACs",
            "body": [
              {
                "bullets": [
                  "ประสิทธิภาพลดลงเมื่อใช้กับประจุลบ (anion) เช่น soap",
                  "ไม่ควรใช้เมื่อมี organic substances",
                  "ไม่ควรเจือจางด้วยน้ำกระด้าง เพราะแคลเซียมและแมกนีเซียมเป็นประจุบวกที่จับกับสารประจุลบจนเกิด neutralization; ใช้น้ำอ่อน และน้ำบาดาลมักกระด้างสูง",
                  "ระคายเคืองผิวหนัง; เป็นได้ทั้งสารฆ่าเชื้อและสารทำความสะอาด",
                  "สารตกค้างแม้เล็กน้อยมีผลต่อการเจริญของจุลินทรีย์ เชื้ออาจดื้อแล้วเจริญได้ จึงต้องล้างด้วยน้ำสะอาดให้พอ",
                  "QACs เป็น selective pressure ที่ทำให้เกิดเชื้อดื้อยา จึงถูกเฝ้าระวัง"
                ]
              }
            ]
          }
        ]
      },
      {
        "heading": "สารทำความสะอาดในโรงงาน: ด่าง และกรด",
        "source": "Cleaning and disinfectants in milk processing SJ 2026 p.34-38, 45; บันทึกคาบ 30 ก.ย. 2569 [45:00-51:59]",
        "body": [
          "สารทำความสะอาดในโรงงาน 5 กลุ่ม: ด่าง (alkaline), กรด (acid), สารทำให้เปียก (wetting agent), สารลดความกระด้างของน้ำ (sequestering agent), สารยับยั้งการกัดกร่อนและสารป้องกันการเกิดโฟม (antifoaming agent)",
          {
            "sub": "ด่าง",
            "body": [
              {
                "bullets": [
                  {
                    "label": "สบู่ผง (soap powder)",
                    "value": "ทำให้เกิดอิมัลชันสูง กำจัดฟิล์มไขมันได้ดี; ระคายเคืองมือ; กัดกร่อนโลหะ; เหมาะล้างวัสดุที่ทำจากไม้ขัดพื้น"
                  },
                  {
                    "label": "Phosphate (trisodium phosphate, pyrophosphate, hexametaphosphate)",
                    "value": "ทำความสะอาดพื้นผิวร้อนได้ดี; กัดกร่อนอะลูมิเนียมและดีบุก; เหมาะล้างอุปกรณ์พาสเจอไรส์"
                  },
                  {
                    "label": "โซดาไฟ (sodium hydroxide)",
                    "value": "ชะล้างแรง ละลายโปรตีน ไขมัน และตะกอนแข็งให้อ่อนนุ่ม; ฆ่าแบคทีเรีย; ไม่เหมาะกับพื้นผิวเคลือบดีบุก; เหมาะล้างขวดหรือ heat exchanger ที่ทำจากสเตนเลสและมีฟิล์มโปรตีนเกาะหนา"
                  },
                  {
                    "label": "โซดาแอช (sodium carbonate)",
                    "value": "กำจัดฟิล์มไขมันและโปรตีน; เหมาะกับการทำความสะอาดทั่วไป"
                  },
                  {
                    "label": "Sodium metasilicate",
                    "value": "ทำให้เปียกได้ดี ทำให้เกิดอิมัลชัน ละลายตะกอนชนิดอ่อน ป้องกันตะกรัน; เหมาะกับอุปกรณ์ที่ผลิตครีมหรือเนย"
                  }
                ]
              },
              "Heat exchanger คือเครื่อง heat treatment ที่ทำจากสเตนเลส จึงใช้โซดาไฟในระบบ CIP"
            ]
          },
          {
            "sub": "กรด (ใช้กำจัดตะกรัน)",
            "body": [
              "กรดที่ใช้: nitric, phosphoric, tartaric, citric, gluconic, hydroxyacetic. ตะกรันนม (milk stone) เกิดเมื่อนมค้างในท่อ เช่น ข้อต่อและท่อขึ้นลง แล้วไม่ล้างทันที",
              {
                "bullets": [
                  {
                    "label": "Nitric acid",
                    "value": "ละลายตะกรันนม; ลดความกระด้างของน้ำ; กัดกร่อนดีบุกแต่ไม่มีผลกับอะลูมิเนียมและสเตนเลส; ถ้าสัมผัสผิวหนังจะทำให้ไหม้; เหมาะกับอุปกรณ์ CIP และอุปกรณ์ให้ความร้อน; เป็นกรดที่ใช้มากที่สุดในโรงงานนม"
                  },
                  {
                    "label": "กรดอินทรีย์ (acetic, hydroxyacetic, gluconic, tartaric, citric)",
                    "value": "รุนแรงน้อยกว่า nitric; มีสมบัติเป็นบัฟเฟอร์; ใช้กำจัดตะกรันนมและลดความกระด้างของน้ำ"
                  }
                ]
              }
            ]
          }
        ]
      },
      {
        "heading": "สารเสริมในสูตรทำความสะอาด",
        "source": "Cleaning and disinfectants in milk processing SJ 2026 p.39-40; บันทึกคาบ 30 ก.ย. 2569 [50:00-51:59]",
        "body": [
          {
            "bullets": [
              {
                "label": "สารทำให้เปียกหรือสารลดแรงตึงผิว (wetting agent)",
                "value": "ซึมแทรกระหว่างสิ่งสกปรกกับพื้นผิวเครื่องมือ ทำให้ทำความสะอาดง่ายขึ้น; ชนิดประจุลบ (anionic), ประจุบวก (cationic), ไม่มีประจุ (nonionic)"
              },
              {
                "label": "สารลดความกระด้างของน้ำ (sequestering agent)",
                "value": "ป้องกันการตกตะกอนของน้ำกระด้าง; ตัวอย่าง EDTA (กรดเอทิลีนไดอะมีนเตทตระอะซิติก), เกลือโซเดียมของกรด gluconic (ลดความกระด้างได้ดี), สารประกอบ polyphosphate"
              },
              {
                "label": "สารยับยั้งการกัดกร่อน",
                "value": "ป้องกันพื้นผิวเครื่องมือจากการกัดกร่อนของกรดหรือด่าง; sodium sulfite ป้องกันพื้นผิวดีบุกจากด่าง; sodium silicate ป้องกันอะลูมิเนียมและอัลลอยด์จากด่างอ่อน"
              }
            ]
          },
          "ด่างและกรดที่ใช้ใน CIP กัดกร่อนพื้นผิว บางโรงงานจึงเติมสารยับยั้งการกัดกร่อน เพื่อให้อุปกรณ์ที่เป็นดีบุก อะลูมิเนียม และอัลลอยด์ใช้งานได้นานขึ้น"
        ]
      },
      {
        "heading": "ชนิดของสารฆ่าเชื้อในโรงงานและตัวเลขที่ใช้",
        "source": "Cleaning and disinfectants in milk processing SJ 2026 p.41-45; บันทึกคาบ 30 ก.ย. 2569 [52:00-56:59]",
        "body": [
          "ชนิดของสารฆ่าเชื้อ 5 กลุ่ม: น้ำร้อน, ไอน้ำ, สารเคมีฆ่าเชื้อ, กรด, ด่าง",
          {
            "sub": "น้ำร้อนและไอน้ำ",
            "body": [
              {
                "bullets": [
                  {
                    "label": "น้ำร้อน",
                    "value": "ฆ่าเชื้อได้ดีแต่ต้องมีปริมาณมากพอ; ประสิทธิภาพขึ้นกับอุณหภูมิ; ต้องมากกว่า 80 °C นาน 15 นาที"
                  },
                  {
                    "label": "ไอน้ำ",
                    "value": "เหมาะกับการสเตอริไลซ์ถัง ท่อ และเครื่องมือ; 78 °C พ่นให้สัมผัสนานอย่างน้อย 15 นาที; 93 °C พ่นให้สัมผัสนานอย่างน้อย 5 นาที"
                  }
                ]
              }
            ]
          },
          {
            "sub": "สารเคมีฆ่าเชื้อ",
            "body": [
              {
                "bullets": [
                  {
                    "label": "สารประกอบคลอรีนอนินทรีย์",
                    "value": "sodium hypochlorite, chlorinated trisodium phosphate"
                  },
                  {
                    "label": "สารประกอบคลอรีนอินทรีย์",
                    "value": "chloramine-T, halane"
                  },
                  {
                    "label": "Quaternary ammonium",
                    "value": "เป็นได้ทั้งสารฆ่าเชื้อและสารทำความสะอาด"
                  },
                  {
                    "label": "Iodophor",
                    "value": "เป็นได้ทั้งสารฆ่าเชื้อและสารทำความสะอาด; ไม่เหมาะกำจัดไขมันตกค้าง แต่ช่วยกำจัดตะกรันนม"
                  }
                ]
              }
            ]
          },
          {
            "sub": "กรดและด่างที่ใช้ฆ่าเชื้อ",
            "body": [
              {
                "bullets": [
                  "กรดและด่างใช้ได้ทั้งเป็นสารฆ่าเชื้อและสารทำความสะอาด",
                  "กรด nitric ความเข้มข้น 60% ปริมาณ 0.5 ลิตร ต่อน้ำ 100 ลิตร",
                  "sodium hydroxide ความเข้มข้น 1.5-2.0% ที่ 45 °C นาน 2 นาที ช่วยทำลายแบคทีเรียชนิดไม่สร้างสปอร์ได้"
                ]
              }
            ]
          }
        ]
      },
      {
        "heading": "ขั้นตอนทำความสะอาดอุปกรณ์ 7 ขั้น",
        "source": "Cleaning and disinfectants in milk processing SJ 2026 p.46; บันทึกคาบ 30 ก.ย. 2569 [56:00-60:59]",
        "body": [
          {
            "bullets": [
              {
                "label": "1. เก็บกวาดผลิตภัณฑ์ที่ตกค้าง",
                "value": "ลดการสูญเสียผลิตภัณฑ์ ทำความสะอาดง่ายขึ้น และลดน้ำเสียในระบบบำบัด; ในท่อน้ำนมคือไล่น้ำนมที่ค้างทิ้งก่อนหนึ่งรอบ"
              },
              {
                "label": "2. ชะด้วยน้ำ",
                "value": "ไขมันถูกชะล้างด้วยน้ำอุ่น; ถ้าเกิน 60 °C โปรตีนตกตะกอนล้างออกยากขึ้น และเม็ดที่ค้างเป็นจุดสะสมให้เกิด milk stone"
              },
              {
                "label": "3. ใช้สารทำความสะอาด",
                "value": "เลือกให้เหมาะกับความมากน้อยของสิ่งสกปรก ชนิดของสิ่งสกปรก วิธีทำความสะอาด (คนหรือเครื่องล้าง) และชนิดของอุปกรณ์และวัสดุ"
              },
              {
                "label": "4. ล้างด้วยน้ำสะอาด",
                "value": "ถ้าเป็นไปได้เลี่ยงน้ำกระด้าง"
              },
              {
                "label": "5. ตรวจผลการทำความสะอาด",
                "value": "ตรวจว่าอุปกรณ์เป็นกลาง ไม่มีกรดหรือเบสตกค้าง"
              },
              {
                "label": "6. ฆ่าเชื้อพื้นผิวอุปกรณ์",
                "value": "ดูว่าฆ่าเชื้อสมบูรณ์ และพื้นผิวไม่ถูกกัดกร่อน"
              },
              {
                "label": "7. ทำให้พื้นผิวแห้ง",
                "value": "เช็ดด้วยผ้าสะอาดหรืออบ เพราะแบคทีเรียและราชอบน้ำ เมื่อแห้งจะลดการสะสมและการสร้าง biofilm"
              }
            ]
          }
        ]
      },
      {
        "heading": "Phenol coefficient (P.C.): นิยามและวิธีคำนวณ",
        "source": "Cleaning and disinfectants in milk processing SJ 2026 p.47-52; บันทึกคาบ 30 ก.ย. 2569 [62:00-72:59]",
        "body": [
          "P.C. ใช้เทียบ disinfectant ที่ทดสอบกับ phenol บนจุลินทรีย์มาตรฐาน (Salmonella Typhi หรือ Staphylococcus aureus) โดย phenol เป็น classic disinfectant ถ้าได้ค่าสูงกว่าแสดงว่าสารนั้นคุ้มค่าที่จะใช้",
          {
            "callout": "P.C. = ความเข้มข้นของสารที่ทดสอบ ซึ่งฆ่าเชื้อได้ใน 10 นาทีแต่ไม่ได้ใน 5 นาที ÷ ความเข้มข้นของ phenol ที่ฆ่าเชื้อได้ภายใต้เงื่อนไขเดียวกัน",
            "kind": "tip"
          },
          {
            "sub": "ตัวอย่างที่ 1: อ่านจากตาราง",
            "body": [
              "ในตาราง + คือเชื้อยังเจริญ และ 0 คือไม่มีเชื้อแล้ว; 3 คอลัมน์ท้ายคือเวลา 5, 10, 15 นาที",
              {
                "table": {
                  "headers": [
                    "Phenol",
                    "5 นาที",
                    "10 นาที",
                    "15 นาที"
                  ],
                  "rows": [
                    [
                      "1/90",
                      "+",
                      "0",
                      "0"
                    ],
                    [
                      "1/100",
                      "+",
                      "+",
                      "+"
                    ]
                  ]
                }
              },
              {
                "table": {
                  "headers": [
                    "Compound X",
                    "5 นาที",
                    "10 นาที",
                    "15 นาที"
                  ],
                  "rows": [
                    [
                      "1/300",
                      "0",
                      "0",
                      "0"
                    ],
                    [
                      "1/325",
                      "0",
                      "0",
                      "0"
                    ],
                    [
                      "1/350",
                      "+",
                      "0",
                      "0"
                    ],
                    [
                      "1/375",
                      "+",
                      "+",
                      "0"
                    ],
                    [
                      "1/400",
                      "+",
                      "+",
                      "+"
                    ]
                  ]
                }
              },
              {
                "bullets": [
                  "เลือกแถวที่ 5 นาทียังมีเชื้อ (+) แต่ 10 นาทีเชื้อตาย (0): phenol คือ 1/90 และ compound X คือ 1/350",
                  "ใช้ตัวส่วนของอัตราส่วนเป็นตัวเลข: phenol = 90, compound X = 350",
                  "P.C. ของ compound X = 350/90 = **3.89 เท่า**",
                  "P.C. สูง หมายถึงฆ่าเชื้อได้มีประสิทธิภาพสูง; ถ้ามีหลายสาร (X, Y, Z) ให้หา P.C. ของแต่ละสาร เทียบกับ phenol เท่านั้น ไม่เทียบกันเอง"
                ]
              }
            ]
          },
          {
            "sub": "ตัวอย่างที่ 2: ไม่มีแถวที่อ่านค่าตรงๆ ได้",
            "body": [
              {
                "table": {
                  "headers": [
                    "Phenol",
                    "5 นาที",
                    "10 นาที",
                    "15 นาที"
                  ],
                  "rows": [
                    [
                      "1/90",
                      "0",
                      "0",
                      "0"
                    ],
                    [
                      "1/100",
                      "+",
                      "+",
                      "0"
                    ]
                  ]
                }
              },
              {
                "table": {
                  "headers": [
                    "Compound A",
                    "5 นาที",
                    "10 นาที",
                    "15 นาที"
                  ],
                  "rows": [
                    [
                      "1/300",
                      "0",
                      "0",
                      "0"
                    ],
                    [
                      "1/350",
                      "+",
                      "+",
                      "0"
                    ],
                    [
                      "1/400",
                      "+",
                      "+",
                      "+"
                    ]
                  ]
                }
              },
              {
                "bullets": [
                  "ค่าที่ต้องการอยู่ตรงกลางระหว่างสองจุด จึงใช้ค่าเฉลี่ยของสองตัวเลข",
                  "phenol: (90+100)/2 = 95; compound A: (300+350)/2 = 325",
                  "P.C. ของ compound A = 325/95 = **3.42**",
                  "ถ้าชุดความเจือจางที่ทดสอบไม่มีค่าที่อยู่ตรงกลาง (เช่น มีแค่ 300 และ 400) ต้องเตรียมความเจือจางใหม่ให้ได้ค่าตรงกลาง"
                ]
              }
            ]
          },
          {
            "sub": "ปัจจัยที่มีผลต่อค่า P.C.",
            "body": [
              {
                "bullets": [
                  "ชนิดและอายุของจุลินทรีย์ที่ทดสอบ: ใช้ Salmonella Typhi หรือ Staphylococcus aureus และต้องเป็นเชื้อที่ subculture ใหม่ ไม่ใช่เชื้อเก่าใกล้ตาย เพราะผลจะดูดีเกินจริง",
                  "องค์ประกอบของอาหารเลี้ยงเชื้อ (media): ใช้จากบริษัทที่ได้มาตรฐาน เตรียมตามขั้นตอนที่ดี",
                  "เวลาและอุณหภูมิที่ฆ่าเชื้อ",
                  "ความไวต่อ organic substance",
                  "ความเข้มข้นของสารทดสอบเทียบกับปริมาณแบคทีเรีย"
                ]
              }
            ]
          }
        ]
      },
      {
        "heading": "เหตุที่ใช้ disinfectant แล้วไม่ได้ผล",
        "source": "Cleaning and disinfectants in milk processing SJ 2026 p.53-56; บันทึกคาบ 30 ก.ย. 2569 [71:00-74:59]",
        "body": [
          {
            "sub": "ปัจจัยด้านสารเคมี",
            "body": [
              {
                "bullets": [
                  "สารไม่มีประสิทธิภาพ: เก่าเก็บ หมดอายุ ใช้นอกฉลาก หรือสั่งจากแหล่งที่ไม่ได้มาตรฐาน",
                  "ความเข้มข้นไม่ถูกต้อง: ใส่น้ำมากหรือน้อยไป ใช้น้ำกระด้าง ไม่ทำความสะอาดพื้นผิวก่อน",
                  "เตรียมไว้นานเกินไป: เตรียมแล้วต้องใช้เลย ไม่เตรียมข้ามวัน",
                  "เวลาสัมผัสไม่พอ",
                  "ผสมกับสารเคมีอื่นโดยไม่ถูกวิธี: ผสมผิดอัตราส่วนอาจเกิด neutralization จนไม่ออกฤทธิ์"
                ]
              }
            ]
          },
          {
            "sub": "ปัจจัยด้านสิ่งแวดล้อม",
            "body": [
              {
                "bullets": [
                  "ใช้กับน้ำที่ไม่สะอาด",
                  "สภาพแวดล้อมสกปรก",
                  "ทำความสะอาดไม่พอ จนมี organic substance สะสม: ถ้าสกปรกมากต้องล้างพื้นผิวก่อนใช้ disinfectant ทุกครั้ง",
                  "ใช้ผิดวิธี เช่น ใช้กับโลหะที่ห้ามใช้ (ดีบุก) จนเกิดการกัดกร่อน",
                  "พื้นแห้ง: ไม่มีน้ำหล่อเลี้ยง disinfectant จึงไม่ออกฤทธิ์"
                ]
              }
            ]
          },
          {
            "sub": "ปัจจัยอื่น",
            "body": [
              {
                "bullets": [
                  "สัตว์พาหะและสัตว์ป่วย",
                  "vector: คน ยานพาหนะ หนู และแมลง"
                ]
              }
            ]
          }
        ]
      }
    ]
  },

  // ─────────────────────────────────────────────────────────────
  // MEAT HALF
  // ─────────────────────────────────────────────────────────────
  'meat-hygiene-intro': {
    "topic": "meat-hygiene-intro",
    "title": "Introduction to meat hygiene",
    "lecturer": "Sirawit Pagdepanichkit",
    "icon": "🥩",
    "summary": "บทนำสุขศาสตร์เนื้อสัตว์: นิยามและประเภทของเนื้อสัตว์ เนื้อเยื่อที่ประกอบเป็นเนื้อ ชนิดของ muscle fiber โปรตีนในกล้ามเนื้อ องค์ประกอบทางเคมีของเนื้อ (น้ำ โปรตีน ไขมัน คาร์โบไฮเดรต แร่ธาตุ วิตามิน) การใช้ dipeptide จำแนกชนิดเนื้อ และนิยามกับขอบเขตของ meat hygiene",
    "sections": [
      {
        "heading": "เนื้อสัตว์ (meat) คืออะไร และแบ่งเป็นกี่ประเภท",
        "source": "Introduction to Meat Hygiene p.2; บันทึกคาบ 14 ต.ค. 2569 [07:00-12:20]",
        "body": [
          "**Meat** = “animal tissues that are suitable for use as food” คือเนื้อเยื่อของสัตว์ที่เหมาะจะนำมาใช้เป็นอาหาร จึงไม่ได้หมายถึงสัตว์ทุกชนิดหรือทุกส่วนของสัตว์",
          {
            "sub": "Meat categories 4 ประเภท",
            "body": [
              {
                "table": {
                  "headers": [
                    "[table] ประเภท",
                    "ตัวอย่าง"
                  ],
                  "rows": [
                    [
                      "**Red meat**",
                      "beef, pork, lamb/mutton, veal"
                    ],
                    [
                      "**Poultry meat**",
                      "chickens, turkeys, ducks, geese"
                    ],
                    [
                      "**Seafood**",
                      "fish, clams, crabs, shrimps"
                    ],
                    [
                      "**Game meat**",
                      "flesh of non-domesticated animal"
                    ]
                  ]
                }
              },
              {
                "bullets": [
                  "จำนวนประเภทขึ้นกับ reference ที่ใช้ บางแหล่งรวบเหลือ 3 หรือแบ่งเป็น 5 ประเภท แหล่งที่ใช้อ้างอิงแบ่ง 4 ประเภท",
                  "Poultry meat คือเนื้อจากสัตว์ปีก จัดเป็นเนื้อขาว",
                  "Seafood ในที่นี้คือสัตว์น้ำ ไม่จำกัดว่าต้องอยู่ในทะเล เพราะสัตว์น้ำที่ไม่ได้อยู่ในทะเลก็นำมาบริโภคได้",
                  "Game meat คือเนื้อสัตว์ที่ไม่ได้มาจากการทำฟาร์มหรือการเลี้ยงเชิงการค้า การจัดประเภทจึงขึ้นกับแต่ละประเทศ เช่น เนื้อกวางในไทยมีฟาร์มและมีขายเชิงการค้าแต่ตลาดจำกัด อาจเรียกเป็น red meat ได้ เนื้อม้าในภูมิภาคที่เลี้ยงเพื่อบริโภคเชิงการค้า เช่น ญี่ปุ่น อาจถือเป็น red meat ส่วนเนื้อสัตว์ป่าในแอฟริกา เช่น เนื้อลิง เนื้อกอริลลา เป็น game meat"
                ]
              }
            ]
          }
        ]
      },
      {
        "heading": "องค์ประกอบของเนื้อ: เนื้อเยื่อ และกล้ามเนื้อ 3 ชนิด",
        "source": "Introduction to Meat Hygiene p.3-5; บันทึกคาบ 14 ต.ค. 2569 [12:00-17:20]",
        "body": [
          {
            "sub": "Meat components",
            "body": [
              {
                "bullets": [
                  "**Muscle tissue**: majority of carcass weight คือส่วนที่เรียกว่า “Meat”",
                  "**Epithelial tissue**: เช่น endothelium ของหลอดเลือดที่แทรกอยู่ในกล้ามเนื้อ และผนังลำไส้หรืออวัยวะภายในบางอย่างในกรณีที่นับเครื่องในเป็นเนื้อสัตว์",
                  "**Nervous tissue**: เส้นประสาทที่แตกแขนงเข้าไปในกล้ามเนื้อแต่ละมัด",
                  "**Connective tissue**: ทำงานประสานกับกล้ามเนื้อ เช่น tendon, ligament",
                  "**Adipose tissue** (เนื้อเยื่อไขมัน): จัดไว้เป็นหัวข้อย่อยใต้ connective tissue และบาง reference นับ adipose tissue เป็น connective tissue ประเภทหนึ่ง"
                ]
              },
              "รูปชิ้นเนื้อชี้ 3 ส่วน: muscle tissue, fat tissue และ connective tissue"
            ]
          },
          {
            "sub": "Muscle tissue 3 ชนิด",
            "body": [
              {
                "bullets": [
                  "**Skeletal muscle** (กล้ามเนื้อลาย): Facilitate movement & give support to the body; muscle fiber: sarcolemma, myofibril, myofilament; อยู่ใต้อำนาจจิตใจ ทำงานร่วมกับกระดูกเป็นโครงสร้างค้ำจุนและทำให้เคลื่อนไหว",
                  "**Smooth muscle** (กล้ามเนื้อเรียบ): Wall of tubular hollow organs; อยู่นอกอำนาจจิตใจ พบที่อวัยวะภายในและหลอดเลือด",
                  "**Cardiac muscle** (กล้ามเนื้อหัวใจ): พบเฉพาะที่หัวใจ ทำงานตลอดเวลาที่สัตว์ยังมีชีวิต"
                ]
              }
            ]
          },
          {
            "sub": "Structure of skeletal muscle fiber",
            "body": [
              "รูปตัดขวางของกล้ามเนื้อลาย ไล่จากนอกเข้าใน ป้ายบนรูปคือ tendon, deep fascia, epimysium, perimysium, fascicle, endomysium, muscle fiber (cell), sarcolemma และ myofibril พร้อมป้าย blood vessels, blood capillary และ motor neuron"
            ]
          }
        ]
      },
      {
        "heading": "ชนิดของ muscle fiber",
        "source": "Introduction to Meat Hygiene p.6-7; บันทึกคาบ 14 ต.ค. 2569 [17:20-19:55]",
        "body": [
          {
            "bullets": [
              "ชนิดของ muscle fiber **related to meat color & tenderness** ชนิดและปริมาณของ fiber ต่างกันตามชนิดสัตว์และตำแหน่งของกล้ามเนื้อ",
              "**Classified based on myosin isoforms**: Type I, Type IIA, Type IIX(D), Type IIB",
              "**Red muscle fibers** = Type I และ Type IIA",
              "**White muscle fibers** = Type IIX(D) และ Type IIB"
            ]
          },
          {
            "sub": "Characteristic of muscle fiber in meat animals",
            "body": [
              {
                "table": {
                  "headers": [
                    "Characteristic",
                    "Type I",
                    "Type IIA",
                    "Type IIX(D)",
                    "Type IIB"
                  ],
                  "rows": [
                    [
                      "Contraction speed",
                      "+",
                      "+++",
                      "+++",
                      "++++"
                    ],
                    [
                      "Redness",
                      "++++",
                      "+++",
                      "+",
                      "+"
                    ],
                    [
                      "Myoglobin content",
                      "++++",
                      "+++",
                      "+",
                      "+"
                    ],
                    [
                      "Fiber diameter",
                      "+",
                      "+",
                      "+++",
                      "++++"
                    ],
                    [
                      "Capillary density",
                      "++++",
                      "+++",
                      "+",
                      "+"
                    ],
                    [
                      "Oxidative metabolism",
                      "++++",
                      "++++",
                      "+",
                      "+"
                    ],
                    [
                      "Glycolytic metabolism",
                      "+",
                      "+",
                      "+++",
                      "++++"
                    ]
                  ]
                }
              },
              "ที่มา: Modified from Principles of Meat Science, 2001",
              {
                "bullets": [
                  "Red muscle fibers (I, IIA): myoglobin สูงกว่า หลอดเลือดมาเลี้ยงมากกว่า และใช้ oxidative metabolism เป็นหลัก",
                  "White muscle fibers (IIX(D), IIB): หลอดเลือดมาเลี้ยงน้อยกว่า เส้นผ่านศูนย์กลางของ fiber ใหญ่กว่า และใช้ glycolytic metabolism คือไม่ใช้ออกซิเจน เป็นหลัก",
                  "Type I กับ Type II ต่างกันที่ความเร็วของการหดตัว: Type II หดตัวได้เร็วกว่า Type I"
                ]
              },
              {
                "callout": "มีสองแกนที่ต้องแยกกัน: สีแดงหรือขาวแบ่งที่ I กับ IIA เทียบกับ IIX(D) กับ IIB ส่วน Type I กับ Type II แบ่งที่ความเร็วของการหดตัว (บันทึกคาบ 14 ต.ค. 2569 [19:40-19:55]) ในตาราง Type IIA จึงหดตัวเร็ว (+++) แต่ยังเป็น red fiber ที่ oxidative metabolism ++++",
                "kind": "tip"
              }
            ]
          }
        ]
      },
      {
        "heading": "Muscle protein 3 กลุ่ม",
        "source": "Introduction to Meat Hygiene p.8; บันทึกคาบ 14 ต.ค. 2569 [20:00-21:45]",
        "body": [
          {
            "bullets": [
              "**Myofibrillar protein** (Salt-soluble protein: ละลายในสารละลายเกลือ): Myosin, actin, tropomyosin, troponin",
              "**Sarcoplasmic protein** (Water-soluble protein: ละลายในน้ำ): Myoglobin, hemoglobin",
              "**Stromal protein** (Connective tissue protein: ไม่ละลายทั้งในน้ำและในสารละลายเกลือ): Collagen, elastin"
            ]
          },
          {
            "bullets": [
              "Actin และ myosin เป็นองค์ประกอบหลักที่ทำให้กล้ามเนื้อหดและคลายตัว",
              "สัตว์แต่ละชนิดมีสัดส่วนของ myofibrillar protein กับ stromal protein ต่างกัน ลักษณะของเนื้อจึงต่างกันตาม",
              "รูปเป็น sarcomere มีป้าย thin (actin) filament, thick (myosin) filament, Z disc, H zone, I band, A band, M line และ sarcoplasmic reticulum"
            ]
          }
        ]
      },
      {
        "heading": "องค์ประกอบทางเคมีของเนื้อ",
        "source": "Introduction to Meat Hygiene p.9-10; บันทึกคาบ 14 ต.ค. 2569 [22:00-23:55]",
        "body": [
          {
            "sub": "Composition of meat",
            "body": [
              {
                "bullets": [
                  "**Water**: content varies inversely with amount of fat เนื้อยิ่ง lean สัดส่วนของน้ำยิ่งมาก เพราะสิ่งที่มาแทนไขมันคือน้ำในกล้ามเนื้อ",
                  "**Organic compounds**: protein, lipid, carbohydrate ประกอบด้วยธาตุ C, H, O, N, S และ P",
                  "**Inorganic constituents**: เช่น Fe, Na, Mg, Zn มากน้อยขึ้นกับชนิดของสัตว์"
                ]
              }
            ]
          },
          {
            "sub": "Approximate composition of mammalian skeletal muscle",
            "body": [
              {
                "table": {
                  "headers": [
                    "Component",
                    "Percentage (range)"
                  ],
                  "rows": [
                    [
                      "Water",
                      "75.0 (65-80)"
                    ],
                    [
                      "Protein",
                      "18.5 (16-22)"
                    ],
                    [
                      "Lipid",
                      "3.0 (1.5-3.0)"
                    ],
                    [
                      "Carbohydrate",
                      "1.0 (0.5-1.5)"
                    ],
                    [
                      "Non-protein nitrogenous substrate",
                      "1.5"
                    ],
                    [
                      "Inorganic constituents",
                      "1.0"
                    ]
                  ]
                }
              },
              "ที่มา: Modified from Principles of Meat Science, 2001",
              {
                "bullets": [
                  "โดยประมาณ: น้ำราว 3 ใน 4 โปรตีนเกือบ 20% และ lipid ราว 3%",
                  "ปริมาณ lipid ต่างกันตามชนิดของสัตว์และตำแหน่งของกล้ามเนื้อ"
                ]
              }
            ]
          }
        ]
      },
      {
        "heading": "โปรตีน และ dipeptide ที่ใช้จำแนกชนิดเนื้อ",
        "source": "Introduction to Meat Hygiene p.11-12; บันทึกคาบ 14 ต.ค. 2569 [23:55-27:55]",
        "body": [
          {
            "sub": "Protein",
            "body": [
              {
                "bullets": [
                  "**Substances related to proteins**: purine, pyrimidine และ nucleopeptide ให้ flavor และ aroma ของเนื้อ",
                  "**Amino acids**: essential amino acid และ non-essential amino acid",
                  "**Dipeptides**: carnosine (CAR), anserine (ANS), balenine (BAL) ใช้ทำ **meat species identification**",
                  "สัดส่วนของ dipeptide ทั้งสามต่างกันในเนื้อสัตว์แต่ละชนิด จึงใช้บอกชนิดเนื้อได้แม้เนื้อถูกตัดเป็นชิ้นหรือแปรรูปเป็นเนื้อบดจนดูด้วยตาไม่ออก"
                ]
              }
            ]
          },
          {
            "sub": "Content & ratios of dipeptides in meat",
            "body": [
              {
                "table": {
                  "headers": [
                    "Meat/Muscle",
                    "Carnosine",
                    "Anserine",
                    "Balenine",
                    "Car/Ans",
                    "Bal/Ans"
                  ],
                  "rows": [
                    [
                      "Beef/leg",
                      "26.1",
                      "5.94",
                      "0.103",
                      "**5.45**",
                      "0.017"
                    ],
                    [
                      "Pork/leg",
                      "29.5",
                      "1.42",
                      "**1.77**",
                      "20.8",
                      "**1.25**"
                    ],
                    [
                      "Horse/leg",
                      "**42.6**",
                      "0.176",
                      "0.019",
                      "**242**",
                      "0.108"
                    ],
                    [
                      "Deer/leg",
                      "3.35",
                      "13.9",
                      "**3.91**",
                      "0.241",
                      "0.281"
                    ],
                    [
                      "Chicken/leg",
                      "5.7",
                      "17.1",
                      "0.055",
                      "0.33",
                      "0.003"
                    ],
                    [
                      "Chicken/breast",
                      "10.4",
                      "**32.0**",
                      "0.197",
                      "0.33",
                      "0.006"
                    ]
                  ]
                }
              },
              "Carnosine, anserine, balenine เป็น content หน่วย umol/g wet wt. ส่วน Car/Ans และ Bal/Ans เป็น dipeptide ratio ที่มา: Modified from Abe and Okuma, 1995 ค่าตัวหนาในตาราง คือเกณฑ์หลักที่ใช้จำแนกชนิดเนื้อ",
              {
                "bullets": [
                  "กล้ามเนื้อต่างตำแหน่งในสัตว์ชนิดเดียวกัน dipeptide ต่างกันเล็กน้อย แต่ต่างชนิดสัตว์จะต่างกันชัดเจน",
                  "**Beef**: Car/Ans ประมาณ 5 ไม่เกิน 10 ไม่ขึ้นหลักร้อยแบบเนื้อม้า และไม่ต่ำแบบเนื้อไก่ที่ประมาณ 0.3",
                  "**Horse**: carnosine สูงกว่าชนิดอื่น Car/Ans จึงขึ้นหลักร้อย ใช้แยกเนื้อม้าที่ถูกนำมาปลอมเป็นเนื้อวัว ซึ่งเคยเป็นเหตุการณ์ในยุโรป",
                  "**Pork**: Bal/Ans เกิน 1 ขณะที่เนื้อชนิดอื่นไม่ถึง 1 ใช้ตรวจว่าผลิตภัณฑ์ halal ไม่มีเนื้อหมูเจือปน",
                  "**Chicken**: anserine สูงที่สุดเมื่อเทียบกับเนื้อชนิดอื่น ส่วน pork มี anserine น้อย"
                ]
              }
            ]
          }
        ]
      },
      {
        "heading": "Lipid และ fatty acid",
        "source": "Introduction to Meat Hygiene p.13-16; บันทึกคาบ 14 ต.ค. 2569 [28:00-31:50]",
        "body": [
          {
            "sub": "Lipid",
            "body": [
              {
                "bullets": [
                  "โครงสร้างหลักของ lipid ในเนื้อคือ **triglycerides**",
                  "**Saturated fatty acids (SFA)**: palmitic acid, stearic acid ไม่มีพันธะคู่",
                  "**Unsaturated fatty acids (UFA)**: มีพันธะคู่ แบ่งเป็น monounsaturated fatty acid (MUFA) มีพันธะคู่ 1 ตำแหน่ง และ polyunsaturated fatty acid (PUFA) มีตั้งแต่ 2 ตำแหน่งขึ้นไป",
                  "**Hardness of lipid** related to ratio of SFA/UFA"
                ]
              }
            ]
          },
          {
            "sub": "Fatty acid composition of some fat & oil",
            "body": [
              {
                "table": {
                  "headers": [
                    "Percentage of total fatty acids",
                    "Lamb",
                    "Beef",
                    "Pork",
                    "Chicken",
                    "Salmon",
                    "Corn oil"
                  ],
                  "rows": [
                    [
                      "SFA",
                      "53",
                      "45",
                      "40",
                      "35",
                      "21",
                      "13"
                    ],
                    [
                      "UFA",
                      "47",
                      "55",
                      "60",
                      "65",
                      "79",
                      "87"
                    ],
                    [
                      "SFA/UFA ratio",
                      "1.13",
                      "0.82",
                      "0.67",
                      "0.54",
                      "0.27",
                      "0.15"
                    ]
                  ]
                }
              },
              "ลูกศร Hardness of lipid ชี้จาก Hard ที่ฝั่ง lamb ไป Soft ที่ฝั่ง corn oil: SFA/UFA ratio ยิ่งสูง ไขมันยิ่งแข็ง ที่มา: Modified from Meat Science: An Introductory Text, 2000"
            ]
          },
          {
            "sub": "Classification of PUFA",
            "body": [
              {
                "bullets": [
                  "แบ่งตามตำแหน่งของ double bond แรก นับจากปลาย methyl/omega (ω)",
                  "**ω-3 (n-3)**: α-linolenic acid (ALA), docosahexanoic acid (DHA), eicosapentaenoic acid (EPA)",
                  "**ω-6 (n-6)**: (γ) linolenic acid (GLA), arachidonic acid (AA)",
                  "ω-3 พบในปลาทะเลน้ำลึก ส่วน ω-6 พบได้ทั่วไป รวมทั้งในเนื้อหมู"
                ]
              }
            ]
          },
          {
            "sub": "Fatty acid composition in meat",
            "body": [
              {
                "table": {
                  "headers": [
                    "Percentage of total fatty acids",
                    "Beef",
                    "Pork",
                    "Lamb",
                    "Salmon"
                  ],
                  "rows": [
                    [
                      "16:0 palmitic",
                      "25.0",
                      "23.2",
                      "22.2",
                      "15.0"
                    ],
                    [
                      "18:0 stearic",
                      "13.4",
                      "12.2",
                      "18.1",
                      "2.92"
                    ],
                    [
                      "18:1 n-9 oleic",
                      "36.1",
                      "32.8",
                      "32.5",
                      "18.1"
                    ],
                    [
                      "18:2 n-6 linoleic",
                      "2.42",
                      "14.2",
                      "2.70",
                      "5.24"
                    ],
                    [
                      "18:3 n-3 ALA",
                      "0.70",
                      "0.95",
                      "1.37",
                      "1.47"
                    ],
                    [
                      "20:4 n-6 AA",
                      "0.63",
                      "**2.21**",
                      "0.64",
                      "0.40"
                    ],
                    [
                      "20:5 n-3 EPA",
                      "0.28",
                      "0.31",
                      "0.45",
                      "**6.45**"
                    ],
                    [
                      "22:6 n-3 DHA",
                      "0.05",
                      "0.39",
                      "0.15",
                      "**12.3**"
                    ],
                    [
                      "PUFA:SFA ratio",
                      "0.11",
                      "0.58",
                      "0.15",
                      "1.41"
                    ],
                    [
                      "n-6:n-3 PUFA ratio",
                      "2.11",
                      "7.22",
                      "1.32",
                      "0.34"
                    ]
                  ]
                }
              },
              "สองแถวล่างเป็นอัตราส่วน ไม่ใช่ร้อยละ ที่มา: Modified from Enser et al., 1996; Strobel et al., 2012",
              {
                "bullets": [
                  "Salmon เป็นตัวแทนของสัตว์น้ำในตาราง มี ω-3 ทั้ง EPA และ DHA มากที่สุด",
                  "**PUFA:SFA ratio**: ค่าสูงถือว่าดี salmon สูงที่สุด (1.41) รองลงมาคือ pork (0.58)",
                  "**n-6:n-3 PUFA ratio**: ค่ายิ่งต่ำยิ่งดี เพราะ n-3 เป็นตัวหาร salmon ต่ำที่สุด (0.34) รองลงมาคือ lamb (1.32) ส่วน pork สูงที่สุด (7.22) เพราะเนื้อหมูมี ω-6 มาก"
                ]
              }
            ]
          }
        ]
      },
      {
        "heading": "คาร์โบไฮเดรต แร่ธาตุ และวิตามิน",
        "source": "Introduction to Meat Hygiene p.17-19; บันทึกคาบ 14 ต.ค. 2569 [31:50-34:40]",
        "body": [
          {
            "sub": "Carbohydrate",
            "body": [
              {
                "bullets": [
                  "Most fresh meats are **poor sources of carbohydrate**",
                  "เก็บในรูป **glycogen**: liver glycogen (2-8% of liver weight) และ muscle glycogen",
                  "glycogen ในร่างกายราวครึ่งหนึ่งเก็บที่ตับ อีกครึ่งหนึ่งกระจายสะสมเป็น muscle glycogen",
                  "Muscle glycogen ถูกเปลี่ยนเป็น **lactic acid** หลังสัตว์ตาย (postmortem) แล้วสะสมในกล้ามเนื้อ"
                ]
              },
              "รูป: ในกล้ามเนื้อ glycogen กับ glucose เปลี่ยนไปมากัน และ glucose ผ่าน glycolysis ได้ ATP กับ lactate จากนั้น lactate ไปที่ตับ เข้า gluconeogenesis กลับเป็น glucose แล้วส่งกลับมาที่กล้ามเนื้อ"
            ]
          },
          {
            "sub": "Mineral",
            "body": [
              {
                "bullets": [
                  "Meat is good source of **iron & zinc**, but poor source of **calcium**",
                  "Iron มี 2 รูป: heme iron และ nonheme iron",
                  "แคลเซียมน้อยเมื่อบริโภคเฉพาะเนื้อ คือไม่ได้กินปลาตัวเล็กทั้งตัวหรือกินกระดูกเข้าไปด้วย"
                ]
              },
              {
                "table": {
                  "headers": [
                    "mg/100 g",
                    "Iron",
                    "Magnesium",
                    "Potassium",
                    "Sodium",
                    "Zinc",
                    "Copper"
                  ],
                  "rows": [
                    [
                      "Beef",
                      "**3.20**",
                      "27.0",
                      "352",
                      "65.0",
                      "**7.06**",
                      "0.013"
                    ],
                    [
                      "Chicken",
                      "1.06",
                      "27.0",
                      "247",
                      "77.0",
                      "1.23",
                      "0.05"
                    ],
                    [
                      "Lamb",
                      "2.05",
                      "26.0",
                      "343",
                      "75.0",
                      "5.36",
                      "0.12"
                    ],
                    [
                      "Pork",
                      "1.25",
                      "22.0",
                      "365",
                      "69.0",
                      "3.47",
                      "0.11"
                    ]
                  ]
                }
              },
              "ที่มา: Modified from Principles of Meat Science, 2001 ค่าตัวหนาคือค่าสูงสุดของธาตุนั้น",
              {
                "bullets": [
                  "เนื้อที่สีเข้มหรือแดงกว่ามี iron มากกว่า beef แดงที่สุดและมี iron มากที่สุดในตาราง",
                  "Magnesium ใกล้เคียงกันทุกชนิด potassium ของ chicken ต่ำกว่าชนิดอื่น และ beef มี zinc มากกว่าชนิดอื่น"
                ]
              }
            ]
          },
          {
            "sub": "Vitamin",
            "body": [
              {
                "bullets": [
                  "Meat is excellent source of **vitamin B complex**, but poor source of **vitamin C**",
                  "**Liver** is rich source of vitamin A, B complex, D & K"
                ]
              },
              {
                "table": {
                  "headers": [
                    "เนื้อ",
                    "Thiamin (B1)",
                    "Riboflavin (B2)",
                    "Niacin (B3)",
                    "Pantothenic acid (B5)",
                    "Pyridoxine (B6)",
                    "Folate (B9)",
                    "Cobalamin (B12)"
                  ],
                  "rows": [
                    [
                      "Beef",
                      "0.096",
                      "0.257",
                      "4.193",
                      "0.406",
                      "0.380",
                      "9",
                      "**2.68**"
                    ],
                    [
                      "Chicken",
                      "0.065",
                      "0.116",
                      "**12.42**",
                      "0.972",
                      "0.600",
                      "4",
                      "0.34"
                    ],
                    [
                      "Lamb",
                      "0.104",
                      "0.275",
                      "6.268",
                      "0.685",
                      "-",
                      "22",
                      "**2.58**"
                    ],
                    [
                      "Pork",
                      "**0.693**",
                      "0.356",
                      "5.077",
                      "0.783",
                      "0.420",
                      "8",
                      "0.83"
                    ]
                  ]
                }
              },
              "หน่วย: (mg/100 g) พิมพ์ใต้กลุ่มคอลัมน์ B1 ถึง B6 และ (ug/100 g) พิมพ์ใต้ B9 กับ B12 ที่มา: Modified from Principles of Meat Science, 2001",
              {
                "bullets": [
                  "ค่าตัวหนา: beef และ lamb มี B12 สูง, chicken มี B3 สูง, pork มี B1 สูง เมื่อเทียบกับชนิดอื่น"
                ]
              }
            ]
          }
        ]
      },
      {
        "heading": "Meat hygiene: นิยามและขอบเขตการควบคุม",
        "source": "Introduction to Meat Hygiene p.20; บันทึกคาบ 14 ต.ค. 2569 [34:40-37:20]",
        "body": [
          {
            "bullets": [
              "**Definition**: expert supervision of all meat products with the object of providing **wholesome meat for human consumption** & **preventing danger to public health**",
              "**Control of meat products**: from the time live animal arrives at abattoirs until meat & meat products are sold to consumer",
              "กรณี **export trade**: ถึงเมื่อสินค้า placed on board the carrier คือถูกขนขึ้นยานพาหนะที่จะนำออกนอกประเทศ"
            ]
          },
          {
            "bullets": [
              "ขอบเขตอาจนับรวมตั้งแต่ฟาร์มได้ คือการจับสัตว์ขึ้นรถ การขนย้ายจากฟาร์มมาโรงฆ่าสัตว์ และการต้อนสัตว์ลงจากรถเข้าคอกพัก แต่โดยทั่วไปนับตั้งแต่สัตว์มาถึงโรงฆ่าสัตว์และเข้าคอกพัก",
              "จุดสิ้นสุดเหล่านี้ใช้เป็นจุดตัด (cut off) ของความรับผิดชอบเมื่อมีการฟ้องร้องกัน"
            ]
          }
        ]
      }
    ]
  },

  // ─────────────────────────────────────────────────────────────
  'meat-seafood': {
    "topic": "meat-seafood",
    "title": "Seafood: quality changes & spoilage, seafood toxins",
    "lecturer": "สิรวิทย์ ภักดีพาณิชย์กิจ (SP)",
    "icon": "🐟",
    "summary": "อาหารจากสัตว์น้ำตามสไลด์ Seafood: quality changes & spoilage, seafood toxins ที่สอน 14 ต.ค. 2569 แบ่งเป็น 3 ส่วน คือองค์ประกอบทางเคมีของ seafood (water, protein, non-protein nitrogen compounds, lipid, องค์ประกอบย่อย, dark muscle กับ white muscle), การเปลี่ยนแปลงคุณภาพและการเน่าเสีย (ปัจจัยที่มีผล, rigor mortis, chemical, microbiological และ enzymatic changes, วิธีประเมินความสด 4 กลุ่ม) และ seafood toxins 8 ชนิด ตั้งแต่ ASP, DSP, AZP, PSP, CFP, NSP, puffer fish poisoning จนถึง scombroid fish poisoning พร้อมตารางสรุปท้ายสไลด์",
    "sections": [
      {
        "heading": "Chemical composition of seafood",
        "source": "Seafood p.2-5; บันทึกคาบ 14 ต.ค. 2569 [44:55-52:26]",
        "body": [
          "Seafood มี large variation & number of species: fish, shrimp, crab, snails (หอยฝาเดียว), bivalves (หอยสองฝา), squid ในหัวข้อนี้รวมสัตว์น้ำจืดด้วย และใช้ปลาเป็นตัวแทนหลัก",
          {
            "sub": "Chemical composition of fish, meats & other food sources (FAO 2015)",
            "body": [
              {
                "table": {
                  "headers": [
                    "Products",
                    "Water (%)",
                    "Protein (%)",
                    "Lipid (%)",
                    "Ash (%)"
                  ],
                  "rows": [
                    [
                      "**Fish**",
                      "60-81",
                      "16.4-25.2",
                      "0.4-21.5",
                      "1.2-1.5"
                    ],
                    [
                      "Beef",
                      "54.7-75.0",
                      "16.5-22.3",
                      "1.8-28.0",
                      "0.8-1.2"
                    ],
                    [
                      "Pork",
                      "41.1-75.1",
                      "11.2-22.8",
                      "1.2-47.0",
                      "0.6-1.0"
                    ],
                    [
                      "Chicken",
                      "75.0",
                      "22.8",
                      "0.9",
                      "1.2"
                    ],
                    [
                      "Milk (pasteurized)",
                      "87.6",
                      "3.2",
                      "3.5",
                      "NA"
                    ],
                    [
                      "Egg (boiled)",
                      "74.6",
                      "12.1",
                      "11.2",
                      "NA"
                    ]
                  ]
                }
              },
              "ไขมันในปลาโดยทั่วไปต่ำ แต่ช่วงกว้างจนเกิน 20% ในปลาไขมันสูงเช่น salmon โดย salmon เลี้ยงมีไขมันมากกว่า salmon จับ"
            ]
          },
          {
            "sub": "Chemical composition of seafood (FAO 2001)",
            "body": [
              {
                "table": {
                  "headers": [
                    "Species",
                    "Water (%)",
                    "Protein (%)",
                    "Lipid (%)",
                    "Energy value (Cal/lb)"
                  ],
                  "rows": [
                    [
                      "Catfish",
                      "78",
                      "17.0-19.7",
                      "2.1-3.8",
                      "410-530"
                    ],
                    [
                      "Salmon",
                      "67-77",
                      "21.5",
                      "0.3-14.0",
                      "NA"
                    ],
                    [
                      "Tuna",
                      "71",
                      "25.2",
                      "4.1",
                      "630"
                    ],
                    [
                      "Crab",
                      "70-74",
                      "13.1-22.4",
                      "0.2-7.5",
                      "430-560"
                    ],
                    [
                      "Lobster",
                      "64-75",
                      "14.5-19.7",
                      "0.3-14.5",
                      "410-890"
                    ],
                    [
                      "Shrimp",
                      "68-70",
                      "10.5-23.2",
                      "0.9",
                      "450-500"
                    ],
                    [
                      "Cockle",
                      "79-92",
                      "9.1-9.9",
                      "0.3-4.8",
                      "390"
                    ],
                    [
                      "Scallop",
                      "73-79",
                      "19.5",
                      "0.5-1.0",
                      "350"
                    ],
                    [
                      "Squid",
                      "78",
                      "14.9-19.2",
                      "1.1-1.5",
                      "390"
                    ]
                  ]
                }
              }
            ]
          },
          {
            "sub": "Major components of seafood",
            "body": [
              {
                "bullets": [
                  {
                    "label": "Water",
                    "value": "องค์ประกอบที่มากที่สุด"
                  },
                  {
                    "label": "Protein",
                    "value": "myofibrillar protein, sarcoplasmic protein, stroma protein, non-protein nitrogen compound"
                  },
                  {
                    "label": "Lipid",
                    "value": "saturated fatty acid, unsaturated fatty acid"
                  }
                ]
              }
            ]
          }
        ]
      },
      {
        "heading": "Water และ Protein",
        "source": "Seafood p.6-11; บันทึกคาบ 14 ต.ค. 2569 [52:26-61:27]",
        "body": [
          {
            "sub": "Water",
            "body": [
              {
                "bullets": [
                  "**Major constituent of fish flesh (60-80%)**",
                  "**Free water**: lost during freezing/thawing, storage & handling",
                  "**Bound water**: ประมาณ 4-5% of muscle"
                ]
              }
            ]
          },
          {
            "sub": "Protein 3 กลุ่มหลัก",
            "body": [
              {
                "bullets": [
                  "**Myofibrillar protein**: ปลา 65-75, สัตว์เลี้ยงลูกด้วยนมบก 50-55 (g/100 g of total protein); salt-soluble protein; structural protein: actin & myosin; สัดส่วนสูงกว่าสัตว์บก",
                  "**Sarcoplasmic protein**: ปลา 20-30, สัตว์บก 30-35; water-soluble protein; enzymes, pigmented proteins & other albumins: myoglobin, oxymyoglobin & oxyhemoglobin; hemocyanin (copper containing protein) ใน crustaceans, mollusks",
                  "**Stroma (stromal) protein**: ปลา 3-10, สัตว์บก 15-20; connective tissue proteins: collagen, elastin, gelatin; low content of collagen ทำให้ fish meat มี soft texture; rich in essential amino acid & more thermolabile"
                ]
              },
              {
                "bullets": [
                  "ตาราง (modified from Guerin, 2016) เทียบ fish muscle กับ mammalian skeletal muscle: ปลามี myofibrillar สูงกว่า แต่ sarcoplasmic และ stromal ต่ำกว่า",
                  "myofibrillar protein ในสัตว์น้ำสูงกว่าสัตว์บก เพราะสัตว์น้ำต้องเคลื่อนไหวในน้ำตลอดเวลา",
                  "**Hemocyanin** ทำหน้าที่ขนส่งออกซิเจน ไม่มีสีเมื่อยังไม่จับออกซิเจน และเป็นสีฟ้าเมื่อจับออกซิเจน",
                  "stroma protein ที่ขอบบนประมาณ 10% พบในปลากระดูกอ่อน เช่น ฉลาม กระเบน",
                  "collagen ของสัตว์น้ำเสียสภาพจากความร้อนได้ง่ายกว่าสัตว์บก หมึกหรือหอยที่ผ่านความร้อนสูงหรือนานจึงเหนียวและแข็ง"
                ]
              }
            ]
          },
          {
            "sub": "Non-protein nitrogen compound ในภาพรวม",
            "body": [
              "ประกอบด้วย free amino acids, peptides, nucleotides, guanidine compounds, trimethylamine oxide (TMAO), urea, betaines"
            ]
          }
        ]
      },
      {
        "heading": "Non-protein nitrogen compounds (NPN)",
        "source": "Seafood p.12-15; บันทึกคาบ 14 ต.ค. 2569 [61:27-68:59]",
        "body": [
          {
            "bullets": [
              "NPN คือ amino acids, dipeptides, nucleotides, guanidine compounds, amine oxides, urea",
              "**Volatile & malodorous** ระเหยง่ายและให้กลิ่นคาว",
              "Responsible for **sensorial characteristics & spoilage** of fishery products",
              "ปลากระดูกอ่อนมี NPN ประมาณ 30% ของ total nitrogen ส่วนปลากระดูกแข็งมีประมาณ 10%"
            ]
          },
          {
            "bullets": [
              "**Free amino acids**: contribute to taste: glycine, valine, alanine, glutamic acid",
              "**Free histidine**: พบมากใน dark muscle มากกว่า white muscle; converted to **histamine** by associated microorganism",
              "**Guanidine compounds**: พบมากใน white muscle มากกว่า dark muscle; energy reservoir of fish muscle",
              "**Trimethylamine oxide (TMAO)**: พบมากใน demersal fish มากกว่า pelagic fish; regulation of osmotic pressure & protect the denaturation of protein in fish tissue; degraded to trimethylamine (TMA) ซึ่งให้ fishy odor",
              "**Dipeptides**: carnosine (CAR), anserine (ANS), balenine (BAL); dark muscle > white muscle",
              "**Betaines**: osmotic adjustment: glycine betaine",
              "**Urea**: พบใน elasmobranch fish; degraded to ammonia (+ CO2) ทำให้ rise in pH & total volatile basic nitrogen (TVB-N)"
            ]
          },
          {
            "bullets": [
              "กุ้งและปูมีรสหวานกว่าเนื้อสัตว์ชนิดอื่นเพราะมี glycine มาก",
              "histidine ถูกเปลี่ยนเป็น histamine มากในปลากลุ่ม scombroid fish เช่น tuna, mackerel ซึ่งมีสัดส่วน dark muscle สูง",
              "demersal fish คือปลาหน้าดิน เช่น กระเบน ปลาตาเดียว ส่วน pelagic fish คือปลาผิวน้ำ เช่น tuna, sardine",
              "TMAO เองไม่มีสี ไม่มีกลิ่น ไม่มีรส กลิ่นคาวของเนื้อปลามาจาก TMA",
              "urea ถูกเปลี่ยนเป็น ammonia โดยเอนไซม์ urease ที่แบคทีเรียสร้าง",
              "TVB-N เรียกเป็นภาษาไทยว่าด่างที่ระเหยได้ทั้งหมด"
            ]
          }
        ]
      },
      {
        "heading": "Lipid และ fatty acids",
        "source": "Seafood p.16-20; บันทึกคาบ 14 ต.ค. 2569 [68:59-73:25]",
        "body": [
          {
            "sub": "Lipid และการจำแนกปลาตามไขมัน",
            "body": [
              {
                "bullets": [
                  "lipid ในปลาคือ triglycerides & phosphoglycerides",
                  {
                    "label": "Lean fish (fat ≤ 5%)",
                    "value": "cod, seabass ไขมันสะสมที่ตับเป็นหลัก"
                  },
                  {
                    "label": "Fatty fish (fat > 5%)",
                    "value": "salmon, mackerel ไขมันสะสมที่กล้ามเนื้อเป็นหลัก"
                  },
                  "fatty acids แบ่งเป็น saturated fatty acids และ unsaturated fatty acids (monounsaturated, polyunsaturated)"
                ]
              }
            ]
          },
          {
            "sub": "Saturated fatty acids, SFA",
            "body": [
              {
                "bullets": [
                  "ประมาณ 20-43% of fatty acid composition of wild fish",
                  "palmitic acid, stearic acid",
                  "lower SFA contents in coldwater fish",
                  "**The recommended minimum value of PUFA/SFA ratio = 0.45** for a balanced diet"
                ]
              }
            ]
          },
          {
            "sub": "Unsaturated fatty acids",
            "body": [
              {
                "bullets": [
                  {
                    "label": "Mono-unsaturated fatty acid (MUFA)",
                    "value": "palmitoleic acid, oleic acid"
                  },
                  {
                    "label": "Poly-unsaturated fatty acid (PUFA)",
                    "value": "ω-3 (n-3) fatty acid และ ω-6 (n-6) fatty acid"
                  },
                  {
                    "label": "ω-3 (n-3) fatty acid",
                    "value": "docosahexaenoic acid (DHA), eicosapentaenoic acid (EPA); originated from phytoplankton & seaweed ปลาไม่ได้สร้างเอง แต่ได้จากการกินแล้วสะสมไว้"
                  },
                  {
                    "label": "ω-6 (n-6) fatty acid",
                    "value": "arachidonic acid (AA)"
                  }
                ]
              }
            ]
          },
          {
            "sub": "Fatty acid composition of selected fish species, percentage of total fatty acids",
            "body": [
              {
                "table": {
                  "headers": [
                    "Fatty acid",
                    "Seabass",
                    "Salmon",
                    "Sardine",
                    "Mackerel"
                  ],
                  "rows": [
                    [
                      "16:0 palmitic",
                      "29.9",
                      "15.0",
                      "20.4",
                      "16.4"
                    ],
                    [
                      "18:0 stearic",
                      "6.58",
                      "2.92",
                      "7.91",
                      "6.77"
                    ],
                    [
                      "18:1 n-9 oleic",
                      "10.9",
                      "18.1",
                      "4.26",
                      "10.1"
                    ],
                    [
                      "18:2 n-6 LA",
                      "3.77",
                      "5.24",
                      "1.84",
                      "3.35"
                    ],
                    [
                      "18:3 n-3 ALA",
                      "1.44",
                      "1.47",
                      "0.67",
                      "1.56"
                    ],
                    [
                      "20:4 n-6 AA",
                      "2.80",
                      "0.40",
                      "1.04",
                      "1.34"
                    ],
                    [
                      "20:5 n-3 EPA",
                      "6.91",
                      "6.45",
                      "10.7",
                      "7.51"
                    ],
                    [
                      "22:6 n-3 DHA",
                      "13.8",
                      "12.3",
                      "**30.2**",
                      "**27.5**"
                    ],
                    [
                      "**PUFA:SFA ratio**",
                      "0.76",
                      "1.41",
                      "1.47",
                      "1.18"
                    ],
                    [
                      "**n-6:n-3 PUFA ratio**",
                      "0.08",
                      "0.34",
                      "0.40",
                      "0.13"
                    ]
                  ]
                }
              },
              {
                "bullets": [
                  "ที่มาของตาราง: modified from Strobel et al., 2012; Gokoglu and Yerlikaya, 2015 ค่าที่เด่นคือ DHA ของ sardine และ mackerel",
                  "PUFA:SFA ratio ของปลาทั้ง 4 ชนิดสูงกว่า 0.45",
                  "n-6:n-3 PUFA ratio ยิ่งน้อยยิ่งดี ปลาทั้ง 4 ชนิดมีค่าตั้งแต่ 0.08 ถึง 0.40"
                ]
              }
            ]
          }
        ]
      },
      {
        "heading": "Minor components และ dark muscle กับ white muscle",
        "source": "Seafood p.21-26; บันทึกคาบ 14 ต.ค. 2569 [73:25-79:55]",
        "body": [
          {
            "sub": "Carbohydrate, mineral, vitamin",
            "body": [
              {
                "bullets": [
                  "**Carbohydrate**: fish muscle contains low level of glycogen compared to mammals; carbohydrate content in marine is low & considered zero; high content of carbohydrate in some marine invertebrates",
                  "**Mineral, macroelement**: high level of Ca & P",
                  "**Mineral, microelement**: Fe: dark muscle > white muscle; Zn: oyster, liver & viscera of fish; mollusks & crustaceans: Zn, Cu, Mn; fish: Se",
                  "**Fat-soluble vitamin**: vitamin A, D, K: fish liver oil; small amounts of vitamin E",
                  "**Water-soluble vitamin**: vitamin B complex; B5: salmon, trout, abalone; B12: fish, oyster"
                ]
              },
              {
                "bullets": [
                  "glycogen ในกล้ามเนื้อปลาน้อย การเปลี่ยน glycogen เป็น lactic acid หลังตายจึงเกิดน้อยกว่าสัตว์บก",
                  "marine invertebrates ที่มี carbohydrate สูง เช่น กุ้งมังกร ปูม้า",
                  "Ca และ P สะสมในกระดูก ผู้บริโภคได้รับเมื่อกินปลาตัวเล็กทั้งตัวทั้งกระดูก"
                ]
              }
            ]
          },
          {
            "sub": "Dark muscle vs white muscle",
            "body": [
              {
                "bullets": [
                  "dark muscle มี **higher levels of lipids & myoglobin**",
                  "more minerals (Fe) & vitamins (vitamin B-complex, E)",
                  "**higher levels of TMAO**",
                  "more enzymes present",
                  "**Dark muscle deteriorating faster than white muscle**",
                  "removal of dark muscle is advisable during filleting เพื่อ reduce lipid oxidation & development of off-flavor"
                ]
              }
            ]
          },
          {
            "sub": "ตำแหน่งของ dark muscle",
            "body": [
              {
                "bullets": [
                  "(A) Most fish: dark muscle อยู่ขอบนอกของกล้ามเนื้อด้านข้างลำตัว",
                  "(B) Tuna: dark muscle ลึกเข้าไปถึงแนวกลางลำตัว",
                  "ภาพตัดขวางแสดง depth of dark muscle ของปลา 6 ชนิด (source: Love, 1988): (a) herring, (b) mackerel, (c) tuna, (d) haddock, (e) cod, (f) whiting โดย herring, mackerel และ tuna มีแถบ dark muscle หนากว่า haddock, cod และ whiting"
                ]
              }
            ]
          }
        ]
      },
      {
        "heading": "Seafood quality & freshness และปัจจัยที่มีผลต่อคุณภาพปลา",
        "source": "Seafood p.27-29; บันทึกคาบ 14 ต.ค. 2569 [79:55-92:44]",
        "body": [
          {
            "sub": "Seafood quality & freshness",
            "body": [
              "**Freshness is essential for quality of seafood final products** ใน 4 ด้าน",
              {
                "bullets": [
                  "Food safety",
                  "Organoleptic features (รูป กลิ่น สัมผัส รส)",
                  "Nutritional quality",
                  "Aptitude of industrial transformation (ความเหมาะสมที่จะเข้าสู่กระบวนการแปรรูป)"
                ]
              }
            ]
          },
          {
            "sub": "Factors affecting quality of fish",
            "body": [
              {
                "bullets": [
                  "**Species** (lean/fatty species): ปลาที่มีไขมันสูงเสื่อมเสียเร็วกว่าปลาไขมันน้อย",
                  "**Size** (surface area to volume ratio): สัตว์น้ำขนาดใหญ่เน่าช้ากว่าขนาดเล็ก เพราะอัตราส่วนพื้นที่ผิวต่อปริมาตรน้อยกว่า โอกาสที่แบคทีเรียปนเปื้อนเข้าเนื้อจึงน้อยกว่า",
                  "**Distance to port**: ยิ่งใช้เวลาขนส่งนาน การเสื่อมเสียยิ่งมาก",
                  "**Diet on fish** (effect on lipid content & flavor): ปลาเลี้ยงได้รับอาหารมากกว่าปลาจับ จึงสะสมไขมันมากกว่าและเสื่อมเสียง่ายกว่า",
                  "**Fishing grounds & methods**: วิธีจับที่ทำให้ปลาดิ้นรนก่อนตายทำให้ glycogen ถูกใช้ไปมาก lactic acid หลังตายจึงน้อย pH ของกล้ามเนื้อสูง จุลชีพโตง่าย ปลาจึงเน่าเร็ว",
                  "**Sex & time of the season**: ช่วงระหว่างหรือหลังฤดูวางไข่ ปลาดึงพลังงานสำรองจากกล้ามเนื้อไปใช้ คุณภาพกล้ามเนื้อจึงแย่"
                ]
              },
              "เทียบ farmed salmon กับ wild salmon (modified from David Wolfe, 2020): farmed salmon มีไขมันสีขาวแทรกในเนื้อมากกว่า"
            ]
          }
        ]
      },
      {
        "heading": "Deterioration/spoilage: rigor mortis, chemical, microbiological และ enzymatic changes",
        "source": "Seafood p.30-36; บันทึกคาบ 14 ต.ค. 2569 [92:44-105:50]",
        "body": [
          "การเสื่อมเสียของ fish & fishery products มี 4 กลุ่ม: rigor mortis, chemical changes, microbiological changes, enzymatic changes",
          {
            "sub": "Rigor mortis (Gokoglu and Yerlikaya, 2015)",
            "body": [
              {
                "bullets": [
                  "**Pre-rigor**: in the presence of ATP, myosin is linked to ATP; ATP ลดลงจนหมด, pH ลดลง, Ca++ เพิ่มขึ้น",
                  "**Rigor-mortis**: actomyosin is formed when ATP has finished; pH ต่ำคงที่, Ca++ สูงคงที่",
                  "**Post-rigor**: actomyosin is released by autolytic enzymes; pH กลับสูงขึ้น, bacterial activity เพิ่มขึ้น"
                ]
              },
              {
                "bullets": [
                  "pH ลดลงเพราะเกิด lactic acid เมื่อ pH ลด Ca++ เข้าสู่ sarcoplasm ได้มากขึ้น",
                  "pH สุดท้ายก่อนเข้า rigor ของปลาประมาณ 6.2-6.5 สูงกว่าเนื้อสัตว์บกที่ประมาณ 5.8-5.9 เพราะกล้ามเนื้อปลามี glycogen น้อยกว่า เนื้อปลาจึงเน่าจากแบคทีเรียได้ง่ายกว่า",
                  "การแข็งตัวของกล้ามเนื้อปลาเกิดจากส่วนหัวไล่ไปส่วนหาง",
                  "ระยะ post-rigor กล้ามเนื้อกลับมานิ่มจากการทำงานของเอนไซม์ในกล้ามเนื้อ",
                  "ปลาที่ยังอยู่ในระยะ pre-rigor หรือ rigor ถือว่ายังมีคุณภาพดี"
                ]
              }
            ]
          },
          {
            "sub": "Chemical changes",
            "body": [
              {
                "bullets": [
                  "**Autolysis & proteolysis by microbial enzymes**: peptides, amino acids, urea เปลี่ยนเป็น sulfide (S2-) และ ammonia (NH3)",
                  "**Trimethylamine oxide (TMAO) เปลี่ยนเป็น trimethylamine (TMA)**: fishy odor",
                  "**Lipid oxidation**: unsaturated fatty acid เปลี่ยนเป็น aldehyde & ketone products ทำให้เกิด rancid odor, off-flavor, color change"
                ]
              },
              {
                "sub": "Degradation of TMAO (Gokoglu and Yerlikaya, 2015)",
                "body": [
                  {
                    "bullets": [
                      "TMAO + NADH เปลี่ยนเป็น **TMA** + NAD+ + H2O โดย **TMAO reductase**",
                      "TMAO เปลี่ยนเป็น **DMA** โดย TMAOase (TMAO demethylase)",
                      "TMA เปลี่ยนเป็น **FA** โดย TMA dehydrogenase"
                    ]
                  }
                ]
              }
            ]
          },
          {
            "sub": "Microbiological changes",
            "body": [
              {
                "bullets": [
                  "bacterial flora on caught fish: **psychrotrophs** (ประมาณ 25 °C) และ **psychrophiles** (ประมาณ 15 °C) ตัวเลขคืออุณหภูมิที่โตได้ดี",
                  "produce compounds associated with off-odor & off-flavor",
                  "produce toxic biogenic amines: **histamine**",
                  "bacterial slime on surface: gill, skin, scale, peritoneum",
                  "bacteria found in both marine/freshwater fish & shellfish intestine: **Achromobacter spp., Pseudomonas spp., Flavobacterium spp.**",
                  "ขณะปลายังมีชีวิต แบคทีเรียที่เหงือกและผิวหนังเข้ากล้ามเนื้อไม่ได้ เมื่อปลาตายและเก็บรักษาไม่ดี แบคทีเรียจึงเข้ากล้ามเนื้อได้"
                ]
              }
            ]
          },
          {
            "sub": "Enzymatic changes",
            "body": [
              {
                "bullets": [
                  "enzymes kept in balance when fish alive หลังตายเอนไซม์ยังทำงานแต่ไม่สมดุล",
                  "penetrate gut wall & surrounding flesh, softening muscle แล้ว gut และ flesh ถูก spoilage bacteria บุกรุก",
                  "**Burst belly**: occur in few hours caused by enzymatic autolysis ผนังช่องท้องถูกย่อยจนบางและมีแก๊สสะสมในช่องท้อง พบบ่อยในปลา sardine และ herring"
                ]
              },
              {
                "bullets": [
                  "**Lipolysis** (เอนไซม์ lipase): glycerides, glycolipids, phospholipids เปลี่ยนเป็น free fatty acids; ผล: off-odor & off-flavor",
                  "**Proteolysis** (เอนไซม์ protease): nucleotide เปลี่ยนเป็น hypoxanthine, inosine, ATP, ADP, AMP; ผล: bitter fish flavor",
                  "**Melanosis in crustaceans** (เอนไซม์ tyrosinase): tyrosine เปลี่ยนเป็น melanin pigment; ผล: dark pigments in shrimp flesh"
                ]
              },
              "กุ้งที่ให้ score ของ melanosis 0, 2, 4, 6, 8, 10 (Otwell and Marshall, 1986) โดย 10 คือสีดำเข้มที่สุด กุ้งที่เริ่มมีสีดำคือความสดเริ่มลดลง",
              {
                "callout": "p.36 พิมพ์ nucleotide -> hypoxanthine, inosine, ATP, ADP, AMP ภายใต้ proteolysis (protease) ลำดับและเอนไซม์ที่พิมพ์ไม่ตรงกับทางสลาย ATP ตามปกติ (ATP, ADP, AMP, inosine, hypoxanthine)",
                "kind": "flag"
              }
            ]
          }
        ]
      },
      {
        "heading": "Evaluation of fish freshness & quality",
        "source": "Seafood p.37-45; บันทึกคาบ 14 ต.ค. 2569 [105:50-116:11]",
        "body": [
          "มี 4 กลุ่มวิธี: sensory methods, biochemical & chemical methods, microbiological methods, physical methods",
          {
            "sub": "Sensory methods",
            "body": [
              {
                "bullets": [
                  "can be applied to all fish & other seafoods",
                  "**quick & non-destructive testing**",
                  "judge quality by appearance, odor, texture & flavor",
                  "ใช้ **Quality Index Method (QIM) scheme** คะแนนยิ่งมากยิ่งไม่สด 0 คือดีที่สุด และสัตว์น้ำแต่ละชนิดมี scheme ของตัวเอง"
                ]
              }
            ]
          },
          {
            "sub": "QIM ของปลา (Larsen et al., 1992)",
            "body": [
              {
                "bullets": [
                  "**General appearance, skin**: 0 bright, shining; 1 bright; 2 dull",
                  "**General appearance, bloodspot on gill cover**: 0 none; 1 small, 10-30%; 2 big, 30-50%; 3 very big, 50-100%",
                  "**General appearance, stiffness**: 0 stiff, in rigor mortis; 1 elastic; 2 firm; 3 soft",
                  "**General appearance, belly**: 0 firm; 1 soft; 2 belly burst",
                  "**General appearance, smell**: 0 fresh, seaweed/metallic; 1 neutral; 2 musty/sour; 3 stale meat/rancid",
                  "**Eyes, clarity**: 0 clear; 1 cloudy",
                  "**Eyes, shape**: 0 normal; 1 plain; 2 sunken",
                  "**Gills, color**: 0 characteristic, red; 1 faded, discoloured",
                  "**Gills, smell**: 0 fresh, seaweed/metallic; 1 neutral; 2 sweaty/slightly rancid; 3 sour stink/stale, rancid",
                  "**Sum of scores**: min. 0 and max. 20"
                ]
              }
            ]
          },
          {
            "sub": "QIM ของ raw whole spiny lobster (Panulirus argus) stored in flake ice 1 °C (Goncalves et al., 2015)",
            "body": [
              {
                "table": {
                  "headers": [
                    "Parameters",
                    "Characteristics และ scores/demerit points"
                  ],
                  "rows": [
                    [
                      "Odor",
                      "0 fresh to sea; 1 neutral; 2 weak ammonia; 3 putrid"
                    ],
                    [
                      "Adhesion of the head body",
                      "0 strongly attached; 1 adherence average; 2 weak grip"
                    ],
                    [
                      "Adhesion of the exoskeleton to the flesh",
                      "0 strongly attached; 1 adherence average; 2 weak grip"
                    ],
                    [
                      "Meat firmness",
                      "0 rigid and firm; 1 slightly soft; 2 soft"
                    ],
                    [
                      "Meat color",
                      "0 translucent and shiny; 1 white gloss less intense; 2 opaque and milky"
                    ],
                    [
                      "Melanose (black spot) presence",
                      "0 none; 1 few (<25%); 2 many (>25%)"
                    ],
                    [
                      "Viscera liquefaction",
                      "0 whole, with clear liquid; 1 top of liquefaction; 2 liquefied"
                    ],
                    [
                      "**Quality index**",
                      "0-15"
                    ]
                  ]
                }
              }
            ]
          },
          {
            "sub": "Biochemical & chemical methods",
            "body": [
              {
                "bullets": [
                  {
                    "label": "Measurement of total volatile basic nitrogen (TVB-N)",
                    "value": "trimethylamine (TMA), dimethylamine (DMA), ammonia; useful for measurement of quality in cephalopods & crustaceans"
                  },
                  {
                    "label": "Detection of biogenic amines",
                    "value": "histidine เปลี่ยนเป็น histamine, ornithine เป็น putrescine, lysine เป็น cadaverine, tyrosine เป็น tyramine"
                  },
                  {
                    "label": "Detection of indole",
                    "value": "tryptophan degradation; evaluation of shrimp & crab freshness; tryptophan + water เปลี่ยนเป็น indole + pyruvate + ammonium โดย tryptophanase"
                  }
                ]
              },
              {
                "bullets": [
                  "biogenic amines เกิดจากแบคทีเรียในอาหารทะเลเปลี่ยนกรดอะมิโนบางชนิด",
                  "การตรวจ histamine **useful for determination of histamine in scombroid fish** เช่น tuna, mackerel ซึ่งเป็นเหตุของ scombroid poisoning",
                  "scombroid poisoning: allergic reaction (facial flushing, rash); nausea, diarrhea, abdominal cramps, tachycardia",
                  "แบคทีเรียที่ระบุไว้ในหัวข้อการตรวจ histamine: **Morganella morganii, Klebsiella pneumoniae, Hafnia alvei**",
                  "histamine เป็นสารพิษที่ทนความร้อน เมื่อเกิดแล้วการปรุงไม่ทำลาย",
                  "TVB-N ไม่นิยมใช้กับปลา เพราะค่า TVB-N ในปลาแตกต่างกันตามฤดูกาลที่จับ"
                ]
              }
            ]
          },
          {
            "sub": "Microbiological methods",
            "body": [
              {
                "bullets": [
                  {
                    "label": "Total counts",
                    "value": "represent total number of bacteria that are capable of forming visible colonies; good indication of product shelf life"
                  },
                  {
                    "label": "Detection of spoilage bacteria",
                    "value": "recognized certain bacteria that are the main cause of spoilage"
                  }
                ]
              }
            ]
          },
          {
            "sub": "Physical methods",
            "body": [
              {
                "bullets": [
                  {
                    "label": "pH",
                    "value": "placing electrode (pH-meter) directly into fish flesh/suspension & mollusks"
                  },
                  {
                    "label": "Electrical properties",
                    "value": "measuring postmortem change/degree of spoilage; different instrument reading when fish are frozen, damaged, bled"
                  },
                  "การวัด pH ที่ลดลงเหมาะกับหอย เพราะการเน่าเสียของหอยเกิดจากการหมักโดยแบคทีเรียเป็นหลัก ได้ volatile fatty acid ทำให้ pH ลดลงชัดเจน",
                  "ความต้านทานไฟฟ้าสูงบ่งว่าสัตว์น้ำสดกว่าตัวที่ความต้านทานต่ำ"
                ]
              }
            ]
          }
        ]
      },
      {
        "heading": "Seafood toxins: causes of seafood intoxications",
        "source": "Seafood p.46-49; บันทึกคาบ 14 ต.ค. 2569 [121:14-128:15]",
        "body": [
          {
            "sub": "Causes of seafood intoxications",
            "body": [
              {
                "bullets": [
                  "**Most of the toxins produced by marine unicellular algae & phytoplankton** สัตว์น้ำที่เรากินไม่ได้สร้างสารพิษเอง",
                  "**Except for scombroid toxin**, which produced by **spoilage bacteria**",
                  "accumulate in shellfish/finfish **without any harmful effects** สะสมตามห่วงโซ่อาหาร",
                  "**Tasteless, colorless, heat stable** จึงตรวจด้วยประสาทสัมผัสไม่ได้และการปรุงไม่ทำลาย",
                  "algae grow to large number & form **blooms** (ขี้ปลาวาฬ) ปัจจัย: nutrients, temperature, turbidity, stable conditions",
                  "**Prevention** of seafood intoxications depends on **surveillance & detection of toxins at the point of harvest**"
                ]
              },
              "bloom มีสีต่างกันตามชนิดของแพลงก์ตอน ที่พบบ่อยคือสีแดง สีน้ำตาล สีเขียว ตัวอย่างข่าวแพลงก์ตอนบลูม: น้ำทะเลเปลี่ยนสีที่อ่างศิลา-บางแสน, เกาะล้านกลายเป็นทะเลสีเขียว และภาพถ่ายดาวเทียมบริเวณอ่าวไทยวันที่ 19 กรกฎาคม 2569"
            ]
          },
          {
            "sub": "Seafood intoxications 8 ชนิด",
            "body": [
              {
                "bullets": [
                  "Amnesic shellfish poisoning (**ASP**)",
                  "Diarrhetic shellfish poisoning (**DSP**)",
                  "Azaspiracid shellfish poisoning (**AZP**)",
                  "Paralytic shellfish poisoning (**PSP**)",
                  "Ciguatera fish poisoning (**CFP**)",
                  "Neurotoxic shellfish poisoning (**NSP**)",
                  "Puffer fish poisoning (**PFP**)",
                  "Scombroid fish poisoning"
                ]
              }
            ]
          }
        ]
      },
      {
        "heading": "Shellfish poisoning: ASP, DSP, AZP, PSP, NSP",
        "source": "Seafood p.50-53, 56-57; บันทึกคาบ 14 ต.ค. 2569 [128:15-134:55, 136:55-139:10]",
        "body": [
          {
            "sub": "Amnesic shellfish poisoning, ASP",
            "body": [
              {
                "bullets": [
                  "eating shellfish contaminated with **domoic acid**",
                  "produced by **Pseudo-nitzschia (diatom)**",
                  "causes gastroenteritis & neurological disorders: diarrhea, abdominal cramps, vomiting; **confusion, memory loss, seizure**",
                  "supportive treatment: control seizures & reduce brain lesions",
                  "ข่าวของศูนย์วิจัยและพัฒนาประมงทะเลชุมพร เดือนพฤษภาคม 2569 เรื่องน้ำทะเลเปลี่ยนสี ซึ่งพบ diatom ชนิดนี้สูงผิดปกติ"
                ]
              }
            ]
          },
          {
            "sub": "Diarrhetic shellfish poisoning, DSP",
            "body": [
              {
                "bullets": [
                  "eating shellfish contaminated with **okadaic acid**",
                  "produced by **Dinophysis spp. (dinoflagellates)**",
                  "causes gastrointestinal symptoms: diarrhea, abdominal cramps, nausea, vomiting, chills",
                  "**complete recovery in 3 d**",
                  "mainly occur in Japan & northern Europe จาก eating toxic mussels, scallops, clams",
                  "have **mutagenic, cancer-inducing properties**"
                ]
              }
            ]
          },
          {
            "sub": "Azaspiracid shellfish poisoning, AZP",
            "body": [
              {
                "bullets": [
                  "eating shellfish contaminated with **azaspiracids**",
                  "produced by **Azadinium spp., Protoperidinium spp. (dinoflagellates)**",
                  "mainly found in mussels (oysters, clams, scallops)",
                  "causes gastrointestinal symptoms: diarrhea, abdominal cramps, nausea, vomiting",
                  "mainly presence in mussel from European countries, North Africa & Japan"
                ]
              }
            ]
          },
          {
            "sub": "Paralytic shellfish poisoning, PSP",
            "body": [
              {
                "bullets": [
                  "eating shellfish contaminated with **saxitoxins**",
                  "produced by **Alexandrium spp., Gymnodinium catenatum, Pyrodinium bahamense (dinoflagellates)**",
                  "affect both central & peripheral nervous systems",
                  "prickly feeling in lips, tongue, fingertips",
                  "ataxia gait, muscular incoordination, **ascending paralysis**",
                  "**death from respiratory failure**",
                  "occur worldwide in coastal regions",
                  "supportive treatment",
                  "saxitoxin ยับยั้ง sodium channel กลไกเดียวกับ tetrodotoxin",
                  "butter clam (Cowles, 2005) ชื่อวิทยาศาสตร์เป็นที่มาของชื่อ saxitoxin"
                ]
              }
            ]
          },
          {
            "sub": "Neurotoxic shellfish poisoning, NSP",
            "body": [
              {
                "bullets": [
                  "eating shellfish contaminated with **brevetoxin**",
                  "produced by **Karenia brevis (dinoflagellate)**",
                  "causes gastrointestinal & neurological symptoms",
                  "onset within 30 min to few hours & subside within 2 d",
                  "outbreaks mainly occur in the US (Gulf of Mexico, South Atlantic Bight) & New Zealand",
                  "observed when **water became red & massive fish kills occurred**",
                  "supportive treatment",
                  "The Florida red tide: น้ำทะเลสีแดง, แผนที่ Florida ที่จุดความเข้มข้นของ Karenia brevis และปลาตายเกลื่อนชายหาด"
                ]
              },
              {
                "callout": "ระยะเวลาของ NSP ในสไลด์ไม่ตรงกัน: p.56 เขียน subside within 2 d แต่ตารางสรุป p.63 ช่อง Onset; Duration เขียน 30 min-few hours; few hours",
                "kind": "flag"
              }
            ]
          }
        ]
      },
      {
        "heading": "Fish poisoning: ciguatera, puffer fish, scombroid",
        "source": "Seafood p.54-55, 58-62; บันทึกคาบ 14 ต.ค. 2569 [134:55-136:55, 139:10-147:19]",
        "body": [
          {
            "sub": "Ciguatera fish poisoning, CFP",
            "body": [
              {
                "bullets": [
                  "eating finfish contaminated with **ciguatoxin**",
                  "produced by toxic dinoflagellates",
                  "causes gastrointestinal & neurological symptoms",
                  "diarrhea, abdominal cramps, nausea, vomiting",
                  "**reversal of temperature sensation**, tingling & numbness of lips, tongue & digits, dryness of mouth, blurred vision",
                  "outbreaks usually occur in Hawaii, Florida, Puerto Rico",
                  "supportive treatment",
                  "Vector fish of ciguatoxins (Sankar, 2018): Striped Bristletooth Surgeonfish; Bluespine, Large, or Bignose Unicornfish; Humphead Wrasse; Sweetlip or Trumpet Emperor; Spotted Unicornfish; Bigeye Trevally, Jack, or Crevalle; Red Bass; Onespot Snapper; Blubberlip Snapper; Chinamanfish; Parrotfish; Brown Marbled Grouper; Great Barracuda; Harlequin Sweetlips; Coral Trout; Blue Dot Grouper; Undulated Moray"
                ]
              }
            ]
          },
          {
            "sub": "Puffer fish poisoning, PFP",
            "body": [
              {
                "bullets": [
                  "eating fish belonging to **tetraodontiformes** (fugu, puffer fish)",
                  "**Tetrodotoxin**, produced by Proteobacteria, Firmicutes, Actinobacteria, Bacteroidetes (bacteria)",
                  "symptoms similar to PSP (nervous systems)",
                  "nausea, vomiting, gastrointestinal pain may follow in some cases",
                  "commonly occur in Pacific regions near Japan & China",
                  "can be fatal by consumption of **improperly prepared fugu**",
                  "supportive treatment",
                  "สารพิษสะสมที่รังไข่ อัณฑะ ตับ และผิวหนังของปลา เนื้อปลาเองไม่มีหรือมีน้อยมาก การชำแหละไม่ถูกวิธีทำให้สารพิษปนเปื้อนเข้าเนื้อ"
                ]
              },
              {
                "sub": "Taxonomy composition of TTX-producing bacteria",
                "body": [
                  {
                    "bullets": [
                      "Proteobacteria 104 strains, Actinobacteria 23 strains, Firmicutes 21 strains, Bacteroidetes 2 strains",
                      "ชิ้นใหญ่ที่สุดของ pie chart คือ Vibrio",
                      "รูปสัตว์ที่พบ TTX แยกเป็น terrestrial animals และ marine animals นอกจากปลาปักเป้ายังพบในปลานกแก้ว ปลาพระอาทิตย์ blue-ringed octopus ดาวทะเลบางชนิด กบพิษ และนิวต์"
                    ]
                  }
                ]
              },
              {
                "sub": "แมงดาทะเล",
                "body": [
                  {
                    "bullets": [
                      "**แมงดาจาน** (Tachypleus gigas): หางสามเหลี่ยม ไม่มีพิษ",
                      "**แมงดาถ้วย** (Carcinoscorpius rotundicauda): หางกลม มีพิษ"
                    ]
                  },
                  "แมงดาถ้วยตัวเล็กกว่าแมงดาจาน ในประเทศไทยผู้เสียชีวิตจากสารพิษกลุ่มนี้ส่วนใหญ่มาจากการกินแมงดาถ้วย ไม่ใช่ปลาปักเป้า ตารางสรุป seafood toxins ใส่ horseshoe crab ไว้ในช่อง food affected ของ puffer fish poisoning ด้วย"
                ]
              }
            ]
          },
          {
            "sub": "Scombroid fish poisoning",
            "body": [
              {
                "bullets": [
                  "eating fish contaminated with **histamine**",
                  "**most prevalent of seafood transmitted illness worldwide**",
                  "commonly reported in Japan, Canada, US, UK",
                  "symptoms similar to **IgE-mediated food allergy**",
                  "facial flushing, rash, itching, mouth burning sensation",
                  "nausea, vomiting, diarrhea, headache, dizziness",
                  "hypotension, tachycardia, respiratory distress & shock may occur in severe cases",
                  "most cases are mild & self-limiting",
                  "แบคทีเรียที่ปนเปื้อนเปลี่ยน histidine เป็น histamine ด้วยเอนไซม์ histidine decarboxylase เมื่อเก็บปลาที่อุณหภูมิไม่เหมาะสม"
                ]
              },
              {
                "table": {
                  "headers": [
                    "กลุ่มปลา",
                    "ตัวอย่าง"
                  ],
                  "rows": [
                    [
                      "**Scombroid fish**",
                      "tuna, bonito, mackerel"
                    ],
                    [
                      "**Non-scombroid fish**",
                      "mahi-mahi, salmon, bluefish, sardine, abalone"
                    ]
                  ]
                }
              },
              "พิษเกือบทั้งหมดเกิดจากปลากลุ่ม scombroid โดยเฉพาะส่วน dark muscle ซึ่งสะสม histamine มาก กลุ่ม non-scombroid เกิดได้ด้วยกระบวนการเดียวกัน แต่โอกาสน้อยกว่า"
            ]
          }
        ]
      },
      {
        "heading": "ตารางสรุป seafood intoxications",
        "source": "Seafood p.63; บันทึกคาบ 14 ต.ค. 2569 [147:19-147:39]",
        "body": [
          "ตาราง (modified from Johnson and Schantz, 2017)",
          {
            "bullets": [
              "**Amnesic shellfish poisoning**: diatom (Pseudo-nitzschia); Northeastern Canada, rare in US, EU, JAP, AUS, NZ; mussels, clams, scallops; domoic acid; hours; months to years",
              "**Diarrhetic shellfish poisoning**: toxic dinoflagellates; EU, JAP, rare in Chile, SE Asia, NZ; mussels, clams, scallops; okadaic acid; hours; days",
              "**Azaspiracid shellfish poisoning**: toxic dinoflagellates; EU, N Africa, JAP; mussels, clams, oysters; azaspiracid & derivatives; hours; days",
              "**Paralytic shellfish poisoning**: toxic dinoflagellates; worldwide in coastal regions; mussels, clams, scallops, some finfish; saxitoxin; 5-30 min; few hours-few days",
              "**Ciguatera fish poisoning**: toxic dinoflagellates; worldwide in tropical areas; tropical fish; ciguatoxin; hours; months-years",
              "**Neurotoxic shellfish poisoning**: dinoflagellate (Karenia brevis); Gulf of Mexico, S Atlantic Bight, NZ; scallops, clams, oysters; brevetoxin; 30 min-few hours; few hours",
              "**Puffer fish poisoning**: puffer fish, possibly produced by bacteria; Pacific regions near JAP & CN, rare in US; puffer fish (horseshoe crab); tetrodotoxin; 5-30 min; few hours-few days",
              "**Scombroid fish poisoning**: bacterial decomposition of improperly refrigerated fish (>5 °C); worldwide; various fish (tuna, mackerel, mahi-mahi); histamine; 10-90 min; hours"
            ]
          }
        ]
      }
    ]
  },

  // ─────────────────────────────────────────────────────────────
  'meat-microbiology': {
    "topic": "meat-microbiology",
    "title": "Microbiology of meat & meat hygiene",
    "lecturer": "ธราดล เหลืองทองคำ (TL)",
    "icon": "🦠",
    "summary": "จุลชีววิทยาของเนื้อสัตว์ในระดับสุขศาสตร์เนื้อสัตว์: แหล่งปนเปื้อน ปัจจัยที่มีผลต่อการโตของเชื้อ จำนวนเชื้อกับการเน่าเสีย แบคทีเรียที่ทำให้เสียและเชื้อก่อโรคที่พบบนเนื้อ ยีสต์และรา เชื้อในเนื้อที่เพิ่งชำแหละ เนื้อแช่เย็น และเนื้อบรรจุ การควบคุมการปนเปื้อน การตรวจทางจุลชีววิทยา indicator organism และมาตรฐานของกรมปศุสัตว์กับกรมวิทยาศาสตร์การแพทย์",
    "sections": [
      {
        "heading": "เนื้อสัตว์ปนเปื้อนจากไหน และเชื้อกลุ่มใดสำคัญ",
        "source": "Meat microbiology slides p.2-3; บันทึกคาบ 7 ต.ค. 2569 [1:07-4:45]",
        "body": [
          {
            "bullets": [
              "เนื้อจากสัตว์ที่สุขภาพดีแทบปราศจากแบคทีเรียหรือสิ่งปนเปื้อนอื่น",
              "แหล่งปนเปื้อนเริ่มตั้งแต่ฟาร์ม เช่น bedding และมูลบนพื้นคอก",
              "การปนเปื้อนเกิดเป็นหลักช่วงฆ่า (slaughter), เก็บรักษา (storage) และกระจายสินค้า (distribution)",
              "ในโรงฆ่า ขั้นนำเครื่องในออกจากซากมีโอกาสปนเปื้อนสูง เพราะลำไส้มีเชื้อจำนวนมาก",
              "เชื้อที่สำคัญที่สุดคือแบคทีเรีย ทั้งชนิดที่ทำให้เนื้อเสีย (spoilage) และชนิดก่อโรค (pathogenic) เพราะเพาะเลี้ยงได้",
              "ยังพบ yeast, mold, virus, parasite และ protozoa",
              "เชื้อที่พบบนเนื้อบอกความปลอดภัย (safety) ของเนื้อ ส่วนเชื้อที่ทำให้เสียกำหนดอายุการเก็บรักษา (shelf-life)"
            ]
          }
        ]
      },
      {
        "heading": "ปัจจัยที่มีผลต่อการโตของเชื้อ: ระยะการโต สารอาหาร และออกซิเจน",
        "source": "Meat microbiology slides p.4-8; บันทึกคาบ 7 ต.ค. 2569 [4:45-7:50]",
        "body": [
          {
            "sub": "ปัจจัย 5 ข้อ",
            "body": [
              {
                "bullets": [
                  "Essential nutrients (สารอาหาร)",
                  "Oxygen",
                  "Temperature",
                  "Moisture (water activity)",
                  "Acidity หรือ pH"
                ]
              }
            ]
          },
          {
            "sub": "Bacterial growth curve",
            "body": [
              {
                "bullets": [
                  {
                    "label": "Lag phase",
                    "value": "เชื้อปรับตัวเข้ากับสิ่งแวดล้อม ยังไม่เพิ่มจำนวน"
                  },
                  {
                    "label": "Log phase",
                    "value": "เชื้อเพิ่มจำนวนมาก"
                  },
                  {
                    "label": "Stationary phase",
                    "value": "จำนวนที่เพิ่มกับที่ตายสูสีกัน"
                  },
                  {
                    "label": "Death phase",
                    "value": "อาหารหมด เชื้อส่วนใหญ่ตาย จำนวนลดลง"
                  },
                  "ถ้ายืด lag phase ให้นานที่สุด เชื้อไม่เพิ่มจำนวน และเก็บรักษาเนื้อได้นานขึ้น"
                ]
              }
            ]
          },
          {
            "sub": "สารอาหาร",
            "body": [
              {
                "bullets": [
                  "เนื้อมีสารอาหารครบสำหรับการโตของแบคทีเรีย ยีสต์ และรา",
                  {
                    "label": "องค์ประกอบทั่วไป",
                    "value": "water 64-80%, protein 16-20%, fat 6-20%, ash 1-1.5%, soluble non-protein substances 3.5-5%"
                  }
                ]
              },
              {
                "table": {
                  "headers": [
                    "องค์ประกอบ",
                    "Beef",
                    "Pork",
                    "Chicken"
                  ],
                  "rows": [
                    [
                      "Water",
                      "69%",
                      "42%",
                      "71%"
                    ],
                    [
                      "Protein",
                      "20%",
                      "12%",
                      "20%"
                    ],
                    [
                      "Fat",
                      "10%",
                      "45%",
                      "7%"
                    ],
                    [
                      "Ash",
                      "1%",
                      "0.5%",
                      "1%"
                    ]
                  ]
                }
              },
              {
                "callout": "ตาราง pork ในสไลด์ให้ water 42% ซึ่งต่ำกว่าช่วง water 64-80% ที่สไลด์เดียวกันระบุไว้ก่อนหน้า",
                "kind": "flag"
              }
            ]
          },
          {
            "sub": "ออกซิเจน",
            "body": [
              {
                "bullets": [
                  "แบ่งเชื้อตามออกซิเจนที่เหมาะต่อการโต: obligate aerobe, microaerophilic, facultative anaerobe, obligate anaerobe",
                  "ในหลอดอาหารเลี้ยงเชื้อ: obligate aerobe โตที่ผิวบน, microaerophilic โตใต้ผิวเล็กน้อย, facultative anaerobe โตตลอดหลอด, obligate anaerobe โตที่ก้นหลอด"
                ]
              }
            ]
          }
        ]
      },
      {
        "heading": "ปัจจัยที่มีผลต่อการโตของเชื้อ: อุณหภูมิ water activity และ pH",
        "source": "Meat microbiology slides p.9-13",
        "body": [
          {
            "sub": "อุณหภูมิ (ปัจจัยที่สำคัญที่สุด)",
            "body": [
              {
                "bullets": [
                  {
                    "label": "Psychrophiles",
                    "value": "บางชนิดของแบคทีเรียที่ทำให้เสีย"
                  },
                  {
                    "label": "Psychrotrophs",
                    "value": "แบคทีเรียที่ทำให้เสียส่วนใหญ่ เช่น Pseudomonas spp."
                  },
                  {
                    "label": "Mesophiles",
                    "value": "แบคทีเรียก่อโรคส่วนใหญ่ เช่น Salmonella spp."
                  },
                  "Thermophiles: แบคทีเรียก่อโรคบางชนิด เช่น Clostridium botulinum"
                ]
              },
              {
                "callout": "สไลด์หน้า 9 ยกตัวอย่าง thermophiles เป็น Clostridium botulinum แต่ตาราง growth range ของ thermophiles คือ 40 ถึง 70 °C และตำราทั่วไปจัด C. botulinum เป็นเชื้อที่โตที่อุณหภูมิกลาง (mesophile) ไม่ใช่ thermophile",
                "kind": "flag"
              },
              {
                "table": {
                  "headers": [
                    "กลุ่ม",
                    "Growth range (°C)",
                    "Optimal range (°C)"
                  ],
                  "rows": [
                    [
                      "Psychrophiles",
                      "-5 ถึง 20",
                      "0 ถึง 10"
                    ],
                    [
                      "Psychrotrophs",
                      "0 ถึง 35",
                      "15 ถึง 25"
                    ],
                    [
                      "Mesophiles",
                      "15 ถึง 45",
                      "30 ถึง 40"
                    ],
                    [
                      "Thermophiles",
                      "40 ถึง 70",
                      "55 ถึง 65"
                    ]
                  ]
                }
              }
            ]
          },
          {
            "sub": "Water activity (aw)",
            "body": [
              {
                "bullets": [
                  "aw มีค่า 0-1 และ aw ของเนื้อคือ 0.99",
                  "aw ต่ำสุดโดยประมาณที่เชื้อโตได้ (minimum aw):",
                  {
                    "label": "มากกว่า 0.98",
                    "value": "จุลินทรีย์ส่วนใหญ่"
                  },
                  {
                    "label": "0.97",
                    "value": "Gram-negative aerobic bacteria เช่น Pseudomonas spp."
                  },
                  {
                    "label": "0.93",
                    "value": "Gram-negative facultative anaerobes เช่น E. coli, Salmonella"
                  },
                  {
                    "label": "0.85",
                    "value": "Gram-positive bacteria เช่น S. aureus"
                  },
                  {
                    "label": "0.70",
                    "value": "ราและยีสต์ส่วนใหญ่"
                  }
                ]
              }
            ]
          },
          {
            "sub": "pH",
            "body": [
              {
                "bullets": [
                  "จุลินทรีย์ส่วนใหญ่โตได้ที่ pH 5.0-8.0",
                  "pH ของเนื้ออยู่ราว 5.3-6.0"
                ]
              },
              {
                "table": {
                  "headers": [
                    "กลุ่ม",
                    "Tolerance limit",
                    "Optimal range"
                  ],
                  "rows": [
                    [
                      "Obligate aerobes",
                      "5.5-9.0",
                      "6.5-8.0"
                    ],
                    [
                      "Facultative anaerobes",
                      "4.5-9.0",
                      "6.0-7.5"
                    ],
                    [
                      "Fermenting bacteria",
                      "4.5-9.0",
                      "5.5-7.0"
                    ],
                    [
                      "Lactic acid bacteria",
                      "3.5-7.5",
                      "5.5-6.5"
                    ],
                    [
                      "Spoilage yeasts",
                      "1.5-9.0",
                      "4.0-6.0"
                    ],
                    [
                      "Spoilage molds",
                      "0.5-11.0",
                      "4.0-6.0"
                    ]
                  ]
                }
              }
            ]
          }
        ]
      },
      {
        "heading": "จำนวนเชื้อกับสัญญาณของการเน่าเสีย",
        "source": "Meat microbiology slides p.15, 17-18; บันทึกคาบ 7 ต.ค. 2569 [103:29-104:44]",
        "body": [
          {
            "bullets": [
              "แบคทีเรียที่ทำให้เสียมีสัดส่วนสูงที่มาจากอุจจาระและดิน",
              "แบคทีเรียที่ทำให้เสียส่วนใหญ่พบที่ผิวซาก",
              "การโตและสารที่เชื้อสร้างทำให้ลักษณะและกลิ่นของเนื้อเสีย",
              "การเสียของเนื้อขึ้นกับ 3 ข้อ: จำนวนเชื้อปนเปื้อนตั้งแต่ต้น, ชนิดของแบคทีเรียที่ทำให้เสีย, เวลาและอุณหภูมิที่เก็บ",
              "ถ้าชะลอไม่ให้เชื้อเพิ่มจำนวนถึง 10⁶ การเสียของเนื้อและการเกิดโรคจะช้าลง"
            ]
          },
          {
            "sub": "จำนวนแบคทีเรียกับการเปลี่ยนแปลงของเนื้อ",
            "body": [
              {
                "table": {
                  "headers": [
                    "จำนวนเชื้อ",
                    "สิ่งที่เห็น"
                  ],
                  "rows": [
                    [
                      "10³ ถึง 10⁶",
                      "ยังไม่เห็นว่าเสีย"
                    ],
                    [
                      "10⁶ ถึง 10⁷",
                      "ผลิตภัณฑ์บางส่วนมีกลิ่นไม่พึงประสงค์"
                    ],
                    [
                      "10⁷ ถึง 10^7.5",
                      "เห็นกลิ่นผิดปกติชัดเจน"
                    ],
                    [
                      "10^7.5 ถึง 10^8.5",
                      "เนื้อเกือบทั้งหมดแสดงการเสียชัด (slime)"
                    ],
                    [
                      "10^8.5 ถึง 10^10",
                      "โครงสร้างของเนื้อเปลี่ยน"
                    ]
                  ]
                }
              }
            ]
          }
        ]
      },
      {
        "heading": "แบคทีเรียที่ทำให้เนื้อเสีย: ผิวกับส่วนลึก และตัวหลักในเนื้อที่เก็บแบบแอโรบิก",
        "source": "Meat microbiology slides p.16-20",
        "body": [
          {
            "bullets": [
              {
                "label": "Surface spoilage",
                "value": "Pseudomonas, Acinetobacter, Moraxella, Psychrobacter และ Brochothrix เป็นสาเหตุหลักในซากเนื้อและสัตว์ปีก"
              },
              {
                "label": "Deep spoilage",
                "value": "Clostridium และ Enterococcus เป็นสาเหตุหลัก มักเกิดใกล้กระดูก"
              },
              "ยังพบ Aeromonas, Alteromonas, Enterobacter, Shewanella, Micrococcus, Streptococcus, Pediococcus, Lactobacillus, Leuconostoc, Proteus และ Flavobacterium"
            ]
          },
          {
            "sub": "Pseudomonas spp.",
            "body": [
              {
                "bullets": [
                  "Gram-negative, obligate aerobic, psychrotrophic; เช่น P. fluorescens, P. fragi",
                  "เป็นสาเหตุสำคัญที่สุดของ aerobic spoilage ของเนื้อ",
                  "ต้องการ aw ตั้งแต่ 0.97 ขึ้นไป",
                  "ใช้ glucose ก่อน (ไม่มีกลิ่น) จากนั้นใช้ amino acid และสร้างสารมีกลิ่น เช่น sulfide และ ester"
                ]
              }
            ]
          },
          {
            "sub": "Acinetobacter spp. และ Moraxella spp.",
            "body": [
              {
                "bullets": [
                  "Gram-negative, obligate aerobic; โตดีที่อุณหภูมิเก็บต่ำ",
                  "ใช้ amino acid แต่ไม่สร้างสารมีกลิ่น จึงมี spoilage potential ต่ำ",
                  "Acinetobacter เป็นสาเหตุหลักของการเสียในเนื้อที่ pH สูงกว่า 6.0 และเก็บที่อุณหภูมิต่ำ"
                ]
              }
            ]
          }
        ]
      },
      {
        "heading": "แบคทีเรียที่ทำให้เนื้อเสีย: เนื้อบรรจุสูญญากาศ และเชื้อไม่ใช้อากาศ",
        "source": "Meat microbiology slides p.21-27",
        "body": [
          {
            "sub": "Brochothrix thermosphacta",
            "body": [
              {
                "bullets": [
                  "Gram-positive, facultative anaerobe; โตดีที่อุณหภูมิเก็บต่ำและ aw ต่ำ",
                  "ใช้เฉพาะ glucose; สร้างกลิ่นในสภาพมีอากาศมากกว่าสภาพไม่มีอากาศ",
                  "เป็นสาเหตุหลักของการเสียของเนื้อบรรจุสูญญากาศ"
                ]
              }
            ]
          },
          {
            "sub": "Lactobacillus spp.",
            "body": [
              {
                "bullets": [
                  "Gram-positive, anaerobic (aerotolerant); โตดีในสภาพไม่มีอากาศ อุณหภูมิเก็บต่ำ และ aw ต่ำ (aw ตั้งแต่ 0.91 ขึ้นไป)",
                  "คล้าย B. thermosphacta แต่โตได้ดีกว่าในสภาพไม่มีอากาศและสภาพกรด (pH ไม่เกิน 4.5)",
                  "ใช้ glucose และ amino acid โดยเฉพาะ arginine, leucine, valine",
                  "สร้าง volatile fatty acid ให้กลิ่น “cheesy”",
                  "เป็นสาเหตุหลักของการเสียของเนื้อบรรจุสูญญากาศ"
                ]
              }
            ]
          },
          {
            "sub": "Shewanella putrefaciens และ Serratia liquefaciens",
            "body": [
              {
                "bullets": [
                  {
                    "label": "Shewanella putrefaciens",
                    "value": "Gram-negative, facultative anaerobe; คล้าย Pseudomonas เมื่อมีอากาศ; สร้างสารซัลไฟด์ เช่น hydrogen sulfide เมื่อไม่มีอากาศ; ไม่โตในสภาพกรด (pH ไม่เกิน 6) จึงโตในเนื้อ pH ปกติไม่ได้"
                  },
                  {
                    "label": "Serratia liquefaciens",
                    "value": "Gram-negative, facultative anaerobe (เดิมคือ Enterobacter liquefaciens); โตในเนื้อ pH ปกติได้แต่ช้ากว่าใน DFD"
                  },
                  "ทั้งสองเป็นสาเหตุหลักของการเสียของเนื้อ DFD (pH มากกว่า 6) ที่บรรจุสูญญากาศ"
                ]
              }
            ]
          },
          {
            "sub": "Clostridium spp. และ Enterobacteriaceae อื่น",
            "body": [
              {
                "bullets": [
                  {
                    "label": "Clostridium spp.",
                    "value": "Gram-positive, spore-forming, obligate anaerobe; พบในดินและทางเดินอาหารของสัตว์เลือดอุ่น; โตดีที่ aw ตั้งแต่ 0.95 ขึ้นไป; ไม่โตในสภาพกรด (pH ต่ำกว่า 4.5); เช่น C. sporogenes, C. histolyticum, C. butyricum"
                  },
                  {
                    "label": "Enterobacteriaceae อื่น",
                    "value": "Gram-negative, facultative anaerobes; ใช้ glucose ก่อนแล้วใช้ amino acid และสร้างสารซัลไฟด์ (เหมือน Pseudomonas); สำคัญในฐานะเชื้อก่อโรคมากกว่าเชื้อที่ทำให้เสีย"
                  }
                ]
              }
            ]
          }
        ]
      },
      {
        "heading": "เชื้อก่อโรคที่พบบนเนื้อ: แบคทีเรีย ไวรัส และปรสิต",
        "source": "Meat microbiology slides p.28-33, 36-37",
        "body": [
          {
            "bullets": [
              "การปนเปื้อนของเชื้อก่อโรคไม่ทำให้ลักษณะภายนอกของเนื้อเปลี่ยน",
              "แบคทีเรียก่อโรคหลัก: Salmonella enterica, Campylobacter jejuni, pathogenic E. coli, Yersinia enterocolitica, Clostridium perfringens"
            ]
          },
          {
            "sub": "แบคทีเรียก่อโรค",
            "body": [
              {
                "bullets": [
                  {
                    "label": "Salmonella enterica",
                    "value": "facultative anaerobe, mesophile; อยู่ในทางเดินอาหารของสัตว์ผลิตอาหาร และปนเปื้อนระหว่างแปรรูป"
                  },
                  {
                    "label": "Campylobacter jejuni",
                    "value": "microaerophilic; ไม่เพิ่มจำนวนในเนื้อและผลิตภัณฑ์; โตดีที่ 42 °C (thermophilic Campylobacter)"
                  },
                  {
                    "label": "Pathogenic E. coli",
                    "value": "EHEC, VTEC หรือ STEC สร้าง Shiga-like toxin; E. coli O157:H7 พบใน ground beef"
                  },
                  {
                    "label": "Yersinia enterocolitica",
                    "value": "facultative anaerobe, psychrotrophic (โตที่อุณหภูมิต่ำได้); เกี่ยวข้องกับสุกรเป็นหลัก"
                  },
                  {
                    "label": "Clostridium perfringens",
                    "value": "spore-forming, obligate anaerobe; เป็น foodborne toxicoinfection เมื่อกินอาหารที่มีเชื้อมากกว่า 10⁶; พบในเนื้อสุกและผลิตภัณฑ์ที่วางที่อุณหภูมิห้องนานกว่า 2 ชั่วโมง"
                  }
                ]
              },
              {
                "bullets": [
                  "ควบคุมโดยปรุงให้สุกทั่วถึงและหลีกเลี่ยง cross-contamination (Salmonella, Campylobacter, E. coli)",
                  "หลีกเลี่ยงเนื้อสุกรดิบหรือไม่สุก และป้องกัน cross-contamination ในครัว (Yersinia)",
                  "หลีกเลี่ยงการเตรียมอาหารล่วงหน้า และเก็บอาหารที่อุณหภูมิที่เหมาะหลังปรุง (C. perfringens)"
                ]
              }
            ]
          },
          {
            "sub": "ไวรัส ปรสิต และ protozoa",
            "body": [
              {
                "bullets": [
                  {
                    "label": "ไวรัส",
                    "value": "ไม่ทำให้เสีย แต่ก่อโรคในคน ส่วนใหญ่ปนเปื้อนจากผู้สัมผัสอาหาร (food handlers); Hepatitis E virus, Hepatitis A virus, Norovirus"
                  },
                  {
                    "label": "ปรสิตและ protozoa",
                    "value": "Trichinella spiralis (เนื้อสุกรดิบ), Taenia saginata (เนื้อวัวดิบ), Taenia solium (เนื้อสุกรดิบ), Toxoplasma gondii (เนื้อหลายชนิด), Sarcocystis hominis (เนื้อวัวดิบ), Sarcocystis suihominis (เนื้อสุกรดิบ)"
                  },
                  "ปรสิตและ protozoa เหล่านี้ถูกทำลายได้ง่ายด้วยอุณหภูมิปรุงสุก จึงต้องปรุงเนื้อให้สุกทั่วถึง"
                ]
              }
            ]
          }
        ]
      },
      {
        "heading": "ยีสต์และราบนเนื้อ",
        "source": "Meat microbiology slides p.34-35, 44",
        "body": [
          {
            "bullets": [
              "โตได้ในสภาพ aw ต่ำ",
              "พบในเนื้อที่เก็บนาน อย่างน้อย 4-6 สัปดาห์ ที่ผิวเนื้อแช่เย็น โตช้ากว่าแบคทีเรียมากแต่ทนการลดลงของ aw ได้ดีกว่า",
              "ราที่ผิวเนื้อพบในสภาพแห้งและเป็นกรด และอาจทำให้เกิดกลิ่นหืน"
            ]
          },
          {
            "sub": "ยีสต์",
            "body": [
              {
                "bullets": [
                  "Candida, Torulopsis, Rhodotorula (และ Cryptococcus ในเนื้อแช่เย็น)",
                  "Candida zeylanoides และ Candida lipolytica (Yarrowia lipolytica)",
                  "ทำให้เกิด slime และเปลี่ยนลักษณะ สี กลิ่น และรสของเนื้อ"
                ]
              }
            ]
          },
          {
            "sub": "รา",
            "body": [
              {
                "bullets": [
                  {
                    "label": "Thamnidium, Mucor, Rhizopus",
                    "value": "มักทำให้เกิดรอยสีขาว (white patches)"
                  },
                  {
                    "label": "Penicillium",
                    "value": "มักทำให้เกิดรอยสีเขียว (green patches)"
                  },
                  {
                    "label": "Cladosporium",
                    "value": "สาเหตุที่พบบ่อยของ “black spot”"
                  },
                  {
                    "label": "Sporotrichum, Chrysosporium",
                    "value": "สาเหตุที่พบบ่อยของ “white spot”"
                  },
                  "ราที่โตได้ที่อุณหภูมิต่ำ (psychrotrophic molds): Penicillium, Cladosporium, Thamnidium, Chrysosporium, Mucor, Rhizopus"
                ]
              }
            ]
          }
        ]
      },
      {
        "heading": "เชื้อในเนื้อที่เพิ่งชำแหละ",
        "source": "Meat microbiology slides p.38-39",
        "body": [
          "จุลินทรีย์ในเนื้อแบ่งตามสภาพเป็น 3 กลุ่ม: เนื้อที่เพิ่งชำแหละ (freshly-slaughtered), เนื้อแช่เย็น (chilled) และเนื้อบรรจุ (packaged)",
          {
            "bullets": [
              {
                "label": "แหล่งปนเปื้อน",
                "value": "สัตว์ (ผิวหนังและลำไส้), สิ่งแวดล้อมในโรงฆ่า และคน"
              },
              {
                "label": "จำนวนเชื้อ",
                "value": "ประมาณ 10² ถึง 10⁴ CFU/g"
              },
              {
                "label": "ชนิดเชื้อ",
                "value": "mesophiles รวมถึง coliforms, enterococci และ micrococci ตลอดจน Clostridium perfringens และ Staphylococcus aureus"
              }
            ]
          }
        ]
      },
      {
        "heading": "เชื้อในเนื้อแช่เย็นและเนื้อแช่แข็ง",
        "source": "Meat microbiology slides p.40-45",
        "body": [
          {
            "bullets": [
              "อุณหภูมิและ aw เป็นปัจจัยที่สำคัญที่สุดต่อกลุ่มเชื้อในเนื้อแช่เย็น",
              "ระดับเชื้อในเนื้อแช่เย็นขึ้นกับการปนเปื้อนตั้งแต่ต้นและอัตราการลดอุณหภูมิ (cooling rate)",
              {
                "label": "ซากที่แช่เย็นเร็ว",
                "value": "shelf-life ยาวกว่า แต่เนื้อเหนียวกว่า"
              },
              {
                "label": "ซากที่แช่เย็นช้า",
                "value": "shelf-life สั้นกว่า แต่เนื้อนุ่มกว่า"
              },
              "การแช่เย็นซากสุกรให้เร็วอาจช่วยป้องกัน PSE (pale, soft, exudative)"
            ]
          },
          {
            "sub": "เชื้อหลักในเนื้อแช่เย็น",
            "body": [
              {
                "bullets": [
                  "psychrotrophs และ/หรือ psychrophiles: Pseudomonas, Acinetobacter, Moraxella, Brochothrix thermosphacta, Lactobacillus, Shewanella และ Enterobacteriaceae บางสกุล",
                  "ยังพบ Aeromonas, Alcaligenes, Arthrobacter และ Flavobacterium",
                  "Pseudomonas เป็นชนิดเด่นในการแช่เย็นแบบแอโรบิกปกติ",
                  "Brochothrix thermosphacta และ Lactobacilli อาจเด่นขึ้นเมื่อ aw ลดลง",
                  "Acinetobacter อาจเป็นชนิดเด่นเมื่อ pH ของเนื้อสูงกว่า 6.0"
                ]
              }
            ]
          },
          {
            "sub": "การแช่แข็ง",
            "body": [
              {
                "bullets": [
                  "การที่น้ำเปลี่ยนเป็นน้ำแข็งขณะแช่แข็งทำให้ aw ลดลง",
                  "Micrococcus, Streptococcus และ Staphylococcus ทนการแช่แข็งและ/หรือการเก็บแบบแช่แข็งได้ดีกว่า"
                ]
              }
            ]
          }
        ]
      },
      {
        "heading": "เนื้อบรรจุ: สีของเนื้อ บรรจุภัณฑ์แบบผู้บริโภค และสูญญากาศ",
        "source": "Meat microbiology slides p.46-50",
        "body": [
          {
            "sub": "สีของเนื้อ",
            "body": [
              {
                "bullets": [
                  "สีของเนื้อกำหนดโดยปฏิกิริยาระหว่าง myoglobin กับออกซิเจน",
                  {
                    "label": "Oxymyoglobin",
                    "value": "สีแดงสด เกิดเมื่อออกซิเจนความเข้มข้นสูง"
                  },
                  {
                    "label": "Metmyoglobin",
                    "value": "สีน้ำตาล เกิดเมื่อออกซิเจนความเข้มข้นต่ำ"
                  }
                ]
              }
            ]
          },
          {
            "sub": "Consumer packaging",
            "body": [
              {
                "bullets": [
                  "ออกซิเจนซึมผ่านได้สูง",
                  "Pseudomonas เป็นสาเหตุหลักของการเสีย อาจมี Moraxella, Enterobacter, Brochothrix thermosphacta และ Acinetobacter ร่วมด้วย",
                  "การเสียแสดงออกเป็นสีเปลี่ยนจาก metmyoglobin และกลิ่นผิดปกติจากการสลาย amino acid"
                ]
              }
            ]
          },
          {
            "sub": "Vacuum packaging",
            "body": [
              {
                "bullets": [
                  "เกิด metmyoglobin น้อยที่สุด และสีคงตัวระหว่างเก็บ",
                  "การโตของ Pseudomonas ถูกจำกัด",
                  "Lactobacillus และ/หรือ Brochothrix thermosphacta เป็นเชื้อหลัก",
                  "ในสภาพไม่มีอากาศ Lactobacillus โตเร็วกว่า Brochothrix thermosphacta"
                ]
              }
            ]
          },
          {
            "bullets": [
              "shelf-life ของเนื้อบรรจุถูกกำหนดโดย: ความเข้มข้นของออกซิเจน, ชนิดเชื้อตั้งต้น (โดยเฉพาะการโตของ Pseudomonas) และ pH ของเนื้อ",
              "เนื้อบรรจุแบบผู้บริโภคเสียเร็วกว่าเนื้อบรรจุสูญญากาศ"
            ]
          }
        ]
      },
      {
        "heading": "เนื้อ DFD ที่บรรจุสูญญากาศ และสรุปเชื้อใน 3 สภาพของเนื้อ",
        "source": "Meat microbiology slides p.23-25, 51-53",
        "body": [
          {
            "sub": "เนื้อ dark, firm, dry (DFD) บรรจุสูญญากาศ",
            "body": [
              {
                "bullets": [
                  "pH มากกว่า 6.0 และมี glucose น้อยมากหรือไม่มี",
                  "เสียเร็วกว่าเนื้อที่ pH ปกติ มีกลิ่นผิดปกติและสีเขียวเฉพาะตัว (green discoloration)",
                  {
                    "label": "Shewanella putrefaciens (Alteromonas putrefaciens)",
                    "value": "สาเหตุหลักของสีเขียว เกิดจาก H2S ทำปฏิกิริยากับ myoglobin; เติม citrate buffer ช่วยป้องกันสีเขียวได้"
                  },
                  {
                    "label": "Serratia liquefaciens (Enterobacter liquefaciens)",
                    "value": "สาเหตุหลักของกลิ่นเสีย; เติม glucose หรือ citrate ช่วยป้องกันกลิ่นนี้ได้"
                  }
                ]
              }
            ]
          },
          {
            "sub": "เชื้อกลุ่มใดมากหรือน้อย ในแต่ละสภาพของเนื้อ",
            "body": [
              {
                "bullets": [
                  {
                    "label": "เนื้อที่เพิ่งชำแหละ",
                    "value": "Aerobes สูง, Anaerobes ต่ำ, Mesophiles สูง, Psychrotrophs/Psychrophiles ต่ำ"
                  },
                  {
                    "label": "เนื้อแช่เย็น",
                    "value": "Aerobes สูง, Anaerobes ต่ำ, Mesophiles ต่ำ, Psychrotrophs/Psychrophiles สูง"
                  },
                  {
                    "label": "เนื้อบรรจุ",
                    "value": "Aerobes ต่ำ, Anaerobes สูง, Mesophiles ต่ำ, Psychrotrophs/Psychrophiles สูง"
                  }
                ]
              }
            ]
          }
        ]
      },
      {
        "heading": "แหล่งปนเปื้อนและการควบคุมเชื้อบนเนื้อ",
        "source": "Meat microbiology slides p.54-58; บันทึกคาบ 7 ต.ค. 2569 [101:01-112:23]",
        "body": [
          "การปนเปื้อนเริ่มที่ฟาร์ม และเกิดระหว่างฆ่า แปรรูป เก็บรักษา และกระจายสินค้า",
          {
            "sub": "แหล่งปนเปื้อน",
            "body": [
              {
                "bullets": [
                  "ผิวหนังและอวัยวะของสัตว์ โดยเฉพาะเท้าและทางเดินอาหาร",
                  "อุปกรณ์ในการฆ่า เช่น มีด และ captive bolt (ใช้ร่วมกันหลายตัว จึงเป็นทางปนเปื้อนได้)",
                  "น้ำที่ใช้ในการฆ่าและแปรรูป (โรงฆ่าใช้น้ำมาก น้ำไม่สะอาดทำให้ปนเปื้อนง่าย)",
                  "สิ่งแวดล้อมระหว่างฆ่า แปรรูป และเก็บรักษา",
                  "มือของผู้สัมผัสเนื้อ (handlers)"
                ]
              }
            ]
          },
          {
            "sub": "การควบคุม 3 ขั้น (เพื่อความปลอดภัยและยืด shelf-life)",
            "body": [
              {
                "bullets": [
                  {
                    "label": "1 ป้องกันการปนเปื้อน",
                    "value": "ระวังทุกขั้นตอน เช่น ไม่ผ่าช่องท้องก่อนลอกหนังหรือถอนขน, ป้องกันซากสัมผัสกัน, ล้างอุปกรณ์ให้สะอาด, สุขอนามัยส่วนบุคคลที่ดี"
                  },
                  {
                    "label": "2 ทำลายหรือลดจำนวนเชื้อที่ปนเปื้อน",
                    "value": "trimming, ล้างซากด้วยน้ำร้อน 82 °C, พ่นสารละลายกรดอินทรีย์ (เช่น lactic acid 1-2%), steam pasteurization, ฉายรังสี (เช่น gamma radiation 5 kGy)"
                  },
                  {
                    "label": "3 ป้องกันหรือชะลอการโตและเพิ่มจำนวน",
                    "value": "ลดอุณหภูมิเนื้อและซากเหลือ 4 °C ในเวลาสั้น, เปลี่ยนสภาพการเก็บ (บรรจุสูญญากาศ, เติมคาร์บอนไดออกไซด์หรือ nitrous oxide ในบรรจุภัณฑ์)"
                  }
                ]
              }
            ]
          },
          {
            "sub": "ข้อจำกัดของแต่ละวิธี",
            "body": [
              {
                "bullets": [
                  "ป้องกันการปนเปื้อนตั้งแต่ต้นทำได้ยากในทางปฏิบัติ เพราะการเลี้ยงสัตว์ในฟาร์มเสี่ยงสูง",
                  "การป้องกันไม่ให้ซากสัมผัสกันทำได้ในสัตว์ใหญ่ที่แขวนเป็นรายตัว แต่ทำได้ยากในไก่ที่แช่ซากร่วมกันในน้ำเย็น (chilling)",
                  "Trimming ใช้ได้เฉพาะส่วนที่มองเห็นด้วยตาเปล่า ใช้กับแบคทีเรียทั่วไปหรือไวรัสไม่ได้",
                  "น้ำร้อน 82 °C ใช้ในสัตว์ใหญ่เป็นส่วนใหญ่ และลดเชื้อที่ผิวซาก",
                  "Lactic acid อาจทำให้ซากซีด จึงกระทบคุณภาพซาก",
                  "การฉายรังสีทำลายได้ทั้งเชื้อก่อโรคและเชื้อที่ทำให้เสีย แต่ผู้บริโภคอาจกังวลเรื่องสารตกค้าง",
                  "การลดอุณหภูมิให้ต่ำกว่า 4 °C เร็ว ได้ผลดีกับเชื้อก่อโรคเป็นหลัก เพราะส่วนใหญ่เป็น mesophiles จึงไม่โตที่อุณหภูมินี้",
                  "ช่วง 4-60 °C คือช่วงที่เชื้อเพิ่มจำนวนได้ การลดอุณหภูมิให้ต่ำกว่า 4 °C เร็วจึงลดเวลาที่เชื้อโตได้"
                ]
              }
            ]
          }
        ]
      },
      {
        "heading": "การตรวจทางจุลชีววิทยาของเนื้อและซาก และ indicator organism",
        "source": "Meat microbiology slides p.59; บันทึกคาบ 7 ต.ค. 2569 [112:23-118:28]",
        "body": [
          {
            "sub": "5 ขั้นตอน",
            "body": [
              {
                "bullets": [
                  {
                    "label": "1 Sampling",
                    "value": "เช่น swabbing, rinsing, excision"
                  },
                  {
                    "label": "2 Dilution",
                    "value": "เนื้อที่เพิ่งชำแหละมีเชื้อราว 10²-10⁴ อ่านผลตรง ๆ ไม่ได้ เพราะต้องนับที่ 25-250 โคโลนี"
                  },
                  {
                    "label": "3 Plating",
                    "value": "pour plate หรือ spread plate, อาหารเลี้ยงเชื้อแบบ non-selective หรือ selective"
                  },
                  {
                    "label": "4 Incubation",
                    "value": "1-2 วัน ที่ 35-37 °C"
                  },
                  {
                    "label": "5 Enumeration",
                    "value": "นับที่ 25 ถึง 250 โคโลนี"
                  },
                  "ตรวจอย่างน้อย total plate count และ coliforms (indicator organism)"
                ]
              }
            ]
          },
          {
            "sub": "เลือกวิธีและอาหารเลี้ยงเชื้อ",
            "body": [
              {
                "bullets": [
                  "ต้องการนับเชื้อทั้งหมด ใช้ plate technique และอาหารแบบ non-selective",
                  "ต้องการเชื้อกลุ่มเฉพาะ เช่น เชื้อก่อโรคหรือเชื้อที่ทำให้เสียชนิดใดชนิดหนึ่ง ใช้ spread plate และ selective media",
                  "ถ้าสนใจรา ต้องบ่มนานกว่า 1-2 วัน",
                  "บางตำราใช้ช่วงนับ 30-300 โคโลนี"
                ]
              }
            ]
          },
          {
            "sub": "วิธีเก็บตัวอย่าง",
            "body": [
              {
                "bullets": [
                  {
                    "label": "Swab",
                    "value": "ไม่ทำให้ซากเสียหาย ใช้อุปกรณ์ง่าย แต่เชื้อที่เกาะแน่นที่ผิวอาจเก็บไม่หมด; พื้นที่ swab ราว 10 ตร.ซม. ในสัตว์เล็ก และราว 50 ตร.ซม. ต่อจุดในสัตว์ใหญ่"
                  },
                  {
                    "label": "Rinse",
                    "value": "นิยมในสัตว์ตัวเล็ก เช่น ไก่ โดยใส่ซากทั้งตัวในถุงพร้อมสารละลายสำหรับ rinse แล้วเขย่า"
                  },
                  {
                    "label": "Excision",
                    "value": "ตัดชิ้นเนื้อมาตรวจ ได้เชื้อที่เกาะแน่นด้วย แต่ทำให้ซากเสียหาย"
                  }
                ]
              }
            ]
          },
          {
            "callout": "Total plate count และ coliform เป็น indicator organism ที่บอกว่าการผลิตเนื้อสะอาดเพียงใด ดูจาก coliform เป็นหลัก",
            "kind": "tip"
          }
        ]
      },
      {
        "heading": "มาตรฐานจุลชีววิทยา: เนื้อแช่เย็นและแช่แข็ง (DLD และ DMSc)",
        "source": "Meat microbiology slides p.60-62, 65; บันทึกคาบ 7 ต.ค. 2569 [118:28-122:28]",
        "body": [
          {
            "sub": "กรมปศุสัตว์ (DLD): chilled or frozen meat and poultry meat",
            "body": [
              {
                "bullets": [
                  {
                    "label": "Aerobic plate count",
                    "value": "≤ 5.0 × 10⁵ CFU/g"
                  },
                  {
                    "label": "Coliforms",
                    "value": "≤ 5.0 × 10³ organisms/g"
                  },
                  {
                    "label": "Escherichia coli",
                    "value": "≤ 1.0 × 10² organisms/g"
                  },
                  {
                    "label": "Staphylococcus aureus",
                    "value": "≤ 1.0 × 10² CFU/g"
                  },
                  {
                    "label": "Enterococcus spp.",
                    "value": "≤ 1.0 × 10³ CFU/g"
                  },
                  {
                    "label": "Salmonella spp.",
                    "value": "ไม่พบใน 25 g ของตัวอย่าง"
                  },
                  {
                    "label": "ไม่มีเกณฑ์ที่ DLD กำหนด",
                    "value": "Campylobacter jejuni และ C. coli, Listeria monocytogenes, Clostridium perfringens, yeasts และ molds"
                  }
                ]
              }
            ]
          },
          {
            "sub": "กรมวิทยาศาสตร์การแพทย์ (DMSc): chilled or frozen meat and poultry meat",
            "body": [
              {
                "bullets": [
                  {
                    "label": "Total plate count",
                    "value": "< 5.0 × 10⁶ CFU/g"
                  },
                  {
                    "label": "Escherichia coli",
                    "value": "< 1.0 × 10² MPN/g"
                  },
                  {
                    "label": "Staphylococcus aureus",
                    "value": "< 1.0 × 10² CFU/g"
                  },
                  {
                    "label": "Clostridium perfringens",
                    "value": "< 1.0 × 10³ CFU/g"
                  },
                  {
                    "label": "Salmonella spp.",
                    "value": "ไม่พบใน 25 g"
                  },
                  {
                    "label": "Campylobacter jejuni และ C. coli",
                    "value": "ไม่พบใน 25 g"
                  }
                ]
              },
              "DLD กำหนดทั้ง coliforms (≤ 5.0 × 10³ organisms/g) และ E. coli (≤ 1.0 × 10² organisms/g) ส่วน DMSc กำหนดเฉพาะ E. coli (< 1.0 × 10² MPN/g) ไม่กำหนด coliforms และ Enterococcus; DMSc กำหนด Campylobacter และ C. perfringens แต่ DLD ไม่กำหนดสำหรับเนื้อดิบที่แช่เย็นหรือแช่แข็ง"
            ]
          }
        ]
      },
      {
        "heading": "มาตรฐานจุลชีววิทยา: เนื้อปรุงสุก (DLD) เทียบกับเนื้อดิบ",
        "source": "Meat microbiology slides p.63-65; บันทึกคาบ 7 ต.ค. 2569 [122:28-124:44]",
        "body": [
          {
            "sub": "เนื้อปรุงสุกและผลิตภัณฑ์เนื้อ (DLD)",
            "body": [
              {
                "bullets": [
                  {
                    "label": "Aerobic plate count",
                    "value": "≤ 1.0 × 10⁵ CFU/g"
                  },
                  {
                    "label": "Coliforms",
                    "value": "≤ 1.0 × 10² organisms/g"
                  },
                  {
                    "label": "Escherichia coli",
                    "value": "ไม่พบ (ND)"
                  },
                  {
                    "label": "Clostridium perfringens",
                    "value": "ไม่พบ"
                  },
                  {
                    "label": "Staphylococcus aureus",
                    "value": "ไม่พบ"
                  },
                  {
                    "label": "Enterococcus spp.",
                    "value": "≤ 1.0 × 10² CFU/g"
                  },
                  {
                    "label": "Salmonella spp.",
                    "value": "ไม่พบใน 25 g"
                  },
                  {
                    "label": "Listeria monocytogenes",
                    "value": "ไม่พบใน 25 g"
                  },
                  {
                    "label": "Campylobacter jejuni และ C. coli",
                    "value": "ไม่พบใน 25 g"
                  },
                  {
                    "label": "Yeasts และ molds",
                    "value": "≤ 1.0 × 10² CFU/g"
                  }
                ]
              }
            ]
          },
          {
            "sub": "เทียบเนื้อดิบกับเนื้อปรุงสุก (DLD)",
            "body": [
              {
                "bullets": [
                  "Aerobic plate count: ดิบ ≤ 5.0 × 10⁵, สุก ≤ 1.0 × 10⁵ CFU/g",
                  "Coliform: ดิบ ≤ 5,000, สุก ≤ 100 organisms/g",
                  "E. coli: ดิบ ≤ 100 organisms/g, สุก ไม่พบ",
                  "S. aureus: ดิบ ≤ 100 CFU/g, สุก ไม่พบ",
                  "Enterococcus spp.: ดิบ ≤ 1,000, สุก ≤ 100 CFU/g",
                  "Salmonella spp.: ทั้งดิบและสุก ไม่พบใน 25 g",
                  "Yeasts และ molds: ดิบ ไม่มีเกณฑ์, สุก ≤ 100 CFU/g",
                  "C. perfringens, Campylobacter jejuni/coli และ Listeria monocytogenes: ดิบ ไม่มีเกณฑ์, สุก ไม่พบ"
                ]
              }
            ]
          }
        ]
      }
    ]
  },

  // ─────────────────────────────────────────────────────────────
  'meat-storage': {
    "topic": "meat-storage",
    "title": "Storage of meat and meat products",
    "lecturer": "รุ่งทิพย์ ชวนชื่น (RC)",
    "icon": "🧊",
    "summary": "การเก็บรักษาเนื้อสัตว์และผลิตภัณฑ์: เกณฑ์ของวิธีเก็บรักษา ปัจจัยภายนอกและภายในที่มีผลต่อจุลินทรีย์ในเนื้อ (อุณหภูมิ R.H. ออกซิเจน pH water activity สารอาหาร) หลักการถนอมเนื้อ 6 วิธี (แช่เย็น แช่แข็ง ปรุงสุก ทำให้แห้ง ฉายรังสี สารเคมี) สีของเนื้อ cured การบรรจุหีบห่อ และระยะเวลาเก็บเนื้อสดกับเนื้อปรุงสุกและเนื้อ cured",
    "sections": [
      {
        "heading": "เกณฑ์ของวิธีเก็บรักษาเนื้อสัตว์",
        "source": "Meat storage slides p.2; บันทึกคาบ 21 ต.ค. 2569 [6:00-9:00]",
        "body": [
          "เนื้อสัตว์มีคุณค่าทางอาหารสูง จึงเน่าเสียง่าย เรียกว่า **perishable** วิธีเก็บรักษาที่ดีต้องผ่านเกณฑ์เหล่านี้",
          {
            "bullets": [
              {
                "label": "Meat quality",
                "value": "ไม่ทำให้คุณภาพเนื้อเสีย ทั้งคุณค่าทางโภชนาการและคุณภาพด้านการบริโภค"
              },
              {
                "label": "Safety",
                "value": "ไม่เป็นอันตรายต่อสุขภาพทั้งโดยตรงและโดยอ้อม เช่น มีสารปนเปื้อน หรือสารที่ทำปฏิกิริยากับเนื้อแล้วเกิดพิษ"
              },
              {
                "label": "Scientific approval",
                "value": "มีหลักฐานทางวิชาการรองรับ และมีหน่วยงานที่เกี่ยวข้องรับรองว่าใช้ได้อย่างปลอดภัย"
              },
              {
                "label": "Distribution & marketing",
                "value": "ไม่ทำให้ใช้พื้นที่มากขึ้น ไม่ทำให้คุณภาพเนื้อเปลี่ยนเร็ว และควรทำให้ผู้บริโภคสนใจผลิตภัณฑ์"
              },
              {
                "label": "Investment",
                "value": "ไม่ควรลงทุนสูง เพราะราคาเนื้อสัตว์จะเพิ่มขึ้น"
              },
              {
                "label": "Application",
                "value": "ทำได้ง่าย ไม่ต้องใช้เครื่องมือซับซ้อน"
              }
            ]
          },
          {
            "callout": "ไม่มีวิธีใดที่ครบทุกเกณฑ์อย่างสมบูรณ์ วิธีที่ดีมากมักมีราคาแพง",
            "kind": "tip"
          }
        ]
      },
      {
        "heading": "ปัจจัยภายนอก (extrinsic factor): อุณหภูมิและความชื้นสัมพัทธ์",
        "source": "Meat storage slides p.3-6; บันทึกคาบ 21 ต.ค. 2569 [9:00-13:00]",
        "body": [
          "ปัจจัยที่มีผลต่อจุลินทรีย์ในเนื้อแบ่งเป็น 2 กลุ่ม: **extrinsic factor** (ปัจจัยภายนอก) และ **intrinsic factor** (ปัจจัยภายในเนื้อ)",
          {
            "sub": "อุณหภูมิ",
            "body": [
              {
                "bullets": [
                  "จุลินทรีย์แต่ละชนิดโตที่อุณหภูมิต่างกัน มีช่วงที่โตได้ (growth range) และอุณหภูมิที่โตดีที่สุด (optimal temperature)",
                  {
                    "label": "Critical temperature",
                    "value": "5 °C คืออุณหภูมิที่ต้องเก็บเนื้อให้ต่ำกว่า ถ้าสูงกว่านี้จุลินทรีย์โตได้และเนื้อเน่าเสีย"
                  },
                  "Food danger zone: 4-140 °F ช่วงที่แบคทีเรียโตได้ดี",
                  "Refrigerator temperature อยู่ที่ 40 °F, Hold HOT foods ที่ 140 °F และ Freezer temperature ที่ 0 °F",
                  "อาหารที่ผ่านความร้อนสูงจะทำลายแบคทีเรีย แต่ยังต้องเก็บที่อุณหภูมิต่ำกว่า critical temperature เพื่อรักษาคุณภาพต่อไป"
                ]
              },
              {
                "callout": "สไลด์พิมพ์ danger zone ว่า 4-140 °F แต่ที่เทอร์โมมิเตอร์บนสไลด์เดียวกัน จุด Refrigerator temperature อยู่ที่ 40 °F ตัวเลขช่วงล่างของสไลด์จึงไม่ตรงกับเทอร์โมมิเตอร์",
                "kind": "flag"
              }
            ]
          },
          {
            "sub": "ความชื้นสัมพัทธ์ (relative humidity, R.H.)",
            "body": [
              {
                "bullets": [
                  "R.H. สัมพันธ์กับอุณหภูมิ: อุณหภูมิสูงขึ้น R.H. ลดลง",
                  "ถ้าอุณหภูมิสูง ต้องลด R.H. ลง เพื่อให้เนื้ออยู่ในสภาพที่ไม่เหมาะกับการโตของจุลินทรีย์",
                  "ที่ -1 ถึง 3 °C ใช้ R.H. 88-92%"
                ]
              }
            ]
          }
        ]
      },
      {
        "heading": "ปัจจัยภายนอก: ออกซิเจน คาร์บอนไดออกไซด์ จุลินทรีย์รบกวนกัน และสภาพของเนื้อ",
        "source": "Meat storage slides p.6-7; บันทึกคาบ 21 ต.ค. 2569 [12:30-19:00]",
        "body": [
          {
            "sub": "ออกซิเจนและคาร์บอนไดออกไซด์",
            "body": [
              {
                "bullets": [
                  "จุลินทรีย์ต้องการออกซิเจนต่างกัน แบ่งเป็น aerobic, anaerobic และ facultative microorganisms",
                  "Aerobic ใช้ออกซิเจน แต่ไม่ได้ใช้ 100%",
                  "Facultative โตได้ทั้งในที่มีและไม่มีออกซิเจน ตัวอย่างสำคัญคือ Salmonella",
                  "การลดปริมาณออกซิเจนจึงเป็นวิธีหนึ่งที่ทำให้จุลินทรีย์โตต่อไม่ได้"
                ]
              }
            ]
          },
          {
            "sub": "General microbial interference",
            "body": [
              {
                "bullets": [
                  "การโตของจุลินทรีย์ชนิดหนึ่งยับยั้งการโตของชนิดอื่น",
                  "ตัวอย่างคือกลุ่มที่ผลิตกรดแลคติก กรดไปยับยั้งแบคทีเรียชนิดอื่น เป็นหลักการของ fermentation"
                ]
              }
            ]
          },
          {
            "sub": "สภาพของเนื้อเอง",
            "body": [
              {
                "bullets": [
                  "ขนาด พื้นผิวของเนื้อ และการปนเปื้อน (contamination) มีผลต่อการโตของจุลินทรีย์",
                  "เนื้อบดมีพื้นที่ผิวมากกว่าเนื้อเป็นก้อน จึงสัมผัสน้ำและออกซิเจนมากกว่า ปนเปื้อนง่ายกว่า และเน่าเสียง่ายกว่า",
                  "เนื้อที่เป็นกรดลดหรือทำลาย spore ของ Clostridium botulinum ได้"
                ]
              }
            ]
          }
        ]
      },
      {
        "heading": "ปัจจัยภายใน: pH",
        "source": "Meat storage slides p.8; บันทึกคาบ 21 ต.ค. 2569 [18:00-20:00]",
        "body": [
          {
            "bullets": [
              "pH ของเนื้อ: 5.4-5.6",
              "จุลินทรีย์ต้องการ pH ที่เหมาะกับการโต โดยทั่วไป pH ที่โตคือ 7 (6.6-7.5)",
              {
                "label": "Fungi",
                "value": "ช่วง pH ที่โตได้กว้างที่สุด 2.0-8.0"
              },
              {
                "label": "Yeast",
                "value": "pH 4.0-4.5"
              },
              "หลังสัตว์ตาย pH ของเนื้ออาจสูงขึ้นหรือต่ำลง จึงต้องปรับให้ไม่เหมาะกับการโตของจุลินทรีย์ และ pH ยังมีผลต่อ texture ของเนื้อ"
            ]
          },
          {
            "sub": "เนื้อ 3 แบบ: PSE, Normal, DFD",
            "body": [
              {
                "table": {
                  "headers": [
                    "ชนิดเนื้อ",
                    "pH"
                  ],
                  "rows": [
                    [
                      "PSE",
                      "5.2"
                    ],
                    [
                      "Normal",
                      "5.7"
                    ],
                    [
                      "DFD",
                      "6.2"
                    ]
                  ]
                }
              },
              {
                "bullets": [
                  "PSE มี pH ต่ำที่สุด ส่วน DFD เป็นเนื้อค่อนข้างแข็งและมี pH สูง"
                ]
              }
            ]
          },
          {
            "callout": "สไลด์เขียน pH ของเนื้อ 5.4-5.6 แต่ภาพเนื้อ Normal ในสไลด์เดียวกันระบุ pH 5.7",
            "kind": "flag"
          }
        ]
      },
      {
        "heading": "ปัจจัยภายใน: water activity (aw)",
        "source": "Meat storage slides p.9-11; บันทึกคาบ 21 ต.ค. 2569 [20:00-24:00]",
        "body": [
          {
            "bullets": [
              "aw (water activity) คือค่าที่วัดความชื้นอิสระในผลิตภัณฑ์ มีค่า 0-1",
              {
                "label": "สูตร",
                "value": "aw = P/Po โดย P คือ partial vapor pressure ของน้ำในสาร และ Po คือ standard state partial vapor pressure ของน้ำ"
              },
              {
                "label": "ERH",
                "value": "Equilibrium Relative Humidity (ความชื้นสัมพัทธ์) aw = ERH/100"
              }
            ]
          },
          {
            "sub": "aw ของอาหาร",
            "body": [
              {
                "table": {
                  "headers": [
                    "อาหาร",
                    "aw"
                  ],
                  "rows": [
                    [
                      "Raw meat & milk",
                      "0.99-1.0"
                    ],
                    [
                      "Luncheon meat",
                      "0.95"
                    ],
                    [
                      "Boiled ham, sliced bacon",
                      "0.90"
                    ],
                    [
                      "Dried grains",
                      "0.80"
                    ]
                  ]
                }
              }
            ]
          },
          {
            "sub": "aw กับการโตของจุลินทรีย์",
            "body": [
              {
                "bullets": [
                  "แบคทีเรียต้องการ aw สูงที่สุด รองลงมาคือ fungi และ yeast",
                  "Yeast และ mold โตได้ที่ aw ต่ำกว่า 0.8",
                  "aw ต่ำสุดที่จุลินทรีย์โตได้ขึ้นกับ pH และอุณหภูมิ",
                  "แบคทีเรียส่วนใหญ่ต้องการ aw ใกล้ 1 เนื้อแห้งจึงมีปัญหาจาก yeast และ mold มากกว่าแบคทีเรีย",
                  "ถ้าจะถนอมเนื้อ ให้ลด aw คือทำให้แห้ง"
                ]
              },
              {
                "bullets": [
                  "aw จากสูงลงต่ำ: most bacteria และ halotolerant bacteria, most yeasts, halophilic bacteria, most moulds, osmophilic yeasts และ xerophilic moulds",
                  "Fresh fruits, meats, fish and vegetables อยู่ใกล้ 1.00",
                  "ที่ 0.50 Noodles, pasta, chewing gum; ที่ 0.40 Dried egg powder; ที่ 0.30 Biscuits; ช่วง 0.20-0.10 Dried milk, dried vegetables, cereals, crackers"
                ]
              }
            ]
          }
        ]
      },
      {
        "heading": "ปัจจัยภายใน: สารอาหารและสารต้านจุลินทรีย์ในเนื้อ",
        "source": "Meat storage slides p.12-13; บันทึกคาบ 21 ต.ค. 2569 [22:00-28:30]",
        "body": [
          {
            "sub": "สารอาหาร (nutrient supply)",
            "body": [
              {
                "bullets": [
                  "ความต้องการสารอาหารจากน้อยไปมาก: Fungi, Yeast, Gram-negative bacteria, Gram-positive bacteria",
                  "ในอาหารที่เน่าเสีย แบคทีเรียมาก่อน ราตามมาทีหลัง",
                  "ไนโตรเจนมาจากกรดอะมิโน เนื้อสัตว์มีคาร์โบไฮเดรตต่ำ และในซากสัตว์ตับมีคาร์โบไฮเดรตสูงสุด",
                  "สารอาหารในเนื้อ: B1, B6, B12, Riboflavin, Niacin, Selenium, Iron, Zinc, Phosphorus, Choline, Leucine, Protein"
                ]
              }
            ]
          },
          {
            "sub": "สารต้านจุลินทรีย์ (antimicrobial agents)",
            "body": [
              {
                "bullets": [
                  {
                    "label": "Natural compounds",
                    "value": "เช่น bacteriocin ซึ่งแบคทีเรียผลิตเพื่อยับยั้งแบคทีเรียชนิดอื่น เป็น microbial interference แบบหนึ่ง และสกัดมาใช้เป็น preservative ได้"
                  },
                  {
                    "label": "Chemicals",
                    "value": "เช่น nitrate, nitrite"
                  }
                ]
              }
            ]
          }
        ]
      },
      {
        "heading": "หลักการถนอมเนื้อสัตว์ 6 วิธี และการแช่เย็น",
        "source": "Meat storage slides p.14-16; บันทึกคาบ 21 ต.ค. 2569 [27:00-35:30]",
        "body": [
          {
            "sub": "หลักการถนอมเนื้อ (principle of meat preservation)",
            "body": [
              {
                "bullets": [
                  "Refrigeration (แช่เย็น)",
                  "Freezing (แช่แข็ง)",
                  "Cooking (ปรุงสุก)",
                  "Dehydration (ทำให้แห้ง)",
                  "Irradiation (ฉายรังสี)",
                  "Chemicals (สารเคมี)"
                ]
              }
            ]
          },
          {
            "sub": "Refrigeration",
            "body": [
              {
                "bullets": [
                  "ลดอุณหภูมิให้ต่ำกว่า 5 °C ภายใน 8 ชั่วโมงหลังฆ่า",
                  "จากนั้นเก็บที่ 0-3 °C",
                  {
                    "label": "ปัจจัยที่มีผลต่ออัตราการลดอุณหภูมิ",
                    "value": "carcass temperature, fat covering carcasses, carcass size, number of carcasses, humidity in cooling tank"
                  },
                  {
                    "label": "ปัจจัยที่มีผลต่ออายุการเก็บ (storage time)",
                    "value": "number of bacteria, properties of meat, storage temperature, materials for packaging"
                  }
                ]
              },
              {
                "bullets": [
                  "ซากที่เพิ่งตายมีอุณหภูมิเท่าอุณหภูมิร่างกาย ซากยิ่งอุ่นยิ่งลดอุณหภูมิยาก",
                  "ไขมันนำความร้อนไม่ดี ซากที่มีไขมันมากจึงลดอุณหภูมิได้ช้า",
                  "ซากขนาดใหญ่และซากจำนวนมากใช้เวลาลดอุณหภูมินานขึ้น",
                  "ถ้า humidity ในห้องหรือถังแช่เย็นไม่เหมาะ หรือแห้งเกินไป การถ่ายเทความร้อนยากขึ้น",
                  "จำนวนเชื้อตั้งต้นสูง อายุการเก็บสั้นลง",
                  "แบคทีเรียบางกลุ่มโตได้ที่อุณหภูมิต่ำ คือกลุ่ม psychrotroph เช่น Pseudomonas",
                  "เนื้อจากลำไส้และบริเวณท้องเน่าเสียง่าย",
                  "อุณหภูมิเก็บสูง อายุการเก็บสั้น"
                ]
              }
            ]
          }
        ]
      },
      {
        "heading": "การแช่แข็ง (freezing)",
        "source": "Meat storage slides p.17; บันทึกคาบ 21 ต.ค. 2569 [34:00-37:00]",
        "body": [
          {
            "bullets": [
              "Optimum temperature: ต่ำกว่า 0 °F",
              "หยุดการทำงานของเอนไซม์ได้สมบูรณ์ และยับยั้งจุลินทรีย์ที่ทำให้เสีย",
              "แบคทีเรียไม่ตายแต่ไม่โต จึงรักษาทั้งสภาพทางจุลชีววิทยาและทางเคมีของเนื้อ เป็นวิธีเก็บรักษาเนื้อที่ดีที่สุด (the best)",
              {
                "label": "การละลาย (thaw)",
                "value": "ใช้อุณหภูมิตู้เย็น (ไม่เกิน 7 °C) หรือไมโครเวฟ เพราะถ้าอุณหภูมิสูง แบคทีเรียโดยเฉพาะ psychrotroph โตได้"
              }
            ]
          }
        ]
      },
      {
        "heading": "การปรุงสุก (cooking): pasteurization และ sterilization",
        "source": "Meat storage slides p.18-22; บันทึกคาบ 21 ต.ค. 2569 [36:30-42:30]",
        "body": [
          "Cooking คือการใช้ความร้อนสูงฆ่าจุลินทรีย์ มี 2 แบบ",
          {
            "sub": "Pasteurization",
            "body": [
              {
                "bullets": [
                  "ปรุงที่ 65-77 °C (150-170 °F)",
                  {
                    "label": "Core temperature",
                    "value": "58-75 °C คืออุณหภูมิที่จุดกึ่งกลางของชิ้นเนื้อ วัดโดยเสียบเทอร์โมมิเตอร์ที่จุดหนาที่สุดให้ถึงกึ่งกลาง"
                  },
                  "ฆ่าจุลินทรีย์ได้เกือบทั้งหมดแต่ไม่ทั้งหมด (vegetative bacteria ตายเกือบหมด แต่บางตัวทนเหลืออยู่)",
                  "ผลิตภัณฑ์ต้องเก็บแช่เย็น (REFRIGERATED) ที่ต่ำกว่า 5 °C",
                  "ตัวอย่างผลิตภัณฑ์: pasteurized poultry, pasteurized pork"
                ]
              }
            ]
          },
          {
            "sub": "Sterilized cooking",
            "body": [
              {
                "bullets": [
                  "ปรุงที่สูงกว่า 100 °C (250 °F) ภายใต้ความดัน ถ้าไม่ใช้ความดัน อุณหภูมิจะไม่สูงพอ",
                  "จุลินทรีย์ถูกฆ่าทั้งหมด รวมทั้ง spore",
                  "ผลิตภัณฑ์เก็บได้นานที่อุณหภูมิห้อง (shelf stable)",
                  "ข้อเสีย: texture ของเนื้อไม่ดี มีกลิ่น และสารอาหารบางอย่างสูญเสีย",
                  "ตัวอย่างผลิตภัณฑ์: sterilized beef, sterilized pork"
                ]
              }
            ]
          }
        ]
      },
      {
        "heading": "การทำให้แห้ง (dehydration) และการฉายรังสี (irradiation)",
        "source": "Meat storage slides p.23-25; บันทึกคาบ 21 ต.ค. 2569 [41:30-47:30]",
        "body": [
          {
            "sub": "Dehydration",
            "body": [
              {
                "bullets": [
                  "ลด water activity: NO WATER NO GROWTH",
                  "ทำได้ด้วย air drying, heating หรือ freezing",
                  "ทำให้ aw ต่ำกว่า 0.8 จนแบคทีเรียโตไม่ได้ เก็บได้นานโดยไม่ต้องแช่เย็น แต่ยีสต์และราอาจโตได้ในที่สุด",
                  "ข้อเสีย: สารอาหารเสื่อม (โดยเฉพาะโปรตีน), ไขมันเกิด oxidation จึงเกิดกลิ่นหืน, ต้องใช้บรรจุภัณฑ์ที่ปิดสนิท (tight packaging)",
                  "ตัวอย่างผลิตภัณฑ์: เนื้อแห้งแบบ jerky"
                ]
              }
            ]
          },
          {
            "sub": "Irradiation",
            "body": [
              {
                "bullets": [
                  "เนื้อได้รับพลังงานรังสี (radiant energy) เรียกอีกอย่างว่า “Cold pasteurization”",
                  "ทำลายจุลินทรีย์ส่วนใหญ่แต่ไม่ทั้งหมด ลดการเสีย (reduces spoilage)",
                  "รังสีทะลุเนื้อ ทำลายได้ทั้งที่ผิวและภายใน และอุณหภูมิไม่สูงขึ้น",
                  "เนื้อที่ฉายรังสียังมีคุณค่าทางอาหาร",
                  "อาจเกิด “irradiation odor” กลิ่นคล้ายโลหะ และกลิ่นนี้หายไปเมื่อปรุงสุก",
                  "เนื้อที่ฉายรังสีไม่ได้สุก ต้องปรุงสุก (COOKED) ก่อนกิน",
                  "ควรบรรจุสูญญากาศ",
                  "ผลิตภัณฑ์ต้องมีสัญลักษณ์ “Radura” บนฉลาก"
                ]
              }
            ]
          }
        ]
      },
      {
        "heading": "สารเคมีถนอมเนื้อ: เกลือ ไนไตรท์ แลคเตท",
        "source": "Meat storage slides p.26-28; บันทึกคาบ 21 ต.ค. 2569 [46:30-52:00]",
        "body": [
          "สารเคมียับยั้งการโตของจุลินทรีย์ และมักช่วยปรุงรสและกลิ่นด้วย",
          {
            "bullets": [
              {
                "label": "Salt",
                "value": "ลด aw, ยับยั้งการโตของจุลินทรีย์, เป็น antioxidant"
              },
              "Sodium nitrite: ยับยั้งการโตของจุลินทรีย์; ใช้ 120 bp เพื่อยับยั้ง Clostridium ในเนื้อกระป๋อง",
              {
                "label": "Sodium lactate",
                "value": "สร้างกรดแลคติก ลด pH จึงยับยั้งการโตของจุลินทรีย์"
              }
            ]
          },
          {
            "sub": "ประโยชน์อื่น",
            "body": [
              {
                "bullets": [
                  "เพิ่มรสชาติ",
                  "ยืดอายุการเก็บ (improve product shelf life)",
                  "ทำให้เนื้อมีสี cured-meat",
                  "สารเคมีที่เติมลงในเนื้อต้องได้รับการอนุมัติจาก FDA (ในไทยคือ Thai FDA)"
                ]
              }
            ]
          },
          {
            "sub": "บทบาทของ nitrite และ nitrate ในเนื้อ",
            "body": [
              {
                "bullets": [
                  {
                    "label": "Positive effects",
                    "value": "improve color and taste, preservation, antimicrobial activity, cooking agent"
                  },
                  {
                    "label": "Negative effects",
                    "value": "formation of carcinogenic nitrosamines"
                  }
                ]
              },
              "Nitrosamine เกิดเมื่อเนื้อที่ใส่ nitrate/nitrite ถูกความร้อน และเป็นสารก่อมะเร็ง ส่วนที่ไหม้ดำจึงควรตัดออก"
            ]
          },
          {
            "callout": "สไลด์พิมพ์ปริมาณ sodium nitrite ว่า 120 bp โดยไม่อธิบายหน่วย ในสไลด์ไม่มีหน่วยอื่นที่ยืนยันได้",
            "kind": "flag"
          }
        ]
      },
      {
        "heading": "สีของเนื้อ cured และเนื้อแปรรูป",
        "source": "Meat storage slides p.29-32; บันทึกคาบ 21 ต.ค. 2569 [50:00-53:00]",
        "body": [
          {
            "sub": "Color of cured meat (nitrite)",
            "body": [
              {
                "bullets": [
                  "ไนไตรท์จับกับ myoglobin ได้ **nitric oxide myoglobin** (สีแดง)",
                  "เมื่อได้รับความร้อน (Heat) globin เสียสภาพ (denatured) และเปลี่ยนเป็น **nitrosohemochrome** (สีชมพู)",
                  "สีชมพูนี้คือสีของแฮม ไส้กรอก ฮอตดอก",
                  "เปรียบเทียบเนื้อ uncured กับ cured และตัวอย่างไนไตรท์ 0 ppm กับ 4 ppm"
                ]
              }
            ]
          },
          {
            "sub": "Color of processed meat",
            "body": [
              {
                "table": {
                  "headers": [
                    "รูปแบบ",
                    "สี"
                  ],
                  "rows": [
                    [
                      "myoglobin (Fe2+ จับ H2O)",
                      "purplish red"
                    ],
                    [
                      "Oxymyoglobin (Fe2+ จับ O2)",
                      "bright red"
                    ],
                    [
                      "Denatured globin hemichrome (Fe3+ จับ H2O)",
                      "grayish red"
                    ]
                  ]
                }
              },
              {
                "bullets": [
                  "การเปลี่ยนแต่ละขั้นเกิดจากความร้อน (Heat)",
                  "ปรุงนานขึ้นเนื้อจะเป็นสีเทา (hemichrome)"
                ]
              }
            ]
          }
        ]
      },
      {
        "heading": "การบรรจุหีบห่อ (packaging): เหตุผลและคุณสมบัติของวัสดุ",
        "source": "Meat storage slides p.33-35; บันทึกคาบ 21 ต.ค. 2569 [52:00-57:00]",
        "body": [
          {
            "sub": "ทำไมต้องบรรจุ (Packaging of meat)",
            "body": [
              {
                "bullets": [
                  "ป้องกันการปนเปื้อน",
                  "ป้องกันการเปลี่ยนแปลงทางกายภาพและเคมี",
                  "ผู้บริโภคสนใจ (consumer appreciation)",
                  "ถือเป็นวิธีถนอมเนื้ออย่างหนึ่ง"
                ]
              }
            ]
          },
          {
            "sub": "คุณสมบัติของวัสดุที่ดี",
            "body": [
              {
                "bullets": [
                  "ป้องกันการปนเปื้อนจากภายนอก",
                  "รักษากลิ่นและรสของผลิตภัณฑ์",
                  "แข็งแรงทนทาน",
                  "กันไขมันซึม (grease proof)",
                  "ป้องกันน้ำและความชื้นสูญเสีย",
                  "ไม่เป็นพิษ",
                  "ไม่มีกลิ่น",
                  "Permeable to oxygen (ออกซิเจนผ่านเข้าออกได้ง่าย)",
                  "ปิดผนึกและติดฉลากง่าย"
                ]
              }
            ]
          },
          {
            "callout": "บรรจุภัณฑ์เป็น **indirect additive** เพราะสัมผัสอาหารโดยตรง สารเคมีในบรรจุภัณฑ์จึงอาจ migrate เข้าสู่อาหารได้",
            "kind": "warn"
          }
        ]
      },
      {
        "heading": "สูญญากาศ MAP CAP และวัสดุบรรจุ",
        "source": "Meat storage slides p.36-41; บันทึกคาบ 21 ต.ค. 2569 [56:00-63:00]",
        "body": [
          {
            "sub": "Vacuum packaging, MAP และ CAP",
            "body": [
              {
                "bullets": [
                  "ออกซิเจนในอากาศเร่งทั้งการสลายทางเคมีและการเสียจากจุลินทรีย์ในอาหารหลายชนิด",
                  "Vacuum packaging ดูดอากาศออกจากถุงให้เกิดสุญญากาศ เก็บอาหารได้นานขึ้น แต่ในถุงยังมีออกซิเจนเข้าได้เล็กน้อย ไม่ใช่ไม่มีเลย",
                  "**MAP** (modified atmosphere packaging) และ **CAP** (controlled atmosphere packaging) แทนที่ออกซิเจนบางส่วนหรือทั้งหมดในบรรจุภัณฑ์ด้วยก๊าซอื่น เช่น คาร์บอนไดออกไซด์หรือไนโตรเจน",
                  "ปิดถุงด้วยคลิปโลหะ หรือ heat-impulse sealing ที่ด้านข้างถุง",
                  "ฟิล์มที่ใช้บ่อยที่สุดสำหรับเนื้อสดบรรจุสูญญากาศคือ **PVDC** (polyvinylidene chloride) ขึ้นรูปและติดฉลากง่าย"
                ]
              }
            ]
          },
          {
            "sub": "วัสดุบรรจุ",
            "body": [
              {
                "bullets": [
                  {
                    "label": "Aluminum foil",
                    "value": "อะลูมิเนียม 98.5% ผสมเหล็กและซิลิคอนเพื่อให้แข็งแรงและทนการเจาะ; นำความร้อน (เข้าเตาอบได้ แต่ห้ามเข้าไมโครเวฟ); ฉีกง่าย"
                  },
                  {
                    "label": "Waxed paper หรือ parafilm wax",
                    "value": "กระดาษทิชชูเคลือบแว็กซ์ 3 ชั้น (triple-waxed) ด้วย food-safe paraffin wax; กันไขมันซึม; ทนน้ำ; ออกซิเจนผ่านได้; ราคาไม่แพง"
                  },
                  {
                    "label": "Copolymer film (non-forming film)",
                    "value": "ปิดผนึกและติดฉลากง่าย; ทนความร้อน (เข้าไมโครเวฟได้); แข็งแรงทนทาน; oxygen proof; ราคาแพง"
                  },
                  {
                    "label": "Forming film",
                    "value": "ทนความร้อน; หดเข้ารูปกับผลิตภัณฑ์ จึงลดปริมาณหีบห่อ; ใช้กับอาหาร ready to eat เช่น ไส้กรอก"
                  },
                  {
                    "label": "Laminate foil",
                    "value": "ผสมกระดาษ ฟิล์ม และฟอยล์; แข็งแรงทนทาน; กันไขมันซึม; ป้องกันน้ำและความชื้นสูญเสีย; ราคาสูง"
                  }
                ]
              },
              {
                "callout": "สไลด์ระบุคุณสมบัติที่ดีของวัสดุว่า permeable to oxygen แต่ระบุ copolymer film เป็น oxygen proof และใช้ PVDC กับสูญญากาศ สไลด์ไม่ได้อธิบายความต่างนี้",
                "kind": "flag"
              }
            ]
          }
        ]
      },
      {
        "heading": "ระยะเวลาเก็บ: เนื้อสดและเนื้อปรุงสุก",
        "source": "Meat storage slides p.42-45; บันทึกคาบ 21 ต.ค. 2569 [62:00-65:00]",
        "body": [
          {
            "sub": "เนื้อสด (fresh meat)",
            "body": [
              {
                "bullets": [
                  "เก็บที่ 3-4 °C",
                  "ถ้าใช้ภายใน 2 วัน ให้เก็บในห่อเดิม",
                  "ถ้านานกว่านั้น ห่อด้วย freezer wrap หรือฟอยล์แล้วแช่แข็ง",
                  "เนื้อบดเก็บได้สั้นกว่า เพราะมีพื้นผิวมาก ปนเปื้อนง่าย และมีออกซิเจนมาก แบคทีเรียโตง่าย"
                ]
              },
              {
                "table": {
                  "headers": [
                    "เนื้อสด",
                    "แช่เย็น",
                    "แช่แข็ง"
                  ],
                  "rows": [
                    [
                      "Beef",
                      "2-4 วัน",
                      "6-12 เดือน"
                    ],
                    [
                      "Veal",
                      "2-4 วัน",
                      "6-9 เดือน"
                    ],
                    [
                      "Pork",
                      "2-4 วัน",
                      "3-6 เดือน"
                    ],
                    [
                      "Lamb",
                      "2-4 วัน",
                      "6-9 เดือน"
                    ],
                    [
                      "Ground beef, veal, lamb",
                      "1-2 วัน",
                      "3-4 เดือน"
                    ],
                    [
                      "Ground pork",
                      "1-2 วัน",
                      "1-3 เดือน"
                    ],
                    [
                      "Variety meats",
                      "1-2 วัน",
                      "3-4 เดือน"
                    ]
                  ]
                }
              }
            ]
          },
          {
            "sub": "เนื้อปรุงสุก (cooked meat)",
            "body": [
              {
                "bullets": [
                  "ห้ามวางที่ 5-60 °C นานเกิน 1 ชั่วโมง เพราะแบคทีเรียโตได้",
                  "ห่อด้วย freezer wrap หรือพลาสติกแล้วแช่แข็ง",
                  "ใช้ภายใน 1 สัปดาห์"
                ]
              },
              {
                "table": {
                  "headers": [
                    "ผลิตภัณฑ์ปรุงสุก",
                    "แช่แข็ง"
                  ],
                  "rows": [
                    [
                      "Meat pies",
                      "3 เดือน"
                    ],
                    [
                      "Swiss steak",
                      "3 เดือน"
                    ],
                    [
                      "Stews",
                      "3-4 เดือน"
                    ],
                    [
                      "Prepared meat dinners",
                      "2-6 เดือน"
                    ]
                  ]
                }
              }
            ]
          }
        ]
      },
      {
        "heading": "ระยะเวลาเก็บ: เนื้อ cured เนื้อกระป๋อง และเนื้อแช่แข็ง",
        "source": "Meat storage slides p.46-48; บันทึกคาบ 21 ต.ค. 2569 [63:30-67:30]",
        "body": [
          {
            "sub": "เนื้อ cured",
            "body": [
              {
                "bullets": [
                  "เก็บในภาชนะเดิม ถ้าเปิดแล้วเก็บในภาชนะปิดสนิท",
                  "เก็บที่ต่ำกว่า 5 °C ไม่เกิน 1 สัปดาห์",
                  "เนื้อ cured คือเนื้อที่ใส่ nitrate หรือ nitrite เพื่อให้ได้สีสวย เช่น ฮอตดอก ไส้กรอก แฮม ซาลามี"
                ]
              },
              {
                "table": {
                  "headers": [
                    "เนื้อ cured",
                    "แช่เย็น",
                    "แช่แข็ง"
                  ],
                  "rows": [
                    [
                      "Sausage, fresh pork",
                      "1 สัปดาห์",
                      "60 วัน"
                    ],
                    [
                      "Frankfurters",
                      "4-5 วัน",
                      "1 เดือน"
                    ],
                    [
                      "Bacon",
                      "5-7 วัน",
                      "1 เดือน"
                    ],
                    [
                      "Smoked ham, whole",
                      "1 สัปดาห์",
                      "60 วัน"
                    ],
                    [
                      "Ham slices",
                      "3-4 วัน",
                      "60 วัน"
                    ],
                    [
                      "Beef, corned",
                      "1 สัปดาห์",
                      "2 สัปดาห์"
                    ],
                    [
                      "Leftover cooked meat",
                      "1 สัปดาห์",
                      "2-3 เดือน"
                    ],
                    [
                      "Sausage, smoked",
                      "3-7 วัน",
                      "-"
                    ],
                    [
                      "Sausage, dry & semi-dry",
                      "2-3 สัปดาห์",
                      "-"
                    ]
                  ]
                }
              }
            ]
          },
          {
            "sub": "เนื้อกระป๋อง (canned meat)",
            "body": [
              {
                "bullets": [
                  "ขึ้นกับชนิดของผลิตภัณฑ์",
                  "ดูที่ฉลาก"
                ]
              }
            ]
          },
          {
            "sub": "เนื้อแช่แข็ง (frozen meat)",
            "body": [
              {
                "bullets": [
                  "เก็บที่ต่ำกว่า 0 °C",
                  "ละลายที่ 4 °C หรือในไมโครเวฟ",
                  "ไม่ควรแช่แข็งซ้ำ (should not be re-frozen) เพราะคุณค่าทางอาหารและรสชาติเสีย และแบคทีเรียอาจปนเปื้อนกลับเข้าไป"
                ]
              }
            ]
          },
          {
            "callout": "ตัวเลขของเนื้อแช่แข็งบนสไลด์ไม่ตรงกันระหว่างหน้า: p.17 ให้อุณหภูมิแช่แข็งที่เหมาะสมต่ำกว่า 0 °F และละลายที่ไม่เกิน 7 °C ส่วน p.48 ให้เก็บต่ำกว่า 0 °C และละลายที่ 4 °C",
            "kind": "flag"
          }
        ]
      }
    ]
  },

  // ─────────────────────────────────────────────────────────────
  'meat-quality': {
    "topic": "meat-quality",
    "title": "Meat quality and wholesomeness",
    "lecturer": "รุ่งทิพย์ ชวนชื่น (RC)",
    "icon": "✅",
    "summary": "คุณภาพเนื้อสัตว์และอนามัยเนื้อสัตว์ (wholesomeness) ตามสไลด์ Meat quality and wholesomeness ที่สอน 21 ต.ค. 2569 ไล่จากนิยามเนื้อสด, คุณภาพแบบ functional กับ conformance, postmortem changes และปัจจัยที่มีผล, คุณภาพเฉพาะของเนื้อวัวและเนื้อหมู (PSE, RFN, DFD, halothane gene, RN- gene), ความหมายของ wholesomeness กับ hazards 3 กลุ่ม, FAT-TOM และอุณหภูมิปรุงสุกของ USDA, คุณค่าต่อสุขภาพ, การตรวจเนื้อในสหรัฐอเมริกา, triangle of needs จนถึงการควบคุม hazards ตลอด food chain และ safe handling",
    "sections": [
      {
        "heading": "เนื้อสดและคุณภาพเนื้อสัตว์",
        "source": "Meat quality and wholesomeness p.2-6; บันทึกคาบ 21 ต.ค. 2569 [74:37-82:10]",
        "body": [
          {
            "sub": "What is fresh meat?",
            "body": [
              {
                "bullets": [
                  "เนื้อที่ผ่าน **chemical and physical change** หลัง slaughter แต่ผ่านการแปรรูปเพียงเล็กน้อย (**minimally processed**)",
                  "การแปรรูปที่ยังนับเป็นเนื้อสด: fabrication into retail cuts, cubing, grinding, marination, freezing",
                  "ตัวอย่างเนื้อสด: roasts, chop, stew, ground beef",
                  "เนื้อที่ผ่านกระบวนการมากกว่านี้ไม่นับเป็นเนื้อสด"
                ]
              }
            ]
          },
          {
            "sub": "Properties of meat",
            "body": [
              {
                "bullets": [
                  "**Water-holding capacity** (WHC, ความสามารถในการอุ้มน้ำ)",
                  "**Color of meat**",
                  "**Odor and taste**",
                  "**Texture and tenderness**"
                ]
              }
            ]
          },
          {
            "sub": "Meat quality 2 แบบ",
            "body": [
              {
                "bullets": [
                  {
                    "label": "Functional quality",
                    "value": "desirable features คือลักษณะที่พึงประสงค์ของเนื้อ เช่น color, tenderness, taste"
                  },
                  {
                    "label": "Conformance quality",
                    "value": "producing of product that meet the requirement of consumers คือทำผลิตภัณฑ์ได้ตรงความต้องการ เช่น ตัดแต่งอกไก่ให้ได้รูปร่างและน้ำหนักตามที่ต้องการ"
                  }
                ]
              }
            ]
          },
          {
            "sub": "What do we use to determine meat quality?",
            "body": [
              {
                "bullets": [
                  {
                    "label": "Nutritional value",
                    "value": "คุณค่าทางโภชนาการ คือปริมาณสารอาหารที่มีประโยชน์ต่อร่างกาย"
                  },
                  {
                    "label": "Meat hygiene",
                    "value": "คุณค่าทางสุขศาสตร์ คือผ่านกระบวนการผลิตที่ถูกต้อง ปลอดภัยจากสารตกค้างและจุลชีพ"
                  },
                  {
                    "label": "Quality for processing",
                    "value": "คุณค่าด้านการนำไปแปรรูป"
                  },
                  {
                    "label": "Eating quality",
                    "value": "คุณค่าด้านการบริโภค"
                  }
                ]
              }
            ]
          },
          {
            "sub": "Factors affecting meat quality",
            "body": [
              {
                "bullets": [
                  "Yield & composition of meat",
                  "Appearance & technological characteristics",
                  "**Palatability** คือการยอมรับในการบริโภค",
                  "**Wholesomeness** คืออนามัยเนื้อสัตว์",
                  "**Ethical quality** คือสัตว์ต้องได้รับการเลี้ยงดูอย่างดีและการฆ่าต้องไม่ทรมาน เนื้อจากสัตว์ที่ถูกฆ่าอย่างทารุณถือว่าไม่มีคุณภาพ และอาจจำหน่ายไม่ได้ในประเทศที่เคร่งครัดเรื่องนี้"
                ]
              }
            ]
          }
        ]
      },
      {
        "heading": "Postmortem changes และปัจจัยที่มีผล",
        "source": "Meat quality and wholesomeness p.7-11; บันทึกคาบ 21 ต.ค. 2569 [82:10-88:45]",
        "body": [
          {
            "sub": "การเปลี่ยนแปลงหลังสัตว์ตาย",
            "body": [
              {
                "bullets": [
                  "**pH ลดลง (5.3-5.7)**: anaerobic condition; pyruvate, lactic acid; denaturation of protein; reach isoelectric point; loss of WHC. ออกซิเจนในกล้ามเนื้อลดลงจนเข้าสู่ anaerobic condition เกิด pyruvate และ lactic acid สะสม โปรตีนเสียสภาพ เนื้อจึงเสียความสามารถในการอุ้มน้ำและน้ำไหลออกมา",
                  "**Rigor mortis**: tight cross bridge of actin & myosin; low ATP. กล้ามเนื้อหดแล้วไม่คลาย เนื้อจึงแข็งเกร็ง pH ที่ลดลงทำให้เกิด rigor mortis เร็วขึ้น",
                  "**Generation and dissipation of heat**: loss of blood circulation; no ventilation of body. ซากระบายความร้อนเองได้ยาก การเก็บเนื้อจึงต้องใช้ความเย็นจากภายนอก",
                  "**Failure of the defense mechanisms**: ภูมิคุ้มกันหมดไป เพราะไม่มีระบบไหลเวียนและ metabolism อีกต่อไป",
                  "**Loss of muscle structure**: degradation of Z line; calpain, the multicatalytic enzymes, cathepsin. calpain และ cathepsin เป็นเอนไซม์ในเนื้อเอง ถ้าควบคุมให้พอดีเนื้อจะนุ่ม ถ้าปล่อยไว้โดยไม่ควบคุมเนื้อจะเหลวเละ",
                  "**Changes of physical properties**: color, firmness, WHC"
                ]
              }
            ]
          },
          {
            "sub": "Factors affecting postmortem changes",
            "body": [
              {
                "bullets": [
                  {
                    "label": "Ante-mortem effects (ก่อนสัตว์ถูกฆ่า)",
                    "value": "stress and muscle characteristics; genetics and major genes; age; sex; feed; position of muscle; pre-slaughtering handling; immobilization method"
                  },
                  {
                    "label": "Post-mortem effects (หลังสัตว์ตาย)",
                    "value": "temperature (อุณหภูมิที่เก็บรักษา); accelerating processing; carcass electrical stimulation"
                  },
                  "carcass electrical stimulation คือใช้กระแสไฟฟ้ากระตุ้นซากให้กล้ามเนื้อแข็ง ถ้ากระตุ้นแล้วไม่รีบนำเนื้อเข้าแช่เย็น เนื้อจะเหลวเละและเสียง่าย"
                ]
              }
            ]
          }
        ]
      },
      {
        "heading": "คุณภาพเฉพาะของเนื้อวัวและเนื้อหมู: PSE, DFD, halothane gene, RN- gene",
        "source": "Meat quality and wholesomeness p.12-18; บันทึกคาบ 21 ต.ค. 2569 [88:45-95:40]",
        "body": [
          {
            "sub": "Beef",
            "body": [
              {
                "bullets": [
                  "The traditional beef may be better เช่น **Hereford, Angus**",
                  "Beef from **Bos indicus** is better than beef from **Bos taurus**"
                ]
              }
            ]
          },
          {
            "sub": "Pork: PSE, RFN, DFD",
            "body": [
              {
                "bullets": [
                  "**PSE** (pale, soft, exudative): pale pinkish gray, very soft and exudative; undesirable appearance and excessive shrinkage; pH 5.2; น้ำที่ไหลออกจากเนื้อ: มากที่สุด",
                  "**RFN** (เรียก Normal: red, firm, non-exudative ในรูปน้ำที่ไหลออก): reddish pink, firm and non-exudative; ideal quality มี desirable color, firmness และ water-holding capacity; pH 5.7; น้ำที่ไหลออกจากเนื้อ: น้อยกว่า PSE",
                  "**DFD** (dark, firm, dry): dark purplish red, very firm and dry; firm and sticky surface, high water-holding capacity; pH 6.2; น้ำที่ไหลออกจากเนื้อ: น้อยที่สุด"
                ]
              },
              {
                "bullets": [
                  "เนื้อ PSE เสียน้ำมาก เมื่อนำไปปรุงสุกจึงหดเหลือปริมาณน้อย",
                  "PSE เกี่ยวกับความเครียดของสุกรก่อนฆ่าจากการจัดการที่ไม่เหมาะสม และเกี่ยวกับพันธุกรรมของสุกร"
                ]
              }
            ]
          },
          {
            "sub": "The halothane (Hal n) gene",
            "body": [
              {
                "bullets": [
                  "เป็นยีนด้อยในสุกรบางสายพันธุ์ เขียนเป็น **the double recessive gene (nn)**",
                  "ตรวจด้วย **the halothane test** คือให้สุกรดม halothane สุกรที่มียีนนี้ไวต่อ halothane (**halothane positive**)",
                  "**Defective calcium channel** เมื่อได้ halothane กล้ามเนื้อจะหดแข็งเกร็งและสุกรตายได้",
                  "**High metabolic rate**",
                  "เนื้อที่ได้จากสุกรกลุ่มนี้เป็นเนื้อ PSE"
                ]
              }
            ]
          },
          {
            "sub": "The RN- gene",
            "body": [
              {
                "bullets": [
                  "**Rendement Napole** genotype คือ RN- RN-",
                  "**Cooking yield reduced up to 8%** ความผิดปกตินี้ไม่เห็นในเนื้อสด จะเห็นเมื่อนำไปปรุงแล้วปริมาณเนื้อลดลง",
                  "Adenosine monophosphate (AMP) kinase",
                  "**High glycogen contents** ไกลโคเจนในกล้ามเนื้อสูง pH จึงลดลงได้มาก (**low pH**)"
                ]
              }
            ]
          }
        ]
      },
      {
        "heading": "Wholesomeness (อนามัยเนื้อสัตว์) และ hazards to consumers",
        "source": "Meat quality and wholesomeness p.19-22; บันทึกคาบ 21 ต.ค. 2569 [95:40-101:55]",
        "body": [
          {
            "sub": "What is wholesomeness?",
            "body": [
              "**Wholesomeness** คือ term used to describe the **suitability of meat for human consumption** หรือความเหมาะสมของเนื้อสัตว์ที่จะนำมาให้คนบริโภค พิจารณา 2 ด้าน",
              {
                "bullets": [
                  {
                    "label": "Safe to eat",
                    "value": "ไม่มี hazards to consumers 3 กลุ่ม คือ biological hazards, chemical hazards, physical hazards"
                  },
                  {
                    "label": "Positively beneficial to consumers' health",
                    "value": "นอกจากปลอดภัยแล้วต้องมีคุณค่าทางอาหาร"
                  }
                ]
              }
            ]
          },
          {
            "sub": "Hazards to consumers",
            "body": [
              {
                "table": {
                  "headers": [
                    "กลุ่ม",
                    "ตัวอย่าง"
                  ],
                  "rows": [
                    [
                      "**Physical hazards**",
                      "bidis & cigarettes, hair, stones, stems & seeds, bone, fragments, feathers, matchstick, jewellery, nails, nuts & bolts, strings, jute fibres, button"
                    ],
                    [
                      "**Chemical hazards**",
                      "pesticides residues, veterinary residues, non permissible food additives, excess of permissible food additives, adulterants, cleaning chemicals"
                    ],
                    [
                      "**Biological hazards** แบบมองไม่เห็น (microbiological)",
                      "bacteria, yeasts, protozoa, molds, viruses"
                    ],
                    [
                      "**Biological hazards** แบบมองเห็น",
                      "worms, fly, cockroaches, weevils, caterpillars"
                    ]
                  ]
                }
              },
              {
                "bullets": [
                  "chemical hazards ในเนื้อสัตว์เกิดได้ทั้งแบบไม่ตั้งใจ เช่น สารฆ่าเชื้อปนเปื้อน และแบบตั้งใจ เช่น การเติม additive",
                  "veterinary residues เกิดได้ทั้งสองแบบ เช่น รักษาสัตว์แล้วไม่เว้นระยะหยุดยาให้เหมาะสม หรือสัตว์ป่วยที่ขับยาออกได้น้อย"
                ]
              }
            ]
          }
        ]
      },
      {
        "heading": "Conditions that support bacterial growth: FAT-TOM และอุณหภูมิ",
        "source": "Meat quality and wholesomeness p.23-24; บันทึกคาบ 21 ต.ค. 2569 [101:55-103:25]",
        "body": [
          {
            "sub": "FAT-TOM",
            "body": [
              {
                "bullets": [
                  {
                    "label": "F",
                    "value": "Food"
                  },
                  {
                    "label": "A",
                    "value": "Acidity"
                  },
                  {
                    "label": "T",
                    "value": "Time"
                  },
                  {
                    "label": "T",
                    "value": "Temperature"
                  },
                  {
                    "label": "O",
                    "value": "Oxygen"
                  },
                  {
                    "label": "M",
                    "value": "Moisture"
                  }
                ]
              }
            ]
          },
          {
            "sub": "The Meat & Poultry Thermometer",
            "body": [
              {
                "bullets": [
                  "**Danger zone** อยู่ระหว่าง **40 °F / 4 °C** กับ **140 °F / 60 °C** แบคทีเรียเจริญได้ดี จึงต้องเก็บอาหารให้พ้นช่วงนี้",
                  "เหนือ danger zone เป็นช่วง Cook It",
                  "ที่ 40 °F / 4 °C เป็น Refrigerate It",
                  "ที่ 0 °F / -18 °C เป็น Freeze It",
                  "danger zone จึงประมาณ 4-60 °C หรือ 5-63 °C"
                ]
              }
            ]
          },
          {
            "sub": "USDA Recommended Safe Minimum Internal Temperatures",
            "body": [
              "You can't tell by looking. Use a food thermometer to be sure. โดย internal temperature คือ core temperature",
              {
                "table": {
                  "headers": [
                    "อาหาร",
                    "อุณหภูมิภายในต่ำสุด"
                  ],
                  "rows": [
                    [
                      "Beef, pork, veal & lamb: steaks, roasts & chops",
                      "**145 °F** with a 3-minute rest time"
                    ],
                    [
                      "Fish",
                      "**145 °F**"
                    ],
                    [
                      "Beef, pork, veal & lamb: ground",
                      "**160 °F**"
                    ],
                    [
                      "Egg dishes",
                      "**160 °F**"
                    ],
                    [
                      "Turkey, chicken & duck: whole, pieces & ground",
                      "**165 °F**"
                    ]
                  ]
                }
              }
            ]
          }
        ]
      },
      {
        "heading": "Wholesomeness ด้านประโยชน์ต่อสุขภาพ",
        "source": "Meat quality and wholesomeness p.25-27; บันทึกคาบ 21 ต.ค. 2569 [103:25-110:35]",
        "body": [
          {
            "sub": "Beneficial to health",
            "body": [
              {
                "bullets": [
                  "Nutritional value",
                  "**The P:S ratio** โดย P คือ polyunsaturated fat และ S คือ saturated fat",
                  "**The n-6:n-3 ratio** คืออัตราส่วน omega-6 ต่อ omega-3",
                  "Essential fatty acid"
                ]
              }
            ]
          },
          {
            "sub": "Health benefits of meat",
            "body": [
              {
                "bullets": [
                  "cures insomnia, improves concentration levels, reduces risk of heart disease, tackles rickets, prevents depression",
                  "triggers memory, enhances muscle growth, prevents ageing, prevents anemia, skin and hair care"
                ]
              }
            ]
          },
          {
            "sub": "What to think",
            "body": [
              "เรื่องที่ต้องคำนึงเมื่อพูดถึง wholesomeness",
              {
                "bullets": [
                  "Food borne disease",
                  "Transportation of meat",
                  "Storing meat",
                  "Packaging meat",
                  "Thawing meat",
                  "Cooking meat",
                  "Holding meat",
                  "Handling meat"
                ]
              }
            ]
          }
        ]
      },
      {
        "heading": "Wholesomeness in the US และ Triangle of needs",
        "source": "Meat quality and wholesomeness p.28-30; บันทึกคาบ 21 ต.ค. 2569 [110:35-114:50]",
        "body": [
          {
            "sub": "Wholesomeness in the US",
            "body": [
              {
                "bullets": [
                  "By law, all meat is required to be **inspected by either the federal or state government**",
                  "**Big pieces are stamped** ตราในรูปเขียนว่า Inspected for wholesomeness by U.S. Department of Agriculture",
                  "**Small packages of meat will be marked OK**",
                  "Meat inspection by **USDA** (กระทรวงเกษตรของสหรัฐอเมริกา) มีกฎหมาย 2 ฉบับ คือ The Wholesomeness Poultry Act และ The Wholesomeness Meat Act"
                ]
              }
            ]
          },
          {
            "sub": "Triangle of needs",
            "body": [
              "Consumer perceptions of meat quality เขียนเป็น triangle of needs: ความต้องการพื้นฐานที่ฐานสามเหลี่ยมต้องได้รับการตอบสนองก่อน คุณภาพระดับที่สูงกว่าจึงจะมีความสำคัญ",
              {
                "table": {
                  "headers": [
                    "ชั้น (จากฐานขึ้นยอด)",
                    "ข้อความบนสามเหลี่ยม"
                  ],
                  "rows": [
                    [
                      "1 ฐาน",
                      "Adequate supply of meat"
                    ],
                    [
                      "2",
                      "Wholesome, fresh, free of disease"
                    ],
                    [
                      "3",
                      "Intrinsic qualities: flavor, color, texture, etc."
                    ],
                    [
                      "4 ยอด",
                      "Extrinsic qualities: welfare, sustainability, public health, etc."
                    ]
                  ]
                }
              }
            ]
          }
        ]
      },
      {
        "heading": "Prevention & control of hazards in food chain และ safe handling",
        "source": "Meat quality and wholesomeness p.31-35; บันทึกคาบ 21 ต.ค. 2569 [114:50-119:15]",
        "body": [
          {
            "sub": "Pre harvest vs Post harvest",
            "body": [
              "แผนภาพไล่จาก **Genotype** และ **Preharvest** ไปสู่ Quality at harvest, **Postharvest conditions**, Quality และ Deterioration ตามลำดับ",
              "การป้องกันและควบคุมต้องทำทั้ง pre harvest และ post harvest ตั้งแต่ฟาร์มจนถึงผู้บริโภค (from farm to fork) งานตั้งแต่ slaughter house เป็นต้นไปเป็นหน้าที่หลักของสัตวแพทย์สาธารณสุข"
            ]
          },
          {
            "sub": "สิ่งที่ต้องควบคุมในแต่ละขั้นของ food chain",
            "body": [
              {
                "table": {
                  "headers": [
                    "ขั้น",
                    "สิ่งที่ต้องควบคุม"
                  ],
                  "rows": [
                    [
                      "**On-farm**",
                      "food borne disease, chemical contaminants, drug residues"
                    ],
                    [
                      "**Slaughter houses**",
                      "pathogenic bacteria, spoilage bacteria, cross contamination, monitoring system, HACCP and GMP"
                    ],
                    [
                      "**Meat processing plants**",
                      "food borne disease, cross contamination, HACCP and GMP"
                    ],
                    [
                      "**Storage and transportation**",
                      "packaging, storage temperature"
                    ],
                    [
                      "**Retail merchandise & consumers**",
                      "food borne disease, high temperature, cooking procedure, cooking temperature, personnel hygiene"
                    ]
                  ]
                }
              }
            ]
          },
          {
            "sub": "Safe Handling Instruction",
            "body": [
              {
                "bullets": [
                  "Keep refrigerated or frozen",
                  "Thaw in refrigerator or microwave",
                  "Keep raw (meat & poultry) separate from other foods",
                  "Wash working surfaces (including cutting boards), utensils, and hands after touching raw (meat or poultry)",
                  "Cook thoroughly",
                  "**Refrigerated leftover within 2 hours** เพราะช่วงแรกแบคทีเรียยังอยู่ใน lag phase ต้องรีบเก็บอาหารเข้าตู้เย็นก่อนที่แบคทีเรียจะเข้า log phase"
                ]
              },
              "รูป Fight BAC! (Keep food safe from bacteria) สรุป 4 ข้อ: **Clean** wash hands and surfaces often, **Separate** don't cross-contaminate, **Cook** cook to proper temperatures, **Chill** refrigerate promptly"
            ]
          }
        ]
      }
    ]
  },

  // ─────────────────────────────────────────────────────────────
  'meat-molecular': {
    "topic": "meat-molecular",
    "title": "Application of molecular biology in meat science",
    "lecturer": "รุ่งทิพย์ ชวนชื่น (RC)",
    "icon": "🧬",
    "summary": "การใช้อณูชีววิทยาใน meat science ตามสไลด์ Application of molecular biology in meat science ที่สอน 21 ต.ค. 2569 มี 2 เรื่องใหญ่ เรื่องแรกคือการปรับปรุงคุณภาพเนื้อของสัตว์ในฟาร์มด้วย genomic technologies (QTL, candidate gene approach, genome scan approach, fine mapping และยีนสำคัญในโค ไก่ สุกร) เรื่องที่สองคือ halal authentication of raw meat ตั้งแต่ความหมายของ halal, halal meat supply chain กับ halal critical control points จนถึงเทคนิคตรวจหาเนื้อสุกร (PCR, ELISA, immunochromatographic assays, FTIR spectroscopy) และตารางสรุปเทคนิคท้ายสไลด์",
    "sections": [
      {
        "heading": "Molecular biology, genomic techniques และการปรับปรุงคุณภาพเนื้อ",
        "source": "Molecular biology in meat science p.2-7; บันทึกคาบ 21 ต.ค. 2569 [127:25-134:50]",
        "body": [
          {
            "sub": "What is molecular biology technique?",
            "body": [
              {
                "bullets": [
                  "molecular biology (อณูชีววิทยา) คือ the branch of biology that deals with the **molecular basis of biological activity**",
                  "overlaps with other areas of biology and chemistry โดยเฉพาะ **genetics and biochemistry**",
                  "ศึกษา interactions ระหว่างระบบต่างๆ ของเซลล์ รวมถึง **DNA, RNA and protein biosynthesis** และการควบคุม interactions เหล่านี้"
                ]
              }
            ]
          },
          {
            "sub": "What are genomic techniques",
            "body": [
              "เป็น combination of different branches ดังนี้",
              {
                "bullets": [
                  "Genetics",
                  "Molecular genetics",
                  "Quantitative genetics",
                  "Mendelian genetics",
                  "Bioinformatics"
                ]
              },
              "genomic คือการศึกษายีนทั้งหมดพร้อมกัน ต่างจากการศึกษาทีละยีน"
            ]
          },
          {
            "sub": "Application in meat science: 2 major considerations",
            "body": [
              {
                "bullets": [
                  "1. **Improvement of meat quality in farm animals** ต้องปรับปรุงที่ตัวสัตว์ในฟาร์ม เพราะปรับปรุงที่เนื้อโดยตรงไม่ได้",
                  "2. **Halal authentication of raw meat** คือการตรวจความถูกต้องของเนื้อสดว่าเป็นไปตามหลัก halal"
                ]
              }
            ]
          },
          {
            "sub": "Improvement of meat quality using genomic technologies",
            "body": [
              {
                "bullets": [
                  "Three important determinants of sensory enjoyments: flavour, tenderness, juiciness",
                  "Factors affecting meat quality: animal feeding; animal management; slaughtering; carcass handling; post slaughtering process",
                  "emphasis on factoring in the **molecular/biological components** of meat quality",
                  "**Meat quality trait is controlled by an unknown number of quantitative trait loci (QTL)** คือไม่ได้ถูกควบคุมด้วยยีนเดียว แต่เป็นกลุ่มของยีน"
                ]
              }
            ]
          }
        ]
      },
      {
        "heading": "Candidate gene approach, genome scan approach และ fine mapping",
        "source": "Molecular biology in meat science p.8-14; บันทึกคาบ 21 ต.ค. 2569 [134:50-145:20]",
        "body": [
          {
            "sub": "I. Candidate gene approach",
            "body": [
              {
                "bullets": [
                  "study the relationship between the **trait** and **unknown genes** that may be associated with the physiological pathway of the trait",
                  "test of association between mutations (variations) and variations in the phenotypic traits",
                  "example of success: a mutation in the **estrogen receptor locus (ESR)** that results in **increased litter size in pig**"
                ]
              },
              {
                "sub": "5 steps",
                "body": [
                  {
                    "bullets": [
                      "1. Collection of resource population",
                      "2. Phenotyping of the traits",
                      "3. Selection of genes that potentially could affect the traits",
                      "4. Genotyping of the resource population for genes",
                      "5. Statistical analysis of phenotypic and genotypic data to find the genes associated with the traits"
                    ]
                  }
                ]
              },
              {
                "sub": "2 major problems",
                "body": [
                  {
                    "bullets": [
                      "**A large number of candidate genes affecting the trait**: ลักษณะหนึ่งอาจถูกควบคุมด้วยยีนหลายชนิด จึงหายีนได้ไม่ครบ",
                      "**The causative mutations may lie in a gene that would not have been regarded as an obvious candidate** for the particular trait: การกลายพันธุ์อาจอยู่ในยีนอื่นที่มีผลต่อการแสดงออกของยีนที่กำลังศึกษา จึงหาไม่เจอ"
                    ]
                  }
                ]
              }
            ]
          },
          {
            "sub": "II. Genome scan approach",
            "body": [
              {
                "bullets": [
                  "study the relationship between a trait and **markers selected across the genome** คือศึกษาทั้ง genome พร้อมกัน ไม่ใช่ทีละยีน",
                  "to identify chromosomal locations associated with the trait",
                  "yield the map location of a trait locus with major effects",
                  "a large amount of QTL can be obtained",
                  "provide a useful bridge to link genome information with phenotypes"
                ]
              },
              {
                "sub": "6 steps",
                "body": [
                  {
                    "bullets": [
                      "1. Design and construction of resource population",
                      "2. Phenotyping traits of resource population",
                      "3. Selection of genetic markers",
                      "4. Genotyping of the population for selected markers",
                      "5. Construction of linkage maps",
                      "6. Statistical analysis of the phenotypic and genotypic data to find the genes associated with the traits"
                    ]
                  }
                ]
              },
              "ตัวอย่าง: microarray experiment comparing gene expression profiles in beef divergent for quality เริ่มจาก tender beef กับ tough beef ผ่าน mRNA extraction, cDNA synthesis & labelling, hybridise to microarrays, scanning of microarrays, data analysis จนได้ differentially expressed genes identified"
            ]
          },
          {
            "sub": "III. Fine mapping",
            "body": [
              {
                "bullets": [
                  "a trait-associated region from a **genome-wide association study (GWAS)** is analysed to identify the particular genetic variants that are likely to causally influence the examined trait",
                  "identification and location markers that are very tightly linked to a target gene",
                  "assist in selection precise คือช่วยให้การคัดเลือกแม่นยำ",
                  "usually essential step in map-based gene isolation",
                  "ทำหลังจาก candidate gene approach หรือ genome scan เป็นการศึกษาเจาะจงที่ target gene"
                ]
              }
            ]
          }
        ]
      },
      {
        "heading": "Important genes affecting meat quality in farm animals",
        "source": "Molecular biology in meat science p.15-17; บันทึกคาบ 21 ต.ค. 2569 [145:20-148:55]",
        "body": [
          {
            "bullets": [
              "**Cattle**, Diacylglycerol acyltransferase (**DGAT**): muscle fat content; DGAT activity increases longissimus dorsi muscle",
              "Cattle, **Calpastatin gene**: the Cast marker: calpastatin proteolytic system; closely related to the postmortem tenderization of meat",
              "Cattle, **Calpain gene**: associated with tenderness",
              "Cattle, **Myostatin gene**: increase meat weight",
              "**Chicken**, Extracellular fatty acid binding protein (**EX-FABP**) gene: link to a major gene affecting abdominal fat traits; increase fat weight and percentage",
              "Chicken, Liver fatty acid-binding protein (**L-FABP**) gene: increase fat weight and percentage",
              "**Pigs**, **Calpastatin gene**: the Cast marker: raw firmness score; tenderness, juiciness and chewiness on cooked meat",
              "Pigs, Heart fatty acid-binding protein (**H-FABP**) gene: intramuscular fat content",
              "Pigs, Adipocyte fatty acid-binding protein: **A-FABP** gene (FABP4): intramuscular fat content"
            ]
          },
          {
            "bullets": [
              "ในไก่ focus on **fat deposition** เช่น hypodermal fat, abdominal fat, intramuscular fat in breast and legs เป้าหมายคือ increase the intramuscular fat (IMF)",
              "calpastatin และ calpain เกี่ยวกับความนุ่มของเนื้อหลัง postmortem change จึงต้องให้แสดงออกในระดับพอดี เนื้อจะนุ่มโดยไม่เหลว",
              "EX-FABP และ L-FABP ทำให้น้ำหนักและเปอร์เซ็นต์ไขมันสูงขึ้น ถ้าต้องการไขมันลดลงจึงต้องทำให้ยีนทำงานน้อยลง"
            ]
          }
        ]
      },
      {
        "heading": "Halal authentication of raw meat และ halal meat supply chain",
        "source": "Molecular biology in meat science p.18-20; บันทึกคาบ 21 ต.ค. 2569 [148:55-156:40]",
        "body": [
          {
            "sub": "Halal authentication of raw meat",
            "body": [
              {
                "bullets": [
                  "**Halal**: healthy, clean, natural (organic), premium, humane to animals and environmentally friendly",
                  "pork detection in meat products เป็น important issue for Muslims",
                  "เป็น responsibility of **meat processing industry** and **certifying authorities** ผู้ผลิตต้องยืนยันได้ว่าไม่มีการปนเปื้อน และองค์กรศาสนาอิสลามเป็นผู้ออกใบรับรอง",
                  "halal food requires **halal certificates** from credible Islamic authorities",
                  "**Food adulteration is not uncommon** คือพบได้บ่อย",
                  "major authenticity concerns in meat and meat products: **pork substitution, undeclared blood plasma, pork intestine casings, non-halal methods to slaughter, utilization of prohibited ingredients**",
                  "**Porcine derivatives are cheap and readily available**"
                ]
              },
              {
                "bullets": [
                  "Analytical techniques ที่ต้องการ: reliable, quick, cost friendly; capable of detection for minuscule amount of pork in commuted products"
                ]
              }
            ]
          },
          {
            "sub": "Halal meat supply chain และ halal critical control points, HCCP",
            "body": [
              {
                "table": {
                  "headers": [
                    "ขั้นของ supply chain",
                    "HCCP"
                  ],
                  "rows": [
                    [
                      "Producer",
                      ""
                    ],
                    [
                      "Species, breeding",
                      "HCCP1: halal animal"
                    ],
                    [
                      "Livestock farming",
                      "HCCP2: animal welfare"
                    ],
                    [
                      "Slaughter process",
                      "HCCP3: stunning; HCCP4: knife; HCCP5: slaughter person; HCCP6: slaughter method; HCCP7: invocation"
                    ],
                    [
                      "Meat processing",
                      "HCCP8: control of raw materials; HCCP9: storage; HCCP10: packaging, labelling"
                    ],
                    [
                      "Retailing",
                      "HCCP11: halal meat outlet"
                    ],
                    [
                      "Consumer",
                      ""
                    ]
                  ]
                }
              },
              "ผู้เชือดในโรงฆ่าที่ใช้หลัก halal ต้องเป็นชาวมุสลิม ส่วนขั้น packaging ไม่จำเป็น"
            ]
          }
        ]
      },
      {
        "heading": "Pork detection techniques: PCR, ELISA, immunochromatographic assays, FTIR",
        "source": "Molecular biology in meat science p.21-31; บันทึกคาบ 21 ต.ค. 2569 [156:40-165:50]",
        "body": [
          {
            "sub": "Polymerase chain reaction, PCR",
            "body": [
              {
                "bullets": [
                  "**DNA based techniques**",
                  "**Detect 0.1% pork, horse and donkey meat in cooked sausage**",
                  "amplification of a single or few copies of DNA to thousand or millions copies แล้วตรวจว่ามีหรือไม่มี DNA นั้น",
                  "common DNA sequences: **mitochondrial 12S rRNA**",
                  "detect beef, sheep, goat, and pork in raw and heat-treated meat mixtures",
                  "ข้อดีคือแม่น ข้อเสียคือการสกัด DNA จากเนื้อสัตว์ทำได้ยาก"
                ]
              },
              {
                "table": {
                  "headers": [
                    "[table] Lane ของ multiplex PCR",
                    "ตัวอย่าง",
                    "ขนาด band"
                  ],
                  "rows": [
                    [
                      "M",
                      "DL 1000 DNA marker",
                      "100, 200, 300, 400, 500, 700, 1000 bp"
                    ],
                    [
                      "1",
                      "beef",
                      "116 bp"
                    ],
                    [
                      "2",
                      "duck",
                      "322 bp"
                    ],
                    [
                      "3",
                      "pork",
                      "212 bp"
                    ],
                    [
                      "4",
                      "combined duck, pork, mutton and beef",
                      "ขึ้น 4 bands"
                    ],
                    [
                      "5",
                      "mutton",
                      "177 bp"
                    ]
                  ]
                }
              },
              "multiplex PCR คือการตรวจหลายชนิดสัตว์พร้อมกัน ขนาด band ของสัตว์แต่ละชนิดไม่เท่ากันจึงบอกได้ว่ามีการปนหรือไม่"
            ]
          },
          {
            "sub": "Enzyme-linked immunosorbent assay, ELISA",
            "body": [
              {
                "bullets": [
                  "**most commonly used protein based techniques**",
                  "binding a soluble antigen or antibody to a solid support (immunosorbent) with an enzyme label",
                  "fast and reliable",
                  "**less specific than PCR-based methods**"
                ]
              }
            ]
          },
          {
            "sub": "Immunochromatographic assays",
            "body": [
              {
                "bullets": [
                  "use **nano-sized colloidal gold particles**",
                  "rapid, low cost, no special equipment requirement, no skillful technique",
                  "**good for screening a large number of samples**",
                  "use **before** the traditional DNA or protein based methods for confirmation"
                ]
              },
              {
                "sub": "ตัวอย่าง: The Easy Pork Detection kit, Tanaka Precious Metals",
                "body": [
                  {
                    "bullets": [
                      "detect extremely small accidental contaminations of pork",
                      "use colloidal gold nanoparticle suspended liquid",
                      "immunochromatographic assay (**only 15 min**)",
                      "screen a large number of samples แล้ว **confirmed by PCR**",
                      "**Detection limit: 0.1% in processed meat, 0.005% in raw meat**",
                      "วิธีใช้: 1. high-performance extraction liquid 2. add sample 3. shake well 4. just soak โดย pre-processing 5 minutes แล้วอ่านผล 10 minutes later",
                      "แถบผลในรูป: beef ขึ้น 1 เส้น ส่วน pork ขึ้น 2 เส้น",
                      "Principle of detection using immunochromatography: antibody ที่ติด nano-colloidal gold จับกับ pork ใน extraction liquid แล้วเคลื่อน (spreading) ไปตามแถบทดสอบ"
                    ]
                  }
                ]
              }
            ]
          },
          {
            "sub": "Fourier transform infrared (FTIR) spectroscopy",
            "body": [
              {
                "bullets": [
                  "**detection and quantification of pork fat**",
                  "also use partial least square calibration จึงต้องมีการคำนวณ",
                  "application in beef meatball in Indonesia",
                  "FTIR spectra of pork fat and beef fat in the mid infrared region (4000-650 cm-1)",
                  "FTIR spectra of beef and pork fats obtained from extraction of meatball formulations แสดง changes in the height ratio เมื่อ pork fat percentages เพิ่มขึ้น"
                ]
              }
            ]
          }
        ]
      },
      {
        "heading": "สรุป analytical techniques ใน halal authentication",
        "source": "Molecular biology in meat science p.32; บันทึกคาบ 21 ต.ค. 2569 [165:50-166:30]",
        "body": [
          {
            "table": {
              "headers": [
                "Authentication issue",
                "Analytical techniques"
              ],
              "rows": [
                [
                  "**Pork adulteration & species identification**",
                  "PCR-RFLP, real-time PCR, species-specific PCR, RAPD, PCR sequencing, gold nanoparticles"
                ],
                [
                  "**Pork protein**",
                  "ELISA, chromatography, peptide examination, isoelectric focusing"
                ],
                [
                  "**Pork fat (lard)**",
                  "FTIR spectroscopy, electronic nose"
                ]
              ]
            }
          }
        ]
      }
    ]
  },

  // ─────────────────────────────────────────────────────────────
  'meat-slaughter': {
    "topic": "meat-slaughter",
    "title": "Slaughterhouse: production facilities & sanitary practices",
    "lecturer": "สิรวิทย์ ภักดีพาณิชย์กิจ (SP)",
    "icon": "🏭",
    "summary": "โรงฆ่าสัตว์ ปี 2569: ปัจจัยออกแบบโรง ที่ตั้ง โซนสะอาดและสกปรก พฤติกรรมสัตว์ การขนส่งและคอกพัก วิธีทำให้สลบ (กลไก ไฟฟ้า water bath แก๊ส) การปล่อยเลือด การลวก การควักเครื่องใน การลดอุณหภูมิซาก แล้วเดินตามแผนผังการปฏิบัติที่ดีของโรงฆ่าสุกร สัตว์ปีก และโค กระบือ ทีละขั้นพร้อมตัวเลข",
    "sections": [
      {
        "heading": "โรงฆ่าสัตว์ และสิ่งที่กำหนดการออกแบบ",
        "source": "Slaughterhouse p.2; บันทึกคาบ 4 พ.ย. 2569 [12:00-23:00]",
        "body": [
          "**Slaughterhouse/abattoir** คืออาคารหรือสถานที่ที่ใช้ฆ่าสัตว์ เมื่อเนื้อมีไว้เพื่อการบริโภคของคน สองคำนี้ความหมายเดียวกัน",
          {
            "bullets": [
              "สัตว์ที่เข้าฆ่าต้องมาจากแหล่งที่ถูกกฎหมาย เช่น ฟาร์มที่ขึ้นทะเบียนหรือฟาร์มมาตรฐาน (รายย่อยแจ้งหน่วยงานท้องถิ่น) และต้องเป็นชนิดที่กฎหมายอนุญาตให้ใช้เป็นอาหาร"
            ]
          },
          {
            "sub": "การออกแบบโรงขึ้นกับ 5 อย่าง",
            "body": [
              {
                "bullets": [
                  {
                    "label": "Purpose",
                    "value": "ชนิดสัตว์ที่โรงจะฆ่า"
                  },
                  {
                    "label": "Practice to be followed",
                    "value": "มาตรฐานที่โรงต้องการได้รับการรับรอง เริ่มจากขั้นต่ำตามกฎหมายควบคุมการฆ่าสัตว์เพื่อขึ้นทะเบียนกับกรมปศุสัตว์ แล้ว GMP หรือ GHP, HACCP และข้อกำหนดของลูกค้าประเทศผู้นำเข้า"
                  },
                  {
                    "label": "Capacity",
                    "value": "ต้องสัมพันธ์กับจำนวนคนงาน เครื่องจักร ความเร็วสายการผลิต น้ำ และไฟฟ้า"
                  },
                  {
                    "label": "Level of technology to be adopted",
                    "value": "เลือกตั้งแต่ออกแบบ เช่น ทำให้สุกรสลบด้วยไฟฟ้าหรือด้วย CO2 (CO2 ต้องมีลิฟต์และ chamber)"
                  },
                  {
                    "label": "Financial condition",
                    "value": "สภาพการเงินของโรง"
                  }
                ]
              }
            ]
          }
        ]
      },
      {
        "heading": "ที่ตั้งและสาธารณูปโภค",
        "source": "Slaughterhouse p.3; บันทึกคาบ 4 พ.ย. 2569 [24:00-31:30]",
        "body": [
          {
            "sub": "น้ำ ไฟฟ้า และการระบายน้ำเสีย",
            "body": [
              {
                "bullets": [
                  "ต้องมีน้ำ ไฟฟ้า และระบบระบายน้ำเสียเพียงพอ รวมน้ำร้อนและน้ำเย็น คุณภาพน้ำและแรงดันน้ำ",
                  "น้ำต้องพอทั้งปริมาณและคุณภาพ น้ำที่สัมผัสซากต้องมีมาตรฐานสูงกว่า โรงฆ่าใช้น้ำและปล่อยน้ำเสียปริมาณมาก",
                  "น้ำร้อนใช้ลวก ส่วนการลดอุณหภูมิซากในทางปฏิบัติใช้น้ำอุณหภูมิห้องกับน้ำแข็ง",
                  "แรงดันน้ำสำคัญต่อการล้างซาก การล้างขั้นสุดท้ายเป็น CCP ในหลายโรง",
                  "ต้องมีเครื่องกำเนิดไฟฟ้าสำรอง สำคัญที่สุดกับห้องเย็น ห้องแช่แข็ง และการลดอุณหภูมิซาก"
                ]
              }
            ]
          },
          {
            "sub": "ที่ตั้งของโรง",
            "body": [
              {
                "bullets": [
                  "เป็นพื้นที่ปราศจากมลพิษ (กลิ่น ฝุ่น ควัน) ห่างจากโรงงาน บ่อขยะ และโรงงานเคมี กลิ่นอาจทำให้เนื้อเสียกลิ่น",
                  "ห่างจากชุมชนเมือง เช่น วัด โรงพยาบาล โรงเรียน ตลาด",
                  "รอบโรงมีถนนลาดยาง และอยู่ในที่น้ำไม่ท่วม",
                  "ฐานรากดี (good foundation)"
                ]
              }
            ]
          }
        ]
      },
      {
        "heading": "การออกแบบโรงและสุขลักษณะ: โซนสะอาดกับโซนสกปรก",
        "source": "Slaughterhouse p.4; บันทึกคาบ 4 พ.ย. 2569 [31:30-38:20]",
        "body": [
          {
            "bullets": [
              "แยกโซนสะอาดกับโซนสกปรก จุดที่สกปรกที่สุดคือคอกพัก คนงานไม่ข้ามโซนในบริเวณทำงาน",
              "ตำแหน่งที่เริ่มโซนสะอาดต่างกันตามชนิดสัตว์ ดูแผนผังของสุกร สัตว์ปีก และโค กระบือในหัวข้อถัดไป",
              "การไหลทางเดียว ไม่ย้อนกลับ (one way flow with no reversal): ซากเคลื่อนจากสกปรกไปสะอาด ส่วนการระบายน้ำและอากาศไหลทางตรงข้าม คือจากสะอาดไปสกปรก",
              "มีระบบรางแขวนเหนือศีรษะ (overhead rail system)",
              "หน้าต่างที่เปิดได้ต้องมีมุ้งลวด ส่วนใหญ่โรงสร้างโดยไม่มีหน้าต่าง"
            ]
          },
          {
            "sub": "พื้น ผนัง เพดาน",
            "body": [
              {
                "bullets": [
                  "พื้น: เรียบ ล้างง่าย ไม่ลื่น โรงใหม่ใช้พื้นเรซินอีพอกซี",
                  "มุมระหว่างผนังกับพื้นโค้ง ล้างง่าย",
                  "ผนัง: สีขาวหรือสีอ่อน สะท้อนแสง เห็นสิ่งสกปรกชัดและห้องสว่างขึ้น",
                  "เพดานในโซนสะอาดสูงอย่างน้อย 3 m",
                  "ซากที่แขวน ส่วนล่างสุดต้องสูงจากพื้นอย่างน้อย 30 cm ตามมาตรฐาน ในทางปฏิบัติโรงมักทำ 50 cm"
                ]
              }
            ]
          }
        ]
      },
      {
        "heading": "พฤติกรรมสัตว์และการต้อน",
        "source": "Slaughterhouse p.5, 8; บันทึกคาบ 4 พ.ย. 2569 [38:20-41:50], [49:00-53:50]",
        "body": [
          {
            "sub": "พฤติกรรมของสัตว์",
            "body": [
              {
                "bullets": [
                  "สัตว์เลี้ยงส่วนใหญ่ตามผู้นำโดยสัญชาตญาณ ต้อนผู้นำได้ ฝูงจะตามไป",
                  "สัตว์มีพื้นที่ส่วนตัว (personal space) ถ้าคนเข้าใกล้เกินไป สัตว์พยายามหนี",
                  "สัตว์ที่เลี้ยงใกล้ชิดมนุษย์ไม่มี flight zone",
                  "Flight zone: มี edge of flight zone, blind spot และ point of balance (มุม 90°) ใช้ flight zone กับ blind spot เป็นหลักในการต้อน",
                  "การมองเห็น: มุมกว้าง แต่ binocular vision ด้านหน้าแคบ",
                  "ดมกลิ่นไวมาก",
                  "ได้ยินช่วงความถี่กว้างกว่ามนุษย์ ไวต่อความถี่สูงกว่า"
                ]
              }
            ]
          },
          {
            "sub": "ปรับปรุงการเคลื่อนที่ของสัตว์",
            "body": [
              {
                "bullets": [
                  "จับสัตว์อย่างเงียบและใจเย็น ไม่ใช้เสียงดัง",
                  "ใช้แสงและกำจัดสิ่งที่รบกวนสายตา",
                  "เปลี่ยนทิศทางลม ไม่ให้ลมเป่าใส่สัตว์ และลดเสียงมอเตอร์ที่แหลมสูง",
                  "ต้อนเป็นกลุ่มเล็ก",
                  "ใช้ผนังทึบ",
                  "อุปกรณ์ที่ยอมรับได้: rattle paddle, ธง, sorting board และแผ่นผ้าสีเข้มติดไม้",
                  "การต้อนแรงทำให้สัตว์บาดเจ็บ"
                ]
              }
            ]
          },
          {
            "callout": "หน้า 5 และ 8 พิมพ์ว่าสัตว์ไวต่อความถี่สูงและให้ลดเสียงมอเตอร์ที่แหลมสูง แต่ในคาบเรียนเสียงมอเตอร์ถูกอธิบายว่าเป็นคลื่นความถี่ต่ำที่สัตว์กลัว สองแหล่งไม่ตรงกัน เนื้อหาข้างบนตามสไลด์",
            "kind": "flag"
          }
        ]
      },
      {
        "heading": "พื้นที่ต่อตัวและการขนส่งสัตว์",
        "source": "Slaughterhouse p.6, 7, 9; บันทึกคาบ 4 พ.ย. 2569 [41:50-49:00]",
        "body": [
          {
            "sub": "พื้นที่ขั้นต่ำและขนาดกลุ่ม",
            "body": [
              {
                "bullets": [
                  {
                    "label": "โคขุน (steer) ไม่มีเขา",
                    "value": "1.6 m²"
                  },
                  {
                    "label": "โคขุน มีเขา",
                    "value": "1.85 m²"
                  },
                  {
                    "label": "สุกรและแกะ",
                    "value": "0.5 m² และประมาณ 0.8 m² ในอากาศร้อน"
                  },
                  "พื้นที่ต้องพอให้สัตว์ทุกตัวนอนลงได้ พื้นที่มากเกินไปก็ทำให้เครียด",
                  "ขึ้นกับความจุของรถบรรทุก",
                  "ไม่ควรเอาสัตว์ที่ไม่คุ้นกันมารวมกันก่อนฆ่าไม่นาน เพราะสัตว์ต่างคอกต่อสู้เพื่อจัดอันดับใหม่",
                  "ตัวเลขพื้นที่มาจากตำรา อาจต่างจากมาตรฐานไทย"
                ]
              }
            ]
          },
          {
            "sub": "สิ่งที่ต้องพิจารณาในการขนส่ง",
            "body": [
              {
                "bullets": [
                  "วิธีปฏิบัติของคนขับ (การหยุดพัก), เส้นทาง ระยะทาง และเวลาขนส่ง",
                  "การออกแบบรถ การขึ้นสัตว์ และการรับสัตว์",
                  "มุมลาดของทางลาด (ramp) ไม่เกิน 20° สูตรสำหรับมุม 20°: ความสูงทางลาด ÷ 0.34202 = ความยาวทางลาดเอียง",
                  "รถสุกรใช้ลิฟต์ได้ ส่วนโคใช้ทางลาด สัตว์ปีกขนส่งในลัง"
                ]
              }
            ]
          },
          {
            "sub": "การจัดการอุณหภูมิ",
            "body": [
              {
                "bullets": [
                  "อากาศหนาว: ระวังอากาศเย็นจัดและ wind chill โดยเฉพาะสุกร",
                  "อากาศร้อน: ให้ความสำคัญกับสถานะการได้รับน้ำเพื่อป้องกัน heat stress ไม่งดน้ำทั้งก่อนจับสัตว์และในคอกพัก",
                  "Livestock Hot Weather Safety Index อ่านเป็นอุณหภูมิ °F เทียบกับความชื้นสัมพัทธ์ แบ่งเป็น 4 โซน คือ Safe, Alert, Danger, Emergency ยิ่งความชื้นสูง อุณหภูมิที่ปลอดภัยยิ่งต่ำลง"
                ]
              }
            ]
          }
        ]
      },
      {
        "heading": "คอกพักสัตว์ (lairage) และทางเดิน",
        "source": "Slaughterhouse p.9-12; บันทึกคาบ 4 พ.ย. 2569 [49:00-59:59]",
        "body": [
          {
            "bullets": [
              "ออกแบบให้สัตว์เคลื่อนทางเดียว (one way flow)",
              "คอกต้องให้สัตว์ยืนและนอนได้ ทำเป็นสี่เหลี่ยมผืนผ้า ไม่ใช่สี่เหลี่ยมจัตุรัส เพราะต้อนจากหัวคอกไปท้ายคอกได้ จัดทางเดินง่าย และใช้พื้นที่คุ้มกว่า",
              "ทางเดินและ race เป็นเส้นตรงหรือโค้งเล็กน้อย มีผนังทึบ เพื่อไม่ให้สัตว์เห็นสิ่งแวดล้อมด้านนอก",
              "ไม่ทำทางโค้งหักศอก เพราะสัตว์เห็นเป็นกำแพงแล้วไม่กล้าเดิน",
              "พื้นระบายน้ำดี ไม่ลื่น ล้างง่าย เพราะสัตว์ขับถ่าย และเป็นจุดอาบน้ำหรือล้างตัวสัตว์",
              "พื้นแบบ slatted หรือมีรู ไม่ลื่นและล้างง่าย",
              "โคเดินเข้า race ทีละตัว และถูกล้างตัวก่อนฆ่า",
              "จุดตรวจ antemortem ต้องสว่างพอ เห็นสัตว์ได้รอบตัว ทั้งซ้าย ขวา หน้า หลัง และสัตว์แสดงพฤติกรรมตามธรรมชาติได้ (ยืน นั่ง นอน เดิน)"
            ]
          },
          {
            "sub": "ตัวอย่าง chute system",
            "body": [
              {
                "bullets": [
                  "ลำดับ: level dock, ramp, unloading pen, curved holding lane, walkway, round forcing pen และ restrainer",
                  "เว้นช่วงของทางเดินไว้ขยายสำหรับเครื่องชั่ง จุดระบุตัวสัตว์ หรือจุดคัดแยก",
                  "ปลายทางมีทางโค้งให้สัตว์เดินแถวเดียว"
                ]
              }
            ]
          }
        ]
      },
      {
        "heading": "วิธีทำให้สลบ (stunning) และการทำให้สลบด้วยกลไก",
        "source": "Slaughterhouse p.14-16, 20; บันทึกคาบ 4 พ.ย. 2569 [61:00-64:59], [73:00-73:59]",
        "body": [
          {
            "sub": "แบ่งเป็น 3 กลุ่ม",
            "body": [
              {
                "bullets": [
                  {
                    "label": "Mechanical stunning",
                    "value": "penetrating captive bolt, non-penetrating captive bolt, gun shot"
                  },
                  {
                    "label": "Electrical stunning",
                    "value": "direct electrical stunning, water bath stunning"
                  },
                  {
                    "label": "Gas stunning",
                    "value": "ใช้แก๊สทำให้สลบ"
                  }
                ]
              }
            ]
          },
          {
            "sub": "Mechanical stunning",
            "body": [
              {
                "bullets": [
                  {
                    "label": "Penetrating captive bolt",
                    "value": "แรงดันอากาศหรือกระสุนเปล่าดัน bolt เข้ากลางหน้าผากของสัตว์"
                  },
                  {
                    "label": "Non-penetrating captive bolt",
                    "value": "กลไกเดียวกัน ต่างที่ปลายแท่งเป็นหัวทื่อกว้างรูปเห็ด"
                  },
                  "ทั้งสองแบบมีรุ่นยิงด้วยกระสุน (cartridge) และรุ่นใช้ลม (air operated)",
                  {
                    "label": "ปืนที่ใช้กระสุนพิเศษ",
                    "value": "กระสุนแตกสลายหลังออกจากปากกระบอกในระยะสั้น เพื่อลดอันตรายต่อความปลอดภัย"
                  }
                ]
              }
            ]
          },
          {
            "sub": "การใช้ในไทย",
            "body": [
              {
                "bullets": [
                  "โคและกระบือ: ถ้าทำให้สลบ ใช้ captive bolt ไม่นิยมใช้ไฟฟ้า",
                  "การเชือดแบบฮาลาลเข้มงวดไม่ทำให้สลบ เชือดสด",
                  "บางโรงฆ่าโคไม่ทำให้สลบ เชือดแล้วปล่อยเลือดทันที"
                ]
              }
            ]
          }
        ]
      },
      {
        "heading": "การทำให้สลบด้วยไฟฟ้าโดยตรง (direct electrical stunning)",
        "source": "Slaughterhouse p.17-20; บันทึกคาบ 4 พ.ย. 2569 [64:00-73:59]",
        "body": [
          {
            "sub": "3 แบบ",
            "body": [
              {
                "bullets": [
                  {
                    "label": "Head-only stunning",
                    "value": "กระแสไฟผ่านสมองอย่างเดียว ใช้คีมหนีบขมับ 2 ข้าง ส่วนใหญ่คนถือคีมหนีบเอง (manual) ทำให้สลบชั่วคราว สัตว์ไม่ตาย ฟื้นสติถ้าไม่ปล่อยเลือดภายใน 10-15 วินาที จึงต้องรีบแทงคอ"
                  },
                  {
                    "label": "Head-to-body cardiac arrest",
                    "value": "กระแสไฟผ่านสมองและหัวใจพร้อมกัน ต้องมีอุปกรณ์บังคับสัตว์ (restraining device) เช่น รางหนีบสุกรให้นิ่ง ต้องใช้คนชำนาญ สลบถาวรเมื่อทำถูกต้อง แนะนำให้ปล่อยเลือดภายใน 60 วินาที แต่ที่ทำจริงไม่เกิน 10-15 วินาที ในไทยไม่ค่อยนิยมแบบนี้"
                  },
                  {
                    "label": "Two-step cardiac arrest",
                    "value": "กระแสไฟผ่านหัวก่อน แล้วใช้กับหน้าอกทันทีเพื่อหยุดหัวใจ สลบถาวรเมื่อทำถูกต้อง แนะนำให้ปล่อยเลือดภายใน 60 วินาที ใช้กับเครื่องทำสลบอัตโนมัติเป็นส่วนใหญ่ สุกรพาดบนรางรองอกและท้องให้ขาลอยจากพื้น ขั้วไฟที่ขมับ 2 ข้างลงก่อน ขั้วที่หัวใจตามหลังประมาณ 1 วินาที"
                  }
                ]
              }
            ]
          },
          {
            "sub": "ค่าทางไฟฟ้า",
            "body": [
              {
                "bullets": [
                  {
                    "label": "Amperage (A)",
                    "value": "การไหลของกระแส ต้องพอให้สัตว์รู้สึกตัวไม่ได้ทันที"
                  },
                  {
                    "label": "Voltage (V)",
                    "value": "แรงดันของกระแส ต้องพอจะส่ง A ขั้นต่ำที่แนะนำ"
                  },
                  {
                    "label": "Frequency (Hz)",
                    "value": "จำนวนครั้งที่กระแสสลับต่อวินาที สำคัญกับการทำให้สลบที่หัวและที่หลัง"
                  }
                ]
              },
              {
                "sub": "สุกร",
                "body": [
                  {
                    "bullets": [
                      "A ≥1.25 (สุกร 85 kg), ≥2.0 (สุกร 100 kg)",
                      "V ≥220, 50-60 Hz, เวลา ≥2 วินาที",
                      "น้ำหนักสุกรเข้าเชือดปกติประมาณ 90-120 kg ส่วนค่า V กับ Hz แทบไม่เปลี่ยน ส่วน A ปรับตามน้ำหนัก ปัจจุบันบางโรงใช้ระบบ AI หาน้ำหนักเฉลี่ยของชุดแล้วปรับค่าที่ตั้ง"
                    ]
                  }
                ]
              },
              {
                "sub": "โค (2-phase stun)",
                "body": [
                  {
                    "bullets": [
                      "A 1.5, V 400, 50-60 Hz",
                      "1 วินาทีทำให้รู้สึกตัวไม่ได้ และนานได้ถึง 15 วินาทีเพื่อลดการดิ้นเตะ",
                      "ค่านี้เป็นตัวอย่างค่าตั้งหนึ่งชุด ไม่ใช่ค่าของโรงในไทย แต่ละโรงตั้งไม่เหมือนกัน"
                    ]
                  }
                ]
              }
            ]
          }
        ]
      },
      {
        "heading": "การทำให้สลบด้วย water bath (สัตว์ปีก)",
        "source": "Slaughterhouse p.21; บันทึกคาบ 4 พ.ย. 2569 [74:00-76:59]",
        "body": [
          "สัตว์ปีกถูกแขวนบน shackle แล้วจุ่มหัวและคอในอ่างน้ำที่มีไฟฟ้า กระแสไฟผ่านทั้งตัว โดยวิ่งจากหัวขึ้นขาและผ่านสมอง",
          {
            "bullets": [
              {
                "label": "Reversible",
                "value": "ตั้งค่าปรับได้ voltage ต่ำ ความถี่สูง น้ำอุณหภูมิ ≥25 °C นกอยู่ใน stunner 10-20 วินาที (ช่วงที่สลบแล้วกลับมามีสติได้ จึงเรียก reversible) ในไทยไม่ค่อยนิยม"
              },
              {
                "label": "Non-reversible (EC 1099/2009)",
                "value": "voltage สูง ความถี่สูงกว่า ปรับระบบตามผลลัพธ์ (outcome-based) ในไทยนิยมแบบนี้ เพราะบริษัทใหญ่ส่งออกยุโรปซึ่งมีมาตรฐาน EC 1099 ตัวเลข voltage และความถี่ของแบบนี้ให้เป็นตัวเลขตายตัวไม่ได้ เพราะต่างกันแต่ละโรง"
              },
              "ความถี่ใช้ความถี่สูงทั้งสองแบบ อุณหภูมิน้ำมีผลต่อการนำไฟฟ้า",
              "การทำให้ไก่สลบดูที่ mA ต่อตัวเป็นหลัก"
            ]
          }
        ]
      },
      {
        "heading": "การทำให้สลบด้วยแก๊ส (gas stunning)",
        "source": "Slaughterhouse p.22; บันทึกคาบ 4 พ.ย. 2569 [77:00-79:59]",
        "body": [
          {
            "sub": "สุกร",
            "body": [
              {
                "bullets": [
                  {
                    "label": "CO2 stunning",
                    "value": "ความเข้มข้น >80% โดยปริมาตร (ดีที่สุด 90% โดยปริมาตร)"
                  },
                  {
                    "label": "Inert gas (ร่วมกับ CO2)",
                    "value": "O2 สูงสุด 2% โดยปริมาตรในแก๊สผสมของ Ar, N2 หรือแก๊สเฉื่อยอื่น (มี CO2 ได้สูงสุด 30% โดยปริมาตร)"
                  },
                  "Gondola: สุกรมีชีวิตเข้าด้านบน แล้วสุกรที่สลบออกอีกฝั่ง ช่อง CO2 gas inlet อยู่ด้านล่าง ความสูงรวม 6.4 m",
                  "ลิฟต์พาลงโซน CO2 ด้านล่างแล้วหมุนขึ้นออกอีกฝั่ง รวมประมาณ 4-5 นาที อยู่ในโซน CO2 เต็มที่ประมาณ 1.5 นาที"
                ]
              }
            ]
          },
          {
            "sub": "สัตว์ปีก",
            "body": [
              {
                "bullets": [
                  {
                    "label": "Gas mixtures",
                    "value": "90% Ar in air; 30% CO2 + 60% Ar in air; 40% CO2 + 30% O2 + 30% N2"
                  },
                  {
                    "label": "Controlled Atmosphere Stunning (CAS)",
                    "value": "40% CO2 + 30% O2 + 30% N2 นาน 1 นาที แล้วตามด้วย 80% CO2 + 5% O2 นาน 2 นาที"
                  },
                  "ในไทยใช้แก๊สกับสุกร โรงไก่เท่าที่ทราบยังไม่มีที่ใช้ เพราะต้องออกแบบ chamber ขนาดใหญ่ตั้งแต่แรก ทำเป็นลิฟต์ไม่ได้ ไก่จึงยังใช้ water bath"
                ]
              }
            ]
          }
        ]
      },
      {
        "heading": "การปล่อยเลือด (bleeding)",
        "source": "Slaughterhouse p.23; บันทึกคาบ 4 พ.ย. 2569 [79:00-83:59]",
        "body": [
          {
            "bullets": [
              "ต้องใช้พนักงานที่ฝึกมาดี และใช้มีดคมเพื่อให้ตัดเรียบและเร็ว เพราะต้องถูกทั้งตำแหน่งและความลึก ถ้าแทงพลาด สัตว์ไม่ตายทันทีและซากเสียคุณภาพ",
              "เวลาที่ต้องปล่อยเลือดขึ้นกับชนิดสัตว์และวิธีที่ตัด ไก่เรียกว่าปาดคอ",
              "การเชือดแบบฮาลาล (ไก่และโค): ผู้เชือดเป็นมุสลิมและท่องบทสวดขณะเชือด ตัดหลอดเลือดแดง 2 หลอดเลือดดำ 2 หลอดลม และหลอดอาหารให้ขาดในมีดเดียว ไม่ยกมีด"
            ]
          },
          {
            "sub": "เวลาปล่อยเลือด",
            "body": [
              {
                "bullets": [
                  {
                    "label": "ไก่",
                    "value": "อย่างน้อย 2 นาที"
                  },
                  {
                    "label": "สุกร",
                    "value": "อย่างน้อย 4 นาที"
                  },
                  {
                    "label": "โค กระบือ",
                    "value": "ประมาณ 5-6 นาที"
                  }
                ]
              }
            ]
          },
          {
            "sub": "ทำไมต้องเอาเลือดออกให้มากที่สุด",
            "body": [
              {
                "bullets": [
                  "เลือดค้างในอวัยวะและกล้ามเนื้อทำให้คุณภาพซากลดลง",
                  "เลือดเป็นอาหารเลี้ยงเชื้อ",
                  "ออกได้เต็มที่ราว 50% ของเลือดทั้งหมดเท่านั้น"
                ]
              }
            ]
          }
        ]
      },
      {
        "heading": "การลวกและถอนขน (scalding, picking/dehairing)",
        "source": "Slaughterhouse p.24-25; บันทึกคาบ 4 พ.ย. 2569 [84:00-89:59]",
        "body": [
          {
            "bullets": [
              "น้ำลวกอุณหภูมิ ≥50 °C เพราะความเสี่ยงทางจุลชีววิทยา ตัวเลขนี้มาจากงานประเมินความเสี่ยงทางจุลชีววิทยา มาตรฐานจริงใช้สูงกว่านี้"
            ]
          },
          {
            "sub": "สัตว์ปีก",
            "body": [
              {
                "bullets": [
                  "ระบบลวกบ่อเดียวหรือหลายโซน (single/multiple zone)",
                  {
                    "label": "Soft scald",
                    "value": "50-53 °C"
                  },
                  {
                    "label": "Hard scald",
                    "value": "51-57 °C"
                  },
                  {
                    "label": "Dwell time",
                    "value": "2.5-3.5 นาที"
                  },
                  "ถ้ามีหลายบ่อ โดยปกติลง soft scald (น้ำอุณหภูมิต่ำกว่า) ก่อน แล้วจึง hard scald บางที่ทำ hard ก่อน เพื่อจัดการเชื้อที่ไวต่ออุณหภูมิตั้งแต่บ่อแรก ซึ่งบ่อที่สองทำหน้าที่เปิดรูขุมขน"
                ]
              }
            ]
          },
          {
            "sub": "สุกร",
            "body": [
              {
                "bullets": [
                  "58-62 °C นาน 4-8 นาที (บ่อลวกหรือสายการผลิตอัตโนมัติ)",
                  "เครื่องถอนขนสุกรเอาขนออกไม่หมด เหลือขนอ่อน และขนที่รักแร้กับซอกหู จึงเผาด้วยหัวพ่นไฟ แล้วใช้คนเก็บรายละเอียดอีกรอบ"
                ]
              }
            ]
          }
        ]
      },
      {
        "heading": "การควักเครื่องใน (evisceration)",
        "source": "Slaughterhouse p.26-27; บันทึกคาบ 4 พ.ย. 2569 [90:00-94:59]",
        "body": [
          {
            "bullets": [
              "เป้าหมาย: ทำความสะอาดซากอย่างมีประสิทธิภาพและเตรียมซากสำหรับการลดอุณหภูมิ",
              "Manual evisceration station ใช้อุปกรณ์ที่ทำขึ้นเฉพาะงาน (tailor-made)",
              "ระบบอัตโนมัติต้องมีโปรแกรมบำรุงรักษาเชิงป้องกัน (preventive maintenance) เพื่อให้เครื่องทำงานได้ถูกต้อง",
              "ใช้คนเมื่อต้องการเครื่องในสภาพสวย (เครื่องทำให้เครื่องในเละและไส้แตก) เพราะเครื่องในส่งออกมูลค่าสูง หลักๆไปจีน",
              "ถ้าเน้นเร็ว ใช้เครื่องอัตโนมัติ: เปิดที่ก้น (cloaca) หัวคล้ายสว่านม้วนเครื่องในออก แล้วแขวนคู่กับซาก",
              "โคและสุกร: มัดไส้ตรง หรือเจาะรอบก้นแล้วดูดอุจจาระที่ค้าง เพื่อกันการปนเปื้อน",
              "ซาก เครื่องในแดง เครื่องในขาว และหัว ต้องไปด้วยกันหรือแท็กย้อนกลับได้ว่าหัวนี้เป็นของซากไหน",
              "สุกร: เครื่องในแดงแขวน เครื่องในขาวอยู่ในถาด คนตรวจซากอย่างน้อย 2 คน (ดูซาก 1 คน ดูเครื่องใน 1 คน)",
              "ขั้นถัดไปคือการตรวจซากหลังฆ่า"
            ]
          }
        ]
      },
      {
        "heading": "การลดอุณหภูมิซาก (chilling): immersion กับ air chilling",
        "source": "Slaughterhouse p.28-29; บันทึกคาบ 4 พ.ย. 2569 [94:00-105:59]",
        "body": [
          {
            "sub": "Water/immersion chilling (counter-flow) ของสัตว์ปีก",
            "body": [
              {
                "bullets": [
                  "ซากไหลทางหนึ่ง น้ำไหลสวนทางกัน ผ่าน pre-chiller แล้ว final chiller มีการ agitation และเติมความเย็นเป็นช่วงๆ",
                  "ซากผ่าน final wash แล้วลงแท็งก์ที่ใบพัดดันซากไปข้างหน้า น้ำที่สะอาดกว่าอยู่ด้านท้ายและไหลสวนซาก เติมน้ำแข็งเป็นระยะ",
                  "ซากปนเปื้อน 1 ซากทำให้ปนเปื้อนข้ามทั้งแท็งก์ จึงแยกอย่างน้อย 2 แท็งก์ ควบคุมอุณหภูมิได้ดีกว่าและปนเปื้อนข้ามกระทบแท็งก์เดียว แต่ต้นทุนออกแบบสูงกว่า",
                  {
                    "label": "ข้อดี",
                    "value": "ราคาถูกกว่า"
                  },
                  {
                    "label": "ข้อเสีย",
                    "value": "ปนเปื้อนข้าม และซากอมน้ำ (อุโมงค์ลมเป่าน้ำออกได้ไม่ 100%)"
                  }
                ]
              }
            ]
          },
          {
            "sub": "Air chilling/chiller refrigeration",
            "body": [
              {
                "bullets": [
                  "สุกร โค และกระบือใช้ air chilling เป็นหลัก",
                  {
                    "label": "ข้อดี",
                    "value": "ซากไม่อมน้ำ ปนเปื้อนข้ามยาก"
                  },
                  {
                    "label": "ข้อเสีย",
                    "value": "ซากแห้ง สีหนังเข้มขึ้น (แก้ด้วยการคุมความชื้นในห้อง หรือพ่นสเปรย์น้ำเป็นจุด) และต้นทุนออกแบบสูง (วัสดุที่ไม่ให้ไอน้ำควบแน่น ระยะรางแขวน)"
                  }
                ]
              }
            ]
          },
          {
            "sub": "ห้องเย็นของสุกรและโค",
            "body": [
              {
                "bullets": [
                  "ผ่านห้อง quick chill ก่อน แล้วจึงห้อง overnight",
                  "บางที่มี anteroom ไล่ความชื้นและไอน้ำจากซากก่อน เพื่อลดน้ำแข็งเกาะซาก",
                  "ลังสินค้าห้ามวางบนพื้นโดยตรง แม้ใส่ถุงแล้ว ต้องมีพาเลทหรือลังรองล่างที่ระบุด้วยสี (หลายที่ใช้สีแดง)"
                ]
              }
            ]
          }
        ]
      },
      {
        "heading": "แผนผังโรงฆ่าสุกร: ลำดับขั้นและโซน",
        "source": "Slaughterhouse p.30 (มกษ. 9009-2549); บันทึกคาบ 4 พ.ย. 2569 [115:00-119:59]",
        "body": [
          {
            "sub": "ลำดับในแผนผัง",
            "body": [
              {
                "bullets": [
                  {
                    "label": "คอกพักสุกร",
                    "value": "รับสุกรเข้าคอกพัก, ตรวจสุกรก่อนเข้าฆ่า"
                  },
                  {
                    "label": "พื้นที่ผลิตส่วนไม่สะอาด",
                    "value": "ทำให้สลบ, นำเลือดออกโดยการแทงคอ, ล้าง, ลวก ขูดขน ดึงกีบ (เผาขนอ่อน), ล้าง"
                  },
                  {
                    "label": "พื้นที่ผลิตส่วนสะอาด",
                    "value": "ตัดหัว, เปิดท้อง แยกเครื่องในออก, ตรวจซากสุกร, ผ่าซีก, ล้าง, ชั่งน้ำหนัก แบ่งชั้นคุณภาพเนื้อสุกร (ตัดแต่ง)"
                  },
                  {
                    "label": "ห้องเย็น",
                    "value": "แช่เย็น"
                  }
                ]
              }
            ]
          },
          {
            "bullets": [
              "การล้างครั้งแรก (หลังเอาเลือดออก) คือ pre-wash ก่อนลวก",
              "โรงที่เป็นสายอัตโนมัติส่วนใหญ่มีการเผาขนอ่อน แล้วล้างอีกรอบเพื่อเอาเขม่าออกก่อนเข้าโซนสะอาด",
              "บางโรงแบ่งโซนสะอาดเป็นกึ่งสะอาด (ตัดหัวจนถึงเปิดช่องท้อง) กับสะอาด (หลังเปิดช่องท้อง)"
            ]
          }
        ]
      },
      {
        "heading": "โรงฆ่าสุกร: รับสุกรและทำให้สลบ",
        "source": "Slaughterhouse p.31; บันทึกคาบ 4 พ.ย. 2569 [119:00-123:59]",
        "body": [
          {
            "sub": "รับสุกรเข้าคอกพัก",
            "body": [
              {
                "bullets": [
                  "การขนส่ง: พื้นที่บนพาหนะ ≥0.4 (สุกรขุน) ถึง 0.8 (พ่อ/แม่พันธุ์) m²/ตัว",
                  "สุกรมาถึงก่อนฆ่า ≥2 ชั่วโมง และต้องไม่อดอาหารเกิน 12 ชั่วโมงติดต่อกัน ถ้าต้องอดเกิน 12 ชั่วโมง ให้วนไปรอฆ่าวันถัดไปและเริ่มอดอาหารใหม่ อดแต่อาหาร น้ำยังให้",
                  "การพัก 2 ชั่วโมงช่วยลดความเครียด ให้สัตว์คุ้นกับที่ใหม่และฝูง",
                  "ไม่ขนสุกรป่วยหรือตั้งท้องร่วมกับสุกรปกติ",
                  "คอกพักมีพื้นที่ ≥0.8 m²/ตัว",
                  "มีน้ำให้กินอย่างเพียงพอ",
                  "ตรวจสุกรก่อนเข้าฆ่า และมีทางเดินเข้าห้องทำให้สลบ"
                ]
              }
            ]
          },
          {
            "sub": "ทำให้สลบ (stunning)",
            "body": [
              {
                "bullets": [
                  {
                    "label": "ไฟฟ้า, stunning wand",
                    "value": "≥220 V, 50-60 Hz, ≥2 วินาที (บางโรงใช้ 3-4 วินาที น้อยมากที่ถึงหลักสิบวินาที)"
                  },
                  {
                    "label": "Two-step cardiac arrest electric stunning",
                    "value": "ที่หัวก่อน แล้วที่หัวใจ"
                  },
                  {
                    "label": "Auto stunning",
                    "value": "หัวประมาณ 2.6 A นาน 2.5 วินาที ตามด้วยหัวใจ 100 V นาน 2.5 วินาที (สายอัตโนมัติ 3 จุด คือขมับ 2 ข้างกับหัวใจ)"
                  },
                  {
                    "label": "แก๊ส (gas stunning)",
                    "value": "CO2 ≥82% (หลายโรงใช้ประมาณ 90%)"
                  },
                  "โรงเล็กต้อนทีละตัวแล้วหนีบขมับ 2 ข้าง สุดท้ายดูผลการทำให้สลบที่ซาก"
                ]
              }
            ]
          },
          {
            "callout": "ตัวเลขต่างกันระหว่างหน้า: CO2 สุกร หน้า 22 คือ >80% ส่วนหน้า 31 พิมพ์ ≥82% และพื้นที่ต่อตัว หน้า 6 คือ 0.5 m² ส่วนหน้า 31 พิมพ์ ≥0.8 m²/ตัวในคอกพัก ให้ระบุแหล่งของตัวเลขเสมอ",
            "kind": "flag"
          }
        ]
      },
      {
        "heading": "โรงฆ่าสุกร: แทงคอ ลวก และขูดขน",
        "source": "Slaughterhouse p.32; บันทึกคาบ 4 พ.ย. 2569 [123:00-129:59]",
        "body": [
          {
            "sub": "การแทงคอ (sticking)",
            "body": [
              {
                "bullets": [
                  "แทงให้เร็วที่สุดหลังสุกรสลบ: ไฟฟ้า ≤60 วินาที, แก๊ส ≤30-90 วินาที ในทางปฏิบัติหลังแก๊สแทงคอทันที ไม่เกิน 15-20 วินาที",
                  "ปล่อยเลือดออก ≥4 นาที",
                  "Vertical/horizontal bleeding แบบ horizontal สุกรนอน เลือดปนกับน้ำลายและน้ำมูกน้อย (แยกเก็บเลือดไปใช้ได้) แต่เลือดออกน้อยหรือช้ากว่า แบบแนวตั้งแขวนขาเดียวขึ้นโซ่ก่อนใส่ gambrel เลือดออกดีกว่า หลายโรงใช้ผสมกัน",
                  "มีดที่ใช้ต้องทำความสะอาดและฆ่าเชื้อด้วยน้ำร้อน (≥82 °C) ทุกครั้ง",
                  "เปิดแผลประมาณ 5-8 cm ลึกพอตัด vein และ artery ขาด ความยาวแผลขึ้นกับความชำนาญและใบมีด ถ้าแทงลึกเกินจนโดนหัวใจ เมื่อเปิดซากจะเจอเลือดเป็นวุ้นเคลือบเยื่อหุ้มหัวใจ"
                ]
              }
            ]
          },
          {
            "sub": "ลวก ขูดขน ดึงกีบ (scalding, dehairing, toenail removal)",
            "body": [
              {
                "bullets": [
                  "ลวกในบ่อลวกหรือใช้น้ำร้อนฉีดพ่น (≥58 °C) สุกรปกติลวกที่ 60 กว่าองศา ประมาณ 5 นาทีตามขนาดตัว ถ้าร้อนหรือนานเกิน ผิวซากสุก และความร้อนสะสมทำให้ลดอุณหภูมิซากนานขึ้น",
                  "เข้าสู่กระบวนการขูดขนโดยไม่ให้ซากสัมผัสพื้น",
                  "ระบบแขวนใช้เหล็กถ่างขา (gambrel) หรือตะขอเกี่ยวเอ็นร้อยหวาย",
                  "ดึงกีบทั้งขาหน้าและขาหลัง",
                  "เผาขนอ่อนให้หมด และใช้มีดขูดขนที่เหลือ",
                  "ล้างและปั่นทำความสะอาดซาก"
                ]
              }
            ]
          }
        ]
      },
      {
        "heading": "โรงฆ่าสุกร: ตัดหัว ควักเครื่องใน ผ่าซีก และลดอุณหภูมิ",
        "source": "Slaughterhouse p.33-34; บันทึกคาบ 4 พ.ย. 2569 [130:00-136:59]",
        "body": [
          {
            "sub": "การตัดหัว (head removal)",
            "body": [
              {
                "bullets": [
                  "ตัดหัวที่กระดูกส่วนต้นคอข้อที่ 1 บริเวณรอยคอดของคอ",
                  "วางในภาชนะหรือทำเครื่องหมายหัวให้ตรงกับตัวของสุกร",
                  "ถ้าหัวห้อยติดกับตัวสุกร ให้แยกหัวหลังตรวจซากและเครื่องในแล้ว",
                  "แนวตัดหนังคอมี 2 แบบ: ตัดตรงได้หัวสวย หนังเต็มหัว ตัดเฉียงเก็บคอหมูไว้กับซากได้มากกว่า แต่หัวแหว่งแถวคาง"
                ]
              }
            ]
          },
          {
            "sub": "การแยกเครื่องในออก (evisceration)",
            "body": [
              {
                "bullets": [
                  "ตัดหนังและคว้านรอบทวารหนัก ตัดแยกส่วนทวาร (pork bung) (และอวัยวะเพศผู้)",
                  "เปิดช่องท้องลงมาถึงหน้าอก ดึงเครื่องในขาวออก",
                  "เปิดช่องอก ดึงเครื่องในแดงออก",
                  "วางในภาชนะหรือแขวนทำเครื่องหมายให้ตรงกับตัวของสุกร",
                  "ตรวจซากและเครื่องในสุกรหลังฆ่า แล้วล้างเครื่องใน",
                  "ผ่านการตรวจ: ซากไปต่อ เครื่องในเข้าห้องล้าง หัวเข้าห้องตัดแต่ง ถูก condemn: แยกไปรางเฉพาะ"
                ]
              }
            ]
          },
          {
            "sub": "การผ่าซีก (ตัดแต่ง)",
            "body": [
              {
                "bullets": [
                  "ใช้มีดหรือเลื่อยผ่าครึ่งซากสุกร (ที่นำเครื่องในออกแล้ว) ผ่ากึ่งกลางกระดูกสันหลังเป็นเส้นตรงถึงกระดูกคอ",
                  "ดึงไขสันหลังออก ตรวจซาก และฉีดล้างทำความสะอาดซาก การดึงไขสันหลังสุกรไม่บังคับ (optional) ตามมาตรฐาน หลายโรงดึงออกเพราะเป็นเนื้อเยื่อไขมันที่เสื่อมเสียง่าย ส่งผลต่อกระดูกสันหลังและซาก เอาออกแล้วเพิ่ม shelf life",
                  "Final wash หลังผ่าซีกเป็น CCP ของโรงมาตรฐานแทบทุกโรง critical limit คือแรงดันน้ำและปริมาณน้ำต่อซาก",
                  "ตัดแต่งซากด้วยความรวดเร็ว",
                  "แบ่งชั้นคุณภาพเนื้อสุกรตาม มกษ. 6000-2547"
                ]
              }
            ]
          },
          {
            "sub": "การลดอุณหภูมิซาก",
            "body": [
              {
                "bullets": [
                  "นำซากเข้าห้องเย็น ลดอุณหภูมิใจกลางซากให้ ≤7 °C ภายใน 24 ชั่วโมง ในทางปฏิบัติโรงมักตั้งไม่เกิน 4 °C",
                  "จัดเรียงซากตามระบบ “เข้าแช่ก่อน นำออกก่อน” (first in, first out)",
                  "วัดอุณหภูมิใจกลางซากสุกรที่จุดหนาและลึกที่สุด คือสะโพก (ham)"
                ]
              }
            ]
          }
        ]
      },
      {
        "heading": "การบรรจุ จัดเก็บ และขนส่งซาก เนื้อ และผลผลิต (ใช้เหมือนกันทั้งสามชนิด)",
        "source": "Slaughterhouse p.35, 42, 48; บันทึกคาบ 4 พ.ย. 2569 [136:00-139:59], [153:00-154:59], [161:00-161:59]",
        "body": [
          "ข้อกำหนดการบรรจุ จัดเก็บ และขนส่งของสุกร สัตว์ปีก และโค กระบือเป็นชุดเดียวกัน ต่างกันเล็กน้อยเฉพาะข้อความเรื่องการเคลื่อนย้าย",
          {
            "sub": "การบรรจุและจัดเก็บ",
            "body": [
              {
                "bullets": [
                  "ภาชนะบรรจุที่ทำจากพลาสติกต้องได้มาตรฐานตามกฎหมายว่าด้วยอาหาร",
                  "ฉลากบนภาชนะบรรจุต้องชัดเจน แสดงประเภทของซาก/เนื้อ/ผลผลิต, น้ำหนักสุทธิ (g, kg), วัน เดือน ปีที่ผลิต (ฆ่า) และควรบริโภคก่อน, ข้อแนะนำในการเก็บรักษา, ชื่อผู้ผลิต ผู้จัดจำหน่าย หรือเครื่องหมายการค้า และสถานที่ตั้ง",
                  "เก็บในห้องแช่เย็นที่ควบคุมอุณหภูมิศูนย์กลาง ≤7 °C",
                  "มีระบบควบคุมไม่ให้เกิดหยดน้ำจากการควบแน่นของไอน้ำสัมผัสกับซาก"
                ]
              }
            ]
          },
          {
            "sub": "การขนส่ง",
            "body": [
              {
                "bullets": [
                  "พาหนะต้องควบคุมอุณหภูมิศูนย์กลางเนื้อให้ ≤7 °C ตลอดเวลา",
                  "สุกร: ซาก เนื้อ ผลผลิตไม่สัมผัสพื้นหรือผนังของพาหนะ และต้องป้องกันไม่ให้ส่วนห่อหุ้มชิ้นเนื้อฉีกขาด",
                  "สัตว์ปีก โค และกระบือ: เคลื่อนย้ายด้วยความระมัดระวังเพื่อป้องกันภาชนะบรรจุแตกหักเสียหาย",
                  "ประตูรถบรรทุกหรือตู้เก็บ (container) ต้องปิดสนิท",
                  "ใส่กุญแจ มัดด้วยลวด หรือวัสดุอื่นที่แสดงว่าไม่มีการเปิดขณะขนส่ง ในทางปฏิบัติใช้ plastic tag ที่เปิดได้ครั้งเดียวแล้วขาด ไม่ใช้แม่กุญแจที่เปิดปิดได้หลายครั้ง และเปิดอีกทีที่ปลายทาง"
                ]
              }
            ]
          }
        ]
      },
      {
        "heading": "แผนผังโรงฆ่าสัตว์ปีก: ลำดับขั้นและโซน",
        "source": "Slaughterhouse p.36 (มกษ. 9008-2549); บันทึกคาบ 4 พ.ย. 2569 [139:00-142:59]",
        "body": [
          {
            "sub": "ลำดับในแผนผัง",
            "body": [
              {
                "bullets": [
                  {
                    "label": "คอกพักสัตว์ปีก",
                    "value": "รับสัตว์ปีกเข้าคอกพัก, ตรวจสัตว์ปีกก่อนเข้าฆ่า"
                  },
                  {
                    "label": "พื้นที่ผลิตส่วนไม่สะอาด",
                    "value": "ทำให้สลบ, นำเลือดออกโดยการเชือดคอ, ล้าง, ลวก ถอนขนออก, (แยกหัวออก ตัดแข้ง), เปิดท้อง แยกเครื่องในออก, ตรวจซากสัตว์ปีกและเครื่องใน, ล้าง"
                  },
                  {
                    "label": "พื้นที่ผลิตส่วนสะอาด",
                    "value": "ลดอุณหภูมิ, ตัดแต่ง ชั่งน้ำหนัก เกรดเนื้อ, บรรจุ ขนส่งซาก เนื้อ และผลผลิตสัตว์ปีก"
                  }
                ]
              }
            ]
          },
          {
            "callout": "ในแผนผังสัตว์ปีก การเปิดท้องและแยกเครื่องในอยู่ในส่วนไม่สะอาด และโซนสะอาดเริ่มที่การลดอุณหภูมิ ส่วนแผนผังสุกรเริ่มโซนสะอาดที่ตัดหัว",
            "kind": "tip"
          },
          {
            "bullets": [
              "สัตว์ปีกไม่เรียกว่าคอกพัก เรียกว่า ลานพัก ไก่มาในลังหรือ module ซ้อนบนรถ รถถอยเข้าทั้งคัน มีพัดลม อาจมีสเปรย์น้ำ และต้องอยู่ในร่ม",
              "ตรวจไก่ก่อนฆ่ารายตัวไม่ได้ ใช้การสุ่มที่หัว กลาง ท้ายรถ จุดละ 1 กล่อง",
              "จุดแขวนบน shackle เป็นจุดตรวจเพิ่ม เพราะเห็นไก่รายตัว"
            ]
          }
        ]
      },
      {
        "heading": "โรงฆ่าสัตว์ปีก: รับสัตว์ ทำให้สลบ และเชือดคอ",
        "source": "Slaughterhouse p.37, 39; บันทึกคาบ 4 พ.ย. 2569 [142:00-145:59], [147:00-149:59]",
        "body": [
          {
            "sub": "รับสัตว์ปีกมีชีวิต",
            "body": [
              {
                "bullets": [
                  "อดอาหาร ≥1 ชั่วโมงก่อนขนส่ง และสัตว์ปีกมาถึงก่อนฆ่า ≥30 นาที (อ้างตาม มกษ. ข้อกำหนดของกรมปศุสัตว์ไม่บังคับ 30 นาที ให้พักตามความเหมาะสม ช่วงรอรถเข้าลานพัก 15-20 นาทีนับเป็นการพัก)",
                  "ขนสัตว์เจ็บป่วยแยกกับสัตว์ปกติ",
                  "บริเวณที่พักยานพาหนะมีหลังคากันแดดและฝน มีระบบระบายอากาศที่ดี อุณหภูมิเหมาะสม",
                  "ตรวจสัตว์ปีกก่อนเข้าฆ่า: ตรวจหาสัตว์ปีกป่วยหรือสงสัย และสัตว์ปีกบาดเจ็บรุนแรง"
                ]
              }
            ]
          },
          {
            "sub": "ทำให้สลบและเชือดคอ",
            "body": [
              {
                "bullets": [
                  "แขวนขึ้น shackle และผ่านอุปกรณ์รองอกไก่ (breast comforter) ซึ่งรองอกให้ไก่สบาย ยืดคอ ไม่ดิ้น",
                  "ระยะเวลาตั้งแต่แขวนขึ้น shackle ถึง stunner ≤20 วินาที",
                  "จุดแขวนไก่ใช้แสงไม่มาก ปกติใช้แสงสีม่วง",
                  "ทำให้สลบด้วยไฟฟ้า: high voltage stunning (~150 V, 100 mA/ตัว)",
                  "เชือดด้านหน้าคอ บริเวณใต้ขากรรไกรล่าง ตัดหลอดเลือดแดงใหญ่ เลือดดำใหญ่ หลอดลม และหลอดอาหาร",
                  "ปล่อยเลือดให้ไหลออก ≥2 นาที"
                ]
              }
            ]
          },
          {
            "sub": "การปรับ water bath stunner",
            "body": [
              {
                "bullets": [
                  "ต้องคำนวณจำนวนไก่ที่จุ่มพร้อมกัน เพราะไก่ 1 ตัวคือความต้านทานค่าหนึ่ง",
                  "ต้องแขวนไก่เต็มราว ถ้าขาด ไก่แต่ละตัวได้รับไฟมากขึ้นและเกิด over-stun",
                  "ไก่ตัวเล็กได้รับไฟมาก เกิดจุดเลือดออกที่กล้ามเนื้ออก หรือตาย",
                  "ระดับน้ำสูงจากปลายหัวประมาณ 2 นิ้ว เพื่อให้ไฟเข้าสมองโดยตรง ถ้าสูงเกินไป ไฟโดนกล้ามเนื้ออก เกิดจุดเลือดออกหรือรอยไหม้",
                  "น้ำในอ่างที่ดีที่สุดผสมน้ำเกลือประมาณ 1% (หลายที่ใช้น้ำปกติเพื่อจัดการง่าย)"
                ]
              }
            ]
          }
        ]
      },
      {
        "heading": "โรงฆ่าสัตว์ปีก: ลวก ถอนขน แยกหัว และตัดแข้ง",
        "source": "Slaughterhouse p.24, 38; บันทึกคาบ 4 พ.ย. 2569 [145:00-147:59]",
        "body": [
          {
            "bullets": [
              "ลวกในบ่อลวก (≥58 °C)",
              "ลำเลียงสู่การถอนขนโดยไม่ให้สัมผัสพื้น",
              "การถอนขนต้องเอาขนออกได้หมดหรือเกือบหมด โดยไม่ส่งผลต่อคุณภาพเนื้อ",
              "ถ้าลวกร้อนหรือนานเกินไป ซากสุก โดยเฉพาะบริเวณอก",
              "การแยกหัวใช้เครื่องดึงหัวหรือมีดตัดที่คอ",
              "การตัดแข้งใช้เลื่อยไฟฟ้าหรือมีด",
              "กรณีจำเป็น อนุโลมให้ไม่ต้องแยกหัวและแข้งออก เช่น ไก่ไหว้เจ้าขายทั้งตัว ไม่ตัดหัวและขา"
            ]
          },
          {
            "callout": "อุณหภูมิลวกสัตว์ปีกมี 2 ค่าที่พิมพ์ต่างกัน: หน้า 24 ให้ soft scald 50-53 °C และ hard scald 51-57 °C ส่วนหน้า 38 (มกษ.) พิมพ์ ≥58 °C ค่าต่ำสุด ≥50 °C ในหน้า 24 มาจากงานประเมินความเสี่ยงทางจุลชีววิทยา ส่วนมาตรฐานจริงใช้สูงกว่านั้น",
            "kind": "flag"
          }
        ]
      },
      {
        "heading": "โรงฆ่าสัตว์ปีก: แยกเครื่องใน ล้าง ลดอุณหภูมิ และตัดแต่ง",
        "source": "Slaughterhouse p.40-41; บันทึกคาบ 4 พ.ย. 2569 [150:00-153:59]",
        "body": [
          {
            "sub": "การแยกเครื่องใน",
            "body": [
              {
                "bullets": [
                  "ใช้อุปกรณ์หรือมีดเปิดช่องท้องส่วนล่างให้กว้างพอจะนำเครื่องในออกได้สะดวก ระวังไม่ให้กระเพาะ ลำไส้ และถุงน้ำดีฉีกขาด",
                  "จัดเรียงเครื่องในให้ตรงกับซากสัตว์ปีก และตรวจเครื่องในและซากหลังฆ่า",
                  "แยกส่วนที่บริโภคได้ (กึ๋น หัวใจ ไส้ ตับ) จากส่วนที่บริโภคไม่ได้ (ไต ปอด) สัตว์ปีกไม่แยกเครื่องในแดงกับขาว",
                  "ส่วนที่บริโภคได้ล้างและแช่เย็นให้อุณหภูมิศูนย์กลาง ≤7 °C ภายในเวลา ~1 ชั่วโมง"
                ]
              }
            ]
          },
          {
            "sub": "การทำความสะอาดซาก",
            "body": [
              {
                "bullets": [
                  "ล้างซากทั้งด้านนอกและด้านใน (inside-outside washing) เป็น CCP",
                  "critical limit คือปริมาตรน้ำต่อซากและแรงดันน้ำ ไก่ใช้น้ำไม่น้อยกว่า 1.5 ลิตรต่อตัว"
                ]
              }
            ]
          },
          {
            "sub": "การลดอุณหภูมิซาก",
            "body": [
              {
                "bullets": [
                  "ลดอุณหภูมิใจกลางซากให้ ≤7 °C ภายในเวลา ~1 ชั่วโมง",
                  "ใช้น้ำเย็นและน้ำแข็ง (immersion chilling system) แบบ counter-flow water หรือใช้อากาศเย็น (air chilling system)",
                  "พื้นไม่ดูดซับน้ำ ผนังและเพดานผิวเรียบ รักษาความเย็นได้",
                  "มีระบบควบคุมไม่ให้เกิดหยดน้ำจากการควบแน่นของไอน้ำสัมผัสกับซาก",
                  "สัตว์ปีกสูงจากพื้น ≥30 cm และไม่สัมผัสผนัง"
                ]
              }
            ]
          },
          {
            "sub": "การตัดแต่ง",
            "body": [
              {
                "bullets": [
                  "มีเครื่องมือ เครื่องจักร และอุปกรณ์ตัดแต่งพอเพียง",
                  "สายพานลำเลียงสะอาด ไม่มีน้ำเจิ่งนอง ล้างน้ำเลือดด้วยน้ำและปาดน้ำให้แห้งทันทีด้วยใบปาดน้ำ (ห้ามใช้ฟองน้ำ)",
                  "แบ่งชั้นคุณภาพเนื้อไก่ตาม มกษ. 6700-2548 และเนื้อเป็ดตาม มกษ. 6701-2548"
                ]
              }
            ]
          }
        ]
      },
      {
        "heading": "แผนผังโรงฆ่าโค กระบือ: ลำดับขั้นและโซน",
        "source": "Slaughterhouse p.43 (มกษ. 9019-2550); บันทึกคาบ 4 พ.ย. 2569 [154:00-155:59]",
        "body": [
          {
            "sub": "ลำดับในแผนผัง",
            "body": [
              {
                "bullets": [
                  {
                    "label": "คอกพัก",
                    "value": "รับโค กระบือเข้าคอกพัก, ตรวจสัตว์ก่อนเข้าฆ่า"
                  },
                  {
                    "label": "พื้นที่ผลิตส่วนไม่สะอาด",
                    "value": "ทำให้สลบ, นำเลือดออก, ล้าง, แยกหัวออก ตัดหาง และข้อขา (นำสมองไปทำลาย), แยกหนังออก"
                  },
                  {
                    "label": "พื้นที่ผลิตส่วนสะอาด",
                    "value": "เปิดท้อง แยกเครื่องในออก, ตรวจซากสัตว์, ล้าง, ผ่าซีกซาก (นำไขสันหลังไปทำลาย), ตัดแต่ง ชั่งน้ำหนัก เกรดเนื้อ (แบ่งชั้นคุณภาพเนื้อตาม มกษ. 6001-2547), บรรจุ ขนส่งซาก เนื้อ และผลผลิต"
                  }
                ]
              }
            ]
          },
          {
            "bullets": [
              "สมองและไขสันหลังของโคต้องทำลายเพราะ BSE ห้ามนำไปใช้เป็นอาหารสัตว์ และห้ามบริโภค",
              "การนำไขสันหลังออกของโคบังคับและต้องทำลาย ต่างจากสุกรที่เป็น optional"
            ]
          },
          {
            "callout": "ในแผนผังโค กระบือ โซนสะอาดเริ่มที่การเปิดท้องและแยกเครื่องในหลังแยกหนังออก ต่างจากสัตว์ปีกที่ลดอุณหภูมิเป็นขั้นแรกของโซนสะอาด",
            "kind": "tip"
          }
        ]
      },
      {
        "heading": "โรงฆ่าโค กระบือ: รับสัตว์ ทำให้สลบ และปล่อยเลือด",
        "source": "Slaughterhouse p.44; บันทึกคาบ 4 พ.ย. 2569 [155:00-157:59]",
        "body": [
          {
            "sub": "รับโค กระบือเข้าคอกพัก",
            "body": [
              {
                "bullets": [
                  "อดอาหาร ≥4 ชั่วโมงและ <24 ชั่วโมง และสัตว์มาถึงก่อนฆ่า ≥4 ชั่วโมง",
                  "ขนสัตว์เจ็บป่วยแยกกับสัตว์ปกติ",
                  "ระยะเวลาขนส่งไม่เกิน 8 ชั่วโมงติดต่อกัน และรวมไม่เกิน 36 ชั่วโมง",
                  "ตรวจโค กระบือก่อนเข้าฆ่า: ตรวจหาสัตว์ป่วยหรือสงสัย และสัตว์บาดเจ็บรุนแรง"
                ]
              }
            ]
          },
          {
            "sub": "ทำให้สลบและนำเลือดออก",
            "body": [
              {
                "bullets": [
                  "นำสัตว์เข้าซองบังคับ โดยมีประตูเปิดปิดหรืออุปกรณ์กั้น",
                  "ตรวจสอบเครื่องมือทำสลบ และใช้วิธีตามที่กำหนด",
                  "ในไทยใช้ captive bolt แบบใช้ลม จุดยิงของโค: ลากเส้นจากโคนหูด้านบนลงมาหางตาทั้ง 2 ฝั่ง แล้วยิงที่จุดตรงกลาง",
                  "ถ้าเชือดโดยไม่ทำให้สลบ ซองบังคับต้องแน่นพอไม่ให้สัตว์ดิ้น",
                  "เชือดด้านหน้าคอ บริเวณใต้ขากรรไกรล่าง ตัดหลอดเลือดแดงใหญ่ เลือดดำใหญ่ หลอดลม และหลอดอาหาร",
                  "ปล่อยเลือดให้ไหลออกประมาณ 5-6 นาที"
                ]
              }
            ]
          }
        ]
      },
      {
        "heading": "โรงฆ่าโค กระบือ: แยกหัว ตัดหาง ข้อขา และเอาหนังออก",
        "source": "Slaughterhouse p.45; บันทึกคาบ 4 พ.ย. 2569 [157:00-159:59]",
        "body": [
          {
            "sub": "การแยกหัว",
            "body": [
              {
                "bullets": [
                  "แยกหัวออกตรงบริเวณกระดูกสันหลังส่วนคอข้อที่ 1",
                  "แยกสมองและนำไปทำลาย"
                ]
              }
            ]
          },
          {
            "sub": "การตัดหางและข้อขา",
            "body": [
              {
                "bullets": [
                  "ตัดหางตรงกระดูกหางข้อแรกและกระดูกสันหลังข้อสุดท้าย",
                  "ตัดแข้งขาหลังและแข้งขาหน้าที่ข้อขา",
                  "หากมีการแขวน ให้แขวนโค กระบือโดยใช้เหล็กถ่างขา (gambrel) หรือตะขอเกี่ยวเอ็นร้อยหวาย ตามมาตรฐานส่วนใหญ่แขวน gambrel อาจแยกข้างละอัน"
                ]
              }
            ]
          },
          {
            "sub": "การนำหนังออก",
            "body": [
              {
                "bullets": [
                  "เลาะหนังจากแนวกลางลำตัวส่วนอกและตัว แล้วไปที่ขาและแข้งทั้ง 4 ข้าง แล้วจึงถึงหลัง",
                  "คว้านแยกส่วนทวารหนัก และมัด ใช้ถุงครอบแล้วมัด หรือใช้อุปกรณ์อุด",
                  "มีมาตรการป้องกันการปนเปื้อนจากหนังสู่เนื้อ",
                  "หนังเป็นส่วนสกปรก แยกเข้าห้องหนังทันที"
                ]
              }
            ]
          }
        ]
      },
      {
        "heading": "โรงฆ่าโค กระบือ: เครื่องใน ผ่าซีก ลดอุณหภูมิ และตัดแต่ง",
        "source": "Slaughterhouse p.46-47; บันทึกคาบ 4 พ.ย. 2569 [159:00-161:59]",
        "body": [
          {
            "sub": "การแยกเครื่องใน การผ่าซีก และการล้าง",
            "body": [
              {
                "bullets": [
                  "ใช้อุปกรณ์หรือมีดเปิดจากด้านในช่องท้องลงถึงช่วงอก นำเครื่องในขาวออก",
                  "เปิดช่องอก นำเครื่องในแดงออก",
                  "จัดเรียงเครื่องในให้ตรงกับซากหรือมีเครื่องหมายแสดงให้ตรงกับซาก",
                  "ตรวจเครื่องในและซากหลังฆ่า",
                  "ใช้เลื่อยหรือมีดผ่าครึ่งซีกซากโดยผ่ากึ่งกลางกระดูกสันหลังเป็นเส้นตรง",
                  "นำไขสันหลังออกและนำไปทำลาย",
                  "ล้างทั่วทั้งซากเพื่อนำสิ่งสกปรกออก โคใช้น้ำเยอะกว่า"
                ]
              }
            ]
          },
          {
            "sub": "การลดอุณหภูมิซาก",
            "body": [
              {
                "bullets": [
                  "ลดอุณหภูมิใจกลางซากให้ ≤7 °C ภายใน 24 ชั่วโมง วิธีลดอุณหภูมิซากโคของแต่ละโรงไม่เหมือนกัน บางที่อยู่ในห้องเกิน 1 วัน",
                  "ห้องเย็นสะอาด ไม่มีเศษเนื้อหรือเลือดตกหล่น ไม่มีน้ำขัง",
                  "พื้นไม่ดูดซับน้ำ ผนังและเพดานผิวเรียบ รักษาความเย็นได้",
                  "มีระบบควบคุมไม่ให้เกิดหยดน้ำจากการควบแน่นของไอน้ำสัมผัสกับซาก",
                  "จัดเรียงซากให้มีช่องว่างระหว่างซาก และซากที่เข้าแช่ก่อนให้นำออกก่อน"
                ]
              }
            ]
          },
          {
            "sub": "การตัดแต่ง",
            "body": [
              {
                "bullets": [
                  "มีเครื่องมือ เครื่องจักร และอุปกรณ์ตัดแต่งพอเพียง",
                  "ตัดแต่งซากด้วยความรวดเร็วและทำในห้องที่ควบคุมอุณหภูมิ",
                  "สายพานลำเลียงสะอาด ไม่มีน้ำเจิ่งนอง ล้างน้ำเลือดด้วยน้ำและปาดน้ำให้แห้งทันทีด้วยใบปาดน้ำ (ห้ามใช้ฟองน้ำ)",
                  "แบ่งชั้นคุณภาพเนื้อโคตาม มกษ. 6001-2547 และเนื้อกระบือตาม มกษ. 6002-2547"
                ]
              }
            ]
          },
          {
            "callout": "ลำดับของโคต่างกันเล็กน้อยระหว่างสองหน้า: แผนผังหน้า 43 เรียง ตรวจซาก, ล้าง, ผ่าซีกซาก ส่วนหน้า 46 เรียงผ่าซีกซากก่อน แล้วจึงล้างทั่วทั้งซาก",
            "kind": "flag"
          }
        ]
      },
      {
        "heading": "แปลนพื้นโรงฆ่า",
        "source": "Slaughterhouse p.49-51; บันทึกคาบ 4 พ.ย. 2569 [161:00-162:59]",
        "body": [
          {
            "bullets": [
              "แปลนพื้นโรงฆ่าสัตว์ปีก: รถรับไก่เข้าด้านรับสัตว์ แล้วไล่ไปตามลำดับห้องทำให้สลบ ห้องลวกถอนขน ห้องล้างเครื่องใน และห้องเย็น",
              "แปลนโรงฆ่าสุกร (มีส่วนห้องเย็น) ตามมาตรฐานโครงการเนื้อสัตว์อนามัยของกรมปศุสัตว์ ขนาดกำลังการผลิตสด 400 ตัว/วัน ถือเป็นขนาดกลาง แปลนระบุส่วนสกปรกและส่วนสะอาด",
              "แปลนเครื่องจักรโรงฆ่าโค ขนาดกำลังการผลิต 10 ตัวต่อวัน โคในไทยไม่ได้เชือดมากและไม่ได้เชือดทุกวัน แปลนนี้ทำให้สลบแบบ manual ด้วย captive bolt"
            ]
          }
        ]
      }
    ]
  },

  // ─────────────────────────────────────────────────────────────
  'meat-ante-post-mortem': {
    "topic": "meat-ante-post-mortem",
    "title": "Antemortem & postmortem inspection",
    "lecturer": "สิรวิทย์ ภักดีพาณิชย์กิจ (SP)",
    "icon": "🔍",
    "summary": "การตรวจสัตว์ก่อนฆ่า (AM) และการตรวจซากหลังฆ่า (PM) ปี 2569: วัตถุประสงค์ ผลการตัดสิน เอกสารและสิ่งที่ดูใน AM การตรวจหัว เครื่องใน ซาก และต่อมน้ำเหลืองใน PM แนวทางของสัตว์ปีก การแยกรอยโรค acute กับ chronic และ localized กับ generalized ภาวะทางพยาธิวิทยาทั่วไป และเกณฑ์ตัดสินซากของโรคจากไวรัส แบคทีเรีย พยาธิ โปรโตซัว และปรสิตสัตว์ขาปล้อง",
    "sections": [
      {
        "heading": "วัตถุประสงค์และหลักทั่วไปของ meat inspection",
        "source": "Antemortem & Postmortem Inspection p.2-3, 14-16; บันทึกคาบ 11 พ.ย. 2569 [10:00-14:00], [50:00-56:00]",
        "body": [
          {
            "sub": "วัตถุประสงค์ของ meat inspection",
            "body": [
              {
                "bullets": [
                  "ให้แน่ใจว่าสัตว์ที่ถูกฆ่าเพื่อบริโภคเป็นสัตว์ที่ดูแข็งแรงและปกติทางสรีรวิทยา และแยกสัตว์ผิดปกติออก",
                  "ให้แน่ใจว่าเนื้อจากสัตว์ปลอดโรค เหมาะสำหรับการบริโภค และไม่เสี่ยงต่อสุขภาพมนุษย์ ทั้งอันตรายทางกายภาพ เคมี และชีวภาพ",
                  "ทำได้ด้วยขั้นตอน antemortem และ postmortem และการ dress ซากอย่างถูกสุขลักษณะให้ปนเปื้อนน้อยที่สุด",
                  "ถ้าทำ AM และ PM เหมาะสม จะลดการปนเปื้อนทั้งในระบบผลิตและต่อไปถึงผู้บริโภคให้น้อยที่สุดหรือไม่เกิดเลย"
                ]
              }
            ]
          },
          {
            "sub": "หลักทั่วไป: AM กับ PM",
            "body": [
              {
                "bullets": [
                  {
                    "label": "Antemortem (AM)",
                    "value": "ดู general behavior, nutritional status, cleanliness และอาการของโรคหรือความผิดปกติ ตรวจสัตว์มีชีวิตที่คอกพัก (สัตว์ปีกอยู่ที่ลานพัก)"
                  },
                  {
                    "label": "Postmortem (PM)",
                    "value": "ตัดสินซาก (carcass judgement) โดยดูว่ารอยโรคเป็น localized หรือ generalized และ acute หรือ chronic"
                  },
                  "AM เน้นแยกว่าสัตว์ตัวนั้นเข้าฆ่าได้หรือไม่ ไม่ต้องลงถึงขั้นแยกว่าเป็นโรคอะไร ส่วน PM เน้นการตัดสินซาก"
                ]
              }
            ]
          },
          {
            "sub": "Postmortem inspection",
            "body": [
              {
                "bullets": [
                  "Postmortem แปลว่า “หลังตาย” ในภาษาละติน",
                  "คือการตรวจซากและส่วนที่ใช้เป็นอาหารมนุษย์ ทำหลัง antemortem inspection และหลังสัตว์ถูกฆ่าแล้ว",
                  "ครอบคลุมตั้งแต่ขั้นทำให้สลบจนถึงขั้นที่ซากเข้าห้องเย็น ในทางปฏิบัติทำหลังนำเครื่องในออก เพื่อให้เห็นซาก เครื่องใน และหัวพร้อมกัน",
                  "จุดประสงค์: ปกป้องสาธารณสุขโดยให้ซากและส่วนที่เข้าสู่การค้า wholesome, not adulterated, และ properly marked, labeled & packaged",
                  "ซากหรือส่วนที่ไม่เหมาะสำหรับเป็นอาหารมนุษย์ต้องไม่เข้าสู่การค้า ตามระเบียบ ข้อกำหนด และประกาศ",
                  "เนื้อสดที่ยังไม่แปรรูปต้องไม่มีวัตถุเจือปนอาหาร ไม่ใช่แค่ไม่มีสารตกค้าง",
                  "ข้อมูลบนฉลากต้องตรงความจริง เช่น ถ้ามีเนื้อไก่ผสมในเนื้อหมูต้องระบุ",
                  "ซากที่ไม่เหมาะสมต้องถูกกันออกจากช่องทางจำหน่าย",
                  "มีหลักการสากลร่วมกัน ส่วนรายละเอียดต่างกันตามระเบียบของแต่ละประเทศ"
                ]
              }
            ]
          }
        ]
      },
      {
        "heading": "ผลการตัดสินหลัง AM และหลัง PM",
        "source": "Antemortem & Postmortem Inspection p.18; บันทึกคาบ 11 พ.ย. 2569 [4:00-10:00], [58:00-62:00]",
        "body": [
          {
            "sub": "หลัง AM (สัตว์ที่คอกพัก)",
            "body": [
              {
                "bullets": [
                  {
                    "label": "อนุญาตให้เข้าฆ่า",
                    "value": "สัตว์ไม่มีลักษณะผิดปกติ ไม่มีรอยโรค ไม่สงสัยว่าเป็นโรคระบาดหรือโรคที่ไม่เหมาะสมกับการใช้เป็นอาหาร ไม่มีสารเคมีตกค้างที่เป็นอันตรายต่อผู้บริโภค"
                  },
                  {
                    "label": "ไม่อนุญาตให้เข้าฆ่า",
                    "value": "ตรงข้ามกับข้อบน"
                  },
                  {
                    "label": "เข้าฆ่าฉุกเฉิน (emergency slaughter)",
                    "value": "สัตว์ได้รับบาดเจ็บ ต้องแน่ใจว่าไม่เกี่ยวกับการติดเชื้อหรือโรค ฆ่าเพื่อไม่ให้สัตว์ทุกข์ทรมานต่อ (สวัสดิภาพสัตว์)"
                  },
                  {
                    "label": "เข้าฆ่าท้ายสุด",
                    "value": "สัตว์ที่สงสัยว่าเป็นโรคที่ไม่ใช่โรคระบาดและไม่ใช่โรคที่ไม่เหมาะสมกับการใช้เป็นอาหาร ลดความเสี่ยงการปนเปื้อนในสายการผลิต และตรวจละเอียดได้โดยไม่รบกวนสายการผลิต"
                  },
                  "ภาพใหญ่เป็น 3 กรณี (เข้าได้, เข้าไม่ได้, เข้าอย่างมีเงื่อนไข) ภาพละเอียดเป็น 4 กรณี เพราะเงื่อนไขแตกเป็นฉุกเฉินกับท้ายสุด"
                ]
              }
            ]
          },
          {
            "sub": "หลัง PM (ซาก)",
            "body": [
              {
                "bullets": [
                  {
                    "label": "Approved (รับรองให้จำหน่าย)",
                    "value": "ซากปกติ ไม่เป็นโรค ไม่มีสารเคมี เหมาะสำหรับการใช้เป็นอาหาร"
                  },
                  {
                    "label": "Total condemn (ทำลายทิ้งทั้งซาก)",
                    "value": "มีรอยโรคที่กฎหมายห้าม หรือเป็นแบบ generalized หรือ systemic"
                  },
                  {
                    "label": "Partial condemn (ทำลายทิ้งบางส่วน)",
                    "value": "รอยโรคทั่วไปที่ไม่เข้าข่ายโรคระบาดหรือโรคที่ไม่เหมาะสมกับการบริโภค ตัดส่วนนั้นทิ้ง ที่เหลือใช้บริโภคได้ แต่อาจถูกลดเกรดหรือลดราคา (ตกลงกันระหว่างโรงฆ่ากับฟาร์ม) บางที่เรียกว่า reject"
                  },
                  {
                    "label": "ทำให้เหมาะสมก่อนบริโภค",
                    "value": "ในทางปฏิบัติแทบไม่ใช้ ส่วนใหญ่ไปเป็นอาหารสัตว์ ไม่ใช่อาหารคน"
                  }
                ]
              }
            ]
          },
          {
            "sub": "สิ่งที่ทำให้ตัดหรือทำลายซาก (condemnation) ได้",
            "body": [
              {
                "bullets": [
                  "ซากหรือส่วนของซากที่ผิดปกติหรือเป็นโรค",
                  "ซากหรือส่วนของซากที่เป็นภาวะที่อาจเป็นอันตรายต่อสุขภาพมนุษย์",
                  "ซากหรือส่วนของซากที่ผู้บริโภครังเกียจ (repulsive)"
                ]
              }
            ]
          }
        ]
      },
      {
        "heading": "AM: วัตถุประสงค์ ข้อมูลและเอกสาร",
        "source": "Antemortem & Postmortem Inspection p.4-5; บันทึกคาบ 11 พ.ย. 2569 [20:00-28:00]",
        "body": [
          {
            "sub": "วัตถุประสงค์หลักของ AM",
            "body": [
              {
                "bullets": [
                  "คัดกรองสัตว์ที่จะเข้าฆ่า (screen)",
                  "ให้แน่ใจว่าสัตว์ได้พักอย่างเหมาะสมและมีข้อมูลทางคลินิกพอจะตัดสินได้",
                  "ช่วยการวินิจฉัยโรคและการตัดสินซาก",
                  "ลดการปนเปื้อนบนพื้นที่ฆ่า โดยแยกสัตว์สกปรกและทำลายสัตว์ป่วยถ้าจำเป็น สัตว์ที่สกปรกมากอาบน้ำก่อนเข้าฆ่าได้",
                  "ให้สัตว์ที่บาดเจ็บหรือเจ็บปวดได้รับการฆ่าฉุกเฉินและได้รับการปฏิบัติอย่างมีมนุษยธรรม ที่มักเกิดจากการขนส่ง การจับขึ้นลงรถ หรือการต่อสู้กันในคอกพัก",
                  "ระบุสัตว์ป่วยที่ได้รับยาปฏิชีวนะ chemotherapeutic agents, insecticides และ pesticides"
                ]
              },
              "สารตกค้างในทางปฏิบัติแทบดูจากตัวสัตว์ไม่ได้ ต้องดูจากเอกสาร อาจเห็นอาการบางอย่างได้ เช่น สัตว์ได้สารเร่งเนื้อแดงปริมาณสูงอาจตัวสั่นยืนไม่ไหว แต่พบน้อย"
            ]
          },
          {
            "sub": "ข้อมูลที่ต้องบันทึก",
            "body": [
              {
                "bullets": [
                  "ชื่อเจ้าของ",
                  "Lot no., เวลามาถึง, ชนิด, เพศ",
                  "ประวัติโรคและการจัดการ",
                  "วันเวลาที่ตรวจ antemortem",
                  "อาการทางคลินิก, อุณหภูมิร่างกาย และเหตุผลที่สัตว์ถูกกักไว้",
                  "ลายเซ็นผู้ตรวจ"
                ]
              }
            ]
          },
          {
            "sub": "เอกสารที่มากับสัตว์",
            "body": [
              {
                "bullets": [
                  "ใบขนย้ายสัตว์ ต้องดำเนินการให้เสร็จภายใน 72 ชั่วโมงนับจากที่ขอ",
                  "ใบรับรองการตรวจสุขภาพสัตว์ ตรวจล่วงหน้าก่อนขนย้ายประมาณ 1 สัปดาห์ และแนบผลมาด้วยหรือส่งมาก่อน",
                  "แหล่งที่มา (ฟาร์ม), ชนิดและประเภทสัตว์ (เช่น สุกรพ่อแม่พันธุ์ปลด หรือสุกรขุน) และจำนวน ต้องตรงกันตั้งแต่ตอนออกจากฟาร์มจนถึงโรงฆ่า",
                  "ข้อมูลการจัดการในฟาร์ม ประวัติวัคซีน ประวัติการใช้ยา และระยะหยุดยา",
                  "เหตุผลที่ส่งเข้าฆ่า เช่น ถึงระยะเลี้ยงหรือน้ำหนัก, สุกรพ่อแม่พันธุ์ปลด, โคนมปลด",
                  "ผู้ตรวจโรคสัตว์เขียน report และเซ็นชื่อ มี checklist ให้นับว่าพบลักษณะแบบใดกี่ตัว"
                ]
              }
            ]
          }
        ]
      },
      {
        "heading": "AM: วิธีตรวจและเวลา",
        "source": "Antemortem & Postmortem Inspection p.6; บันทึกคาบ 11 พ.ย. 2569 [26:00-30:00]",
        "body": [
          {
            "bullets": [
              "ตรวจสัตว์ทั้งสองข้างของตัว ทั้งตอนพักนิ่งและตอนเคลื่อนไหว",
              "ตรวจภายใน 24 ชั่วโมงก่อนฆ่า ตรวจซ้ำถ้าการฆ่าถูกเลื่อนเกิน 1 วัน",
              "สัตว์ที่ฟกช้ำมากหรือกระดูกหักต้องฆ่าฉุกเฉิน",
              "สัตว์ที่มีอาการทางคลินิกของโรคต้องกักไว้ตรวจและตัดสิน ปฏิบัติเป็น “suspects” และแยกจากสัตว์ปกติ",
              "คอกพักต้องเหมาะกับสัตว์ และกว้างพอให้ผู้ตรวจเห็นสัตว์ชัดรอบตัว ทั้งซ้าย ขวา หน้า หลัง ทั้งตอนยืน นอน และเคลื่อนไหว",
              "วัดอุณหภูมิร่างกายถ้าเป็นไปได้ ไม่ต้องวัดทุกตัว วัดตัวที่ดูแปลก ถ้าสูงเกินเกณฑ์ที่กำหนดถือว่าผิดปกติ",
              "สัตว์ที่สงสัยโรคแยกไว้ในคอกกักต่างหากจากสัตว์ปกติ เพื่อเก็บตัวอย่างหรือสังเกตอาการเพิ่ม"
            ]
          },
          {
            "callout": "หน้า 6 พิมพ์ว่าตรวจภายใน 24 ชั่วโมงก่อนฆ่า ส่วนในคาบเรียนนับ 24 ชั่วโมงจากเวลาที่สัตว์ถึงโรงฆ่า ถ้าตรวจไม่ทันต้องเริ่มอดอาหารและตรวจใหม่ในอีกวัน เนื้อหาข้างบนตามสไลด์",
            "kind": "flag"
          }
        ]
      },
      {
        "heading": "AM: ความผิดปกติที่ดู 8 ข้อ",
        "source": "Antemortem & Postmortem Inspection p.7-11; บันทึกคาบ 11 พ.ย. 2569 [30:00-46:00]",
        "body": [
          "ดูร่วมกันได้พร้อมกัน ได้แก่ การหายใจ พฤติกรรม การเดิน ท่าทาง โครงสร้างและรูปร่าง สิ่งคัดหลั่งหรือสิ่งที่โผล่จากช่องเปิดของร่างกาย สี และกลิ่น",
          {
            "sub": "การหายใจและพฤติกรรม",
            "body": [
              {
                "bullets": [
                  "การหายใจ: ถ้ารูปแบบต่างจากปกติ ให้แยกเป็น suspect ต้องรู้อัตราการหายใจปกติของสัตว์ชนิดนั้นก่อน สัตว์เครียดมากอาจหายใจถี่ได้ จึงต้องดูหลายอย่างประกอบกัน",
                  "พฤติกรรมปกติ: สงบระดับหนึ่งแต่ระวังสิ่งรอบข้าง เมื่อคนเดินเข้าไปต้องมอง ไม่ใช่ไม่สนใจเลยหรือพุ่งเข้าใส่",
                  "พฤติกรรมผิดปกติ: พบอย่างน้อยหนึ่งอย่างต่อไปนี้ก็ถือว่าผิดปกติ ได้แก่ เดินเป็นวงกลม (circling), เดินหรือทรงตัวผิดปกติ, เอาหัวชนกำแพง, พุ่งชนสิ่งของและก้าวร้าว, ตาแสดงอาการเซื่องซึมและกังวล (dull & anxious)",
                  "ตาขุ่นอาจเกี่ยวกับโรคบางโรคของโค"
                ]
              }
            ]
          },
          {
            "sub": "การเดินและท่าทาง",
            "body": [
              {
                "bullets": [
                  "การเดินผิดปกติ สัมพันธ์กับความเจ็บที่ขา อก หรือท้อง หรือเป็นสัญญาณโรคทางระบบประสาท",
                  "ท่าทางผิดปกติ: ท้องเรียวขึ้น (tucked up abdomen) หรือยืนยืดหัวและเหยียดขา",
                  "สัตว์ที่นอนและหันหัวมาข้างลำตัวเรียก “Downer” ต้องจับด้วยความระมัดระวังเพื่อไม่ให้ทุกข์ทรมานเพิ่ม",
                  "โคที่เป็น downer ไม่อนุญาตให้เข้าฆ่า ต้องกักไว้ก่อน ถ้าเป็นการบาดเจ็บที่ไม่เกี่ยวกับการติดเชื้อ (ต้องตัดออกก่อน) อาจให้เข้าฆ่าฉุกเฉิน สุกรที่ไม่ลุกก็ต้องดูว่าเจ็บขาหรือไม่ ถ้าเจ็บขาอาจต้องฆ่าฉุกเฉิน"
                ]
              }
            ]
          },
          {
            "sub": "โครงสร้างและรูปร่าง",
            "body": [
              {
                "bullets": [
                  "ก้อนบวม (abscess), ข้อโต",
                  "สะดือบวม (hernia, omphalophlebitis) พบในสุกรกับโคเป็นหลัก",
                  "เต้านมโตและเจ็บ (mastitis)",
                  "ขากรรไกรโต (lumpy jaw, bottle jaw)",
                  "ท้องอืด (bloated abdomen)",
                  "ฝีในสุกรพบบ่อยที่คอ เพราะยาที่ฉีดไม่กระจายและร่างกายห่อหุ้มจนเป็นฝี อาจเกิดที่ขาหลังได้ บางครั้งมีเข็มค้าง สุกรที่ส่งมาด้วยฝีจากเข็มถูกตัดราคาหรือถูกปฏิเสธ",
                  "การป้องกัน: ฟาร์มนับเข็ม โดยเบิกและคืนเป็นกล่องให้ครบ ท้ายสายการผลิตมีเครื่องตรวจจับโลหะ (metal detector)"
                ]
              }
            ]
          },
          {
            "sub": "สิ่งคัดหลั่งและสิ่งที่โผล่จากช่องเปิด",
            "body": [
              {
                "bullets": [
                  "สิ่งคัดหลั่งจากจมูก, น้ำลายออกจากปากมากเกิน, รก (afterbirth)",
                  "สิ่งที่โผล่จากช่องคลอด ลำไส้ ทวารหนัก (prolapsed rectum), จากมดลูกและช่องคลอด (prolapsed uterus)",
                  "ก้อนงอกที่ตา และถ่ายเป็นเลือด",
                  "ปกติน้ำมูกใส น้ำลายไหลได้เล็กน้อย ต้องไม่เป็นหนองหรือเลือด ไม่เขียว เหลือง หรือข้น ไม่ถ่ายเหลวหรือเป็นเลือด และตาไม่ทะลักออก"
                ]
              }
            ]
          },
          {
            "sub": "สีและกลิ่น",
            "body": [
              {
                "bullets": [
                  "สีผิดปกติ: บริเวณสีดำหรือน้ำเงินเข้มบนผิวหนังหรือเต้านม (gangrene), บริเวณแดงบนผิวสีอ่อน (inflammation), บริเวณเหลืองหรือซีดบนเยื่อเมือก",
                  "สัตว์ที่ผิวสีเข้ม เช่น โคนมลายดำขาว ให้ดูเยื่อเมือกและเต้านมเป็นหลัก สุกรดูได้ทั้งตัว",
                  "ถ้าเยื่อบุซีดหรือเหลือง (ดีซ่าน) ที่ชัดมักเห็นที่คอกพักเลยและไม่ค่อยหลุดมา",
                  "กลิ่นผิดปกติตรวจพบยากในการตรวจ AM ประจำ ยกเว้นรุนแรง ได้แก่ กลิ่นฝี กลิ่นยา กลิ่นสาบ stinkweed และกลิ่นอะซิโตนของ ketosis"
                ]
              }
            ]
          }
        ]
      },
      {
        "heading": "AM ของสัตว์ปีก",
        "source": "Antemortem & Postmortem Inspection p.12-13; บันทึกคาบ 11 พ.ย. 2569 [44:00-50:00]",
        "body": [
          {
            "bullets": [
              "สัตว์ปีกอยู่ในลังหรือ liner จึงตรวจได้เพียงสภาพทั่วไปแบบผิวเผิน ตรวจหลังแขวนบน shackle และก่อนปล่อยเลือด",
              "ที่ลานพัก ลังไก่ซ้อนกันอยู่บนรถ ตรวจรายตัวไม่ได้ จึงสุ่มดู โดยเลือกที่หัว กลาง และท้ายรถ จุดละ 1 กล่อง ดูลักษณะภายนอก สิ่งคัดหลั่งจากตาและจมูก บริเวณก้น จุดเลือดออก และการบาดเจ็บที่ปีกหรือขา",
              "จุดแขวนไก่บน shackle มีไฟส่องสว่าง จึงดูรายตัวได้ ใช้เป็นจุดตรวจ AM อีกจุด",
              "ไก่วิ่งบนสายการผลิตเร็วมาก ถ้ากระบวนการทำให้สายช้าลงจะกระทบการผลิตมาก"
            ]
          },
          {
            "sub": "วัตถุประสงค์ของ AM ในสัตว์ปีก",
            "body": [
              {
                "bullets": [
                  "ดูสภาพทั่วไปของสัตว์ปีก",
                  "ตัดสินว่าโรคหรือภาวะนั้นต้องจัดการเป็นพิเศษหรือไม่",
                  "แยกสัตว์ปีกที่เป็นโรค เลื่อนการฆ่า หรือปรับความเร็วของสายการผลิต"
                ]
              }
            ]
          },
          {
            "sub": "การจัดการ",
            "body": [
              {
                "bullets": [
                  "อากาศเลวร้าย โดยเฉพาะฤดูหนาว สัตว์ปีกต้องฆ่าทันที ถ้าสัตว์โอเคและเข้าเชือดเลยได้ ยิ่งอยู่นานยิ่งเครียดจากอากาศ",
                  "ฤดูร้อนต้องคงการถ่ายเทอากาศในรถและบริเวณพัก เช่น พัดลมและสเปรย์น้ำ",
                  "ถ้าเป็นโรคที่ต้องรายงาน (AI, ND) ต้องแจ้งสัตวแพทย์และบันทึกข้อมูลที่เกี่ยวข้อง",
                  "บางโรคมีอาการคล้ายกันตอน AM จึงต้องแยกโรค (differential diagnosis) เช่น infectious bronchitis อาจสับสนกับ ND",
                  "ก่อนขึ้นรถที่ฟาร์มมีการตรวจโรคอยู่แล้ว ส่งตัวอย่างตรวจ เช่น สุกรต้องไม่เจอ ASF และ FMD ไก่ต้องไม่เจอ ND และ AI"
                ]
              }
            ]
          }
        ]
      },
      {
        "heading": "PM: วิธีตรวจ การจัดเรียงซาก และการสรุปผล",
        "source": "Antemortem & Postmortem Inspection p.16-17; บันทึกคาบ 11 พ.ย. 2569 [50:00-60:00], [78:00-80:00]",
        "body": [
          {
            "bullets": [
              "อวัยวะและส่วนของซากทั้งหมดต้องอยู่ด้วยกันและเทียบกันได้เพื่อตรวจ (เครื่องในแดง เครื่องในขาว หัว) หัวอาจมาทีหลังได้แต่ต้องแท็กย้อนกลับไปหาซากได้",
              "ทำให้เร็วที่สุดหลัง dressing เสร็จ เพื่อตรวจจับความผิดปกติ ก่อนที่ลักษณะจะเปลี่ยนไปตามเวลา",
              "ให้ข้อมูลที่จำเป็นต่อการประเมินทางวิทยาศาสตร์ของรอยโรคที่เกี่ยวกับ wholesomeness ของเนื้อ"
            ]
          },
          {
            "sub": "ขั้นตอนของการตรวจ",
            "body": [
              {
                "bullets": [
                  "Viewing, incision, palpation, olfaction",
                  "จำแนกรอยโรคเป็น acute กับ chronic",
                  "ระบุภาวะเป็น localized กับ generalized ร่วมกับขอบเขตของการเปลี่ยนแปลงทั่วระบบในอวัยวะอื่น",
                  "ประเมินความสำคัญของรอยโรคปฐมภูมิและรอยโรค systemic ที่ตับ ไต หัวใจ ม้าม และระบบน้ำเหลือง",
                  "ประสานข้อมูล AM และ PM ทั้งหมดเพื่อวินิจฉัยขั้นสุดท้าย",
                  "ส่งตัวอย่างไปห้องปฏิบัติการเพื่อสนับสนุนการวินิจฉัย"
                ]
              }
            ]
          },
          {
            "sub": "ในทางปฏิบัติ",
            "body": [
              {
                "bullets": [
                  "การดมกลิ่นทำได้ยากถ้ารอยโรคไม่รุนแรง",
                  "ถ้าสงสัย กรีดเปิดดู เช่น ต่อมน้ำเหลืองที่บวมผิดปกติ และคลำเนื้อสัมผัส ปอดที่เป็นก้อนหรือมีทรายข้างใน",
                  "ถ้าพบรอยโรคหลายจุด ควรระบุให้ได้ว่าจุดเริ่มต้นมาจากอวัยวะใด โดยใช้ความรู้จากวิชาอื่นร่วมกัน",
                  "พบความผิดปกติหรือสงสัยอาจหยุดสายการผลิต แล้วดึงซากออกมาตรวจเพิ่ม โรงมักมี protocol ว่าจะดึงซากออกมาตรวจเพิ่มทุกกี่ซากหรือทุกกี่นาที เช่น 1 ซากต่อทุก 100 ซาก"
                ]
              }
            ]
          }
        ]
      },
      {
        "heading": "จำแนกรอยโรค: acute กับ chronic และ localized กับ generalized",
        "source": "Antemortem & Postmortem Inspection p.19-22; บันทึกคาบ 11 พ.ย. 2569 [14:00-20:00], [58:00-66:00]",
        "body": [
          {
            "sub": "Acute",
            "body": [
              {
                "bullets": [
                  "รอยโรคเกิดภายในเวลาหลายวัน (ปกติ 3-5 วัน)",
                  "การอักเสบของอวัยวะหรือเนื้อเยื่อต่างๆ, ต่อมน้ำเหลืองโตและมีเลือดออก (enlarge hemorrhagic LN)",
                  "จุดเลือดออก (petechial hemorrhage) ที่เยื่อเมือก เยื่อ serous และอวัยวะต่างๆ ได้แก่ ตับ ไต หัวใจ ม้าม และระบบน้ำเหลือง",
                  "ระยะ acute ไปด้วยกับโรคแบบ generalized มักเอาชนะภูมิคุ้มกันของสัตว์และกลายเป็น generalized"
                ]
              }
            ]
          },
          {
            "sub": "Chronic",
            "body": [
              {
                "bullets": [
                  "รอยโรคเกิดนานเป็นสัปดาห์ เดือน หรือปี",
                  "การอักเสบที่มีเลือดคั่ง ถูกแทนด้วย adhesion, necrotic และ fibrotic tissue หรือฝี (abscess)",
                  "การตัดสินรุนแรงน้อยกว่า มักตัดส่วนที่เป็นออกโดยไม่ทำลายทั้งซาก",
                  "ถ้าเป็นเนื้อตายแบบ generalized ที่เกี่ยวกับการติดเชื้อก่อนหน้า ต้องทำลายทั้งซาก",
                  "แม้เป็นรอยโรคเรื้อรัง ถ้ากระจายทั่วร่างกายก็ยังเป็น total condemn"
                ]
              }
            ]
          },
          {
            "sub": "Localized",
            "body": [
              {
                "bullets": [
                  "รอยโรคถูกจำกัดด้วยกลไกป้องกันของสัตว์ให้อยู่ในบางบริเวณหรืออวัยวะ",
                  "อาจมีการเปลี่ยนแปลง systemic ตามมาได้ เช่น ดีซ่านจากตับติดเชื้อหรือ toxemia หลัง pyometra (ฝีในมดลูก)",
                  "เช่น เต้านมอักเสบอาจลามเป็น septicemia แล้วอวัยวะอื่นล้มเหลว จึงกลายเป็น systemic"
                ]
              }
            ]
          },
          {
            "sub": "Generalized",
            "body": [
              {
                "bullets": [
                  "กลไกป้องกันของสัตว์หยุดการลามของกระบวนการโรคผ่านระบบไหลเวียนเลือดหรือน้ำเหลืองไม่ได้ ต้องตรวจต่อมน้ำเหลืองของซาก",
                  "สัญญาณของโรค generalized: ต่อมน้ำเหลืองอักเสบทั่วไป รวมต่อมน้ำเหลืองของหัว เครื่องใน และส่วนใดของซาก",
                  "ข้ออักเสบ: บวม 2 ข้อขึ้นไปถือเป็น generalized (ไก่ 2 ขาถือเป็น generalized ข้างเดียวเป็น localized)",
                  "รอยโรคในอวัยวะต่างๆ รวมตับ ม้าม ไต และหัวใจ รอยโรคแบบเดียวกันในหลายอวัยวะถือเป็น generalized (เช่น ฝีที่ตับและไต)",
                  "ฝีหลายจุดในส่วนต่างๆ ของซาก รวมถึงกระดูกสันหลังของสัตว์เคี้ยวเอื้อง ถ้าฝีกระจายทั่วกระดูกสันหลังถือเป็น generalized ถ้าจุดเดียวเป็น localized"
                ]
              }
            ]
          },
          {
            "bullets": [
              "หลักข้อแรกที่ใช้ตัดสิน: ดูการกระจายของรอยโรคก่อน generalized หรือ systemic เป็น total condemn ถ้าเฉพาะจุดให้ดูว่าเกิดจากโรคอะไร ถ้าไม่เข้าข่ายโรคร้ายแรงเป็น partial condemn"
            ]
          }
        ]
      },
      {
        "heading": "ข้อกำหนดขั้นต่ำของ PM: การตรวจหัว",
        "source": "Antemortem & Postmortem Inspection p.23-25; บันทึกคาบ 11 พ.ย. 2569 [66:00-72:00]",
        "body": [
          {
            "sub": "ข้อกำหนดขั้นต่ำ (ตามแนวทางของ FAO)",
            "body": [
              {
                "bullets": [
                  {
                    "label": "โค ม้า แกะ แพะ สุกร",
                    "value": "หัว: ต่อมน้ำเหลือง, ลิ้น. เครื่องใน: ปอด หัวใจ ตับ ม้าม ทางเดินอาหาร ไต มดลูก. ซาก: ต่อมน้ำเหลือง"
                  },
                  {
                    "label": "สัตว์ปีก",
                    "value": "ซากและเครื่องใน"
                  },
                  "มาตรฐานแต่ละประเทศมีรายละเอียดต่างกัน สิ่งนี้เป็นข้อกำหนดขั้นต่ำสุดที่ต้องตรวจ"
                ]
              }
            ]
          },
          {
            "sub": "การตรวจหัว",
            "body": [
              {
                "bullets": [
                  "General: ดูผิวภายนอก ช่องปาก ช่องจมูก (ตา แก้ม จมูกต้องปกติ ไม่มีอะไรอุดตัน ไม่ปูดหรือบุ๋ม ไม่แดงหรือเหลือง)",
                  "ต่อมน้ำเหลือง: submaxillary, parotid, retropharyngeal ดูและกรีดเปิดด้วยการกรีดหลายรอยหรือฝานเป็นแผ่น",
                  "ลิ้น: ดูและคลำ ถ้ามีรอยโรค erosion ที่ลิ้น เช่น FMD ให้กรีดเปิดดู"
                ]
              }
            ]
          },
          {
            "sub": "การตรวจเพิ่มเพื่อหา Cysticercus",
            "body": [
              {
                "bullets": [
                  {
                    "label": "โคและลูกโคอายุเกิน 6 สัปดาห์",
                    "value": "ตรวจหา Cysticercus bovis ต้องดูกล้ามเนื้อบดเคี้ยว และกรีดอย่างน้อย 1 รอยในแนวขนานกับขากรรไกรล่างเข้าไปในกล้ามเนื้อบดเคี้ยวทั้งด้านนอกและด้านใน (masseter)"
                  },
                  {
                    "label": "สุกร",
                    "value": "ตรวจหา Cysticercus cellulosae ต้องกรีดกล้ามเนื้อบดเคี้ยวด้านนอก กล้ามเนื้อท้องและกระบังลม และโคนลิ้นของสุกรทุกตัว ส่วนปลายลิ้นให้ดูและคลำ"
                  },
                  "ตำแหน่งที่ดู 4 จุดคือ ลิ้น, masseter, หัวใจ, กระบังลม โคเน้น masseter ส่วนสุกรเน้นลิ้น"
                ]
              }
            ]
          }
        ]
      },
      {
        "heading": "PM: การตรวจเครื่องใน",
        "source": "Antemortem & Postmortem Inspection p.26-29; บันทึกคาบ 11 พ.ย. 2569 [70:00-80:00]",
        "body": [
          {
            "sub": "ปอดและต่อมน้ำเหลือง",
            "body": [
              {
                "bullets": [
                  "ปอด: ดูและคลำ (ยกเว้นแกะและแพะ) เปิด bronchi ด้วยการกรีดตามขวางผ่าน diaphragmatic lobes",
                  "โค: เปิด larynx, trachea และ main bronchi ตลอดความยาว",
                  "ต่อมน้ำเหลือง bronchial (tracheobronchial) และ mediastinal: ดูและกรีดเปิด (ในลูกโคอายุไม่เกิน 6 สัปดาห์ดูอย่างเดียว)",
                  "ดูเนื้อสัมผัสและสีของปอด คลำแต่ละ lobe เกณฑ์การให้คะแนนของปอดต่างกันตามแหล่ง",
                  "ถ้าปล่อยเลือดไม่ดีหรือสำลัก จะเห็นรอยโรคที่ปอด"
                ]
              }
            ]
          },
          {
            "sub": "หัวใจ",
            "body": [
              {
                "bullets": [
                  "ดูและสังเกตหน้าตัดหลังเอา pericardium ออก",
                  "ของเหลวในถุงเยื่อหุ้มหัวใจมีได้เล็กน้อยและต้องใส ไม่มีเลือดหรือหนอง เยื่อไม่หนาไม่ขุ่น",
                  "โคและลูกโคอายุเกิน 6 สัปดาห์ทุกตัว: กรีดอย่างน้อย 1 รอยจาก base ถึง apex เพื่อตรวจหา C. bovis ลูกโคจากพื้นที่ที่มีโรคประจำถิ่นตรวจทุกตัว",
                  "สุกรจากพื้นที่เสี่ยง C. cellulosae: เปิดและกรีดลึกเข้าไปใน septum"
                ]
              }
            ]
          },
          {
            "sub": "ตับ ม้าม ทางเดินอาหาร ไต มดลูก",
            "body": [
              {
                "bullets": [
                  "ตับและถุงน้ำดี: ดูและคลำทั้งผิว (ทั้งสองด้าน) เปิดท่อน้ำดีใหญ่",
                  "โคอายุเกิน 6 สัปดาห์: กรีดเปิดตับตามสมควรเพื่อหาพยาธิใบไม้ตับ แกะและสุกรกรีดหาปรสิต",
                  "ต่อมน้ำเหลือง portal (hepatic): ดูและกรีดเปิด",
                  "ม้าม: คลำ ขอบต้องคม ถ้าขอบไม่คมแสดงว่าบวมอักเสบ ต้องไม่มีจุดเลือดออกหรือแผ่นขาว",
                  "ทางเดินอาหาร: ดูอย่างเดียวในลูกโคอายุไม่เกิน 6 สัปดาห์ ผนังลำไส้ต้องไม่บวมหรือบาง ไม่มีจุดเนื้อตายหรือจุดเลือดออก",
                  "Mesenteric LN: ดูอย่างเดียวในลูกโคอายุไม่เกิน 6 สัปดาห์ และกรีดเปิดถ้าพบรอยโรคในต่อม submaxillary",
                  "ไต: ดูหลังเอา capsule ออก (enucleation) แล้วกรีดเปิดข้างใน",
                  "มดลูก (สัตว์โต): ดู"
                ]
              }
            ]
          }
        ]
      },
      {
        "heading": "PM: การตรวจซากและต่อมน้ำเหลืองของซาก",
        "source": "Antemortem & Postmortem Inspection p.30-33; บันทึกคาบ 11 พ.ย. 2569 [78:00-88:00]",
        "body": [
          {
            "sub": "การตรวจซาก",
            "body": [
              {
                "bullets": [
                  "ดูสัญญาณของโรคหรือความบกพร่อง: กล้ามเนื้อ กระดูกที่เห็น ข้อ และ tendon sheath",
                  "สิ่งที่ต้องใส่ใจ: body condition, ประสิทธิภาพการปล่อยเลือด, สี, สภาพเยื่อ serous (pleural และ peritoneum), กลิ่นผิดปกติ, ความสะอาด",
                  "ความสะอาดดูเพิ่มเพราะกระบวนการอาจทำให้ซากไม่สะอาด เช่น ไส้แตก พบบ่อยในไก่ ส่วนสุกรและโคพบน้อย",
                  "ดูได้ว่าปล่อยเลือดดีหรือไม่ แทงคอโดนหัวใจหรือเลือดคั่งในช่องอกหรือไม่ และสุกรขนาดสม่ำเสมอหรือไม่",
                  "สุกรตรวจหลังผ่าซีก เห็นกระดูกสันหลังและเนื้อสันใน ดูสีกล้ามเนื้อ จุดเลือดออก ความหนา กระดูกที่มีแคลเซียมเกาะหรือหักแตก",
                  "สุกรกระดูกสันหลังหักอาจมาจาก over-stun ของการทำให้สลบด้วยไฟฟ้าที่ตั้งค่าไฟสูงเกิน"
                ]
              }
            ]
          },
          {
            "sub": "ต่อมน้ำเหลืองของซาก",
            "body": [
              {
                "bullets": [
                  "Superficial inguinal (ตัวผู้): ดูและคลำ",
                  "Supramammary (ตัวเมีย): ดูและคลำ กรีดเปิดเมื่อเต้านมอยู่ในระยะให้นมหรือเป็น mastitis",
                  "External และ internal iliac (สุกรเป็น iliac): ดูและคลำ",
                  "Renal: ดูและคลำ (โคและสุกร) กรีดเปิดถ้าสงสัยโรค",
                  "Popliteal และ prefemoral: ดูและคลำ (เฉพาะแกะและแพะ)",
                  "ตำแหน่งต่อมน้ำเหลืองของซาก ได้แก่ ischiadic, sacral, lumbar, intercostal, superficial inguinal, external iliac, internal iliac, renal, sternal, lower cervical (prepectoral) และ cervical",
                  "ตำแหน่งต่อมน้ำเหลืองบนตัวโค ได้แก่ parotid, submandibular, retropharyngeal, prescapular, prefemoral และ supramammary",
                  "ปกติต่อมน้ำเหลืองไม่ควรโตจนเห็นบวมจากภายนอก และไม่เด่นชัดบนซาก"
                ]
              }
            ]
          },
          {
            "sub": "กรณีพิเศษ",
            "body": [
              {
                "bullets": [
                  "สัตว์ทุกชนิดที่สงสัยโรค systemic หรือ generalized, ให้ผลบวกต่อการทดสอบวัณโรค หรือพบรอยโรคคล้ายวัณโรคตอน PM",
                  "ต้องกรีดเปิดและตรวจต่อมน้ำเหลืองหลักของซาก: precrural, popliteal, anal, superficial inguinal, ischiatic, internal และ external iliac, lumbar, renal, sternal, prepectoral, prescapular และ atlantal รวมถึงต่อมน้ำเหลืองของหัวและเครื่องใน",
                  "ในไทยสัตว์ที่เป็น TB ไม่ควรมาถึงโรงฆ่า และถ้าสงสัยวัณโรคไม่ให้เปิดซาก"
                ]
              }
            ]
          }
        ]
      },
      {
        "heading": "PM ของสัตว์ปีก: วิธีตรวจ",
        "source": "Antemortem & Postmortem Inspection p.34-36; บันทึกคาบ 11 พ.ย. 2569 [54:00-58:00], [86:00-92:00]",
        "body": [
          {
            "bullets": [
              "ใช้การดู คลำ และดมกลิ่น สังเกตสี รูปร่าง และความแน่นของอวัยวะและเนื้อเยื่อ ทีละอย่างหรือรวมกัน",
              "สีซากสัตว์ปีกขึ้นกับอายุ เพศ อาหาร และอุณหภูมิการลวก",
              "แขวนซากที่ 2 หรือ 3 จุดตามชนิดของสัตว์ปีก",
              "ต้องเปิดให้เห็นทางเดินอาหาร ตับ ม้าม หัวใจ (เครื่องใน) เพื่อดูและคลำ",
              "รอยโรคภายนอกได้แก่ ไซนัสบวม สิ่งคัดหลั่งจากจมูกและตา (ถ้ามีหัว) รอยโรคที่ผิวหนัง ข้อบวม",
              "เวลาตรวจซากและเครื่องในต่อ 1 ตัวอย่างมากไม่เกิน 3 วินาที ต้องคัดกรองให้ได้"
            ]
          },
          {
            "sub": "ลำดับ 5 ขั้นตอนระหว่างตรวจ",
            "body": [
              {
                "bullets": [
                  "ดูสภาพโดยรวมของซาก",
                  "ดูข้อ hock ที่เห็น",
                  "ดูผิวด้านใน",
                  "ตรวจเครื่องใน",
                  "ดูผิวภายนอกของซาก"
                ]
              }
            ]
          },
          {
            "bullets": [
              "ซากแขวนบนสายการผลิตโดยมีแผ่นรองด้านหลัง (กระจกหรือสแตนเลส) เพื่อให้เห็นด้านหน้าและด้านหลังพร้อมกัน เครื่องในห้อยอยู่ข้างๆ หรือห้อยออกมาจากทวารร่วม",
              "ปกติมี 2 ถึง 3 จุดตรวจ"
            ]
          }
        ]
      },
      {
        "heading": "PM ของสัตว์ปีก: สภาพโดยรวม ข้อ hock และผิวด้านใน",
        "source": "Antemortem & Postmortem Inspection p.37-41; บันทึกคาบ 11 พ.ย. 2569 [90:00-96:00]",
        "body": [
          {
            "sub": "สภาพโดยรวมของซาก",
            "body": [
              {
                "bullets": [
                  "หาหลักฐานของสภาวะทางสรีรวิทยาผิดปกติที่ชี้ถึง septicemia หรือ toxemia คือการเปลี่ยนแปลงทั่วระบบที่เกิดจากแบคทีเรียหรือสารพิษในเลือด",
                  "ผิวหรือเนื้อสีแดงเข้มผิดปกติ ซีด หรือน้ำเงิน",
                  "ผิวแห้ง (dehydration)",
                  "รูปร่างหดแห้ง (muscle wasting)",
                  "keel bone ยื่นออกมาใต้ผิวหนังระหว่างกล้ามเนื้ออก",
                  "ซากที่มีหลักฐานของ septicemia หรือ toxemia หรือสภาวะทางสรีรวิทยาผิดปกติ ให้ “CONDEMNED”",
                  "ถ้าพบแค่ผิวหรือเนื้อสีเข้ม ซากเล็ก หรือขาดน้ำเล็กน้อย และส่วนอื่นรวมเครื่องในปกติ ไม่ถือว่าเป็น septicemia หรือ toxemia ส่วนผิวหรือเนื้อสีเข้มที่ไม่เกี่ยวกับการติดเชื้อให้ตัดส่วนนั้นทิ้งและรับรองส่วนที่เหลือ",
                  "ปกติซากสีชมพูอ่อนถึงชมพูขาว ผิวไม่แห้ง กล้ามเนื้ออกเต็ม"
                ]
              }
            ]
          },
          {
            "sub": "ข้อ hock",
            "body": [
              {
                "bullets": [
                  "ดูการอักเสบ exudate หรือการบวมที่ชี้ถึง synovitis (การอักเสบของข้อ hock)",
                  "ถ้าข้อบวม แยกซากออกมา กรีดเปิดข้อ ถ้าเจอ exudate แสดงว่าข้ออักเสบ",
                  "ข้ออักเสบ 2 ข้างคือ systemic ทำลายทั้งตัว ข้างเดียวคือ downgrade ตัดข้างที่อักเสบทิ้ง ส่วนที่เหลือจำหน่ายได้ในอีกเกรดหนึ่ง",
                  "อวัยวะหรือส่วนของซากที่ได้รับผลจากกระบวนการอักเสบให้ “CONDEMNED”"
                ]
              }
            ]
          },
          {
            "sub": "ผิวด้านในของซาก",
            "body": [
              {
                "bullets": [
                  "ผิวเหลืองแข็งเป็นสะเก็ดระหว่างผิวหนังกับเนื้อเยื่อใต้ผิวหนังของ flap ชี้ถึงกระบวนการอักเสบ",
                  "exudate ใน air sac หรือ air sac ขุ่น ชี้ถึง airsacculitis ปกติ air sac ใส บาง ของเหลวเล็กน้อยต้องใส ไม่มีเลือดหรือหนอง",
                  "ก้อนเนื้อหรือเนื้อเยื่อผิดปกติ ชี้ถึงเนื้องอก (tumors)",
                  "ไตบวม แดง เลือดคั่ง ชี้ถึงการติดเชื้อ septicemia หรือ toxemia",
                  "ซากที่ air sac มีการอักเสบกว้างขวาง (airsacculitis) ให้ “CONDEMNED”",
                  "อวัยวะหรือส่วนของซากที่ได้รับผลจากเนื้องอกให้ “CONDEMNED”",
                  "airsacculitis มักลามไปเยื่อหุ้มหัวใจและช่องท้อง เป็น systemic จึงมักทำลายทั้งซาก ถ้าจุดเดียวเป็น partial condemn ถ้ากระจายทั่วเป็น total"
                ]
              }
            ]
          }
        ]
      },
      {
        "heading": "PM ของสัตว์ปีก: เครื่องใน ผิวภายนอก และซากที่ต้อง condemn",
        "source": "Antemortem & Postmortem Inspection p.42-45; บันทึกคาบ 11 พ.ย. 2569 [92:00-100:00]",
        "body": [
          {
            "sub": "เครื่องใน",
            "body": [
              {
                "bullets": [
                  "ม้ามหรือตับโตมากหรือเป็นด่าง (mottling) อาจชี้ถึง leukosis",
                  "exudate สีเหลืองหรือซีดที่หัวใจและปอด อาจชี้ถึง airsacculitis",
                  "เลือดออก เลือดคั่ง และบวมของเครื่องใน (รวมลำไส้) อาจชี้ถึง septicemia หรือ toxemia"
                ]
              }
            ]
          },
          {
            "sub": "ผิวภายนอกของซาก",
            "body": [
              {
                "bullets": [
                  "รอยโรคที่ผิวสีเหลืองเป็นสะเก็ดแข็ง ชี้ถึงกระบวนการอักเสบ (ที่อกไก่คือ breast blister จากการนอนเอาอกถูพื้น พบเมื่อโครงสร้างขาโตไม่ทันกล้ามเนื้ออก ถ้าไม่ได้กระจายทั่วตัว ตัดส่วนนั้นทิ้งเป็น partial condemn)",
                  "ผอมแห้ง keel bone เด่น ผิวและกล้ามเนื้อสีเข้ม ชี้ถึง septicemia หรือ toxemia (ไม่นับไก่พื้นเมืองที่ผิวหรือเนื้อสีเข้มตามพันธุ์)",
                  "รอยโรคที่ผิวเช่น keratoacanthoma หรือ leukosis แบบ dermal",
                  "กล้ามเนื้ออกขาวหรือดูสุก ชี้ถึง overscald",
                  "ผิวบนซากและคอสีแดงเชอร์รี่ถึงม่วง ชี้ถึงซากที่ตายก่อนหรือไก่ที่ปล่อยเลือดไม่ดี (ปล่อยเลือดไม่ดีหรือดิ้นมาก ผิวคอและปีกสีเข้มเพราะเลือดคั่ง ลดคุณภาพซาก ถ้ามากถูกลดเกรดและอาจเข้าแปรรูปไม่ได้)"
                ]
              }
            ]
          },
          {
            "sub": "ซากที่ให้ “CONDEMNED”",
            "body": [
              {
                "bullets": [
                  "อวัยวะหรือส่วนของซากที่ได้รับผลจากกระบวนการอักเสบ",
                  "ซากที่มีหลักฐานของ septicemia หรือ toxemia หรือสภาวะสรีรวิทยาผิดปกติ",
                  "ซากที่เป็น avian leukosis complex ทุกรูปแบบ",
                  "ซากที่ overscald: ต้อง total condemn เพราะเนื้อสัตว์ที่ออกจากโรงต้องยังดิบ ไม่ผ่านการทำให้สุก",
                  "ซากที่มีหลักฐานว่าตายจากสาเหตุอื่นที่ไม่ใช่การฆ่า: total condemn เพราะไม่รู้สาเหตุการตาย และขัดกับหลักฮาลาลที่สัตว์ต้องตายระหว่างถูกเชือดคอ"
                ]
              }
            ]
          }
        ]
      },
      {
        "heading": "ภาวะทางพยาธิวิทยาทั่วไป: fever และ septicemia",
        "source": "Antemortem & Postmortem Inspection p.46-48; บันทึกคาบ 11 พ.ย. 2569 [100:00-106:00]",
        "body": [
          {
            "sub": "รายการภาวะที่ต้องรู้",
            "body": [
              {
                "bullets": [
                  "Fever, Septicemia",
                  "Pigmentation (melanosis, icterus)",
                  "Abscess, Emaciation, Edema",
                  "Tumors, Calcification",
                  "Abnormal odors",
                  "Hemorrhage และ hematoma",
                  "Bruises"
                ]
              }
            ]
          },
          {
            "sub": "Fever",
            "body": [
              {
                "bullets": [
                  "อุณหภูมิร่างกายสูงผิดปกติ",
                  {
                    "label": "Septic fever",
                    "value": "การติดเชื้อจากไวรัส แบคทีเรีย สารพิษของแบคทีเรีย โปรโตซัว หรือรา"
                  },
                  {
                    "label": "Aseptic fever",
                    "value": "อาจเกิดจากเนื้อตายในกล้ามเนื้อจากการฉีดสารที่ทำให้เนื้อตายเข้ากล้าม, เนื้องอกโตเร็ว หรือการสลายของเนื้อเยื่อที่ถูกไฟไหม้, สารเคมีหรือการผ่าตัด, ปฏิกิริยา anaphylactic ของแอนติบอดีต่อแอนติเจนแปลกปลอม"
                  },
                  "ที่โรงฆ่า aseptic fever มักเป็นแค่สัตว์เครียด",
                  "ถ้าอุณหภูมิสูงเกินเกณฑ์ ไม่อนุญาตให้เข้าฆ่า ให้พักแล้ววัดซ้ำ ถ้าลดลงเพราะแค่เครียดร้อนก็เข้าฆ่าได้",
                  "Judgement: ทำลายซากถ้าไข้เกี่ยวกับการพบแบคทีเรียหรือสารพิษของแบคทีเรียในเลือด และ/หรือพบยาและสารต้านจุลชีพ",
                  "ถ้าสาเหตุคือแบคทีเรีย ต้องเก็บตัวอย่างเพาะแยกเชื้อยืนยัน ซึ่งต้องใช้เวลาและสัตว์ต้องรออยู่ในคอกพัก"
                ]
              }
            ]
          },
          {
            "sub": "Septicemia",
            "body": [
              {
                "bullets": [
                  "ภาวะที่เกิดจากแบคทีเรียก่อโรคและสารพิษที่เกี่ยวข้องในเลือด",
                  "วินิจฉัยแน่นอนได้ด้วยการแยกเชื้อก่อโรคจากกระแสเลือดเท่านั้น (ไม่ทำใน AM ประจำ)",
                  "ตัดสินจากผล AM และ PM: ซึม หายใจลำบากและเร็ว ตัวสั่น กล้ามเนื้อสั่น, อุณหภูมิร่างกายเปลี่ยน, เยื่อบุตา ปาก และช่องคลอดมีเลือดคั่งหรือจุดเลือดออก",
                  "PM: ม้ามโต ต่อมน้ำเหลืองโตบวมน้ำหรือเลือดออก ไต พื้นผิวหัวใจ เยื่อเมือก เยื่อ serous เนื้อเยื่อเกี่ยวพัน และ panniculus adiposis มีเลือดคั่งและจุดเลือดออก (petechial/ecchymotic)",
                  "Judgement: สัตว์ ซากสัตว์ และส่วนที่ตัดแยกที่เป็น septicemia ต้อง condemn",
                  "กรณีก้ำกึ่งควรตรวจทางแบคทีเรียวิทยาเท่าที่ทำได้"
                ]
              }
            ]
          }
        ]
      },
      {
        "heading": "Pigmentation, hemorrhage, hematoma และ bruises",
        "source": "Antemortem & Postmortem Inspection p.49-52; บันทึกคาบ 11 พ.ย. 2569 [104:00-110:00]",
        "body": [
          {
            "sub": "Melanosis",
            "body": [
              {
                "bullets": [
                  "การสะสมของ melanin ในอวัยวะต่างๆ ได้แก่ ไต หัวใจ ปอด ตับ และที่อื่น (เยื่อหุ้มสมอง ไขสันหลัง เนื้อเยื่อเกี่ยวพัน periosteum)",
                  "พบที่ต่อมน้ำเหลือง ผิวสุกร และมันท้อง/เนื้อเยื่อเต้านมของสุกรเพศเมีย (seedy belly/seedy cut)",
                  "ตับลูกโคมี melanin เป็นจุดหลายแห่ง (melanosis maculosa) พบบ่อยในลูกโคและหายไปหลังอายุ 1 ปี",
                  "Judgement: ซากที่เป็น melanosis กว้างขวาง condemn ถ้า localized ทำลายเฉพาะอวัยวะหรือส่วนที่เป็น"
                ]
              }
            ]
          },
          {
            "sub": "Icterus",
            "body": [
              {
                "bullets": [
                  "เกิดจากการสะสมผิดปกติของ bile pigment, bilirubin และ hemoglobin ในเลือด",
                  "สีเหลืองที่ผิวหนัง อวัยวะภายใน ตาขาว tendon กระดูกอ่อน หลอดเลือดแดง และผิวข้อ",
                  "เป็นสัญญาณของตับบกพร่องหรือท่อน้ำดีทำงานผิดปกติ จากโรค: pre-hepatic jaundice (babesiosis, anaplasmosis), hepatic jaundice (การติดเชื้อทั่วร่างกาย, สารเคมีหรือพืชเป็นพิษ), post-hepatic jaundice (เนื้องอก ก้อนนิ่ว พยาธิใบไม้)",
                  "AM: สัตว์ที่สงสัย icterus ปฏิบัติเป็น “suspects”",
                  "PM: ซากและเครื่องในที่เป็น hemolytic, toxic และ obstructive icterus ต้อง condemn"
                ]
              }
            ]
          },
          {
            "sub": "Hemorrhage และ hematoma",
            "body": [
              {
                "bullets": [
                  {
                    "label": "Hemorrhage",
                    "value": "สัมพันธ์กับกระดูกหัก ขาดวิตามิน C ความดันเลือดเพิ่มกะทันหันขณะหลอดเลือดอ่อนแอ การทำให้สลบด้วยกระแสไฟฟ้าไม่เหมาะสม (เลือดกระเซ็น, ไฟสูงเกินทำให้เกิดจุดเลือดออกในกล้ามเนื้อ) การขนส่งนาน และการได้รับความเครียดก่อนฆ่า"
                  },
                  {
                    "label": "Hematoma",
                    "value": "สัมพันธ์กับการบาดเจ็บ และความบกพร่องของการแข็งตัวของเลือด (พบน้อย)"
                  },
                  "Judgement: รับรองซากถ้าเลือดออกน้อยและเกิดจากสาเหตุทางกายภาพ แต่เนื้อเยื่อที่ได้รับผลต้องทำลาย",
                  "ทำลายซากถ้ามีเลือดออกมากหรือสัมพันธ์กับ septicemia"
                ]
              }
            ]
          },
          {
            "sub": "Bruises",
            "body": [
              {
                "bullets": [
                  "พบบ่อยทั้งตอน AM และ PM",
                  {
                    "label": "โค",
                    "value": "เกิดจากการขนส่งหรือการจับ พบที่สะโพก อก และไหล่"
                  },
                  {
                    "label": "สุกร",
                    "value": "ภายในสะโพกหลัง (ham)"
                  },
                  {
                    "label": "สัตว์ปีก",
                    "value": "เป็น localized หรือ generalized และมักเกี่ยวกับกระดูกหักหรือเอ็น ligament ฉีก"
                  },
                  "AM: สัตว์ที่ฟกช้ำปฏิบัติเป็น suspects ถ้าสัตว์เจ็บปวดทรมานให้เข้าฆ่าฉุกเฉิน",
                  "PM: ซากที่ฟกช้ำเฉพาะที่รับรองหลังตัดแต่ง ซากที่ฟกช้ำรับรองถ้าปฏิกิริยาของเนื้อเยื่อไม่ลามเกินต่อมน้ำเหลืองของบริเวณนั้น และต้องทำลายบริเวณที่ได้รับผล",
                  "เมื่อฟกช้ำสัมพันธ์กับการเปลี่ยนแปลง systemic และกล้ามเนื้อเสีย wholesomeness ให้ทำลายซาก"
                ]
              }
            ]
          }
        ]
      },
      {
        "heading": "Abscess, emaciation, edema, tumors, calcification และกลิ่นผิดปกติ",
        "source": "Antemortem & Postmortem Inspection p.53-58; บันทึกคาบ 11 พ.ย. 2569 [108:00-116:00]",
        "body": [
          {
            "sub": "Abscess",
            "body": [
              {
                "bullets": [
                  "การสะสมของหนองเฉพาะที่ที่แยกจากเนื้อเยื่อรอบข้างด้วยแคปซูลเส้นใย",
                  "ฝีตับ: Actinomyces pyogenes, Streptococcus spp. และ Staphylococcus spp.",
                  "ฝีปอด: Pasteurella spp. และ Actinomyces pyogenes",
                  "Judgement ขึ้นกับการพบฝีปฐมภูมิหรือทุติยภูมิในสัตว์",
                  "AM: สัตว์ที่เป็นฝีที่กระจายทางกระแสเลือด (pyemia) ถูก condemn",
                  "PM: ทำลายซากเมื่อฝีเกิดจากเชื้อก่อหนองเข้ากระแสเลือด อวัยวะในช่องท้อง กระดูกสันหลัง และกล้ามเนื้อ",
                  "ถ้า systemic หรือกระจายผ่านระบบหมุนเวียนโลหิตเป็น total condemn ถ้าเฉพาะที่เป็น partial"
                ]
              }
            ]
          },
          {
            "sub": "Emaciation",
            "body": [
              {
                "bullets": [
                  "สภาพที่สัตว์สูญเสียไขมันและเนื้อ ตามการเบื่ออาหาร การอดอาหาร และ cachexia",
                  "อาจสัมพันธ์กับโรคเรื้อรังและปรสิต: พยาธิตัวกลมในสุกร, fascioliasis ในโคและแกะ, swine erysipelas, neoplasms, tuberculosis, Johne's disease, caseous lymphadenitis, ฟันไม่ดี, ขาดอาหาร",
                  "AM: ผิวหนังย่นแห้งเหมือนหนัง ขนหยาบ กระดูกนูน ตาลึก",
                  "PM: ไขมันซากฝ่อ (ไขมันรอบหัวใจและไต) ไขมันเป็นน้ำ บวมน้ำ โลหิตจาง",
                  "Judgement: ซากและเครื่องในต้อง condemn ถ้าผอมเพราะโรคติดเชื้อเรื้อรัง และถ้าเจอที่คอกพักปกติไม่อนุญาตให้เข้าฆ่า"
                ]
              }
            ]
          },
          {
            "sub": "Edema",
            "body": [
              {
                "bullets": [
                  "การสะสมของเหลวเกินในช่องระหว่างเซลล์ (interstitial) รวมช่องลำตัว",
                  {
                    "label": "Localized",
                    "value": "ขาของโคบวมจากการนอนนาน (prolonged decubitus) เพราะเลือดดำไหลกลับถูกขวาง, การอักเสบหรือปฏิกิริยาภูมิแพ้"
                  },
                  {
                    "label": "Systemic/generalized",
                    "value": "ตามหลัง congestive heart failure, โปรตีนในเลือดต่ำ, ขาดสารอาหารรุนแรง, amyloidosis ของไตรุนแรง, ปรสิตในทางเดินอาหาร, โรคตับเรื้อรัง, สารพิษและเชื้อทำลาย vascular endothelium"
                  },
                  "Judgement: สัตว์ที่เป็น generalized edema อาจถูก condemn ตอน AM"
                ]
              }
            ]
          },
          {
            "sub": "Tumors/neoplasms",
            "body": [
              {
                "bullets": [
                  {
                    "label": "Benign",
                    "value": "โตช้า ไม่รุกราน มีขอบเขตชัดเจน"
                  },
                  {
                    "label": "Malignant",
                    "value": "โตเร็ว แทรกซึม และมักแพร่กระจาย (metastatic)"
                  },
                  "ที่พบบ่อยในการตรวจเนื้อโค: squamous cell carcinoma, lymphosarcoma, pheochromocytoma, mesothelioma",
                  "Judgement: ซากที่เป็น metastatic neoplasm ต้อง condemn, benign หลายก้อนในหลายอวัยวะ condemn, benign ที่มีขอบเขตชัดเจนรับรองได้"
                ]
              }
            ]
          },
          {
            "sub": "Calcification",
            "body": [
              {
                "bullets": [
                  "การสะสมเกลือแคลเซียมในเนื้อเยื่อที่ตายและเสื่อม",
                  "สาเหตุ: ปฏิกิริยาของร่างกายเพื่อจำกัดสิ่งแปลกปลอม, วิตามิน D เสริมเกิน, การติดเชื้อปรสิตและการติดเชื้อเรื้อรังหลายชนิด (เช่น tuberculosis, botryomycosis)",
                  "Judgement: อวัยวะของปรสิตที่มีแคลเซียมเกาะและหัวใจในแม่โคนมต้อง condemn"
                ]
              }
            ]
          },
          {
            "sub": "กลิ่นผิดปกติ",
            "body": [
              {
                "bullets": [
                  "อาจมาจากอาหารบางชนิด ยา ภาวะทางพยาธิวิทยา การดูดซับกลิ่นแรง และกลิ่นสาบของสัตว์เพศผู้",
                  "กลิ่นอะซิโตนหวานในโคที่เป็น ketosis (milk fever)",
                  "กลิ่นอุจจาระในสัตว์ท้องอืดและท้องผูก",
                  "ซากที่มีกลิ่นยา สารเคมี หรือสิ่งแปลกปลอมอื่นชัดเจนต้อง condemn",
                  "ซากที่มีกลิ่นสาบเพศ (sexual odor) ให้เก็บในห้องเย็นและทดสอบใหม่ ถ้ากลิ่นหาย รับรองได้ ถ้ายังมีกลิ่นหลัง 48 ชั่วโมงต้อง condemn",
                  "สุกรพ่อพันธุ์ปลดที่นำเข้าโรงฆ่าต้องแจ้งก่อนเพราะวัตถุประสงค์การแปรรูปต่างจากสุกรขุน การทดสอบกลิ่นทำโดยให้ความร้อนกับไขมันแล้วดมกลิ่น"
                ]
              }
            ]
          }
        ]
      },
      {
        "heading": "เกณฑ์ตัดสินซาก: โรคจากไวรัส",
        "source": "Antemortem & Postmortem Inspection p.59-63; บันทึกคาบ 11 พ.ย. 2569 [116:00-118:00]",
        "body": [
          "โรคร้ายแรงที่เข้า พ.ร.บ.โรคระบาดสัตว์และ พ.ร.บ.ควบคุมการฆ่าสัตว์ไม่ให้เข้าฆ่า ถ้าหลุดมาให้ condemn หลักง่ายๆ คือ systemic เป็น total condemn ถ้า localized แบบ chronic เป็น partial condemn แต่ต้องไม่ใช่โรคร้ายแรง",
          {
            "sub": "โรคของสัตว์เคี้ยวเอื้อง",
            "body": [
              {
                "bullets": [
                  {
                    "label": "Foot-and-mouth disease (FMD)",
                    "value": "AM: ห้ามฆ่า PM: ซากและเครื่องในต้อง condemn"
                  },
                  {
                    "label": "Vesicular stomatitis (VS)",
                    "value": "ซากที่มีการเปลี่ยนแปลงแบบ acute และรอยโรค systemic ต้อง condemn"
                  },
                  {
                    "label": "Malignant catarrhal fever (MCF)",
                    "value": "ถ้ามีไข้ ผอม และอาการ systemic ซากและเครื่องในต้อง condemn"
                  },
                  {
                    "label": "Lumpy skin disease",
                    "value": "ซากของสัตว์ที่ติดเชื้อแบบ acute generalized (ตอน AM) ร่วมกับไข้ ต้อง condemn"
                  },
                  {
                    "label": "Infectious bovine rhinotracheitis (IBR)",
                    "value": "รับรองซากได้ถ้าไม่มีสัญญาณของการติดเชื้อ acute และสภาพร่างกายดี"
                  },
                  {
                    "label": "Bovine viral diarrhea (BVD)",
                    "value": "ซากและเครื่องในของสัตว์ที่แสดงสัญญาณ generalized ของการติดเชื้อ acute (ตอน AM) ร่วมกับไข้และ/หรือผอม ต้อง condemn"
                  },
                  {
                    "label": "Bovine leukosis",
                    "value": "ซากของสัตว์ที่เป็น leukosis (lymphosarcoma) ต้อง condemn"
                  },
                  {
                    "label": "BSE (mad cow disease)",
                    "value": "ซากต้อง condemn (ในไทยยังไม่เคยมีรายงาน)"
                  }
                ]
              }
            ]
          },
          {
            "sub": "โรคของสุกร",
            "body": [
              {
                "bullets": [
                  {
                    "label": "African swine fever (ASF)",
                    "value": "AM: ห้ามฆ่า PM: ซากและเครื่องในต้อง condemn"
                  },
                  {
                    "label": "Hog cholera",
                    "value": "ซากต้อง condemn ถ้ารอยโรคที่ไตสัมพันธ์กับรอยโรคในต่อมน้ำเหลืองและอวัยวะอื่น"
                  },
                  {
                    "label": "Transmissible gastroenteritis (TGE)",
                    "value": "ซากและเครื่องในของสัตว์ที่มีอาการทางคลินิกและกล้ามเนื้อเสื่อมตอน PM ต้อง condemn"
                  }
                ]
              }
            ]
          },
          {
            "sub": "โรคของสัตว์ปีก",
            "body": [
              {
                "bullets": [
                  {
                    "label": "Infectious bronchitis (IB)",
                    "value": "AM: นกที่เป็นโรคปฏิบัติเป็น suspects PM: ซากที่มีอาการ acute ร่วมกับผอมต้อง condemn"
                  },
                  {
                    "label": "Laryngotracheitis (LT)",
                    "value": "AM: นกที่เป็นโรคปฏิบัติเป็น suspects PM: ซากต้อง condemn ถ้าภาวะ acute สัมพันธ์กับการเปลี่ยนแปลง systemic ทั่วไป"
                  }
                ]
              }
            ]
          }
        ]
      },
      {
        "heading": "เกณฑ์ตัดสินซาก: โรคจากแบคทีเรีย",
        "source": "Antemortem & Postmortem Inspection p.64-70; บันทึกคาบ 11 พ.ย. 2569 [116:00-124:00]",
        "body": [
          {
            "sub": "โรคที่ห้ามฆ่าหรือต้องทำลายทั้งซาก",
            "body": [
              {
                "bullets": [
                  {
                    "label": "Black quarter (Black leg)",
                    "value": "AM: ห้ามฆ่า PM: ซากและเครื่องในต้อง condemn"
                  },
                  {
                    "label": "Malignant edema",
                    "value": "ซากต้อง condemn"
                  },
                  {
                    "label": "Botulism",
                    "value": "condemn ทั้งซาก เพราะเป็นอันตรายต่อมนุษย์"
                  },
                  {
                    "label": "Tuberculosis",
                    "value": "AM: ไอแห้งเรื้อรังเป็นพักๆ ปอดอักเสบร่วม หายใจลำบาก ผอม ต่อมน้ำเหลืองผิวกายบวม ซากต้อง condemn (ห้ามเปิดซากด้วยซ้ำ)"
                  },
                  {
                    "label": "Brucellosis (contagious abortion, Bang's disease)",
                    "value": "ต้อง condemn ทั้งซาก"
                  },
                  {
                    "label": "Anthrax",
                    "value": "ต้อง condemn ทั้งซาก"
                  },
                  {
                    "label": "Hemorrhagic septicemia",
                    "value": "AM: ห้ามฆ่า PM: ซากและเครื่องในต้อง condemn"
                  },
                  {
                    "label": "Actinomycosis (lumpy jaw)",
                    "value": "ต้อง condemn ทั้งซาก"
                  },
                  {
                    "label": "Salmonellosis",
                    "value": "ซากที่เป็น salmonellosis ต้อง condemn"
                  },
                  {
                    "label": "Leptospirosis",
                    "value": "ซากที่เป็นแบบ acute ต้อง condemn"
                  },
                  {
                    "label": "Melioidosis",
                    "value": "ซากที่สงสัยหรือวินิจฉัยเบื้องต้นว่าเป็น melioidosis ต้อง condemn"
                  }
                ]
              }
            ]
          },
          {
            "sub": "โรคที่ตัดสินตามสภาพ",
            "body": [
              {
                "bullets": [
                  {
                    "label": "Johne's disease (bovine paratuberculosis)",
                    "value": "ซากที่มีบวมน้ำและผอม condemn รับรองได้เมื่อไม่มีสัญญาณ systemic"
                  },
                  {
                    "label": "Actinobacillosis",
                    "value": "condemn เมื่อมีรอยโรคอักเสบที่ active และลุกลามในต่อมน้ำเหลืองและเนื้อปอด"
                  },
                  {
                    "label": "Mastitis",
                    "value": "ซากและเครื่องในต้อง condemn ถ้า acute หรือ gangrenous mastitis ร่วมกับการเปลี่ยนแปลง systemic ถ้า localized ตัดเต้านมทิ้ง"
                  },
                  {
                    "label": "Metritis",
                    "value": "ซากที่เป็น acute metritis ต้อง condemn ถ้าสัมพันธ์กับ septicemia หรือ toxemia"
                  },
                  {
                    "label": "Pneumonia",
                    "value": "condemn ถ้ามีไข้และ septicemia หรือผอม"
                  },
                  {
                    "label": "Valvular endocarditis ในสุกร",
                    "value": "condemn ถ้า AM พบไข้และสภาพทรุด และ PM พบรอยโรค embolic ในอวัยวะ"
                  },
                  {
                    "label": "Swine erysipelas",
                    "value": "AM: acute ที่มี erythema หรือ diffuse cutaneous erysipelas condemn (ห้ามฆ่า) PM: รอยโรคผิวหนังหรือข้ออักเสบที่มีเนื้อตายหรือสัญญาณ systemic ต้อง condemn"
                  }
                ]
              }
            ]
          },
          {
            "sub": "Traumatic reticuloperitonitis (TRP, hardware disease)",
            "body": [
              {
                "bullets": [
                  "ซากและเครื่องในต้อง condemn ถ้าสัตว์เป็น acute diffuse peritonitis หรือ acute infectious pericarditis ที่สัมพันธ์กับ septicemia",
                  "ซากที่มี traumatic pericarditis ร่วมกับไข้ exudate สะสมมาก ความผิดปกติของการไหลเวียน การเสื่อมของอวัยวะ กลิ่นผิดปกติ",
                  "ซากที่เป็น chronic TRP และ/หรือ purulent pericarditis ร่วมกับ pleuritis ฝี และบวมน้ำที่ช่องอก",
                  "สัตว์ที่เป็นมักผอมทรุด และอักเสบทั้งหัวใจ ปอด ระบบทางเดินอาหาร"
                ]
              }
            ]
          },
          {
            "sub": "Chronic Respiratory Disease (CRD) ของสัตว์ปีก",
            "body": [
              {
                "bullets": [
                  "AM: นกที่เป็น airsacculitis ปฏิบัติเป็น suspects (หอบ)",
                  "PM: รอยโรค airsacculitis แบบ generalized และกว้างขวางต้อง condemn ทั้งซาก",
                  "รอยโรค localized: ทำลายส่วนที่เป็น ที่เหลือรับรองถ้าสภาพดีและไม่มีการลามเข้ากระดูก (ไม่พบจุลินทรีย์)",
                  "ถ้าพบเพียง pericarditis หรือ perihepatitis ตอน PM อาจรับรองซากถ้าส่วนอื่น wholesome"
                ]
              }
            ]
          }
        ]
      },
      {
        "heading": "เกณฑ์ตัดสินซาก: พยาธิ โปรโตซัว ปรสิตสัตว์ขาปล้อง และ PSE/DFD",
        "source": "Antemortem & Postmortem Inspection p.71-74; บันทึกคาบ 11 พ.ย. 2569 [120:00-126:00]",
        "body": [
          {
            "sub": "Helminths",
            "body": [
              {
                "bullets": [
                  {
                    "label": "Fascioliasis",
                    "value": "ซากของสัตว์ที่ติดเชื้อรุนแรงต้อง condemn ถ้าสัมพันธ์กับผอมหรือบวมน้ำ"
                  },
                  {
                    "label": "Cysticercosis",
                    "value": "ซากและเครื่องในของสัตว์ที่ติดเชื้อหนักต้อง condemn"
                  },
                  {
                    "label": "Hydatid disease (echinococcosis)",
                    "value": "ซากที่ผอม บวมน้ำ และพบในกล้ามเนื้อต้อง condemn"
                  },
                  {
                    "label": "Trichinosis",
                    "value": "ซากที่เป็น trichinosis ต้อง condemn"
                  },
                  {
                    "label": "Ascariasis",
                    "value": "ตับที่เป็น “white spotted” รุนแรงและตับแข็ง (cirrhotic) ต้อง condemn"
                  }
                ]
              }
            ]
          },
          {
            "sub": "Protozoa",
            "body": [
              {
                "bullets": [
                  {
                    "label": "Trypanosomiasis, anaplasmosis, babesiosis",
                    "value": "ซากต้อง condemn ถ้าภาวะ acute สัมพันธ์กับการเปลี่ยนแปลง systemic ของร่างกาย"
                  },
                  {
                    "label": "Sarcocystosis (sarcosporidiosis)",
                    "value": "ติดเชื้อหนักและกว้างขวางจนเห็นซีสต์ทั่วซาก ต้อง condemn"
                  },
                  {
                    "label": "Toxoplasmosis",
                    "value": "ซากของสัตว์ที่แสดงอาการทางคลินิกแบบ acute ต้อง condemn"
                  }
                ]
              }
            ]
          },
          {
            "sub": "Arthropod parasites",
            "body": [
              {
                "bullets": [
                  {
                    "label": "Hypoderma bovis",
                    "value": "รับรองซากได้ (ตัดรอยโรคใต้ผิวหนังออก)"
                  },
                  {
                    "label": "Screwworm myiasis",
                    "value": "ซากผ่านได้หลังตัดเนื้อเยื่อแผลออก ถ้าไม่มี septicemia จากการติดเชื้อทุติยภูมิ"
                  }
                ]
              }
            ]
          },
          {
            "sub": "Porcine stress syndrome (PSS): PSE และ DFD",
            "body": [
              {
                "bullets": [
                  "ซากที่เป็น PSE/DFD รับรองได้ถ้ารอยโรคเล็กน้อย",
                  "ถ้าซากได้รับผลกว้างขวางอาจต้อง down grading เพื่อใช้ในการแปรรูป หรือ condemn",
                  {
                    "label": "PSE (pale, soft, exudative)",
                    "value": "เกิดจากสัตว์เครียดเฉียบพลันก่อนเข้าฆ่า glycogen ถูกใช้ในกระบวนการ glycolysis เร็ว pH ลงเร็วกว่าปกติ เซลล์กล้ามเนื้อไม่อุ้มน้ำ กล้ามเนื้อซีด เปื่อย และน้ำเยิ้ม พบมากในสุกร"
                  },
                  {
                    "label": "DFD (dark, firm, dry)",
                    "value": "เกิดจากเครียดเรื้อรังหรือได้รับอาหารไม่เหมาะสม กล้ามเนื้อไม่มี glycogen สะสม pH ลดน้อยกว่าปกติ น้ำถูกอุ้มไว้ในเซลล์ กล้ามเนื้อแห้งและสีเข้ม พบมากในโคเลี้ยงปล่อยทุ่งที่อดอยาก"
                  },
                  "สายพันธุ์สุกรในไทยปัจจุบันไม่ค่อยเครียดง่าย PSE จึงเกิดไม่บ่อย"
                ]
              }
            ]
          },
          {
            "callout": "หนังสืออ้างอิงสำหรับอ่านเพิ่ม: Manual on meat inspection for developing countries (Herenda D et al., 2000, FAO) ในประเทศที่ขาดแคลนเนื้อมาก บางโรคอาจนำซากมาบริโภคได้หลังจัดการให้เหมาะสม แต่ในไทยไม่ใช้วิธีนั้น",
            "kind": "tip"
          }
        ]
      }
    ]
  },

  // ─────────────────────────────────────────────────────────────
  'meat-cutting-grading': {
    topic: 'meat-cutting-grading',
    title: 'Postmortem changes + meat cutting & grading',
    lecturer: 'Sirawit Pagdepanichkit (SP)',
    icon: '🔪',
    summary: 'Muscle-to-meat conversion เกิดเมื่อ homeostasis หาย หลัง slaughter, 2 ขั้นเริ่ม: immobilization (electrical/gas stunning) + exsanguination (~50% blood removed) → จุดเริ่ม postmortem changes.',
    sections: [
      {
        heading: 'Lecture identity',
        source: '10 - MeatHyg_E4PmChngCuttGrad_67_1.pdf p.1',
        body: [
          { bullets: [
            'หัวข้อ: **Postmortem changes & factors + Meat cutting & grading** (lecture E4)',
            'ผู้สอน: Sirawit Pagdepanichkit',
          ] },
        ],
      },
      {
        heading: 'Conversion of muscle to meat',
        source: '10 - MeatHyg_E4PmChngCuttGrad_67_1.pdf p.2',
        body: [
          { bullets: [
            'Muscle function efficiency only within **narrow range of physiological conditions** (pH, temperature, O₂ concentration, energy supply)',
            '**Homeostasis** = system of check & balance maintaining body physiological state',
            'After slaughter → loss of homeostasis control → many changes occur during conversion of muscle to meat',
            'Condition **immediately prior to slaughter** ส่งผลต่อคุณภาพเนื้อปลายทาง',
          ] },
        ],
      },
      {
        heading: 'Immobilization & exsanguination',
        source: '10 - MeatHyg_E4PmChngCuttGrad_67_1.pdf p.3',
        body: [
          { sub: 'Immobilization',
            body: [
              { bullets: [
                'Methods: **electrical, gas stunning**',
                'Goal: render unconscious — must be done as quick as possible',
                'Avoid method that cause tissue damage',
                'Extensive struggling & excessive movement → **hemorrhage of blood into muscle and other tissue**',
              ] },
            ] },
          { sub: 'Exsanguination',
            body: [
              { bullets: [
                '**Beginning of postmortem changes** in muscles',
                'Only **~50% of total blood volume** can be removed via bleeding process',
              ] },
            ] },
        ],
      },
      {
        heading: 'Rigor mortis → ageing → cutting → grading detail',
        source: '10 - MeatHyg_E4PmChngCuttGrad_67_1.pdf p.4+',
        body: [
          { bullets: ['🚧 รอเติม — rigor mortis biochemistry, ageing 14-day, primal cuts (beef/pork/poultry), USDA Prime/Choice/Select grading, marbling score, yield grade'] },
        ],
      },
    ],
  },

  // ─────────────────────────────────────────────────────────────
  'meat-pest-control': {
    "topic": "meat-pest-control",
    "title": "Meat hygiene: pest control",
    "lecturer": "ศุภชัย เนื้อนวลสุวรรณ",
    "icon": "🪲",
    "summary": "การควบคุมสัตว์รังควาน (pest control) ตามสไลด์ Meat Hygiene: Pest Control ที่สอน 28 ต.ค. 2569 เริ่มจากปัญหาที่ pest ก่อ ชนิดของ pest (rodents, insects, birds) และหลักการควบคุม 4 ข้อ (no food, no habitat, destroy pest, prevention for the advent) แล้วไล่วิธีควบคุมหนู (proofing, baits, rodenticides, traps) การควบคุมแมลงสาบ (aerosols, baits, dusts, traps) จนถึงการควบคุมแมลงด้วย air curtain, strip door curtain, electrocutor, mesh screen และ insecticides",
    "sections": [
      {
        "heading": "ปัญหาจาก pest ชนิดของ pest และหลักการควบคุม 4 ข้อ",
        "source": "Pest control slides p.1-4; บันทึกคาบ 28 ต.ค. 2569 [2:20-3:00, 6:37-8:45]",
        "body": [
          {
            "sub": "Problems of pest",
            "body": [
              {
                "bullets": [
                  "destroy food product",
                  "carry agents",
                  "spoilage",
                  "pathogen (FBD, zoonoses): **plague, leptospirosis, typhus, salmonellosis, staphylococcal intoxication**"
                ]
              }
            ]
          },
          {
            "sub": "Types of pest",
            "body": [
              {
                "bullets": [
                  {
                    "label": "1. Rodents",
                    "value": "rats, mice"
                  },
                  {
                    "label": "2. Insects",
                    "value": "cockroaches, flies"
                  },
                  {
                    "label": "3. Birds",
                    "value": "sparrow, pigeon, starling"
                  }
                ]
              }
            ]
          },
          {
            "sub": "Principle of pest control",
            "body": [
              {
                "bullets": [
                  "1. **No food**: pest เข้ามาเพื่อหาอาหาร ถ้าไม่มีอาหารก็ไม่มีเหตุให้เข้ามา",
                  "2. **No habitat**: ไม่ให้มีที่อยู่อาศัย เช่น ซอกและรอยแตก (cracks and crevices)",
                  "3. **Destroy pest**: เมื่อเจอตัวก็ทำลาย",
                  "4. **Prevention for the advent**: ทำโครงสร้างป้องกันไม่ให้ pest เข้ามา"
                ]
              },
              {
                "bullets": [
                  "การตัดอาหารและที่อยู่อาศัยลดปัญหาได้ประมาณ 50%",
                  "การควบคุมต้องทำเป็นระบบครบทั้ง 4 ข้อ เพราะเมื่อเห็นแมลงสาบหนึ่งตัว ตัวที่ยังไม่เห็นอาจมีอีกเป็นหลักสิบหรือหลักร้อย"
                ]
              }
            ]
          }
        ]
      },
      {
        "heading": "Rodents และ rodent control: proofing",
        "source": "Pest control slides p.5-12; บันทึกคาบ 28 ต.ค. 2569 [8:45-10:35]",
        "body": [
          {
            "sub": "Rodents",
            "body": [
              {
                "bullets": [
                  "**Brown rat** (Rattus norvegicus) หรือ common rat, Norway rat",
                  "**Black rat** (Rattus rattus) หรือ ship rat",
                  "**House mouse** (Mus musculus)"
                ]
              }
            ]
          },
          {
            "sub": "Rodent control",
            "body": [
              {
                "bullets": [
                  "1. No food",
                  "2. No habitat",
                  "3. **Do proofing**",
                  "4. **Direct demolition**"
                ]
              }
            ]
          },
          {
            "sub": "Proofing",
            "body": [
              {
                "bullets": [
                  "ตาข่ายขนาด 1/4 นิ้ว (1/4\" mesh) ฝังลงดินตามแนวผนังอาคาร กันหนูขุดลอดเข้าไป",
                  "แผ่นกันหนูรูปกรวยและรูปจานติดบนท่อที่ต่อเข้าไซโลอาหาร มีขนาดกำกับ 12, 18 และ 36 นิ้ว",
                  "ถังขยะมีฝาปิด ตั้งบนขาตั้งสูงจากพื้น",
                  "แผ่นกันหนูติดบนท่อระบายน้ำ มีขนาดกำกับ 18 นิ้ว",
                  "แผ่นปิดรอบท่อที่แนบผนัง ขนาดอย่างน้อย 12 นิ้ว (12\" min.) ติดสูงจากพื้นอย่างน้อย 36 นิ้ว (36\" min.)"
                ]
              },
              "หนูชอบขุด โรงเก็บอาหารจึงควรทำโครงสร้างด้วยปูน เหล็ก หรือตาข่าย (mesh) ลงไปถึงระดับที่หนูขุดไม่ถึง ส่วนไซโลอาหารสัตว์ทำปลอกกันไม่ให้หนูไต่ขึ้นไป"
            ]
          }
        ]
      },
      {
        "heading": "Direct demolition: baits, rodenticides และ rodent traps",
        "source": "Pest control slides p.13-28; บันทึกคาบ 28 ต.ค. 2569 [10:35-14:42]",
        "body": [
          {
            "sub": "วิธีของ direct demolition",
            "body": [
              {
                "bullets": [
                  "baits",
                  "rodenticide",
                  "fumigation",
                  "traps and sticky boards",
                  "strong slow drying adhesive",
                  "ultrasound"
                ]
              },
              "ตรวจหาร่องรอยหนูในโกดังและห้องเก็บของด้วย **ultraviolet lamp** ส่องให้ปัสสาวะหนูเรืองแสง: dry rodent urine glows **blue-white if fresh** to **yellow-white if old** เมื่อโดน longwave ultraviolet light หนูไม่วิ่งกลางที่โล่ง แต่วิ่งตามขอบผนังและปัสสาวะไว้ตามทาง"
            ]
          },
          {
            "sub": "Baits",
            "body": [
              {
                "bullets": [
                  {
                    "label": "Types",
                    "value": "block, pellet, packet, liquid, combination"
                  },
                  "freshness & palatability: เหยื่อที่สดใหม่หนูกินดีกว่า",
                  "concentration",
                  "pacing & distribution",
                  "สถานีวางเหยื่อ (bait station) มีแบบท่อและแบบกล่องวางชิดผนัง ต้องวางให้พ้นจากสัตว์อื่นที่ไม่ใช่เป้าหมาย เช่น สุนัขและสุกร"
                ]
              }
            ]
          },
          {
            "sub": "Rodenticides",
            "body": [
              {
                "bullets": [
                  "**แบ่งตาม exposure, single (acute)**: bromethalin, brodifacoum, bromadione, indandione (chlorphacinone)",
                  "**แบ่งตาม exposure, multiple (chronic)**: hydroxycoumarin (warfarin), indandione (diphacinone)",
                  "**แบ่งตาม mechanism of action, anticoagulation**: multiple; indandione (all); brodifacoum",
                  "**แบ่งตาม mechanism of action, non-anticoagulation**: bromethalin (จากหน้า single-use rodenticides)"
                ]
              },
              {
                "bullets": [
                  "single (acute) คือกินครั้งเดียวตาย ส่วน multiple (chronic) ค่อยๆ ออกฤทธิ์",
                  "anticoagulation คือทำให้เลือดไม่แข็งตัว หนูตายจากเลือดออกภายใน",
                  {
                    "label": "Single-use rodenticides",
                    "value": "acute effects; block for outside; packet for inside; non-anticoagulant: bromethalin; anticoagulant: brodifacoum, bromadione"
                  }
                ]
              }
            ]
          },
          {
            "sub": "ข้อดี ข้อเสีย ของการใช้เหยื่อล่อผสมยาฆ่าหนู",
            "body": [
              {
                "bullets": [
                  "1. ผลการใช้เหยื่อล่อจะช้า โดยเฉพาะถ้าใช้ยาฆ่าหนูที่ออกฤทธิ์เรื้อรังหรือห้ามการแข็งตัวของเลือด",
                  "2. หลังจากใช้เหยื่อล่อไปช่วงหนึ่ง หนูอาจจะไม่กินหรือเลี่ยงเหยื่อล่อ",
                  "3. อันตรายต่อสัตว์เลี้ยง (หรืออาจจะรวมถึงคน) จะมีมากขึ้นเมื่อเหยื่อล่อน่ากินขึ้น",
                  "4. หนูที่กินเหยื่อล่ออาจจะไม่ตายในที่โล่งแจ้ง ทำให้เกิดปัญหาเรื่องกลิ่น",
                  "5. เหยื่อล่ออาจจะมีราคาค่อนข้างสูง โดยเฉพาะเมื่อต้องล่อก่อนด้วยเหยื่อล่อที่ไม่มียาฆ่าหนู (**prebaiting**)",
                  "6. ต้องระมัดระวังในการจับต้องและการจัดเก็บยาฆ่าหนู ซึ่งถือว่าเป็นสารพิษอันตรายร้ายแรงถึงตาย"
                ]
              }
            ]
          },
          {
            "sub": "Rodent trap",
            "body": [
              {
                "bullets": [
                  "glue trap: **non poisonous**, safe to use in restaurants, pet shops, day care centers, nursing homes, food serving and food preparation areas",
                  "วาง glue boards ในทางที่หนูต้องข้ามจาก hiding places ไป feeding areas",
                  "เพิ่มประสิทธิภาพโดย block passageways บังคับให้หนูเดินผ่าน glue boards โดยตรง",
                  "เมื่อวางบน pipes หรือ poles ให้ผูกลวดยึดไว้ หนูที่ติดจะได้ลาก glue board ไปไม่ได้",
                  "ห้ามวาง glue boards บน steam or hot water pipes",
                  "**Rats: place at 10-15 foot intervals**",
                  "**Mice: place at 5-8 foot intervals**",
                  "ตัวอย่างกับดัก: T Rex trapper, กับดักแบบตีและกรงดักหนู"
                ]
              }
            ]
          }
        ]
      },
      {
        "heading": "Cockroaches และ cockroach control",
        "source": "Pest control slides p.29-39; บันทึกคาบ 28 ต.ค. 2569 [14:42-18:46]",
        "body": [
          {
            "sub": "Cockroaches (roaches)",
            "body": [
              {
                "bullets": [
                  {
                    "label": "The larger ones",
                    "value": "American, Smoky Brown, Oriental, Woods"
                  },
                  {
                    "label": "The smaller ones",
                    "value": "German, Brown Banded"
                  }
                ]
              }
            ]
          },
          {
            "sub": "Cockroaches control",
            "body": [
              {
                "bullets": [
                  "1. Aerosols",
                  "2. Baits",
                  "3. Dusts and dusters",
                  "4. Traps"
                ]
              },
              "สารเคมีควรเป็นวิธีสุดท้าย หลังจากตัดอาหารและที่อยู่อาศัยของแมลงสาบแล้ว"
            ]
          },
          {
            "sub": "Aerosol และ bait",
            "body": [
              {
                "bullets": [
                  "**Aerosol**: 0.50% pyrethrins + 4% piperonyl butoxide (PBO); fast knockdown; excellent flushing action and compact size เหมาะกับ inspections; food handling, USDA approval; works for crawling insects (ants, cockroaches) และ flying insects (flies, mosquitoes)",
                  "**Aerosol**: 1.0% Baygon (carbamate insecticide); fast knockdown with superior residual control; ideally suited for food areas; 4 weeks of 100% effective crack & crevice control; works for cockroaches; ใช้ใน hospitals, supermarkets, motels, hotels, meat packing and food handling establishments, schools, warehouses, restaurants",
                  "**Aerosol: pressurized boric acid dust**: ideal for use in voids where long term residual activity is required; not affected by moisture or heat; leaves a powdery residue; labeled for crack & crevice or void applications; food handling, USDA approval",
                  "**Bait ชนิดเม็ด**: orthoboric acid 5.0%; food area application limited to crack and crevice treatment only"
                ]
              }
            ]
          },
          {
            "sub": "Dust and duster",
            "body": [
              {
                "bullets": [
                  "**Deltamethrin**: a long term residual dust, killing crawling insects; up to 8 months when left undisturbed; odorless, non staining; does not clump or absorb moisture",
                  "Pyrethrum 1%",
                  "Boric acid",
                  "เครื่องพ่นผง (duster) 4 แบบ: electric duster, dust mizer, bulb duster, crusade duster"
                ]
              }
            ]
          },
          {
            "sub": "Cockroach trap",
            "body": [
              "**Pheromone roach trap** is German cockroach control"
            ]
          }
        ]
      },
      {
        "heading": "Insect controls",
        "source": "Pest control slides p.40-46; บันทึกคาบ 28 ต.ค. 2569 [18:46-21:25]",
        "body": [
          {
            "bullets": [
              "**1. Air curtain**: ม่านลมเป่าลงที่ประตู แมลงบินผ่านไม่ได้",
              "**2. Strip door curtain**: ม่านแถบพลาสติกที่ประตู รถผ่านเข้าออกได้ แถบสีเหลืองทำให้แมลงมองเห็นเป็นสีมืดจึงไม่เข้า",
              "**3. Electrocutor**: ใช้แสงดึงดูดแมลงเข้ามาแล้วช็อตด้วยไฟฟ้า (blue ultra violet attraction method); ช่วง ultraviolet: UVC germicidal, UVB suntan, UVA blacklight",
              "**4. Mesh screen**",
              "**5. Insecticides**: non-residual: pyrethrum, allethrin; residual: chlorinated hydrocarbon เช่น DDT, organophosphate เช่น malathion, carbamate เช่น Baygon"
            ]
          }
        ]
      },
      {
        "heading": "รายละเอียดจากเอกสารอ่านประกอบ: fumigation, กับดัก, ultrasound, แมลงวัน และ bird control",
        "source": "Pest control reading material p.7, 12",
        "body": [
          {
            "sub": "วิธีกำจัดหนูอื่นๆ: fumigation, กับดัก, กาวจับหนู, ultrasound",
            "body": [
              {
                "bullets": [
                  "**Fumigation** (การรมควัน): รมควันในอาหาร โครงสร้างตึก และที่อยู่ของหนู ต้องใช้ผู้ชำนาญที่ผ่านการอบรมโดยเฉพาะเท่านั้น ข้อดีคือนอกจากกำจัดหนูแล้วยังได้ผลกับแมลงอื่น เช่น หมัด เห็บ",
                  "**Traps and sticky boards** (กับดัก): ได้ผลเมื่อวางในบริเวณที่หนูเดินผ่านบ่อยๆ ตามซอกมุมมากกว่าพื้นที่โล่งแจ้ง bait ในกับดักควรเป็นชนิดที่มีน้ำเป็นส่วนประกอบส่วนใหญ่ และทางเข้ากับดักควรเป็นชนิด treadle คือเมื่อถูกสัมผัส ฝาของกับดักจะเด้งกลับปิด",
                  "**Strong slow drying adhesive** (กาวจับหนู): ใช้ได้ดีเมื่อมีหนูจำนวนน้อย โดยทากาวบนกระดาษแข็งที่มี bait อยู่กลาง",
                  "**Ultrasound** (คลื่นความถี่เสียง): ใช้ที่ความถี่ประมาณ **30,000 Hz** ไม่รบกวนคนหรือสัตว์เลี้ยงอื่น ข้อด้อยคือผ่านผนังหรือพื้นได้ไม่ดี จึงแนะนำให้ใช้ในที่โล่งแจ้ง และหนูอาจเริ่มคุ้นเคยหลังจากได้ผลในช่วงแรก เนื่องจากไม่ใช่สารเคมีจึงใช้ในบริเวณที่มีอาหารหรือภายในโรงฆ่าสัตว์ได้"
                ]
              },
              {
                "bullets": [
                  {
                    "label": "สารรมควัน: calcium cyanide",
                    "value": "เป็นผง ใส่ในอุปกรณ์พ่นรมควัน โดยเฉพาะในรูที่อยู่ของหนู หลังรมควันข้ามคืนให้เปิดรู กำจัดหนูที่ตาย แล้วพอกปิดรูให้มิดชิดและแข็งแรง กันหนูตัวอื่นเข้ามาอยู่ใหม่"
                  },
                  {
                    "label": "carbon monoxide",
                    "value": "ต้องใช้ปริมาณและเวลาค่อนข้างมาก"
                  },
                  {
                    "label": "carbon dioxide",
                    "value": "ใช้น้ำแข็งแห้ง (dry ice) เหมาะกับห้องเก็บที่ต้องการอุณหภูมิต่ำอยู่เสมอ เช่น refrigerated warehouse บดน้ำแข็งแห้งแล้วใช้พัดลมเป่าให้กระจายทั่ว ใช้สัดส่วน 15% หรือ 10 kg ต่อพื้นที่ 20 ตารางเมตร ทิ้งไว้ 24 ชั่วโมง"
                  },
                  {
                    "label": "methyl bromide",
                    "value": "ใช้ได้ดีกับพื้นที่เป็นดิน (soil)"
                  },
                  "chloropicrin (trichloronitromethane)",
                  "เชื้อไวรัสของหนู (rat virus) ระบาดในประชากรหนูได้ แต่อาจไม่ได้ผลดี ควบคุมยาก และอาจเป็นสาเหตุของ food poisoning ในคน จึงถูกห้ามใช้ในหลายประเทศ"
                ]
              }
            ]
          },
          {
            "sub": "แมลงวัน (flies)",
            "body": [
              "แมลงวันที่พบมากในโรงฆ่าสัตว์มี 2 ชนิด คือ **housefly** (Musca domestica) และ **blowfly** ซึ่งมี 3 ชนิดตามสี คือสีน้ำตาล สีน้ำเงิน และสีเขียว",
              {
                "bullets": [
                  "1. หาแหล่งเพาะพันธุ์แมลงวัน เช่น บริเวณขยะ และทำลายทิ้ง",
                  "2. ทำความสะอาดและ spray ภาชนะบรรจุสิ่งปฏิกูลและบริเวณใกล้เคียง",
                  "3. ช่องทางเข้าอาคารควรมีอุปกรณ์ป้องกันแมลงวันเข้า เช่น air curtain, กรุตาข่าย",
                  "4. misting ด้วย pyrethrum ให้บ่อยที่สุดเมื่อมีแมลงวันภายในอาคาร ทำได้ทุกเวลา",
                  "5. flytrap with bait",
                  "**มด (ants)** เข้ามาในอาคารเพื่อหาอาหาร น้ำ และที่อยู่อาศัย ใช้ยาฆ่าแมลงกับมดอาจได้ผลไม่เต็มที่ เพราะออกฤทธิ์ช้าและมีจำนวนมาก จึงควรหารังมด ถ้ารังอยู่ในซอกที่เข้าไม่ถึงให้ใช้ dichlorvos แบบ vapour ถ้าวิธีเหล่านี้ไม่ได้ผลจึงใช้ยาเบื่อ"
                ]
              }
            ]
          },
          {
            "sub": "Bird control",
            "body": [
              "นกเข้ามาด้วยเหตุผลเดียวกับ pest อื่น คือหาอาหารและที่อยู่อาศัยทำรัง เช่น นกกระจอก นกพิราบ วิธีป้องกันและกำจัดนกมี 7 วิธี",
              {
                "bullets": [
                  "1. ม่านลม (air curtain)",
                  "2. กระแสไฟฟ้า (current)",
                  "3. ตาข่ายและไฟวาบ (netting & flash light)",
                  "4. เสียงความถี่ไล่นก (bird distress noise)",
                  "5. สารหล่อลื่นกันการเกาะของนก (anti-perch gel)",
                  "6. การดูแลสุขาภิบาลและความสะอาด (hygiene)",
                  "7. ยาเบื่อ (bait)"
                ]
              }
            ]
          }
        ]
      }
    ]
  },

  // ─────────────────────────────────────────────────────────────
  'meat-egg-micro': {
    "topic": "meat-egg-micro",
    "title": "Microbiology of the avian egg",
    "lecturer": "ศุภชัย เนื้อนวลสุวรรณ",
    "icon": "🥚",
    "summary": "จุลชีววิทยาของไข่ตามสไลด์ Microbiology of the avian egg ที่สอน 28 ต.ค. 2569 เริ่มจากความสำคัญของจุลินทรีย์กับไข่ โครงสร้างของเปลือกไข่ (true layer, pores, shell accessory material, shell membranes) การแบ่งส่วนภายในไข่ (compartmentalization) และการเสียสภาพที่ทำให้ไข่เน่า วิธีรักษาความสด เหตุที่ไข่ถือเป็น aseptically packaged food ทางที่แบคทีเรียเข้าสู่ไข่ 3 ทาง (trans-ovarian, oviducal, trans-shell) กลไกต้านจุลชีพทางกายภาพและเคมี ปัจจัยและการป้องกัน trans-shell transmission การติด Salmonella จนถึงหลักการล้างไข่ 10 ข้อ",
    "sections": [
      {
        "heading": "ความสำคัญของจุลินทรีย์กับไข่ และโครงสร้างของไข่",
        "source": "Egg slides p.2-4; บันทึกคาบ 28 ต.ค. 2569 [21:34-27:22, 56:04-56:16]",
        "body": [
          {
            "sub": "Significance of microbe with egg",
            "body": [
              "Microbial contamination นำไปสู่ 2 เรื่อง",
              {
                "bullets": [
                  {
                    "label": "Spoilage",
                    "value": "economic issue ไข่ที่เก็บนานแล้วเน่าคือความเสียหาย"
                  },
                  {
                    "label": "Foodborne diseases",
                    "value": "เช่น salmonellosis โรคอันดับหนึ่งของสัตว์ปีกและไข่คือ Salmonella รองลงมาอาจเป็น Campylobacter"
                  }
                ]
              }
            ]
          },
          {
            "sub": "Egg shell structure and function",
            "body": [
              {
                "bullets": [
                  "ประกอบด้วย **true shell** และ **shell accessory material**",
                  "not hard and brittle but **tough and flexible**",
                  "**protect embryogenesis**"
                ]
              }
            ]
          },
          {
            "sub": "Egg structure",
            "body": [
              {
                "bullets": [
                  "ส่วนที่รูปชี้: shell, outer membrane, inner membrane, air cell, albumen (white), yolk, vitelline membrane, chalazae, germinal disk",
                  "air cell อยู่ด้านป้านของไข่",
                  "chalazae คือเยื่อตรึงไข่แดงสองข้าง ทำให้ไข่แดงอยู่กลางไข่ขาว"
                ]
              }
            ]
          },
          {
            "sub": "ไข่สดกับน้ำในไข่",
            "body": [
              {
                "bullets": [
                  "เปลือกไข่มีรู น้ำในไข่ระเหยออกทางรูได้ ไข่สดจึงหนักกว่าไข่เก่าขนาดเดียวกัน",
                  "เมื่อแช่น้ำ ไข่สดมีอากาศน้อยจึงจม ไข่เก่าเสียน้ำและมีอากาศเข้าแทนจึงลอย"
                ]
              }
            ]
          }
        ]
      },
      {
        "heading": "Egg shell structure: true layer, pores, shell accessory material, shell membranes",
        "source": "Egg slides p.5-13; บันทึกคาบ 28 ต.ค. 2569 [27:22-37:10]",
        "body": [
          {
            "sub": "ชั้นของเปลือกไข่",
            "body": [
              {
                "bullets": [
                  "**True layer** มี 4 ชั้น: 1. vertical crystal layer 2. palisade layer 3. cone layer 4. mammillary layer",
                  "**Shell accessory material (SAM)** อยู่นอก true layer",
                  "ชั้นของเปลือกไข่ เรียงจาก external ไป internal: cuticle, palisade layer, mammillary layer, membrane fibres",
                  "ส่วนประกอบของเปลือกไข่: 1. egg shell คือแถบสีอ่อนขนาดใหญ่ made up of calcium salts มี thousands of tiny pores ทะลุเปลือก 2. outer shell membrane ติดกับเปลือก เป็น keratin fibers ที่สานกันเป็นชั้น 3. inner shell membrane แยกจาก outer membrane เล็กน้อย"
                ]
              }
            ]
          },
          {
            "sub": "Egg shell pores",
            "body": [
              {
                "bullets": [
                  "many pores on the surface",
                  "หน้าที่: **water conductance, air exchange** และเป็นทางของ **bacterial penetration**",
                  "**porosity 9-35 microns**",
                  "**number 7,000-17,000 pores**",
                  "แบคทีเรียมีขนาดประมาณ 1 micron รูขนาด 9 microns จึงกว้างกว่าตัวเชื้อ 9 เท่า เชื้อผ่านเข้าได้ และความชื้นจากไข่ขาวก็ออกทางรูนี้"
                ]
              }
            ]
          },
          {
            "sub": "Shell accessory material, SAM",
            "body": [
              {
                "bullets": [
                  "**Cuticle**: organic material; proteoglycan (protein ประมาณ 90% + CHO ประมาณ 5%); moist at lay yet protective when dry",
                  "**Cover**: inorganic material; color of shell eggs; porphyrin หรือ ooporphyrin เป็น shock absorber; brown/black คือ protoporphyrin IX; blue คือ biliverdin-IX; green คือ zinc biliverdin"
                ]
              },
              {
                "bullets": [
                  {
                    "label": "Functions of SAM",
                    "value": "color (porphyrin or ooporphyrin); shell conductance; shell strength vs. bacterial barrier"
                  },
                  {
                    "label": "Role against bacteria",
                    "value": "structure integrity (complete vs. incomplete); thickness of cuticle is negatively related to the age of laying hens; egg washing and sanitizing methods (excellent vs. worst)"
                  },
                  "แม่ไก่ยิ่งอายุมาก เปลือกไข่ยิ่งบางและ cuticle ก็บางด้วย",
                  "cuticle คือนวลไข่ มาจากเมือกที่หล่อลื่นให้ไข่ผ่านออกมาได้"
                ]
              }
            ]
          },
          {
            "sub": "Shell membranes",
            "body": [
              {
                "bullets": [
                  "inner shell membrane (**ISM**) และ outer shell membrane (**OSM**)",
                  "**ISM is more porous but more protective than OSM**",
                  "antimicrobial: **lysozyme**"
                ]
              }
            ]
          }
        ]
      },
      {
        "heading": "Compartmentalization การเสียสภาพ และการรักษาความสดของไข่",
        "source": "Egg slides p.14-17; Egg reading material p.11, 13; บันทึกคาบ 28 ต.ค. 2569 [37:10-44:35]",
        "body": [
          {
            "sub": "Compartmentalization",
            "body": [
              {
                "bullets": [
                  "albumen vs. yolk are working differently: **albumen supplies water**, **yolk supplies feed**",
                  "**Microbes prefer yolk to albumen** แต่ไข่แดงอยู่ตรงกลาง เชื้อจากภายนอกต้องผ่านไข่ขาวก่อนจึงจะถึงไข่แดง",
                  "โครงสร้างที่แบ่งส่วน: egg shell, vitelline membrane (เยื่อระหว่างไข่แดงกับไข่ขาว), albuminous sac (thick albumen)"
                ]
              }
            ]
          },
          {
            "sub": "Breakdown of compartmentalization",
            "body": [
              {
                "bullets": [
                  "decay of albuminous sac",
                  "changes of chalazae: เยื่อตรึงไข่แดงหย่อนลง",
                  "water lost from albumen to yolk",
                  "water lost from albumen to environment",
                  "ผลคือ **a touch of shell membrane and yolk** เชื้อจึงเข้าถึงไข่แดงได้โดยตรง เกิด **addled eggs** (ไข่เน่า)"
                ]
              }
            ]
          },
          {
            "sub": "How to keep fresh eggs",
            "body": [
              {
                "bullets": [
                  "hygienic production and handling",
                  "immersion in lime water or water glass",
                  "oiling / waxing of the egg shells เพื่อไม่ให้ไข่เสียน้ำ",
                  "temperature control",
                  "humidity control",
                  "modified atmosphere to avoid gas exchange",
                  "CO2 added to the atmosphere"
                ]
              }
            ]
          },
          {
            "sub": "Effect of water and nutrient diffusion between yolk and albumen",
            "body": [
              {
                "bullets": [
                  "**Flaccid yolk** (water diffusion): น้ำจากไข่ขาวเข้าสู่ไข่แดง ไข่แดงจึงหย่อนไม่ตั้งสูง",
                  "cyclopropene fatty acid in yolk drives Fe across vitelline membrane to bind **ovotransferrin** in albumen เกิด **salmon-pink complex**",
                  "cyclopropene fatty acid (เช่น sterculic acid, malvalic acid) มาจากอาหารไก่บางชนิด เช่น เมล็ดกระเจี๊ยบ (mallow seed) กรดไขมันนี้ไม่มีผลต่อ vitelline membrane แต่ทำให้ธาตุเหล็กเคลื่อนจากไข่แดงไปสู่ albumen แล้วรวมกับ ovotransferrin เป็น salmon-pink complex",
                  "kept egg under 0 °C ทำให้ disruption of emulsion of yolk เกิด **salmon-pink white discoloration** ซึ่งเดิมเคยเข้าใจว่าเป็น yellow rot จากจุลินทรีย์",
                  "จุดสีชมพูที่เห็นเมื่อตอกไข่จึงไม่ใช่จุดเลือด แต่เป็นธาตุเหล็กที่จับกับ ovotransferrin บริเวณ vitelline membrane"
                ]
              }
            ]
          }
        ]
      },
      {
        "heading": "Eggs as aseptically packaged food และ routes of bacterial transmission",
        "source": "Egg slides p.18-21; บันทึกคาบ 28 ต.ค. 2569 [44:35-49:44]",
        "body": [
          {
            "sub": "Eggs as aseptically packaged food",
            "body": [
              {
                "bullets": [
                  "oviduct has 2 openings: 1. infundibulum to ovary 2. cloaca to external environment",
                  "bacterial inoculation was **cleared by 24 hr** คาดว่าจาก antimicrobial effect by albumen",
                  "found very few bacteria in the ovary",
                  "**Out-of-lay hens have more microbes than laying hens** แม่ไก่ที่ยังวางไข่มีกลไกเคลียร์เชื้อใน oviduct",
                  "**90% newly-laid eggs free from rotting-microbes**"
                ]
              }
            ]
          },
          {
            "sub": "Routes of bacterial transmission",
            "body": [
              {
                "bullets": [
                  "**1. Trans-ovarian**: Salmonella, Staphylococcus, Pasteurella, Mycoplasma; เกิดในตัวแม่ไก่ ทำให้เกิด vertical transmission จากแม่สู่ลูก",
                  "**2. Oviducal**: Salmonella Enteritidis; ติดเชื้อระหว่างไข่อยู่ใน oviduct เกิดในตัวแม่ไก่",
                  "**3. Trans-shell**: เกิดนอกตัวแม่ไก่ ตั้งแต่ไข่ผ่าน cloaca ออกมา เป็นทางหลักที่ทำให้เกิด foodborne disease"
                ]
              },
              "ทางเดินของไข่ไล่ตามลำดับ: ovary, infundibulum, magnum, isthmus, uterus, vagina, cloaca, vent ส่วน trans-shell route คือไข่กับ intestine ออกทาง cloaca เดียวกัน"
            ]
          },
          {
            "sub": "Salmonella ที่ฟาร์มกับที่โรงฆ่า",
            "body": [
              {
                "bullets": [
                  "Salmonella **not** found in bird at farm แต่ found in ovary at slaughterhouse",
                  "เหตุผลที่ให้ไว้: **stress** และ **anti-peristalsis of the oviduct**",
                  "anti-peristalsis คือการบีบตัวย้อนจากข้างนอกเข้าข้างใน จึงพาเชื้อจาก cloaca ย้อนเข้า oviduct ได้"
                ]
              }
            ]
          }
        ]
      },
      {
        "heading": "Antimicrobial defense ของไข่",
        "source": "Egg slides p.22-23; Egg reading material p.15; บันทึกคาบ 28 ต.ค. 2569 [49:44-51:09]",
        "body": [
          {
            "table": {
              "headers": [
                "Barrier",
                "องค์ประกอบ"
              ],
              "rows": [
                [
                  "**Physical barrier**",
                  "SAM, egg shell, shell membranes"
                ],
                [
                  "**Chemical barrier**",
                  "ovotransferrin (conalbumen) + Fe; lysozyme; avidin + biotin"
                ]
              ]
            }
          },
          {
            "sub": "Ovotransferrin",
            "body": [
              {
                "bullets": [
                  "**main protein (up to 12%) in albumen**",
                  "**specifically binds Fe element** ธาตุเหล็กจำเป็นต่อแบคทีเรีย เมื่อเหล็กถูกจับไว้ เชื้อที่เข้ามาในไข่ขาวจึงเพิ่มจำนวนไม่ได้",
                  "bacteria can avoid albumen only when yolk touches shell membrane โดย lag period นี้ประมาณ **10th-20th day**",
                  "some bacteria make **siderophore** to pull Fe back from ovotransferrin"
                ]
              }
            ]
          },
          {
            "sub": "Lysozyme และ avidin",
            "body": [
              {
                "bullets": [
                  "lysozyme ย่อยพันธะ β-1,4-glycosidic ของ peptidoglycan",
                  "avidin จับกับ biotin"
                ]
              }
            ]
          }
        ]
      },
      {
        "heading": "Trans-shell transmission: ปัจจัยและการป้องกัน",
        "source": "Egg slides p.24-28; บันทึกคาบ 28 ต.ค. 2569 [51:09-52:35]",
        "body": [
          {
            "sub": "Factors affecting trans-shell transmission",
            "body": [
              {
                "bullets": [
                  "**Temperature differences**: renders negative pressure inside the eggs แล้ว sucking in contaminants; renders condensation of egg surface",
                  "**Moisture or water activity**: survival of microbes; sweating or condensation",
                  "**Presence of contamination**: more microbes and dirtier nest คือ higher risk; older flock คือ higher risk; organic matter, not the moisture (or aw), in feces of birds acts as major determinant of bacterial contamination",
                  "**Types of contaminants**: intrinsic defense mechanism of eggs determines groups of contaminants; Alcaligenes, E. coli (from GI tract), Proteus, Pseudomonas are prevalent; Campylobacter, Yersinia; Proteus, Staphylococcus, Streptococcus are deleterious to hatchability",
                  "**Physical structure**",
                  "**Chemical defense mechanism**"
                ]
              },
              "ไข่ที่นำออกจากตู้เย็นจะเกิด sweating ที่ผิว เชื้อแบคทีเรียและเชื้อราจากอากาศจึงเข้าไปได้ อุณหภูมิที่ไม่เปลี่ยนแปลงจึงดีกว่า"
            ]
          },
          {
            "sub": "How to prevent trans-shell transmission",
            "body": [
              {
                "bullets": [
                  "hygienic environment",
                  "**collect eggs more often** เพราะหลังออกจากแม่ไก่ อุณหภูมิของไข่ลดลง ความดันในไข่ลดลง จึงดึงสิ่งสกปรกเข้าไป",
                  "keep good temperature and aw",
                  "wash (all) eggs properly",
                  "egg fumigation using formaldehyde ซึ่งเป็นสารก่อมะเร็ง"
                ]
              }
            ]
          }
        ]
      },
      {
        "heading": "Salmonella transmission",
        "source": "Egg slides p.29",
        "body": [
          {
            "bullets": [
              {
                "label": "Egg shell",
                "value": "either oviducal or trans-shell transmitted; S. Enteritidis (SE) phage type (PT) 4 only trans-ovarian; temperature and aw are major determinants"
              },
              {
                "label": "Egg contents",
                "value": "transovarian transmission; SE is more invasive (trans-ovarian) but not trans-shell; incidence of SE 0.1-1.0% depending on sample size, timing of sampling, part of egg, detection means"
              }
            ]
          },
          {
            "callout": "p.19 วาง Salmonella Enteritidis ไว้ใต้ทาง oviducal แต่ p.29 เขียนว่า S. Enteritidis PT 4 only trans-ovarian และ SE is more invasive (trans-ovarian) สองหน้านี้จัด SE ไว้คนละทาง",
            "kind": "flag"
          }
        ]
      },
      {
        "heading": "การล้างไข่: Ten Commandments of washing eggs",
        "source": "Egg slides p.30-32; บันทึกคาบ 28 ต.ค. 2569 [52:44-56:16]",
        "body": [
          "เครื่องล้างมี 2 แบบ คือ tray washer (ล้างถาดไข่) และ egg washer (ล้างฟองไข่)",
          {
            "bullets": [
              "1. **Wash all eggs**",
              "2. Wash eggs soon after lay",
              "3. **Wash water temperature must be higher (10 °C) than that of the eggs**",
              "4. Wash with an approved sanitizer-detergent following manufacturer's directions",
              "5. Rinse all washed eggs with approved sanitizers following manufacturer's directions",
              "6. Check residual of sanitizer in wash water daily",
              "7. Change wash water as often as needed",
              "8. Clean and sanitize the egg washer daily",
              "9. Remove iron from water supply",
              "10. Place washed and dried eggs in the cooler immediately after packaging"
            ]
          },
          {
            "bullets": [
              "ถ้าจะล้างต้องล้างทุกฟอง ถ้าไม่ล้างก็ไม่ล้างเลย",
              "เหตุผลของข้อ 3: น้ำที่อุ่นกว่าทำให้อุณหภูมิของไข่เพิ่มขึ้น ความดันในไข่เพิ่มขึ้น เกิด positive pressure ดันออก น้ำล้างที่สกปรกจึงไม่ถูกดูดเข้าไข่",
              "ไข่ที่เก็บในตู้เย็นล้างด้วยน้ำก๊อกได้ เพราะน้ำก๊อกอุ่นกว่าไข่ ส่วนไข่ที่อยู่ในอุณหภูมิห้องต้องใช้น้ำอุ่น"
            ]
          }
        ]
      }
    ]
  },
};
