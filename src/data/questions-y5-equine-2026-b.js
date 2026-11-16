// ============================================================
// Equine Medicine & Surgery — current lecture batch B (1/2569)
// ============================================================
// Current course: 3106510. These questions use only the current
// lecture extracts for General Practice and Equine GI I-II. Older material was
// used only to avoid semantic duplicates, never as an answer source.
// ============================================================

export const QUESTIONS_Y5_EQUINE_2026_B = [
  {
    id: 107400,
    subject: 'equine-medicine',
    topic: 'equine-intro',
    year: 5,
    type: 'mcq',
    tags: ['equine-restraint', 'minimal-restraint', 'handler-safety'],
    q: 'เมื่อต้องจับบังคับม้าที่กังวลแต่ยังยอมให้จูง ลำดับใดสอดคล้องกับหลัก minimal effective restraint มากที่สุด',
    options: [
      'เริ่มด้วย halter และ lead rope แล้วเพิ่ม twitch หรือ sedation เฉพาะเมื่อจำเป็น',
      'เริ่มด้วย chain shank แล้วเพิ่ม ear twitch แม้ม้ายังยืนสงบและตอบสนองดี',
      'เริ่มด้วย sedation ทุกครั้ง แล้วพิจารณาลดเป็น halter เมื่อม้าเริ่มง่วง',
      'ผูกม้าด้วยปมถาวรให้แน่นก่อน แล้วค่อยประเมินพฤติกรรมและทางหนี',
    ],
    answer: 0,
    explain: 'หลัก minimal effective restraint ให้เริ่มจากวิธีที่ใช้แรงน้อยที่สุด เช่น halter กับ lead rope แล้วเพิ่มระดับเป็น twitch หรือ chemical restraint เมื่อจำเป็น พร้อมคลายแรงกดทันทีที่ปลอดภัย\n\n❌ ทำไมข้ออื่นผิด\n— Chain shank และ ear twitch ไม่ใช่จุดเริ่มเมื่อม้ายังร่วมมือดี\n— Sedation ทุกครั้งมากเกินความจำเป็นและเพิ่มความเสี่ยงจากยา\n— ปมถาวรขัดกับหลัก quick-release และอาจทำให้หนีฉุกเฉินไม่ได้\n\n💡 เริ่มเบา เพิ่มเท่าที่จำเป็น และเปิดทางหนีไว้เสมอ',
    source: 'Equine general practice 5th year 1-2026',
    verified: 'Equine Medicine 3106510 — Equine general practice 5th year 1-2026, pp.21-22',
    sourceType: 'lecture-derived',
    examScope: 'midterm',
    curriculumVersion: '2569-1',
    answerStatus: 'verified',
    predictionTier: 'medium',
    predictionSignals: ['current-lecture'],
  },
  {
    id: 107401,
    subject: 'equine-medicine',
    topic: 'equine-intro',
    year: 5,
    type: 'mcq',
    tags: ['horse-stock', 'physical-restraint', 'clinical-examination'],
    q: 'ต้องการจำกัดการเคลื่อนไหวของม้าเพื่อทำ reproductive examination และ dental treatment อุปกรณ์ใดเหมาะกับงานทั้งสองมากที่สุด',
    options: [
      'Halter และ lead rope โดยไม่ใช้โครงสร้างล้อมตัวม้า',
      'Horse stock ที่ควบคุมลำตัวและเปิดทางให้ผู้ตรวจทำงานได้',
      'Hobble ที่ผูกขาม้าทั้งสี่เข้าหากันระหว่างการตรวจ',
      'Anti-rear bit ที่ใช้แทนพื้นที่ตรวจและผู้จับม้าได้ทั้งหมด',
    ],
    answer: 1,
    explain: 'Horse stock ใช้จำกัดการเคลื่อนไหวอย่างเป็นระบบและรองรับ physical, reproductive และ dental examination หรือ treatment รวมถึงการจับแม่ม้ากับลูก\n\n❌ ทำไมข้ออื่นผิด\n— Halter อย่างเดียวอาจควบคุมลำตัวไม่พอสำหรับหัตถการเหล่านี้\n— Hobble เป็น uncommon restraint และไม่ใช่อุปกรณ์หลักสำหรับงานตรวจทั้งสอง\n— Anti-rear bit มีหน้าที่เฉพาะด้านพฤติกรรม ไม่ได้แทน stock และทีมจับบังคับ\n\n💡 งานตรวจที่ต้องอยู่ชิดลำตัวม้า ใช้ stock เมื่อมีและเหมาะสม',
    source: 'Equine general practice 5th year 1-2026',
    verified: 'Equine Medicine 3106510 — Equine general practice 5th year 1-2026, pp.12-15',
    sourceType: 'lecture-derived',
    examScope: 'midterm',
    curriculumVersion: '2569-1',
    answerStatus: 'verified',
    predictionTier: 'medium',
    predictionSignals: ['current-lecture'],
  },
  {
    id: 107402,
    subject: 'equine-medicine',
    topic: 'equine-intro',
    year: 5,
    type: 'mcq',
    tags: ['chemical-restraint', 'administration-route', 'detomidine'],
    q: 'ข้อใดจับคู่ route ของ chemical restraint ในม้ากับลักษณะการออกฤทธิ์ได้ถูกต้อง',
    options: [
      'IV ออกฤทธิ์ช้าและเหมาะเฉพาะเมื่อเข้าหลอดเลือดไม่ได้',
      'IM ออกฤทธิ์ทันทีและทำนายระดับ sedation ได้แม่นกว่า IV',
      'IV ออกฤทธิ์เร็วและคาดการณ์ได้ ส่วน IM ช้ากว่าเมื่อเข้า IV ยาก',
      'Oral เป็น route หลักของยาทุกกลุ่มที่ใช้ทำ minor surgery',
      'Mucosal ใช้ไม่ได้กับ detomidine และไม่มีบทบาทใน standing sedation',
    ],
    answer: 2,
    explain: 'IV ให้ onset เร็วและคาดการณ์ผลได้ ส่วน IM ออกฤทธิ์ช้ากว่าแต่ใช้ได้เมื่อเข้าหลอดเลือดยาก Oral หรือ mucosal มีบทบาทจำกัด โดย detomidine gel ใช้ทาง mucosal สำหรับ standing sedation ได้\n\n❌ ทำไมข้ออื่นผิด\n— IV ออกฤทธิ์เร็ว ไม่ใช่ช้า ข้อนั้นสลับคุณสมบัติ IV กับ IM\n— IM ไม่เร็วหรือคาดการณ์ได้ดีกว่า IV\n— Oral ไม่ใช่ route หลักของยาทุกกลุ่มใน minor surgery\n— Detomidine gel เป็นตัวอย่างของ mucosal route โดยตรง\n\n💡 IV เร็วและแน่นอนกว่า ส่วน IM เป็นทางเลือกเมื่อเข้าหลอดเลือดยาก',
    source: 'Equine general practice 5th year 1-2026',
    verified: 'Equine Medicine 3106510 — Equine general practice 5th year 1-2026, p.17',
    sourceType: 'lecture-derived',
    examScope: 'midterm',
    curriculumVersion: '2569-1',
    answerStatus: 'verified',
    predictionTier: 'medium',
    predictionSignals: ['current-lecture'],
  },
  {
    id: 107403,
    subject: 'equine-medicine',
    topic: 'equine-intro',
    year: 5,
    type: 'mcq',
    tags: ['chemical-restraint', 'sedation-monitoring', 'patient-safety'],
    q: 'ข้อใดเป็นชุดการดูแลม้าที่ได้รับ chemical restraint ที่ปลอดภัยที่สุด',
    options: [
      'ให้อาหารทันทีหลังฉีดยา เปิดพื้นที่ให้เดิน และตรวจเมื่อม้าเริ่มล้ม',
      'ติดตามเฉพาะอัตราหัวใจ เพราะยากล่อมประสาทไม่กระทบการหายใจ',
      'ปล่อยม้าไว้ลำพังในคอกเงียบ และกลับมาตรวจเมื่อครบระยะออกฤทธิ์',
      'ติดตามหัวใจ-หายใจ ใช้พื้นที่สงบ งดอาหารรอบ sedation และเฝ้าดูตลอด',
    ],
    answer: 3,
    explain: 'การใช้ chemical restraint ต้องเฝ้าติดตาม cardiovascular และ respiratory status ใช้สภาพแวดล้อมสงบและควบคุมได้ หลีกเลี่ยงการให้อาหารก่อนและหลัง sedation และห้ามปล่อยม้าที่ sedated ไว้โดยไม่มีผู้ดูแล\n\n❌ ทำไมข้ออื่นผิด\n— ให้อาหารและปล่อยเดินทันทีเพิ่มความเสี่ยงสำลักหรือบาดเจ็บ\n— ต้องติดตามทั้งระบบหัวใจและการหายใจ\n— คอกเงียบอย่างเดียวไม่ทดแทนการเฝ้าดูผู้ป่วย\n\n💡 ม้าที่นิ่งจากยาไม่ได้แปลว่าปลอดภัยจนปล่อยลำพังได้',
    source: 'Equine general practice 5th year 1-2026',
    verified: 'Equine Medicine 3106510 — Equine general practice 5th year 1-2026, p.18',
    sourceType: 'lecture-derived',
    examScope: 'midterm',
    curriculumVersion: '2569-1',
    answerStatus: 'verified',
    predictionTier: 'medium',
    predictionSignals: ['current-lecture'],
  },
  {
    id: 107404,
    subject: 'equine-medicine',
    topic: 'equine-intro',
    year: 5,
    type: 'mcq',
    tags: ['water-requirement', 'equine-management', 'calculation'],
    q: 'ตามเกณฑ์น้ำ 5-10% ของน้ำหนักตัวต่อวัน ม้าน้ำหนัก 500 กิโลกรัมควรมีน้ำสะอาดให้ประมาณเท่าใดต่อวัน',
    options: [
      '25-50 ลิตรต่อวัน',
      '2.5-5 ลิตรต่อวัน',
      '10-20 ลิตรต่อวัน',
      '75-100 ลิตรต่อวัน',
    ],
    answer: 0,
    explain: 'น้ำ 5-10% ของน้ำหนักตัว 500 กิโลกรัม เท่ากับ 25-50 กิโลกรัมของน้ำ หรือประมาณ 25-50 ลิตรต่อวัน โดยความต้องการจริงเปลี่ยนตามอุณหภูมิ การออกกำลัง เหงื่อ อาหาร และการให้นม\n\n❌ ทำไมข้ออื่นผิด\n— 2.5-5 ลิตรเท่ากับเพียง 0.5-1% ของน้ำหนักตัว\n— 10-20 ลิตรยังต่ำกว่าเกณฑ์ 5%\n— 75-100 ลิตรสูงกว่าช่วงพื้นฐาน 5-10%\n\n💡 ม้า 500 กิโลกรัม คิด 5% ได้ 25 ลิตร และ 10% ได้ 50 ลิตร',
    source: 'Equine general practice 5th year 1-2026',
    verified: 'Equine Medicine 3106510 — Equine general practice 5th year 1-2026, p.26',
    sourceType: 'lecture-derived',
    examScope: 'midterm',
    curriculumVersion: '2569-1',
    answerStatus: 'verified',
    predictionTier: 'medium',
    predictionSignals: ['current-lecture'],
  },
  {
    id: 107405,
    subject: 'equine-medicine',
    topic: 'equine-intro',
    year: 5,
    type: 'mcq',
    tags: ['housing-management', 'stall-design', 'bedding'],
    q: 'แผนปรับคอกม้าข้อใดสอดคล้องกับหลัก housing management ที่เหมาะกับสุขภาพม้ามากที่สุด',
    options: [
      'คอก 2 × 2 เมตร ปิดช่องลม ใช้วัสดุปูชื้นเพื่อลดฝุ่น',
      'คอก 3 × 3 ถึง 4 × 4 เมตร ระบายอากาศดี พื้นปลอดภัย และวัสดุปูแห้ง',
      'คอก 5 × 5 เมตร ปิดทึบ ลดแสง และไม่ต้องนำม้าออก turnout',
      'คอก 3 × 3 เมตร เก็บมูลไว้ให้อุ่น และเปลี่ยนวัสดุปูเมื่อมีกลิ่น',
      'ใช้ turnout แทนการจัดการอากาศ พื้น และความสะอาดภายในคอก',
    ],
    answer: 1,
    explain: 'คอกควรมีพื้นที่ประมาณ 3 × 3 ถึง 4 × 4 เมตร อากาศไหลเวียนดี ฝุ่นต่ำ แสงพอ พื้นลาดและปลอดภัย ไม่มีขอบคม รวมถึงใช้วัสดุปูที่แห้งและสะอาด\n\n❌ ทำไมข้ออื่นผิด\n— คอกเล็ก ปิดลม และวัสดุปูชื้นเพิ่มปัญหาระบบหายใจและกีบ\n— พื้นที่มากไม่ได้ชดเชยการปิดทึบและขาด turnout\n— มูลและแอมโมเนียต้องกำจัด ไม่ควรรอจนมีกลิ่น\n— Turnout เป็นหนึ่งองค์ประกอบ ไม่ได้แทนคุณภาพคอกทั้งหมด\n\n💡 Air, light, space, safety, cleanliness และ turnout ต้องมาคู่กัน',
    source: 'Equine general practice 5th year 1-2026',
    verified: 'Equine Medicine 3106510 — Equine general practice 5th year 1-2026, pp.28, 33',
    sourceType: 'lecture-derived',
    examScope: 'midterm',
    curriculumVersion: '2569-1',
    answerStatus: 'verified',
    predictionTier: 'medium',
    predictionSignals: ['current-lecture'],
  },
  {
    id: 107406,
    subject: 'equine-medicine',
    topic: 'equine-intro',
    year: 5,
    type: 'mcq',
    tags: ['exercise-management', 'training-load', 'injury-prevention'],
    q: 'แนวทางเพิ่ม workload ของม้าฝึกงานข้อใดช่วยลดความเสี่ยงการบาดเจ็บได้เหมาะสมที่สุด',
    options: [
      'เพิ่ม intensity อย่างรวดเร็วเมื่อม้ามี BCS อยู่ในเกณฑ์ปกติ',
      'กำหนด workload จาก discipline เท่านั้นโดยไม่ต้องดูอายุหรือ fitness',
      'เพิ่ม workload ทีละน้อยตามอายุ fitness และระดับฝึก พร้อมมีช่วง recovery',
      'ฝึกหนักต่อเนื่องทุกวันเพื่อหลีกเลี่ยงการสูญเสียสมรรถภาพช่วงพัก',
    ],
    answer: 2,
    explain: 'Workload ควรสัมพันธ์กับอายุ fitness discipline BCS และ training status แล้วเพิ่มอย่างค่อยเป็นค่อยไป การเพิ่ม intensity กะทันหันร่วมกับ recovery ไม่พอเพิ่มความเสี่ยงบาดเจ็บ\n\n❌ ทำไมข้ออื่นผิด\n— BCS ปกติไม่ได้ทำให้การเพิ่มงานรวดเร็วปลอดภัย\n— Discipline เป็นเพียงหนึ่งในหลายปัจจัย\n— การฝึกหนักทุกวันทำให้ recovery ไม่พอ\n\n💡 Load ต้องเพิ่มช้าและ recovery ต้องตามทัน',
    source: 'Equine general practice 5th year 1-2026',
    verified: 'Equine Medicine 3106510 — Equine general practice 5th year 1-2026, p.34',
    sourceType: 'lecture-derived',
    examScope: 'midterm',
    curriculumVersion: '2569-1',
    answerStatus: 'verified',
    predictionTier: 'medium',
    predictionSignals: ['current-lecture'],
  },
  {
    id: 107407,
    subject: 'equine-medicine',
    topic: 'equine-intro',
    year: 5,
    type: 'mcq',
    tags: ['daily-grooming', 'physical-examination', 'hoof-monitoring'],
    q: 'เหตุผลเชิงสุขภาพที่สำคัญของการ grooming ม้าทุกวันคือข้อใด',
    options: [
      'ช่วยให้ไม่ต้องตรวจตา จมูก และช่องปากในการตรวจสุขภาพประจำปี',
      'ทำให้ทดแทนการตัดแต่งกีบทุก 30-45 วันได้เมื่อขนสะอาดดี',
      'ใช้ประเมินเฉพาะความเงาของขนและความพร้อมก่อนการแข่งขัน',
      'ตรวจรายวันหารอยแผล บวม ร้อน เจ็บ สิ่งแปลกปลอม และ digital pulse',
    ],
    answer: 3,
    explain: 'Daily grooming ทำหน้าที่เหมือน daily physical examination โดยสำรวจศีรษะ ลำตัว ขา และกีบ เพื่อพบแผล บวม ร้อน เจ็บ สิ่งแปลกปลอม กลิ่น และความผิดปกติของ digital pulse ได้เร็ว\n\n❌ ทำไมข้ออื่นผิด\n— Grooming ไม่แทนการตรวจสุขภาพอย่างเป็นระบบ\n— การตัดแต่งกีบยังต้องทำตามรอบและสภาพกีบ\n— ประโยชน์ไม่ได้จำกัดอยู่ที่รูปลักษณ์ก่อนแข่งขัน\n\n💡 แปรงขนไป ตรวจผู้ป่วยไป',
    source: 'Equine general practice 5th year 1-2026',
    verified: 'Equine Medicine 3106510 — Equine general practice 5th year 1-2026, pp.35-38',
    sourceType: 'lecture-derived',
    examScope: 'midterm',
    curriculumVersion: '2569-1',
    answerStatus: 'verified',
    predictionTier: 'medium',
    predictionSignals: ['current-lecture'],
  },
  {
    id: 107408,
    subject: 'equine-medicine',
    topic: 'equine-gi',
    year: 5,
    type: 'mcq',
    tags: ['equine-saliva', 'forage-chewing', 'gastric-buffer'],
    q: 'ข้อใดอธิบายบทบาทของน้ำลายม้าต่อระบบทางเดินอาหารได้ถูกต้อง',
    options: [
      'ได้ถึง 20 ลิตร/วัน เพิ่มเมื่อเคี้ยว hay และช่วยหล่อลื่นกับ buffer กระเพาะ',
      'สร้างได้ถึงราว 20 ลิตรต่อวัน เพิ่มเมื่อกิน grain และลดลงเมื่อเคี้ยว hay',
      'สร้างได้ถึงราว 20 ลิตรต่อวันเท่ากันเสมอ และไม่มีผลต่อ gastric pH',
      'สร้างมากเมื่อเคี้ยว hay แต่ทำหน้าที่ย่อยไขมันแทนการหล่อลื่นอาหาร',
    ],
    answer: 0,
    explain: 'ม้าสร้างน้ำลายได้ถึงประมาณ 20 ลิตรต่อวัน น้ำลายช่วยหล่อลื่นอาหารและ buffer กระเพาะ โดยการเคี้ยว hay กระตุ้นน้ำลายมากกว่า grain\n\n❌ ทำไมข้ออื่นผิด\n— Grain กระตุ้นน้ำลายน้อยกว่า hay ไม่ใช่มากกว่า\n— การหลั่งสัมพันธ์กับการเคี้ยวและช่วยปรับสภาพกระเพาะ ไม่ได้คงที่โดยไม่มีผล\n— น้ำลายช่วยหล่อลื่นและ buffer ไม่ได้ทำหน้าที่ย่อยไขมันแทนกลไกอื่น\n\n💡 Forage เพิ่มเวลาเคี้ยว จึงเพิ่มน้ำลายและ buffering',
    source: 'Equine GI I 5th year 1-2026',
    verified: 'Equine Medicine 3106510 — Equine GI I 5th year 1-2026, p.7',
    sourceType: 'lecture-derived',
    examScope: 'midterm',
    curriculumVersion: '2569-1',
    answerStatus: 'verified',
    predictionTier: 'medium',
    predictionSignals: ['current-lecture'],
  },
  {
    id: 107409,
    subject: 'equine-medicine',
    topic: 'equine-gi',
    year: 5,
    type: 'mcq',
    tags: ['equine-stomach', 'gastric-ph', 'squamous-mucosa'],
    q: 'การกระจาย pH และการหลั่งในกระเพาะม้าข้อใดถูกต้อง',
    options: [
      'Squamous region มี pH 1-2 และสร้างกรดกับเมือกมากที่สุด',
      'Squamous pH 6-7 ไม่หลั่งกรดหรือเมือก; glandular pH 1-2',
      'ทั้ง squamous และ glandular region มี pH 6-7 เพราะน้ำลาย neutralize กรดทั้งหมด',
      'Glandular region ไม่มีชั้นเมือกป้องกันและมี pH เท่ากับหลอดอาหาร',
    ],
    answer: 1,
    explain: 'Squamous หรือ non-glandular region อยู่ด้าน proximal มี pH ราว 6-7 และไม่สร้างกรดหรือเมือก ส่วน glandular region สร้างกรดและเอนไซม์ มี pH ราว 1-2 และมีชั้นเมือกป้องกัน\n\n❌ ทำไมข้ออื่นผิด\n— pH 1-2 เป็นบริเวณ glandular ไม่ใช่ squamous\n— น้ำลายช่วย buffer แต่ไม่ได้ทำให้ทั้งกระเพาะเป็นกลาง\n— Glandular mucosa มีชั้นเมือกหนาปกป้องผิว\n\n💡 Squamous สูงและเปราะกว่า ส่วน glandular ต่ำแต่มี mucus',
    source: 'Equine GI I 5th year 1-2026',
    verified: 'Equine Medicine 3106510 — Equine GI I 5th year 1-2026, p.9',
    sourceType: 'lecture-derived',
    examScope: 'midterm',
    curriculumVersion: '2569-1',
    answerStatus: 'verified',
    predictionTier: 'medium',
    predictionSignals: ['current-lecture'],
  },
  {
    id: 107410,
    subject: 'equine-medicine',
    topic: 'equine-gi',
    year: 5,
    type: 'mcq',
    tags: ['hindgut-fermentation', 'gi-proportion', 'equine-anatomy'],
    q: 'สัดส่วนของระบบทางเดินอาหารม้าข้อใดสอดคล้องกับการเป็น colon fermenter',
    options: [
      'Foregut 63% และ hindgut 37% โดยกระเพาะคิดเป็น 35%',
      'Foregut 50% และ hindgut 50% โดย caecum กับ colon เท่ากัน',
      'Foregut 37% และ hindgut 63% โดย large colon คิดเป็นประมาณ 35%',
      'Foregut 28% และ hindgut 72% โดย small intestine อยู่ใน hindgut',
      'Foregut 9% และ hindgut 91% โดย foregut หมายถึงกระเพาะเท่านั้น',
    ],
    answer: 2,
    explain: 'ระบบทางเดินอาหารแบ่ง foregut 37% เป็น stomach 9% และ small intestine 28% ส่วน hindgut 63% ประกอบด้วย caecum 17% large colon 35% และ small colon 11% จึงสอดคล้องกับการหมักหลักในลำไส้ใหญ่\n\n❌ ทำไมข้ออื่นผิด\n— Foregut 63% สลับสัดส่วน foregut กับ hindgut\n— ระบบไม่ได้แบ่งครึ่งเท่ากัน\n— Small intestine อยู่ใน foregut ตามการแบ่งนี้\n— Foregut ไม่ได้หมายถึงกระเพาะเพียงอย่างเดียว\n\n💡 ม้าเป็น hindgut fermenter และ large colon เป็นส่วนใหญ่ที่สุดของ hindgut',
    source: 'Equine GI I 5th year 1-2026',
    verified: 'Equine Medicine 3106510 — Equine GI I 5th year 1-2026, pp.3-4',
    sourceType: 'lecture-derived',
    examScope: 'midterm',
    curriculumVersion: '2569-1',
    answerStatus: 'verified',
    predictionTier: 'medium',
    predictionSignals: ['current-lecture'],
  },
  {
    id: 107411,
    subject: 'equine-medicine',
    topic: 'equine-gi',
    year: 5,
    type: 'mcq',
    tags: ['equine-cecum', 'cecal-apex', 'sternal-flexure'],
    q: 'ส่วน apex ของ caecum ม้าอยู่ที่ตำแหน่งใด',
    options: [
      'ชิด left kidney ภายใน nephrosplenic space',
      'พาดตาม lesser curvature ของกระเพาะส่วน glandular',
      'อยู่ dorsal ต่อซี่โครงและทอดเข้าสู่ right paralumbar fossa',
      'เป็นปลายตันแหลมใน concavity ของ sternal flexure',
    ],
    answer: 3,
    explain: 'Caecal apex เป็นปลายตันและแหลม อยู่ใน concavity ของ sternal flexure ของ ventral colon ส่วน base กว้างและโค้ง dorsal จากบริเวณซี่โครงไป right paralumbar fossa\n\n❌ ทำไมข้ออื่นผิด\n— Nephrosplenic space เกี่ยวกับ left dorsal colon displacement\n— Lesser curvature เป็นโครงสร้างของกระเพาะ\n— ตำแหน่ง dorsal ถึง right paralumbar fossa อธิบาย caecal base ไม่ใช่ apex\n\n💡 Base อยู่ขวาบน แต่ apex ชี้เข้าหา sternal flexure',
    source: 'Equine GI I 5th year 1-2026',
    verified: 'Equine Medicine 3106510 — Equine GI I 5th year 1-2026, p.13',
    sourceType: 'lecture-derived',
    examScope: 'midterm',
    curriculumVersion: '2569-1',
    answerStatus: 'verified',
    predictionTier: 'medium',
    predictionSignals: ['current-lecture'],
  },
  {
    id: 107412,
    subject: 'equine-medicine',
    topic: 'equine-gi',
    year: 5,
    type: 'mcq',
    tags: ['large-colon', 'fiber-fermentation', 'water-absorption'],
    q: 'หน้าที่หลักของ large colon ในม้าคือข้อใด',
    options: [
      'สร้างน้ำดีและปล่อย bicarbonate เพื่อย่อยไขมันใน duodenum',
      'ย่อยโปรตีนด้วย pepsin ในสภาพ pH 1-2 ตลอดทั้งอวัยวะ',
      'ดูดซึม amino acid และ simple sugar ผ่าน villi เข้ากระแสเลือด',
      'ก่อ peristalsis ทางเดียวจากปากไปกระเพาะด้วย cardiac sphincter',
      'หมักใยอาหารและดูดซึมน้ำ electrolytes กับแร่ธาตุบางส่วน',
    ],
    answer: 4,
    explain: 'Large colon เป็นส่วนสำคัญของ hindgut fermentation ทำหน้าที่หมักใยอาหารและเป็นบริเวณดูดซึมน้ำ electrolytes และแร่ธาตุบางส่วน\n\n❌ ทำไมข้ออื่นผิด\n— น้ำดีสร้างจากตับและ bicarbonate มาจากตับอ่อนกับทางเดินอาหาร\n— Pepsin และ pH ต่ำเป็นหน้าที่ของกระเพาะ glandular\n— การดูดซึม amino acid กับ simple sugar เด่นที่ small intestine\n— Peristalsis ทางเดียวและ cardiac sphincter อธิบายหลอดอาหาร\n\n💡 Large colon คือถังหมักใยอาหารและคืนทั้งน้ำกับเกลือแร่',
    source: 'Equine GI I 5th year 1-2026',
    verified: 'Equine Medicine 3106510 — Equine GI I 5th year 1-2026, p.14',
    sourceType: 'lecture-derived',
    examScope: 'midterm',
    curriculumVersion: '2569-1',
    answerStatus: 'verified',
    predictionTier: 'medium',
    predictionSignals: ['current-lecture'],
  },
  {
    id: 107413,
    subject: 'equine-medicine',
    topic: 'equine-gi',
    year: 5,
    type: 'mcq',
    tags: ['small-colon', 'fecal-formation', 'hindgut'],
    q: 'Small colon ของม้ามีบทบาทเด่นข้อใด',
    options: [
      'ดูดซึมขั้นท้ายและทำให้อุจจาระก่อตัวก่อนเข้าสู่ rectum',
      'เป็นตำแหน่งหลักของการหลั่งกรดและ activation ของ gastric enzyme',
      'เป็นแหล่งสร้าง bile และเก็บน้ำดีก่อนปล่อยเข้าสู่ duodenum',
      'เป็นตำแหน่งที่ดูดซึม amino acid และ fatty acid ส่วนใหญ่ผ่าน villi',
    ],
    answer: 0,
    explain: 'Small colon ซึ่งต่อจาก transverse และ descending colon ทำหน้าที่ดูดซึมขั้นท้ายและก่อรูปร่างอุจจาระ ก่อนส่งไป rectum\n\n❌ ทำไมข้ออื่นผิด\n— การหลั่งกรดเป็นหน้าที่ของ glandular stomach\n— ม้าไม่มี gallbladder และ bile สร้างจากตับ\n— การดูดซึมสารอาหารผ่าน villi เด่นที่ small intestine\n\n💡 Small colon จัดรูปก้อนอุจจาระ ส่วน rectum เป็นช่วงสุดท้าย',
    source: 'Equine GI I 5th year 1-2026',
    verified: 'Equine Medicine 3106510 — Equine GI I 5th year 1-2026, p.15',
    sourceType: 'lecture-derived',
    examScope: 'midterm',
    curriculumVersion: '2569-1',
    answerStatus: 'verified',
    predictionTier: 'medium',
    predictionSignals: ['current-lecture'],
  },
  {
    id: 107414,
    subject: 'equine-medicine',
    topic: 'equine-gi',
    year: 5,
    type: 'mcq',
    tags: ['abdominal-radiography', 'sand-colic', 'enterolith'],
    q: 'ข้อใดอธิบายบทบาทของ abdominal radiography ในม้า colic ได้ถูกต้องที่สุด',
    options: [
      'เป็นการตรวจหลักของม้าโตทุกเคสและใช้เห็น soft-tissue displacement ได้ดีที่สุด',
      'จำกัดในม้าโต แต่ช่วยหา sand หรือ enterolith และมีประโยชน์กว่าในลูกม้า',
      'ใช้แทน rectal palpation และ ultrasonography ได้เมื่อไม่พบ gastric reflux',
      'ใช้ได้เฉพาะ contrast study และห้ามถ่าย lateral หรือ ventrodorsal view',
      'ไม่มีบทบาทใน meconium impaction หรือการประเมิน intestinal patency',
    ],
    answer: 1,
    explain: 'Radiography มีข้อจำกัดในม้าโตจากขนาดลำตัว แต่เหมาะกับการหา sand accumulation และ enterolith และมีประโยชน์มากขึ้นใน foal หรือม้าขนาดเล็ก Contrast study ช่วยประเมิน meconium impaction, patency และ gastric emptying ได้\n\n❌ ทำไมข้ออื่นผิด\n— ไม่ใช่การตรวจหลักที่เห็น displacement ได้ดีที่สุดในม้าโตทุกตัว\n— ไม่ได้แทน rectal palpation หรือ ultrasound\n— Lateral และ ventrodorsal เป็น view ที่ใช้ได้\n— Contrast radiography มีบทบาทกับ meconium และ patency\n\n💡 ม้าโตถ่ายยาก แต่ sand กับ enterolith ยังเป็นเป้าหมายสำคัญ',
    source: 'Equine GI I 5th year 1-2026',
    verified: 'Equine Medicine 3106510 — Equine GI I 5th year 1-2026, p.24',
    sourceType: 'lecture-derived',
    examScope: 'midterm',
    curriculumVersion: '2569-1',
    answerStatus: 'verified',
    predictionTier: 'medium',
    predictionSignals: ['current-lecture'],
  },
  {
    id: 107415,
    subject: 'equine-medicine',
    topic: 'equine-gi',
    year: 5,
    type: 'mcq',
    tags: ['rectal-palpation', 'mild-colic', 'diagnostic-sensitivity'],
    q: 'ในม้า mild colic ที่ผล nasogastric intubation ไม่เด่น การตรวจใดอาจไวกว่าในการหาความผิดปกติของลำไส้',
    options: [
      'ทำ nasogastric intubation ซ้ำอย่างเดียวเพื่อระบุตำแหน่ง colon displacement',
      'ถ่าย abdominal radiograph เพื่อยืนยัน soft-tissue displacement ทุกชนิด',
      'Transrectal palpation เพื่อหา impaction, distension หรือ displacement',
      'ทำ abdominocentesis เพื่อระบุตำแหน่ง foreign body โดยตรง',
    ],
    answer: 2,
    explain: 'Transrectal palpation อาจไวกว่า NG intubation ใน mild colic และช่วยพบ large-intestinal impaction, small-intestinal distension, colon displacement หรือ foreign body ได้ แม้ต้องอาศัยประสบการณ์ผู้ตรวจ\n\n❌ ทำไมข้ออื่นผิด\n— NG intubation ประเมิน gastric content หรือ reflux แต่ไม่ได้ระบุตำแหน่ง colon displacement\n— Radiography มีข้อจำกัดในม้าโตและเด่นกับ sand หรือ enterolith มากกว่า\n— Abdominocentesis ประเมิน peritoneal fluid ไม่ได้ชี้ตำแหน่ง foreign body โดยตรง\n\n💡 NG ดูกระเพาะและ reflux ส่วน rectal palpation คลำตำแหน่งลำไส้',
    source: 'Equine GI I 5th year 1-2026',
    verified: 'Equine Medicine 3106510 — Equine GI I 5th year 1-2026, p.25',
    sourceType: 'lecture-derived',
    examScope: 'midterm',
    curriculumVersion: '2569-1',
    answerStatus: 'verified',
    predictionTier: 'medium',
    predictionSignals: ['current-lecture'],
  },
  {
    id: 107416,
    subject: 'equine-medicine',
    topic: 'equine-colic-bestfit',
    year: 5,
    type: 'mcq',
    tags: ['composite-colic-score', 'heart-rate', 'severity-score'],
    q: 'ตาม Composite Colic Score ม้า colic ที่มี heart rate 92 ครั้งต่อนาทีได้คะแนนหัวข้อนี้เท่าใด',
    options: [
      '2 คะแนน เพราะ heart rate มากกว่า 80 ครั้งต่อนาที',
      '1 คะแนน เพราะ heart rate อยู่ในช่วง 45-80 ครั้งต่อนาที',
      '0 คะแนน เพราะ heart rate ยังอยู่ในช่วงปกติ 20-44 ครั้งต่อนาที',
      'ไม่นำ heart rate มาใช้ใน Composite Colic Score',
    ],
    answer: 0,
    explain: 'เกณฑ์ CCS ให้ heart rate 20-44 เท่ากับ 0 คะแนน, 45-80 เท่ากับ 1 คะแนน และมากกว่า 80 เท่ากับ 2 คะแนน ดังนั้น 92 ครั้งต่อนาทีได้ 2 คะแนน\n\n❌ ทำไมข้ออื่นผิด\n— ช่วง 45-80 เท่านั้นที่ได้ 1 คะแนน\n— 92 สูงกว่าช่วงปกติ 20-44\n— Heart rate เป็นองค์ประกอบโดยตรงของ CCS\n\n💡 HR เกิน 80 เข้าช่องคะแนน 2',
    source: 'Equine GI I 5th year 1-2026',
    verified: 'Equine Medicine 3106510 — Equine GI I 5th year 1-2026, p.27',
    sourceType: 'lecture-derived',
    examScope: 'midterm',
    curriculumVersion: '2569-1',
    answerStatus: 'verified',
    predictionTier: 'medium',
    predictionSignals: ['current-lecture'],
  },
  {
    id: 107417,
    subject: 'equine-medicine',
    topic: 'equine-colic-bestfit',
    year: 5,
    type: 'mcq',
    tags: ['composite-colic-score', 'blood-lactate', 'severity-score'],
    q: 'ม้า colic มี blood lactate 4.2 mmol/L ค่านี้ได้กี่คะแนนใน Composite Colic Score',
    options: [
      '0 คะแนน เพราะต่ำกว่า 2 mmol/L',
      '1 คะแนน เพราะอยู่ในช่วง 2.1-5 mmol/L',
      '2 คะแนน เพราะสูงกว่า 5 mmol/L',
      'ไม่สามารถให้คะแนนจาก blood lactate ได้',
    ],
    answer: 1,
    explain: 'Blood lactate ต่ำกว่า 2 mmol/L ได้ 0 คะแนน, 2.1-5 mmol/L ได้ 1 คะแนน และมากกว่า 5 mmol/L ได้ 2 คะแนน ค่า 4.2 จึงได้ 1 คะแนน\n\n❌ ทำไมข้ออื่นผิด\n— 4.2 ไม่ต่ำกว่า 2\n— ยังไม่มากกว่า 5\n— Blood lactate เป็นองค์ประกอบของ CCS โดยตรง\n\n💡 Lactate 2.1 ถึง 5 อยู่ช่องกลาง',
    source: 'Equine GI I 5th year 1-2026',
    verified: 'Equine Medicine 3106510 — Equine GI I 5th year 1-2026, p.28',
    sourceType: 'lecture-derived',
    examScope: 'midterm',
    curriculumVersion: '2569-1',
    answerStatus: 'verified',
    predictionTier: 'medium',
    predictionSignals: ['current-lecture'],
  },
  {
    id: 107418,
    subject: 'equine-medicine',
    topic: 'equine-colic-bestfit',
    year: 5,
    type: 'mcq',
    tags: ['composite-colic-score', 'small-intestine', 'ultrasonography'],
    q: 'Abdominal ultrasonography พบ small-intestinal diameter 6 เซนติเมตร ผลนี้ได้กี่คะแนนใน Composite Colic Score',
    options: [
      '0 คะแนน เพราะถือเป็น non-remarkable finding',
      '1 คะแนน เพราะ small intestine มีเส้นผ่านศูนย์กลางต่ำกว่า 5 เซนติเมตร',
      '2 คะแนน เพราะ small intestine กว้างมากกว่า 5 เซนติเมตร',
      'ไม่อยู่ในระบบคะแนน เพราะ CCS ใช้เฉพาะ physical examination',
    ],
    answer: 2,
    explain: 'CCS ให้ ultrasound แบบ non-remarkable 0 คะแนน, remarkable ที่ SI diameter ต่ำกว่า 5 เซนติเมตร 1 คะแนน และ SI diameter มากกว่า 5 เซนติเมตร 2 คะแนน ดังนั้น 6 เซนติเมตรได้ 2 คะแนน\n\n❌ ทำไมข้ออื่นผิด\n— SI 6 เซนติเมตรไม่ใช่ผลปกติ\n— เกณฑ์ 1 คะแนนต้องต่ำกว่า 5 เซนติเมตร\n— CCS รวม lab และ advanced diagnostics ด้วย\n\n💡 SI มากกว่า 5 เซนติเมตรอยู่ช่องรุนแรงสุดของตารางนี้',
    source: 'Equine GI I 5th year 1-2026',
    verified: 'Equine Medicine 3106510 — Equine GI I 5th year 1-2026, p.28',
    sourceType: 'lecture-derived',
    examScope: 'midterm',
    curriculumVersion: '2569-1',
    answerStatus: 'verified',
    predictionTier: 'medium',
    predictionSignals: ['current-lecture'],
  },
  {
    id: 107419,
    subject: 'equine-medicine',
    topic: 'equine-colic-bestfit',
    year: 5,
    type: 'mcq',
    tags: ['composite-colic-score', 'fecal-output', 'severity-score'],
    q: 'ม้า colic ไม่ถ่ายอุจจาระต่อเนื่องครบ 72 ชั่วโมง เกณฑ์ fecal output ใน Composite Colic Score ให้เท่าใด',
    options: [
      '0 คะแนน เพราะยังไม่เกิน 24 ชั่วโมง',
      '1 คะแนน เพราะไม่พบอุจจาระภายใน 24 ชั่วโมง',
      'ไม่นับคะแนนจนกว่าจะครบ 96 ชั่วโมง',
      '2 คะแนน เพราะไม่พบอุจจาระภายใน 72 ชั่วโมง',
    ],
    answer: 3,
    explain: 'Fecal output ที่พบภายใน 24 ชั่วโมงได้ 0 คะแนน, ไม่พบภายใน 24 ชั่วโมงได้ 1 คะแนน และไม่พบภายใน 72 ชั่วโมงได้ 2 คะแนน\n\n❌ ทำไมข้ออื่นผิด\n— ครบ 72 ชั่วโมงเกินช่วง 0 คะแนนแล้ว\n— 1 คะแนนเป็นเกณฑ์ช่วง 24 ชั่วโมง\n— ตารางไม่ได้รอถึง 96 ชั่วโมง\n\n💡 ไม่ถ่ายถึง 72 ชั่วโมงได้คะแนน 2',
    source: 'Equine GI I 5th year 1-2026',
    verified: 'Equine Medicine 3106510 — Equine GI I 5th year 1-2026, p.28',
    sourceType: 'lecture-derived',
    examScope: 'midterm',
    curriculumVersion: '2569-1',
    answerStatus: 'verified',
    predictionTier: 'medium',
    predictionSignals: ['current-lecture'],
  },
  {
    id: 107420,
    subject: 'equine-medicine',
    topic: 'equine-colic-bestfit',
    year: 5,
    type: 'mcq',
    tags: ['abdominocentesis', 'needle-placement', 'colic-diagnostics'],
    q: 'การทำ abdominocentesis ในม้า ตำแหน่งและเข็มคู่ใดตรงกับเทคนิคที่สอนไว้',
    options: [
      'กึ่งกลางสะดือ ใช้เข็ม 14G ยาว 5 นิ้วเป็นมาตรฐานทุกตัว',
      'ชิด left paralumbar fossa ใช้เข็ม 20G ยาวครึ่งนิ้ว',
      'หน้า xiphoid 10 เซนติเมตร ใช้เข็ม 16G ยาว 3 นิ้ว',
      'หลัง xiphoid 20 เซนติเมตรและซ้าย midline 15 เซนติเมตร ใช้ trocar',
      'หลัง xiphoid 10 ซม., ขวา midline 5-10 ซม.; เข็ม 18G × 1.5 นิ้ว',
    ],
    answer: 4,
    explain: 'ตำแหน่งที่ใช้คือประมาณ 10 เซนติเมตร caudal ต่อ xiphoid และ 5-10 เซนติเมตรทางขวาของ midline หลังเตรียม aseptic ใช้เข็ม 18G × 1.5 นิ้วได้ในม้าส่วนใหญ่\n\n❌ ทำไมข้ออื่นผิด\n— ตำแหน่งสะดือและเข็ม 14G ยาวไม่ใช่คู่มาตรฐานที่ระบุ\n— Left paralumbar fossa ไม่ใช่ ventral sampling site นี้\n— ต้องอยู่ caudal ไม่ใช่ cranial ต่อ xiphoid\n— ระยะ 20 และ 15 เซนติเมตรพร้อม trocar ไม่ตรงเทคนิคนี้\n\n💡 จำ 10 หลัง xiphoid, 5-10 ขวา midline, 18G × 1.5 นิ้ว',
    source: 'Equine GI I 5th year 1-2026',
    verified: 'Equine Medicine 3106510 — Equine GI I 5th year 1-2026, p.30',
    sourceType: 'lecture-derived',
    examScope: 'midterm',
    curriculumVersion: '2569-1',
    answerStatus: 'verified',
    predictionTier: 'medium',
    predictionSignals: ['current-lecture'],
  },
  {
    id: 107421,
    subject: 'equine-medicine',
    topic: 'equine-colic-bestfit',
    year: 5,
    type: 'mcq',
    tags: ['peritoneal-fluid', 'intestinal-rupture', 'abdominocentesis'],
    q: 'Peritoneal fluid จากม้า colic มีสีคล้ำ เป็น flocculent และมีกลิ่นเหม็น ควรตีความอย่างไร',
    options: [
      'สงสัย intestinal contents จาก enterocentesis หรือ GI rupture',
      'เป็น transudate ปกติที่ควรใสถึงเหลืองอ่อนและไม่มีกลิ่น',
      'ชี้ว่าแทงม้ามโดยบังเอิญเพราะของเหลวมี PCV สูงเพียงอย่างเดียว',
      'เป็นผลเฉพาะของ iatrogenic bleeding ที่ให้ของเหลวแดงใสแต่ไม่เหม็น',
    ],
    answer: 0,
    explain: 'ของเหลวที่ dark, flocculent และ foul smelling สื่อถึง intestinal contents จึงต้องสงสัย enterocentesis หรือ gastrointestinal rupture ซึ่งเป็นภาวะรุนแรง\n\n❌ ทำไมข้ออื่นผิด\n— ของเหลวปกติควรใสถึงเหลืองอ่อน\n— Splenic puncture เด่นที่ PCV สูง ไม่ใช่สิ่งปนเปื้อนเหม็นเป็น flocculent\n— Iatrogenic bleeding ให้ลักษณะ bloody หรือ red-tinged มากกว่า\n\n💡 คล้ำ เป็นก้อน และเหม็น ให้คิดถึง intestinal contents',
    source: 'Equine GI I 5th year 1-2026',
    verified: 'Equine Medicine 3106510 — Equine GI I 5th year 1-2026, p.31',
    sourceType: 'lecture-derived',
    examScope: 'midterm',
    curriculumVersion: '2569-1',
    answerStatus: 'verified',
    predictionTier: 'medium',
    predictionSignals: ['current-lecture'],
  },
  {
    id: 107422,
    subject: 'equine-medicine',
    topic: 'equine-colic-bestfit',
    year: 5,
    type: 'mcq',
    tags: ['peritoneal-fluid', 'splenic-puncture', 'pcv'],
    q: 'การเจาะช่องท้องม้าได้ fluid ที่มี PCV สูงผิดปกติ แต่ไม่มีลักษณะ intestinal contents ควรสงสัยภาวะใดจากขั้นตอนเก็บตัวอย่าง',
    options: [
      'Gastric reflux ไหลย้อนผ่านตำแหน่งเจาะ',
      'ควรพิจารณา splenic puncture จากเข็มแทงม้ามขณะเก็บตัวอย่าง',
      'Peritonitis ซึ่งควรให้ fluid สี dark yellow หรือ orange และขุ่น',
      'Intestinal rupture ซึ่งควรให้ fluid คล้ำ เป็น flocculent และมีกลิ่น',
    ],
    answer: 1,
    explain: 'Peritoneal fluid ที่มี PCV สูงทำให้ควรพิจารณา splenic puncture ซึ่งเป็น sampling complication จากเข็มแทงม้าม แต่ยังต้องแปลผลร่วมกับข้อมูลอื่นแทนการยืนยันจาก PCV เดี่ยว\n\n❌ ทำไมข้ออื่นผิด\n— Gastric reflux ประเมินผ่าน NG tube ไม่ใช่ลักษณะ fluid จากช่องท้อง\n— Peritonitis เด่นที่ fluid สี dark yellow หรือ orange และขุ่น\n— Intestinal contents ให้ fluid คล้ำ เป็น flocculent และมีกลิ่นเหม็น\n\n💡 PCV สูงจากตัวอย่าง ให้คิดถึง spleen ก่อนสรุปว่าเลือดออกในช่องท้อง',
    source: 'Equine GI I 5th year 1-2026',
    verified: 'Equine Medicine 3106510 — Equine GI I 5th year 1-2026, p.31',
    sourceType: 'lecture-derived',
    examScope: 'midterm',
    curriculumVersion: '2569-1',
    answerStatus: 'verified',
    predictionTier: 'medium',
    predictionSignals: ['current-lecture'],
  },
  {
    id: 107423,
    subject: 'equine-medicine',
    topic: 'equine-colic-bestfit',
    year: 5,
    type: 'mcq',
    tags: ['oral-fluid-therapy', 'non-reflux-colic', 'large-colon-impaction'],
    q: 'ม้า 500 กิโลกรัมเป็น large-colon impaction และไม่มี gastric reflux แผน oral fluid therapy ใดเหมาะสมที่สุด',
    options: [
      'น้ำ 1 ลิตรทาง NG tube วันละครั้ง และงด electrolyte ทุกชนิด',
      'น้ำ 20 ลิตรทางปากทุกชั่วโมงโดยไม่ต้องติดตาม reflux ซ้ำ',
      'น้ำ/electrolyte 4-6 ลิตรทาง NG ทุก 4 ชม. เพื่อ hydrate ingesta',
      'ให้ hypertonic saline ทาง NG tube แทน IV fluid ในม้าที่ขาดน้ำรุนแรง',
    ],
    answer: 2,
    explain: 'ใน non-reflux colic การให้ water หรือ electrolyte 4-6 ลิตรต่อม้า 500 กิโลกรัมผ่าน NG tube ทุก 4 ชั่วโมงช่วยกระตุ้น gastrocolic reflex และเพิ่มน้ำใน ingesta ของ large-colon impaction\n\n❌ ทำไมข้ออื่นผิด\n— 1 ลิตรวันละครั้งต่ำกว่าปริมาณและความถี่ที่ระบุ\n— 20 ลิตรทุกชั่วโมงมากเกินและไม่ควรละเลยการติดตาม reflux\n— Hypertonic saline ใช้ทาง IV ไม่ใช่ NG replacement ตามแผนนี้\n\n💡 Oral fluids เหมาะเมื่อไม่มี reflux และต้องประเมินซ้ำ',
    source: 'Equine GI II 5th year 1-2026',
    verified: 'Equine Medicine 3106510 — Equine GI II 5th year 1-2026, p.2',
    sourceType: 'lecture-derived',
    examScope: 'midterm',
    curriculumVersion: '2569-1',
    answerStatus: 'verified',
    predictionTier: 'medium',
    predictionSignals: ['current-lecture'],
  },
  {
    id: 107424,
    subject: 'equine-medicine',
    topic: 'equine-colic-bestfit',
    year: 5,
    type: 'mcq',
    tags: ['maintenance-fluid', 'adult-horse', 'foal'],
    q: 'ข้อใดจับคู่ maintenance IV fluid rate ของม้าโตและลูกม้าได้ถูกต้อง',
    options: [
      'ม้าโต 25 mL/kg/day และลูกม้า 50 mL/kg/day',
      'ม้าโต 50 mL/kg/hour และลูกม้า 110 mL/kg/hour',
      'ม้าโต 110 mL/kg/day และลูกม้า 50 mL/kg/day',
      'ม้าโต 50 mL/kg/day และลูกม้า 110 mL/kg/day',
    ],
    answer: 3,
    explain: 'Maintenance rate คือ adult horse 50 mL/kg/day และ foal 110 mL/kg/day โดยต้องประเมิน dehydration และหลีกเลี่ยง overfluid ที่ทำให้ tissue edema\n\n❌ ทำไมข้ออื่นผิด\n— 25 กับ 50 ต่ำกว่าคู่ค่าที่กำหนด\n— หน่วยต้องเป็นต่อวัน ไม่ใช่ต่อชั่วโมง\n— 110 กับ 50 สลับค่าม้าโตกับลูกม้า\n\n💡 Foal ต้องการ maintenance ต่อกิโลกรัมมากกว่าม้าโต',
    source: 'Equine GI II 5th year 1-2026',
    verified: 'Equine Medicine 3106510 — Equine GI II 5th year 1-2026, p.2',
    sourceType: 'lecture-derived',
    examScope: 'midterm',
    curriculumVersion: '2569-1',
    answerStatus: 'verified',
    predictionTier: 'medium',
    predictionSignals: ['current-lecture'],
  },
  {
    id: 107425,
    subject: 'equine-medicine',
    topic: 'equine-colic-bestfit',
    year: 5,
    type: 'mcq',
    tags: ['flunixin-meglumine', 'strangulating-lesion', 'pain-masking'],
    q: 'เหตุใด flunixin meglumine จึงไม่ควรใช้เป็นเครื่องมือวินิจฉัยความรุนแรงของ early strangulating colic',
    options: [
      'เป็น short-acting alpha-2 agonist ที่หมดฤทธิ์ภายใน 30 นาที',
      'เป็น smooth-muscle relaxant ที่ใช้เฉพาะ spasmodic colic',
      'มีข้อจำกัดหลักจาก perivascular irritation เช่นเดียวกับ phenylbutazone',
      'ไม่มี analgesic effect ในผู้ป่วยที่มีอาการปวดเล็กน้อยถึงปานกลาง',
      'ระงับปวดแรงและบัง heart-rate rise จาก SIRS จนประเมินโรคต่ำกว่าจริง',
    ],
    answer: 4,
    explain: 'Flunixin ให้ analgesia ที่แรงและนานราว 12 ชั่วโมง รวมทั้งบังการเพิ่ม heart rate จาก SIRS หรือ endotoxemia จึงอาจซ่อนความรุนแรงของ early strangulating lesion และไม่ควรใช้ตอบคำถามวินิจฉัย\n\n❌ ทำไมข้ออื่นผิด\n— Alpha-2 agonist เป็นอีกกลุ่มหนึ่งที่ออกฤทธิ์สั้นถึงราว 30 นาที\n— Butylscopolamine หรือ Buscopan เป็น smooth-muscle relaxant สำหรับ spasmodic colic\n— Perivascular irritation เป็นข้อควรระวังที่ระบุของ phenylbutazone\n— Flunixin มี analgesic effect สูง ไม่ใช่ไม่มีฤทธิ์ระงับปวด\n\n💡 Pain หาย ไม่ได้แปลว่า lesion ดีขึ้น',
    source: 'Equine GI II 5th year 1-2026',
    verified: 'Equine Medicine 3106510 — Equine GI II 5th year 1-2026, p.3',
    sourceType: 'lecture-derived',
    examScope: 'midterm',
    curriculumVersion: '2569-1',
    answerStatus: 'verified',
    predictionTier: 'medium',
    predictionSignals: ['current-lecture'],
  },
  {
    id: 107426,
    subject: 'equine-medicine',
    topic: 'equine-colic-bestfit',
    year: 5,
    type: 'mcq',
    tags: ['large-colon-distension', 'colon-displacement', 'initial-treatment'],
    q: 'ม้ามี large-colon distension หรือ displacement อาการปวดเล็กน้อยถึงปานกลาง แนวทางเริ่มต้นใดเหมาะสม',
    options: [
      'เริ่ม medical therapy และอาจให้เดินเบา ๆ พร้อมติดตามว่าต้องผ่าตัดหรือไม่',
      'ทำ euthanasia ทันทีเพราะ displacement ทุกชนิดแก้ด้วยยาไม่ได้',
      'งดการรักษาและปล่อยให้ออกกำลังหนักเพื่อกระตุ้นการเคลื่อนลำไส้',
      'ให้ grain ปริมาณมากเพื่อเพิ่ม fecal bulk แล้วประเมินอีกหนึ่งสัปดาห์',
    ],
    answer: 0,
    explain: 'Large-colon distension หรือ displacement ที่มีอาการ mild ถึง moderate สามารถเริ่ม medical therapy และ light exercise ได้ แต่ต้องติดตามเพราะบางรายยังจำเป็นต้องผ่าตัด\n\n❌ ทำไมข้ออื่นผิด\n— ไม่ใช่ทุก displacement ที่ต้อง euthanasia ทันที\n— การออกกำลังหนักไม่ใช่ light exercise และอาจเพิ่มความเสี่ยง\n— Grain ปริมาณมากไม่ใช่การแก้ภาวะนี้และการรอหนึ่งสัปดาห์ไม่เหมาะกับ colic\n\n💡 เริ่มรักษาแบบ conservative ได้ แต่ต้องเฝ้าดูทางไป surgery',
    source: 'Equine GI II 5th year 1-2026',
    verified: 'Equine Medicine 3106510 — Equine GI II 5th year 1-2026, p.8',
    sourceType: 'lecture-derived',
    examScope: 'midterm',
    curriculumVersion: '2569-1',
    answerStatus: 'verified',
    predictionTier: 'medium',
    predictionSignals: ['current-lecture'],
  },
  {
    id: 107427,
    subject: 'equine-medicine',
    topic: 'equine-colic-bestfit',
    year: 5,
    type: 'mcq',
    tags: ['sand-colic', 'seashore-sound', 'management'],
    q: 'ม้าเลี้ยงบนพื้นทรายมี recurrent mild colic และท้องเสีย ได้ยินเสียงคล้ายคลื่นทะเลเมื่อฟังท้อง การจัดการใดตรงกับ sand colic มากที่สุด',
    options: [
      'เพิ่ม grain ลด forage และให้ม้าวิ่งบนลานทรายหลังอาหาร',
      'เอาแหล่งทรายออกและให้ forage เพียงพอ พร้อมประเมินทรายในอุจจาระ',
      'จำกัดน้ำเพื่อไม่ให้ทรายใน colon จับตัวเป็นก้อนขนาดใหญ่',
      'รักษาด้วยยาปฏิชีวนะอย่างเดียวเพราะเสียงดังกล่าวจำเพาะต่อ bacterial enteritis',
    ],
    answer: 1,
    explain: 'Sand colic สัมพันธ์กับ sandy soil, poor grazing และ turnout บนทราย ทำให้ท้องเสีย recurrent mild colic และได้ยิน seashore sound การจัดการสำคัญคือกำจัดแหล่งทรายและให้ forage เพียงพอ\n\n❌ ทำไมข้ออื่นผิด\n— Grain มากและ forage น้อยเพิ่มความเสี่ยงทาง GI\n— การจำกัดน้ำไม่ช่วยขับทรายและเพิ่มความเสี่ยง impaction\n— Seashore sound ไม่ได้ชี้ bacterial enteritis และยาปฏิชีวนะอย่างเดียวไม่แก้แหล่งโรค\n\n💡 ได้ยินทะเลในท้อง ให้มองหาทรายในสิ่งแวดล้อมและอุจจาระ',
    source: 'Equine GI II 5th year 1-2026',
    verified: 'Equine Medicine 3106510 — Equine GI II 5th year 1-2026, p.9',
    sourceType: 'lecture-derived',
    examScope: 'midterm',
    curriculumVersion: '2569-1',
    answerStatus: 'verified',
    predictionTier: 'medium',
    predictionSignals: ['current-lecture'],
  },
  {
    id: 107428,
    subject: 'equine-medicine',
    topic: 'equine-colic-bestfit',
    year: 5,
    type: 'mcq',
    tags: ['eggd', 'gastroscopy', 'lesion-description'],
    q: 'การบันทึกรอยโรค equine glandular gastric disease (EGGD) ข้อใดเหมาะสม',
    options: [
      'ให้ ESGD grade 0-4 ทุกครั้งโดยไม่ต้องบอกตำแหน่งหรือรูปร่างรอยโรค',
      'เรียกทุกรอยโรคว่า deep ulcer เพราะ glandular mucosa ไม่มี inflammation',
      'บรรยาย flat, raised, depressed, reddened หรือ bleeding แทน ESGD grade',
      'จัดเป็น ESGD grade 1 เมื่อมีเลือดออก และ grade 4 เมื่อมีเพียงรอยแดง',
    ],
    answer: 2,
    explain: 'EGGD ไม่ได้เป็น true ulcer ทุกกรณีและไม่ควรใช้ ESGD score แบบเดียวกัน จึงต้องบรรยาย appearance เช่น flat, raised, depressed, reddened หรือ bleeding รวมทั้งตำแหน่งของรอยโรค\n\n❌ ทำไมข้ออื่นผิด\n— ESGD grading ใช้กับ squamous mucosa ไม่ใช่ EGGD โดยตรง\n— Glandular lesion อาจเป็น gastritis หรือ mucosal inflammation ไม่ใช่ deep ulcer ทั้งหมด\n— การสลับ grade จากเลือดออกหรือรอยแดงไม่ใช่ระบบ grading ของ EGGD\n\n💡 ESGD ให้ grade แต่ EGGD ให้คำบรรยายรอยโรค',
    source: 'Equine GI II 5th year 1-2026',
    verified: 'Equine Medicine 3106510 — Equine GI II 5th year 1-2026, p.15',
    sourceType: 'lecture-derived',
    examScope: 'midterm',
    curriculumVersion: '2569-1',
    answerStatus: 'verified',
    predictionTier: 'medium',
    predictionSignals: ['current-lecture'],
  },
  {
    id: 107429,
    subject: 'equine-medicine',
    topic: 'equine-colic-bestfit',
    year: 5,
    type: 'mcq',
    tags: ['esgd', 'omeprazole', 'administration-timing'],
    q: 'แผนให้ omeprazole เพื่อรักษา ESGD ข้อใดเหมาะสมที่สุด',
    options: [
      '1 mg/kg พร้อมอาหารข้นวันเว้นวัน 7 วัน แล้วหยุดทันที',
      '2 mg/kg หลัง hay ทันทีวันละสองครั้ง 14 วัน โดยไม่ต้องใช้ protected formulation',
      '6.6 mg/kg ทุก 8 ชั่วโมงพร้อม grain เป็นเวลา 28 วัน',
      '4 mg/kg ทางปากวันละครั้ง 28 วัน ขณะท้องว่าง รอ 60 นาทีก่อนให้ hay',
    ],
    answer: 3,
    explain: 'การรักษา ESGD ใช้ omeprazole protected formulation 4 mg/kg PO SID นาน 28 วัน ให้ขณะท้องว่างและรอ 60 นาทีก่อน hay จากนั้นจึงให้ grain หลัง hay เป้าหมายคือคง gastric pH มากกว่า 4 อย่างน้อย 16 ชั่วโมงต่อวัน\n\n❌ ทำไมข้ออื่นผิด\n— ขนาด 1 mg/kg วันเว้นวันและ 7 วันไม่ตรง regimen\n— ไม่ควรให้หลัง hay ทันทีและ protected formulation มีผลต่อการดูดซึม\n— 6.6 mg/kg q8h เป็นขนาด ranitidine ตาม regimen นี้ ไม่ใช่ omeprazole\n\n💡 Omeprazole 4-28-60 คือ 4 mg/kg, 28 วัน, รอ hay 60 นาที',
    source: 'Equine GI II 5th year 1-2026',
    verified: 'Equine Medicine 3106510 — Equine GI II 5th year 1-2026, p.16',
    sourceType: 'lecture-derived',
    examScope: 'midterm',
    curriculumVersion: '2569-1',
    answerStatus: 'verified',
    predictionTier: 'medium',
    predictionSignals: ['current-lecture'],
  },
  {
    "id": 216000,
    "subject": "equine-medicine",
    "topic": "equine-infectious",
    "year": 5,
    "type": "mcq",
    "q": "พบม้าป่วย African horse sickness (AHS) ในสองฟาร์มที่อยู่ไกลจากพื้นที่ระบาดเกินระยะที่ริ้นบินไปถึงได้เอง ทั้งที่ห้ามเคลื่อนย้ายม้าออกจากพื้นที่ระบาดแล้ว สอบประวัติพบว่าทั้งสองฟาร์มรับหญ้าจากรถขนหญ้าคันเดียวกันที่วิ่งออกมาจากพื้นที่ระบาด มาตรการใดตรงกับเส้นทางแพร่โรคนี้มากที่สุด",
    "options": [
      "พ่นยาฆ่าแมลงในรถทุกคันที่ออกจากพื้นที่ระบาด ทั้งในห้องโดยสารและรอบตัวรถ",
      "จุ่มล้อรถและรองเท้าบูทในน้ำยาฆ่าเชื้อก่อนเข้าออกฟาร์ม แบบเดียวกับการคุม FMD",
      "ฉีดวัคซีนเชื้อเป็นให้ม้าทุกตัวในสองฟาร์มนั้น รวมทั้งตัวที่ป่วยอยู่แล้ว",
      "กางมุ้งกันยุงแบบตาข่ายธรรมดาให้ม้าทุกตัวในสองฟาร์มนั้น"
    ],
    "answer": 0,
    "explain": "AHS แพร่ผ่านแมลงพาหะ โดยพาหะหลักคือริ้น (Culicoides) ไม่ได้ติดจากม้าสู่ม้าโดยตรง และไม่ติดไปกับดิน ล้อรถ หรือรองเท้า เมื่อห้ามเคลื่อนย้ายม้าแล้วยังพบม้าป่วยในที่ไกลออกไป เส้นทางที่เหลือคือริ้นที่มีเชื้อติดไปกับยานพาหนะที่ออกจากพื้นที่ระบาด มาตรการที่ตัดเส้นทางนี้ได้คือพ่นยาฆ่าแมลงในรถทุกคันก่อนออกจากพื้นที่ ร่วมกับควบคุมพาหะในพื้นที่ระบาดด้วยมุ้งตาถี่และยาฆ่าแมลง เช่น cypermethrin หรือ etofenprox\n\n❌ ทำไมข้ออื่นผิด\n— จุ่มล้อรถและรองเท้าบูทแบบคุม FMD: ใช้กับเชื้อที่ติดไปกับสิ่งปนเปื้อน แต่ AHS ไม่ได้แพร่ทางล้อหรือรองเท้า จึงไม่ได้ตัดเส้นทางที่ริ้นติดไปกับรถ\n— ฉีดวัคซีนเชื้อเป็นรวมทั้งตัวที่ป่วย: วัคซีน AHS เป็น live attenuated ซึ่งเสี่ยง reversion to virulence และ reassortment กับเชื้อในพื้นที่ จึงฉีดเฉพาะม้าที่ยังไม่ติดเชื้อในเขต protection zone\n— มุ้งกันยุงตาข่ายธรรมดา: ริ้นตัวเล็กจนลอดตาข่ายของมุ้งกันยุงธรรมดาได้ ต้องใช้มุ้งตาถี่ และมาตรการที่ฟาร์มปลายทางไม่ได้ตัดเส้นทางผ่านรถขนหญ้า",
    "source": "14B7TUfov00 [33:44], [37:14-38:51], [40:35-45:16]; Eq Infectious Dz and Biosecurity หน้า 9, 13, 15",
    "verified": "Eq Infectious Dz and Biosecurity หน้า 9 (Culicoides spp. are the primary vector), 13 (vaccinate non-infected horses in the protection zone; net and insecticide), 15 (net, cypermethrin, etofenprox); 14B7TUfov00 [43:08-45:16] (รถขนหญ้าคันเดียวกันพาริ้นไป แก้ด้วยพ่นยาในรถ ไม่ใช่จุ่มล้อหรือรองเท้าแบบ FMD), [33:44] (มุ้งตาถี่)",
    "sourceType": "lecture-derived",
    "examOrigin": "เขียนขึ้นจากเลคเชอร์ Equine Medicine ปี 2569 เรื่อง infectious diseases and biosecurity",
    "tags": [
      "equine-infectious",
      "ahs-vector-control"
    ],
    "sourcePages": [
      {
        "doc": "equine-infectious-2569",
        "edition": "83p",
        "page": 9
      },
      {
        "doc": "equine-infectious-2569",
        "edition": "83p",
        "page": 13
      },
      {
        "doc": "equine-infectious-2569",
        "edition": "83p",
        "page": 15
      }
    ]
  },
  {
    "id": 216001,
    "subject": "equine-medicine",
    "topic": "equine-infectious",
    "year": 5,
    "type": "mcq",
    "q": "ซื้อม้ากระโดดตัวใหม่จากคอกอื่นในประเทศ ผลตรวจ equine infectious anemia (EIA) ด้วย AGID ก่อนเคลื่อนย้ายเป็นลบ ม้าอ้วนสมบูรณ์ ไม่มีไข้ ไม่ซีด เมื่อม้ามาถึงคอกควรจัดการอย่างไร",
    "options": [
      "รวมฝูงได้ทันที เพราะผล AGID ก่อนเคลื่อนย้ายเป็นลบแล้วจึงตัดโรคได้",
      "กักแยกไว้ก่อน แล้วตรวจ AGID ซ้ำเมื่อพ้นอย่างน้อย 21 วันจึงรวมฝูง",
      "ตรวจ AGID ซ้ำภายใน 3 วันแรกหลังมาถึง ถ้ายังเป็นลบก็นำเข้ารวมฝูงได้เลย",
      "ดูสภาพร่างกาย ถ้าไม่ซีดและไม่บวมน้ำก็รวมฝูงได้",
      "ฉีดวัคซีน EIA ให้ครบชุดก่อน แล้วจึงนำเข้ารวมฝูง"
    ],
    "answer": 1,
    "explain": "AGID ตรวจหาแอนติบอดีต่อเชื้อ EIA ม้าที่เพิ่งติดเชื้อจึงยังให้ผลลบอยู่ช่วงหนึ่ง ต้องรอราว 21 วันขึ้นไปกว่าการติดเชื้อจะตรวจพบได้ (บางตัวนานกว่านั้น) ผลลบก่อนเคลื่อนย้ายครั้งเดียวจึงไม่พอ ม้าใหม่ต้องกักแยกแล้วตรวจซ้ำเมื่อพ้นอย่างน้อย 21 วันก่อนรวมฝูง ม้า EIA ชนิด inapparent ไม่แสดงอาการและดูอ้วนสมบูรณ์ได้ แต่เป็นแหล่งเชื้อให้เหลือบ (Tabanus) และแมลงดูดเลือดนำไปติดตัวอื่น ถ้าผลเป็นบวก EIA เป็นโรคตาม พ.ร.บ.โรคระบาดสัตว์ที่ต้องทำลายม้า\n\n❌ ทำไมข้ออื่นผิด\n— รวมฝูงได้ทันทีเพราะผลก่อนเคลื่อนย้ายเป็นลบ: ม้าอาจติดเชื้อมาไม่นานจนยังตรวจไม่พบ ถ้ารวมฝูงทันที ม้าที่เป็นพาหะจะเป็นแหล่งเชื้อให้ทั้งคอกและงานแข่งที่ไป\n— ตรวจซ้ำภายใน 3 วันแรก: เร็วเกินกว่าที่การติดเชื้อใหม่จะตรวจพบได้ ผลลบช่วงนี้จึงยืนยันอะไรไม่ได้\n— ดูจากสภาพร่างกาย: ม้า EIA ชนิด inapparent ไม่ซีด ไม่บวมน้ำ และดูแข็งแรงได้ ตัดโรคได้ด้วยการตรวจเลือดเท่านั้น\n— ฉีดวัคซีน EIA ก่อนรวมฝูง: การป้องกัน EIA อาศัยการกักโรค ตรวจเลือด และควบคุมแมลง ไม่มีวัคซีน EIA ในโปรแกรมวัคซีนม้าของไทย ซึ่งมี tetanus, Fluvac, rabies และ JE",
    "source": "14B7TUfov00 [58:19-59:31], [60:47-64:14]; Eq Infectious Dz and Biosecurity หน้า 22-24",
    "verified": "14B7TUfov00 [61:12-62:31] (AGID ตรวจพบได้หลังโรคดำเนินไป 21 วัน ม้าใหม่กักแล้วตรวจซ้ำที่ 21 วันขึ้นไป), [59:08-59:31] (inapparent carrier ดูอ้วน ไม่มีอาการ ผลบวกต้องทำลายตาม พ.ร.บ.); Eq Infectious Dz and Biosecurity หน้า 22 (acute, chronic, inapparent), 24 (AGID, ELISA, PCR; euthanasia, quarantine, serodiagnosis testing, fly control)",
    "sourceType": "lecture-derived",
    "examOrigin": "เขียนขึ้นจากเลคเชอร์ Equine Medicine ปี 2569 เรื่อง infectious diseases and biosecurity",
    "tags": [
      "equine-infectious",
      "eia-quarantine-retest"
    ],
    "sourcePages": [
      {
        "doc": "equine-infectious-2569",
        "edition": "83p",
        "page": 22
      },
      {
        "doc": "equine-infectious-2569",
        "edition": "83p",
        "page": 23
      },
      {
        "doc": "equine-infectious-2569",
        "edition": "83p",
        "page": 24
      }
    ]
  },
  {
    "id": 216002,
    "subject": "equine-medicine",
    "topic": "equine-infectious",
    "year": 5,
    "type": "mcq",
    "q": "ในวงจรการติดเชื้อ Japanese encephalitis (JE) ม้ามีบทบาทเป็น host แบบใด",
    "options": [
      "Amplifying host ที่ไวรัสเพิ่มจำนวนในเลือดสูงจนยุงรับเชื้อต่อได้",
      "Natural host ที่ติดเชื้อแล้วไม่ป่วย และเป็นแหล่งเชื้อในธรรมชาติ",
      "Carrier ที่ไม่แสดงอาการ แต่แมลงดูดเลือดนำเชื้อไปติดตัวอื่นได้",
      "Dead-end host ที่ป่วยและตายได้ แต่ไม่ส่งเชื้อต่อให้ตัวอื่น"
    ],
    "answer": 3,
    "explain": "JE เกิดจาก Japanese encephalitis virus ใน Flavivirus มียุง Culex เป็นพาหะ ไวรัสเพิ่มจำนวนมากในสุกร ซึ่งเป็น amplifier สำคัญที่ยุงดูดเลือดแล้วรับเชื้อต่อได้ ม้าและคนเป็น dead-end host คือติดเชื้อแล้วป่วยทางระบบประสาทและตายได้ แต่ไวรัสในเลือดมีน้อยเกินกว่าที่ยุงจะรับเชื้อต่อ ม้าป่วยจึงไม่ใช่แหล่งแพร่โรค ต่างจาก equine influenza ที่ม้าป่วยแพร่เชื้อต่อได้ เมื่อพบม้ามีอาการทางประสาทต้องมี JE ใน differential diagnosis และถามประวัติวัคซีน JE ก่อน\n\n❌ ทำไมข้ออื่นผิด\n— Amplifying host: เป็นบทบาทของสุกร ไม่ใช่ม้า\n— Natural host ที่ติดเชื้อแล้วไม่ป่วย: เป็นลักษณะของม้าลายใน African horse sickness ส่วนม้าที่ติด JE ป่วยและตายได้\n— Carrier ไม่แสดงอาการที่แมลงนำเชื้อไปต่อ: เป็นลักษณะของ EIA ชนิด inapparent ที่เหลือบดูดเลือดแล้วนำเชื้อไปติดตัวอื่น",
    "source": "14B7TUfov00 [72:26-73:40], [33:44-34:12], [59:08]; Eq Infectious Dz and Biosecurity หน้า 33",
    "verified": "14B7TUfov00 [72:26-73:18] (amplifier คือสุกร ม้ากับคนเป็น dead-end host ป่วยแล้วส่งเชื้อต่อไม่ได้ ต่างจาก influenza); Eq Infectious Dz and Biosecurity หน้า 33 (vector Culex spp., important amplifiers pigs)",
    "sourceType": "lecture-derived",
    "examOrigin": "เขียนขึ้นจากเลคเชอร์ Equine Medicine ปี 2569 เรื่อง infectious diseases and biosecurity",
    "tags": [
      "equine-infectious",
      "je-dead-end-host"
    ],
    "sourcePages": [
      {
        "doc": "equine-infectious-2569",
        "edition": "83p",
        "page": 33
      }
    ]
  },
  {
    "id": 216003,
    "subject": "equine-medicine",
    "topic": "equine-infectious",
    "year": 5,
    "type": "mcq",
    "q": "ม้ามีแผลตะปูตำที่พื้นกีบเมื่อ 10 วันก่อน ตอนนี้ยืนขาแข็งแบบ saw horse หนังตาที่สามเลื่อนออกมาเมื่อถูกกระตุ้น และเกร็งมากขึ้นเมื่อได้ยินเสียงดัง แผนรักษาใดเหมาะสมที่สุด",
    "options": [
      "Tetanus toxoid แทน antitoxin ร่วมกับจูงเดินวันละหลายรอบให้กล้ามเนื้อคลายตัว",
      "Acyclovir ร่วมกับยาลดไข้ และแยกคอกกันการแพร่เชื้อทางละอองฝอย",
      "Penicillin G ร่วมกับ tetanus antitoxin ยาซึม และคอกมืดเงียบมีวัสดุกันกระแทก",
      "Flunixin meglumine ร่วมกับเปิดไฟสว่างทั้งคืนเพื่อเฝ้าดูอาการใกล้ชิด"
    ],
    "answer": 2,
    "explain": "อาการชุดนี้คือบาดทะยัก Clostridium tetani เข้าทางแผลตะปูตำที่พื้นกีบแล้วสร้าง tetanus toxin ซึ่งเป็น neurotoxin การรักษาประกอบด้วย penicillin G ซึ่งเป็นยาที่เลือกใช้เพื่อหยุดการเพิ่มจำนวนของเชื้อ tetanus antitoxin เพื่อจับ toxin ที่ยังไม่จับกับเส้นประสาท ยาซึมกลุ่ม acepromazine และยาคลายกล้ามเนื้ออย่าง diazepam (ระวังม้าล้มนอน) และเลี้ยงในคอกที่มืด เงียบ มีวัสดุกันกระแทก ให้สารน้ำ และวางอาหารไว้ที่สูง เพราะเสียง แสง และการสัมผัสทำให้เกร็งมากขึ้น\n\n❌ ทำไมข้ออื่นผิด\n— Tetanus toxoid แทน antitoxin กับจูงเดินหลายรอบ: toxoid เป็นวัคซีนที่ต้องใช้เวลาสร้างภูมิ ไม่ได้จับ toxin ในม้าที่ป่วยแล้ว และการกระตุ้นทำให้เกร็งหนักขึ้น\n— Acyclovir กับแยกคอกกันละอองฝอย: acyclovir ใช้ในโรคจาก equine herpesvirus ส่วนบาดทะยักไม่ได้ติดจากม้าสู่ม้า แต่เข้าทางบาดแผลจากสปอร์ที่อยู่ในดิน\n— Flunixin กับเปิดไฟสว่างทั้งคืน: ไม่ใช่ยาหลักของบาดทะยัก และแสงสว่างกระตุ้นให้กล้ามเนื้อเกร็งหนักขึ้น\n\n💡 Toxoid คือวัคซีนป้องกัน ส่วน antitoxin คือการรักษาม้าที่ป่วยแล้ว",
    "source": "14B7TUfov00 [82:00-85:03], [89:16-89:40]; Eq Infectious Dz and Biosecurity หน้า 39, 40, 42",
    "verified": "Eq Infectious Dz and Biosecurity หน้า 42 (penicillin G drug of choice, acepromazine, diazepam, tetanus antitoxin, dark quiet padded place, fluids, food at a height), 40 (saw horse, third eyelid protrusion, any stimulus exacerbates); 14B7TUfov00 [84:09-85:03], [89:16-89:40] (toxoid ใช้ก่อนเป็น antitoxin ใช้หลังเป็น)",
    "sourceType": "lecture-derived",
    "examOrigin": "เขียนขึ้นจากเลคเชอร์ Equine Medicine ปี 2569 เรื่อง infectious diseases and biosecurity",
    "tags": [
      "equine-infectious",
      "tetanus-treatment"
    ],
    "sourcePages": [
      {
        "doc": "equine-infectious-2569",
        "edition": "83p",
        "page": 39
      },
      {
        "doc": "equine-infectious-2569",
        "edition": "83p",
        "page": 40
      },
      {
        "doc": "equine-infectious-2569",
        "edition": "83p",
        "page": 42
      }
    ]
  },
  {
    "id": 216004,
    "subject": "equine-medicine",
    "topic": "equine-infectious",
    "year": 5,
    "type": "mcq",
    "q": "ม้ามีไข้สูง น้ำมูกเป็นหนอง ต่อมน้ำเหลืองใต้คางบวม สงสัย strangles การเก็บตัวอย่างและลำดับการตรวจยืนยันข้อใดถูกต้อง",
    "options": [
      "Swab สั้นแบบที่ใช้ในสัตว์เล็กเก็บที่รูจมูก ย้อมสีแล้วเห็น cocci ก็สรุปผลได้ทันที",
      "Deep nasopharyngeal swab เพาะเชื้อ จำแนกชนิดแบคทีเรีย แล้วยืนยันด้วย PCR",
      "เจาะเลือดตรวจ AGID ถ้าผลเป็นบวกก็ยืนยันได้ว่าเป็น strangles",
      "เจาะเลือดทำ Woo's technique ส่องหาเชื้อที่ชั้น buffy coat"
    ],
    "answer": 1,
    "explain": "Strangles เกิดจาก Streptococcus equi subsp. equi การเก็บตัวอย่างต้องใช้ deep nasopharyngeal swab ที่ยาวพอจะเข้าไปถึง nasopharynx เพราะโพรงจมูกม้ายาวมาก swab สั้นแบบสัตว์เล็กเข้าได้แค่รูจมูก จากนั้นเพาะเชื้อ จำแนกชนิดแบคทีเรียให้ได้ถึงชนิด และยืนยันด้วย PCR การย้อมสีเห็น cocci ยังบอกไม่ได้ว่าเป็น S. equi ตัวอย่างอื่นที่ส่งเพาะเชื้อได้คือหนองจากฝีที่ต่อมน้ำเหลืองหรือน้ำล้าง guttural pouch\n\n❌ ทำไมข้ออื่นผิด\n— Swab สั้นที่รูจมูกแล้วสรุปจาก cocci: เก็บไม่ถึงตำแหน่งที่มีเชื้อ และ Streptococcus หลายชนิดย้อมแล้วเห็นเป็น cocci เหมือนกัน\n— AGID: เป็นการตรวจมาตรฐานของ equine infectious anemia ไม่ใช่การยืนยัน strangles\n— Woo's technique: ปั่นเลือดในหลอด capillary แล้วส่องหา Trypanosoma evansi (surra) ที่ชั้น buffy coat",
    "source": "14B7TUfov00 [90:06-93:54]; Eq Infectious Dz and Biosecurity หน้า 45, 50",
    "verified": "14B7TUfov00 [91:24-93:28] (deep nasopharyngeal swab, swab สัตว์เล็กเข้าแค่รูจมูก, culture แล้ว bacterial identification แล้ว PCR); Eq Infectious Dz and Biosecurity หน้า 50 (culture of pus, lymph node, throat swabs, throat or guttural pouch washes; PCR)",
    "sourceType": "lecture-derived",
    "examOrigin": "เขียนขึ้นจากเลคเชอร์ Equine Medicine ปี 2569 เรื่อง infectious diseases and biosecurity",
    "tags": [
      "equine-infectious",
      "strangles-sampling"
    ],
    "sourcePages": [
      {
        "doc": "equine-infectious-2569",
        "edition": "83p",
        "page": 45
      },
      {
        "doc": "equine-infectious-2569",
        "edition": "83p",
        "page": 50
      }
    ]
  },
  {
    "id": 216005,
    "subject": "equine-medicine",
    "topic": "equine-pythium",
    "year": 5,
    "type": "mcq",
    "q": "ม้าเลี้ยงปล่อยแปลงที่มีน้ำท่วมขังช่วงหน้าฝน ได้ถ่ายพยาธิด้วย ivermectin สม่ำเสมอ มีแผลที่ขาลุกลามเป็นก้อนเนื้อนูนมีเลือดซึม รักษาแผลตามปกติแล้วไม่ดีขึ้น และในแผลมีก้อนเนื้อตายสีเทาเนื้อแข็งแทรกอยู่ ควรนึกถึงโรคใดมากที่สุด",
    "options": [
      "Habronemiasis จากตัวอ่อนพยาธิ Habronema",
      "Pythiosis จาก Pythium insidiosum",
      "Sarcoid ชนิด fibroblastic จาก bovine papillomavirus",
      "Squamous cell carcinoma จากแสง UV",
      "Exuberant granulation tissue ที่แผลขา"
    ],
    "answer": 1,
    "explain": "Pythiosis เกิดจาก Pythium insidiosum ม้าติดจากการสัมผัสน้ำหรือสิ่งแวดล้อมที่มีเชื้อ เช่น แปลงที่น้ำท่วมขัง รอยโรคเป็นแผลหลุมร่วมกับ granulomatous lesion ที่ผิวหนังและใต้ผิวหนัง เนื้อเยื่อเจริญเกินมีเลือดซึม และรักษาแบบแผลทั่วไปไม่หาย พบบ่อยที่ขา อก และท้อง ลักษณะเด่นคือก้อนเนื้อตายสีเทาเนื้อแข็งในแผลที่เรียกว่า kunkers\n\n❌ ทำไมข้ออื่นผิด\n— Habronemiasis: ตัวอ่อน Habronema ที่แมลงวันนำมาวางบนแผลหรือผิวหนังชื้น เป็นตามฤดูร้อน มักเป็นรอบตา ริมฝีปาก อวัยวะเพศ และปลายขา และตอบสนองต่อ ivermectin ซึ่งม้าตัวนี้ได้รับสม่ำเสมออยู่แล้ว\n— Sarcoid ชนิด fibroblastic: เป็นเนื้องอกผิวหนังที่เป็นก้อนเนื้อมีแผลที่ผิว ไม่ได้สัมพันธ์กับน้ำท่วมขังและไม่มี kunkers\n— Squamous cell carcinoma: มักเกิดที่รอยต่อผิวหนังกับเยื่อเมือก เช่น รอบตา ริมฝีปาก อวัยวะเพศ บนผิวที่ไม่มีสีและโดนแสง UV และไม่มี kunkers\n— Exuberant granulation tissue: เนื้อแกรนูเลชันที่เจริญเกินบนแผลขาซึ่งขยับมาก ไม่มีก้อนเนื้อตายสีเทาแทรกอยู่",
    "source": "14B7TUfov00 [121:14-122:06]; HGXTKbKbqPA [68:44-69:09], [83:59-84:23]; Eq Infectious Dz and Biosecurity หน้า 67-68; Equine dermatology and wound management หน้า 34-35, 41-42, 45, 76-77",
    "verified": "Eq Infectious Dz and Biosecurity หน้า 67 (contact with infected material, environment), 68 (ulceration, granulomatous lesions, limbs chest abdomen, kunkers); 14B7TUfov00 [121:14-122:06]; HGXTKbKbqPA [83:59-84:23] (pythiosis แผลเรื้อรังจากการสัมผัสสิ่งแวดล้อม เป็น differential ของ granuloma)",
    "sourceType": "lecture-derived",
    "examOrigin": "เขียนขึ้นจากเลคเชอร์ Equine Medicine ปี 2569 เรื่อง pythiosis",
    "tags": [
      "equine-pythium",
      "pythiosis-kunkers"
    ],
    "sourcePages": [
      {
        "doc": "equine-infectious-2569",
        "edition": "83p",
        "page": 67
      },
      {
        "doc": "equine-infectious-2569",
        "edition": "83p",
        "page": 68
      },
      {
        "doc": "equine-dermatology-wound-2569",
        "edition": "95p",
        "page": 34
      },
      {
        "doc": "equine-dermatology-wound-2569",
        "edition": "95p",
        "page": 35
      },
      {
        "doc": "equine-dermatology-wound-2569",
        "edition": "95p",
        "page": 41
      },
      {
        "doc": "equine-dermatology-wound-2569",
        "edition": "95p",
        "page": 42
      },
      {
        "doc": "equine-dermatology-wound-2569",
        "edition": "95p",
        "page": 45
      },
      {
        "doc": "equine-dermatology-wound-2569",
        "edition": "95p",
        "page": 76
      },
      {
        "doc": "equine-dermatology-wound-2569",
        "edition": "95p",
        "page": 77
      },
      {
        "doc": "equine-derm-wound-2569",
        "edition": "97p",
        "page": 34
      },
      {
        "doc": "equine-derm-wound-2569",
        "edition": "97p",
        "page": 35
      },
      {
        "doc": "equine-derm-wound-2569",
        "edition": "97p",
        "page": 41
      },
      {
        "doc": "equine-derm-wound-2569",
        "edition": "97p",
        "page": 42
      },
      {
        "doc": "equine-derm-wound-2569",
        "edition": "97p",
        "page": 45
      },
      {
        "doc": "equine-derm-wound-2569",
        "edition": "97p",
        "page": 76
      },
      {
        "doc": "equine-derm-wound-2569",
        "edition": "97p",
        "page": 77
      }
    ]
  },
  {
    "id": 216006,
    "subject": "equine-medicine",
    "topic": "equine-pythium",
    "year": 5,
    "type": "mcq",
    "q": "ตัดชิ้นเนื้อจากแผลที่สงสัย pythiosis ส่ง histopathology เพื่อหา hyphae ของ Pythium insidiosum ควรขอย้อมพิเศษด้วยวิธีใด",
    "options": [
      "Ziehl-Neelsen",
      "Gram stain",
      "Giemsa หรือ Wright",
      "GMS หรือ PAS",
      "Toluidine blue"
    ],
    "answer": 3,
    "explain": "Hyphae ของ Pythium insidiosum ติดสี H&E ได้ไม่ชัด จึงย้อมพิเศษด้วย Gomori's methenamine silver (GMS) หรือ periodic acid-Schiff (PAS) ซึ่งทำให้ผนังของ hyphae เห็นชัดในชิ้นเนื้อ การยืนยันเชื้อทำต่อด้วยการเพาะแยกเชื้อ immunochromatography test (ICT) และ PCR หรือ DNA sequencing เวลาส่งเพาะเชื้อต้องระบุในใบส่งตรวจว่าให้เพาะแยก Pythium เพราะถ้าเขียนแค่ culture ห้องปฏิบัติการจะเพาะหาแบคทีเรีย\n\n❌ ทำไมข้ออื่นผิด\n— Ziehl-Neelsen: ย้อมหาเชื้อทนกรด (acid-fast) เช่น Mycobacterium\n— Gram stain: ใช้แยกแบคทีเรียแกรมบวกกับแกรมลบ ไม่ใช่วิธีหา hyphae ในเนื้อเยื่อ\n— Giemsa หรือ Wright: ย้อม blood smear หาพยาธิในเม็ดเลือด เช่น Babesia caballi และ Theileria equi\n— Toluidine blue: ย้อมแกรนูลของ mast cell ใช้ดู mast cell tumor",
    "source": "14B7TUfov00 [122:35-123:27]; Eq Infectious Dz and Biosecurity หน้า 70",
    "verified": "Eq Infectious Dz and Biosecurity หน้า 70 (isolation, culture; histopathological examination with GMS or PAS; ICT; DNA sequencing, PCR); 14B7TUfov00 [123:27] (histopath เพื่อหา hyphae), [122:35-123:00] (ระบุในใบส่งว่าเพาะหาเชื้ออะไร ไม่เช่นนั้นจะได้เพาะแบคทีเรีย)",
    "sourceType": "lecture-derived",
    "examOrigin": "เขียนขึ้นจากเลคเชอร์ Equine Medicine ปี 2569 เรื่อง pythiosis",
    "tags": [
      "equine-pythium",
      "pythiosis-stain"
    ],
    "sourcePages": [
      {
        "doc": "equine-infectious-2569",
        "edition": "83p",
        "page": 70
      }
    ]
  },
  {
    "id": 216007,
    "subject": "equine-medicine",
    "topic": "equine-pythium",
    "year": 5,
    "type": "mcq",
    "q": "แนวทางรักษา pythiosis ที่ขาม้าข้อใดเหมาะสมที่สุด",
    "options": [
      "ผ่าตัดเลาะเนื้อเยื่อติดเชื้อออกให้มากที่สุด ร่วมกับ immunotherapy ด้วย PIA",
      "ป้อน ivermectin 2 ครั้งห่างกัน 3 สัปดาห์ ร่วมกับโรยยาฆ่าแมลงชนิดผงลงในแผล",
      "ทา imiquimod 5% บนรอยโรคทุกวัน หรือฉีด cisplatin เข้ารอยโรคซ้ำเป็นระยะจนยุบ",
      "ตัดแต่งเนื้อส่วนเกินออก ทา corticosteroid แล้วพันแผลกดทับไว้"
    ],
    "answer": 0,
    "explain": "Pythiosis รักษาหลักด้วยการผ่าตัดเลาะเนื้อเยื่อที่ติดเชื้อออกให้มากที่สุด ร่วมกับ immunotherapy ด้วย Pythium insidiosum antigen (PIA) และดูแลแผลต่อด้วย povidone iodine ระหว่างทำแผลต้องใส่ถุงมือและ PPE และทำความสะอาดพื้นที่ที่ปนเปื้อนทั้งหมดด้วยน้ำยา hypochlorite\n\n❌ ทำไมข้ออื่นผิด\n— Ivermectin 2 ครั้งกับยาฆ่าแมลงในแผล: เป็นการรักษา habronemiasis เพื่อฆ่าตัวอ่อน Habronema\n— Imiquimod 5% หรือ cisplatin เข้ารอยโรค: เป็นทางเลือกในการรักษา sarcoid\n— ตัดเนื้อส่วนเกิน ทา corticosteroid และพันกดทับ: เป็นการจัดการ exuberant granulation tissue",
    "source": "14B7TUfov00 [123:27-124:18]; Eq Infectious Dz and Biosecurity หน้า 70; Equine dermatology and wound management หน้า 35, 42, 77",
    "verified": "Eq Infectious Dz and Biosecurity หน้า 70 (surgery; immunotherapy PIA; wound management povidone iodine); 14B7TUfov00 [124:18] (debridement ตัดออกให้เยอะที่สุดแล้ว immunotherapy PIA), [123:27-123:54] (ถุงมือ PPE ทำความสะอาดพื้นที่ปนเปื้อน)",
    "sourceType": "lecture-derived",
    "examOrigin": "เขียนขึ้นจากเลคเชอร์ Equine Medicine ปี 2569 เรื่อง pythiosis",
    "tags": [
      "equine-pythium",
      "pythiosis-treatment"
    ],
    "sourcePages": [
      {
        "doc": "equine-infectious-2569",
        "edition": "83p",
        "page": 70
      },
      {
        "doc": "equine-dermatology-wound-2569",
        "edition": "95p",
        "page": 35
      },
      {
        "doc": "equine-dermatology-wound-2569",
        "edition": "95p",
        "page": 42
      },
      {
        "doc": "equine-dermatology-wound-2569",
        "edition": "95p",
        "page": 77
      },
      {
        "doc": "equine-derm-wound-2569",
        "edition": "97p",
        "page": 35
      },
      {
        "doc": "equine-derm-wound-2569",
        "edition": "97p",
        "page": 42
      },
      {
        "doc": "equine-derm-wound-2569",
        "edition": "97p",
        "page": 77
      }
    ]
  },
  {
    "id": 216008,
    "subject": "equine-medicine",
    "topic": "equine-pythium",
    "year": 5,
    "type": "mcq",
    "q": "Pythium insidiosum ซึ่งเป็นสาเหตุของ pythiosis ในม้า จัดเป็นสิ่งมีชีวิตกลุ่มใด",
    "options": [
      "เชื้อราแท้ในกลุ่มเดียวกับ Aspergillus",
      "แบคทีเรียกลุ่ม actinomycete แบบ Dermatophilus",
      "Oomycete ที่ใกล้เคียงสาหร่าย ไม่ใช่เชื้อราแท้",
      "ตัวอ่อนพยาธิตัวกลมที่แมลงวันนำมาวางในแผล"
    ],
    "answer": 2,
    "explain": "Pythium insidiosum เป็น oomycete ซึ่งเป็นสิ่งมีชีวิตที่ใกล้เคียงสาหร่าย ไม่ใช่เชื้อราแท้ แม้จะสร้าง hyphae คล้ายเชื้อราและมักถูกจัดไว้กับโรคจากเชื้อรา ม้าติดจากน้ำและสิ่งแวดล้อมที่มีเชื้อ โรคนี้จึงมีชื่อเรียกว่า swamp cancer หรือ bursatte และการรักษาอาศัยการผ่าตัดร่วมกับ immunotherapy (PIA) ไม่ได้พึ่งยาต้านเชื้อรา\n\n❌ ทำไมข้ออื่นผิด\n— เชื้อราแท้กลุ่มเดียวกับ Aspergillus: Aspergillus เป็นเชื้อราแท้ที่ก่อ guttural pouch mycosis คนละกลุ่มกับ Pythium\n— Actinomycete แบบ Dermatophilus: เป็นแบคทีเรียที่ก่อ dermatophilosis (rain scald) ที่ผิวหนัง\n— ตัวอ่อนพยาธิที่แมลงวันนำมาวาง: เป็นสาเหตุของ habronemiasis (summer sore)",
    "source": "14B7TUfov00 [121:14-121:40], [125:36]; Eq Infectious Dz and Biosecurity หน้า 66-67, 72",
    "verified": "14B7TUfov00 [121:14-121:40] (Pythium เป็นพวกสาหร่าย, swamp cancer, ติดจากน้ำเจิ่งนอง), [125:36] (ไม่ใช่เชื้อราแท้); Eq Infectious Dz and Biosecurity หน้า 67 (Pythium insidiosum, bursatte, swamp cancer), 72 (guttural pouch mycosis, Aspergillus spp)",
    "sourceType": "lecture-derived",
    "examOrigin": "เขียนขึ้นจากเลคเชอร์ Equine Medicine ปี 2569 เรื่อง pythiosis",
    "tags": [
      "equine-pythium",
      "pythium-oomycete"
    ],
    "sourcePages": [
      {
        "doc": "equine-infectious-2569",
        "edition": "83p",
        "page": 66
      },
      {
        "doc": "equine-infectious-2569",
        "edition": "83p",
        "page": 67
      },
      {
        "doc": "equine-infectious-2569",
        "edition": "83p",
        "page": 72
      }
    ]
  },
  {
    "id": 216009,
    "subject": "equine-medicine",
    "topic": "equine-hoof",
    "year": 5,
    "type": "mcq",
    "q": "ม้าขาหน้าขวาเจ็บเฉียบพลันจนแทบไม่ลงน้ำหนัก หนีบด้วย hoof tester แล้วเจ็บชัดเพียงจุดเดียวที่พื้นกีบ ภาพรังสีไม่พบกระดูกหัก สงสัยฝีใต้พื้นกีบ (subsolar abscess) การรักษาหลักคือข้อใด",
    "options": [
      "ให้ยาปฏิชีวนะอย่างเดียวโดยไม่เปิดกีบ แล้วรอให้ฝีแตกออกเองที่ coronary band",
      "เปิดพื้นกีบตรงจุดที่เจ็บเพื่อระบายหนอง แล้วแช่ ใส่ยา และพันกีบ",
      "แช่กีบใน copper sulfate ทุกวันจนกว่าม้าจะหายเจ็บ โดยไม่ต้องเปิดกีบ",
      "ใส่เกือก reverse shoe ยกส้นขึ้น เพื่อลดแรงกดที่ปลายกีบ",
      "ทำ palmar digital nerve block แล้วให้ม้าออกกำลังตามปกติ"
    ],
    "answer": 1,
    "explain": "ฝีใต้พื้นกีบเป็นสาเหตุที่พบบ่อยมากของขาเจ็บเฉียบพลัน หนองถูกขังอยู่ระหว่างผนังกีบที่แข็งกับ coffin bone จึงขยายตัวไม่ได้ แรงดันทำให้ม้าเจ็บมาก เชื้อเข้าได้จากความสกปรก white line disease, thrush หรือของแหลมแทง เช่น เหยียบตะปูหรือตอกตะปูเกือกผิด การรักษาหลักคือเปิดพื้นกีบตรงจุดที่เจ็บให้หนองระบายออก เมื่อแรงดันหายม้าจะสบายขึ้นเร็ว จากนั้นล้าง แช่ ใส่ยา และพันกีบ และอาจให้ยาปฏิชีวนะกับยาต้านการอักเสบร่วมด้วย\n\n❌ ทำไมข้ออื่นผิด\n— ให้ยาปฏิชีวนะอย่างเดียวรอฝีแตกเอง: หนองที่ไม่ได้ระบายทางพื้นกีบจะหาทางแตกออกด้านบนที่ coronary band ม้าเจ็บนานขึ้นและเนื้อเยื่อเสียหายมากขึ้น\n— แช่ copper sulfate โดยไม่เปิดกีบ: copper sulfate ใช้กับ thrush และทำลายเนื้อเยื่ออ่อน จึงไม่ใช้กับแผลฝีที่เปิดลงถึงเนื้อเยื่อ และไม่ได้ระบายหนอง\n— ใส่ reverse shoe ยกส้น: เป็นเกือกรักษา laminitis ระยะที่อาการทรงตัวแล้ว ไม่ได้ระบายหนอง\n— Palmar digital nerve block แล้วออกกำลัง: nerve block ใช้หาตำแหน่งที่เจ็บ ไม่ใช่การรักษา และฝีที่ยังไม่ได้ระบายจะลุกลามต่อ",
    "source": "Pathologic condition of equine foot หน้า 25-26",
    "verified": "Pathologic condition of equine foot หน้า 25 (very common sudden-onset lameness; infection trapped between hard hoof wall and coffin bone), 26 (opened for drainage, soaking, medication, bandaging; antibiotics and anti-inflammatories); lecture recording (สาเหตุ, เปิดระบายแล้วสบายเพราะหมดแรงดัน, ไม่ระบายข้างล่างก็แตกข้างบน; ไม่ใช้ copper กับฝี)",
    "sourceType": "lecture-derived",
    "examOrigin": "เขียนขึ้นจากเลคเชอร์ Equine Medicine ปี 2568 เรื่อง pathological conditions of the equine foot",
    "tags": [
      "equine-hoof",
      "subsolar-abscess"
    ],
    "sourcePages": [
      {
        "doc": "equine-foot-2568",
        "edition": "34p",
        "page": 25
      },
      {
        "doc": "equine-foot-2568",
        "edition": "34p",
        "page": 26
      }
    ]
  },
  {
    "id": 216010,
    "subject": "equine-medicine",
    "topic": "equine-hoof",
    "year": 5,
    "type": "mcq",
    "q": "ม้าหลังผ่าตัดขาหน้าซ้าย ควบคุมความเจ็บได้ไม่ดี จึงยืนลงน้ำหนักขาหน้าขวาข้างเดียวเป็นเวลาหลายวัน ขาหน้าขวาเสี่ยงต่อภาวะใดมากที่สุด",
    "options": [
      "Supporting limb laminitis จากการรับน้ำหนักขาข้างเดียวนานเกินไป",
      "Sepsis-related laminitis จาก endotoxin ที่เข้าสู่กระแสเลือด",
      "Endocrinopathic laminitis จากภาวะ equine metabolic syndrome",
      "Subsolar abscess จากตะปูเกือกที่ตอกล้ำเข้าไปด้านในของ white line"
    ],
    "answer": 0,
    "explain": "เมื่อม้าเจ็บขาข้างหนึ่งจนไม่ยอมลงน้ำหนัก ขาข้างตรงข้ามต้องรับน้ำหนักแทนต่อเนื่องเป็นเวลานาน lamina ของขาที่รับน้ำหนักจึงล้มเหลวจนเกิด supporting limb laminitis พบบ่อยหลังการผ่าตัดที่จัดการความเจ็บได้ไม่ดี การป้องกันจึงอยู่ที่การคุมความเจ็บให้ม้ายอมลงน้ำหนักขาที่ผ่าตัด และเสริมการรองรับขาข้างที่รับน้ำหนักแทน\n\n❌ ทำไมข้ออื่นผิด\n— Sepsis-related laminitis: มาจากโรคที่ทำให้เกิด sepsis หรือ endotoxemia เช่น กินอาหารข้นเกิน (grain overload) รกค้างจนมดลูกอักเสบหลังคลอด โคลิก หรือลำไส้อักเสบ ไม่ได้เกิดจากการรับน้ำหนักขาข้างเดียว\n— Endocrinopathic laminitis: สัมพันธ์กับ equine metabolic syndrome ซึ่งเป็นภาวะทางต่อมไร้ท่อและเมแทบอลิซึม ไม่เกี่ยวกับการผ่าตัดขาอีกข้าง\n— Subsolar abscess จากตะปูเกือก: เกิดเมื่อเชื้อเข้าทางรูตะปูหรือของแหลม ไม่ได้เกิดจากการลงน้ำหนักมาก",
    "source": "Pathologic condition of equine foot หน้า 29",
    "verified": "Pathologic condition of equine foot หน้า 29 (three disease states: sepsis or endotoxemia, endocrinopathic, supporting limb laminitis post surgery); lecture recording (ยืนขาข้างเดียวนาน โดยเฉพาะหลังผ่าตัดที่จัดการความเจ็บไม่ดี)",
    "sourceType": "lecture-derived",
    "examOrigin": "เขียนขึ้นจากเลคเชอร์ Equine Medicine ปี 2568 เรื่อง pathological conditions of the equine foot",
    "tags": [
      "equine-hoof",
      "supporting-limb-laminitis"
    ],
    "sourcePages": [
      {
        "doc": "equine-foot-2568",
        "edition": "34p",
        "page": 29
      }
    ]
  },
  {
    "id": 216011,
    "subject": "equine-medicine",
    "topic": "equine-hoof",
    "year": 5,
    "type": "mcq",
    "q": "ม้าเริ่มเจ็บกีบขาหน้าทั้งสองข้างเมื่อ 2 วันก่อนหลังเข้าไปกินอาหารข้นปริมาณมาก ถ่ายภาพรังสีด้านข้าง (lateral) พบว่า P3 หมุนลงแล้ว ม้าตัวนี้เป็น laminitis ระยะใด",
    "options": [
      "Subclinical laminitis",
      "Acute laminitis",
      "Subacute laminitis",
      "Chronic laminitis"
    ],
    "answer": 3,
    "explain": "ระยะของกีบอักเสบ (laminitis) แบ่งด้วยการเคลื่อนของ P3 (distal phalanx) เป็นหลัก chronic laminitis คือเมื่อ P3 หมุน (rotation) หรือทรุด (sinking) แล้ว ไม่ว่าจะเป็นมานานเท่าใด ม้าตัวนี้จึงเป็น chronic แม้เพิ่งเจ็บได้ 2 วัน เมื่อ lamina อ่อนแอ แรงดึงของ deep digital flexor tendon ในทุกก้าวร่วมกับน้ำหนักตัวทำให้ P3 แยกออกจากผนังกีบแล้วหมุนหรือทรุดลง\n\n❌ ทำไมข้ออื่นผิด\n— Subclinical laminitis: ม้าไม่แสดงอาการเจ็บ เห็นเพียงผนังกีบที่งอกเป็นคลื่นจากการอักเสบเล็กน้อยเป็นช่วงๆ\n— Acute laminitis: ช่วงไม่กี่วันแรก (มักไม่เกิน 3 วัน) ที่ P3 ยังไม่เคลื่อน ภาพรังสีอาจยังปกติแต่หนีบกีบแล้วเจ็บ\n— Subacute laminitis: อาการต่อเนื่องเกิน 3 วันแต่ P3 ยังไม่เคลื่อน\n\n💡 Chronic ดูที่ P3 เคลื่อนแล้ว ไม่ได้ดูที่จำนวนวัน",
    "source": "Pathologic condition of equine foot หน้า 28, 30",
    "verified": "Pathologic condition of equine foot หน้า 30 (acute <3 days and subacute >3 days, both without displacement; chronic = distal phalanx displacement regardless of the duration), 28 (DDFT tension with the horse's weight displaces the distal phalanx); lecture recording (chronic คือ bone sinking ลงไปแล้ว; subclinical ผนังกีบเป็นคลื่น)",
    "sourceType": "lecture-derived",
    "examOrigin": "เขียนขึ้นจากเลคเชอร์ Equine Medicine ปี 2568 เรื่อง pathological conditions of the equine foot",
    "tags": [
      "equine-hoof",
      "laminitis-staging"
    ],
    "sourcePages": [
      {
        "doc": "equine-foot-2568",
        "edition": "34p",
        "page": 28
      },
      {
        "doc": "equine-foot-2568",
        "edition": "34p",
        "page": 30
      }
    ]
  },
  {
    "id": 216012,
    "subject": "equine-medicine",
    "topic": "equine-hoof",
    "year": 5,
    "type": "mcq",
    "q": "ม้าเข้าไปกินอาหารข้นปริมาณมากเมื่อวาน วันนี้เริ่มเจ็บกีบขาหน้า digital pulse แรง ภาพรังสียังไม่พบ P3 เคลื่อน การจัดการฉุกเฉินข้อใดเหมาะสมที่สุด",
    "options": [
      "ใส่เกือกเหล็กแบบ reverse shoe ทันทีเพื่อยกส้น แล้วจูงเดินบนพื้นแข็งวันละหลายรอบ",
      "แช่กีบในน้ำอุ่นเพื่อขยายหลอดเลือด และจูงเดินออกกำลังวันละหลายรอบ",
      "ให้ flunixin meglumine แช่กีบในน้ำแข็ง ให้ acepromazine และให้ยืนบนพื้นนุ่ม",
      "แช่กีบใน copper sulfate แล้วพันกีบ และปล่อยลงแปลงตามปกติ"
    ],
    "answer": 2,
    "explain": "ระยะแรกของกีบอักเสบเป็นภาวะฉุกเฉิน เป้าหมายคือลดการอักเสบของ lamina และกันไม่ให้ P3 เคลื่อน flunixin meglumine เป็น NSAID ที่เลือกใช้เมื่อม้าเสี่ยงหรือมีภาวะ endotoxemia เพราะช่วยลดผลของ endotoxin ด้วย (ระวังใช้มากเกินจนเกิดแผลในกระเพาะ) การแช่กีบในน้ำแข็ง (digital hypothermia) ช่วยปกป้องโครงสร้างของ lamina acepromazine ช่วยเพิ่มการไหลเวียนเลือดที่ปลายขา และให้ม้ายืนบนพื้นนุ่ม ถอดเกือกปกติออก รองด้วยโฟมหนา ลดการเดินบนพื้นแข็งราว 2-3 สัปดาห์ เกือกรักษาจะใส่เมื่ออาการทรงตัว P3 ไม่ทรุดต่อ และม้าหายเจ็บแล้ว\n\n❌ ทำไมข้ออื่นผิด\n— ใส่ reverse shoe ทันทีแล้วเดินบนพื้นแข็ง: เกือกรักษาใช้หลังพ้นช่วงแรกราว 3-4 สัปดาห์ ช่วงแรกต้องถอดเกือกปกติ และพื้นแข็งเพิ่มแรงที่ lamina\n— แช่น้ำอุ่นและจูงเดินหลายรอบ: ช่วงแรกต้องใช้ความเย็นลดการอักเสบ และการเดินเพิ่มแรงที่ lamina ที่อ่อนแอ\n— แช่ copper sulfate แล้วปล่อยแปลง: copper sulfate ใช้รักษา thrush ไม่ได้ลดการอักเสบของ lamina",
    "source": "Pathologic condition of equine foot หน้า 31-33",
    "verified": "Pathologic condition of equine foot หน้า 31 (emergency; flunixin drug of choice if systemically ill; acepromazine increases digital blood flow; digital hypothermia), 32 (remove standard shoes, foam pads in the first 2-3 weeks), 33 (therapeutic shoeing after 3-4 weeks); lecture recording",
    "sourceType": "lecture-derived",
    "examOrigin": "เขียนขึ้นจากเลคเชอร์ Equine Medicine ปี 2568 เรื่อง pathological conditions of the equine foot",
    "tags": [
      "equine-hoof",
      "laminitis-emergency"
    ],
    "sourcePages": [
      {
        "doc": "equine-foot-2568",
        "edition": "34p",
        "page": 31
      },
      {
        "doc": "equine-foot-2568",
        "edition": "34p",
        "page": 32
      },
      {
        "doc": "equine-foot-2568",
        "edition": "34p",
        "page": 33
      }
    ]
  },
  {
    "id": 216013,
    "subject": "equine-medicine",
    "topic": "equine-hoof",
    "year": 5,
    "type": "mcq",
    "q": "ม้าขาหน้ามีรูปกีบแบบ long toe, low heel (underrun heel) ข้อใดอธิบายผลของรูปกีบแบบนี้ได้ถูกต้อง",
    "options": [
      "แนวผนังกีบกับ pastern ยังขนานกันดี เพียงพื้นกีบหนาขึ้นเหมือนม้ายืนบนบล็อกไม้",
      "Coffin bone เอียงปลายลง น้ำหนักเทไปข้างหน้าเหมือนใส่รองเท้าส้นสูง",
      "ปลายกีบงัดผนังกีบด้านหน้ามากขึ้น น้ำหนักเทไปที่ส้น และม้ายกขาออกได้ช้า",
      "ผนังกีบด้านหน้าสั้นลง ม้ายกขาออกได้เร็วขึ้น และน้ำหนักย้ายไปที่ปลายกีบ",
      "Coffin bone ยึดกับผนังกีบแน่นขึ้น จึงลดโอกาสที่ P3 จะหมุนเมื่อเกิด laminitis"
    ],
    "answer": 2,
    "explain": "กีบแบบ long toe, low heel ปลายกีบยื่นยาวไปข้างหน้าขณะที่ส้นต่ำและทรุดลง ปลายกีบที่ยาวทำหน้าที่เหมือนคานงัดผนังกีบด้านหน้า ผนังกีบจึงไม่แข็งแรงและอาจยึดกับ coffin bone ได้ไม่แน่น น้ำหนักเทไปลงที่ส้นมากขึ้น และปลายกีบที่ยาวทำให้ม้ายกขาออกจากพื้นได้ช้า (breakover ช้า) จึงสะดุดง่าย แนวผนังกีบด้านหน้ากับแนวส้นไม่ขนานกันเหมือนกีบปกติ\n\n❌ ทำไมข้ออื่นผิด\n— แนวผนังกีบกับ pastern ขนานกันแต่พื้นกีบหนา: เป็นลักษณะของกีบที่ยาวเกินทั้งกีบ (overgrown hoof) ซึ่ง coffin bone กับผนังกีบยังเรียงตัวกันดี\n— Coffin bone เอียงปลายลงเหมือนใส่รองเท้าส้นสูง: เป็นลักษณะของกีบส้นสูง (high heels)\n— ผนังกีบด้านหน้าสั้นลงและยกขาเร็วขึ้น: กลับด้านกับ long toe ซึ่งปลายกีบยาวขึ้นและยกขาออกได้ช้าลง\n— Coffin bone ยึดกับผนังกีบแน่นขึ้น: ปลายกีบที่ยาวงัดผนังกีบจนการยึดกับ coffin bone อาจไม่แน่น ไม่ได้ช่วยกันกีบอักเสบ",
    "source": "Pathologic condition of equine foot หน้า 5-9",
    "verified": "Pathologic condition of equine foot หน้า 6 (long toe: toe has run forward, coffin bone and hoof wall may not be strongly attached, a lot of leverage on the hoof wall), 7 (long toe and under-run heels), 8 (overgrown, coffin bone and wall aligned), 9 (high heels, coffin bone tilted down); lecture recording (underrun heel น้ำหนักลงส้น; ปลายยาว ยกขาได้ช้า สะดุด)",
    "sourceType": "lecture-derived",
    "examOrigin": "เขียนขึ้นจากเลคเชอร์ Equine Medicine ปี 2568 เรื่อง pathological conditions of the equine foot",
    "tags": [
      "equine-hoof",
      "long-toe-low-heel"
    ],
    "sourcePages": [
      {
        "doc": "equine-foot-2568",
        "edition": "34p",
        "page": 5
      },
      {
        "doc": "equine-foot-2568",
        "edition": "34p",
        "page": 6
      },
      {
        "doc": "equine-foot-2568",
        "edition": "34p",
        "page": 7
      },
      {
        "doc": "equine-foot-2568",
        "edition": "34p",
        "page": 8
      },
      {
        "doc": "equine-foot-2568",
        "edition": "34p",
        "page": 9
      }
    ]
  },
  {
    "id": 216014,
    "subject": "equine-medicine",
    "topic": "equine-tendon",
    "year": 5,
    "type": "mcq",
    "q": "ข้อใดถูกต้องเกี่ยวกับตำแหน่งที่พบการบาดเจ็บของเอ็นและ ligament บริเวณขาส่วนล่างของม้า",
    "options": [
      "DDFT เป็นเอ็นที่บาดเจ็บบ่อยที่สุดในม้าแข่งเรียบ",
      "Suspensory ligament ในม้า trotter เป็นที่ขาหน้ามากกว่าขาหลัง",
      "Suspensory ligament ในม้าแข่งเรียบเป็นที่ขาหลังมากกว่าขาหน้า",
      "SDFT บาดเจ็บที่ขาหน้ามากกว่าขาหลังอย่างชัดเจน",
      "Inferior check ligament บาดเจ็บบ่อยกว่า SDFT ในม้าแข่ง"
    ],
    "answer": 3,
    "explain": "เอ็นหลักของขาส่วนล่างตั้งแต่ carpus ลงไปมีสามเส้น คือ superficial digital flexor tendon (SDFT), deep digital flexor tendon (DDFT) และ suspensory ligament ที่บาดเจ็บบ่อยที่สุดคือ SDFT ซึ่งเป็นที่ขาหน้ามากกว่าขาหลังอย่างชัดเจน โดยเฉพาะในม้าแข่งที่วิ่งเร็ว รองลงมาคือ suspensory ligament ซึ่งในม้าแข่งเรียบเป็นที่ขาหน้าเท่ากับหรือมากกว่าขาหลัง แต่ในม้า trotter และม้ากระโดด (show jumper) ที่ใช้ขาหลังดันตัวมาก จะเป็นที่ขาหลังมากกว่า inferior check ligament พบน้อยกว่านั้น และ DDFT พบน้อยมาก\n\n❌ ทำไมข้ออื่นผิด\n— DDFT บาดเจ็บบ่อยที่สุดในม้าแข่งเรียบ: DDFT พบน้อยที่สุดในกลุ่มนี้\n— Suspensory ligament ในม้า trotter เป็นที่ขาหน้ามากกว่า: ม้า trotter ใช้ขาหลังมาก จึงเป็นที่ขาหลังมากกว่า\n— Suspensory ligament ในม้าแข่งเรียบเป็นที่ขาหลังมากกว่า: ในม้าแข่งเรียบเป็นที่ขาหน้าเท่ากับหรือมากกว่าขาหลัง\n— Inferior check ligament บาดเจ็บบ่อยกว่า SDFT: พบน้อยกว่าทั้ง SDFT และ suspensory ligament",
    "source": "Tendon/Ligament injuries and treatment หน้า 3",
    "verified": "Tendon/Ligament injuries and treatment หน้า 3 (SDFT Fore >> Hind; suspensory Fore ≥ Hind in flat racehorses, Hind ≥ Fore in trotters and show jumpers; inferior check ligament; DDFT rare); lecture recording",
    "sourceType": "lecture-derived",
    "examOrigin": "เขียนขึ้นจากเลคเชอร์ Equine Medicine ปี 2568 เรื่อง tendon and ligament injuries and treatment",
    "tags": [
      "equine-tendon",
      "tendon-injury-sites"
    ],
    "sourcePages": [
      {
        "doc": "equine-tendon-2568",
        "edition": "157p",
        "page": 3
      }
    ]
  },
  {
    "id": 216015,
    "subject": "equine-medicine",
    "topic": "equine-tendon",
    "year": 5,
    "type": "mcq",
    "q": "ม้าแข่งมีอาการบวมร้อนด้านหลังกระดูก cannon ขาหน้าหลังซ้อมเมื่อวาน สงสัย SDFT บาดเจ็บเฉียบพลัน ควรทำ ultrasound ครั้งแรกเพื่อประเมินขนาดและตำแหน่งของรอยโรคเมื่อใด",
    "options": [
      "ภายใน 24 ชั่วโมงแรก เพราะรอยโรคใหญ่ที่สุดตั้งแต่วันแรก",
      "วันที่ 2-3 เพราะเป็นช่วงที่อาการบวมขึ้นถึงจุดสูงสุดแล้ว",
      "ราว 1-2 สัปดาห์ เพราะรอยโรคยังขยายต่อในช่วงแรกหลังบาดเจ็บ",
      "ราว 3-4 เดือน เพราะต้องรอให้ fibrosis ก่อตัวก่อนจึงเห็นรอยโรค"
    ],
    "answer": 2,
    "explain": "หลังเอ็นฉีก เลือดออกและการอักเสบทำให้รอยโรคขยายต่อไปอีกราว 1-2 สัปดาห์ (7-14 วัน) ก่อนจะทรงตัวและเข้าสู่ระยะซ่อมแซม ultrasound ก่อน 5 วันจึงเชื่อถือไม่ได้ เพราะยังบอกไม่ได้ว่าเสียหายเท่าใด ควรตรวจครั้งแรกราว 1-2 สัปดาห์หลังบาดเจ็บเพื่อดูขนาดและตำแหน่งของรอยโรค แล้วตรวจซ้ำเป็นระยะเพื่อติดตามการหาย\n\n❌ ทำไมข้ออื่นผิด\n— ภายใน 24 ชั่วโมงแรก: รอยโรคยังขยายต่อ ภาพช่วงนี้ประเมินความเสียหายต่ำกว่าความจริงและต้องตรวจซ้ำอยู่ดี\n— วันที่ 2-3: ยังอยู่ในช่วงก่อน 5 วันที่ ultrasound เชื่อถือไม่ได้ และอาการบวมยังเพิ่มขึ้นได้ถึงราววันที่ 5-10\n— ราว 3-4 เดือน: ช้าเกินไปสำหรับการประเมินครั้งแรก เพราะแผนรักษาและการควบคุมการออกกำลังต้องอาศัยผลตรวจตั้งแต่ระยะแรก",
    "source": "Tendon/Ligament injuries and treatment หน้า 17, 21, 22",
    "verified": "Tendon/Ligament injuries and treatment หน้า 22 (ultrasound unreliable before 5 days; 7-15 days for initial scans; 3-4 weeks for prognosis), 17 (lesion ↑ for 7-15 days), 21 (swelling max 5-10 days); lecture recording (ก่อน 5 วันเชื่อไม่ได้ แนะนำซาวครั้งแรก 1-2 สัปดาห์; 7-14 วัน)",
    "sourceType": "lecture-derived",
    "examOrigin": "เขียนขึ้นจากเลคเชอร์ Equine Medicine ปี 2568 เรื่อง tendon and ligament injuries and treatment",
    "tags": [
      "equine-tendon",
      "ultrasound-timing"
    ],
    "sourcePages": [
      {
        "doc": "equine-tendon-2568",
        "edition": "157p",
        "page": 17
      },
      {
        "doc": "equine-tendon-2568",
        "edition": "157p",
        "page": 21
      },
      {
        "doc": "equine-tendon-2568",
        "edition": "157p",
        "page": 22
      }
    ]
  },
  {
    "id": 216016,
    "subject": "equine-medicine",
    "topic": "equine-tendon",
    "year": 5,
    "type": "mcq",
    "q": "ผลตรวจ ultrasound ของ SDFT ที่บาดเจ็บเฉียบพลันมาได้ 10 วัน มักพบลักษณะใด",
    "options": [
      "เอ็นขยายขนาด มีบริเวณ hypoechoic ถึง anechoic และเส้นใยขาดตอน",
      "เอ็นขาวกว่าปกติ (hyperechoic) และไม่สม่ำเสมอจาก fibrosis",
      "มีจุดขาวจัดจาก ectopic mineralisation กระจายแทรกอยู่ในเนื้อเอ็น",
      "เส้นใยเรียงขนานสม่ำเสมอ echogenicity เท่ากับเอ็นปกติ",
      "ขอบเอ็นติดแน่นกับเนื้อเยื่อรอบข้างจาก adhesion"
    ],
    "answer": 0,
    "explain": "ระยะ acute ของการบาดเจ็บเอ็น เส้นใยที่ฉีกขาดร่วมกับเลือดและน้ำที่แทรกเข้ามาทำให้เห็นบริเวณ hypoechoic ถึง anechoic (สีดำ) ในเนื้อเอ็น ซึ่งอาจอยู่ตรงกลางเป็น core lesion อยู่ที่ขอบ หรือกระจายทั่วเอ็น เอ็นขยายขนาดจากการบวม และภาพตามยาวเห็นเส้นใยขาดตอน เมื่อเริ่มหาย echogenicity จะเพิ่มขึ้นและเส้นใยเริ่มเรียงต่อกัน ส่วนระยะเรื้อรังจะเห็น fibrosis ที่ขาวกว่าปกติ ectopic mineralisation หรือ adhesion\n\n❌ ทำไมข้ออื่นผิด\n— ขาวกว่าปกติและไม่สม่ำเสมอจาก fibrosis: เป็นภาพของระยะเรื้อรัง\n— จุดขาวจัดจาก ectopic mineralisation: พบในระยะเรื้อรัง\n— เส้นใยเรียงขนานสม่ำเสมอ echogenicity ปกติ: เป็นภาพของเอ็นปกติหรือเอ็นที่หายดีแล้ว\n— ขอบเอ็นติดกับเนื้อเยื่อรอบข้าง: adhesion เป็นภาวะของระยะเรื้อรัง",
    "source": "Tendon/Ligament injuries and treatment หน้า 27-41",
    "verified": "Tendon/Ligament injuries and treatment หน้า 28 (acute: increased size, decreased echogenicity), 30-32 (hypo or anechogenic lesion central, peripheral, diffuse), 34-35 (echogenicity and fibre alignment improve with time), 36-41 (chronic: fibrosis, ectopic mineralisation, adhesions); lecture recording",
    "sourceType": "lecture-derived",
    "examOrigin": "เขียนขึ้นจากเลคเชอร์ Equine Medicine ปี 2568 เรื่อง tendon and ligament injuries and treatment",
    "tags": [
      "equine-tendon",
      "ultrasound-acute-lesion"
    ],
    "sourcePages": [
      {
        "doc": "equine-tendon-2568",
        "edition": "157p",
        "page": 27
      },
      {
        "doc": "equine-tendon-2568",
        "edition": "157p",
        "page": 41
      }
    ]
  },
  {
    "id": 216017,
    "subject": "equine-medicine",
    "topic": "equine-tendon",
    "year": 5,
    "type": "mcq",
    "q": "หลังพ้นระยะ acute ของการบาดเจ็บ SDFT ในม้าแข่ง แผนฟื้นฟูข้อใดเหมาะสมที่สุด",
    "options": [
      "พักในแปลงหญ้า 6 เดือนโดยไม่ออกกำลัง แล้วกลับไปซ้อมเต็มที่",
      "จูงเดินระยะสั้นแล้วเพิ่มทีละขั้น ทำ ultrasound ซ้ำก่อนเพิ่มงานทุกครั้ง",
      "พักในคอก (box rest) จนหายบวมและคลำไม่เจ็บ แล้วกลับไปซ้อมตามโปรแกรมเดิมทันที",
      "ซ้อมต่อโดยลดความเร็วลง และใช้การคลำเอ็นประเมินแทน ultrasound"
    ],
    "answer": 1,
    "explain": "หลังระยะ acute เป้าหมายคือกันการฉีกซ้ำ และให้เส้นใย collagen ใหม่เรียงตัวตามแนวยาวของเอ็น ซึ่งต้องอาศัยแรงยืดหดที่พอดี จึงใช้ controlled exercise เริ่มจากจูงเดินระยะสั้นแล้วค่อยๆ เพิ่มระยะเวลาและความเร็วทีละขั้นจาก walk ไป trot และ canter ประคบเย็นต่อหลังออกกำลัง และทำ ultrasound ซ้ำก่อนเพิ่มระดับงานทุกครั้งเพื่อดูว่าเอ็นพร้อมรับงานเพิ่มหรือยัง controlled exercise ได้ผลดีกว่าการปล่อยพักอย่างเดียว การฟื้นตัวใช้เวลาหลายเดือน และรายที่ฉีกมากอาจนานกว่า 1 ปี\n\n❌ ทำไมข้ออื่นผิด\n— พักในแปลง 6 เดือนโดยไม่ออกกำลัง: การพักอย่างเดียวได้ผลด้อยกว่า controlled exercise เพราะเส้นใยใหม่ไม่ได้ถูกจัดเรียงตามแนวแรง และการกลับไปซ้อมเต็มที่ทันทีเสี่ยงฉีกซ้ำ\n— Box rest จนหายบวมแล้วกลับไปซ้อม: box rest ใช้เฉพาะช่วงแรกราว 2 สัปดาห์ ถ้าพักต่อโดยไม่มี controlled exercise เนื้อเยื่อที่ซ่อมจะเป็น scar ที่แข็งแรงน้อย และการหายบวมไม่ได้แปลว่าเอ็นหายแล้ว\n— ซ้อมต่อแต่ลดความเร็วและคลำประเมิน: การตรวจทางคลินิกบอกระดับการหายของเอ็นได้ไม่แม่น ต้องใช้ ultrasound ก่อนเพิ่มงาน และการซ้อมต่อทันทีเสี่ยงฉีกซ้ำ",
    "source": "Tendon/Ligament injuries and treatment หน้า 22, 111-120",
    "verified": "Tendon/Ligament injuries and treatment หน้า 114 (subacute: prevent re-injury, promote longitudinal alignment), 115-116 (walk in-hand, continue cold after walk), 118 (controlled exercise superior to field rest alone), 120 (re-scan prior to any increase in exercise), 22 (clinical assessment little accurate); lecture recording",
    "sourceType": "lecture-derived",
    "examOrigin": "เขียนขึ้นจากเลคเชอร์ Equine Medicine ปี 2568 เรื่อง tendon and ligament injuries and treatment",
    "tags": [
      "equine-tendon",
      "controlled-exercise"
    ],
    "sourcePages": [
      {
        "doc": "equine-tendon-2568",
        "edition": "157p",
        "page": 22
      },
      {
        "doc": "equine-tendon-2568",
        "edition": "157p",
        "page": 111
      },
      {
        "doc": "equine-tendon-2568",
        "edition": "157p",
        "page": 112
      },
      {
        "doc": "equine-tendon-2568",
        "edition": "157p",
        "page": 113
      },
      {
        "doc": "equine-tendon-2568",
        "edition": "157p",
        "page": 114
      },
      {
        "doc": "equine-tendon-2568",
        "edition": "157p",
        "page": 115
      },
      {
        "doc": "equine-tendon-2568",
        "edition": "157p",
        "page": 116
      },
      {
        "doc": "equine-tendon-2568",
        "edition": "157p",
        "page": 117
      },
      {
        "doc": "equine-tendon-2568",
        "edition": "157p",
        "page": 118
      },
      {
        "doc": "equine-tendon-2568",
        "edition": "157p",
        "page": 119
      },
      {
        "doc": "equine-tendon-2568",
        "edition": "157p",
        "page": 120
      }
    ]
  },
  {
    "id": 216018,
    "subject": "equine-medicine",
    "topic": "equine-tendon",
    "year": 5,
    "type": "mcq",
    "q": "เหตุใดเอ็น SDFT ของม้าที่รักษาจนหายแล้วจึงกลับมาฉีกซ้ำได้บ่อย",
    "options": [
      "เชื้อแบคทีเรียที่แฝงอยู่ในเนื้อเอ็นกลับมาก่อการอักเสบซ้ำเมื่อม้ากลับไปซ้อม",
      "เอ็นที่หายแล้วสร้าง type I collagen มากเกินไปจนแข็งและเปราะกว่าเอ็นปกติ",
      "ยา NSAID ที่ใช้ระหว่างรักษาทำให้เส้นใยเอ็นเสื่อมสภาพถาวรจนรับแรงไม่ได้",
      "เนื้อเยื่อที่ซ่อมเป็น scar จาก type III collagen ที่เรียงตัวไม่เป็นระเบียบ"
    ],
    "answer": 3,
    "explain": "เอ็นที่บาดเจ็บซ่อมตัวด้วยเนื้อเยื่อใหม่ที่เป็น type III collagen เรียงตัวไม่เป็นระเบียบ แล้วปรับโครงสร้างอย่างช้าๆ ผลคือ scar ที่ยืดหยุ่นและแข็งแรงน้อยกว่าเอ็นเดิมซึ่งเป็น type I collagen เรียงขนานกัน เมื่อม้ากลับไปรับแรงเต็มที่ เอ็นจึงฉีกซ้ำได้ง่าย มักเกิดที่รอยต่อระหว่าง scar กับเอ็นปกติ การฉีกซ้ำพบได้ราว 30-87.5% ยิ่งเส้นใยใหม่เรียงตัวดีและเกิด scar น้อย โอกาสฉีกซ้ำก็ยิ่งลดลง\n\n❌ ทำไมข้ออื่นผิด\n— แบคทีเรียแฝงในเอ็นกลับมาอักเสบ: การบาดเจ็บเอ็นจากการใช้งานเป็นการฉีกขาดของเส้นใยจากแรงซ้ำๆ และการยืดเกิน ไม่ใช่การติดเชื้อ\n— สร้าง type I collagen มากเกินจนเปราะ: เนื้อเยื่อที่ซ่อมมี type III collagen มาก ส่วน type I คือ collagen ของเอ็นปกติ\n— NSAID ทำให้เส้นใยเสื่อมถาวร: NSAID ใช้ลดการอักเสบในระยะ acute การฉีกซ้ำมาจากคุณภาพของเนื้อเยื่อที่ซ่อม ไม่ใช่จากยา",
    "source": "Tendon/Ligament injuries and treatment หน้า 2, 11, 19, 20, 44",
    "verified": "Tendon/Ligament injuries and treatment หน้า 19 (immature matrix, type III collagen, poor bundle organisation), 44 (recurrence the rule, mechanical inadequacy, often at scar/tendon interface), 2 (recurrence 30-87.5%), 11 (cyclic trauma, hyperextension); lecture recording (ซ่อมแล้วไม่แข็งแรงเท่าเดิม ฉีกซ้ำง่าย; scar tissue ไม่มีความแข็งแรงและ elasticity)",
    "sourceType": "lecture-derived",
    "examOrigin": "เขียนขึ้นจากเลคเชอร์ Equine Medicine ปี 2568 เรื่อง tendon and ligament injuries and treatment",
    "tags": [
      "equine-tendon",
      "tendon-recurrence"
    ],
    "sourcePages": [
      {
        "doc": "equine-tendon-2568",
        "edition": "157p",
        "page": 2
      },
      {
        "doc": "equine-tendon-2568",
        "edition": "157p",
        "page": 11
      },
      {
        "doc": "equine-tendon-2568",
        "edition": "157p",
        "page": 19
      },
      {
        "doc": "equine-tendon-2568",
        "edition": "157p",
        "page": 20
      },
      {
        "doc": "equine-tendon-2568",
        "edition": "157p",
        "page": 44
      }
    ]
  },
  {
    "id": 216019,
    "subject": "equine-medicine",
    "topic": "equine-pythium",
    "year": 5,
    "type": "mcq",
    "q": "Swamp cancer หรือ bursatte เป็นชื่อเรียกอีกชื่อของโรคใดในม้า",
    "options": [
      "Cutaneous habronemiasis",
      "Dermatophilosis",
      "Equine pythiosis",
      "Equine sarcoid"
    ],
    "answer": 2,
    "explain": "Equine pythiosis เกิดจาก Pythium insidiosum มีชื่อเรียกอื่นว่า bursatte หรือ swamp cancer ม้าติดจากการสัมผัสวัสดุหรือสิ่งแวดล้อมที่มีเชื้อ เช่น น้ำเจิ่งนอง\n\nทำไมข้ออื่นผิด\nCutaneous habronemiasis: รอยโรคจากตัวอ่อน Habronema ที่แมลงวันนำมาปล่อยบนผิวหนังที่ชื้นหรือบนแผล\nDermatophilosis: มี 2 กลุ่มอาการ คือ rain scald ที่ลำตัวด้านบน และ mud fever ที่ขาส่วนปลาย\nEquine sarcoid: เนื้องอกผิวหนังที่พบบ่อยที่สุดในม้า สัมพันธ์กับ bovine papillomavirus",
    "source": "Eq Infectious Dz and Biosecurity หน้า 67; Equine dermatology and wound management หน้า 28, 34 และ 41; 14B7TUfov00 [121:06-121:37]",
    "verified": "Eq Infectious Dz and Biosecurity หน้า 67 (Pythium insidiosum, synonym bursatte or swamp cancer, contact with infected material, environment); 14B7TUfov00 [121:06-121:37] (อีกชื่อคือ swamp cancer ติดจากน้ำเจิ่งนอง); Equine dermatology and wound management หน้า 28 (rain scald, mud fever), 34 (larvae of Habronema spp.), 41 (sarcoid, most common equine neoplasm, BPV)",
    "sourceType": "lecture-derived",
    "examOrigin": "เขียนขึ้นจากเลคเชอร์ Equine Medicine ปี 2569 เรื่อง pythiosis",
    "tags": [
      "equine-pythium",
      "pythiosis-synonym"
    ],
    "sourcePages": [
      {
        "doc": "equine-infectious-2569",
        "edition": "83p",
        "page": 67
      },
      {
        "doc": "equine-derm-wound-2569",
        "edition": "97p",
        "page": 28
      },
      {
        "doc": "equine-derm-wound-2569",
        "edition": "97p",
        "page": 34
      },
      {
        "doc": "equine-derm-wound-2569",
        "edition": "97p",
        "page": 41
      }
    ]
  },
  {
    "id": 216020,
    "subject": "equine-medicine",
    "topic": "equine-pythium",
    "year": 5,
    "type": "mcq",
    "q": "Clinical characteristics ของ equine pythiosis แบ่งเป็น 3 รูปแบบ (pattern) ได้แก่ข้อใด",
    "options": [
      "Acute, chronic และ inapparent",
      "Acute, chronic และ severe chronic",
      "Peracute, acute และ subacute",
      "Cardiac, pulmonary และ mixed"
    ],
    "answer": 1,
    "explain": "รอยโรค equine pythiosis แบ่งตามลักษณะทางคลินิกเป็น acute infection, chronic infection และ severe chronic infection ในประเทศไทยพบได้ทั้งแบบ chronic และ severe chronic\n\nทำไมข้ออื่นผิด\nAcute, chronic และ inapparent: เป็น 3 รูปแบบของ equine infectious anemia\nPeracute, acute และ subacute: เป็นระยะของ equine piroplasmosis ซึ่งมี chronic form เป็นระยะที่ 4\nCardiac, pulmonary และ mixed: เป็นรูปแบบของ African horse sickness",
    "source": "Eq Infectious Dz and Biosecurity หน้า 12, 22, 64 และ 69; 14B7TUfov00 [122:07]",
    "verified": "Eq Infectious Dz and Biosecurity หน้า 69 (3 patterns: acute, chronic, severe chronic infection), 22 (EIA three forms: acute, chronic, inapparent), 64 (piroplasmosis: peracute, acute, subacute, chronic form), 12 (AHS: sub-clinical, cardiac, pulmonary, mixed form); 14B7TUfov00 [122:07] (ในไทยเจอ chronic กับ severe chronic)",
    "sourceType": "lecture-derived",
    "examOrigin": "เขียนขึ้นจากเลคเชอร์ Equine Medicine ปี 2569 เรื่อง pythiosis",
    "tags": [
      "equine-pythium",
      "pythiosis-patterns"
    ],
    "sourcePages": [
      {
        "doc": "equine-infectious-2569",
        "edition": "83p",
        "page": 69
      },
      {
        "doc": "equine-infectious-2569",
        "edition": "83p",
        "page": 22
      },
      {
        "doc": "equine-infectious-2569",
        "edition": "83p",
        "page": 64
      },
      {
        "doc": "equine-infectious-2569",
        "edition": "83p",
        "page": 12
      }
    ]
  },
  {
    "id": 216021,
    "subject": "equine-medicine",
    "topic": "equine-pythium",
    "year": 5,
    "type": "mcq",
    "q": "ม้ามีแผลเรื้อรังที่ขา ผล histopathology พบ hyphae เข้าได้กับ pythiosis วิธีใดใช้ยืนยันชนิดเชื้อว่าเป็น Pythium insidiosum",
    "options": [
      "Endoscopic examination",
      "Card agglutination test",
      "Giemsa stain ของ blood smear",
      "DNA sequencing หรือ PCR"
    ],
    "answer": 3,
    "explain": "การวินิจฉัย pythiosis ใช้ isolation และ culture, histopathology ที่ย้อม GMS หรือ PAS เพื่อหา hyphae, immunochromatography test (ICT) และยืนยันชนิดเชื้อด้วย DNA sequencing หรือ PCR\n\nทำไมข้ออื่นผิด\nEndoscopic examination: ใช้วินิจฉัย guttural pouch mycosis\nCard agglutination test: เป็นการตรวจทางซีรัมของ trypanosomiasis\nGiemsa stain ของ blood smear: ใช้หา Babesia caballi และ Theileria equi ในเม็ดเลือดแดงของม้าที่เป็น piroplasmosis",
    "source": "Eq Infectious Dz and Biosecurity หน้า 62, 63, 65, 70 และ 74; 14B7TUfov00 [123:12-123:43]",
    "verified": "Eq Infectious Dz and Biosecurity หน้า 70 (isolation, culture, histopathology with GMS or PAS, ICT, DNA sequencing, PCR), 74 (guttural pouch mycosis: endoscopic examination), 62 (trypanosomiasis: card agglutination test), 63 (Babesia caballi, Theileria equi), 65 (piroplasmosis: Giemsa stain); 14B7TUfov00 [123:12-123:43] (ทำ histopath หา hyphae แล้วทำ DNA sequencing ยืนยัน)",
    "sourceType": "lecture-derived",
    "examOrigin": "เขียนขึ้นจากเลคเชอร์ Equine Medicine ปี 2569 เรื่อง pythiosis",
    "tags": [
      "equine-pythium",
      "pythiosis-confirmation"
    ],
    "sourcePages": [
      {
        "doc": "equine-infectious-2569",
        "edition": "83p",
        "page": 70
      },
      {
        "doc": "equine-infectious-2569",
        "edition": "83p",
        "page": 74
      },
      {
        "doc": "equine-infectious-2569",
        "edition": "83p",
        "page": 62
      },
      {
        "doc": "equine-infectious-2569",
        "edition": "83p",
        "page": 63
      },
      {
        "doc": "equine-infectious-2569",
        "edition": "83p",
        "page": 65
      }
    ]
  },
  {
    "id": 218500,
    "subject": "equine-medicine",
    "topic": "equine-surgery-wound",
    "year": 5,
    "type": "mcq",
    "q": "ในโรงพยาบาลม้า ห้องเตรียมม้าก่อนผ่าตัด (patient preparation room) ซึ่งอยู่หน้าห้อง induction ใช้ทำงานใด",
    "options": [
      "ให้ยานำสลบ แล้วใช้รอกยกม้าขึ้นเตียงผ่าตัด",
      "ปูผ้าคลุมปลอดเชื้อและเปิดชุดเครื่องมือผ่าตัด",
      "ใส่ catheter ทำความสะอาดกีบ แปรงขน และล้างปากม้า",
      "เฝ้าดูม้าจนลุกยืนได้เองหลังหมดฤทธิ์ยาสลบ"
    ],
    "answer": 2,
    "explain": "ห้องเตรียมม้าแยกจากห้องผ่าตัดอื่นเพื่อรักษาความสะอาด มีขนาดพอและอุปกรณ์ครบ มีฝักบัวและนาฬิกา และตั้งอยู่หน้าห้อง induction งานในห้องนี้คือใส่ catheter ทำความสะอาดกีบ แปรงขน และล้างปากม้า ก่อนพาเข้าห้องวางยา\n\nทำไมข้ออื่นผิด\nให้ยานำสลบและยกม้าขึ้นเตียง: ทำในห้อง induction และห้องผ่าตัด\nปูผ้าคลุมปลอดเชื้อ: ทำในห้องผ่าตัดหลังจัดท่าม้าแล้ว\nเฝ้าดูจนลุกยืน: ทำในห้อง recovery",
    "source": "Equine surgery & anesthesia 5th year หน้า 11",
    "verified": "Equine surgery & anesthesia 5th year (2569) หน้า 11 (Patient preparation room: separated from other operating rooms, in front of the induction room, catheter placement, cleaning feet, brushing of the horse and rinsing the mouth); สไลด์ Equine Sx concept ของรุ่นพี่ Vet 85 หน้า 10 ติดดาวสีชมพูที่ catheter placement, cleaning feet",
    "sourceType": "student-compilation",
    "examOrigin": "Equine Sx concept (Vet 85) stars this point; their summary of the paper refers to the starred slides",
    "tags": [
      "equine-surgery-wound",
      "surgery-room-flow",
      "อิงแนวข้อสอบ"
    ],
    "sourcePages": [
      {
        "doc": "equine-surgery-anesthesia-2569",
        "edition": "94p",
        "page": 11
      },
      {
        "doc": "equine-sx-concept85",
        "edition": "62p",
        "page": 10
      }
    ]
  },
  {
    "id": 218501,
    "subject": "equine-medicine",
    "topic": "equine-anesthesia",
    "year": 5,
    "type": "mcq",
    "q": "ระหว่างที่ม้าฟื้นจากยาสลบหลังผ่าตัดภาคสนาม หลักการดูแลข้อใดถูกต้อง",
    "options": [
      "คุมศีรษะให้ปลอดภัยและคุมหางไว้ (safe head, control tail)",
      "ให้ม้ากินหญ้าและอาหารข้นทันทีที่ยกศีรษะได้",
      "ปล่อยม้าออกจากคอกทันทีที่ยืนได้ แม้ยังรู้สึกตัวไม่เต็มที่",
      "จัดให้ม้านอนหงาย (dorsal recumbency) จนกว่าจะรู้สึกตัวเต็มที่"
    ],
    "answer": 0,
    "explain": "ช่วงฟื้นจากยาสลบม้าต้องรู้สึกตัวเต็มที่และทรงตัวได้เอง ผู้ดูแลคุมศีรษะให้ปลอดภัยและคุมหางไว้ ม้าที่นอนอยู่ควรลุกยืนให้ได้ในครั้งเดียว หลังผ่าตัดให้อยู่ในคอกจนรู้สึกตัวเต็มที่ และงดอาหารจนรู้สึกตัว จากนั้นให้เฉพาะหญ้าใน 12 ชั่วโมงแรก\n\nทำไมข้ออื่นผิด\nให้หญ้าและอาหารข้นทันที: ต้องงดอาหารจนรู้สึกตัว แล้วให้เฉพาะหญ้าก่อน\nปล่อยออกจากคอกทันทีที่ยืนได้: ต้องอยู่ในคอกจนรู้สึกตัวเต็มที่\nนอนหงายจนรู้สึกตัว: การวางยาในภาคสนามจัดม้านอนตะแคง (lateral recumbency)",
    "source": "Equine surgery & anesthesia 5th year หน้า 92",
    "verified": "Equine surgery & anesthesia 5th year (2569) หน้า 92 (recovery: completely consciousness and balancing-itself, safe head, control tail, for recumbent: quick stand in one time, stay in box until complete consciousness, NPO until consciousness, only grass 12 hr); สไลด์ Equine Sx concept ของรุ่นพี่ Vet 85 หน้า 30 ติดดาวที่ Safe head, control tail",
    "sourceType": "student-compilation",
    "examOrigin": "Equine Sx concept (Vet 85) stars this point; their summary of the paper refers to the starred slides",
    "tags": [
      "equine-anesthesia",
      "anesthetic-recovery",
      "อิงแนวข้อสอบ"
    ],
    "sourcePages": [
      {
        "doc": "equine-surgery-anesthesia-2569",
        "edition": "94p",
        "page": 92
      },
      {
        "doc": "equine-sx-concept85",
        "edition": "62p",
        "page": 30
      }
    ]
  },
  {
    "id": 218502,
    "subject": "equine-medicine",
    "topic": "equine-anesthesia",
    "year": 5,
    "type": "mcq",
    "q": "ม้าที่ยังนอนอยู่ (recumbent) ระหว่างฟื้นจากยาสลบ ควรให้ลุกยืนแบบใด",
    "options": [
      "ดันให้ลุกทันทีที่เริ่มขยับขา แม้ยังไม่รู้สึกตัวเต็มที่",
      "ปล่อยให้ลุกแล้วล้มซ้ำหลายรอบ เพื่อฝึกการทรงตัวไปเอง",
      "ยกม้าขึ้นยืนด้วยรอกทุกตัว ไม่ให้ม้าออกแรงลุกเอง",
      "ลุกยืนได้อย่างรวดเร็วในครั้งเดียว เมื่อรู้สึกตัวและทรงตัวได้"
    ],
    "answer": 3,
    "explain": "ม้าที่นอนอยู่ช่วงฟื้นจากยาสลบควรลุกยืนอย่างรวดเร็วในครั้งเดียว (quick stand in one time) เมื่อรู้สึกตัวเต็มที่และทรงตัวได้เองแล้ว การลุกแล้วล้มหลายครั้งเพิ่มโอกาสบาดเจ็บ ระหว่างนั้นผู้ดูแลคุมศีรษะและหางไว้\n\nทำไมข้ออื่นผิด\nดันให้ลุกก่อนรู้สึกตัว: ม้ายังทรงตัวไม่ได้และล้มบาดเจ็บได้\nลุกแล้วล้มซ้ำหลายรอบ: ตรงข้ามกับหลักให้ลุกในครั้งเดียว\nยกด้วยรอกทุกตัว: ไม่ใช่หลักการดูแลปกติ ม้าที่รู้สึกตัวแล้วลุกยืนเองได้",
    "source": "Equine surgery & anesthesia 5th year หน้า 92",
    "verified": "Equine surgery & anesthesia 5th year (2569) หน้า 92 (For recumbent: quick stand in one time, completely consciousness and balancing-itself); สไลด์ Equine Sx concept ของรุ่นพี่ Vet 85 หน้า 30 ติดดาวที่ For recumbent: quick stand in one time",
    "sourceType": "student-compilation",
    "examOrigin": "Equine Sx concept (Vet 85) stars this point; their summary of the paper refers to the starred slides",
    "tags": [
      "equine-anesthesia",
      "anesthetic-recovery",
      "อิงแนวข้อสอบ"
    ],
    "sourcePages": [
      {
        "doc": "equine-surgery-anesthesia-2569",
        "edition": "94p",
        "page": 92
      },
      {
        "doc": "equine-sx-concept85",
        "edition": "62p",
        "page": 30
      }
    ]
  },
  {
    "id": 218503,
    "subject": "equine-medicine",
    "topic": "equine-surgery-wound",
    "year": 5,
    "type": "mcq",
    "q": "เมื่อเย็บปิดแผลแบบ first-intention healing (primary closure) ผลการหายของ pony เทียบกับม้าเป็นอย่างไร",
    "options": [
      "Pony สำเร็จต่ำกว่า เพราะอักเสบช่วงแรกรุนแรง แผลที่เย็บจึงแยกและเกิดกระดูกตายเป็นชิ้นบ่อยกว่า",
      "Pony สำเร็จสูงกว่า กระดูกตายเป็นชิ้นน้อยกว่า แม้แผลลึกกว่าและใช้ยาต้านจุลชีพน้อยกว่า",
      "ม้าสำเร็จสูงกว่า เพราะการอักเสบที่ช้าทำให้ติดเชื้อน้อย แผลแยกน้อย และกระดูกตายเป็นชิ้นน้อยกว่า",
      "สำเร็จพอกันเมื่อเย็บปิด ความต่างระหว่างม้ากับ pony พบเฉพาะแผลที่ปล่อยให้หายเอง (second intention)"
    ],
    "answer": 1,
    "explain": "การเย็บปิดแผลแบบ first-intention เลือกใช้เมื่อต้องการให้หายเร็วและแผลเป็นสวย pony ได้ผลสำเร็จสูงกว่าม้า เกิด bone sequestration น้อยกว่า แม้แผลจะลึกกว่าและใช้ยาต้านจุลชีพน้อยกว่า ส่วนม้ามีการตอบสนองแบบอักเสบที่ช้ากว่า จึงเสี่ยงติดเชื้อมากกว่า และ NSAIDs อาจรบกวนการหายของแผล\n\nทำไมข้ออื่นผิด\nPony สำเร็จต่ำกว่า: กลับกัน pony สำเร็จสูงกว่า\nม้าสำเร็จสูงกว่าเพราะอักเสบช้า: การอักเสบที่ช้าทำให้ม้าเสี่ยงติดเชื้อมากขึ้น\nสำเร็จพอกัน: ความต่างพบทั้งแผลที่เย็บปิดและแผลที่ปล่อยหายเอง",
    "source": "Equine dermatology and wound management หน้า 54",
    "verified": "Equine dermatology and wound management (2569) หน้า 54 (First-intention healing: preferred for speed and cosmetic outcome, Ponies: higher success, less bone sequestration, despite deeper wounds and less antimicrobial use, Horses: slower inflammatory response, higher infection risk, NSAIDs may impair healing); สไลด์ Equine Sx concept ของรุ่นพี่ Vet 85 หน้า 35 ติดดาวที่ Ponies และ Horses",
    "sourceType": "student-compilation",
    "examOrigin": "Equine Sx concept (Vet 85) stars this point; their summary of the paper refers to the starred slides",
    "tags": [
      "equine-surgery-wound",
      "first-intention-healing",
      "อิงแนวข้อสอบ"
    ],
    "sourcePages": [
      {
        "doc": "equine-derm-wound-2569",
        "edition": "97p",
        "page": 54
      },
      {
        "doc": "equine-sx-concept85",
        "edition": "62p",
        "page": 35
      }
    ]
  },
  {
    "id": 218504,
    "subject": "equine-medicine",
    "topic": "equine-infectious",
    "year": 5,
    "type": "mcq",
    "q": "พิษสุนัขบ้า (rabies) ในม้าแสดงอาการได้เป็นรูปแบบใด",
    "options": [
      "Pulmonary form และ cardiac form",
      "Mad-dog form และ paralysis form",
      "Nasal form และ cutaneous form",
      "Acute form และ inapparent form"
    ],
    "answer": 1,
    "explain": "พิษสุนัขบ้าในม้าพบไม่บ่อยแต่ตายทุกราย ติดจากการถูกสัตว์ที่มีเชื้อกัด แสดงออกได้ 2 รูปแบบ คือ mad-dog form และ paralysis form อาการแปรผันและอาจสับสนกับภาวะอื่น เช่น colic เริ่มจากอาการไม่จำเพาะแล้วจึงเป็นอัมพาตและตาย คนติดได้จากการถูกกัดหรือสัมผัสน้ำลายของม้าป่วย\n\nทำไมข้ออื่นผิด\nPulmonary และ cardiac form: เป็นรูปแบบของ African horse sickness\nNasal และ cutaneous form: เป็นรูปแบบของ glanders ซึ่งมี pulmonary form ด้วย\nAcute และ inapparent form: เป็นรูปแบบของ equine infectious anemia ซึ่งมี chronic form ด้วย",
    "source": "Eq Infectious Dz and Biosecurity หน้า 4",
    "verified": "Eq Infectious Dz and Biosecurity (2569) หน้า 4 (Rabies: rare but invariably fatal, bite from infected animals, Mad-dog and Paralysis form, could be confused with colic), หน้า 12 (AHS forms), หน้า 22 (EIA forms), หน้า 53 (glanders forms); สไลด์ Eq inf dz 67 ของรุ่นพี่ Vet 84 หน้า 4 ไฮไลต์ Mad-dog และ Paralysis form",
    "sourceType": "student-compilation",
    "examOrigin": "Equine Med & Surg (Vet 84) marked this point on their copy of the lecture slides",
    "tags": [
      "equine-infectious",
      "rabies",
      "อิงแนวข้อสอบ"
    ],
    "sourcePages": [
      {
        "doc": "equine-infectious-2569",
        "edition": "83p",
        "page": 4
      },
      {
        "doc": "equine-infectious-2569",
        "edition": "83p",
        "page": 12
      },
      {
        "doc": "equine-infectious-2569",
        "edition": "83p",
        "page": 22
      },
      {
        "doc": "equine-infectious-2569",
        "edition": "83p",
        "page": 53
      },
      {
        "doc": "equine-infectious-v84",
        "edition": "75p",
        "page": 4
      }
    ]
  },
  {
    "id": 218505,
    "subject": "equine-medicine",
    "topic": "equine-infectious",
    "year": 5,
    "type": "mcq",
    "q": "เชื้อก่อโรค African horse sickness (Orbivirus) อยู่ในสกุลเดียวกับเชื้อก่อโรคใดในสัตว์เคี้ยวเอื้อง",
    "options": [
      "Foot-and-mouth disease",
      "Lumpy skin disease",
      "Bluetongue disease",
      "Peste des petits ruminants"
    ],
    "answer": 2,
    "explain": "African horse sickness เกิดจาก Orbivirus ซึ่งเป็นไวรัส RNA สายคู่ไม่มีเปลือกหุ้ม ไวรัสสกุลเดียวกันนี้ก่อ bluetongue ในสัตว์เคี้ยวเอื้อง ในแอฟริกาพบ AHS 9 ซีโรไทป์ และการเกิดโรคตามฤดูสัมพันธ์กับช่วงที่พาหะชุกชุม\n\nทำไมข้ออื่นผิด\nFoot-and-mouth disease: เกิดจาก Aphthovirus\nLumpy skin disease: เกิดจาก Capripoxvirus\nPeste des petits ruminants: เกิดจาก Morbillivirus",
    "source": "Eq Infectious Dz and Biosecurity หน้า 8",
    "verified": "Eq Infectious Dz and Biosecurity (2569) หน้า 8 (Cause: Orbivirus, non-envelop double-stranded RNA, Equidae: African horse sickness, Ruminant: Bluetongue disease, 9 serotypes in Africa); สไลด์ Eq inf dz 67 ของรุ่นพี่ Vet 84 หน้า 8 ปากกาแดงชี้ Ruminant: Bluetongue disease",
    "sourceType": "student-compilation",
    "examOrigin": "Equine Med & Surg (Vet 84) marked this point on their copy of the lecture slides",
    "tags": [
      "equine-infectious",
      "african-horse-sickness",
      "อิงแนวข้อสอบ"
    ],
    "sourcePages": [
      {
        "doc": "equine-infectious-2569",
        "edition": "83p",
        "page": 8
      },
      {
        "doc": "equine-infectious-v84",
        "edition": "75p",
        "page": 8
      }
    ]
  },
  {
    "id": 218506,
    "subject": "equine-medicine",
    "topic": "equine-infectious",
    "year": 5,
    "type": "mcq",
    "q": "ในการฉีดวัคซีน African horse sickness ของประเทศไทย เข็มแรกใช้วัคซีนรวมซีโรไทป์ใด และเข็มกระตุ้นใช้ซีโรไทป์ใด",
    "options": [
      "เข็มแรก polyvalent ซีโรไทป์ 1 และ 4 เข็มกระตุ้น monovalent ซีโรไทป์ 1",
      "เข็มแรก polyvalent ซีโรไทป์ 1 และ 9 เข็มกระตุ้น monovalent ซีโรไทป์ 9",
      "เข็มแรก monovalent ซีโรไทป์ 4 เข็มกระตุ้น polyvalent ซีโรไทป์ 1 และ 4",
      "เข็มแรก polyvalent ซีโรไทป์ 4 และ 7 เข็มกระตุ้น monovalent ซีโรไทป์ 4"
    ],
    "answer": 0,
    "explain": "เชื้อ AHS ที่พบในประเทศไทยเป็นซีโรไทป์ 1 การฉีดวัคซีนในไทยจึงเริ่มด้วยวัคซีนรวม (polyvalent) ซีโรไทป์ 1 และ 4 แล้วกระตุ้นด้วยวัคซีนเดี่ยว (monovalent) ซีโรไทป์ 1 ก่อนเลือกวัคซีนต้องระบุไวรัสและซีโรไทป์ของการระบาดก่อนเสมอ\n\nทำไมข้ออื่นผิด\nเข็มกระตุ้นซีโรไทป์ 9: ไทยพบซีโรไทป์ 1 ส่วนตัวเลข 9 คือจำนวนซีโรไทป์ที่พบในแอฟริกา\nเข็มแรก monovalent ซีโรไทป์ 4: ลำดับกลับกัน และซีโรไทป์ที่ระบาดในไทยคือ 1\nซีโรไทป์ 4 และ 7: ไม่ตรงกับซีโรไทป์ 1 ที่พบในไทย",
    "source": "Eq Infectious Dz and Biosecurity หน้า 8 และ 13",
    "verified": "Eq Infectious Dz and Biosecurity (2569) หน้า 8 (9 serotypes occur in Africa, serotype 1 in Thailand), หน้า 13 (TH: 1st poly type 1 และ 4, booster mono type 1, identify the virus and serotype); สไลด์ Eq inf dz 67 ของรุ่นพี่ Vet 84 หน้า 8 ไฮไลต์ Serotype 1 in Thailand และหน้า 14 ไฮไลต์ Polyvalent, monovalent พร้อมวง 1 และ 4",
    "sourceType": "student-compilation",
    "examOrigin": "Equine Med & Surg (Vet 84) marked this point on their copy of the lecture slides",
    "tags": [
      "equine-infectious",
      "african-horse-sickness",
      "ahs-vaccine",
      "อิงแนวข้อสอบ"
    ],
    "sourcePages": [
      {
        "doc": "equine-infectious-2569",
        "edition": "83p",
        "page": 8
      },
      {
        "doc": "equine-infectious-2569",
        "edition": "83p",
        "page": 13
      },
      {
        "doc": "equine-infectious-v84",
        "edition": "75p",
        "page": 8
      },
      {
        "doc": "equine-infectious-v84",
        "edition": "75p",
        "page": 14
      }
    ]
  },
  {
    "id": 218507,
    "subject": "equine-medicine",
    "topic": "equine-infectious",
    "year": 5,
    "type": "mcq",
    "q": "ม้าป่วย African horse sickness มีไข้ หายใจลำบาก รูจมูกบาน มีน้ำมูกเป็นฟอง และเยื่อตาแดง อาการนี้เข้ากับรูปแบบใด และอัตราตายประมาณเท่าใด",
    "options": [
      "Sub-acute หรือ cardiac form อัตราตายมากกว่าร้อยละ 50",
      "Mixed form อัตราตายมากกว่าร้อยละ 70",
      "Horse sickness fever ส่วนใหญ่หายได้เอง",
      "Acute respiratory หรือ pulmonary form อัตราตายมากกว่าร้อยละ 95"
    ],
    "answer": 3,
    "explain": "AHS มี 4 รูปแบบ รูปแบบ acute respiratory (pulmonary form) มีไข้ หายใจลำบาก รูจมูกบาน น้ำมูกเป็นฟอง เยื่อตาแดง อัตราตายมากกว่าร้อยละ 95 และมักตายภายใน 1 สัปดาห์\n\nทำไมข้ออื่นผิด\nSub-acute หรือ cardiac form: มีไข้ร่วมกับบวมที่หน้า คอ อก brisket และไหล่ รวมถึงแอ่งเหนือเบ้าตา อัตราตายมากกว่าร้อยละ 50\nMixed form: อาการทางปอดและหัวใจแบบอ่อนกว่า อัตราตายมากกว่าร้อยละ 70\nHorse sickness fever: เป็นแบบ sub-clinical มีไข้ต่ำๆ และมักหายเอง",
    "source": "Eq Infectious Dz and Biosecurity หน้า 11 และ 12",
    "verified": "Eq Infectious Dz and Biosecurity (2569) หน้า 11 (swelling at supraorbital fossa, respiratory distress, frothy fluid), หน้า 12 (4 main forms with mortality: sub-clinical recovers, cardiac >50%, pulmonary >95% within 1 week, mixed >70%); สไลด์ Eq inf dz 67 ของรุ่นพี่ Vet 84 หน้า 11 ไฮไลต์ Mortality rate และวง 70-95%, หน้า 12 ไฮไลต์ Swelling at supraorbital fossa และ Respiratory distress, frothy fluid",
    "sourceType": "student-compilation",
    "examOrigin": "Equine Med & Surg (Vet 84) marked this point on their copy of the lecture slides",
    "tags": [
      "equine-infectious",
      "african-horse-sickness",
      "อิงแนวข้อสอบ"
    ],
    "sourcePages": [
      {
        "doc": "equine-infectious-2569",
        "edition": "83p",
        "page": 11
      },
      {
        "doc": "equine-infectious-2569",
        "edition": "83p",
        "page": 12
      },
      {
        "doc": "equine-infectious-v84",
        "edition": "75p",
        "page": 11
      },
      {
        "doc": "equine-infectious-v84",
        "edition": "75p",
        "page": 12
      }
    ]
  },
  {
    "id": 218508,
    "subject": "equine-medicine",
    "topic": "equine-infectious",
    "year": 5,
    "type": "mcq",
    "q": "วัคซีน African horse sickness ที่มีจำหน่ายเป็นวัคซีนชนิดใด และมีข้อควรระวังอะไร",
    "options": [
      "วัคซีนเชื้อตาย ภูมิคุ้มกันอยู่สั้นจึงต้องฉีดกระตุ้นทุกเดือนตลอดฤดูระบาด",
      "วัคซีน subunit ใช้รักษาม้าที่ป่วยแล้วเพื่อให้หายเร็วขึ้นและลดอัตราตาย",
      "วัคซีนเชื้อเป็นอ่อนฤทธิ์ เสี่ยงกลับมาก่อโรคและเกิด reassortment กับเชื้อในธรรมชาติ",
      "วัคซีน DNA ห้ามใช้ในเขตระบาด เพราะแยกม้าที่ฉีดออกจากม้าป่วยไม่ได้เลย"
    ],
    "answer": 2,
    "explain": "วัคซีน AHS ที่มีจำหน่ายเป็นวัคซีนเชื้อเป็นอ่อนฤทธิ์ (live attenuated) มีทั้งแบบรวมหลายซีโรไทป์และแบบเดี่ยว ข้อควรระวังคือเชื้อวัคซีนอาจกลับมาก่อโรค (reversion to virulence) และแลกชิ้นส่วนพันธุกรรม (reassortment) กับเชื้อในธรรมชาติได้ วัคซีนใช้ป้องกัน ไม่ได้ใช้รักษา และม้าที่ฉีดต้องระบุตัวด้วยไมโครชิป\n\nทำไมข้ออื่นผิด\nวัคซีนเชื้อตายฉีดทุกเดือน: วัคซีนที่มีจำหน่ายเป็นเชื้อเป็นอ่อนฤทธิ์\nใช้รักษาม้าป่วย: วัคซีนใช้ป้องกันในม้าที่ยังไม่ติดเชื้อ\nห้ามใช้ในเขตระบาด: มาตรการคือฉีดม้าที่ยังไม่ติดเชื้อในเขตป้องกันและระบุตัวม้าที่ฉีด",
    "source": "Eq Infectious Dz and Biosecurity หน้า 13",
    "verified": "Eq Infectious Dz and Biosecurity (2569) หน้า 13 (Live attenuated, commercially available, risk of reversion to virulence and reassortment, wild type and vaccine type, vaccination of non-infected horses in protection zone, identify vaccinated animals by microchip); สไลด์ Eq inf dz 67 ของรุ่นพี่ Vet 84 หน้า 14 ขีดเส้นใต้ Live attenuated และ Risk of reversion พร้อมโน้ตว่าวัคซีนใช้ป้องกันเท่านั้น",
    "sourceType": "student-compilation",
    "examOrigin": "Equine Med & Surg (Vet 84) marked this point on their copy of the lecture slides",
    "tags": [
      "equine-infectious",
      "african-horse-sickness",
      "ahs-vaccine",
      "อิงแนวข้อสอบ"
    ],
    "sourcePages": [
      {
        "doc": "equine-infectious-2569",
        "edition": "83p",
        "page": 13
      },
      {
        "doc": "equine-infectious-v84",
        "edition": "75p",
        "page": 14
      }
    ]
  },
  {
    "id": 218509,
    "subject": "equine-medicine",
    "topic": "equine-infectious",
    "year": 5,
    "type": "mcq",
    "q": "เมื่อเกิดการระบาดของ African horse sickness การฉีดวัคซีนให้ม้าที่ยังไม่ติดเชื้อในเขตป้องกัน (protection zone) ครอบคลุมรัศมีเท่าใด และต้องติดตามม้าที่ฉีดอย่างไร",
    "options": [
      "รัศมี 150 กิโลเมตร ทำเครื่องหมายที่สะโพก และวัดไข้วันละครั้งนาน 14 วัน",
      "รัศมี 50 กิโลเมตร ฝังไมโครชิประบุตัว และวัดไข้วันละ 2 ครั้งนานกว่า 30 วัน",
      "รัศมี 5 กิโลเมตร ฝังไมโครชิประบุตัว และวัดไข้วันละครั้งนาน 7 วัน",
      "รัศมี 700 กิโลเมตร ตัดขนแผงคอเป็นสัญลักษณ์ และวัดไข้สัปดาห์ละครั้ง"
    ],
    "answer": 1,
    "explain": "มาตรการเมื่อ AHS ระบาด ได้แก่ ระบุไวรัสและซีโรไทป์ ตั้งเขตกักกันและควบคุมการเคลื่อนย้ายอย่างเข้มงวด ฉีดวัคซีนม้าที่ยังไม่ติดเชื้อในเขตป้องกันรัศมี 50 กิโลเมตร ระบุตัวม้าที่ฉีดด้วยไมโครชิป วัดไข้วันละ 2 ครั้งนานกว่า 30 วัน ควบคุมพาหะด้วยมุ้งและยาฆ่าแมลง และเลี้ยงม้าทุกตัวในคอกกันแมลง\n\nทำไมข้ออื่นผิด\n150 และ 700 กิโลเมตร: เป็นระยะที่พาหะติดเชื้ออาจถูกลมพัดไปได้ทางบกและข้ามทะเล ไม่ใช่รัศมีเขตป้องกัน\n5 กิโลเมตร วัดไข้วันละครั้ง 7 วัน: แคบและสั้นกว่ามาตรการที่กำหนด",
    "source": "Eq Infectious Dz and Biosecurity หน้า 9 และ 13",
    "verified": "Eq Infectious Dz and Biosecurity (2569) หน้า 13 (vaccination of non-infected horses in protection zone (50 km), identify vaccinated animals (microchip), monitor for fever 2 times/day >30 days, net and insecticide, insect-proof housing), หน้า 9 (wind-borne spread of vectors up to 700 km over water or 150 km over land); สไลด์ Eq inf dz 67 ของรุ่นพี่ Vet 84 หน้า 14 ไฮไลต์ Vaccination of non-infected horses in protection zone (50km)",
    "sourceType": "student-compilation",
    "examOrigin": "Equine Med & Surg (Vet 84) marked this point on their copy of the lecture slides",
    "tags": [
      "equine-infectious",
      "african-horse-sickness",
      "outbreak-control",
      "อิงแนวข้อสอบ"
    ],
    "sourcePages": [
      {
        "doc": "equine-infectious-2569",
        "edition": "83p",
        "page": 13
      },
      {
        "doc": "equine-infectious-2569",
        "edition": "83p",
        "page": 9
      },
      {
        "doc": "equine-infectious-v84",
        "edition": "75p",
        "page": 14
      }
    ]
  },
  {
    "id": 218510,
    "subject": "equine-medicine",
    "topic": "equine-infectious",
    "year": 5,
    "type": "mcq",
    "q": "ข้อใดเป็นมาตรการควบคุมพาหะของ African horse sickness",
    "options": [
      "ถ่ายพยาธิม้าด้วย ivermectin หรือ moxidectin ทุกเดือน เพื่อตัดวงจรตัวอ่อนของริ้นที่เจริญในลำไส้ม้า",
      "ใช้มุ้งหรือตาข่าย พ่นยาฆ่าแมลง cypermethrin หรือ etofenprox และเลี้ยงม้าในคอกกันแมลง",
      "ฉีดวัคซีนเชื้อเป็นให้ม้าลายและลาในพื้นที่ทุกปี เพื่อตัดวงจรเชื้อจากแหล่งรังโรคไปสู่ริ้น",
      "ใส่ทรายอะเบท (temephos) ในรางน้ำทุกสัปดาห์ เพื่อกำจัดลูกน้ำยุงลายซึ่งเป็นพาหะหลักของโรค"
    ],
    "answer": 1,
    "explain": "AHS ติดต่อผ่านริ้น Culicoides เป็นหลัก การควบคุมพาหะใช้มุ้งหรือตาข่าย ยาฆ่าแมลงเช่น cypermethrin และ etofenprox ร่วมกับการจัดการที่ดี และเลี้ยงม้าทุกตัวในคอกที่กันแมลงได้\n\nทำไมข้ออื่นผิด\nถ่ายพยาธิด้วย ivermectin: ริ้นไม่ได้เจริญในลำไส้ม้า ยาถ่ายพยาธิไม่ใช่วิธีควบคุมพาหะนี้\nฉีดวัคซีนม้าลาย: ม้าลายเป็นแหล่งรังโรคที่ติดเชื้อโดยไม่ป่วย มาตรการที่กำหนดคือฉีดม้าที่ยังไม่ติดเชื้อในเขตป้องกันและควบคุมแมลง\nทรายอะเบทกำจัดลูกน้ำยุงลาย: พาหะหลักคือริ้น Culicoides ไม่ใช่ยุงลาย",
    "source": "Eq Infectious Dz and Biosecurity หน้า 9, 13 และ 15",
    "verified": "Eq Infectious Dz and Biosecurity (2569) หน้า 15 (AHS vector control: net, insecticide cypermethrin, etofenprox, good management), หน้า 13 (insect-proof housing), หน้า 9 (Culicoides spp. primary vector), หน้า 10 (zebras in the transmission cycle); สไลด์ Eq inf dz 67 ของรุ่นพี่ Vet 84 หน้า 16 ไฮไลต์ Etofenprox",
    "sourceType": "student-compilation",
    "examOrigin": "Equine Med & Surg (Vet 84) marked this point on their copy of the lecture slides",
    "tags": [
      "equine-infectious",
      "african-horse-sickness",
      "vector-control",
      "อิงแนวข้อสอบ"
    ],
    "sourcePages": [
      {
        "doc": "equine-infectious-2569",
        "edition": "83p",
        "page": 15
      },
      {
        "doc": "equine-infectious-2569",
        "edition": "83p",
        "page": 13
      },
      {
        "doc": "equine-infectious-2569",
        "edition": "83p",
        "page": 9
      },
      {
        "doc": "equine-infectious-v84",
        "edition": "75p",
        "page": 16
      }
    ]
  },
  {
    "id": 218511,
    "subject": "equine-medicine",
    "topic": "equine-infectious",
    "year": 5,
    "type": "mcq",
    "q": "Equine infectious anemia (EIA) ติดต่อระหว่างม้าผ่านทางใดเป็นหลัก",
    "options": [
      "แมลงดูดเลือด เช่น เหลือบ (Tabanus) แมลงวันคอก (Stomoxys) และยุง",
      "การกินอาหารและน้ำที่ปนเปื้อนน้ำมูกของม้าที่เป็นพาหะ",
      "การผสมพันธุ์ การผสมเทียม และมือหรืออุปกรณ์ที่ปนเปื้อน",
      "สปอร์ในดินที่เข้าทางแผลตะปูตำที่พื้นกีบ"
    ],
    "answer": 0,
    "explain": "EIA เกิดจาก lentivirus ในวงศ์ Retroviridae ชื่อเรียกอื่นคือ swamp disease หรือเอดส์ม้า ติดต่อผ่านแมลงดูดเลือด ได้แก่ เหลือบ (Tabanus) แมลงวันคอก (Stomoxys) และยุง แบ่งเป็น 3 รูปแบบ คือ acute, chronic และ inapparent\n\nทำไมข้ออื่นผิด\nกินอาหารและน้ำปนน้ำมูก: เป็นทางติดของ glanders\nการผสมพันธุ์และผสมเทียม: เป็นทางติดของ contagious equine metritis\nสปอร์ในดินเข้าทางแผล: เป็นทางติดของบาดทะยัก",
    "source": "Eq Infectious Dz and Biosecurity หน้า 22",
    "verified": "Eq Infectious Dz and Biosecurity (2569) หน้า 22 (EIA: Retroviridae, Lentiviridae, swamp disease, เอดส์ม้า, vector horse flies (Tabanus), stable flies (Stomoxys) and mosquitoes, acute, chronic, inapparent), หน้า 53 (glanders route), หน้า 56 (CEM route), หน้า 39 (tetanus route); สไลด์ Eq inf dz 67 ของรุ่นพี่ Vet 84 หน้า 23 ไฮไลต์ Horse flies (Tabanus), mosquitoes",
    "sourceType": "student-compilation",
    "examOrigin": "Equine Med & Surg (Vet 84) marked this point on their copy of the lecture slides",
    "tags": [
      "equine-infectious",
      "equine-infectious-anemia",
      "อิงแนวข้อสอบ"
    ],
    "sourcePages": [
      {
        "doc": "equine-infectious-2569",
        "edition": "83p",
        "page": 22
      },
      {
        "doc": "equine-infectious-v84",
        "edition": "75p",
        "page": 23
      }
    ]
  },
  {
    "id": 218512,
    "subject": "equine-medicine",
    "topic": "equine-infectious",
    "year": 5,
    "type": "mcq",
    "q": "ม้ามีไข้ อ่อนแรง น้ำหนักลด ซีด มีจุดเลือดออก เลือดกำเดาไหล เดินเซ และบวมน้ำใต้ท้อง ผลเลือดพบเกล็ดเลือดต่ำ ควรนึกถึงโรคใดเป็นอันดับแรก",
    "options": [
      "Strangles (Streptococcus equi)",
      "Glanders (Burkholderia mallei)",
      "Equine infectious anemia (EIA)",
      "Tetanus (Clostridium tetani)"
    ],
    "answer": 2,
    "explain": "อาการของ equine infectious anemia ได้แก่ ไข้ อ่อนแรง น้ำหนักลด โลหิตจาง เกล็ดเลือดต่ำ ท้องเสียมีเลือด จุดเลือดออก เลือดกำเดาไหล เดินเซ และบวมน้ำใต้ท้อง วินิจฉัยด้วย AGID ELISA หรือ PCR รักษาได้เพียงประคับประคอง ม้าอาจตายจากไวรัสเองหรือจากการติดเชื้อแทรกซ้อน\n\nทำไมข้ออื่นผิด\nStrangles: ไข้ น้ำมูก และฝีที่ต่อมน้ำเหลืองใต้คาง\nGlanders: ไข้สูง น้ำมูกข้น และแผลหลุมที่ทางเดินหายใจส่วนบน ปอด หรือผิวหนัง\nTetanus: กล้ามเนื้อแข็งเกร็งแบบ saw horse และหนังตาที่สามยื่นออกมา",
    "source": "Eq Infectious Dz and Biosecurity หน้า 23 และ 24",
    "verified": "Eq Infectious Dz and Biosecurity (2569) หน้า 23 (EIA signs: fever, weakness, weight loss, anemia, thrombocytopenia, haemorrhagic diarrhea, petechial hemorrhages, epistaxis, ataxia, ventral edema), หน้า 24 (AGID, ELISA, PCR, supportive treatment), หน้า 47 (strangles), หน้า 54 (glanders), หน้า 40 (tetanus); สไลด์ Eq inf dz 67 ของรุ่นพี่ Vet 84 หน้า 24 ไฮไลต์ Thrombocytopenia, Epistaxis, Ataxia, VENTRAL EDEMA",
    "sourceType": "student-compilation",
    "examOrigin": "Equine Med & Surg (Vet 84) marked this point on their copy of the lecture slides",
    "tags": [
      "equine-infectious",
      "equine-infectious-anemia",
      "อิงแนวข้อสอบ"
    ],
    "sourcePages": [
      {
        "doc": "equine-infectious-2569",
        "edition": "83p",
        "page": 23
      },
      {
        "doc": "equine-infectious-2569",
        "edition": "83p",
        "page": 24
      },
      {
        "doc": "equine-infectious-v84",
        "edition": "75p",
        "page": 24
      }
    ]
  },
  {
    "id": 218513,
    "subject": "equine-medicine",
    "topic": "equine-infectious",
    "year": 5,
    "type": "mcq",
    "q": "Equine encephalomyelitis (EEE, WEE และ VEE) มีแหล่งรังโรคสำคัญคือสัตว์ใด และติดต่อผ่านทางใด",
    "options": [
      "สุกร ผ่านยุง Culex",
      "ม้าลาย ผ่านริ้น Culicoides",
      "นก ผ่านยุงที่เป็นพาหะ",
      "สุนัข ผ่านการถูกกัด"
    ],
    "answer": 2,
    "explain": "Equine encephalomyelitis เกิดจากไวรัส EEE WEE และ VEE มีชื่อเรียกอื่นว่า sleeping sickness ติดต่อผ่านยุงที่เป็นพาหะ และมีนกเป็นแหล่งรังโรคสำคัญ อาการคือไข้สูง ระบบประสาทผิดปกติ ตาบอด เดินไม่ประสาน กล้ามเนื้อสั่น และอัมพาต วินิจฉัยด้วย complement fixation, PRN test, PCR หรือแยกเชื้อ\n\nทำไมข้ออื่นผิด\nสุกรกับยุง Culex: เป็นวงจรของ Japanese encephalitis ซึ่งสุกรเป็นตัวขยายเชื้อ\nม้าลายกับริ้น: เป็นวงจรของ African horse sickness\nสุนัขกับการกัด: เป็นทางติดของพิษสุนัขบ้า",
    "source": "Eq Infectious Dz and Biosecurity หน้า 30 ถึง 32",
    "verified": "Eq Infectious Dz and Biosecurity (2569) หน้า 30 (EEE, WEE, VEE, sleeping sickness, mosquito vector, important reservoir birds), หน้า 31 (signs), หน้า 32 (CF, PRN, PCR, viral isolation), หน้า 33 (JE: Culex, pigs amplifiers), หน้า 4 (rabies bite); สไลด์ Eq inf dz 67 ของรุ่นพี่ Vet 84 หน้า 31 ขีดเส้นใต้ mosquitoes that carried viruses และเขียน zoonosis, หน้า 33 ไฮไลต์ Complement fixation (CF)",
    "sourceType": "student-compilation",
    "examOrigin": "Equine Med & Surg (Vet 84) marked this point on their copy of the lecture slides",
    "tags": [
      "equine-infectious",
      "equine-encephalomyelitis",
      "อิงแนวข้อสอบ"
    ],
    "sourcePages": [
      {
        "doc": "equine-infectious-2569",
        "edition": "83p",
        "page": 30
      },
      {
        "doc": "equine-infectious-2569",
        "edition": "83p",
        "page": 32
      },
      {
        "doc": "equine-infectious-v84",
        "edition": "75p",
        "page": 31
      },
      {
        "doc": "equine-infectious-v84",
        "edition": "75p",
        "page": 33
      }
    ]
  },
  {
    "id": 218514,
    "subject": "equine-medicine",
    "topic": "equine-infectious",
    "year": 5,
    "type": "mcq",
    "q": "ข้อใดไม่ใช่ทางที่ Clostridium tetani เข้าสู่ร่างกายม้า",
    "options": [
      "แผลตะปูตำที่พื้นกีบที่สกปรก",
      "แผลหลุมในกระเพาะหรือลำไส้ หลังกินดินหรือมูลที่ปนเปื้อน",
      "สะดือของลูกม้าแรกเกิด",
      "หายใจเอาสปอร์ในฝุ่นคอกเข้าทางเดินหายใจ"
    ],
    "answer": 3,
    "explain": "Clostridium tetani เป็นแบคทีเรียไม่ใช้ออกซิเจน สปอร์อยู่ในดินได้นาน สร้าง tetanus toxin ซึ่งเป็น neurotoxin ทำให้เกิดอาการบาดทะยัก เชื้อเข้าทางแผล โดยเฉพาะแผลตะปูตำที่สกปรกและแผลที่พื้นกีบ เข้าทางลำไส้ผ่านแผลหลุมในกระเพาะหรือลำไส้หลังกินดินหรือมูลที่ปนเปื้อน และในลูกม้าเข้าทางสะดือ การหายใจเอาสปอร์เข้าไปไม่ใช่ทางติดโรคนี้\n\nทำไมข้ออื่นผิด\nแผลตะปูตำที่พื้นกีบ แผลหลุมในทางเดินอาหาร และสะดือลูกม้า: ทั้งสามเป็นทางเข้าของเชื้อ",
    "source": "Eq Infectious Dz and Biosecurity หน้า 38 และ 39",
    "verified": "Eq Infectious Dz and Biosecurity (2569) หน้า 38 (anaerobic, persistent spore in soil, tetanus toxin, potent neurotoxin), หน้า 39 (route: wounds, puncture wounds on the sole, via the intestines through gastric or intestinal ulcers, in foals via the umbilicus); สไลด์ Eq inf dz 67 ของรุ่นพี่ Vet 84 หน้า 39 ไฮไลต์ spore, soil และหน้า 40 ขีดเส้นใต้ wounds และไฮไลต์ through gastric or intestinal ulcers, In foals ... umbilicus",
    "sourceType": "student-compilation",
    "examOrigin": "Equine Med & Surg (Vet 84) marked this point on their copy of the lecture slides",
    "tags": [
      "equine-infectious",
      "tetanus",
      "อิงแนวข้อสอบ"
    ],
    "sourcePages": [
      {
        "doc": "equine-infectious-2569",
        "edition": "83p",
        "page": 38
      },
      {
        "doc": "equine-infectious-2569",
        "edition": "83p",
        "page": 39
      },
      {
        "doc": "equine-infectious-v84",
        "edition": "75p",
        "page": 39
      },
      {
        "doc": "equine-infectious-v84",
        "edition": "75p",
        "page": 40
      }
    ]
  },
  {
    "id": 218515,
    "subject": "equine-medicine",
    "topic": "equine-infectious",
    "year": 5,
    "type": "mcq",
    "q": "Strangles ติดต่อระหว่างม้าทางใดบ่อยที่สุด",
    "options": [
      "ยุงและแมลงดูดเลือดที่กัดม้าป่วยแล้วไปกัดม้าตัวอื่น",
      "สัมผัสกันโดยตรงระหว่างม้า",
      "กินหญ้าที่มีสปอร์ของเชื้อปนอยู่ในดิน",
      "ละอองในอากาศที่ลมพัดไปไกลหลายกิโลเมตร"
    ],
    "answer": 1,
    "explain": "Strangles เกิดจาก Streptococcus equi ติดต่อทางการสัมผัสกันโดยตรงระหว่างม้าบ่อยที่สุด น้ำมูกและหนองจากฝีมีเชื้อปริมาณมากและติดต่อได้ง่าย และติดผ่านอุปกรณ์ที่ปนเปื้อนได้ การป้องกันจึงเน้นเลี่ยงการสัมผัสม้าที่ไม่ทราบที่มา กักกัน และจำกัดการเคลื่อนย้ายม้าและคน\n\nทำไมข้ออื่นผิด\nแมลงดูดเลือด: เป็นทางติดของ EIA และโรคที่มีพาหะ\nสปอร์ในดิน: S. equi ไม่สร้างสปอร์ สปอร์ในดินเป็นลักษณะของ Clostridium tetani\nละอองลอยไปไกลหลายกิโลเมตร: การแพร่ข้ามระยะไกลด้วยลมเป็นลักษณะของพาหะ AHS",
    "source": "Eq Infectious Dz and Biosecurity หน้า 45, 46 และ 52",
    "verified": "Eq Infectious Dz and Biosecurity (2569) หน้า 46 (direct contact between horses is the most common way, discharge from the nose or abscesses highly infective, contaminated equipment), หน้า 45 (Streptococcus equi), หน้า 52 (avoid contact with horses of unknown origin, quarantine, restrict movement), หน้า 38 (tetanus spores), หน้า 9 (AHS wind-borne vectors); สไลด์ Eq inf dz 67 ของรุ่นพี่ Vet 84 หน้า 47 ไฮไลต์ Direct contact between horses is the most common way",
    "sourceType": "student-compilation",
    "examOrigin": "Equine Med & Surg (Vet 84) marked this point on their copy of the lecture slides",
    "tags": [
      "equine-infectious",
      "strangles",
      "อิงแนวข้อสอบ"
    ],
    "sourcePages": [
      {
        "doc": "equine-infectious-2569",
        "edition": "83p",
        "page": 46
      },
      {
        "doc": "equine-infectious-2569",
        "edition": "83p",
        "page": 52
      },
      {
        "doc": "equine-infectious-v84",
        "edition": "75p",
        "page": 47
      }
    ]
  },
  {
    "id": 218516,
    "subject": "equine-medicine",
    "topic": "equine-infectious",
    "year": 5,
    "type": "mcq",
    "q": "การใช้ procaine penicillin G รักษา strangles ข้อใดถูกต้อง",
    "options": [
      "ควรให้หลังฝีแตกแล้วเท่านั้น เพื่อไม่ให้หนองกระจายไปที่อื่น",
      "ห้ามใช้ทุกระยะ เพราะ Streptococcus equi ดื้อ penicillin ตามธรรมชาติ",
      "ให้ระยะสั้นเพียง 3 วันก็พอ แม้ในม้าที่เป็น bastard strangles",
      "ได้ผลดีถ้าให้ก่อนเกิดฝี ถ้าให้หลังเกิดฝีแล้วจะทำให้หายช้าลง"
    ],
    "answer": 3,
    "explain": "Procaine penicillin G เป็นยาที่เลือกใช้รักษา strangles ถ้าให้ก่อนเกิดฝีที่ต่อมน้ำเหลือง ถ้าให้หลังฝีเกิดแล้วจะทำให้หายช้าลง ร่วมกับการดูแลประคับประคอง ได้แก่ ให้ม้าอบอุ่นและแห้ง แยกจากม้าตัวอื่น ให้อาหารอ่อน และประคบร้อนที่ฝี\n\nทำไมข้ออื่นผิด\nให้หลังฝีแตกเท่านั้น: การให้ยาหลังเกิดฝีทำให้หายช้าลง\nห้ามใช้เพราะดื้อยา: penicillin เป็นยาที่เลือกใช้\nให้ 3 วันใน bastard strangles: ภาวะนี้ต้องให้ยาปฏิชีวนะนาน 4 ถึง 6 สัปดาห์",
    "source": "Eq Infectious Dz and Biosecurity หน้า 51",
    "verified": "Eq Infectious Dz and Biosecurity (2569) หน้า 51 (supportive care, procaine penicillin G is the drug of choice if used before abscess development, penicillin used after abscess formation slows recovery, bastard strangles 4-6 weeks); สไลด์ Eq inf dz 67 ของรุ่นพี่ Vet 84 หน้า 52 ไฮไลต์ Procaine penicillin G is the drug of choice",
    "sourceType": "student-compilation",
    "examOrigin": "Equine Med & Surg (Vet 84) marked this point on their copy of the lecture slides",
    "tags": [
      "equine-infectious",
      "strangles",
      "อิงแนวข้อสอบ"
    ],
    "sourcePages": [
      {
        "doc": "equine-infectious-2569",
        "edition": "83p",
        "page": 51
      },
      {
        "doc": "equine-infectious-v84",
        "edition": "75p",
        "page": 52
      }
    ]
  },
  {
    "id": 218517,
    "subject": "equine-medicine",
    "topic": "equine-infectious",
    "year": 5,
    "type": "mcq",
    "q": "Bastard strangles คือภาวะใด และต้องให้ยาปฏิชีวนะนานเท่าใด",
    "options": [
      "ฝีกระจายทั่วร่างกาย เช่น ปอด ตับ ม้าม ไต และสมอง ให้ยานาน 4 ถึง 6 สัปดาห์",
      "ต่อมน้ำเหลืองใต้คางและหลังคอหอยบวมจนกดทางเดินหายใจ ให้ยานาน 3 ถึง 5 วัน",
      "ม้าที่หายแล้วยังปล่อยเชื้อจาก guttural pouch ทางน้ำมูก ให้ยานาน 7 ถึง 10 วัน",
      "ม้าติดเชื้อซ้ำหลังฉีดวัคซีน มีไข้และน้ำมูกเป็นหนองอีกรอบ ให้ยาต่อเนื่องนาน 6 เดือน"
    ],
    "answer": 0,
    "explain": "Bastard strangles เป็นภาวะแทรกซ้อนที่พบได้ถึงราวร้อยละ 20 ของม้าที่เป็น strangles เกิดฝีกระจายไปทั่วร่างกาย ตำแหน่งที่พบบ่อยคือปอด ตับ ม้าม ไต และสมอง ต้องให้ยาปฏิชีวนะนาน 4 ถึง 6 สัปดาห์ และอาจต้องให้ยาต้านการอักเสบหรือสารน้ำทางหลอดเลือดร่วมด้วย\n\nทำไมข้ออื่นผิด\nต่อมน้ำเหลืองใต้คางบวมกดทางเดินหายใจ: เป็นที่มาของชื่อ strangles ในม้าทั่วไป\nม้าที่หายแล้วยังปล่อยเชื้อ: ไม่ใช่ความหมายของ bastard strangles\nติดเชื้อซ้ำหลังฉีดวัคซีน: ไม่ใช่ความหมายของ bastard strangles และระยะเวลาให้ยาไม่ถูก",
    "source": "Eq Infectious Dz and Biosecurity หน้า 45, 49 และ 51",
    "verified": "Eq Infectious Dz and Biosecurity (2569) หน้า 49 (bastard strangles in up to 20 percent of cases, abscesses throughout the body, most commonly lungs, liver, spleen, kidney and brain), หน้า 51 (antibiotic therapy for four to six weeks, anti-inflammatory medications or intravenous fluids), หน้า 45 (name from swelling of lymph nodes); สไลด์ Eq inf dz 67 ของรุ่นพี่ Vet 84 หน้า 50 ขีดเส้นใต้ bastard strangles",
    "sourceType": "student-compilation",
    "examOrigin": "Equine Med & Surg (Vet 84) marked this point on their copy of the lecture slides",
    "tags": [
      "equine-infectious",
      "strangles",
      "bastard-strangles",
      "อิงแนวข้อสอบ"
    ],
    "sourcePages": [
      {
        "doc": "equine-infectious-2569",
        "edition": "83p",
        "page": 49
      },
      {
        "doc": "equine-infectious-2569",
        "edition": "83p",
        "page": 51
      },
      {
        "doc": "equine-infectious-v84",
        "edition": "75p",
        "page": 50
      }
    ]
  },
  {
    "id": 218518,
    "subject": "equine-medicine",
    "topic": "equine-infectious",
    "year": 5,
    "type": "mcq",
    "q": "ข้อใดถูกต้องเกี่ยวกับ glanders ในม้า",
    "options": [
      "เกิดจาก Burkholderia mallei แบ่งเป็น nasal, pulmonary และ cutaneous form และไม่มีวัคซีน",
      "เกิดจาก Taylorella equigenitalis ติดต่อทางการผสมพันธุ์ และทำให้แม่ม้ามดลูกอักเสบ",
      "เกิดจาก Streptococcus equi ทำให้ต่อมน้ำเหลืองใต้คางเป็นฝี และรักษาด้วย penicillin",
      "เกิดจาก Pythium insidiosum ทำให้แผลเป็นก้อนเนื้อที่ขา และรักษาด้วย PIA"
    ],
    "answer": 0,
    "explain": "Glanders เกิดจาก Burkholderia mallei ติดต่อทางอาหารหรือน้ำที่ปนเปื้อนน้ำมูกของม้าที่เป็นพาหะ แบ่งเป็น nasal, pulmonary และ cutaneous form อาการคือไข้สูง น้ำมูกข้น และแผลหลุมที่ทางเดินหายใจส่วนบน ปอด หรือผิวหนัง อัตราตายสูงและไม่มีวัคซีน การป้องกันคือตรวจหาและกำจัดม้าป่วย กักกัน ฆ่าเชื้อพื้นที่ และมักแนะนำให้ทำ euthanasia ม้าป่วย\n\nทำไมข้ออื่นผิด\nTaylorella equigenitalis: ก่อ contagious equine metritis\nStreptococcus equi: ก่อ strangles\nPythium insidiosum: ก่อ pythiosis",
    "source": "Eq Infectious Dz and Biosecurity หน้า 53 ถึง 55",
    "verified": "Eq Infectious Dz and Biosecurity (2569) หน้า 53 (Burkholderia mallei, food or water contaminated by nasal discharge of carriers, nasal, pulmonary, cutaneous form), หน้า 54 (signs), หน้า 55 (mortality high, no vaccine available, detection and elimination, quarantine, euthanasia usually recommended), หน้า 56, 45, 67 (CEM, strangles, pythiosis); สไลด์ Eq inf dz 67 ของรุ่นพี่ Vet 84 หน้า 54 ปากกาแดง zoonosis และหน้า 56 ขีดเส้นใต้ No vaccine available",
    "sourceType": "student-compilation",
    "examOrigin": "Equine Med & Surg (Vet 84) marked this point on their copy of the lecture slides",
    "tags": [
      "equine-infectious",
      "glanders",
      "อิงแนวข้อสอบ"
    ],
    "sourcePages": [
      {
        "doc": "equine-infectious-2569",
        "edition": "83p",
        "page": 53
      },
      {
        "doc": "equine-infectious-2569",
        "edition": "83p",
        "page": 55
      },
      {
        "doc": "equine-infectious-v84",
        "edition": "75p",
        "page": 54
      },
      {
        "doc": "equine-infectious-v84",
        "edition": "75p",
        "page": 56
      }
    ]
  },
  {
    "id": 218519,
    "subject": "equine-medicine",
    "topic": "equine-infectious",
    "year": 5,
    "type": "mcq",
    "q": "แม่ม้ามีมดลูกอักเสบ (endometritis) และมีหนองไหลจากช่องคลอดหลังผสมพันธุ์ ตรวจสิ่งคัดหลั่งจากมดลูกพบแบคทีเรียแกรมลบรูปแท่งสั้น (coccobacilli) ควรนึกถึงเชื้อใด",
    "options": [
      "Streptococcus equi",
      "Burkholderia mallei",
      "Clostridium tetani",
      "Taylorella equigenitalis"
    ],
    "answer": 3,
    "explain": "Contagious equine metritis (CEM) เกิดจาก Taylorella equigenitalis ติดต่อทางการผสมพันธุ์ การผสมเทียม และการปนเปื้อนจากมือ แม่ม้าเกิด endometritis, cervicitis, vaginitis และมีหนองไหล วินิจฉัยด้วยการเพาะเชื้อ PCR และย้อมสิ่งคัดหลั่งจากมดลูกพบแบคทีเรียแกรมลบรูปแท่งสั้น ไม่มีวัคซีน แต่เชื้อไวต่อยาฆ่าเชื้อทั่วไป เช่น chlorhexidine และ sodium hypochlorite\n\nทำไมข้ออื่นผิด\nStreptococcus equi: แกรมบวก ก่อ strangles\nBurkholderia mallei: ก่อ glanders ติดทางอาหารและน้ำที่ปนเปื้อนน้ำมูก\nClostridium tetani: แกรมบวกสร้างสปอร์ ก่อบาดทะยัก",
    "source": "Eq Infectious Dz and Biosecurity หน้า 56 ถึง 58",
    "verified": "Eq Infectious Dz and Biosecurity (2569) หน้า 56 (Taylorella equigenitalis, mating, AI, manual contamination), หน้า 57 (mares can develop endometritis, cervicitis, vaginitis, mucopurulent discharge), หน้า 58 (culture, PCR, gram-negative coccobacilli, no vaccine, chlorhexidine, sodium hypochlorite); สไลด์ Eq inf dz 67 ของรุ่นพี่ Vet 84 หน้า 58 ไฮไลต์ develop endometritis และหน้า 59 ไฮไลต์ CEM, Culture / PCR",
    "sourceType": "student-compilation",
    "examOrigin": "Equine Med & Surg (Vet 84) marked this point on their copy of the lecture slides",
    "tags": [
      "equine-infectious",
      "contagious-equine-metritis",
      "อิงแนวข้อสอบ"
    ],
    "sourcePages": [
      {
        "doc": "equine-infectious-2569",
        "edition": "83p",
        "page": 57
      },
      {
        "doc": "equine-infectious-2569",
        "edition": "83p",
        "page": 58
      },
      {
        "doc": "equine-infectious-v84",
        "edition": "75p",
        "page": 58
      },
      {
        "doc": "equine-infectious-v84",
        "edition": "75p",
        "page": 59
      }
    ]
  },
  {
    "id": 218520,
    "subject": "equine-medicine",
    "topic": "equine-pythium",
    "year": 5,
    "type": "mcq",
    "q": "ก้อนแข็งสีเทาที่เป็นเนื้อตาย (firm, necrotic gray material) ซึ่งพบอยู่ในแผล pythiosis ของม้า เรียกว่าอะไร",
    "options": [
      "Sequestrum",
      "Kunkers",
      "Proud flesh",
      "Sitfast"
    ],
    "answer": 1,
    "explain": "รอยโรคของ equine pythiosis เป็นแผลหลุมและก้อนเนื้อแบบ granuloma ที่ผิวหนังและใต้ผิวหนัง พบบ่อยที่ขา อก และท้อง ภายในแผลมีก้อนแข็งสีเทาที่เป็นเนื้อตาย เรียกว่า kunkers\n\nทำไมข้ออื่นผิด\nSequestrum: ชิ้นกระดูกตายที่แยกตัวออกจากกระดูกปกติ\nProud flesh: ชื่อเรียกของ exuberant granulation tissue ที่งอกเกินระดับผิวแผล\nSitfast: แผลกดทับเรื้อรังใต้อานหรืออุปกรณ์",
    "source": "Eq Infectious Dz and Biosecurity หน้า 68",
    "verified": "Eq Infectious Dz and Biosecurity (2569) หน้า 68 (ulceration, granulomatous lesions at cutaneous and subcutaneous tissues, limbs, chest and abdomen, firm and necrotic gray material referred as kunkers); Equine dermatology and wound management (2569) หัวข้อ exuberant granulation tissue; สไลด์ Eq inf dz 67 ของรุ่นพี่ Vet 84 หน้า 69 ไฮไลต์ Granulomatous และ kunkers",
    "sourceType": "student-compilation",
    "examOrigin": "Equine Med & Surg (Vet 84) marked this point on their copy of the lecture slides",
    "tags": [
      "equine-pythium",
      "kunkers",
      "อิงแนวข้อสอบ"
    ],
    "sourcePages": [
      {
        "doc": "equine-infectious-2569",
        "edition": "83p",
        "page": 68
      },
      {
        "doc": "equine-infectious-v84",
        "edition": "75p",
        "page": 69
      }
    ]
  },
  {
    "id": 218521,
    "subject": "equine-medicine",
    "topic": "equine-ophth",
    "year": 5,
    "type": "mcq",
    "q": "ความคมชัดของการมองเห็น (visual acuity) ของม้าเทียบกับคน สุนัข และแมวเป็นอย่างไร",
    "options": [
      "ราว 1.5 เท่าของคน 0.6 เท่าของสุนัข และ 3 เท่าของแมว",
      "ราว 3 เท่าของคน 1.5 เท่าของสุนัข และ 0.6 เท่าของแมว",
      "ราว 0.6 เท่าของคน 1.5 เท่าของสุนัข และ 3 เท่าของแมว",
      "ราว 0.6 เท่าของคน 0.3 เท่าของสุนัข และ 1.5 เท่าของแมว"
    ],
    "answer": 2,
    "explain": "Visual acuity ของม้าราว 0.6 เท่าของคน 1.5 เท่าของสุนัข และ 3 เท่าของแมว คือดีกว่าสุนัขและแมวแต่ด้อยกว่าคน เบ้าตาที่อยู่ด้านข้างทำให้มีลานสายตากว้างราว 350 องศา แต่การมองสองตา (65 ถึง 70 องศา) และการกะระยะลดลง เลนส์ปรับโฟกัสได้น้อย จึงมองระยะใกล้ได้จำกัด\n\nทำไมข้ออื่นผิด\nตัวเลขในตัวเลือกอื่นสลับตำแหน่งกัน ม้ามองชัดน้อยกว่าคน แต่ชัดกว่าสุนัขและแมว",
    "source": "Equine Ophthalmology หน้า 6",
    "verified": "Equine Ophthalmology (2569) หน้า 6 (panoramic visual field 350 degree, binocular vision 65-70 degree, visual acuity 0.6x of humans, 1.5x of dogs, 3x of cats, weak accommodative ability of lens); สไลด์ Equine Ophthalmology 67 ของรุ่นพี่ Vet 84 หน้า 7 ขีดเส้นใต้ 350 degree และ Visual acuity พร้อมโน้ตว่าดีกว่าสุนัขแมวแต่น้อยกว่าคน",
    "sourceType": "student-compilation",
    "examOrigin": "Equine Med & Surg (Vet 84) marked this point on their copy of the lecture slides",
    "tags": [
      "equine-ophth",
      "equine-vision",
      "อิงแนวข้อสอบ"
    ],
    "sourcePages": [
      {
        "doc": "equine-ophthalmology-2569",
        "edition": "58p",
        "page": 6
      },
      {
        "doc": "equine-ophthalmology-v84",
        "edition": "57p",
        "page": 7
      }
    ]
  },
  {
    "id": 218522,
    "subject": "equine-medicine",
    "topic": "equine-ophth",
    "year": 5,
    "type": "mcq",
    "q": "ขนตาของม้ามีลักษณะอย่างไร",
    "options": [
      "มีทั้งหนังตาบนและล่าง และเรียงขนานกับกระจกตา",
      "มีเฉพาะหนังตาบน และเรียงตั้งฉากกับกระจกตา",
      "มีเฉพาะหนังตาล่าง และชี้ลงด้านล่าง",
      "มีเฉพาะที่หนังตาที่สาม และชี้เข้าหาหัวตา"
    ],
    "answer": 1,
    "explain": "หนังตาม้าบางและมีหลอดเลือดมาก จึงบวมได้ง่าย ม้ามีขนตาเฉพาะที่หนังตาบน และเรียงตั้งฉากกับกระจกตา หนังตาที่เริ่มบวมเป็นสัญญาณให้ตรวจหารอยโรคที่กระจกตา และ neutrophil จากหนังตาที่อักเสบเข้าสู่น้ำตา กระตุ้นให้เกิด cytokine และโรคกระจกตาอักเสบได้\n\nทำไมข้ออื่นผิด\nมีทั้งบนและล่าง: ม้ามีขนตาเฉพาะหนังตาบน\nเฉพาะหนังตาล่าง: ผิดตำแหน่ง\nเฉพาะหนังตาที่สาม: หนังตาที่สามไม่มีขนตา",
    "source": "Equine Ophthalmology หน้า 8",
    "verified": "Equine Ophthalmology (2569) หน้า 8 (eyelid thin and highly vascularized, only upper eyelashes, perpendicular to the cornea, early sign of eyelid swelling, monitor for corneal lesion, neutrophils into tears); สไลด์ Equine Ophthalmology 67 ของรุ่นพี่ Vet 84 หน้า 8 ขีดเส้นใต้ Eyelashes และ upper พร้อมดาวสองดวง",
    "sourceType": "student-compilation",
    "examOrigin": "Equine Med & Surg (Vet 84) marked this point on their copy of the lecture slides",
    "tags": [
      "equine-ophth",
      "eyelid",
      "อิงแนวข้อสอบ"
    ],
    "sourcePages": [
      {
        "doc": "equine-ophthalmology-2569",
        "edition": "58p",
        "page": 8
      },
      {
        "doc": "equine-ophthalmology-v84",
        "edition": "57p",
        "page": 8
      }
    ]
  },
  {
    "id": 218523,
    "subject": "equine-medicine",
    "topic": "equine-ophth",
    "year": 5,
    "type": "mcq",
    "q": "ตรวจตาม้าพบสีเข้ม (pigment) ที่เยื่อบุตาบริเวณใกล้ขอบกระจกตา (limbus) ควรแปลผลอย่างไร",
    "options": [
      "เป็นระยะเริ่มต้นของ melanoma ควรตัดชิ้นเนื้อออกทันที",
      "บ่งชี้ว่าเคยเป็น equine recurrent uveitis มาก่อน",
      "พบได้บ่อยในม้า ไม่ได้บ่งชี้ความผิดปกติ",
      "เป็นรอยโรคแรกเริ่มของ squamous cell carcinoma"
    ],
    "answer": 2,
    "explain": "เยื่อบุตาเป็นส่วนหนึ่งของระบบภูมิคุ้มกันของตาและมีเซลล์สร้างน้ำตา การมีสีเข้มที่เยื่อบุตาใกล้ limbus พบได้บ่อยในม้า ส่วนอาการตาแดงพบได้ในโรคตาเกือบทุกชนิด\n\nทำไมข้ออื่นผิด\nMelanoma และ SCC: สีเข้มบริเวณนี้พบได้บ่อยตามปกติ ไม่ได้บ่งชี้เนื้องอก ส่วน SCC มักพบในบริเวณที่ไม่มีเม็ดสี\nERU: วินิจฉัยจากอาการอักเสบภายในลูกตาซ้ำๆ ไม่ใช่จากสีของเยื่อบุตา",
    "source": "Equine Ophthalmology หน้า 11 และ 28",
    "verified": "Equine Ophthalmology (2569) หน้า 11 (conjunctiva: component of ocular immune system and tear producing cells, pigmented conjunctiva near limbus: common, red eye in nearly all eye diseases), หน้า 28 (SCC related to peri-ocular pigmentation), หน้า 36 (uveitis); สไลด์ Equine Ophthalmology 67 ของรุ่นพี่ Vet 84 หน้า 11 ขีดเส้นใต้ Pigmented conjunctiva พร้อมโน้ตว่าปกติ",
    "sourceType": "student-compilation",
    "examOrigin": "Equine Med & Surg (Vet 84) marked this point on their copy of the lecture slides",
    "tags": [
      "equine-ophth",
      "conjunctiva",
      "อิงแนวข้อสอบ"
    ],
    "sourcePages": [
      {
        "doc": "equine-ophthalmology-2569",
        "edition": "58p",
        "page": 11
      },
      {
        "doc": "equine-ophthalmology-v84",
        "edition": "57p",
        "page": 11
      }
    ]
  },
  {
    "id": 218524,
    "subject": "equine-medicine",
    "topic": "equine-ophth",
    "year": 5,
    "type": "mcq",
    "q": "แผลที่ผิวกระจกตาม้าที่เรื้อรัง (persistent superficial corneal ulcer) ส่งผลต่อกระจกตาอย่างไร",
    "options": [
      "กระจกตาไวต่อความรู้สึกมากขึ้น แผลจึงหายเร็วขึ้น",
      "เส้นประสาท facial งอกเข้าไปเลี้ยงชั้นผิวมากขึ้น",
      "กระจกตาส่วนกลางหนาขึ้นจนถึงราว 3 มิลลิเมตร",
      "ความรู้สึกของกระจกตาลดลง แผลจึงหายช้า"
    ],
    "answer": 3,
    "explain": "กระจกตาม้าได้รับเส้นประสาทจากแขนงของ trigeminal nerve ซึ่งหนาแน่นที่ชั้นผิว จึงไวต่อความรู้สึกมาก แผลที่ผิวกระจกตาที่เรื้อรังทำให้ความรู้สึกของกระจกตาลดลง และแผลหายช้า กระจกตาส่วนกลางหนา 1.0 ถึง 1.5 มิลลิเมตร ส่วนขอบหนาราว 0.8 มิลลิเมตร และตาที่ยื่นเด่นของม้าทำให้บาดเจ็บที่กระจกตาได้ง่าย\n\nทำไมข้ออื่นผิด\nไวต่อความรู้สึกมากขึ้น: แผลเรื้อรังทำให้ความรู้สึกลดลง\nเส้นประสาท facial: กระจกตาได้รับเส้นประสาทจาก trigeminal nerve\nหนาขึ้นถึง 3 มิลลิเมตร: ความหนาปกติส่วนกลางคือ 1.0 ถึง 1.5 มิลลิเมตร",
    "source": "Equine Ophthalmology หน้า 16",
    "verified": "Equine Ophthalmology (2569) หน้า 16 (thickness center 1.0-1.5 mm, periphery 0.8 mm, branch of trigeminal nerve concentrated on superficial layer, very sensitive, persistent superficial ulcer, decreased corneal sensation, slow healing, prominent eye prone to trauma); สไลด์ Equine Ophthalmology 67 ของรุ่นพี่ Vet 84 หน้า 15 ขีดเส้นใต้ Branch of trigeminal nerve และ very sensitive organ",
    "sourceType": "student-compilation",
    "examOrigin": "Equine Med & Surg (Vet 84) marked this point on their copy of the lecture slides",
    "tags": [
      "equine-ophth",
      "cornea",
      "อิงแนวข้อสอบ"
    ],
    "sourcePages": [
      {
        "doc": "equine-ophthalmology-2569",
        "edition": "58p",
        "page": 16
      },
      {
        "doc": "equine-ophthalmology-v84",
        "edition": "57p",
        "page": 15
      }
    ]
  },
  {
    "id": 218525,
    "subject": "equine-medicine",
    "topic": "equine-ophth",
    "year": 5,
    "type": "mcq",
    "q": "ประวัติใดชวนให้นึกถึง ulcerative keratomycosis ในม้ามากที่สุด",
    "options": [
      "กระจกตาเคยบาดเจ็บจากเศษพืช และรักษามานานแต่ไม่ดีขึ้น",
      "ตาอักเสบภายในลูกตาซ้ำหลายรอบในม้าพันธุ์ Appaloosa",
      "มีก้อนที่หนังตาที่สามในม้าขนสีขาวที่ตากแดดเป็นประจำ",
      "ตามัวลงช้าๆ ในม้าอายุมากที่วัดความดันลูกตาได้สูง"
    ],
    "answer": 0,
    "explain": "Ulcerative keratomycosis เกิดจากเชื้อราที่อยู่ตามธรรมชาติในสิ่งแวดล้อม ประวัติที่พบบ่อยคือกระจกตาเคยบาดเจ็บจากเศษพืช และรักษามานานแต่ไม่ดีขึ้น เมื่อเชื้อเข้าทางแผล เชื้อรา เม็ดเลือดขาว และ keratocyte ปล่อย proteinase และเชื้อรามีแนวโน้มลงไปถึงชั้น Descemet's membrane ยาต้านเชื้อราที่ใช้ เช่น natamycin, miconazole, itraconazole\n\nทำไมข้ออื่นผิด\nอักเสบซ้ำในม้า Appaloosa: เข้ากับ equine recurrent uveitis\nก้อนที่หนังตาที่สามในม้าสีขาว: เข้ากับ squamous cell carcinoma\nตามัวในม้าแก่ที่ความดันตาสูง: เข้ากับ glaucoma",
    "source": "Equine Ophthalmology หน้า 20",
    "verified": "Equine Ophthalmology (2569) หน้า 20 (fungus normal inhabitants of environment, history of corneal injury with vegetative materials, prolonged therapy with no improvement, proteinase, antifungals, affinity of fungi for Descemet's membrane), หน้า 28, 36, 48; สไลด์ Equine Ophthalmology 67 ของรุ่นพี่ Vet 84 หน้า 18 ขีดเส้นใต้ ULCERATIVE KERATOMYCOSIS และวง Fungus พร้อมโน้ตว่ามาจากหญ้าฟาง",
    "sourceType": "student-compilation",
    "examOrigin": "Equine Med & Surg (Vet 84) marked this point on their copy of the lecture slides",
    "tags": [
      "equine-ophth",
      "keratomycosis",
      "อิงแนวข้อสอบ"
    ],
    "sourcePages": [
      {
        "doc": "equine-ophthalmology-2569",
        "edition": "58p",
        "page": 20
      },
      {
        "doc": "equine-ophthalmology-v84",
        "edition": "57p",
        "page": 18
      }
    ]
  },
  {
    "id": 218526,
    "subject": "equine-medicine",
    "topic": "equine-ophth",
    "year": 5,
    "type": "mcq",
    "q": "ปัจจัยเสี่ยงของ squamous cell carcinoma ที่ตาและอวัยวะรอบตาของม้าคือข้อใด",
    "options": [
      "การติด bovine papillomavirus ในม้าอายุน้อยกว่า 3 ปี",
      "แสงยูวี ผิวรอบตาที่ไม่มีเม็ดสี และม้าขนสีขาวหรือเทาขาว",
      "ความดันลูกตาสูงจาก pectinate ligament ที่เสื่อม",
      "การบาดเจ็บของกระจกตาจากเศษพืชและหญ้าฟาง"
    ],
    "answer": 1,
    "explain": "Squamous cell carcinoma เป็นเนื้องอกที่พบบ่อยที่สุดของอวัยวะรอบตาม้า สัมพันธ์กับการได้รับแสงยูวี สีของผิวรอบตา และความไวต่อสารก่อมะเร็ง พบมากในม้าขนสีขาวหรือเทาขาว การรักษาร่วมได้แก่ ผ่าตัด cryotherapy hyperthermia immunotherapy chemotherapy และการฉายรังสี\n\nทำไมข้ออื่นผิด\nBovine papillomavirus: เกี่ยวกับ sarcoid และ papilloma\nความดันลูกตาสูงจาก pectinate ligament เสื่อม: เป็นกลไกของ glaucoma\nบาดเจ็บจากเศษพืช: เป็นประวัติของ keratomycosis",
    "source": "Equine Ophthalmology หน้า 28 และ 29",
    "verified": "Equine Ophthalmology (2569) หน้า 28 (SCC most common tumor of equine adnexa, related to UV exposure, peri-ocular pigmentation, susceptibility to carcinogen, high prevalence in white, grey-white horses), หน้า 29 (treatments), หน้า 49 (pectinate ligament), หน้า 20 (keratomycosis); สไลด์ Equine Ophthalmology 67 ของรุ่นพี่ Vet 84 หน้า 27 ขีดเส้นใต้ most common tumor, Related to UV exposure และ white",
    "sourceType": "student-compilation",
    "examOrigin": "Equine Med & Surg (Vet 84) marked this point on their copy of the lecture slides",
    "tags": [
      "equine-ophth",
      "squamous-cell-carcinoma",
      "อิงแนวข้อสอบ"
    ],
    "sourcePages": [
      {
        "doc": "equine-ophthalmology-2569",
        "edition": "58p",
        "page": 28
      },
      {
        "doc": "equine-ophthalmology-v84",
        "edition": "57p",
        "page": 27
      }
    ]
  },
  {
    "id": 218527,
    "subject": "equine-medicine",
    "topic": "equine-ophth",
    "year": 5,
    "type": "mcq",
    "q": "ม้าที่เป็น equine recurrent uveitis ในระยะที่มี cyclitis มักวัดความดันลูกตา (IOP) ได้อย่างไร",
    "options": [
      "สูงขึ้นตลอดเวลาจนเกิด glaucoma ทันที",
      "ปกติเสมอไม่ว่าจะอยู่ระยะใดของโรค",
      "ต่ำลงเป็นพักๆ",
      "สูงขึ้นเฉพาะตอนกลางคืนเมื่อรูม่านตาขยาย"
    ],
    "answer": 2,
    "explain": "Uveitis ในม้าแบ่งเป็น 3 กลุ่มอาการ คือ classic, insidious และ posterior ความดันลูกตาอาจต่ำลงเป็นพักๆ เมื่อมี cyclitis พบ aqueous flare เมื่อมี iridocyclitis อาจเกิดต้อกระจกแทรกซ้อน choroiditis ทำให้จอประสาทตาหลุดลอกแบบมีของเหลว และอาจจบที่ตาบอดถาวร ERU ยังเป็นปัจจัยเสี่ยงของ glaucoma ในระยะต่อมา\n\nทำไมข้ออื่นผิด\nสูงขึ้นตลอดจน glaucoma ทันที: ระยะอักเสบมักมีความดันต่ำ ส่วน glaucoma เป็นผลระยะยาว\nปกติเสมอ: ความดันเปลี่ยนตามการอักเสบ\nสูงเฉพาะกลางคืน: ไม่ใช่ลักษณะของ ERU",
    "source": "Equine Ophthalmology หน้า 36 และ 48",
    "verified": "Equine Ophthalmology (2569) หน้า 36 (3 syndromes classic, insidious, posterior, IOP may be intermittently low if cyclitis, aqueous flare, secondary cataract, choroiditis, irreversible blindness), หน้า 48 (risk for glaucoma: ERU); สไลด์ Equine Ophthalmology 67 ของรุ่นพี่ Vet 84 หน้า 31 ขีดเส้นใต้ IOP และ low พร้อมเครื่องหมายสามขีด",
    "sourceType": "student-compilation",
    "examOrigin": "Equine Med & Surg (Vet 84) marked this point on their copy of the lecture slides",
    "tags": [
      "equine-ophth",
      "equine-recurrent-uveitis",
      "อิงแนวข้อสอบ"
    ],
    "sourcePages": [
      {
        "doc": "equine-ophthalmology-2569",
        "edition": "58p",
        "page": 36
      },
      {
        "doc": "equine-ophthalmology-v84",
        "edition": "57p",
        "page": 31
      }
    ]
  },
  {
    "id": 218528,
    "subject": "equine-medicine",
    "topic": "equine-ophth",
    "year": 5,
    "type": "mcq",
    "q": "ม้ากลุ่มใดเสี่ยงต่อต้อหิน (glaucoma) และใช้วิธีใดวินิจฉัย",
    "options": [
      "ลูกม้าอายุน้อยกว่า 6 เดือน ม้าที่ตาโปน และม้าพันธุ์ Arabian วินิจฉัยด้วย fluorescein staining",
      "ม้าขนสีขาว ม้าที่ตากแดดนาน และม้าพันธุ์ Paint วินิจฉัยด้วย corneal scraping",
      "ม้าที่เคยเป็น ERU ม้าอายุมาก และม้าพันธุ์ Appaloosa วินิจฉัยด้วย tonometry",
      "ม้าที่กินหญ้าแห้งขึ้นรา ม้าในคอกอับชื้น วินิจฉัยด้วยการเพาะเชื้อจากน้ำตา"
    ],
    "answer": 2,
    "explain": "Glaucoma ในม้าเกิดจากการไหลเวียนของ aqueous humor ผิดปกติ ทำให้ความดันลูกตาสูงจนตาบอด กลุ่มเสี่ยงคือม้าที่เคยเป็น ERU ม้าอายุมาก และม้าพันธุ์ Appaloosa วินิจฉัยด้วยการวัดความดันลูกตา (tonometry) และการส่องตรวจ ophthalmoscopy การเสื่อมของ pectinate ligament ที่มุมระบายน้ำทำให้การระบายลดลง\n\nทำไมข้ออื่นผิด\nFluorescein staining: ใช้หาแผลที่กระจกตา\nม้าขนสีขาวตากแดด: เป็นปัจจัยเสี่ยงของ squamous cell carcinoma\nหญ้าแห้งขึ้นรา: เกี่ยวกับเชื้อราที่กระจกตา ไม่ใช่ glaucoma",
    "source": "Equine Ophthalmology หน้า 48 และ 49",
    "verified": "Equine Ophthalmology (2569) หน้า 48 (glaucoma: alteration of aqueous humor dynamics, increased IOP, blindness, risk: ERU, aged horse, Appaloosa, diagnosis: tonometry, ophthalmoscopy), หน้า 49 (degeneration of pectinate ligament), หน้า 17 (fluorescein), หน้า 28 (SCC); สไลด์ Equine Ophthalmology 67 ของรุ่นพี่ Vet 84 หน้า 35 ขีดเส้นใต้ Tonometry และหน้า 36 ขีดเส้นใต้ Degeneration of pectinate ligament",
    "sourceType": "student-compilation",
    "examOrigin": "Equine Med & Surg (Vet 84) marked this point on their copy of the lecture slides",
    "tags": [
      "equine-ophth",
      "glaucoma",
      "อิงแนวข้อสอบ"
    ],
    "sourcePages": [
      {
        "doc": "equine-ophthalmology-2569",
        "edition": "58p",
        "page": 48
      },
      {
        "doc": "equine-ophthalmology-2569",
        "edition": "58p",
        "page": 49
      },
      {
        "doc": "equine-ophthalmology-v84",
        "edition": "57p",
        "page": 35
      },
      {
        "doc": "equine-ophthalmology-v84",
        "edition": "57p",
        "page": 36
      }
    ]
  },
  {
    "id": 218529,
    "subject": "equine-medicine",
    "topic": "equine-lameness",
    "year": 5,
    "type": "mcq",
    "q": "ม้ายืนนิ่งแทบไม่เห็นอาการเจ็บขา (+/-) เดินเห็นอาการชัด (+/++) และวิ่งเหยาะ (trot) เห็นชัดมาก (+++) ควรให้คะแนนความเจ็บขา (grade of lameness) ระดับใด",
    "options": [
      "Grade 2",
      "Grade 3",
      "Grade 4",
      "Grade 5"
    ],
    "answer": 2,
    "explain": "การให้คะแนนความเจ็บขาดูจากท่ายืน ท่าเดิน และท่าวิ่งเหยาะ Grade 4 คือยืนแทบไม่เห็น (+/-) เดินเห็นชัด (+/++) และวิ่งเหยาะเห็นชัดมาก (+++)\n\nทำไมข้ออื่นผิด\nGrade 2: ยืนและเดินไม่เห็นอาการ เห็นเฉพาะตอนวิ่งเหยาะ (+)\nGrade 3: ยืนไม่เห็น เดินแทบไม่เห็น (+/-) และวิ่งเหยาะเห็น (++)\nGrade 5: เห็นตั้งแต่ยืน (+) เดิน (+++) และวิ่งเหยาะ (++++)",
    "source": "Equine lameness: an introduction (2026) หน้า 25",
    "verified": "Equine lameness: an introduction (2026) หน้า 25 (grade of lameness table: grade 5 stand และ , walk และ  และ  และ , trot และ  และ  และ  และ , grade 4 stand และ /-, walk และ / และ  และ , trot และ  และ  และ , grade 3 stand -, walk และ /-, trot และ  และ , grade 2 trot และ , grade 1 trot และ /-); สไลด์ Eq lame ของรุ่นพี่ Vet 84 หน้า 25 วง Trot grade 2 ( และ ) และขีดเส้นใต้ Walk grade 4 ( และ / และ  และ )",
    "sourceType": "student-compilation",
    "examOrigin": "Equine Med & Surg (Vet 84) marked this point on their copy of the lecture slides",
    "tags": [
      "equine-lameness",
      "lameness-grade",
      "อิงแนวข้อสอบ"
    ],
    "sourcePages": [
      {
        "doc": "equine-lameness-2026",
        "edition": "85p",
        "page": 25
      },
      {
        "doc": "equine-lameness-v84",
        "edition": "84p",
        "page": 25
      }
    ]
  },
  {
    "id": 218530,
    "subject": "equine-medicine",
    "topic": "equine-lameness",
    "year": 5,
    "type": "mcq",
    "q": "หลักการทำ diagnostic analgesia ด้วย perineural block ในม้าที่เจ็บขาข้อใดถูกต้อง",
    "options": [
      "บล็อกไล่จากส่วนต้นของขาลงมาส่วนปลาย และประเมินซ้ำทันทีหลังฉีด",
      "บล็อกทุกตำแหน่งของขาพร้อมกันในครั้งเดียว แล้วประเมินผลหลัง 1 ชั่วโมง",
      "บล็อกไล่จากส่วนปลายของขาขึ้นไปส่วนต้น และประเมินซ้ำราว 10 นาทีหลังฉีด",
      "บล็อกขาข้างที่ไม่เจ็บก่อนทุกครั้ง เพื่อใช้เป็นค่าควบคุมของการประเมิน"
    ],
    "answer": 2,
    "explain": "การทำ diagnostic analgesia ควรบล็อกตามลำดับจากส่วนปลายของขาขึ้นไปส่วนต้น เลือกตำแหน่งตามผลการตรวจทางคลินิก ระวังการกระจายของยาชา โดยเฉพาะบริเวณส่วนต้น ฉีดให้แม่นและใช้ปริมาณยาให้น้อยตามความเหมาะสม และประเมินความเจ็บขาซ้ำราว 10 นาทีหลังฉีด\n\nทำไมข้ออื่นผิด\nไล่จากส่วนต้นลงปลายและประเมินทันที: ลำดับกลับกัน และยาชายังไม่ออกฤทธิ์เต็มที่\nบล็อกทุกตำแหน่งพร้อมกัน: แยกไม่ได้ว่าความเจ็บมาจากตำแหน่งใด\nบล็อกขาที่ไม่เจ็บก่อน: การบล็อกทำที่ขาที่เจ็บ เพื่อดูว่าอาการดีขึ้นหรือไม่",
    "source": "Diagnostic analgesia in horses (2026) หน้า 7",
    "verified": "Diagnostic analgesia in horses (2026) หน้า 7 (sequential distal to proximal ideally, targeted based on clinical findings, awareness of diffusion especially proximal, be accurate and minimise volume, re-evaluate lameness at 10 mins after injection ideally); สไลด์ Diagnostic analgesia ของรุ่นพี่ Vet 84 หน้า 7 ขีดเส้นใต้ distal to proximal และ Re-evaluate lameness at 10mins after injection ideally",
    "sourceType": "student-compilation",
    "examOrigin": "Equine Med & Surg (Vet 84) marked this point on their copy of the lecture slides",
    "tags": [
      "equine-lameness",
      "diagnostic-analgesia",
      "อิงแนวข้อสอบ"
    ],
    "sourcePages": [
      {
        "doc": "equine-diag-analgesia-2026",
        "edition": "43p",
        "page": 7
      },
      {
        "doc": "equine-diag-analgesia-v84",
        "edition": "41p",
        "page": 7
      }
    ]
  },
  {
    "id": 218531,
    "subject": "equine-medicine",
    "topic": "equine-lameness",
    "year": 5,
    "type": "mcq",
    "q": "หลังทำ perineural block อาการเจ็บขาลดลงราวร้อยละ 70 ถึง 90 จากค่าตั้งต้น ควรแปลผลอย่างไร",
    "options": [
      "นับเป็นผลบวก เพราะในทางปฏิบัติพบได้บ่อยกว่าการดีขึ้นครบร้อยละ 100",
      "นับเป็นผลลบ เพราะเกณฑ์ผลบวกของ perineural block คือดีขึ้นครบร้อยละ 100",
      "ยังสรุปไม่ได้ ต้องยืนยันด้วยการฉีดยาชาเข้าข้อ (intra-articular) ก่อนจึงแปลผล",
      "บ่งชี้ว่ายาชาฉีดผิดตำแหน่ง ควรบล็อกซ้ำที่ตำแหน่งเดิมด้วยยาชาปริมาณมากขึ้น"
    ],
    "answer": 0,
    "explain": "การแปลผล perineural block ในอุดมคติคือดีขึ้นร้อยละ 100 จากค่าตั้งต้น แต่ที่พบบ่อยคือดีขึ้นร้อยละ 70 ถึง 90 ซึ่งถือเป็นผลบวก ในทางปฏิบัติการดีขึ้นใดๆ ต้องตัดสินว่าบวกหรือลบ และต้องระวังอาการย้ายขา (switching lameness) และอาการที่แย่ลงหลังบล็อก\n\nทำไมข้ออื่นผิด\nต้องดีขึ้นครบร้อยละ 100: เป็นเพียงอุดมคติ การดีขึ้นร้อยละ 70 ถึง 90 พบบ่อยกว่าและนับเป็นบวก\nต้องยืนยันด้วยการฉีดเข้าข้อก่อน: ไม่ใช่หลักการแปลผล\nฉีดผิดตำแหน่งแล้วบล็อกซ้ำ: การดีขึ้นร้อยละ 70 ถึง 90 คือผลบวกที่พบบ่อย ไม่ได้บ่งชี้ว่าฉีดผิดตำแหน่ง",
    "source": "Diagnostic analgesia in horses (2026) หน้า 31",
    "verified": "Diagnostic analgesia in horses (2026) หน้า 31 (100% improvement from baseline ideally, 70-90% positive response more common but any improvement in reality positive or negative, switching lameness, worsening lameness), หน้า 7 (distal to proximal); สไลด์ Diagnostic analgesia ของรุ่นพี่ Vet 84 หน้า 28 วง 70-90% พร้อมเครื่องหมายสามขีด และขีดเส้นใต้ positive or negative",
    "sourceType": "student-compilation",
    "examOrigin": "Equine Med & Surg (Vet 84) marked this point on their copy of the lecture slides",
    "tags": [
      "equine-lameness",
      "diagnostic-analgesia",
      "อิงแนวข้อสอบ"
    ],
    "sourcePages": [
      {
        "doc": "equine-diag-analgesia-2026",
        "edition": "43p",
        "page": 31
      },
      {
        "doc": "equine-diag-analgesia-v84",
        "edition": "41p",
        "page": 28
      }
    ]
  },
  {
    "id": 218532,
    "subject": "equine-medicine",
    "topic": "equine-lameness",
    "year": 5,
    "type": "mcq",
    "q": "ข้อใดเป็นสาเหตุของผล nerve block เป็นลบลวง (false negative)",
    "options": [
      "ยาชากระจายขึ้นไปถึงบริเวณส่วนต้นที่เป็นต้นเหตุของความเจ็บ",
      "ผู้ตรวจมองไม่ออกว่าม้าเดินดีขึ้น (failure to appreciate improvement)",
      "ฉีดยาชาตรงตำแหน่งเส้นประสาทเป้าหมายได้อย่างแม่นยำ",
      "ความเจ็บทั้งหมดมาจากเนื้อเยื่อที่ยาชาครอบคลุมถึง"
    ],
    "answer": 1,
    "explain": "สาเหตุของผลลบลวงจาก nerve block ได้แก่ ฉีดไม่แม่น เช่น navicular bursa ให้เวลายาชาออกฤทธิ์ไม่พอ ผู้ตรวจมองไม่ออกว่าม้าดีขึ้น ความเจ็บรุนแรงมาก ความเจ็บที่ subchondral bone ไม่หายหลังฉีดเข้าข้อ ความเจ็บอยู่นอกข้อ เส้นประสาทเลี้ยงผิดแบบ และอาการที่ขึ้นลงระหว่างการตรวจ\n\nทำไมข้ออื่นผิด\nยาชากระจายขึ้นไปส่วนต้น: ทำให้ชาบริเวณที่ไม่ได้ตั้งใจและอาจได้ผลบวกลวง\nฉีดตรงตำแหน่งอย่างแม่นยำ: ทำให้ผลเชื่อถือได้ ไม่ใช่สาเหตุของผลลบลวง\nความเจ็บอยู่ในบริเวณที่ชา: ม้าควรดีขึ้น ผลจึงเป็นบวกจริง",
    "source": "Diagnostic analgesia in horses (2026) หน้า 7 และ 32",
    "verified": "Diagnostic analgesia in horses (2026) หน้า 32 (false-negative responses: inaccurate injection eg. navicular bursa, inadequate time, failure to appreciate improvement, very severe pain, subchondral bone pain, extra-articular pain, aberrant nerve supply, fluctuation), หน้า 7 (awareness of diffusion especially proximal); สไลด์ Diagnostic analgesia ของรุ่นพี่ Vet 84 หน้า 29 ขีดเส้นใต้ Failure to appreciate improvement",
    "sourceType": "student-compilation",
    "examOrigin": "Equine Med & Surg (Vet 84) marked this point on their copy of the lecture slides",
    "tags": [
      "equine-lameness",
      "diagnostic-analgesia",
      "อิงแนวข้อสอบ"
    ],
    "sourcePages": [
      {
        "doc": "equine-diag-analgesia-2026",
        "edition": "43p",
        "page": 32
      },
      {
        "doc": "equine-diag-analgesia-v84",
        "edition": "41p",
        "page": 29
      }
    ]
  },
];
