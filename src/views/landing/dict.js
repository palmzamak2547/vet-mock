// ============================================================
// Landing i18n dictionary (en / th)
// ============================================================
// Rewritten 2026-09-15. The previous copy was lifted from a design handoff
// and read like a translated SaaS template — twelve sections in one rhythm,
// a fake 72% readiness gauge, a fake dashboard, invented weakness cards, and
// it called the reader "นักศึกษา" on a page for Chula นิสิต.
//
// Rules for every string here:
//   - นิสิต, never นักศึกษา. This is Chula.
//   - Say it the way a fifth-year would say it to a first-year. No feature
//     lists translated from English, no section labels ("ทางออก", "ใช้งานยังไง").
//   - Every number on the page is read from q-counts.js or the timetable in
//     LandingBody. Nothing here is a typed-in statistic.
//   - Clinical and technical terms stay English in both languages.
//   - No middle dots, no emoji as icons.
// ============================================================

export const DICT = {
  en: {
    start: 'Start Practicing', signIn: 'Sign In', skip: 'Skip to main content',
    soundOn: 'Turn sound on', soundOff: 'Turn sound off',
    themeToDark: 'Switch to dark mode', themeToLight: 'Switch to light mode',
    bookmark: 'Save question', unbookmark: 'Remove saved question',
    menuOpen: 'Open menu', menuClose: 'Close menu', menuTitle: 'Explore VetMock',
    menuContext: 'Study context', menuNavLabel: 'Landing sections', menuLanguageLabel: 'Language',
    nav: [{ label: 'Practice', href: '#solution' }, { label: 'Panic Mode', href: '#panic' }, { label: 'Subjects', href: '#subjects' }, { label: 'Lab', href: '#lab' }, { label: 'Your home', href: '#progress' }],
    // No year in the chip: the reader has not picked one yet.
    ctxChip: 'CUVET / Semester 1, 2026',

    heroEyebrow: 'Made by a Chula vet student, for Chula vet students',
    heroPre: 'Past papers from the years above you, ', heroEm: 'before exam day.', heroPost: '',
    heroSub: 'Practise the kind of questions that actually get asked, read an explanation that says why the other options are wrong, then open the lecturer\'s slide the question came from. Free.',
    heroCta1: 'Start Practicing', heroCta2: 'Browse subjects',
    heroBankLabel: 'Question bank', heroBankLine: 'A real question from the shipped bank',
    heroTag: 'Small Animal Med — Endocrine',
    heroQ: 'A 7-year-old Labrador Retriever presents with polyuria, polydipsia, abdominal distension, and bilateral symmetrical alopecia. Which diagnostic test is the most appropriate next step?',
    heroExplain: 'The signalment and signs — PU/PD, a pot-bellied abdomen, and endocrine (bilaterally symmetrical) alopecia — point to hyperadrenocorticism (Cushing\'s). The LDDST is the screening test of choice, with the highest sensitivity for spontaneous disease.',
    heroConfQ: 'How confident are you?', conf: ['Guessing', 'Unsure', 'Confident'],
    check: 'Check answer', reset: 'Reset demo', demoNote: 'Interactive demo — this does not touch your progress.',
    previewBadge: 'Example', labDemoNote: 'Sample station, for demonstration.',
    correct: 'Correct', wrong: 'Not quite', why: 'Why',
    navTitle: 'Exam progress', legAnswered: 'Answered', legCurrent: 'Current', legFlagged: 'Flagged',

    // Countdown under the hero. The dates, the paper and the counts come from
    // the faculty timetable; only these labels live here.
    // No cohort here: a signed-out reader may be any year, and every year
    // sits the same week.
    cdUnits: ['days', 'hours', 'min', 'sec'], cdDuring: 'Now sitting: ',
    cdTerm: { midterm: 'Midterm exams', final: 'Final exams' }, cdSemester: 'Semester 1, 2026',
    cdRange: (a, b) => {
      const f = (s) => { const [y, m, d] = s.split('-').map(Number); return new Date(y, m - 1, d).toLocaleDateString('en-GB', { day: 'numeric', month: 'short' }); };
      return `${f(a)} to ${f(b)}`;
    },
    footPrivacy: 'Data and privacy', footTagline: 'Practice before the real exam.',
    labImgAlt: 'Canine lateral thoracic radiograph', labZoomOut: 'Zoom out', labZoomIn: 'Zoom in',
    cdLine: 'Every year sits the same week. Pick your year inside the app to see your own papers.',
    cdPanicLine: 'Pick your year inside the app and Panic Mode knows which paper is next for you.',
    cdDuringLine: 'Exam week is under way. Counting to its last day.',

    proofQuestions: 'questions you can open today', proofPast: 'from real past papers', proofSubjects: 'subjects',
    proofMarqueeLabel: 'Every subject with questions, with its real count. Tap one to start.',

    threeHead: 'Three things you can do here',
    three: [
      { title: 'Work through real past papers', body: 'Questions the years above you actually sat, plus the ones written from what they marked as examined. Timed or untimed, by subject or by topic, on the phone in the queue for the bus.' },
      { title: 'Read why the other options are wrong, then open the slide', body: 'Every explanation names the wrong options and says why. Where the question came from a lecture, the slide is one tap away, so you check the source instead of trusting a summary.' },
      { title: 'The night before, Panic Mode', body: 'Tell it how much time you have. It picks past-paper questions and the ones you keep getting wrong, sized to fit, and stops when the time is up.' },
    ],
    threePastLabel: 'Most past-paper questions right now',
    threeSlideBtn: 'Open the lecturer\'s slide',
    threePanicLine: (n, subjects) => `${n.toLocaleString('en-US')} past-paper questions across ${subjects} subjects, ready to revise`,

    panicHead: 'Exam tomorrow, half an hour left?',
    panicCalm: 'Breathe. Half an hour used well is worth more than a whole night used badly.',
    panicDesc: 'Say how much time you have. Panic Mode fills it with past-paper questions and, once there is enough history, the ones you have been getting wrong.',
    panicTimeQ: 'How long do you have?',
    panicTimes: [{ key: '15', label: '15 minutes' }, { key: '30', label: '30 minutes' }, { key: '60', label: '1 hour' }, { key: 'tonight', label: 'Tonight' }],
    panicCta: 'Open Panic Mode',

    subjLabel: 'Question bank',
    subjPre: 'Questions from ', subjEm: 'preclinical to clinical.', subjPost: '',
    subjSub: 'Grouped by the curriculum. The count on each card is the real number of questions you can open.',
    subjRealNote: 'Open now, real counts. Pick a subject to start.',
    subjShowcaseNote: 'The full subject map VetMock is built around.',
    subjToggleReal: 'Practise now', subjToggleShowcase: 'See all subjects',
    tabs: [{ key: 'all', label: 'All' }, { key: 'preclinical', label: 'Preclinical' }, { key: 'paraclinical', label: 'Paraclinical' }, { key: 'clinical', label: 'Clinical' }],
    qWord: 'questions', startPractice: 'Start practising',

    labSecHead: 'A practical exam needs practical practice.',
    labSecSub: 'OSPE-style stations built like the real bench: an image, a prompt, a clock. Then the next station.',
    labStation: 'Station 3 — Diagnostic Imaging',
    labPrompt: 'Identify the radiographic abnormality and select the most likely diagnosis.',
    labExplain: 'A dorsally elevated cardiac silhouette with left atrial enlargement and a caudodorsal interstitial-to-alveolar pattern is classic for cardiogenic pulmonary oedema in the dog.',
    labNext: 'Next station', labImgPlaceholder: 'Radiograph preview',
    toolAnnotate: 'Annotate', toolMeasure: 'Measure', toolReset: 'Reset view',

    progHead: 'Your home page knows how long is left, and what to do next.',
    progSub: 'The countdown runs on the faculty timetable. Under it, one suggested next step, sized to the time you say you have today.',
    progCaption: 'Screenshot of the real app, year 5, 15 September 2026.',
    progAlt: 'VetMock home page showing the midterm countdown and the suggested next step',

    ctaPre: 'The first time you meet a question like this should not be in the ', ctaEm: 'exam room.', ctaPost: '',
    cta1: 'Start Practicing',
    footTagline: 'Made by a Chula vet student.',
    footIndependent: 'VetMock is an independent study tool. Not affiliated with any faculty, university, or examination board.',
    footLinks: [{ label: 'Practice', href: '#solution' }, { label: 'Panic Mode', href: '#panic' }, { label: 'Subjects', href: '#subjects' }, { label: 'Lab', href: '#lab' }],
    copyright: '© 2026 VetMock',

    ckHead: 'Can we remember where you left off?',
    ckBody: 'VetMock uses essential cookies to keep the platform working and remember your study context. Optional cookies help us improve the learning experience.',
    ckAccept: 'Sounds good', ckEssential: 'Essential only', ckPrefs: 'Choose preferences', ckSave: 'Save preferences', ckAlways: 'Always on',
    ckEssentialT: 'Essential', ckEssentialD: 'Sign-in, security, and remembering your study context.',
    ckAnalyticsT: 'Product analytics', ckAnalyticsD: 'Helps us see which features actually help students learn.',
    ckPersonalT: 'Personalisation', ckPersonalD: 'Remembers your year, semester, exam period, and interface preferences.',
    lgHead: 'Pick up where you left off.', lgBody: 'Your curriculum, recent cases, saved mistakes, and study context will be ready.',
    lgGoogle: 'Continue with Google', lgGuest: 'Continue as guest', lgPassword: 'Sign in with a password', lgEmailLabel: 'Email',
    lgSend: 'Email me a sign-in link', lgSending: 'Sending…', lgOr: 'or',
    lgCtx: 'CUVET / Semester 1, 2026', lgSaved: 'Your study context will be saved',
    lgReturn: 'Continue where you stopped', lgReturnCase: 'Decision 7 of 12',
    lgSentHead: 'Check your inbox', lgSentBody: 'We sent a sign-in link to', lgSentHint: 'Open it on this device to continue.',
    lgSentTip: 'The link signs you in — no code to type. It expires shortly, so use it soon.',
    lgResend: 'Resend link', lgBack: 'Use another email', lgVerify: 'Verify and continue',
    lgIndependent: 'Independent platform — not an official university sign-in. We store your study context, never patient records.',
    lgClose: 'Close sign in',
    lgErrEmail: 'Enter a valid email address.', lgErrRate: 'Too many attempts — wait a moment and try again.',
    lgErrNoUser: 'No account for this email yet. Use "Sign in with a password" to create one.', lgErrGeneric: 'Couldn\'t send the link. Please try again.',
  },
  th: {
    start: 'เริ่มฝึกเลย', signIn: 'เข้าสู่ระบบ', skip: 'ข้ามไปเนื้อหาหลัก',
    soundOn: 'เปิดเสียง', soundOff: 'ปิดเสียง',
    themeToDark: 'เปลี่ยนเป็นโหมดมืด', themeToLight: 'เปลี่ยนเป็นโหมดสว่าง',
    bookmark: 'บันทึกข้อนี้', unbookmark: 'เลิกบันทึกข้อนี้',
    menuOpen: 'เปิดเมนู', menuClose: 'ปิดเมนู', menuTitle: 'สำรวจ VetMock',
    menuContext: 'บริบทการเรียน', menuNavLabel: 'ส่วนต่าง ๆ ในหน้าแนะนำ', menuLanguageLabel: 'ภาษา',
    nav: [{ label: 'ฝึกทำโจทย์', href: '#solution' }, { label: 'Panic Mode', href: '#panic' }, { label: 'รายวิชา', href: '#subjects' }, { label: 'แล็บ', href: '#lab' }, { label: 'หน้าแรกของคุณ', href: '#progress' }],
    ctxChip: 'CUVET / ภาคต้น 2569',

    heroEyebrow: 'ทำโดยนิสิตสัตวแพทย์จุฬา ให้นิสิตสัตวแพทย์จุฬา',
    heroPre: 'ข้อสอบเก่าของรุ่นพี่ ทำได้', heroEm: 'ก่อนถึงวันสอบ', heroPost: '',
    heroSub: 'ทำโจทย์แนวเดียวกับที่ออกจริง อ่านเฉลยที่บอกว่าทำไมข้ออื่นถึงผิด แล้วเปิดสไลด์อาจารย์ที่ออกข้อนั้นได้เลย ฟรี ไม่มีค่าใช้จ่าย',
    heroCta1: 'เริ่มฝึกเลย', heroCta2: 'ดูรายวิชา',
    heroBankLabel: 'คลังข้อสอบ', heroBankLine: 'โจทย์จริงจากคลังที่เปิดใช้อยู่',
    heroTag: 'Small Animal Med — Endocrine',
    heroQ: 'สุนัขพันธุ์ Labrador Retriever อายุ 7 ปี มาด้วยอาการ polyuria, polydipsia, ท้องกาง และ bilateral symmetrical alopecia ควรส่งตรวจอะไรเป็นลำดับถัดไป',
    heroExplain: 'อาการ PU/PD ท้องกางแบบ pot-belly และ endocrine alopecia ที่สมมาตรสองข้าง ชี้ไปที่ hyperadrenocorticism (Cushing\'s) ซึ่ง LDDST เป็น screening test ที่ไวที่สุด และเป็น test of choice สำหรับโรคที่เกิดเอง',
    heroConfQ: 'มั่นใจแค่ไหน', conf: ['เดา', 'ไม่แน่ใจ', 'มั่นใจ'],
    check: 'ตรวจคำตอบ', reset: 'ลองใหม่', demoNote: 'ลองเล่นได้ ไม่มีผลกับความคืบหน้าของคุณ',
    previewBadge: 'ตัวอย่าง', labDemoNote: 'สถานีตัวอย่าง เพื่อการสาธิต',
    correct: 'ถูกต้อง', wrong: 'ยังไม่ใช่', why: 'เฉลย',
    navTitle: 'ความคืบหน้า', legAnswered: 'ตอบแล้ว', legCurrent: 'ข้อนี้', legFlagged: 'ปักหมุด',

    cdUnits: ['วัน', 'ชม.', 'นาที', 'วินาที'], cdDuring: 'กำลัง',
    cdTerm: { midterm: 'สอบกลางภาค', final: 'สอบปลายภาค' },
    footPrivacy: 'ข้อมูลและความเป็นส่วนตัว', footTagline: 'ซ้อมก่อนถึงวันสอบจริง',
    labImgAlt: 'ภาพรังสีทรวงอกสุนัข มุมด้านข้าง', labZoomOut: 'ย่อภาพ', labZoomIn: 'ขยายภาพ',
    cdLine: 'ทุกชั้นปีสอบสัปดาห์เดียวกัน เข้าแอปแล้วเลือกปีของคุณ จะเห็นตารางวิชาของตัวเอง',
    cdPanicLine: 'เลือกปีของคุณในแอป แล้ว Panic Mode จะรู้เองว่าวิชาถัดไปของคุณคืออะไร',
    cdDuringLine: 'สัปดาห์สอบกำลังดำเนินอยู่ นับถอยหลังถึงวันสุดท้าย',

    proofQuestions: 'ข้อ เปิดทำได้วันนี้', proofPast: 'ข้อ จากข้อสอบเก่าจริง', proofSubjects: 'วิชา',
    proofMarqueeLabel: 'ทุกวิชาที่มีข้อสอบ พร้อมจำนวนข้อจริง กดวิชาไหนก็เริ่มได้เลย',

    threeHead: 'สามอย่างที่ทำได้ที่นี่',
    three: [
      { title: 'ทำข้อสอบเก่าของจริง', body: 'ข้อที่รุ่นพี่สอบมาแล้วจริง ๆ กับข้อที่เขียนจากจุดที่รุ่นพี่บอกว่าออก จะจับเวลาหรือไม่จับก็ได้ เลือกเป็นวิชาหรือเป็นหัวข้อ ทำบนมือถือตอนรอรถก็ได้' },
      { title: 'อ่านว่าทำไมข้ออื่นผิด แล้วเปิดสไลด์', body: 'เฉลยทุกข้อไล่ตัวเลือกที่ผิดทีละข้อว่าผิดตรงไหน ข้อไหนมาจากเลกเชอร์ กดเดียวเปิดสไลด์อาจารย์หน้านั้นได้เลย ไม่ต้องเชื่อสรุปใครทั้งนั้น' },
      { title: 'คืนก่อนสอบ เข้า Panic Mode', body: 'บอกว่ามีเวลาเท่าไหร่ มันจะเลือกข้อสอบเก่ากับข้อที่คุณยังผิดอยู่มาให้พอดีเวลา หมดเวลาก็หยุด ไม่ลากคุณอ่านต่อจนสว่าง' },
    ],
    threePastLabel: 'วิชาที่มีข้อสอบเก่ามากที่สุดตอนนี้',
    threeSlideBtn: 'เปิดสไลด์อาจารย์',
    threePanicLine: (n, subjects) => `ข้อสอบเก่า ${n.toLocaleString('en-US')} ข้อ ใน ${subjects} วิชา พร้อมให้ทบทวน`,

    panicHead: 'พรุ่งนี้สอบ เหลืออีกครึ่งชั่วโมง?',
    panicCalm: 'หายใจก่อน ครึ่งชั่วโมงที่ใช้ถูก มีค่ากว่าทั้งคืนที่ใช้ผิด',
    panicDesc: 'บอกว่ามีเวลาเท่าไหร่ Panic Mode จะเติมให้เต็มด้วยข้อสอบเก่า และถ้าเคยทำมาพอ จะหยิบข้อที่คุณยังตอบผิดมาก่อน',
    panicTimeQ: 'มีเวลาเท่าไหร่',
    panicTimes: [{ key: '15', label: '15 นาที' }, { key: '30', label: '30 นาที' }, { key: '60', label: '1 ชั่วโมง' }, { key: 'tonight', label: 'คืนนี้' }],
    panicCta: 'เข้า Panic Mode',

    subjLabel: 'คลังข้อสอบ',
    subjPre: 'โจทย์ตั้งแต่ ', subjEm: 'preclinical ถึง clinical', subjPost: '',
    subjSub: 'จัดตามหลักสูตร ตัวเลขบนการ์ดคือจำนวนข้อจริงที่เปิดทำได้',
    subjRealNote: 'เปิดให้ฝึกแล้ว จำนวนข้อจริง เลือกวิชาเพื่อเริ่ม',
    subjShowcaseNote: 'ภาพรวมรายวิชาทั้งหมดที่ VetMock ออกแบบไว้',
    subjToggleReal: 'ฝึกเลย', subjToggleShowcase: 'ดูรายวิชาทั้งหมด',
    tabs: [{ key: 'all', label: 'ทั้งหมด' }, { key: 'preclinical', label: 'Preclinical' }, { key: 'paraclinical', label: 'Paraclinical' }, { key: 'clinical', label: 'Clinical' }],
    qWord: 'ข้อ', startPractice: 'เริ่มฝึก',

    labSecHead: 'สอบปฏิบัติ ต้องซ้อมแบบปฏิบัติ',
    labSecSub: 'สถานีแบบ OSPE ที่ทำเหมือนโต๊ะแล็บจริง มีภาพ มีโจทย์ มีเวลานับถอยหลัง เสร็จแล้วไปสถานีถัดไป',
    labStation: 'สถานีที่ 3 — Diagnostic Imaging',
    labPrompt: 'ระบุความผิดปกติในภาพรังสี แล้วเลือก diagnosis ที่เป็นไปได้มากที่สุด',
    labExplain: 'เงาหัวใจยกตัวติด sternum ร่วมกับ left atrial enlargement และ interstitial-to-alveolar pattern บริเวณ caudodorsal เป็นภาพคลาสสิกของ cardiogenic pulmonary oedema ในสุนัข',
    labNext: 'สถานีถัดไป', labImgPlaceholder: 'ตัวอย่างภาพรังสี',
    toolAnnotate: 'ทำเครื่องหมาย', toolMeasure: 'วัดระยะ', toolReset: 'รีเซ็ตภาพ',

    progHead: 'หน้าแรกของคุณรู้ว่าเหลือเวลาเท่าไหร่ และควรทำอะไรต่อ',
    progSub: 'นาฬิกานับถอยหลังเดินตามตารางสอบของคณะ ข้างใต้มีข้อแนะนำหนึ่งอย่างว่าวันนี้ควรทำอะไร ปรับตามเวลาที่คุณบอกว่ามี',
    progCaption: 'ภาพจากแอปจริง ชั้นปี 5 วันที่ 15 ก.ย. 2569',
    progAlt: 'หน้าแรกของ VetMock แสดงนาฬิกานับถอยหลังสอบกลางภาคและข้อแนะนำสิ่งที่ควรทำต่อ',

    ctaPre: 'ครั้งแรกที่เจอโจทย์แบบนี้ ไม่ควรเป็นตอนอยู่ใน', ctaEm: 'ห้องสอบ', ctaPost: '',
    cta1: 'เริ่มฝึกเลย',
    footTagline: 'ทำโดยนิสิตสัตวแพทย์จุฬา',
    footIndependent: 'VetMock เป็นเครื่องมือฝึกอิสระ ไม่ได้สังกัดคณะ มหาวิทยาลัย หรือหน่วยงานจัดสอบใด ๆ',
    footLinks: [{ label: 'ฝึกทำโจทย์', href: '#solution' }, { label: 'Panic Mode', href: '#panic' }, { label: 'รายวิชา', href: '#subjects' }, { label: 'แล็บ', href: '#lab' }],
    copyright: '© 2026 VetMock',

    ckHead: 'ให้เราจำที่ที่คุณค้างไว้ได้ไหม?',
    ckBody: 'VetMock ใช้คุกกี้ที่จำเป็นเพื่อให้ระบบทำงานและจำบริบทการเรียนของคุณ ส่วนคุกกี้เสริมช่วยให้เราปรับปรุงประสบการณ์การเรียนให้ดีขึ้น',
    ckAccept: 'โอเคเลย', ckEssential: 'เฉพาะที่จำเป็น', ckPrefs: 'เลือกเอง', ckSave: 'บันทึกการตั้งค่า', ckAlways: 'เปิดตลอด',
    ckEssentialT: 'จำเป็น', ckEssentialD: 'การเข้าสู่ระบบ ความปลอดภัย และการจำบริบทการเรียนของคุณ',
    ckAnalyticsT: 'วิเคราะห์การใช้งาน', ckAnalyticsD: 'ช่วยให้เราเห็นว่าฟีเจอร์ไหนช่วยการเรียนได้จริง',
    ckPersonalT: 'ปรับแต่งเฉพาะคุณ', ckPersonalD: 'จำปี เทอม ช่วงสอบ และการตั้งค่าหน้าจอของคุณ',
    lgHead: 'กลับมาต่อจากที่ค้างไว้', lgBody: 'หลักสูตร เคสล่าสุด ข้อที่พลาด และบริบทการเรียนของคุณ พร้อมแล้ว',
    lgGoogle: 'เข้าสู่ระบบด้วย Google', lgGuest: 'ใช้งานแบบผู้เยี่ยมชม', lgPassword: 'เข้าสู่ระบบด้วยรหัสผ่าน', lgEmailLabel: 'อีเมล',
    lgSend: 'ส่งลิงก์เข้าสู่ระบบให้ฉัน', lgSending: 'กำลังส่ง…', lgOr: 'หรือ',
    lgCtx: 'CUVET / ภาคต้น 2569', lgSaved: 'บริบทการเรียนของคุณจะถูกบันทึกไว้',
    lgReturn: 'ไปต่อจากที่หยุดไว้', lgReturnCase: 'ตัดสินใจข้อ 7 จาก 12',
    lgSentHead: 'เช็กอีเมลของคุณ', lgSentBody: 'เราส่งลิงก์เข้าสู่ระบบไปที่', lgSentHint: 'เปิดลิงก์บนเครื่องนี้เพื่อไปต่อ',
    lgSentTip: 'ลิงก์จะพาเข้าสู่ระบบเลย ไม่ต้องกรอกรหัส ลิงก์มีอายุจำกัด ใช้ให้เร็วนะ',
    lgResend: 'ส่งลิงก์ใหม่', lgBack: 'ใช้อีเมลอื่น', lgVerify: 'ยืนยันและไปต่อ',
    lgIndependent: 'แพลตฟอร์มอิสระ — ไม่ใช่การเข้าสู่ระบบทางการของมหาวิทยาลัย เราเก็บบริบทการเรียนของคุณ ไม่เก็บข้อมูลผู้ป่วย',
    lgClose: 'ปิดหน้าต่างเข้าสู่ระบบ',
    lgErrEmail: 'กรอกอีเมลให้ถูกต้อง', lgErrRate: 'ลองบ่อยเกินไป รอสักครู่แล้วลองใหม่',
    lgErrNoUser: 'ยังไม่มีบัญชีสำหรับอีเมลนี้ ใช้ "เข้าสู่ระบบด้วยรหัสผ่าน" เพื่อสมัคร', lgErrGeneric: 'ส่งลิงก์ไม่สำเร็จ ลองอีกครั้ง',
  },
};
