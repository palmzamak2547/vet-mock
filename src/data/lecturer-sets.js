// ============================================================
// Lecturer sets — a paper organised the way it is actually written
// ============================================================
// A midterm is not one exam; it is several lecturers' parts stapled together,
// and each lecturer writes in their own format. For Avian Medicine the class
// was told which format each part takes — true/false, matching, written — and
// in one case how many items. A student revising the night before wants
// exactly that shape: อ.เกรียงวิชญ์'s topics as true/false statements,
// อ.ณทยา's as matching cards, not a mixed pool of everything.
//
// What each field is evidence of:
//   sessions      — the department's own timetable (ตารางเรียน 3107510), one
//                   entry per teaching session, with the lecture date and the
//                   VET86 recording of that session. The topics under a session
//                   are the decks the lecturer actually opened that day.
//   format        — the announcement the class received. `announced: false`
//                   means nobody has announced it and the format is what a
//                   previous cohort recorded; the card says so in its note.
//   count         — announced item count, or null.
//   decks[].doc   — the library_docs slug of the deck itself, so the cover can
//                   open the real slides in the reader. Verified against the
//                   catalog titles; the One Health decks named only E1-E3 were
//                   opened and read (E1 concept, E2 collaboration, E3
//                   communication). No slug: no slide button.
//   decks[].cover — an id into LECTURE_COVERS in art.js: the title slide of
//                   that deck, cropped from the recording, so the row reads as
//                   "the slides this lecturer taught from".
//
// A deck may span several topic ids (อ.เกรียงวิชญ์ teaches six diseases from
// one deck). `alsoTopics` are topics that belong to the lecturer's part but have
// no deck of their own to show.
// ============================================================

/** The exam these sets are for. A set only shows while this is the scope. */
export const LECTURER_SET_SCOPE = { year: 5, phase: '1-mid' };

export const FORMAT_LABEL = {
  tf: 'ถูกผิด',
  match: 'จับคู่',
  writing: 'ข้อเขียน',
  mcq: 'ปรนัย',
  all: 'ทุกประเภท',
};

export const LECTURER_SETS = {
  // One Health 3109502 — timetable in the students' course file (ONE HEALTH
  // MID 86, page 2): six Wednesday sessions 5 ส.ค. to 16 ก.ย., midterm the
  // week of 21 ก.ย. What each lecturer said about the paper comes from the
  // VET86 recordings (video-summaries-one-health.js, examFormat) and two
  // students' records of the 26 ส.ค. session.
  'one-health': {
    examDate: '2026-09-21',
    coverage: 'เนื้อหาตั้งแต่ 5 ส.ค. ถึง 16 ก.ย.',
    lecturers: [
      {
        id: 'saharuetai',
        name: 'รศ.สพ.ญ.ดร.สหฤทัย เจียมศรีพงษ์',
        lecturer: 'Saharuetai Jeamsripong',
        format: 'mcq',
        count: null,
        announced: true,
        note: 'อาจารย์แจ้งท้ายคาบที่ 4 ว่าข้อสอบส่วนนี้เป็นแบบกากบาท และให้ดูหน้าที่ของ 4 องค์กรหลัก (คาบแรกแจ้งว่าทั้งวิชามีทั้งข้อเขียนและกากบาท ข้อสอบเยอะ ต้องแบ่งเวลา)',
        sessions: [
          {
            n: 1, date: '2026-08-05', videoId: 'R4k7-CbupPc',
            decks: [{ cover: 'oh-vet-role', title: 'Role of Veterinarians in One Health', topics: ['oh-vet-role'], doc: 'role-of-veterinarians-in-one-health-sj-5-aug-2026-735daf' }],
          },
          {
            n: 4, date: '2026-09-02', videoId: 'DSaNbrj2A3A',
            decks: [{ cover: 'oh-global-network', title: 'Global One Health Activity Network', topics: ['oh-global-network'], doc: 'global-one-health-activity-network-sj-2-sep-2026-148570' }],
          },
        ],
      },
      {
        id: 'sirawit',
        name: 'อ.น.สพ.ดร.สิรวิทย์ ภักดีพาณิชย์กิจ',
        lecturer: 'Sirawit Pagdepanichkit',
        format: 'writing',
        count: null,
        announced: true,
        note: 'อาจารย์แจ้งในคาบที่ 2 ว่าข้อสอบเป็นเขียนสั้นแบบคีย์เวิร์ด 4-5 ข้อย่อย เน้น 4 องค์ประกอบของ One World One Health รุ่นก่อนหน้าบันทึกไว้ 3 ข้อ 3 เรื่อง',
        sessions: [
          {
            n: 2, date: '2026-08-19', videoId: '8z3MTk9B6Q4',
            decks: [{ cover: 'oh-concept', title: 'One World One Health Concept', topics: ['oh-concept'], doc: 'ohvph-sp-e1-22822e' }],
          },
          // One recording (9 ก.ย.) carries both the communication deck and the
          // collaboration deck; the timetable lists them as two sessions.
          {
            n: 5, date: '2026-09-09', videoId: 'xkJw4A0OS7A',
            decks: [{ cover: 'oh-communication', title: 'One Health Communication', topics: ['oh-communication'], doc: 'ohvph-sp-e3-861eb8' }],
          },
          {
            n: 6, date: '2026-09-16', videoId: 'xkJw4A0OS7A',
            decks: [{ cover: 'oh-collaboration', title: 'Collaboration and Partnership in One Health', topics: ['oh-collaboration'], doc: 'ohvph-sp-e2-497888' }],
          },
        ],
      },
      {
        id: 'kamonpan',
        name: 'อ.สพ.ญ.ดร.กมลพรรณ เจริญกุล และ ศ.น.สพ.ดร.อลงกร อมรศิลป์',
        lecturer: 'Kamonpan Charoenkul',
        lecturers: ['Kamonpan Charoenkul', 'Alongkorn Amonsin'],
        format: 'writing',
        // The previous cohort's part was true/false; the class was told the
        // paper follows that round, so the statements are offered as well.
        alsoFormats: ['tf'],
        count: null,
        announced: true,
        note: 'อาจารย์แจ้งในคาบว่าเป็นข้อเขียนและอิงแนวข้อสอบรอบก่อน (บันทึกของนิสิตสองแหล่งตรงกัน รุ่นก่อนหน้าเป็นถูกผิด จึงมีชุดถูกผิดให้ฝึกด้วย)',
        sessions: [
          {
            n: 3, date: '2026-08-26', videoId: 'nbomxmIJth0',
            decks: [{ cover: 'oh-disease-prevention', title: 'Emerging and Re-emerging Diseases', topics: ['oh-disease-prevention'], doc: 'one-health-approach-to-combat-emergind-and-reemerging-94ffad' }],
          },
        ],
      },
    ],
  },
  'food-industry': {
    examDate: '2026-09-22',
    coverage: 'เนื้อหาตั้งแต่ 19 ส.ค. ถึง 9 ก.ย.',
    lecturers: [
      {
        id: 'sirawit',
        name: 'อ.น.สพ.ดร.สิรวิทย์ ภักดีพาณิชย์กิจ',
        lecturer: 'Sirawit Pagdepanichkit',
        format: 'mcq',
        count: null,
        announced: true,
        note: 'ไฟล์ 1.1 FIQC introduction ไม่ออกสอบ ส่วน พ.ร.บ.การสาธารณสุข เป็นช้อยส์ประมาณ 4-5 ข้อ เฉพาะส่วนที่เกี่ยวกับงานสัตวแพทยสาธารณสุข คาบฆ่าสัตว์เป็น MCQ เน้นส่วนที่ต้องใช้ทำงานจริง คาบอาหารสัตว์ไม่ได้ประกาศจำนวนข้อ',
        sessions: [
          {
            n: 1,
            date: '2026-08-19',
            videoId: '66FigWI5wF0',
            decks: [
              {
                cover: 'fiqc-intro',
                title: 'FIQC: Introduction',
                topics: ['fiqc-intro'],
                doc: 'fiqc-sp-e1-1-06b98f',
              },
              {
                cover: 'fiqc-public-health-act',
                title: 'พระราชบัญญัติการสาธารณสุข',
                topics: ['fiqc-intro'],
                doc: 'fiqc-sp-e1-2-8303d4',
              },
            ],
          },
          {
            n: 2,
            date: '2026-08-26',
            videoId: 'WQX71m1GSds',
            decks: [
              {
                cover: 'fiqc-feed-qc',
                title: 'อุตสาหกรรมอาหารสัตว์ และการควบคุมคุณภาพ',
                topics: ['fiqc-feed-qc'],
                doc: 'fiqc-sp-e2-45b7c8',
              },
            ],
          },
          {
            n: 3,
            date: '2026-09-02',
            videoId: 'WRttiWQ7D9s',
            decks: [
              {
                cover: 'fiqc-slaughter-qc',
                title: 'การควบคุมกระบวนการฆ่า และการจำหน่ายเนื้อสัตว์',
                topics: ['fiqc-slaughter-qc'],
                doc: 'fiqc-sp-e3-7c4d8c',
              },
            ],
          },
        ],
      },
      {
        id: 'mintra',
        name: 'สพ.ญ.ดร.มินตรา ลักขณา',
        lecturer: 'มินตรา ลักขณา',
        format: 'mcq',
        count: null,
        announced: false,
        note: 'คาบนี้ไม่มีการประกาศรูปแบบหรือจำนวนข้อ บอกไว้เพียงว่าสอนอะไรก็ออกแบบนั้น และปีนี้ปรับจากของเดิมเล็กน้อย รูปแบบช้อยส์มาจากบันทึกของรุ่นก่อน',
        sessions: [
          {
            n: 4,
            date: '2026-09-09',
            videoId: 'QvEF0KAC1zI',
            decks: [
              {
                cover: 'fiqc-livestock-qc',
                title: 'มาตรฐานสินค้าเกษตรที่เกี่ยวข้องกับกระบวนการผลิตปศุสัตว์และผลิตภัณฑ์จากปศุสัตว์ที่สำคัญ',
                topics: ['fiqc-livestock-qc'],
                doc: 'fiqc-ml-acfs-1-การควบคุมคุณภาพในกระบวนการผลิตปศุสัตว์-2a322b',
              },
            ],
          },
        ],
      },
    ],
  },
  'milk-meat-hygiene': {
    examDate: '2026-09-22',
    coverage: 'เนื้อหาตั้งแต่ 5 ส.ค. ถึง 16 ก.ย.',
    lecturers: [
      {
        id: 'jakkrit',
        name: 'รศ.น.สพ.ดร.จักรกริศน์ เนื่องจำนงค์',
        lecturer: 'จักรกริศน์ เนื่องจำนงค์',
        format: 'mcq',
        count: null,
        announced: false,
        note: 'คาบนี้ไม่มีคลิปบันทึกอยู่บนชั้นหนังสือ และไม่มีการประกาศรูปแบบข้อสอบที่บันทึกไว้ รูปแบบถูกผิดและช้อยส์มาจากชุดที่รุ่นก่อนบันทึกไว้',
        sessions: [
          {
            n: 1,
            date: '2026-08-05',
            decks: [
              {
                cover: 'milk-biosec-dairy',
                title: 'ความปลอดภัยทางชีวภาพเพื่อการผลิตน้ำนมคุณภาพดี',
                topics: ['milk-biosec-dairy'],
                doc: 'ความปลอดภัยทางชีวภาพเพื่อการผลิตน้ำนมคุณภาพดี-8eb6c9',
              },
            ],
          },
        ],
      },
      {
        id: 'rungtip',
        name: 'ศ.สพ.ญ.ดร.รุ่งทิพย์ ชวนชื่น',
        lecturer: 'Rungtip Chuanchuen',
        format: 'mcq',
        count: null,
        announced: true,
        note: 'อาจารย์แจ้งว่าส่วนของท่านเป็นกากบาทล้วน ตัวเลือก 4-5 ตัว และถามแนว ค่านี้เพิ่มหรือลด ส่วนตัวเลขรายผลิตภัณฑ์ไม่ถาม ยกเว้นโคลิฟอร์มและอีโคไล',
        sessions: [
          {
            n: 2,
            date: '2026-08-19',
            videoId: 'cHediceYO_Y',
            decks: [
              {
                cover: 'milk-overview',
                title: 'Introduction to Milk Hygiene',
                topics: ['milk-overview'],
                doc: 'introduction-to-milk-hygiene-1018fa',
              },
              {
                cover: 'milk-mastitis',
                title: 'Mastitis and milk quality',
                topics: ['milk-mastitis'],
                doc: 'cow-mastitis-and-milk-quality-cb486e',
              },
            ],
          },
          {
            n: 3,
            date: '2026-08-26',
            videoId: 'vMFY6A8LaIU',
            decks: [
              {
                cover: 'milk-raw-storage',
                title: 'Storage of raw milk',
                topics: ['milk-raw-storage', 'milk-products-storage'],
                doc: 'milk-storage-and-transportion-652729',
              },
              {
                cover: 'milk-quality-determination',
                title: 'Determination of milk quality',
                topics: ['milk-quality-determination'],
                doc: 'determination-of-milk-quality-ba986c',
              },
            ],
          },
        ],
      },
      {
        id: 'saharuetai',
        name: 'รศ.สพ.ญ.ดร.สหฤทัย เจียมศรีพงษ์',
        lecturer: 'Saharuetai Jeamsripong',
        format: 'mcq',
        count: null,
        announced: true,
        note: 'ส่วนนี้เป็นช้อยส์ ออกเฉพาะจุดเน้นจุดใหญ่ในคาบจุลชีววิทยา และมีโจทย์คำนวณ standardization ประมาณ 2-3 ข้อในกลางภาค',
        sessions: [
          {
            n: 4,
            date: '2026-09-02',
            videoId: '3ihoAGQwxGk',
            decks: [
              {
                cover: 'milk-quality-composition',
                title: 'Composition and quality of raw milk',
                topics: ['milk-quality-composition'],
                doc: '1-composition-and-quality-of-raw-milk-sj-2026-126131',
              },
              {
                cover: 'milk-raw-std',
                title: 'Standard of raw milk and dairy products',
                topics: ['milk-raw-std'],
                doc: '2-raw-milk-and-milk-products-standard-sj-2026-0e0e8c',
              },
            ],
          },
          {
            n: 5,
            date: '2026-09-09',
            videoId: 'hPV3Rhh8r3Q',
            decks: [
              {
                cover: 'milk-microbiology',
                title: 'Milk microbiology',
                topics: ['milk-microbiology'],
                doc: '3-milk-microbiology-sj-2026-80277b',
              },
              {
                cover: 'milk-borne-pathogens',
                title: 'Milk-borne pathogens and diseases',
                topics: ['milk-borne-pathogens'],
                doc: '4-milk-borne-pathogens-and-diseases-sj-2026-5b3328',
              },
            ],
          },
          {
            n: 6,
            date: '2026-09-16',
            videoId: 'aZGyfwMEKCM',
            decks: [
              {
                cover: 'milk-industry-std',
                title: 'GMP and HACCP standards for milk collecting center and milk processing plants',
                topics: ['milk-industry-std', 'milk-cleaning'],
                doc: '5-standard-of-milk-industry-and-milk-products-sj-2026-4b3e8a',
              },
              {
                cover: 'milk-processing',
                title: 'Processing and manufacturing technologies for milk and milk products',
                topics: ['milk-processing'],
                doc: '6-processing-and-manufacturing-technologies-for-milk-and-milk-products-sj-2026-082c30',
              },
            ],
          },
        ],
      },
    ],
  },
  // Equine Med Surg 3106510 — timetable in the Vet 86 compilation: seven Thursday
  // sessions 6 ส.ค. to 17 ก.ย., midterm 23 ก.ย. 08:30-11:30. The initials against each
  // row are TC, TJ, SS and PT; the 2026 recordings confirm five of the seven. Nobody
  // announced a format to this cohort, so each note records only what the previous
  // cohort wrote down about that lecturer's part.
  'equine-medicine': {
    examDate: '2026-09-23',
    coverage: 'เนื้อหาตั้งแต่ 6 ส.ค. ถึง 17 ก.ย.',
    lecturers: [
      {
        id: 'teerapol',
        name: 'อ.น.สพ.ดร.ธีรพล ชินกังสดาร',
        lecturer: 'Teerapol Chinkangsadarn',
        format: 'all',
        count: null,
        announced: false,
        note: 'ยังไม่มีประกาศรูปแบบจากอาจารย์ รุ่นก่อนหน้าบันทึกไว้ว่าส่วนฟันใช้ภาพประกอบมาก ทั้งภาพช่องปาก ฟิล์มเอกซเรย์ฟัน และ dental chart ที่ให้อ่านว่าควอดรันต์ใดผิดปกติ',
        sessions: [
          {
            n: 1, date: '2026-08-06', videoId: 'jgGGQzDTm4E',
            decks: [{ cover: 'eqmed-intro', title: 'Intro to Equine Med/Surg, Vet in Sport Event, Equine ID and Tack', topics: ['equine-intro'] }],
          },
          {
            n: 3, date: '2026-08-20', videoId: 'jOm4PZtiC8o',
            decks: [{ cover: 'eqmed-dentistry', title: 'Equine Dentistry and Oral Surgery', topics: ['equine-dentistry'] }],
          },
          {
            n: 7, date: '2026-09-17', videoId: null,
            decks: [{ cover: 'eqmed-respi', title: 'Equine Respiratory Diseases', topics: ['equine-respi'] }],
          },
        ],
      },
      {
        id: 'thapana',
        name: 'น.สพ.ฐาปนา จรัสธรรมสิริ',
        lecturer: 'Thapana Jarutummasiri',
        format: 'mcq',
        count: null,
        announced: false,
        note: 'ยังไม่มีประกาศรูปแบบจากอาจารย์ รุ่นก่อนหน้าบันทึกไว้ว่าส่วนนี้เป็นช้อยส์จำนวนไม่มาก',
        sessions: [
          {
            n: 1, date: '2026-08-06', videoId: 'jgGGQzDTm4E',
            decks: [{ cover: 'eqmed-nutrition', title: 'Basic Nutrition for Equine Practitioners', topics: ['equine-nutrition'] }],
          },
        ],
      },
      {
        id: 'sawita',
        name: 'อ.สพ.ญ.ดร.ศวิตา สันติวิภารัตน์',
        lecturer: 'Sawita Santiviparat',
        format: 'all',
        count: null,
        announced: false,
        note: 'ยังไม่มีประกาศรูปแบบจากอาจารย์ รุ่นก่อนหน้าบันทึกไว้ว่าส่วนนี้ใช้ภาษาอังกฤษทั้งหมด',
        sessions: [
          {
            n: 2, date: '2026-08-13', videoId: 'zJQ3gItuG6E',
            decks: [{ cover: 'eqmed-practice', title: 'General Equine Practice — restraint, physical examination, BCS, drug administration', topics: ['equine-intro'] }],
          },
          {
            n: 4, date: '2026-08-27', videoId: 'ha7c8qpdsA4',
            decks: [{ cover: 'eqmed-gi1', title: 'Equine Gastrointestinal System I — digestive anatomy and GI examination', topics: ['equine-gi'] }],
          },
          {
            n: 5, date: '2026-09-03', videoId: null,
            decks: [{ cover: 'eqmed-gi2', title: 'Equine Gastrointestinal System II — management of GI disorder and equine colic', topics: ['equine-colic-bestfit'] }],
          },
        ],
      },
      {
        id: 'piyanan',
        name: 'รศ.น.สพ.ดร.ปิยนันท์ ทวีถาวรสวัสดิ์',
        lecturer: 'Piyanan Taweethavonsawat',
        format: 'mcq',
        count: null,
        announced: false,
        note: 'ยังไม่มีประกาศรูปแบบจากอาจารย์ รุ่นก่อนหน้าบันทึกไว้ว่าส่วนนี้เป็นช้อยส์ห้าตัวเลือก',
        sessions: [
          {
            n: 6, date: '2026-09-10', videoId: 'IJaulz_PkS8',
            decks: [{ cover: 'eqmed-parasites', title: 'Equine Parasites in Thailand', topics: ['equine-parasites'] }],
          },
        ],
      },
    ],
  },
  // Equine Reproduction 3108515 — one lecturer for the whole midterm. The compilation's
  // timetable page names รศ.น.สพ.ดร.ธีรวัฒน์ ธาราศานิต (TT) against every lecture, and he
  // capped the midterm at lectures 1-6 in class on 27 ส.ค. (zFsNom4JMC8 [126:23-127:43]);
  // endometritis is taught afterwards and sits in the final, so it is not listed here.
  'equine-repro': {
    examDate: '2026-09-23',
    coverage: 'เนื้อหาตั้งแต่ 6 ส.ค. ถึง 27 ส.ค. (เลคเชอร์ 1 ถึง 6)',
    lecturers: [
      {
        id: 'theerawat',
        name: 'รศ.น.สพ.ดร.ธีรวัฒน์ ธาราศานิต',
        lecturer: 'Theerawat Tharasanit',
        format: 'all',
        count: null,
        announced: true,
        note: 'อาจารย์สรุปท้ายคาบ 27 ส.ค. ว่ากลางภาคตัดที่คาบนี้ ออกเลคเชอร์ 1 ถึง 4 บวกเรื่อง infertility ส่วน endometritis ยกไปปลายภาค',
        sessions: [
          {
            n: 1, date: '2026-08-06', videoId: '5MGooHx0w7w',
            decks: [{ cover: 'eqrepro-anatomy', title: 'กายวิภาคระบบสืบพันธุ์แม่ม้า และวงรอบการเป็นสัดกับการควบคุม', topics: ['eqrepro-anatomy-cycle'] }],
          },
          {
            n: 3, date: '2026-08-20', videoId: 'FBNU52oH1z8',
            decks: [
              { cover: 'eqrepro-exam', title: 'การตรวจระบบสืบพันธุ์แม่ม้า', topics: ['eqrepro-exam-mare'] },
              { cover: 'eqrepro-art', title: 'เทคโนโลยีชีวภาพทางการสืบพันธุ์ในม้าเพศเมีย', topics: ['eqrepro-art-female'] },
            ],
          },
          {
            n: 4, date: '2026-08-27', videoId: 'zFsNom4JMC8',
            decks: [
              { cover: 'eqrepro-infect', title: 'โรคติดเชื้อที่สำคัญของม้าเพศเมีย', topics: ['eqrepro-stallion-infect'] },
              { cover: 'eqrepro-infertility', title: 'ภาวะความไม่สมบูรณ์พันธุ์และการตรวจวินิจฉัย', topics: ['eqrepro-infertility'] },
            ],
          },
        ],
      },
    ],
  },
  'avian-medicine': {
    examDate: '2026-09-21',
    coverage: 'เนื้อหาตั้งแต่ 4 ส.ค. ถึง 15 ก.ย.',
    lecturers: [
      {
        id: 'nataya',
        name: 'ผศ.สพ.ญ.ดร.ณทยา เจริญวิศาล',
        lecturer: 'Nataya Charoenvisal',
        format: 'match',
        count: null,
        announced: true,
        note: 'อาจารย์แจ้งรูปแบบข้อสอบ: จับคู่',
        sessions: [
          {
            n: 1, date: '2026-08-04', videoId: '7XyI0SjnuBA',
            decks: [
              { cover: 'avian-nd', topics: ['avian-nd'], doc: 'powerpoint-newcastle-disease-virus-9adf4c' },
              { cover: 'avian-ib', topics: ['avian-ib'], doc: 'powerpoint-infectious-bronchitis-1555d5' },
              { cover: 'avian-lt', topics: ['avian-lt'], doc: 'powerpoint-infectious-laryngotracheitis-23fc44' },
              { cover: 'avian-mpv', topics: ['avian-mpv'], doc: 'powerpoint-avian-metapneumovirus-b5342d' },
              { cover: 'avian-pox', topics: ['avian-pox'], doc: 'powerpoint-fowlpox-fc63f2' },
            ],
          },
          {
            n: 5, date: '2026-09-01', videoId: 'ScpsvwW0FhM',
            decks: [
              { cover: 'avian-ibd', topics: ['avian-ibd'], doc: 'infectious-bursal-disease-199f26' },
              { cover: 'avian-marek', title: 'Neoplastic Diseases (Marek, ALV, RE)', topics: ['avian-marek'], doc: 'neoplastic-diseases-94a972' },
              { cover: 'avian-cia', topics: ['avian-cia'], doc: 'chicken-infectious-anemia-698e8a' },
              { cover: 'avian-reo', topics: ['avian-reo'], doc: 'reovirus-infection-566454' },
            ],
          },
          {
            n: 6, date: '2026-09-08', videoId: 'RWCDahVkYTk',
            decks: [
              { cover: 'avian-rss', topics: ['avian-rss'], doc: 'runting-and-stunting-syndrome-337271' },
              { cover: 'avian-cocci', topics: ['avian-cocci'], doc: 'coccidiosis-2c6dee' },
              { cover: 'avian-ne', topics: ['avian-ne'], doc: 'necrotic-enteritis-5e2984' },
              { cover: 'avian-leuko', topics: ['avian-leuko'], doc: 'leucocytozoon-9f8a81' },
              { cover: 'avian-malaria', topics: ['avian-malaria'], doc: 'avian-malaria-40af41' },
            ],
          },
        ],
      },
      {
        id: 'somsak',
        name: 'ศ.น.สพ.ดร.สมศักดิ์ ภัคภิญโญ',
        lecturer: 'Somsak Pakpinyo',
        format: 'tf',
        count: null,
        announced: false,
        note: 'ยังไม่มีประกาศรูปแบบจากอาจารย์ รุ่นก่อนหน้าบันทึกไว้ว่าเป็นข้อสอบถูกผิด',
        sessions: [
          {
            n: 2, date: '2026-08-11', videoId: '8ekNMuG25gI',
            decks: [{ cover: 'avian-myco', topics: ['avian-myco'], doc: 'mycoplasmosis-fc353f' }],
          },
          {
            n: 3, date: '2026-08-18', videoId: 'R0xTpIvGn98',
            decks: [
              { cover: 'avian-coryza', topics: ['avian-coryza'], doc: 'infectious-coryza-a2c442' },
              { cover: 'avian-fowl-cholera', topics: ['avian-fowl-cholera'], doc: 'fowl-cholera-b4b384' },
              { cover: 'avian-coli', topics: ['avian-coli'], doc: 'avian-pathogenic-e-coli-7b243b' },
            ],
          },
        ],
      },
      {
        id: 'jiroj',
        name: 'ศ.กิตติคุณ น.สพ.ดร.จิโรจ ศศิปรียจันทร์',
        lecturer: 'Jiroj Sasipreeyajan',
        format: 'writing',
        count: null,
        announced: true,
        note: 'อาจารย์แจ้งรูปแบบข้อสอบ: ข้อเขียน',
        sessions: [
          {
            n: 4, date: '2026-08-25', videoId: 'F1jwpqQCGBM',
            alsoTopics: ['avian-intro'],
            decks: [
              { cover: 'avian-ai', topics: ['avian-ai'], doc: 'avian-influenza-jiroj-2026' },
              { cover: 'avian-egg-breakout', topics: ['avian-egg-breakout'], doc: 'embryo-breakout-analysis-jiroj-2026' },
            ],
          },
        ],
      },
      {
        id: 'kriengwich',
        name: 'อ.น.สพ.ดร.เกรียงวิชญ์ ลิมปวิทยากุล',
        lecturer: 'Kriengwich Limpavithayakul',
        format: 'tf',
        count: 24,
        announced: true,
        note: 'อาจารย์แจ้งรูปแบบข้อสอบ: ถูกผิด 24 ข้อ',
        sessions: [
          {
            n: 7, date: '2026-09-15', videoId: 'ezb2wLM_R2o',
            decks: [
              {
                cover: 'avian-ahra-set',
                title: 'Omphalitis, Ascites, Staphylococcosis, Salmonellosis, Adenovirus, AE',
                topics: ['avian-ahra-set', 'avian-salmonella', 'avian-adeno', 'avian-ae'],
                doc: 'ae-adeno-salmo-omphalitis-ascites-staph-717e8d',
              },
            ],
          },
        ],
      },
    ],
  },
};

/** Whether this subject has a lecturer set for the scope the student is in. */
export function hasLecturerSet(subjectId, selectedYear, selectedPhase) {
  return Boolean(LECTURER_SETS[subjectId])
    && Number(selectedYear) === LECTURER_SET_SCOPE.year
    && selectedPhase === LECTURER_SET_SCOPE.phase;
}

/** Every topic id in a lecturer's part of the paper, decks and alsoTopics alike. */
export function lecturerTopics(lecturer) {
  const out = [];
  for (const s of lecturer.sessions || []) {
    for (const d of s.decks || []) for (const t of d.topics) if (!out.includes(t)) out.push(t);
    for (const t of s.alsoTopics || []) if (!out.includes(t)) out.push(t);
  }
  return out;
}
