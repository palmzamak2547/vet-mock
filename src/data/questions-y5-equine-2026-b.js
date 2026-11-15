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
];
