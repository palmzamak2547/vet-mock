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

/** Every path this module can hand out — the lint walks exactly this. */
export function allArtPaths() {
  const out = new Set();
  const take = (v) => { if (typeof v === 'string') out.add(v); else if (v && v.src) out.add(v.src); };
  for (const group of [EMPTY_ART, SUBJECT_MOCHI, BADGE_ART, LOADING_ART, SEASONAL_MOCHI, GAME_ART]) {
    for (const v of Object.values(group)) take(v);
  }
  for (const v of IG_BACKGROUNDS) take(v);
  return [...out];
}
