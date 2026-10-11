// ============================================================
// query-terms.js — how a student's question is read, before any corpus
// ============================================================
// The pieces of retrieval that do not need the corpus: Thai word
// segmentation, the words that carry the QUESTION rather than its content,
// the Thai <-> English names a student types for things the notes name in
// the other language, and the "facet" a question asks for (treatment,
// diagnosis, signs ...). Kept free of corpus imports on purpose, so the
// search palette can use the same reading of a query without downloading
// the knowledge base; retrieve.js adds the corpus and the glossary.
//
// Aliases name the SAME thing in two languages or registers (ลมชัก and
// seizure, ขี้เรื้อนเปียก and Demodex). They are vocabulary, not medicine:
// an alias never adds a fact, it only lets a question find the section that
// already states one. Every group must have at least one form that occurs in
// the governed corpus (tests/unit/vetwiki-ask-eval.test.mjs checks), so the
// table can only ever point at content that exists.
//
// Pure and deterministic.
// ============================================================

// Words that carry the QUESTION but not the CONTENT. Scoring on "ทำไม"
// would retrieve whichever section happens to explain the most things.
export const STOPWORDS = new Set([
  // Thai question/function words
  'ทำไม', 'อะไร', 'อย่างไร', 'ยังไง', 'ไหม', 'มั้ย', 'หรือ', 'หรือเปล่า', 'กี่',
  'ที่', 'ของ', 'ใน', 'และ', 'กับ', 'จาก', 'ให้', 'ได้', 'เป็น', 'มี', 'คือ',
  'ต้อง', 'ควร', 'เมื่อ', 'ถ้า', 'แล้ว', 'ก็', 'ด้วย', 'ไม่', 'ไป', 'มา', 'ถึง',
  'ครับ', 'ค่ะ', 'คะ', 'นะ', 'บ้าง', 'อัน', 'ตัว', 'การ', 'ความ', 'ช่วย',
  'อธิบาย', 'สรุป', 'บอก', 'ขอ', 'หน่อย', 'เกี่ยวกับ', 'เรื่อง',
  'เท่าไหร่', 'เท่าไร', 'ไหร่', 'แค่ไหน', 'เมื่อไหร่', 'เมื่อไร', 'ตอนไหน', 'ที่ไหน',
  'ไหน', 'ใด', 'หรือไม่', 'ได้ไหม', 'ป่ะ', 'มั๊ย', 'จะ', 'ว่า', 'โดย', 'นั้น', 'นี้',
  'อยาก', 'รู้', 'ทราบ', 'หน่อยครับ', 'หน่อยค่ะ', 'แบบ', 'อย่าง', 'ยัง', 'ทาง',
  'ต่างกัน', 'ต่าง', 'ระหว่าง', 'เหมือน', 'กัน', 'ไง',
  // English fillers
  'the', 'a', 'an', 'of', 'in', 'on', 'for', 'to', 'and', 'or', 'is', 'are',
  'what', 'why', 'how', 'when', 'which', 'does', 'do', 'can', 'about',
  'with', 'from', 'by', 'at', 'as', 'be', 'it', 'its', 'this', 'that', 'there',
  'please', 'explain', 'tell', 'me', 'give', 'list', 'show', 'versus', 'vs',
  'difference', 'differences', 'between', 'compare', 'should', 'would', 'could',
  'who', 'where', 'was', 'were', 'has', 'have', 'many', 'much', 'any', 'some',
]);

const THAI_RE = /[฀-๿]/;
const THAI_ONLY = /^[฀-๿]+$/;
const LATIN_TOKEN = /^[a-z0-9][a-z0-9.'-]*$/;

/** Lowercase, compose sara am, drop zero-width characters, collapse spaces. */
export function normalizeQuery(text) {
  return String(text || '')
    .normalize('NFC')
    .replace(/ํา/g, 'ำ') // nikhahit + sara aa → sara am
    .replace(/[​-‍﻿]/g, '')
    .toLowerCase()
    .replace(/[“”"«»]/g, ' ')
    .replace(/\s+/g, ' ')
    .trim();
}

// Question phrases the segmenter cuts into content-looking pieces: เท่าไหร่
// comes out as เท่า|ไหร่, and เท่า (times, equal) then matched every ratio
// in the corpus. Removed before segmentation, after the facets are read.
const QUESTION_PHRASES = /(เท่าไหร่|เท่าไร|เท่าใด|แค่ไหน|อย่างไร|ยังไง|ทำไม|หรือเปล่า|หรือไม่|ได้ไหม|ได้มั้ย|ไหม|มั้ย|มั๊ย|บ้าง|อะไร|ตอนไหน|ที่ไหน|เมื่อไหร่|เมื่อไร)(?![ัิ-ฺ็-๎])/g;

/** The normalized query without its question phrases. */
export function contentQuery(q) {
  return q.replace(QUESTION_PHRASES, ' ').replace(/\s+/g, ' ').trim();
}

let segmenterCache;
function segmenter() {
  if (segmenterCache !== undefined) return segmenterCache;
  try {
    segmenterCache = new Intl.Segmenter('th', { granularity: 'word' });
  } catch {
    segmenterCache = null; // no ICU: fall back to runs below
  }
  return segmenterCache;
}

/**
 * Word segments of a normalized query, with positions:
 * [{ word, start, end, wordLike }]. Without Intl.Segmenter the query splits
 * into runs of letters, which still keeps Latin terms and whole Thai runs.
 */
export function segmentWords(q) {
  const seg = segmenter();
  const out = [];
  if (seg) {
    for (const s of seg.segment(q)) {
      out.push({ word: s.segment, start: s.index, end: s.index + s.segment.length, wordLike: !!s.isWordLike });
    }
    return out;
  }
  const re = /[a-z0-9฀-๿][a-z0-9฀-๿.'-]*/g;
  for (let m = re.exec(q); m; m = re.exec(q)) {
    out.push({ word: m[0], start: m.index, end: m.index + m[0].length, wordLike: true });
  }
  return out;
}

export const isThai = (w) => THAI_ONLY.test(w);
export const hasThai = (w) => THAI_RE.test(w);
export const isLatin = (w) => LATIN_TOKEN.test(w);

// ── Aliases ──────────────────────────────────────────────────────────────
// One line per thing. A Latin form ending in * matches that stem plus any
// ending (vaccin* → vaccine, vaccination); other Latin forms match as whole
// words, with an optional plural. Thai forms match where the student's
// words begin and end, so ไต (kidney) never fires inside ไตรมาส.
export const ALIAS_GROUPS = [
  // animals
  ['สุนัข', 'หมา', 'dog', 'canine'],
  ['ลูกสุนัข', 'ลูกหมา', 'puppy', 'puppies'],
  ['แมว', 'cat', 'feline'],
  ['ลูกแมว', 'kitten'],
  ['โค', 'วัว', 'cow', 'cattle', 'bovine'],
  ['โคนม', 'วัวนม', 'dairy cow', 'dairy cattle', 'dairy'],
  ['ลูกโค', 'ลูกวัว', 'calf', 'calves'],
  ['สุกร', 'หมู', 'pig', 'swine', 'porcine'],
  ['ลูกสุกร', 'ลูกหมู', 'piglet'],
  ['ม้า', 'horse', 'equine'],
  ['ลูกม้า', 'foal'],
  ['แม่ม้า', 'mare'],
  ['พ่อม้า', 'stallion'],
  ['ไก่', 'chicken', 'broiler', 'layer'],
  ['สัตว์ปีก', 'poultry', 'avian'],
  ['นก', 'bird', 'avian'],
  ['เป็ด', 'duck'],
  ['กระต่าย', 'rabbit'],
  ['หนู', 'mouse', 'rat', 'rodent'],
  ['ปลา', 'fish'],
  ['กุ้ง', 'shrimp'],
  ['แพะ', 'goat'],
  ['แกะ', 'sheep'],
  ['เฟอร์เร็ต', 'ferret'],
  ['เต่า', 'turtle', 'tortoise'],
  ['งู', 'snake'],
  ['สัตว์ป่า', 'wildlife'],
  ['ค้างคาว', 'bat', 'bats'],
  ['ยุง', 'mosquito'],
  // body
  ['หัวใจ', 'heart', 'cardiac'],
  ['ปอด', 'lung', 'pulmonary'],
  ['ไต', 'kidney', 'renal'],
  ['ตับ', 'liver', 'hepatic'],
  ['ผิวหนัง', 'skin', 'derm*'],
  ['สมอง', 'brain', 'cerebr*'],
  ['ไขสันหลัง', 'spinal cord'],
  ['กระดูก', 'bone', 'ortho*'],
  ['ลำไส้', 'intestin*', 'bowel', 'enteric'],
  ['มดลูก', 'uterus', 'uterine'],
  ['รังไข่', 'ovary', 'ovarian'],
  ['เต้านม', 'udder', 'mammary'],
  ['ฟัน', 'teeth', 'tooth', 'dental'],
  ['กีบ', 'hoof', 'claw'],
  ['เลือด', 'blood'],
  ['ปัสสาวะ', 'ฉี่', 'urine', 'urinary'],
  ['อุจจาระ', 'feces', 'fecal', 'faeces'],
  ['น้ำนม', 'นม', 'milk'],
  ['เนื้อสัตว์', 'meat'],
  ['ไข่', 'egg', 'eggs'],
  ['ซาก', 'carcass'],
  // signs and words of the clinic
  ['อาการ', 'clinical sign', 'clinical signs', 'symptom', 'signs'],
  ['หวัด', 'upper respiratory', 'urt', 'uri', 'urti'],
  ['ชักต่อเนื่อง', 'ชักไม่หยุด', 'ชักติดกัน', 'status epilepticus', 'cluster seizure*'],
  ['นาที', 'minute*', 'min'],
  ['คำนวณ', 'calculat*', 'formula*'],
  ['ติดต่อสู่คน', 'ติดคน', 'สัตว์สู่คน', 'zoono*'],
  ['รักษา', 'การรักษา', 'treatment', 'treat*', 'therap*'],
  ['วินิจฉัย', 'การวินิจฉัย', 'diagnos*'],
  ['ป้องกัน', 'prevent*'],
  ['ติดต่อ', 'transmi*'],
  ['สาเหตุ', 'cause', 'etiolog*', 'aetiolog*'],
  ['วัคซีน', 'vaccin*'],
  ['ขนาดยา', 'dose', 'dosage'],
  ['ผ่าตัด', 'surgery', 'surgical'],
  ['วางยาสลบ', 'ดมยา', 'anesthe*', 'anaesthe*'],
  ['ยาซึม', 'sedat*'],
  ['ท้องเสีย', 'ท้องร่วง', 'diarrhea', 'diarrhoea'],
  ['อาเจียน', 'vomit*'],
  ['ไอ', 'cough*'],
  ['จาม', 'sneez*'],
  ['น้ำมูก', 'nasal discharge'],
  ['ไข้', 'fever', 'pyrexia'],
  ['ซีด', 'โลหิตจาง', 'anemia', 'anaemia'],
  ['ตัวเหลือง', 'ดีซ่าน', 'jaundice', 'icterus'],
  ['ชัก', 'seizure*', 'convuls*'],
  ['ลมชัก', 'โรคลมชัก', 'epilep*', 'seizure*'],
  ['ยากันชัก', 'antiepileptic*', 'anticonvulsant*', 'aed'],
  ['อัมพาต', 'paralysis', 'paralytic'],
  ['ขาเจ็บ', 'เดินกะเผลก', 'lameness', 'lame'],
  ['คลอด', 'parturition', 'calving', 'farrowing', 'whelping', 'foaling'],
  ['คลอดยาก', 'dystocia'],
  ['ตั้งท้อง', 'ตั้งครรภ์', 'pregnan*', 'gestation'],
  ['ผสมเทียม', 'artificial insemination'],
  ['น้ำเชื้อ', 'semen'],
  ['แช่แข็ง', 'frozen', 'freez*', 'cryopreserv*'],
  ['ทำหมัน', 'neuter*', 'spay*', 'castrat*', 'gonadectom*', 'ovariohysterectom*'],
  ['อัลตราซาวด์', 'อัลตร้าซาวด์', 'ultrasound', 'ultrasonograph*'],
  ['เอกซเรย์', 'เอ็กซเรย์', 'เอ็กซ์เรย์', 'radiograph*', 'x-ray'],
  ['กู้ชีพ', 'ปั๊มหัวใจ', 'cpr', 'cpcr', 'resuscitat*'],
  ['กดหน้าอก', 'chest compression*', 'compression*'],
  ['ช็อก', 'ช็อค', 'shock'],
  ['ฉุกเฉิน', 'emergenc*'],
  ['พยาธิ', 'parasit*', 'helminth*', 'worm*'],
  ['ถ่ายพยาธิ', 'ยาถ่ายพยาธิ', 'deworm*', 'anthelmintic*'],
  ['ไร', 'mite*'],
  ['เห็บ', 'tick*'],
  ['หมัด', 'flea*'],
  ['เชื้อรา', 'fung*', 'mycos*'],
  ['แบคทีเรีย', 'bacteri*'],
  ['ไวรัส', 'virus', 'viral'],
  ['โปรโตซัว', 'protozoa*'],
  ['ดื้อยา', 'เชื้อดื้อยา', 'resistan*', 'amr'],
  ['ยาปฏิชีวนะ', 'ยาฆ่าเชื้อ', 'antibiotic*', 'antimicrobial*'],
  ['ฆ่าเชื้อ', 'disinfect*'],
  ['ความปลอดภัยทางชีวภาพ', 'biosecurity'],
  ['ระยะ', 'phase*', 'stage*'],
  ['ระยะฟักตัว', 'incubation period'],
  ['อัตราตาย', 'mortality'],
  ['อัตราป่วย', 'morbidity'],
  ['ไฟเบอร์', 'เยื่อใย', 'fiber', 'fibre'],
  ['โปรตีน', 'protein'],
  ['แคลเซียม', 'calcium'],
  ['แอมโมเนีย', 'ammonia'],
  ['ไนไตรท์', 'ไนไตรต์', 'nitrite'],
  ['ออกซิเจน', 'oxygen'],
  ['อุณหภูมิ', 'temperature'],
  ['โพแทสเซียม', 'โปแตสเซียม', 'potassium', 'hyperkal*'],
  ['อินซูลิน', 'insulin'],
  ['สเตียรอยด์', 'steroid*', 'corticosteroid*', 'glucocorticoid*'],
  ['แอนติบอดี', 'antibod*'],
  ['ฮอร์โมน', 'hormon*'],
  ['ท่อปัสสาวะอุดตัน', 'urethral obstruction'],
  ['นิ่ว', 'urolith*', 'calculi'],
  ['โรงฆ่าสัตว์', 'slaughter*', 'abattoir'],
  ['ก่อนฆ่า', 'antemortem', 'ante-mortem'],
  ['หลังฆ่า', 'postmortem', 'post-mortem'],
  ['สอบสวนโรค', 'outbreak investigation'],
  ['เฝ้าระวัง', 'surveillance'],
  ['แหล่งรังโรค', 'reservoir*'],
  ['พาหะ', 'vector*', 'carrier*'],
  // diseases the way students say them
  ['พิษสุนัขบ้า', 'โรคพิษสุนัขบ้า', 'rabies'],
  ['หวัดแมว', 'feline upper respiratory', 'furi', 'frdc'],
  ['fhv', 'fhv-1', 'feline herpesvirus', 'feline viral rhinotracheitis'],
  ['fcv', 'feline calicivirus'],
  ['หัดสุนัข', 'ไข้หัดสุนัข', 'distemper', 'cdv'],
  ['พาร์โว', 'parvo*', 'cpv'],
  ['ไข้เห็บ', 'ehrlichi*', 'babesi*', 'anaplasm*', 'hepatozo*'],
  ['ขี้เรื้อน', 'mange', 'demodex', 'sarcopt*', 'scabies'],
  ['ขี้เรื้อนเปียก', 'demodex', 'demodic*'],
  ['ขี้เรื้อนแห้ง', 'sarcopt*', 'scabies'],
  ['กลาก', 'เชื้อราผิวหนัง', 'ringworm', 'dermatophyt*'],
  ['ภูมิแพ้ผิวหนัง', 'atopic', 'atopic dermatitis'],
  ['ฉี่หนู', 'ไข้ฉี่หนู', 'leptospir*', 'lepto'],
  ['วัวบ้า', 'โรควัวบ้า', 'bse', 'mad cow'],
  ['ปากและเท้าเปื่อย', 'ปากเท้าเปื่อย', 'fmd', 'foot-and-mouth', 'foot and mouth'],
  ['ไข้หวัดหมู', 'swine influenza', 'siv'],
  ['อหิวาต์สุกร', 'swine fever', 'csf', 'asf'],
  ['อหิวาต์ไก่', 'อหิวาต์สัตว์ปีก', 'fowl cholera'],
  ['ท้องอืด', 'bloat', 'tympany'],
  ['ปวดท้อง', 'colic', 'acute abdomen', 'abdominal pain'],
  ['โคลิก', 'colic'],
  ['ไตวาย', 'kidney failure', 'renal failure', 'aki', 'ckd'],
  ['ไตวายเฉียบพลัน', 'acute kidney injury', 'aki'],
  ['ไตวายเรื้อรัง', 'chronic kidney disease', 'ckd'],
  ['ตับอ่อนอักเสบ', 'pancreatitis'],
  ['หัวใจล้มเหลว', 'heart failure', 'chf'],
  ['มะเร็ง', 'cancer', 'neoplas*', 'carcinoma', 'sarcoma', 'lymphoma'],
  ['เนื้องอก', 'tumor*', 'tumour*', 'neoplas*'],
  ['ต้อกระจก', 'cataract*'],
  ['ต้อหิน', 'glaucoma'],
  ['แผลกระจกตา', 'corneal ulcer*'],
  ['หูอักเสบ', 'otitis'],
  ['ภูมิคุ้มกัน', 'immun*'],
  ['เกล็ดเลือดต่ำ', 'thrombocytopenia', 'itp'],
  ['เอดส์แมว', 'fiv'],
  ['ลิวคีเมียแมว', 'felv'],
  ['ไข้หวัดใหญ่', 'influenza'],
  ['โควิด', 'covid*', 'sars-cov-2'],
  ['นิปาห์', 'nipah'],
  ['อีโบลา', 'ebola'],
  ['แอนแทรกซ์', 'anthrax'],
  ['บรูเซลลา', 'บรูเซลโลซิส', 'brucell*'],
  ['วัณโรค', 'tuberculosis', 'mycobacter*'],
  ['ทอกโซพลาสมา', 'toxoplasm*'],
  ['พยาธิหนอนหัวใจ', 'heartworm', 'dirofilaria'],
];

// The animal a question is about narrows it, but never decides it: "สุนัข"
// in a question about wet mange must not bring up every canine article.
// Keyed by each group's first form, like GENERIC_ALIAS_HEADS below.
export const SPECIES_ALIAS_HEADS = new Set(ALIAS_GROUPS.slice(0, ALIAS_GROUPS.findIndex((g) => g[0] === 'หัวใจ')).map((g) => g[0]));

// Groups that say what KIND of answer is wanted (อาการ, รักษา ...) rather
// than what it is about. They still score, but never decide which articles
// are in play: "therapy" being rare-ish must not let every treatment section
// through for a question about FIP. Keyed by each group's first form.
export const GENERIC_ALIAS_HEADS = new Set([
  'อาการ', 'รักษา', 'วินิจฉัย', 'ป้องกัน', 'ติดต่อ', 'สาเหตุ', 'ขนาดยา', 'ระยะ', 'นาที', 'คำนวณ',
  'ผ่าตัด', 'ฉุกเฉิน', 'อุณหภูมิ',
]);

// ── Facets: what kind of answer the question wants ──────────────────────
// A question about treatment should land on the section headed Treatment of
// the right article, not on its definition just because the definition says
// the disease's name more often. The heading words are the ones VetWiki
// headings actually use, in both languages.
export const FACETS = [
  { id: 'treatment', q: /(รักษา|ให้ยา|ใช้ยา|ยาอะไร|ยาตัวไหน|ยาตัวใด|\btreat|\btherap|\btx\b|\bmanag)/, heading: ['treatment', 'tx', 'therapy', 'management', 'รักษา', 'drug'] },
  { id: 'diagnosis', q: /(วินิจฉัย|ตรวจ|\bdiagnos|\bdx\b|\btests?\b|\bdetect)/, heading: ['diagnos', 'dx', 'วินิจฉัย', 'ตรวจ', 'test', 'detection'] },
  { id: 'signs', q: /(อาการ|รอยโรค|\bsigns?\b|\bsymptom|\bpresentation)/, heading: ['clinical sign', 'sign', 'symptom', 'อาการ', 'รอยโรค', 'lesion'] },
  { id: 'cause', q: /(เกิดจาก|สาเหตุ|เชื้ออะไร|เชื้อตัวไหน|เชื้อชนิด|\bcaus|\betiolog|\baetiolog|\bagents?\b|\bpathogens?\b)/, heading: ['etiolog', 'aetiolog', 'agent', 'pathogen', 'cause', 'สาเหตุ', 'เชื้อ', 'serovar'] },
  { id: 'transmission', q: /(ติดต่อ|แพร่|\btransmi|\bspread)/, heading: ['transmission', 'การติดต่อ', 'ติดต่อ', 'route', 'โฮสต์', 'pathogenesis'] },
  { id: 'prevention', q: /(ป้องกัน|วัคซีน|\bprevent|\bvaccin|\bcontrol)/, heading: ['prevention', 'vaccin', 'วัคซีน', 'ป้องกัน', 'control', 'ควบคุม', 'biosecurity'] },
  { id: 'types', q: /(กี่ชนิด|กี่แบบ|กี่ประเภท|กี่ระยะ|กี่รูปแบบ|กี่กลุ่ม|ชนิด|ประเภท|แบ่ง|จำแนก|\btypes?\b|\bclassif|\bforms?\b|\bphases?\b|\bstages?\b)/, heading: ['classification', 'type', 'form', 'phase', 'stage', 'ชนิด', 'ประเภท', 'แบ่ง', 'จำแนก', 'รูปแบบ', 'ระยะ'] },
  { id: 'definition', q: /(คืออะไร|หมายถึง|นิยาม|ความหมาย|\bwhat is\b|\bdefin)/, heading: ['definition', 'overview', 'นิยาม', 'ความหมาย', 'คืออะไร', 'introduction'] },
  { id: 'steps', q: /(ขั้นตอน|\bsteps?\b|\bprocedure|\bworkflow|\bprotocol)/, heading: ['step', 'ขั้นตอน', 'workflow', 'procedure', 'protocol'] },
  { id: 'compare', q: /(ต่างกัน|ต่างจาก|แตกต่าง|เปรียบเทียบ|แยก.{0,30}(?:กับ|จาก)|\bvs\.?\b|\bversus\b|\bdifferen|\bcompar)/, heading: ['vs', 'เปรียบเทียบ', 'comparison', 'differential', 'ต่าง', 'แยก'] },
  { id: 'dose', q: /(ขนาดยา|โดส|\bdoses?\b|\bdosage|mg\/kg)/, heading: ['dose', 'dosage', 'ขนาด'] },
];

/** The facets a normalized question asks for, in FACETS order. */
export function questionFacets(q) {
  return FACETS.filter((f) => f.q.test(q));
}

// ── Latin word matching ──────────────────────────────────────────────────
const escapeRe = (t) => t.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
const INFLECTION = /(ations?|ings?|ied|ies|ed|es|s)$/;
const ENDINGS = '(?:e|es|s|ed|ing|ings|ion|ions|ation|ations|ic|tic|tics|is|ia|y|ies|al)?';

/** Base form of a Latin word for matching: diagnosed → diagnos, cats → cat. */
export function latinBase(word) {
  if (word.length < 4 || /\d/.test(word)) return word;
  const m = word.length >= 5 ? word.match(INFLECTION) : null;
  if (m && word.length - m[0].length >= 4) return word.slice(0, -m[0].length);
  if (word.endsWith('s') && !word.endsWith('ss') && word.length - 1 >= 3) return word.slice(0, -1);
  return word;
}

/**
 * A word-boundary pattern for one Latin form. `stem*` matches the stem plus
 * any letters; a short code (3 letters or fewer: PED, BSE, FMD) only matches
 * itself, so PED never rides on "peds"; anything else matches its base form
 * plus a common ending.
 */
export function latinPattern(form) {
  const word = (w) => (w.endsWith('*') ? `${escapeRe(w.slice(0, -1))}[a-z0-9-]*` : escapeRe(w));
  if (/\s/.test(form)) {
    const parts = form.split(/\s+/);
    const tail = parts[parts.length - 1].endsWith('*') ? '' : '(?:s|es)?\\b';
    return `\\b${parts.map(word).join('[\\s-]+')}${tail}`;
  }
  if (form.endsWith('*')) return `\\b${word(form)}`;
  if (form.length <= 3 || /\d/.test(form)) return `\\b${escapeRe(form)}\\b`;
  return `\\b${escapeRe(latinBase(form))}${ENDINGS}\\b`;
}

/** The literal text a Latin form must contain, used to skip a regex that cannot match. */
export function latinProbe(form) {
  const first = form.split(/\s+/)[0].replace(/\*$/, '');
  if (form.endsWith('*') || /\s/.test(form) || form.length <= 3 || /\d/.test(form)) return first;
  return latinBase(first);
}
