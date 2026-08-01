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
    summary: 'องค์ประกอบน้ำนมขึ้นกับ breed/สุขภาพ/lactation stage/diet/farm practice/processing/distribution · แยก property 3 กลุ่ม chemical/physicochemical/physical.',
    sections: [
      {
        heading: 'Lecturer & lecture identity',
        source: '1 - _Milk_quality_and_composition_SJ_2024.pdf p.1',
        body: [
          { bullets: [
            'หัวข้อ: **Composition and quality of raw milk** (lecture #1 ของ SJ ในรายวิชา)',
            'ผู้สอน: **รศ.สพ.ญ.ดร. สหฤทัย เจียมศรีพงษ์** (Saharuetai Jeamsripong, DVM · MPVM · PhD)',
            'Dept. of Veterinary Public Health · Faculty of Veterinary Science · Chulalongkorn University',
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
            '**Physicochemical property** — pH · density · freezing point · acidity · titratable acidity',
            '**Physical property** — สี · กลิ่น · viscosity · sediment',
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
                'ประกาศกระทรวงเกษตรและสหกรณ์ · **มกษ. 6003-2553** (Thai Agricultural Standard) — เรื่อง น้ำนมโคดิบ',
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
    summary: 'การขอมาตรฐานฟาร์มเลี้ยงสัตว์ → มาตรฐานฟาร์มโคนม + แพะนม · เน้น workflow สมัคร–ฝึกอบรม–ตรวจฟาร์ม.',
    sections: [
      {
        heading: 'Lecture identity',
        source: '3 - 65ความปลอดภัยชีวภาพโคนม9.fin.pdf p.1',
        body: [
          { bullets: [
            'หัวข้อ: **ความปลอดภัยทางชีวภาพเพื่อการผลิตน้ำนมคุณภาพดี** (biosecurity for good milk quality production)',
            'ผู้สอน: **รศ.น.สพ.ดร. จักรกริศน์ เนื่องจำนงค์** — ภาควิชาสัตวบาล (ไม่ใช่ Vet Public Health) · คณะสัตวแพทยศาสตร์ · จุฬาฯ',
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
    summary: 'Mastitis = inflammation ของ mammary gland จาก microorganisms (ส่วนใหญ่ bacteria) · invade ผ่าน teat canal → colonize secretory cells → toxin damage milk-producing cells.',
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
    summary: 'จุดรับน้ำนม (small) → ศูนย์รวบรวมน้ำนม (MCC) → check คุณภาพเบื้องต้น (ชั่ง · ดมกลิ่น · ดูสี · ถ.พ. · อุณหภูมิ) แล้วเก็บรักษาเย็น.',
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
            'โค 1 ตัวจะรีดน้ำนมได้ไม่เกิน **10 ลิตร/วัน** (slide reference number)',
            'ตรวจคุณภาพเบื้องต้น: **ชั่งน้ำหนัก · ดมกลิ่น · ดูสี · วัดความถ่วงจำเพาะ · อุณหภูมิ**',
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
    summary: 'Dairy products = อาหารที่ผลิตจากนมสัตว์เลี้ยงลูกด้วยนม (cow หลัก · แพะ · แกะ · จามรี · อูฐ) · 3 abnormalities หลัก: abnormal / undesirable / contaminated milk.',
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
            'Primary sources: milk of **cows** (หลัก) · goats · sheep · yaks · camels',
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
          { bullets: ['🚧 รอเติม — pasteurized vs UHT vs sterilized · cheese ripening temp · yogurt cold-chain · butter / cream shelf-life'] },
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
    summary: '3 เป้าหมาย — consumer protection + milk quality assurance + milk price assurance · ป้องกัน zoonosis / milk-borne disease / milk adulteration / abnormalities ใน infants.',
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
          { bullets: ['🚧 รอเติม — sensory · TBC · SCC · resazurin · methylene blue · API / Petrifilm · antibiotic residue test'] },
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
    summary: 'น้ำนม = good growth medium สำหรับ yeasts/molds/bacteria · 2 กลุ่มหลัก: pathogenic (Brucella · Salmonella · E. coli · S. aureus · Strep. agalactiae · Mycobacterium tuberculosis · Listeria) vs spoilage (Pseudomonas · Enterobacteriaceae · Bacillus cereus · Clostridium).',
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
            'Nutritious food (protein · fat · vitamins · minerals)',
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
                '**Mycobacterium tuberculosis**',
                '**Listeria monocytogenes**',
              ] },
            ] },
          { sub: '2. Spoilage organisms',
            body: [
              { bullets: [
                '**Pseudomonas** — psychrotroph, grow at refrigerator temp · produce enzymes degrading protein & fat',
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
          { bullets: ['🚧 รอเติม — udder origin vs environmental vs handling · indicator: coliforms / *E. coli* / total plate count / psychrotrophic count'] },
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
    summary: '3 source ของ contamination: (1) mammary glands inside/outside udder, (2) handling & storage equipment, (3) external environment · 4 microbe categories in milk products: pathogenic / indicator / spoilage / starter cultures.',
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
          { callout: 'นอกจาก bacteria ยังมี **fungi · virus · parasite** ใน milk products ด้วย (slide diagram p.3).', kind: 'tip' },
        ],
      },
      {
        heading: 'Detail per pathogen (Brucella · Listeria · Salmonella · STEC · Mycobacterium ...)',
        source: '10 - _Milk_borne_pathogens_and_diseases_SJ_2024.pdf p.4+',
        body: [
          { bullets: ['🚧 รอเติม — incubation, dose response, pasteurization kill-step (LTLT 63°C/30min · HTST 72°C/15s · UHT 135°C/2s), outbreak case studies'] },
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
    summary: '4 มาตรฐานสำคัญ — ISO 9000 (quality mgmt) + ISO 22000 (food safety mgmt) + HACCP + GMP · มกษ. 6401(G)-2560 = GMP สำหรับศูนย์รวบรวมน้ำนมดิบ.',
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
          { callout: 'พื้นฐานสุดอย่างหนึ่ง: **5ส** = สะสาง · สะดวก · สะอาด · สุขลักษณะ · สร้างนิสัย.', kind: 'tip' },
        ],
      },
      {
        heading: 'Standard of milk collection center (มาตรฐาน MCC ของไทย)',
        source: '11 - _Standard_of_milk_industry_and_milk_products_SJ_2024.pdf p.3',
        body: [
          { bullets: [
            'หน่วยงาน: **National Bureau of Agricultural Commodity and Food Standards** (มกอช.) · กระทรวงเกษตรและสหกรณ์',
            'มาตรฐาน: **มกษ. 6401(G) – 2560** — "การปฏิบัติที่ดีสำหรับศูนย์รวบรวมน้ำนมดิบ" (Good manufacturing practices for milk collection center)',
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
            '→ Dairy products variety (drinking milk · cream · butter · cheese · yogurt · ice cream · milk powder)',
          ] },
        ],
      },
      {
        heading: 'Heat treatment time/temp + product-specific lines',
        source: '12 - _Processing_and_manufacturing_technologies_for_milk_and_milk_products_SJ_2024.pdf p.4+',
        body: [
          { bullets: ['🚧 รอเติม — LTLT 63°C/30min · HTST 72°C/15s · UHT 135–150°C/1–5s · ESL · ผลต่อ vitamin/protein · spray drying & roller drying'] },
        ],
      },
    ],
  },

  // ─────────────────────────────────────────────────────────────
  'milk-cleaning': {
    topic: 'milk-cleaning',
    title: 'Cleaning & disinfectants in MCC and milk processing',
    lecturer: 'Saharuetai Jeamsripong (SJ)',
    icon: '🧼',
    summary: '9 ข้อกำหนดพื้นฐาน — สถานประกอบการ + ควบคุมการปฏิบัติงาน + บำรุงรักษา/สุขาภิบาล + สุขลักษณะส่วนบุคคล + ขนส่ง + traceability + ฝึกอบรม + ส่งเสริมสมาชิก + ระบบเอกสาร.',
    sections: [
      {
        heading: 'Lecture identity',
        source: '1 - _Cleaning_and_disinfectants_in_milk_collecting_center_and_milk_processing_SJ_2024.pdf p.1',
        body: [
          { bullets: [
            'หัวข้อ: **Cleaning and disinfectants in milk collecting center and milk processing** (SJ lecture #7 · หลัง midterm)',
            'ผู้สอน: Saharuetai Jeamsripong — Dept. of Veterinary Public Health, CU',
          ] },
        ],
      },
      {
        heading: '9 ข้อกำหนดขั้นพื้นฐาน',
        source: '1 - _Cleaning_and_disinfectants_in_milk_collecting_center_and_milk_processing_SJ_2024.pdf p.2',
        body: [
          { bullets: [
            '1. สถานประกอบการและสิ่งอำนวยความสะดวก',
            '2. การควบคุมการปฏิบัติงาน',
            '3. การบำรุงรักษาและการสุขาภิบาล',
            '4. สุขลักษณะส่วนบุคคล',
            '5. การขนส่ง',
            '6. การตามสอบ (**Traceability**)',
            '7. การฝึกอบรม',
            '8. ระบบการส่งเสริมสมาชิก',
            '9. ระบบเอกสารและการบันทึกข้อมูล',
          ] },
        ],
      },
      {
        heading: 'ส่วนที่ 1 — ข้อกำหนดสำหรับสถานที่ผลิตอาหารทุกประเภท',
        source: '1 - _Cleaning_and_disinfectants_in_milk_collecting_center_and_milk_processing_SJ_2024.pdf p.3',
        body: [
          { bullets: [
            'อาคารผลิต',
            'เครื่องมือ เครื่องจักร หรืออุปกรณ์การผลิต',
            'ภาชนะบรรจุ',
            'ผู้ปฏิบัติงาน',
            'การจัดการสุขาภิบาล',
            'สุขลักษณะส่วนบุคคล',
          ] },
        ],
      },
      {
        heading: 'Cleaning agents & disinfectants detail',
        source: '1 - _Cleaning_and_disinfectants_in_milk_collecting_center_and_milk_processing_SJ_2024.pdf p.4+',
        body: [
          { bullets: ['🚧 รอเติม — alkaline detergent vs acid detergent · chlorine · QAC · peracetic acid · iodophor · sanitizer rotation · CIP loop'] },
        ],
      },
    ],
  },

  // ─────────────────────────────────────────────────────────────
  // MEAT HALF
  // ─────────────────────────────────────────────────────────────
  'meat-hygiene-intro': {
    topic: 'meat-hygiene-intro',
    title: 'Introduction to meat hygiene',
    lecturer: 'Sirawit Pagdepanichkit (SP)',
    icon: '🥩',
    summary: 'Meat = "animal tissues suitable for food" · 4 categories: red meat / poultry / seafood / game meat · components: muscle (majority) + epithelial + nervous + connective + adipose.',
    sections: [
      {
        heading: 'Lecture identity',
        source: '2 - MeatHyg_E1.1Intro_SP_67_1.pdf p.1',
        body: [
          { bullets: [
            'หัวข้อ: **Introduction to Meat Hygiene** (lecture E1.1)',
            'ผู้สอน: **อ.น.สพ.ดร. สิรวิทย์ ภักดีพาณิชย์กิจ** (Sirawit Pagdepanichkit) — Vet Public Health, CU',
          ] },
        ],
      },
      {
        heading: 'Meat as a food — definition + 4 categories',
        source: '2 - MeatHyg_E1.1Intro_SP_67_1.pdf p.2',
        body: [
          { bullets: [
            'Meat = **"animal tissues that are suitable for use as food"**',
            '**Red meat**: beef · pork · lamb/mutton · veal',
            '**Poultry meat**: chickens · turkeys · ducks · geese · quails',
            '**Seafood**: fish · clams · crabs · shrimps',
            '**Game meat**: flesh of non-domesticated animal',
          ] },
        ],
      },
      {
        heading: 'Meat components (5 tissue types)',
        source: '2 - MeatHyg_E1.1Intro_SP_67_1.pdf p.3',
        body: [
          { bullets: [
            '**Muscle tissue** — majority of carcass weight → ที่เรียกว่า "meat"',
            '**Epithelial tissue**',
            '**Nervous tissue**',
            '**Connective tissue**',
            '**Adipose tissue** (brown fat / white fat)',
          ] },
        ],
      },
      {
        heading: 'Nutrition · structure · global trends',
        source: '2 - MeatHyg_E1.1Intro_SP_67_1.pdf p.4+',
        body: [
          { bullets: ['🚧 รอเติม — myofibril structure (sarcomere · actin/myosin) · meat color (myoglobin) · per-capita consumption · meat alternative trend'] },
        ],
      },
    ],
  },

  // ─────────────────────────────────────────────────────────────
  'meat-seafood': {
    topic: 'meat-seafood',
    title: 'Seafood: quality changes, spoilage, toxins',
    lecturer: 'Sirawit Pagdepanichkit (SP)',
    icon: '🐟',
    summary: 'Seafood = species variety สูง (chordata · mollusks · arthropod) · composition water 60-81% / protein 16-25% / lipid 0.4-21% (range กว้าง) · lean meat by default ยกเว้น salmon/อ้วน.',
    sections: [
      {
        heading: 'Lecture identity',
        source: '3 - MeatHyg_E1.2SeaFood_SP_67_1.pdf p.1',
        body: [
          { bullets: [
            'หัวข้อ: **Seafood: quality changes & spoilage, seafood toxins** (lecture E1.2)',
            'ผู้สอน: Sirawit Pagdepanichkit',
          ] },
        ],
      },
      {
        heading: 'Chemical composition of seafood',
        source: '3 - MeatHyg_E1.2SeaFood_SP_67_1.pdf p.2',
        body: [
          { bullets: [
            'Large variation & number of species in seafood',
            'Examples: **fish · shrimp · crab · snails · bivalves · squid**',
            'แบ่ง phylum: chordata (ปลา) · mollusks (หอย · หมึก) · crustaceans/arthropod (กุ้ง · ปู)',
          ] },
        ],
      },
      {
        heading: 'Composition comparison (fish vs other proteins)',
        source: '3 - MeatHyg_E1.2SeaFood_SP_67_1.pdf p.3',
        body: [
          { bullets: [
            '**Fish** — water 60-81% · protein 16.4-25.2% · lipid 0.4-21.5% · ash 1.2-1.5%',
            '**Beef** — water 54.7-75.0% · protein 16.5-22.3% · lipid 1.8-28.0%',
            '**Pork** — water 41.1-75.1% · protein 11.2-22.8% · lipid 1.2-47.0%',
            '**Chicken** — water 75.0% · protein 22.8% · lipid 0.9%',
            '**Milk (pasteurized)** — water 87.6% · protein 3.2% · lipid 3.5%',
            '**Egg (boiled)** — water 74.6% · protein 12.1% · lipid 11.2%',
          ] },
          { callout: 'Source: FAO, 2015 · ดูว่า fish lipid swing กว้างเพราะ pelagic (salmon, mackerel) vs lean white fish ต่างกันมาก.', kind: 'tip' },
        ],
      },
      {
        heading: 'Spoilage mechanisms + seafood toxins detail',
        source: '3 - MeatHyg_E1.2SeaFood_SP_67_1.pdf p.4+',
        body: [
          { bullets: ['🚧 รอเติม — autolysis / oxidation / microbial spoilage · histamine fish poisoning · ciguatoxin · PSP/DSP/ASP/NSP · TTX · scombrotoxin'] },
        ],
      },
    ],
  },

  // ─────────────────────────────────────────────────────────────
  'meat-microbiology': {
    topic: 'meat-microbiology',
    title: 'Microbiology of meat & meat hygiene',
    lecturer: 'Taradon Luangtongkum (TL) — ผศ.น.สพ.ดร. ธราดล เหลืองทองคำ',
    icon: '🦠',
    summary: 'Contamination main เกิดที่ slaughter (evisceration) → storage → distribution · bacteria เป็นกลุ่มสำคัญสุด (spoilage + pathogenic) · มี yeast/mold/virus/parasite/protozoa รอง.',
    sections: [
      {
        heading: 'Lecture identity',
        source: '4 - Microbiology_of_Meat___Meat_Hygiene_2567.pdf p.1',
        body: [
          { bullets: [
            'หัวข้อ: **Microbiology of Meat**',
            'ผู้สอน: **Taradon Luangtongkum, D.V.M., Ph.D.** (ผศ.น.สพ.ดร. ธราดล เหลืองทองคำ) — Dept. of Veterinary Public Health, CU',
          ] },
          { callout: 'Note: บน syllabus ระบุชื่อ TL ในวันที่ 16 ต.ค. → topic นี้สอนโดย TL ไม่ใช่ SP (แม้ topic-id อาจอยู่ใน meat block).', kind: 'tip' },
        ],
      },
      {
        heading: 'Lecture outline (5 main points)',
        source: '4 - Microbiology_of_Meat___Meat_Hygiene_2567.pdf p.2',
        body: [
          { bullets: [
            '**Factors affecting microbial growth in meat**',
            '**Microorganisms of meat**',
            '**Control of microorganisms on meat**',
            '**Microbiological examination of meats and carcasses**',
            '**Microbiological standards of meats**',
          ] },
        ],
      },
      {
        heading: 'Introduction — where contamination starts',
        source: '4 - Microbiology_of_Meat___Meat_Hygiene_2567.pdf p.3',
        body: [
          { bullets: [
            'Meat from a healthy animal = should be free of bacteria or other contaminants',
            'Sources of contamination **start at farm**',
            'Contamination mainly occurs during **slaughter, storage, and distribution**',
            'Most important microorganism on meat = **bacteria** (spoilage + pathogenic)',
            'Other microbes: yeast & mold · virus · parasite · protozoa',
            'Affect both **safety** and **shelf-life**',
          ] },
        ],
      },
      {
        heading: 'Intrinsic/extrinsic factors + standard pathogen panel',
        source: '4 - Microbiology_of_Meat___Meat_Hygiene_2567.pdf p.4+',
        body: [
          { bullets: ['🚧 รอเติม — pH/aw/temp/redox/competing flora · Salmonella · Campylobacter · STEC O157 · Listeria · S. aureus · Yersinia · Clostridium · sampling methods (excision · swab) · TBC/coliform/E. coli criteria'] },
        ],
      },
    ],
  },

  // ─────────────────────────────────────────────────────────────
  'meat-storage': {
    topic: 'meat-storage',
    title: 'Storage of meat & meat products',
    lecturer: 'Rungtip Chuanchuen (RC) — Revised 2023',
    icon: '🧊',
    summary: 'พิจารณา 6 มิติ: meat quality · safety · scientific approval · distribution & marketing · investment · application · ปัจจัยจุลินทรีย์ในเนื้อ = extrinsic + intrinsic.',
    sections: [
      {
        heading: 'Lecture identity',
        source: '5 - Revised 2023_storage of meat.pdf p.1',
        body: [
          { bullets: [
            'หัวข้อ: **Storage of meat & meat products** (Revised 2023)',
            'ผู้สอน: Rungtip Chuanchuen — Dept. of Veterinary Public Health, CU',
          ] },
        ],
      },
      {
        heading: 'What to think when designing storage? (6 dimensions)',
        source: '5 - Revised 2023_storage of meat.pdf p.2',
        body: [
          { bullets: [
            '**Meat quality** (sensory · WHC · color · texture)',
            '**Safety** (microbial · toxin · residue)',
            '**Scientific approval** (validated method)',
            '**Distribution & marketing**',
            '**Investment** (capital cost)',
            '**Application** (intended product line)',
          ] },
        ],
      },
      {
        heading: 'Factors affecting microorganisms in meat',
        source: '5 - Revised 2023_storage of meat.pdf p.3',
        body: [
          { bullets: [
            '**1. Extrinsic factor** — storage temp · humidity · gas atmosphere · packaging',
            '**2. Intrinsic factor** — pH · aw · nutrients · redox · natural antimicrobials in meat',
          ] },
        ],
      },
      {
        heading: 'Specific storage methods (chilling · freezing · MAP · curing · drying)',
        source: '5 - Revised 2023_storage of meat.pdf p.4+',
        body: [
          { bullets: ['🚧 รอเติม — temperature ranges (chilling 0-4°C · freezing -18°C · superchilling -1°C) · MAP gas blends · vacuum · cured/salted/smoked product · canned · irradiation'] },
        ],
      },
    ],
  },

  // ─────────────────────────────────────────────────────────────
  'meat-quality': {
    topic: 'meat-quality',
    title: 'Meat quality & wholesomeness',
    lecturer: 'Rungtip Chuanchuen (RC) — Revised 2023',
    icon: '✅',
    summary: 'Fresh meat = ผ่าน chemical/physical change หลัง slaughter โดย minimal process · 4 properties หลัก: water-holding capacity · color · odor & taste · texture & tenderness.',
    sections: [
      {
        heading: 'Lecture identity',
        source: '6 - Revised 2023_Meat quality Wholesomeness.pdf p.1',
        body: [
          { bullets: [
            'หัวข้อ: **Meat quality and wholesomeness** (Revised 2023)',
            'ผู้สอน: Rungtip Chuanchuen — Dept. of Veterinary Public Health, CU',
          ] },
        ],
      },
      {
        heading: 'Definition of fresh meat',
        source: '6 - Revised 2023_Meat quality Wholesomeness.pdf p.2',
        body: [
          { bullets: [
            'Meat that has undergone chemical & physical change that follow slaughter',
            'But has been only **minimally processed** — e.g. fabrication into retail cuts · cubing · grinding · marination · freezing',
            'Examples: **roasts · chops · stew · ground beef**',
          ] },
        ],
      },
      {
        heading: 'Properties of meat (4 key attributes)',
        source: '6 - Revised 2023_Meat quality Wholesomeness.pdf p.3',
        body: [
          { bullets: [
            '**Water-holding capacity** (WHC)',
            '**Color of meat** (myoglobin redox state)',
            '**Odor and taste**',
            '**Texture and tenderness**',
          ] },
        ],
      },
      {
        heading: 'Quality defects + wholesomeness criteria detail',
        source: '6 - Revised 2023_Meat quality Wholesomeness.pdf p.4+',
        body: [
          { bullets: ['🚧 รอเติม — PSE / DFD pork · dark cutter beef · myoglobin → oxymyoglobin → metmyoglobin · drip loss measurement · WBSF · sensory panel'] },
        ],
      },
    ],
  },

  // ─────────────────────────────────────────────────────────────
  'meat-molecular': {
    topic: 'meat-molecular',
    title: 'Application of molecular biology in meat science',
    lecturer: 'Rungtip Chuanchuen (RC) — Revised 2023',
    icon: '🧬',
    summary: 'Molecular biology = molecular basis ของ DNA/RNA/protein · genomic techniques = ผสม molecular genetics + quantitative genetics + Mendelian genetics + bioinformatics → ใช้ระบุ species + meat authentication.',
    sections: [
      {
        heading: 'Lecture identity',
        source: '7 - Revised 2023_MoleinMeatSci.pdf p.1',
        body: [
          { bullets: [
            'หัวข้อ: **Application of molecular biology in meat science** (Revised 2023)',
            'ผู้สอน: Rungtip Chuanchuen — Dept. of Veterinary Public Health, CU',
          ] },
        ],
      },
      {
        heading: 'What is molecular biology technique?',
        source: '7 - Revised 2023_MoleinMeatSci.pdf p.2',
        body: [
          { bullets: [
            'Branch of biology dealing with the **molecular basis of biological activity**',
            'Overlaps with genetics & biochemistry',
            'Studies interactions between DNA, RNA, protein biosynthesis — and how they are regulated',
          ] },
        ],
      },
      {
        heading: 'Genomic techniques = combination of 4 sub-disciplines',
        source: '7 - Revised 2023_MoleinMeatSci.pdf p.3',
        body: [
          { bullets: [
            '**Genetics**',
            '**Molecular genetics**',
            '**Quantitative genetics**',
            '**Mendelian genetics**',
            '**Bioinformatics** (software · whole-genome sequencing analysis)',
          ] },
        ],
      },
      {
        heading: 'Applications: species ID · authentication · adulteration · qPCR',
        source: '7 - Revised 2023_MoleinMeatSci.pdf p.4+',
        body: [
          { bullets: ['🚧 รอเติม — PCR · qPCR · RFLP · DNA barcoding (COI gene) · cytochrome b · halal/haram detection · religious-compliance testing · whole-genome sequencing for outbreak tracing'] },
        ],
      },
    ],
  },

  // ─────────────────────────────────────────────────────────────
  'meat-slaughter': {
    topic: 'meat-slaughter',
    title: 'Slaughterhouse: production facilities & sanitary practices',
    lecturer: 'Sirawit Pagdepanichkit (SP)',
    icon: '🏭',
    summary: 'Slaughterhouse design depends on: practice / technology / purpose / financial / capacity · location ต้องมี proper water-electricity-sewerage + hot/cold water + standby generator + pollution-free + remote from urban area.',
    sections: [
      {
        heading: 'Lecture identity',
        source: '8 - MeatHyg_E2SlaugtHygDes_67_1.pdf p.1',
        body: [
          { bullets: [
            'หัวข้อ: **Slaughterhouse: production facilities & sanitary practices** (lecture E2)',
            'ผู้สอน: Sirawit Pagdepanichkit',
          ] },
        ],
      },
      {
        heading: 'Slaughterhouse / abattoir definition + 5 design factors',
        source: '8 - MeatHyg_E2SlaugtHygDes_67_1.pdf p.2',
        body: [
          { bullets: [
            'Definition: any building/place used for killing of animals where the flesh is intended for **human consumption**',
            'Design depends on:',
            '  • **Practice** to be followed',
            '  • **Level of technology** to be adopted',
            '  • **Purpose** of slaughterhouse',
            '  • **Financial condition**',
            '  • **Capacity** of slaughterhouse',
          ] },
        ],
      },
      {
        heading: 'Location requirements',
        source: '8 - MeatHyg_E2SlaugtHygDes_67_1.pdf p.3',
        body: [
          { bullets: [
            'Proper **water, electricity supply & sewerage**',
            '**Hot & cold water** supply · water quality/pressure adequate',
            '**Standby generator** should be installed',
            '**Pollution-free area** (odor · dust · smoke)',
            '**Remoteness from townships / urban area**',
            '**Good foundation** (soil bearing) — considered factor',
          ] },
        ],
      },
      {
        heading: 'Layout, zoning, water consumption, waste handling detail',
        source: '8 - MeatHyg_E2SlaugtHygDes_67_1.pdf p.4+',
        body: [
          { bullets: ['🚧 รอเติม — clean/dirty zone separation · lairage · stunning area · bleeding · dressing · evisceration · chilling room · offal handling · effluent treatment · animal welfare audit'] },
        ],
      },
    ],
  },

  // ─────────────────────────────────────────────────────────────
  'meat-ante-post-mortem': {
    topic: 'meat-ante-post-mortem',
    title: 'Antemortem & postmortem inspection',
    lecturer: 'Sirawit Pagdepanichkit (SP)',
    icon: '🔍',
    summary: 'Objectives: ให้สัตว์ที่ดูสุขภาพดี/ปกติเข้าฆ่า + แยก abnormal animal ออก + แน่ใจว่าเนื้อปลอด disease/wholesome/ไม่เสี่ยงผู้บริโภค · AM ดูพฤติกรรม + BCS + cleanliness + signs · PM ตัดสินซาก + แยก localized/generalized + acute/chronic.',
    sections: [
      {
        heading: 'Lecture identity',
        source: '9 - MeatHyg_E3AmPmInspect_67_1.pdf p.1',
        body: [
          { bullets: [
            'หัวข้อ: **Antemortem & Postmortem Inspection** (lecture E3)',
            'ผู้สอน: Sirawit Pagdepanichkit',
          ] },
        ],
      },
      {
        heading: 'Meat inspection — objectives',
        source: '9 - MeatHyg_E3AmPmInspect_67_1.pdf p.2',
        body: [
          { bullets: [
            'Ensure only **apparently healthy, physiologically normal animals** are slaughtered for human consumption',
            'Abnormal animals are **separated**',
            'Ensure meat is **free from disease · wholesome · no risk to human health**',
            'Achieved by AM + PM inspection procedure + hygienic dressing with **minimum contamination**',
          ] },
        ],
      },
      {
        heading: 'General principles — AM vs PM',
        source: '9 - MeatHyg_E3AmPmInspect_67_1.pdf p.3',
        body: [
          { sub: 'Antemortem (AM) inspection',
            body: [
              { bullets: [
                'General behavior',
                'Nutritional status (BCS) · cleanliness',
                'Signs of diseases & abnormalities',
              ] },
            ] },
          { sub: 'Postmortem (PM) inspection',
            body: [
              { bullets: [
                'Carcass judgement',
                '**Localized vs generalized** conditions',
                '**Acute vs chronic** condition',
              ] },
            ] },
        ],
      },
      {
        heading: 'AM/PM lesion-judgement table per organ + disposition',
        source: '9 - MeatHyg_E3AmPmInspect_67_1.pdf p.4+',
        body: [
          { bullets: ['🚧 รอเติม — palpation/incision sites · liver-fluke / cysticercosis / TB / abscess / icterus / sepsis · disposition: passed/conditional/condemned · zoonosis-priority lesions'] },
        ],
      },
    ],
  },

  // ─────────────────────────────────────────────────────────────
  'meat-cutting-grading': {
    topic: 'meat-cutting-grading',
    title: 'Postmortem changes + meat cutting & grading',
    lecturer: 'Sirawit Pagdepanichkit (SP)',
    icon: '🔪',
    summary: 'Muscle-to-meat conversion เกิดเมื่อ homeostasis หาย หลัง slaughter · 2 ขั้นเริ่ม: immobilization (electrical/gas stunning) + exsanguination (~50% blood removed) → จุดเริ่ม postmortem changes.',
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
            'Muscle function efficiency only within **narrow range of physiological conditions** (pH · temperature · O₂ concentration · energy supply)',
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
                'Methods: **electrical · gas stunning**',
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
          { bullets: ['🚧 รอเติม — rigor mortis biochemistry · ageing 14-day · primal cuts (beef/pork/poultry) · USDA Prime/Choice/Select grading · marbling score · yield grade'] },
        ],
      },
    ],
  },

  // ─────────────────────────────────────────────────────────────
  'meat-pest-control': {
    topic: 'meat-pest-control',
    title: 'Pest control in slaughterhouses',
    lecturer: 'รศ.น.สพ.ดร. ศุภชัย เนื้อนวลสุวรรณ',
    icon: '🪲',
    summary: '3 problem ที่ pest ทำให้เกิด: ทำลายผลิตภัณฑ์อาหาร + เป็น carrier ของ pathogen (foodborne disease + zoonosis) + ก่อให้ spoilage · pests = rodents + insects + birds.',
    sections: [
      {
        heading: 'Lecture identity',
        source: '11 - MH_2.Pest_Control_(Color).pdf p.1',
        body: [
          { bullets: [
            'หัวข้อ: **Meat Hygiene: Pest Control**',
            'ผู้สอน: **รศ.น.สพ.ดร. ศุภชัย เนื้อนวลสุวรรณ** (ตามตารางสอน วันที่ 27 พ.ย.)',
            'Lecture objectives: principles of pest control · types of pest · how to control pests',
          ] },
        ],
      },
      {
        heading: 'Problems of pest (3 main impacts)',
        source: '11 - MH_2.Pest_Control_(Color).pdf p.2',
        body: [
          { bullets: [
            '**Destroy food product**',
            '**Carry agents** (spoilage + pathogen) → foodborne disease, zoonoses:',
            '  • Plague',
            '  • Leptospirosis',
            '  • Typhus',
            '  • Salmonellosis',
            '  • Staphylococcal intoxication',
            '**Spoilage**',
          ] },
        ],
      },
      {
        heading: 'Types of pest (3 categories)',
        source: '11 - MH_2.Pest_Control_(Color).pdf p.3',
        body: [
          { bullets: [
            '**1. Rodents** — rats · mice',
            '**2. Insects** — cockroaches · flies',
            '**3. Birds** — sparrow · pigeon · starling',
          ] },
        ],
      },
      {
        heading: 'Control methods — IPM, traps, baits, exclusion',
        source: '11 - MH_2.Pest_Control_(Color).pdf p.4+',
        body: [
          { bullets: ['🚧 รอเติม — IPM 4 pillars (exclusion · sanitation · monitoring · control) · snap trap vs glue · bait station · UV trap · netting · pesticide rotation · MSDS record'] },
        ],
      },
    ],
  },

  // ─────────────────────────────────────────────────────────────
  'meat-egg-micro': {
    topic: 'meat-egg-micro',
    title: 'Microbiology of the avian egg',
    lecturer: 'Suphachai (initials on slide) — DVM, MPVM, PhD',
    icon: '🥚',
    summary: 'Microbial contamination → spoilage (economic) + foodborne disease (Salmonella หลัก · E. coli · Campylobacter รอง) · egg shell = true shell + shell accessory · tough & flexible, protect embryogenesis.',
    sections: [
      {
        heading: 'Lecture identity',
        source: '12 - MH_1.Micro_Egg_(Color).pdf p.1',
        body: [
          { bullets: [
            'หัวข้อ: **Microbiology of the avian egg**',
            'ผู้สอน: **Suphachai, DVM · MPVM · PhD** (initials บน slide เท่านั้น — เดาว่าเป็น อ. ในภาควิชา Vet Public Health)',
          ] },
        ],
      },
      {
        heading: 'Significance of microbe with egg',
        source: '12 - MH_1.Micro_Egg_(Color).pdf p.2',
        body: [
          { bullets: [
            'Microbial contamination leading to:',
            '  • **Spoilage** — economic issue',
            '  • **Foodborne diseases** — e.g. **Salmonellosis** (1st) · *E. coli* (2nd) · *Campylobacter*',
          ] },
        ],
      },
      {
        heading: 'Egg shell structure and function',
        source: '12 - MH_1.Micro_Egg_(Color).pdf p.3',
        body: [
          { bullets: [
            'Components: **true shell + shell accessory material**',
            '**Not hard and brittle** — but **tough and flexible**',
            'Protect **embryogenesis**',
          ] },
        ],
      },
      {
        heading: 'Egg contamination routes + Salmonella vertical/horizontal + processing detail',
        source: '12 - MH_1.Micro_Egg_(Color).pdf p.4+',
        body: [
          { bullets: ['🚧 รอเติม — vertical (transovarian, *S. Enteritidis*) vs horizontal (cloacal · shell-penetration) · cuticle · pasteurization of liquid egg · table-egg vs hatching-egg microbiology'] },
        ],
      },
    ],
  },
};
