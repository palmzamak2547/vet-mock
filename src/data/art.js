// ============================================================
// art.js — the illustrated assets and where each one is allowed to appear
// ============================================================
// 65 decorative assets, none of which asserts anything clinical. They are
// referenced by id, never by path, so a renamed or missing file is a build
// failure (scripts/lint-art.mjs) instead of a broken image on someone's
// screen the day before a paper.
//
// Everything ships as WebP: the source PNGs are 9 MB, the same images are
// 1.3 MB here, and the repo already targets ios >= 14 where WebP is
// supported. Originals live in work/art-brief-20260914 (gitignored) and are
// regenerable from the prompts recorded there.
//
// `alt` is Thai and describes the PICTURE, not the screen it sits on — a
// screen reader user hearing "ชั้นวางหนังสือที่ว่างเปล่า" learns what the
// sighted user learns. Where the illustration is pure decoration beside text
// that already says the same thing, alt is deliberately empty and the element
// is aria-hidden, which is the correct treatment for a duplicate.
// ============================================================

const base = (set, name) => `/art/${set}/${name}.webp`;

/** First-run illustrations: "nothing here yet", never "something broke". */
export const EMPTY_ART = {
  contribute: { src: base('empty-states', 'contribute'), alt: 'ซองจดหมายเปิดอยู่ ยังไม่มีอะไรข้างใน' },
  dashboard: { src: base('empty-states', 'dashboard'), alt: 'กรอบกราฟที่มีแกนแต่ยังไม่มีแท่งข้อมูล' },
  groups: { src: base('empty-states', 'groups'), alt: 'เก้าอี้อ่านหนังสือสองตัวว่างอยู่รอบโต๊ะกลม' },
  leaderboard: { src: base('empty-states', 'leaderboard'), alt: 'แท่นรับรางวัลสามขั้นที่ยังไม่มีใครยืน' },
  library: { src: base('empty-states', 'library'), alt: 'ชั้นวางหนังสือที่ว่างเปล่า มีริบบิ้นคั่นหนังสือห้อยอยู่' },
  pinboard: { src: base('empty-states', 'pinboard'), alt: 'กระดานปักหมุดที่ยังไม่มีโน้ตติดอยู่' },
  'question-manager': { src: base('empty-states', 'question-manager'), alt: 'กระดาษเปล่ามีเส้นบรรทัดและปากกาวางพาดอยู่' },
  race: { src: base('empty-states', 'race'), alt: 'เส้นสตาร์ทลู่วิ่งที่ยังไม่มีผู้เข้าแข่ง' },
  reading: { src: base('empty-states', 'reading'), alt: 'สมุดเช็กลิสต์ที่ยังไม่มีเครื่องหมายถูก' },
  'review-queue': { src: base('empty-states', 'review-queue'), alt: 'ถาดรับเอกสารที่ว่างเปล่า' },
  schedule: { src: base('empty-states', 'schedule'), alt: 'ตารางปฏิทินเปล่าที่ยังไม่มีวันไหนถูกวงไว้' },
  'sr-session': { src: base('empty-states', 'sr-session'), alt: 'กล่องบัตรคำที่มีแผ่นคั่นแต่ยังไม่มีบัตร' },
};

/** Mochi in each discipline's working kit. Keys are subject ids. */
export const SUBJECT_MOCHI = {
  'aquatic-clinic': { src: base('mochi-subjects', 'aquatic'), alt: 'โมจิใส่หน้ากากดำน้ำถือสวิง' },
  epidemiology: { src: base('mochi-subjects', 'epidemiology'), alt: 'โมจิใส่แว่นถือคลิปบอร์ด' },
  'equine-medicine': { src: base('mochi-subjects', 'equine'), alt: 'โมจิใส่หมวกขี่ม้า' },
  'equine-repro': { src: base('mochi-subjects', 'equine'), alt: 'โมจิใส่หมวกขี่ม้า' },
  'food-industry': { src: base('mochi-subjects', 'food-industry'), alt: 'โมจิใส่หมวกเชฟถือถาด' },
  'food-safety-y4': { src: base('mochi-subjects', 'food-industry'), alt: 'โมจิใส่หมวกเชฟถือถาด' },
  'milk-meat-hygiene': { src: base('mochi-subjects', 'milk'), alt: 'โมจิใส่ผ้ากันเปื้อนถือถังนม' },
  'one-health': { src: base('mochi-subjects', 'one-health'), alt: 'โมจิกอดลูกโลกไว้กับอก' },
  zoonoses: { src: base('mochi-subjects', 'one-health'), alt: 'โมจิกอดลูกโลกไว้กับอก' },
  'avian-medicine': { src: base('mochi-subjects', 'poultry'), alt: 'โมจิมีลูกเจี๊ยบเกาะอยู่บนหัว' },
  poultry: { src: base('mochi-subjects', 'poultry'), alt: 'โมจิมีลูกเจี๊ยบเกาะอยู่บนหัว' },
  cliapprum: { src: base('mochi-subjects', 'ruminant'), alt: 'โมจิใส่หมวกปีกกว้างและถุงมือยาว' },
  practrum: { src: base('mochi-subjects', 'ruminant'), alt: 'โมจิใส่หมวกปีกกว้างและถุงมือยาว' },
  'herd-health-rum': { src: base('mochi-subjects', 'ruminant'), alt: 'โมจิใส่หมวกปีกกว้างและถุงมือยาว' },
  'ruminant-clinical': { src: base('mochi-subjects', 'ruminant'), alt: 'โมจิใส่หมวกปีกกว้างและถุงมือยาว' },
  'swine-clinic': { src: base('mochi-subjects', 'swine'), alt: 'โมจิใส่รองเท้าบูทถือคลิปบอร์ด' },
  'swine-herd': { src: base('mochi-subjects', 'swine'), alt: 'โมจิใส่รองเท้าบูทถือคลิปบอร์ด' },
  'swine-repro': { src: base('mochi-subjects', 'swine'), alt: 'โมจิใส่รองเท้าบูทถือคลิปบอร์ด' },
};

/** Earned marks. `test` runs against the numbers the app already keeps, so
 *  nothing new is stored and a badge cannot disagree with the dashboard. */
export const BADGE_ART = {
  'streak-7': { src: base('badges', 'streak-7'), label: 'ต่อเนื่อง 7 วัน' },
  'streak-30': { src: base('badges', 'streak-30'), label: 'ต่อเนื่อง 30 วัน' },
  'questions-100': { src: base('badges', 'questions-100'), label: 'ทำครบ 100 ข้อ' },
  'questions-1000': { src: base('badges', 'questions-1000'), label: 'ทำครบ 1,000 ข้อ' },
  perfect: { src: base('badges', 'perfect'), label: 'ชุดเต็ม ไม่ผิดเลย' },
  'panic-survivor': { src: base('badges', 'panic-survivor'), label: 'รอดจาก Panic Mode' },
  'night-owl': { src: base('badges', 'night-owl'), label: 'อ่านดึก' },
  'early-bird': { src: base('badges', 'early-bird'), label: 'อ่านเช้า' },
  'corrected-mistakes': { src: base('badges', 'corrected-mistakes'), label: 'แก้ข้อที่เคยผิด' },
  'review-cycle': { src: base('badges', 'review-cycle'), label: 'ทบทวนครบรอบ' },
  contributor: { src: base('badges', 'contributor'), label: 'ช่วยเติมเนื้อหา' },
  'study-group': { src: base('badges', 'study-group'), label: 'ติวเป็นกลุ่ม' },
  'race-winner': { src: base('badges', 'race-winner'), label: 'ชนะการแข่ง' },
  'exam-finished': { src: base('badges', 'exam-finished'), label: 'จบช่วงสอบ' },
};

/** Backdrops for the IG card canvas. Drawn behind the text, never over it. */
export const IG_BACKGROUNDS = [
  { id: 'none', label: 'ไม่มีลาย', src: null },
  { id: 'herb-border', label: 'ใบไม้รอบขอบ', src: base('ig-backgrounds', 'herb-border') },
  { id: 'paw-trail', label: 'รอยเท้า', src: base('ig-backgrounds', 'paw-trail') },
  { id: 'stethoscope', label: 'หูฟัง', src: base('ig-backgrounds', 'stethoscope') },
  { id: 'notebook', label: 'เส้นสมุด', src: base('ig-backgrounds', 'notebook') },
  { id: 'arch', label: 'ซุ้มโค้ง', src: base('ig-backgrounds', 'arch') },
  { id: 'dotted-grid', label: 'จุดไข่ปลา', src: base('ig-backgrounds', 'dotted-grid') },
  { id: 'torn-paper', label: 'ขอบกระดาษฉีก', src: base('ig-backgrounds', 'torn-paper') },
  { id: 'field', label: 'ทุ่งหญ้า', src: base('ig-backgrounds', 'field') },
  { id: 'microscope', label: 'กล้องจุลทรรศน์', src: base('ig-backgrounds', 'microscope') },
  { id: 'confetti', label: 'ใบไม้ปลิว', src: base('ig-backgrounds', 'confetti') },
];

/** Sprites for the offline mini-game. */
export const GAME_ART = {
  chickRunning: base('game', 'chick-running'),
  chickJumping: base('game', 'chick-jumping'),
  chickTumbling: base('game', 'chick-tumbling'),
  germRound: base('game', 'germ-round'),
  germTall: base('game', 'germ-tall'),
  shield: base('game', 'shield'),
  speed: base('game', 'speed'),
  farmyard: base('game', 'farmyard'),
};

/** Shown while a question bank is still arriving. */
export const LOADING_ART = {
  book: { src: base('loading', 'radial-book'), spin: true },
  plane: { src: base('loading', 'paper-plane'), spin: false },
  cards: { src: base('loading', 'index-cards'), spin: false },
};

/** Mochi for where the term is, keyed by the window it belongs to. */
export const SEASONAL_MOCHI = {
  'exam-week': { src: base('mochi-seasonal', 'exam-week'), alt: 'โมจิคาดผ้าที่หน้าผาก กำหมัดทั้งสองข้าง' },
  'exam-eve': { src: base('mochi-seasonal', 'exam-eve'), alt: 'โมจิถือแก้วเครื่องดื่มอุ่น ๆ ห่มผ้า' },
  'exam-finished': { src: base('mochi-seasonal', 'exam-finished'), alt: 'โมจิชูแขนทั้งสองข้างมีสายรุ้งกระดาษ' },
  holiday: { src: base('mochi-seasonal', 'holiday'), alt: 'โมจิใส่หมวกปีกกว้างและแว่นกันแดด' },
  'new-year': { src: base('mochi-seasonal', 'new-year'), alt: 'โมจิใส่หมวกปาร์ตี้ถือประทัดเล็ก ๆ' },
};

/**
 * Title slides of the decks each lecturer taught from, cropped from the
 * cohort's own recordings, keyed by subject then topic id. Shown on the
 * lecturer cards (components/LecturerSets.jsx) so the row reads as "the
 * slides this lecturer opened", not as a list of topic names.
 */
export const LECTURE_COVERS = {
  'avian-medicine': {
    'avian-nd': { src: base('lecture-covers', 'avian-medicine-avian-nd'), alt: 'ปกสไลด์ Newcastle Disease พื้นน้ำเงิน ลายขนนก' },
    'avian-ib': { src: base('lecture-covers', 'avian-medicine-avian-ib'), alt: 'ปกสไลด์ Infectious Bronchitis พื้นชมพูเข้ม ลายขนนก' },
    'avian-lt': { src: base('lecture-covers', 'avian-medicine-avian-lt'), alt: 'ปกสไลด์ Infectious Laryngotracheitis พื้นเขียว ลายขนนก' },
    'avian-mpv': { src: base('lecture-covers', 'avian-medicine-avian-mpv'), alt: 'ปกสไลด์ Avian Metapneumovirus พื้นฟ้าอมเขียว' },
    'avian-pox': { src: base('lecture-covers', 'avian-medicine-avian-pox'), alt: 'ปกสไลด์ Fowlpox พื้นน้ำตาล ลายขนนก' },
    'avian-rss': { src: base('lecture-covers', 'avian-medicine-avian-rss'), alt: 'ปกสไลด์ Runting-Stunting syndrome พื้นขาว' },
    'avian-cocci': { src: base('lecture-covers', 'avian-medicine-avian-cocci'), alt: 'ปกสไลด์ Coccidiosis พื้นเหลืองอ่อน ลายจุด' },
    'avian-malaria': { src: base('lecture-covers', 'avian-medicine-avian-malaria'), alt: 'ปกสไลด์ Avian Malaria พื้นน้ำเงิน ลายใบไม้' },
    'avian-ne': { src: base('lecture-covers', 'avian-medicine-avian-ne'), alt: 'ปกสไลด์ Necrotic Enteritis พื้นเขียว ลายจุด' },
    'avian-leuko': { src: base('lecture-covers', 'avian-medicine-avian-leuko'), alt: 'ปกสไลด์ Leucocytozoonosis พื้นม่วงแดง ลายใบไม้' },
    'avian-ibd': { src: base('lecture-covers', 'avian-medicine-avian-ibd'), alt: 'ปกสไลด์ Infectious Bursal disease พื้นน้ำเงิน ลายขนนก' },
    'avian-marek': { src: base('lecture-covers', 'avian-medicine-avian-marek'), alt: 'ปกสไลด์ Neoplastic Diseases in Poultry พื้นเขียวเข้ม ลายใบไม้' },
    'avian-cia': { src: base('lecture-covers', 'avian-medicine-avian-cia'), alt: 'ปกสไลด์ Chicken Infectious Anemia พื้นม่วง ลายขนนก' },
    'avian-reo': { src: base('lecture-covers', 'avian-medicine-avian-reo'), alt: 'ปกสไลด์ Reovirus Infections พื้นเขียวอ่อน ลายขนนก' },
    'avian-myco': { src: base('lecture-covers', 'avian-medicine-avian-myco'), alt: 'ปกสไลด์ โรคมัยโคพลาสโมซิส ตราคณะ แถบชมพูฟ้า' },
    'avian-coryza': { src: base('lecture-covers', 'avian-medicine-avian-coryza'), alt: 'ปกสไลด์ Infectious Coryza แถบชมพูฟ้า' },
    'avian-coli': { src: base('lecture-covers', 'avian-medicine-avian-coli'), alt: 'ปกสไลด์ โรคติดเชื้ออี.โคไล แถบชมพูฟ้า' },
    'avian-fowl-cholera': { src: base('lecture-covers', 'avian-medicine-avian-fowl-cholera'), alt: 'ปกสไลด์ Fowl Cholera แถบชมพูฟ้า' },
    'avian-ai': { src: base('lecture-covers', 'avian-medicine-avian-ai'), alt: 'ปกสไลด์ โรคไข้หวัดนก Avian influenza แถบชมพูฟ้า' },
    'avian-egg-breakout': { src: base('lecture-covers', 'avian-medicine-avian-egg-breakout'), alt: 'ปกสไลด์ Egg Breakout Analysis แถบชมพูฟ้า' },
    'avian-ahra-set': { src: base('lecture-covers', 'avian-medicine-avian-ahra-set'), alt: 'ปกสไลด์ Omphalitis Ascites Staphylococcus Salmonella Adenovirus พื้นดำ กรอบเหลือง' },
  },
  // Milk & Meat Hygiene 3109503, midterm 2026-09-22: page 1 of each deck on
  // the shelf, rendered straight from the PDF rather than screenshotted, so
  // there is no browser chrome or page badge to crop away.
  'milk-meat-hygiene': {
    'milk-biosec-dairy': { src: base('lecture-covers', 'milk-meat-hygiene-milk-biosec-dairy'), alt: 'ปกสไลด์ ความปลอดภัยทางชีวภาพเพื่อการผลิตน้ำนมคุณภาพดี ภาพโรงเรือนโคนม' },
    'milk-overview': { src: base('lecture-covers', 'milk-meat-hygiene-milk-overview'), alt: 'ปกสไลด์ Introduction to Milk Hygiene พื้นฟ้า ภาพน้ำนมกระเซ็น' },
    'milk-mastitis': { src: base('lecture-covers', 'milk-meat-hygiene-milk-mastitis'), alt: 'ปกสไลด์ Mastitis and milk quality ภาพเต้านมโค' },
    'milk-raw-storage': { src: base('lecture-covers', 'milk-meat-hygiene-milk-raw-storage'), alt: 'ปกสไลด์ Storage of raw milk พื้นขาว ภาพน้ำนมกระเซ็น' },
    'milk-quality-determination': { src: base('lecture-covers', 'milk-meat-hygiene-milk-quality-determination'), alt: 'ปกสไลด์ Determination of milk quality พื้นขาว ภาพน้ำนมกระเซ็น' },
    'milk-quality-composition': { src: base('lecture-covers', 'milk-meat-hygiene-milk-quality-composition'), alt: 'ปกสไลด์ Composition and quality of raw milk พื้นฟ้าลายวงกลมซ้อน' },
    'milk-raw-std': { src: base('lecture-covers', 'milk-meat-hygiene-milk-raw-std'), alt: 'ปกสไลด์ Standard of raw milk and dairy products พื้นน้ำตาลลายสี่เหลี่ยม' },
    'milk-microbiology': { src: base('lecture-covers', 'milk-meat-hygiene-milk-microbiology'), alt: 'ปกสไลด์ Milk microbiology พื้นน้ำเงินเข้ม ลายหยดน้ำนม' },
    'milk-borne-pathogens': { src: base('lecture-covers', 'milk-meat-hygiene-milk-borne-pathogens'), alt: 'ปกสไลด์ Milk-borne pathogens and diseases พื้นน้ำเงินเข้ม ลายหยดน้ำนม' },
    'milk-industry-std': { src: base('lecture-covers', 'milk-meat-hygiene-milk-industry-std'), alt: 'ปกสไลด์ GMP and HACCP standards for milk collecting center and milk processing plants พื้นฟ้าอ่อน' },
    'milk-processing': { src: base('lecture-covers', 'milk-meat-hygiene-milk-processing'), alt: 'ปกสไลด์ Processing and manufacturing technologies for milk and milk products ภาพผลิตภัณฑ์นม' },
  },
  // FIQC 3109501, midterm 2026-09-22: the title slide of each deck, cropped
  // from the students' screenshots of the course files. Period 1 taught two
  // decks, so it has two covers under the one topic id.
  'food-industry': {
    'fiqc-intro': { src: base('lecture-covers', 'food-industry-fiqc-intro'), alt: 'ปกสไลด์ Food Industry and Quality Control Introduction พื้นขาว กรอบเทา' },
    'fiqc-public-health-act': { src: base('lecture-covers', 'food-industry-fiqc-public-health-act'), alt: 'ปกสไลด์ พระราชบัญญัติการสาธารณสุข พื้นขาว กรอบน้ำเงินเทา' },
    'fiqc-feed-qc': { src: base('lecture-covers', 'food-industry-fiqc-feed-qc'), alt: 'ปกสไลด์ อุตสาหกรรมอาหารสัตว์และการควบคุมคุณภาพ พื้นขาว กรอบเทา' },
    'fiqc-slaughter-qc': { src: base('lecture-covers', 'food-industry-fiqc-slaughter-qc'), alt: 'ปกสไลด์ การควบคุมกระบวนการฆ่าและการจำหน่ายเนื้อสัตว์ พื้นขาว กรอบเทา' },
    'fiqc-livestock-qc': { src: base('lecture-covers', 'food-industry-fiqc-livestock-qc'), alt: 'ปกสไลด์ มาตรฐานสินค้าเกษตรที่เกี่ยวข้องกับกระบวนการผลิตปศุสัตว์ ภาพไก่ไข่ในฟาร์ม' },
  },
  // One Health 3109502, midterm 2026-09-21: the title slide of each session's
  // deck, cropped from the students' screenshots of the course files.
  'one-health': {
    'oh-vet-role': { src: base('lecture-covers', 'one-health-oh-vet-role'), alt: 'ปกสไลด์ Role of Veterinarians in One Health พื้นน้ำเงินเข้ม วงกลมซ้อน' },
    'oh-concept': { src: base('lecture-covers', 'one-health-oh-concept'), alt: 'ปกสไลด์ One World One Health Concept พื้นขาว กรอบฟ้า' },
    'oh-disease-prevention': { src: base('lecture-covers', 'one-health-oh-disease-prevention'), alt: 'ปกสไลด์ One Health Approach to combat Emerging and Re-Emerging Diseases ตัวอักษรน้ำเงิน' },
    'oh-global-network': { src: base('lecture-covers', 'one-health-oh-global-network'), alt: 'ปกสไลด์ Global One Health Activity Network พื้นน้ำเงินเข้ม ไอคอนสัตว์ คน สิ่งแวดล้อม' },
    'oh-communication': { src: base('lecture-covers', 'one-health-oh-communication'), alt: 'ปกสไลด์ One Health Communication พื้นขาว กรอบฟ้า' },
    'oh-collaboration': { src: base('lecture-covers', 'one-health-oh-collaboration'), alt: 'ปกสไลด์ Collaboration and Partnership in One Health พื้นขาว กรอบฟ้า' },
  },
};

/** Every path this module can hand out — the lint walks exactly this. */
export function allArtPaths() {
  const out = new Set();
  const take = (v) => { if (typeof v === 'string') out.add(v); else if (v && v.src) out.add(v.src); };
  for (const group of [EMPTY_ART, SUBJECT_MOCHI, BADGE_ART, LOADING_ART, SEASONAL_MOCHI, GAME_ART]) {
    for (const v of Object.values(group)) take(v);
  }
  for (const v of IG_BACKGROUNDS) take(v);
  for (const subject of Object.values(LECTURE_COVERS)) for (const v of Object.values(subject)) take(v);
  return [...out];
}
