// ============================================================
// Predicted papers: the shape of one coming paper, part by part, with the
// questions that fit each part best, built from three kinds of evidence:
// what each lecturer said about the paper in this year's recordings, what
// the class was told (the class LINE), and the parts of seniors' papers the
// same lecturer wrote. Every part says which of those it rests on, and how
// firm that is, so the set reads as a forecast with its reasons, never as a
// promise of what the paper holds.
//
// A part's `ids` are served in order: recorded items first (a senior paper,
// then what seniors marked), then items written from this year's recording
// where the recorded ones do not fill the part's format. `past` counts the
// ones from a senior paper and `fresh` the ones written from this year's
// recording, the rest come from seniors' notes and marks (a unit test holds
// both numbers to the banks). A quiz the lecturer set in this year's class
// counts as written from the recording and leads its part: it is the same
// examiner's own items. `extra`
// holds the rest worth drilling: recorded items past the part's count and
// points this year's lecturer stressed that no recorded item tests.
//
// A set shows on its paper's topic screen until the paper ends (`ends`),
// and only for the paper it was built for: another year's forecast is not
// carried over.
// ============================================================

export const PREDICT_SETS = [
  {
    subject: 'one-health',
    year: 5,
    phase: '1-final',
    ends: '2026-11-25T14:30:00+07:00',
    examDate: '2026-11-25',
    minutes: 90,
    basis: 'ปลายภาคนับ 8 คาบ (ไลน์รุ่น 28 ต.ค.) แต่ละส่วนตามคาบที่สอน รูปแบบและจำนวนข้อมาจากที่อาจารย์บอกในคาบปีนี้ ไลน์รุ่น และข้อสอบรุ่นพี่ส่วนของอาจารย์ท่านเดียวกัน',
    parts: [
      {
        id: 'amr',
        topic: 'oh-amr',
        title: 'Antimicrobial resistance',
        lecturer: 'อ.รุ่งทิพย์ ชวนชื่น',
        session: '2026-09-30',
        format: 'tf',
        count: 10,
        confidence: 3,
        evidence: [
          'คาบ 30 ก.ย. อาจารย์บอกว่าส่วนนี้เป็นถูกผิดเป็นหลัก',
          'Vet 82 และ Vet 85 ส่วนนี้เป็นถูกผิด 10 ข้อ ของ Vet 85 เป็นภาษาอังกฤษ',
        ],
        ids: [210000, 210001, 210002, 215005, 215006, 215007, 218606, 218608, 218609, 218610],
        past: 3,
        fresh: 0,
        extra: [218607, 219640, 219641, 219642, 219643, 219644, 219645, 219670, 219671],
      },
      {
        id: 'risk',
        topic: 'oh-risk-analysis',
        title: 'Risk analysis',
        lecturer: 'อ.ศุภชัย เนื้อนวลสุวรรณ',
        session: '2026-10-07',
        format: 'mcq',
        count: 10,
        confidence: 3,
        evidence: [
          'Vet 82 ส่วนของอาจารย์เป็นช้อยส์ 20 ข้อ',
          'สรุปของรุ่นฉบับ 24 พ.ย. จดว่าช้อยส์ 20 ข้อ เน้นนิยาม',
          'คาบ 7 ต.ค. อาจารย์ย้ำสไลด์ risk analysis กับ risk assessment และ 4 ขั้นของ WOAH',
        ],
        ids: [210046, 210047, 105995, 105988, 105999, 105991, 105997, 105996, 105998, 105992],
        past: 2,
        fresh: 0,
        extra: [105989, 105990, 105993, 105994],
      },
      {
        id: 'import',
        topic: 'oh-import-risk',
        title: 'Import risk assessment',
        lecturer: 'อ.ศุภชัย เนื้อนวลสุวรรณ',
        session: '2026-10-07',
        format: 'mcq',
        count: 10,
        confidence: 3,
        evidence: [
          'ไลน์รุ่น 18 พ.ย. แจ้งว่า import risk มี 10 ข้อ',
          'สรุปของรุ่นฉบับ 24 พ.ย. จดว่าส่วนของอาจารย์รวม 20 ข้อ',
          'คาบ 7 ต.ค. อาจารย์บอกว่าการรวม Entry, Exposure และ Consequence เป็น Risk Estimation อยู่ในข้อสอบของอาจารย์',
        ],
        ids: [218600, 106000, 106001, 106002, 106003, 215004, 215000, 215001, 215002, 215003],
        past: 0,
        fresh: 5,
        extra: [106004, 219650, 219651, 219652, 219653],
      },
      {
        id: 'food',
        topic: 'oh-foodborne',
        title: 'Foodborne diseases',
        lecturer: 'อ.ธราดล เหลืองทองคำ',
        session: '2026-10-14',
        format: 'short',
        count: 2,
        confidence: 1,
        evidence: [
          'Vet 82 ส่วนนี้เป็นข้อเขียน 1 ข้อ เรื่องแนวคิดหลักของ One Health ต่อโรคจากอาหาร',
          'Vet 85 เป็นข้อเขียนตอบสั้น รูปแบบส่วนนี้จึงอิงข้อสอบรุ่นพี่สองรุ่น',
        ],
        ids: [210028, 210027],
        past: 2,
        fresh: 0,
        extra: [],
      },
      {
        id: 'env1',
        topic: 'oh-env-carcinogen',
        title: 'Environmental health risks I',
        lecturer: 'อ.วรญาณี ธรรมธร',
        session: '2026-10-21',
        format: 'tf',
        count: 10,
        confidence: 3,
        evidence: [
          'คาบ 21 ต.ค. อาจารย์บอกว่าข้อสอบเป็นถูกผิด 10 ข้อ',
          'Vet 85 ส่วนนี้เป็นถูกผิด 10 ข้อ',
        ],
        ids: [210003, 210004, 210005, 210006, 215008, 215009, 219600, 219601, 219602, 219603],
        past: 4,
        fresh: 4,
        extra: [219604, 219605, 219673],
      },
      {
        id: 'env2',
        topic: 'oh-env-mutagen',
        title: 'Environmental health risks II',
        lecturer: 'อ.วรญาณี ธรรมธร',
        session: '2026-10-28',
        format: 'tf',
        count: 10,
        confidence: 3,
        evidence: [
          'คาบ 28 ต.ค. อาจารย์บอกว่าแต่ละคาบ 10 ข้อ ข้อละ 1 คะแนน รวม 30 คะแนน ข้อที่ผิดไม่ต้องแก้',
          'Vet 85 ส่วนนี้เป็นถูกผิด 10 ข้อ',
        ],
        ids: [210016, 215010, 219610, 219611, 219612, 219613, 219614, 219615, 219616, 219617],
        past: 1,
        fresh: 8,
        extra: [219618, 219619, 219672],
      },
      {
        id: 'gmo',
        topic: 'oh-gmo',
        title: 'Food and feed GMOs',
        lecturer: 'อ.วรญาณี ธรรมธร',
        session: '2026-11-04',
        format: 'tf',
        count: 10,
        confidence: 3,
        evidence: [
          'อาจารย์บอกตั้งแต่คาบ 28 ต.ค. ว่าถูกผิดคาบละ 10 ข้อ',
          'Vet 85 ส่วน GMO เป็นถูกผิด 10 ข้อ',
        ],
        ids: [210049, 219620, 219621, 219622, 219623, 219624, 219625, 219626, 219627, 219628],
        past: 1,
        fresh: 9,
        extra: [219629, 219630],
      },
      {
        id: 'waste',
        topic: 'oh-livestock-waste',
        title: 'Livestock waste management',
        lecturer: 'อ.สิรวิทย์ ภักดีพาณิชย์กิจ',
        session: '2026-11-11',
        format: 'mcq',
        count: 10,
        confidence: 2,
        evidence: [
          'Vet 82 ส่วนนี้เป็นช้อยส์ 10 ข้อ',
          'คาบ 11 พ.ย. อาจารย์บอกว่าส่วนปลายภาคเน้นหลักการจัดการของเสียจากฟาร์ม โรงเชือด และโรงแปรรูป',
        ],
        ids: [210038, 210039, 210040, 210041, 210043, 210044, 210045, 218615, 105982, 218621],
        past: 7,
        fresh: 0,
        extra: [210042, 218624, 105983, 218619, 219660, 219661, 219662],
      },
    ],
  },
  {
    subject: 'zoonoses',
    year: 5,
    phase: '1-final',
    ends: '2026-11-26T16:00:00+07:00',
    examDate: '2026-11-26',
    minutes: 180,
    basis: 'แบ่งส่วนตามอาจารย์และคาบที่สอนปีนี้ รูปแบบมาจากที่อาจารย์บอกในคาบปีนี้ ถ้าไม่ได้บอกใช้รูปแบบจากบันทึกข้อสอบรุ่นพี่ จำนวนข้อส่วน epidemiology มาจากที่อาจารย์บอกในคาบ ส่วน bacterial ตามบันทึกข้อสอบ Vet 85 ส่วนอื่นยังไม่มีประกาศ จึงคิดจากเวลาสอน เทียบกับส่วน epidemiology ที่สอนหนึ่งคาบและมี 12 ข้อ',
    parts: [
      {
        id: 'myco',
        topic: 'zoo-mycoses',
        title: 'Mycozoonoses',
        lecturer: 'อ.ศุภชัย เนื้อนวลสุวรรณ',
        session: '2026-10-02',
        format: 'mcq',
        count: 12,
        confidence: 2,
        evidence: [
          'คาบ 2 ต.ค. อาจารย์บอกว่าข้อสอบส่วนนี้เป็น choice น่าจะเป็น multiple choice และดู PowerPoint ก็พอสำหรับสอบผ่าน',
          'ยังไม่มีประกาศจำนวนข้อ จึงคิด 12 ข้อจากเวลาสอนหนึ่งคาบ',
          'ข้อ mycoses เคยออกในปลายภาค Vet 82 และ Vet 83 และกลางภาค Vet 85',
        ],
        ids: [106148, 106151, 210591, 210589, 106158, 210588, 106160, 106149, 210593, 106159, 106155, 216853],
        past: 11,
        fresh: 0,
        extra: [210592, 106152, 106156, 106161, 106157, 216854, 106163, 216852, 106162, 106164],
      },
      {
        id: 'bact',
        topic: 'zoo-bacterial',
        title: 'Bacterial zoonoses',
        lecturer: 'อ.ธราดล เหลืองทองคำ',
        session: '2026-10-27',
        format: 'mcq',
        count: 19,
        confidence: 2,
        evidence: [
          'คาบ 27 ต.ค. และ 4 พ.ย. อาจารย์ไม่ได้พูดถึงรูปแบบข้อสอบ',
          'บันทึกข้อสอบที่รุ่นพี่ Vet 85 จำมา ส่วน bacterial มี 24 ข้อ เป็นจับคู่ 13 ข้อ ช้อยส์ 6 ข้อ และตอบสั้น 5 ข้อ',
          'ส่วนนี้ฝึก 19 ข้อในรูปช้อยส์ รวมข้อจับคู่และข้อตอบสั้นบางข้อของ Vet 85 ข้อเขียนอีก 5 ข้ออยู่ในส่วนถัดไป',
        ],
        ids: [106010, 106025, 106017, 106011, 106009, 106020, 106006, 106018, 106022, 106019, 106005, 210552, 106023, 106013, 106027, 106024, 106016, 106015, 106026],
        past: 19,
        fresh: 0,
        extra: [216827, 216832, 216818, 216811, 216838, 216821, 106028, 216820, 216800, 216812],
      },
      {
        id: 'bact-short',
        topic: 'zoo-bacterial',
        title: 'Bacterial zoonoses',
        lecturer: 'อ.ธราดล เหลืองทองคำ',
        session: '2026-10-27',
        format: 'short',
        count: 5,
        confidence: 1,
        evidence: [
          'บันทึกข้อสอบ Vet 85 ส่วน bacterial มีตอบสั้น 5 ข้อ',
          'ข้อเขียนในส่วนนี้มาจากบันทึกข้อสอบเก่าของรุ่นพี่ที่ไม่ระบุว่ากลางภาคหรือปลายภาค',
        ],
        ids: [210557, 210565, 210571, 210572, 210555],
        past: 5,
        fresh: 0,
        extra: [210566, 210567, 210568, 210564, 210563, 210558, 210560, 210574, 210561, 210556],
      },
      {
        id: 'prion',
        topic: 'zoo-prion',
        title: 'Prion diseases',
        lecturer: 'อ.ธราดล เหลืองทองคำ',
        session: '2026-11-04',
        format: 'mcq',
        count: 7,
        confidence: 1,
        evidence: [
          'Prion สอนท้ายคาบ 4 พ.ย. ราว 56 นาที อาจารย์ไม่ได้พูดถึงรูปแบบข้อสอบ',
          'บันทึกปลายภาคของรุ่นพี่มีช้อยส์ prion 2 ข้อ ข้อถูกผิดเรื่องนี้ 7 ข้อมาจากกลางภาค Vet 83 และบันทึกที่ไม่ระบุภาค ส่วนนี้จึงฝึกแบบช้อยส์',
          'ยังไม่มีประกาศจำนวนข้อ จึงคิด 7 ข้อจากเวลาสอน',
        ],
        ids: [210596, 210595, 216846, 216848, 216845, 216844, 106041],
        past: 2,
        fresh: 0,
        extra: [216843, 216850, 216847, 216842, 106042, 216849],
      },
      {
        id: 'epi',
        topic: 'zoo-epi-approach',
        title: 'Epidemiological approach to zoonoses',
        lecturer: 'อ.สหฤทัย เจียมศรีพงษ์',
        session: '2026-11-13',
        format: 'mcq',
        count: 12,
        confidence: 3,
        evidence: [
          'คาบ 13 พ.ย. ต้นคาบอาจารย์บอกว่าส่วนนี้เป็นกากบาทราว 10 ข้อ ท้ายคาบบอกว่า 12 ข้อ เป็นช้อยส์ไม่ยาก ชุดนี้ใช้ 12 ข้อ',
          'อาจารย์บอกว่าออกเฉพาะที่สอน และน่าจะมีหนึ่งถึงสองข้อที่ให้สถานการณ์แล้วถามว่าควรใช้การศึกษาแบบใด',
          'ข้อในส่วนนี้คือแบบทดสอบก่อนและหลังเรียนของคาบ 13 พ.ย. เฉลยตามที่ยืนยันในคาบและภาพแบบทดสอบที่บันทึกไว้ ตรงกับสไลด์ปีนี้',
        ],
        ids: [219801, 219802, 219804, 219805, 219806, 219807, 219808, 219809, 219810, 219812, 219811, 219813],
        past: 0,
        fresh: 12,
        extra: [219800, 219803, 104007, 104001, 216858, 216859, 104005, 210536, 210541],
      },
      {
        id: 'eid',
        topic: 'zoo-eid-wildlife',
        title: 'Wildlife and emergence of zoonotic diseases',
        lecturer: 'อ.ไพศิลป์ เล็กเจริญ และ อ.กมลพรรณ เจริญกุล',
        session: '2026-11-20',
        format: 'tf',
        count: 12,
        confidence: 2,
        evidence: [
          'คาบ 20 พ.ย. ไม่มีบันทึกคาบ',
          'ข้อที่รุ่นพี่ Vet 83 ถึง Vet 85 บันทึกจากปลายภาคส่วนนี้ เป็นถูกผิด 8 ข้อ และข้อเขียน 1 ข้อ',
          'ยังไม่มีประกาศจำนวนข้อ จึงคิด 12 ข้อจากเวลาสอนหนึ่งคาบ',
          'ข้อถูกผิดในส่วนนี้ 11 ใน 12 ข้อเป็นข้อความที่ถูก',
        ],
        ids: [210583, 210585, 210582, 210584, 210581, 210578, 210579, 210577, 216860, 216861, 216862, 216863],
        past: 8,
        fresh: 0,
        extra: [],
      },
      {
        id: 'eid-short',
        topic: 'zoo-eid-wildlife',
        title: 'Wildlife and emergence of zoonotic diseases',
        lecturer: 'อ.ไพศิลป์ เล็กเจริญ และ อ.กมลพรรณ เจริญกุล',
        session: '2026-11-20',
        format: 'short',
        count: 1,
        confidence: 1,
        evidence: [
          'ปลายภาค Vet 83 และ Vet 84 มีข้อเขียนส่วนนี้ 1 ข้อ เรื่อง pre-spillover prevention',
        ],
        ids: [210580],
        past: 1,
        fresh: 0,
        extra: [],
      },
    ],
  },
];

export const PREDICT_FORMAT_LABEL = { tf: 'ถูกผิด', mcq: 'ช้อยส์', short: 'ข้อเขียน' };

/** The predicted set of one paper while that paper is still ahead, or null. */
export function predictSetFor(subject, year, phase, now = new Date()) {
  return PREDICT_SETS.find((s) => s.subject === subject && Number(s.year) === Number(year)
    && s.phase === phase && now.getTime() < Date.parse(s.ends)) || null;
}
